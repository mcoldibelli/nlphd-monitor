import { MetricsOverviewDto, SalesOrder } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";


export async function getMetrics(): Promise<MetricsOverviewDto> {
    const response = await fetch(`${API}/metrics/overview`, {cache: "no-store"});
    if(!response.ok) {
        throw new Error("Falha ao buscar /metrics/overview");
    }
    const data: MetricsOverviewDto = await response.json();

    const total = normalizeNumber(data?.sale?.total);
    return {
        date: String(data?.date ?? ""),
        sale: { count: Number(data?.sale?.count ?? 0), total },
        fiscal: {
            processando: Number(data?.fiscal?.processando ?? 0),
            autorizado: Number(data?.fiscal?.autorizado ?? 0),
            rejeitado: Number(data?.fiscal?.rejeitado ?? 0),
        },
    }
}

export async function getSales(limit = 5000): Promise<SalesOrder[]> {
  const r = await fetch(`${API}/sales?limit=${limit}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Falha ao buscar /sales");
  const list: SalesOrder[] = await r.json();
  return list.map(s => ({
    ...s,
    totalAmount: normalizeNumber(s.totalAmount)
  }));
}

function normalizeNumber(v: any): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  if (v && typeof v === "object") {
    if ("value" in v) return Number(v.value);
    if ("unscaledValue" in v && "scale" in v) {
      const unscaled = Number(v.unscaledValue);
      const scale = Number(v.scale);
      return unscaled / Math.pow(10, scale);
    }
  }
  return 0;
}