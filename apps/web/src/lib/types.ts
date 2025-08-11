export type MetricsOverviewDto = {
    date: string;
    sale: {count: number; total: number};
    fiscal: {processando: number; autorizado: number; rejeitado: number};
};