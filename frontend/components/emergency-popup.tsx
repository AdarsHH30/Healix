"use client";

import { X } from "lucide-react";
import { EmergencyButton } from "./emergency-button";

interface EmergencyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyPopup({ isOpen, onClose }: EmergencyPopupProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Content */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                🚨 Emergency Alert
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This will immediately call two emergency contacts and send them
                your current location via SMS.
              </p>
            </div>

            {/* Emergency Button */}
            <div className="pt-2">
              <EmergencyButton />
            </div>

            {/* Warning */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                ⚠️ <strong>Important:</strong> This feature is for real
                emergencies only. Misuse may result in unnecessary panic and
                could be considered a false alarm.
              </p>
            </div>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>What happens:</strong>
                <br />
                1. Your location will be captured automatically
                <br />
                2. Two emergency contacts will be called simultaneously
                <br />
                3. An SMS with your location link will be sent to both contacts
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
