"use client";

import { getSales } from "@/lib/api";
import type { SalesOrder } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const DATE = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export default function SalesTable() {
  const [rows, setRows] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const timer = useRef<NodeJS.Timeout | null>(null);

  const load = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await getSales(50);
      if (signal?.aborted) return;
      setRows(data);
      setError(null);
    } catch (e: any) {
      if (signal?.aborted) return;
      setError(e?.message ?? "Erro ao carregar transações");
    } finally {
      if (!signal?.aborted) setLoading(false);
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

  const totalPages = useMemo(() => Math.max(1, Math.ceil(rows.length / pageSize)), [rows.length]);
  const pagedRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page]);

  useEffect(() => {
    // Reset to first page when rows length changes to avoid out-of-bound page
    setPage(1);
  }, [rows.length]);

  return (
    <section className="rounded-2xl border card overflow-hidden">
      <h2 className="text-lg font-semibold tracking-tight mb-2">Últimas transações</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <Th>Hora</Th><Th>Pedido</Th><Th>Valor</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b last:border-0">
                  <Td><div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" /></Td>
                  <Td><div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" /></Td>
                  <Td><div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" /></Td>
                </tr>
              ))
            )}

            {!loading && pagedRows.map((r) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <Td>{DATE.format(new Date(r.createdAt))}</Td>
                <Td>{r.orderNumber}</Td>
                <Td>{BRL.format(Number(r.totalAmount))}</Td>
              </tr>
            ))}

            {!loading && !rows.length && (
              <tr>
                <Td colSpan={3} className="text-center py-10 muted">Sem vendas</Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2 py-4 border-t">
        <button
          className="px-3 py-1 rounded-lg border shadow-sm disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Página anterior"
        >Anterior</button>
        <span className="px-2">Página {page} de {totalPages}</span>
        <button
          className="px-3 py-1 rounded-lg border shadow-sm disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="Próxima página"
        >Próxima</button>
      </div>

      {error && <div className="px-4 pb-4 text-sm text-red-500">{error}</div>}
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-medium px-4 py-2 muted-2">{children}</th>;
}
function Td({ children, colSpan, className }: { children: React.ReactNode; colSpan?: number; className?: string }) {
  return <td colSpan={colSpan} className={`px-4 py-2${className ? " " + className : ""}`}>{children}</td>;
}
