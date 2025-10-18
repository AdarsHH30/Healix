import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    // CRITICAL: For Twilio free tier, you MUST have a verified number
    // This is the number that will actually receive the call/SMS
    const verifiedEmergencyNumber = process.env.TWILIO_VERIFIED_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return NextResponse.json(
        { error: 'Emergency service not configured' },
        { status: 500 }
      );
    }

    if (!verifiedEmergencyNumber) {
      return NextResponse.json(
        { error: 'No verified emergency number configured. Please add TWILIO_VERIFIED_NUMBER to your environment variables.' },
        { status: 500 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get user's emergency contacts (for display in message only)
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('emergency_phone_1, emergency_phone_2, full_name')
      .eq('id', user.id)
      .single();

    let emergencyNumber1: string | null = null;
    let emergencyNumber2: string | null = null;
    let userName = user.email || 'Unknown User';

    if (dbError || !userData) {
      emergencyNumber1 = user.user_metadata?.emergency_phone_1 || null;
      emergencyNumber2 = user.user_metadata?.emergency_phone_2 || null;
      userName = user.user_metadata?.full_name || user.email || 'Unknown User';
    } else {
      emergencyNumber1 = userData.emergency_phone_1;
      emergencyNumber2 = userData.emergency_phone_2;
      userName = userData.full_name || user.email || 'Unknown User';
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many emergency requests. Please wait before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Support both flat and nested location objects
    let latitude: number | undefined;
    let longitude: number | undefined;
    
    if (typeof body.latitude !== 'undefined' && typeof body.longitude !== 'undefined') {
      latitude = typeof body.latitude === 'string' ? parseFloat(body.latitude) : body.latitude;
      longitude = typeof body.longitude === 'string' ? parseFloat(body.longitude) : body.longitude;
    } else if (body.location && typeof body.location.latitude !== 'undefined' && typeof body.location.longitude !== 'undefined') {
      latitude = typeof body.location.latitude === 'string' ? parseFloat(body.location.latitude) : body.location.latitude;
      longitude = typeof body.location.longitude === 'string' ? parseFloat(body.location.longitude) : body.location.longitude;
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Location data is required and must be valid numbers (latitude, longitude).' },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid location coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.' },
        { status: 400 }
      );
    }

    // Round coordinates to 6 decimal places for accuracy (~10cm precision)
    const roundedLat = Math.round(latitude * 1e6) / 1e6;
    const roundedLon = Math.round(longitude * 1e6) / 1e6;

    const client = twilio(accountSid, authToken);
    
    // Create Google Maps URL with the actual user coordinates
    const locationUrl = `https://www.google.com/maps?q=${roundedLat},${roundedLon}`;

    // Get current time in IST
    const currentTime = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Build list of user's intended contacts for the message
    const intendedContacts = [emergencyNumber1, emergencyNumber2]
      .filter(Boolean)
      .join(', ') || 'Not specified';

    // Enhanced SMS message with user info
    const smsMessage = `EMERGENCY ALERT!

User: ${userName}
Time: ${currentTime}

IMMEDIATE HELP NEEDED!

Location: ${locationUrl}

Intended Emergency Contacts: ${intendedContacts}

USER PRESSED THE EMERGENCY BUTTON

Please:
1. Call the user immediately
2. Check their location above
3. Contact emergency services if needed

This is a REAL EMERGENCY!`;

    // Enhanced TwiML for voice call
    const callTwiml = `<Response>
      <Say voice="alice" language="en-US">
        Emergency Alert! Emergency Alert! 
        User ${userName} has pressed the emergency button and needs immediate help.
        Please check your text messages right now for their exact location and contact information.
      </Say>
      <Pause length="1"/>
      <Say voice="alice" language="en-US">
        I repeat: ${userName} has activated an emergency alert.
        Their current location and emergency contact numbers have been sent to you via S M S text message.
        Please respond immediately. This is an urgent emergency.
      </Say>
      <Pause length="1"/>
      <Say voice="alice" language="en-US">
        Check your S M S now for location details. Time is critical.
      </Say>
    </Response>`;

    // IMPORTANT: Always send to the verified number (Twilio free tier requirement)
    // The user's entered numbers are included in the MESSAGE CONTENT only
    try {
      // Send SMS to verified number
      const smsResult = await client.messages.create({
        body: smsMessage,
        from: twilioPhoneNumber,
        to: verifiedEmergencyNumber,
      });

      // Make call to verified number
      const callResult = await client.calls.create({
        twiml: callTwiml,
        from: twilioPhoneNumber,
        to: verifiedEmergencyNumber,
      });

      return NextResponse.json({
        success: true,
        message: 'Emergency notification sent to verified contact',
        location: {
          latitude: roundedLat,
          longitude: roundedLon,
          url: locationUrl
        },
        sms: [{
          success: true,
          to: verifiedEmergencyNumber,
          sid: smsResult.sid
        }],
        calls: [{
          success: true,
          to: verifiedEmergencyNumber,
          sid: callResult.sid
        }],
        note: 'Free tier: Call/SMS sent to verified number. User contacts included in message.'
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Twilio error:', errorMessage);
      
      return NextResponse.json(
        {
          error: 'Failed to send emergency notifications',
          details: errorMessage,
          hint: 'Verify that TWILIO_VERIFIED_NUMBER is correct and verified in your Twilio console'
        },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Emergency API error:', errorMessage);
    
    return NextResponse.json(
      { error: 'Failed to process emergency request', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}