import React from "react";
import { Loader2 } from "lucide-react";

type StatItem = {
  label: string;
  value: string | number;
  loading?: boolean;
};

type HeroHeaderProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  stats?: StatItem[];
  gradient?: string;
  actions?: React.ReactNode;
  loading?: boolean;
};

const HeroHeader: React.FC<HeroHeaderProps> = ({
  title,
  subtitle,
  badge = "Overview",
  stats = [],
  gradient = "from-blue-600 via-indigo-600 to-blue-400",
  actions,
  loading = false,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-8 text-white  shadow-blue-500/25`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-white/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-white/20 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hover Effect - Subtle expansion */}
      <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-700 group-hover:scale-150" />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          {/* Left Content */}
          <div>
            {badge && (
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-1 bg-white/50 rounded-full" />
                <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                  {badge}
                </p>
              </div>
            )}
            <h1 className="text-3xl font-bold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-white/80">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Section (stats OR actions OR both) */}
          <div className="flex items-center gap-4">
            
            {/* Stats */}
            {stats.length > 0 && (
              <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                {stats.map((stat, index) => (
                  <React.Fragment key={index}>
                    <div className="text-center">
                      {loading || stat.loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-2xl font-bold">--</p>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold">
                          {typeof stat.value === "number"
                            ? stat.value.toLocaleString()
                            : stat.value}
                        </p>
                      )}
                      <p className="text-xs text-white/70">{stat.label}</p>
                    </div>

                    {index !== stats.length - 1 && (
                      <div className="h-8 w-px bg-white/20" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Actions */}
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroHeader;