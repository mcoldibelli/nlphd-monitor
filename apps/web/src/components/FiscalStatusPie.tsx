"use client";

import { getMetrics } from "@/lib/api";
import type { MetricsOverviewDto } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = [ "var(--ok)", "var(--warn)", "var(--danger)" ] as const;

export default function FiscalStatusPie() {
  const [data, setData] = useState<MetricsOverviewDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const load = async (signal?: AbortSignal) => {
    try {
      const res = await getMetrics();
      if (signal?.aborted) return;
      setData(res);
      setError(null);
    } catch (e: any) {
      if (signal?.aborted) return;
      setError(e?.message ?? "Erro ao carregar status fiscal");
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    timer.current = setInterval(() => load(ctrl.signal), 10_000);
    return () => {
      ctrl.abort();
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Autorizado", value: data.fiscal.autorizado ?? 0 },
      { name: "Em processamento", value: data.fiscal.processando ?? 0 },
      { name: "Rejeitado", value: data.fiscal.rejeitado ?? 0 },
    ];
  }, [data]);

  const total = useMemo(() => chartData.reduce((acc, x) => acc + (x.value || 0), 0), [chartData]);

  return (
    <section className="rounded-2xl border card p-6 flex flex-col items-center">
      <div className="text-lg font-semibold mb-4 tracking-tight flex items-center gap-2">
        <span>Status Fiscal</span>
        <span className="chip">base</span>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        {error && <div className="text-sm text-red-500">{error}</div>}
        {!error && total === 0 && <div className="text-sm muted">Sem dados fiscais para hoje</div>}

        {total > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={60} paddingAngle={2} label>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--card-bg)', borderRadius: 8, border: '1px solid var(--card-border)', color: 'var(--foreground)' }} wrapperStyle={{ zIndex: 20 }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, textAlign: 'center', color: 'var(--muted)' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
