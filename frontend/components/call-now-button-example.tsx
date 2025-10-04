/**
 * CallNowButton Component - Usage Examples
 * 
 * This file demonstrates different ways to use the CallNowButton component.
 * You can copy these examples into your pages.
 */

import CallNowButton from './call-now-button';

export function CallNowButtonExamples() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">CallNowButton Examples</h1>

      {/* Example 1: Default green button */}
      <div>
        <h2 className="text-xl font-semibold mb-3">1. Default Green Button</h2>
        <CallNowButton 
          phoneNumber="+919876543210"
          displayNumber="+91 9876543210"
        />
      </div>

      {/* Example 2: Custom styled button (emergency red) */}
      <div>
        <h2 className="text-xl font-semibold mb-3">2. Emergency Red Button</h2>
        <CallNowButton 
          phoneNumber="+919876543210"
          displayNumber="+91 9876543210"
          className="!bg-red-600 hover:!bg-red-700"
        />
      </div>

      {/* Example 3: Minimal button (icon only) */}
      <div>
        <h2 className="text-xl font-semibold mb-3">3. Icon Only Button</h2>
        <CallNowButton 
          phoneNumber="+919876543210"
          displayNumber="+91 9876543210"
          showText={false}
          className="!px-3 !py-3"
        />
      </div>

      {/* Example 4: Styled to match header (like in dashboard) */}
      <div>
        <h2 className="text-xl font-semibold mb-3">4. Header Style (Dashboard Style)</h2>
        <CallNowButton 
          phoneNumber="+919876543210"
          displayNumber="+91 9876543210"
          className="!px-4 !py-2.5 !bg-transparent !text-foreground/70 hover:!text-foreground hover:!bg-muted/50 !shadow-none hover:!shadow-none !rounded-xl"
          showText={true}
        />
      </div>

      {/* Example 5: Large button for hero sections */}
      <div>
        <h2 className="text-xl font-semibold mb-3">5. Large Hero Button</h2>
        <CallNowButton 
          phoneNumber="+919876543210"
          displayNumber="+91 9876543210"
          className="!px-8 !py-4 !text-lg"
        />
      </div>

      {/* Example 6: Custom phone number */}
      <div>
        <h2 className="text-xl font-semibold mb-3">6. Different Phone Number</h2>
        <CallNowButton 
          phoneNumber="+911234567890"
          displayNumber="+91 123 456 7890"
        />
      </div>
    </div>
  );
}

/**
 * How to use in your pages:
 * 
 * 1. Import the component:
 *    import CallNowButton from '@/components/call-now-button';
 * 
 * 2. Add it to your JSX:
 *    <CallNowButton 
 *      phoneNumber="+919876543210"
 *      displayNumber="+91 9876543210"
 *    />
 * 
 * Props:
 * - phoneNumber: The actual phone number to call (tel: link format)
 * - displayNumber: The formatted number shown in the desktop message
 * - className: Custom Tailwind classes (use ! prefix to override defaults)
 * - showText: Whether to show text label (default: true)
 * 
 * Behavior:
 * - Mobile: Opens phone dialer when clicked
 * - Desktop: Shows a tooltip with the phone number for 3 seconds
 */
