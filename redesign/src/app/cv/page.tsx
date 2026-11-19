import type { Metadata } from "next";
import PortfolioExplorer from "@/components/portfolio-explorer";

export const metadata: Metadata = {
  title: "Visual CV",
  description: "An illustrated CV of Pedro P. Sanchez’s career, research, startups, and sports.",
};

export default function CV() {
  return <PortfolioExplorer standalone />;
}
