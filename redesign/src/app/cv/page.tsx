import type { Metadata } from "next";
import PortfolioExplorer from "@/components/portfolio-explorer";

export const metadata: Metadata = {
  title: "Visual CV",
  description: "An illustrated timeline of Pedro P. Sanchez’s career, research, and projects.",
};

export default function CV() {
  return <PortfolioExplorer standalone />;
}
