"use client";

interface StatCardProps {
  value: string;
  label: string;
  color: "primary" | "accent" | "secondary";
  delay?: number;
}

function StatCard({ value, label, color, delay = 0 }: StatCardProps) {
  const colorClasses = {
    primary: "text-primary hover:border-primary/50",
    accent: "text-accent hover:border-accent/50",
    secondary: "text-secondary hover:border-secondary/50",
  };

  return (
    <div
      className={`rounded-2xl bg-card/60 backdrop-blur-sm border border-border p-6 text-center hover:bg-card/90 hover:shadow-lg hover:scale-105 ${colorClasses[color]} transition-all duration-300`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`text-3xl font-bold ${
          colorClasses[color].split(" ")[0]
        } mb-2`}
      >
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatsDisplay() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
      <StatCard
        value="24/7"
        label="Emergency Support"
        color="primary"
        delay={0}
      />
      <StatCard
        value="AI"
        label="First Aid Assistant"
        color="accent"
        delay={75}
      />
      <StatCard
        value="Map"
        label="Hospital Locator"
        color="secondary"
        delay={150}
      />
      <StatCard
        value="Instant"
        label="Emergency Contacts"
        color="primary"
        delay={225}
      />
    </div>
  );
}
