import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit: 3 requests per 5 minutes per IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes

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
    // Validate environment variables (only Twilio credentials needed)
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error('Missing required Twilio environment variables');
      return NextResponse.json(
        { error: 'Emergency service not configured' },
        { status: 500 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authenticated user
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

    // Get user's emergency contacts from database
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('emergency_phone_1, emergency_phone_2')
      .eq('id', user.id)
      .single();

    let emergencyNumber1: string | null = null;
    let emergencyNumber2: string | null = null;

    if (dbError || !userData) {
      // Fallback to user metadata
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

    // Get client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many emergency requests. Please wait before trying again.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { latitude, longitude, userMessage } = body;

    // Validate input
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Location data is required' },
        { status: 400 }
      );
    }

    // Validate latitude and longitude ranges
    if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
        latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid location coordinates' },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Create location URL (Google Maps link)
    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Create SMS message
    const smsMessage = `🚨 EMERGENCY ALERT 🚨\n\n${userMessage || 'Emergency assistance needed!'}\n\nLocation: ${locationUrl}\n\nCoordinates: ${latitude}, ${longitude}\n\nTime: ${new Date().toLocaleString()}`;

    // Filter out null contacts and send SMS to available emergency contacts
    const contactNumbers = [emergencyNumber1, emergencyNumber2].filter((num): num is string => num !== null);
    
    const smsPromises = contactNumbers.map(async (toNumber) => {
      try {
        const message = await client.messages.create({
          body: smsMessage,
          from: twilioPhoneNumber,
          to: toNumber,
        });
        return { success: true, to: toNumber, sid: message.sid };
      } catch (error: any) {
        console.error(`Failed to send SMS to ${toNumber}:`, error);
        return { success: false, to: toNumber, error: error.message };
      }
    });

    // Make calls to available emergency contacts simultaneously
    const callPromises = contactNumbers.map(async (toNumber) => {
      try {
        const call = await client.calls.create({
          // TwiML to say an emergency message
          twiml: `<Response>
            <Say voice="alice" language="en-US">
              Emergency Alert! This is an automated emergency call. 
              The user has requested emergency assistance. 
              Please check your text messages for the exact location details.
            </Say>
            <Pause length="2"/>
            <Say voice="alice" language="en-US">
              Location coordinates have been sent via S M S. 
              This call will now end. Please respond immediately.
            </Say>
          </Response>`,
          from: twilioPhoneNumber,
          to: toNumber,
        });
        return { success: true, to: toNumber, sid: call.sid };
      } catch (error: any) {
        console.error(`Failed to call ${toNumber}:`, error);
        return { success: false, to: toNumber, error: error.message };
      }
    });

    // Wait for all operations to complete
    const [smsResults, callResults] = await Promise.all([
      Promise.all(smsPromises),
      Promise.all(callPromises),
    ]);

    // Check if at least one SMS and one call succeeded
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
      sms: smsResults,
      calls: callResults,
    });

  } catch (error: any) {
    console.error('Emergency API error:', error);
    return NextResponse.json(
      { error: 'Failed to process emergency request', details: error.message },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
