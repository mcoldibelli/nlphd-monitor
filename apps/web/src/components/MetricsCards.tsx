"use client"

import { getMetrics } from "@/lib/api";
import { MetricsOverviewDto } from "@/lib/types";
import { useEffect, useState } from "react"

export default function MetricsCards() {
    const [data, setData] = useState<MetricsOverviewDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        try {
            setData(await getMetrics()); setError(null);
        } catch (err) {
            setError((err as unknown as Error).message ?? "Erro ao carregar métricas");
        }
    }


    useEffect(() => {
        load();
        const id = setInterval(load, 1000);
        return () => clearInterval(id);
    }, []);


  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Pedidos (hoje)">{data?.sale.count ?? "—"}</Card>
      <Card title="Faturamento (hoje)">
        {data?.sale.total ?? "—"}
      </Card>
      <Card title="Autorizados (base)">{data?.fiscal.autorizado ?? "—"}</Card>
      {error && <p className="col-span-full text-sm text-red-600">{error}</p>}
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-xs uppercase text-zinc-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{children}</div>
    </div>
  );
}