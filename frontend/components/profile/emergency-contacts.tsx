"use client";

import { Phone } from "lucide-react";

interface EmergencyContactsProps {
  primaryContact?: string;
  secondaryContact?: string;
}

export function EmergencyContacts({
  primaryContact,
  secondaryContact,
}: EmergencyContactsProps) {
  if (!primaryContact && !secondaryContact) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-muted rounded-lg">
          <Phone size={20} className="text-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Emergency Contacts
          </h3>
          <p className="text-sm text-muted-foreground">
            Your saved emergency numbers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {primaryContact && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
            <div className="p-2 bg-background rounded-md">
              <Phone size={14} className="text-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">
                Primary Contact
              </p>
              <p className="text-sm font-medium text-foreground">
                {primaryContact}
              </p>
            </div>
          </div>
        )}
        {secondaryContact && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
            <div className="p-2 bg-background rounded-md">
              <Phone size={14} className="text-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">
                Secondary Contact
              </p>
              <p className="text-sm font-medium text-foreground">
                {secondaryContact}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
