"use client";

import React, { useState } from "react";
import { Phone, X } from "lucide-react";

interface EmergencyContact {
  number: string;
  displayNumber: string;
  label?: string;
}

interface CallNowButtonProps {
  emergencyContacts?: EmergencyContact[];
  phoneNumber?: string;
  displayNumber?: string;
  className?: string;
  showText?: boolean;
}

export default function CallNowButton({
  emergencyContacts = [],
  phoneNumber = "+919876543210",
  displayNumber = "+91 9876543210",
  className = "",
  showText = true,
}: CallNowButtonProps) {
  const [showDesktopMessage, setShowDesktopMessage] = useState(false);
  const [showContactList, setShowContactList] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);

  // Use emergency contacts if available, otherwise use default phone number
  const contacts: EmergencyContact[] =
    emergencyContacts.length > 0
      ? emergencyContacts
      : [{ number: phoneNumber, displayNumber: displayNumber, label: "Emergency Contact" }];

  const handleCall = (contact: EmergencyContact) => {
    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Close the contact list
    setShowContactList(false);
    
    // Save selected contact for desktop message
    setSelectedContact(contact);

    if (isMobile) {
      // On mobile, open phone dialer
      window.location.href = `tel:${contact.number}`;
    } else {
      // On desktop, show confirmation message
      setShowDesktopMessage(true);
      setTimeout(() => setShowDesktopMessage(false), 3000);
    }
  };

  const handleButtonClick = () => {
    // Always show selection menu to let user choose
    setShowContactList(!showContactList);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleButtonClick}
        className={`
          flex items-center gap-2 px-6 py-3 
          bg-green-600 hover:bg-green-700 
          text-white font-semibold rounded-lg 
          shadow-lg hover:shadow-xl 
          transition-all duration-200 
          active:scale-95
          ${className}
        `}
        aria-label="Call now"
      >
        <Phone className="w-5 h-5" strokeWidth={2} />
        {showText && <span className="font-medium hidden sm:inline">Call</span>}
      </button>

      {/* Contact selection menu - always show when list is open */}
      {showContactList && (
        <div
          className="
            absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
            bg-white dark:bg-gray-800 rounded-lg 
            shadow-xl z-50 min-w-[250px]
            animate-fade-in border border-gray-200 dark:border-gray-700
          "
        >
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {contacts.length > 1 ? "Select Contact to Call" : "Confirm Call"}
              </span>
              <button
                onClick={() => setShowContactList(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {contacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => handleCall(contact)}
                className="
                  w-full flex items-center gap-3 px-3 py-3 
                  text-left rounded-md
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-colors
                "
              >
                <Phone className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  {contact.label && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {contact.label}
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {contact.displayNumber}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {/* Arrow pointing up */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white dark:border-b-gray-800" />
        </div>
      )}

      {/* Desktop message popup - shows selected contact info */}
      {showDesktopMessage && selectedContact && (
        <div
          className="
            absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
            px-4 py-3 bg-gray-900 text-white text-sm rounded-lg 
            shadow-xl z-50 whitespace-nowrap
            animate-fade-in
          "
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">
                {selectedContact.label || "Contact"}
              </span>
            </div>
            <span className="text-xs opacity-90">
              Call {selectedContact.displayNumber}
            </span>
          </div>
          {/* Arrow pointing up */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-900" />
        </div>
      )}
    </div>
  );
}

