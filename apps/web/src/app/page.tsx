import { getMetrics } from "@/lib/api";
import { ReactNode } from "react";

export const revalidate = 0; // desativa cache estático

export default async function Home() {
  const data = await getMetrics();
  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return (
   <main>
    <h1>NLPhD - Vendas e Monitor Fiscal</h1>
    <section>
      <Card title="Pedidos (hoje)">{data.sale.count}</Card>
      <Card title="Faturamento (hoje)">{currency.format(data.sale.total)}</Card>
      <Card title="Autorizados (base)">{data.fiscal.autorizado}</Card>
    </section>
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
   </main>
  );
}

function Card({title, children}: {title: string, children: ReactNode}) {
  return (
    <div className="">
      <div className="">{title}</div>
      <div className="">{children}</div>
    </div>
  )
}