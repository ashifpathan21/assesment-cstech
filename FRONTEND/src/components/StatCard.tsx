import { cn } from "../lib/utils";
import Card from "./Card";

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color = "indigo",
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: "indigo" | "green" | "blue" | "orange" | "purple";
}) => {
  const colorClasses = {
    indigo: "bg-primary/10 text-primary",
    green: "bg-green-500/10 text-green-600",
    blue: "bg-blue-500/10 text-blue-600",
    orange: "bg-orange-500/10 text-orange-600",
    purple: "bg-purple-500/10 text-purple-600",
  };

  return (
    <Card hoverable className="p-6 overflow-hidden relative group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                colorClasses[color],
              )}
            >
              {Icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-bold tracking-tight text-foreground">{value}</p>
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground/80 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Decorative background element */}
      <div className={cn(
        "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40",
        colorClasses[color].split(' ')[0]
      )} />
    </Card>
  );
};

export default StatCard;
