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

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return NextResponse.json(
        { error: 'Emergency service not configured' },
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

    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('emergency_phone_1, emergency_phone_2')
      .eq('id', user.id)
      .single();

    let emergencyNumber1: string | null = null;
    let emergencyNumber2: string | null = null;

    if (dbError || !userData) {
      emergencyNumber1 = user.user_metadata?.emergency_phone_1 || null;
      emergencyNumber2 = user.user_metadata?.emergency_phone_2 || null;
    } else {
      emergencyNumber1 = userData.emergency_phone_1;
      emergencyNumber2 = userData.emergency_phone_2;
    }

    if (!emergencyNumber1 && !emergencyNumber2) {
      return NextResponse.json(
        { error: 'No emergency contacts configured. Please add emergency contacts in your profile.' },
        { status: 400 }
      );
    }

    // Validate phone numbers are in E.164 format (+[country code][number])
    const validateE164 = (phone: string) => /^\+[1-9]\d{1,14}$/.test(phone);
    
    const validNumbers: string[] = [];
    if (emergencyNumber1 && validateE164(emergencyNumber1)) {
      validNumbers.push(emergencyNumber1);
    }
    
    if (emergencyNumber2 && validateE164(emergencyNumber2)) {
      validNumbers.push(emergencyNumber2);
    }

    if (validNumbers.length === 0) {
      return NextResponse.json(
        { error: 'No valid emergency contacts found. Phone numbers must be in E.164 format (e.g., +1234567890).' },
        { status: 400 }
      );
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
      minute: '2-digit'
    });

    // Simple, clean SMS message without emojis (some carriers block emojis)
    const smsMessage = `EMERGENCY ALERT!

Your contact needs IMMEDIATE help!

Location: ${locationUrl}

Time: ${currentTime}

This is a REAL EMERGENCY. Please:
1. Call them NOW
2. Check their location
3. Contact emergency services

Time is critical!`;

    const smsPromises = validNumbers.map(async (toNumber) => {
      try {
        const message = await client.messages.create({
          body: smsMessage,
          from: twilioPhoneNumber,
          to: toNumber,
        });
        return { success: true, to: toNumber, sid: message.sid };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, to: toNumber, error: errorMessage };
      }
    });

    const callPromises = validNumbers.map(async (toNumber) => {
      try {
        const call = await client.calls.create({
          twiml: `<Response>
            <Say voice="alice" language="en-US">
              Emergency Alert! Emergency Alert! 
              Your contact has pressed the emergency button and needs immediate help.
              Please check your text messages right now for their exact location.
            </Say>
            <Pause length="1"/>
            <Say voice="alice" language="en-US">
              I repeat: Your contact has pressed the emergency button.
              Their current location has been sent to you via S M S text message.
              Please go to their location immediately or call emergency services.
              This is an urgent emergency. Please respond now.
            </Say>
          </Response>`,
          from: twilioPhoneNumber,
          to: toNumber,
        });
        return { success: true, to: toNumber, sid: call.sid };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, to: toNumber, error: errorMessage };
      }
    });

    const [smsResults, callResults] = await Promise.all([
      Promise.all(smsPromises),
      Promise.all(callPromises),
    ]);

    const smsSuccess = smsResults.some(result => result.success);
    const callSuccess = callResults.some(result => result.success);

    if (!smsSuccess && !callSuccess) {
      return NextResponse.json(
        {
          error: 'Failed to send emergency notifications',
          details: { sms: smsResults, calls: callResults }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Emergency notifications sent',
      location: {
        latitude: roundedLat,
        longitude: roundedLon,
        url: locationUrl
      },
      sms: smsResults,
      calls: callResults,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process emergency request', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}