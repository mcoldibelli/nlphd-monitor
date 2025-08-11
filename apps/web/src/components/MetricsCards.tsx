'use client';

import { useEffect, useRef, useState } from "react";
import { getMetrics } from "@/lib/api";
import type { MetricsOverviewDto } from "@/lib/types";
import { Activity, BadgeDollarSign, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/Card";
import TicketMedioCard from "./TicketMedioCard";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function MetricsCards() {
  const [data, setData] = useState<MetricsOverviewDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const load = async (signal?: AbortSignal) => {
    try {
      const d = await getMetrics();
      if (signal?.aborted) return;
      setData(d);
      setError(null);
      setLastUpdated(new Date());
    } catch (e: any) {
      if (signal?.aborted) return;
      setError(e?.message ?? "Erro ao carregar métricas");
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <Kpi
          icon={<Activity className="w-5 h-5 text-accent" />}
          title="Pedidos (hoje)"
          value={data?.sale.count ?? "—"}
        />
        <Kpi
          icon={<BadgeDollarSign className="w-5 h-5 text-accent" />}
          title="Faturamento (hoje)"
          value={data ? currency.format(Number(data.sale.total)) : "—"}
        />
          <TicketMedioCard />
      </div>

      <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 px-1" aria-live="polite">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 dark:bg-emerald-400"></span>
        </span>
        <span className="muted">
          Atualizando a cada 10s{lastUpdated ? ` • Última: ${lastUpdated.toLocaleTimeString("pt-BR")}` : ""}
        </span>
        {error && <span className="text-red-500 dark:text-red-400"> • {error}</span>}
      </div>
    </>
  );
}

type KpiProps = { icon: React.ReactNode; title: string; value: React.ReactNode };
function Kpi({ icon, title, value }: KpiProps) {
  return (
    <Card className="rounded-2xl shadow-sm border bg-[var(--card-bg)] border-[var(--card-border)]">
      <CardHeader title={title} />
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold">{value}</div>
          <div aria-hidden>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
