"use client";

import { getSales } from "@/lib/api";
import type { SalesOrder } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DEC = new Intl.NumberFormat("pt-BR", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export default function SalesByHourChart() {
  const [rows, setRows] = useState<SalesOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const load = async (signal?: AbortSignal) => {
    try {
      const data = await getSales(5000);
      if (signal?.aborted) return;
      setRows(data);
      setError(null);
    } catch (e: any) {
      if (signal?.aborted) return;
      setError(e?.message ?? "Erro ao carregar faturamento por hora");
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    timer.current = setInterval(() => load(ctrl.signal), 15_000);
    return () => {
      ctrl.abort();
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const data = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const buckets: Record<string, number> = Object.fromEntries(
      Array.from({ length: 24 }, (_, h) => [h.toString().padStart(2, "0"), 0])
    );

    for (const r of rows) {
      const dt = new Date(r.createdAt);
      if (dt.getTime() >= start.getTime()) {
        const key = dt.getHours().toString().padStart(2, "0");
        buckets[key] += normalizeNumber(r.totalAmount as unknown as number);
      }
    }

    return Object.entries(buckets).map(([hour, total]) => ({
      hour: `${hour}:00`,
      total: Number(total.toFixed(2)),
    }));
  }, [rows]);

  return (
    <section className="rounded-2xl border card p-6 flex flex-col items-center">
      <div className="text-lg font-semibold mb-4 tracking-tight flex items-center gap-2">
        <span>Faturamento por hora</span>
        <span className="chip">hoje</span>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        {error && <div className="text-sm text-red-500">{error}</div>}
        {!error && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#cbd5e1" }} />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickFormatter={(v) => DEC.format(Number(v))}
              />
              <Tooltip
                formatter={(value) => [DEC.format(Number(value)), "Total"]}
                labelFormatter={(label) => `Hora: ${label}`}
                contentStyle={{ background: "var(--card-bg)", borderRadius: 8, border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                wrapperStyle={{ zIndex: 20 }}
              />
              <Bar dataKey="total" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

function normalizeNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  if (v && typeof v === "object") {
    const anyV = v as any;
    if (typeof anyV.value !== "undefined") return Number(anyV.value);
    if (typeof anyV.unscaledValue !== "undefined" && typeof anyV.scale !== "undefined") {
      const unscaled = Number(anyV.unscaledValue);
      const scale = Number(anyV.scale);
      return unscaled / Math.pow(10, scale);
    }
  }
  return 0;
}
