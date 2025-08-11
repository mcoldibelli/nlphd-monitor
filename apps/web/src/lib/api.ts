import { MetricsOverviewDto } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";


export async function getMetrics(): Promise<MetricsOverviewDto> {
    const response = await fetch(`${API}/metrics/overview`, {cache: "no-store"});
    if(!response.ok) {
        throw new Error("Falha ao buscar /metrics/overview");
    }
    const data: MetricsOverviewDto = await response.json();
    return data;
}