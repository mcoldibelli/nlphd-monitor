import FiscalStatusPie from "@/components/FiscalStatusPie";
import MetricsCards from "@/components/MetricsCards";
import SalesByHourChart from "@/components/SalesByHourChart";
import SalesTable from "@/components/SalesTable";

export const revalidate = 0;

export default async function Home() {
  return (
    <section className="max-w-6xl mx-auto p-8 space-y-8 rounded-3xl card">
      <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-accent">
        Painel <span className="chip ml-2 text-accent">NLPHD</span>
      </h1>

      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesByHourChart />
        <FiscalStatusPie />
      </div>

      <SalesTable />
    </section>
  );
}
