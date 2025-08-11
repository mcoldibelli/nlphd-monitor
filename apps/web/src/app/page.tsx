import MetricsCards from "@/components/MetricsCards";

export const revalidate = 0; // desativa cache estático


export default async function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1>NLPhD - Vendas e Monitor Fiscal</h1>
      <MetricsCards />
    </main>
  );
}