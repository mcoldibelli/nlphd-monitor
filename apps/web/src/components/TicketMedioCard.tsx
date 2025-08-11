"use client";

import { useEffect, useRef, useState } from "react";
import { getMetrics } from "@/lib/api";
import type { MetricsOverviewDto } from "@/lib/types";
import { WalletMinimal } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/Card";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function TicketMedioCard() {
  const [avg, setAvg] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const load = async (signal?: AbortSignal) => {
    try {
      const d: MetricsOverviewDto = await getMetrics();
      if (signal?.aborted) return;

      const total = Number(d?.sale?.total ?? 0);
      const count = Number(d?.sale?.count ?? 0);
      const value = count > 0 ? total / count : 0;

      setAvg(value);
      setLastUpdated(new Date());
      setError(null);
    } catch (e: any) {
      if (signal?.aborted) return;
      setError(e?.message ?? "Erro ao carregar ticket médio");
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
    <Card className="rounded-2xl shadow-sm border bg-[var(--card-bg)] border-[var(--card-border)]">
      <CardHeader title="Ticket médio (hoje)" />
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold">{avg !== null ? BRL.format(avg) : "—"}</div>
          <WalletMinimal className="w-5 h-5 text-accent" aria-hidden />
        </div>
        <div className="mt-2 text-xs muted">
          {error && <span className="text-red-500 dark:text-red-400">{error}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
