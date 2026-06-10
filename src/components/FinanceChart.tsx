import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";
import { formatXOF } from "@/lib/store";

interface FinanceChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function FinanceChart({ data }: FinanceChartProps) {
  return (
    <Card className="overflow-hidden rounded-[2rem] shadow-elegant border-slate-800/70 bg-card/90 backdrop-blur-xl">
      <CardHeader className="flex items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <TrendingUp className="h-5 w-5 text-primary" /> Finances
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Performance et état des paiements</p>
        </div>
        <BarChart3 className="h-5 w-5 text-muted-foreground opacity-50" />
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-2xl border bg-background/95 p-3 shadow-elegant">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {payload[0].payload.name}
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground">
                          {formatXOF(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                radius={[12, 12, 0, 0]}
                barSize={44}
                animationDuration={1500}
                animationBegin={200}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
