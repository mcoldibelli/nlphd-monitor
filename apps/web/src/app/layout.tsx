import { Inter } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NLPHD Monitor",
  description: "Dashboard de Vendas & Fiscal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Inline script runs before paint to avoid theme flash.
  const themeSetter = `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme', t);}}catch(e){}})();`;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeSetter }} />
      </head>
      <body className={inter.className}>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 px-3 py-2 rounded bg-white/90 text-black shadow">
          Ir para o conteúdo
        </a>

        <header className="sticky top-0 z-30 border-b border-[var(--card-border)] bg-[var(--card-bg)]/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-xl tracking-tight text-accent">
                NLPhD <span className="font-normal text-base muted">Monitor</span>
              </span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main id="conteudo" className="max-w-6xl mx-auto px-8 py-10">{children}</main>
      </body>
    </html>
  );
}
