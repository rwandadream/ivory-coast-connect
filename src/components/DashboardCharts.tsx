import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-3xl border border-slate-700/90 bg-card/95 p-3 text-sm text-foreground shadow-elegant">
      <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Mois</p>
      <p className="mt-1 font-semibold text-foreground">{label}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {payload[0].name}: {payload[0].value}
      </p>
    </div>
  );
}

export default function DashboardCharts({
  enrollmentData,
}: {
  enrollmentData: { name: string; count: number }[];
}) {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const memoData = useMemo(() => enrollmentData, [enrollmentData]);

  if (!isMounted) return <div className="h-56 w-full bg-slate-900/20 animate-pulse rounded-2xl" />;

  return (
    <Card className="overflow-hidden rounded-[2rem] shadow-elegant border border-slate-700/70 bg-card/90 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-[0.24em] text-foreground">
          Évolution des inscriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="h-56 p-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={memoData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.24} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.18)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              width={30}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#fb923c", strokeWidth: 2, opacity: 0.25 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#fb923c"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
