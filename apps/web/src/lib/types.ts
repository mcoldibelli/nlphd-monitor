export type MetricsOverviewDto = {
    date: string;
    sale: {count: number; total: number};
    fiscal: {processando: number; autorizado: number; rejeitado: number};
};

export type SalesOrder = {
    id: string;
    orderNumber: string;
    totalAmount: number | string | { value?: number; unscaledValue?: string; scale?: number};
    createdAt: string;
}