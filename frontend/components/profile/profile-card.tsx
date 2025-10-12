"use client";

import {
  User,
  Mail,
  Calendar,
  LogOut,
  Upload as UploadIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

interface ProfileCardProps {
  profile: UserProfile;
  onLogout: () => void;
}

export function ProfileCard({ profile, onLogout }: ProfileCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    return profile?.email.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-foreground text-2xl font-semibold border-2">
            {getInitials()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background" />
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {profile?.full_name || "User"}
            </h2>
            <p className="text-sm text-muted-foreground">Active Member</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} className="flex-shrink-0" />
              <span className="truncate">{profile?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} className="flex-shrink-0" />
              <span>Since {formatDate(profile?.created_at || "")}</span>
            </div>
            {profile?.first_name && profile?.last_name && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
                <User size={14} className="flex-shrink-0" />
                <span>
                  {profile.first_name} {profile.last_name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <Button
            onClick={() => router.push("/upload")}
            className="w-full md:w-auto gap-2"
            size="sm"
          >
            <UploadIcon size={14} />
            Upload Exercise
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="w-full md:w-auto gap-2"
          >
            <LogOut size={14} />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
