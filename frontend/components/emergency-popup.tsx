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
      {/* Clean backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fade-in"
        onClick={onClose}
      />

      {/* Clean modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="clean-card max-w-lg w-full p-8 animate-scale-in">
          {/* Clean header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Emergency Alert
                </h2>
                <p className="text-sm text-muted-foreground">
                  Immediate emergency response
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Clean description */}
          <div className="mb-6">
            <p className="text-base text-foreground mb-4">
              This will immediately call two emergency contacts and send them
              your current location via SMS.
            </p>
          </div>

          {/* Emergency Button */}
          <div className="mb-6">
            <EmergencyButton />
          </div>

          {/* Clean info cards */}
          <div className="space-y-4">
            {/* Important notice */}
            <div className="bg-amber-50 dark:bg-amber-950/50 border-l-4 border-amber-400 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                    Important
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    This feature is for real emergencies only. Misuse may result
                    in unnecessary panic and could be considered a false alarm.
                  </p>
                </div>
              </div>
            </div>

            {/* Process info */}
            <div className="bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-400 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">?</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    What happens:
                  </h4>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </span>
                      Your location will be captured automatically
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </span>
                      Two emergency contacts will be called simultaneously
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </span>
                      An SMS with your location link will be sent to both
                      contacts
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
