import type { Metadata } from "next";
import CustomHeader from "@/components/custom/shared/header";
import Footer from "@/components/custom/shared/footer";
import ServicesPageClient from "@/components/custom/services/ServicesPageClient";

export const metadata: Metadata = {
  title: "Services | Miller & Co. Migration Lawyers",
  description:
    "From employer-sponsored visas and skilled migration to partner visas and citizenship — explore the full range of Australian immigration services offered by Miller & Co.",
};

export default function ServicesPage() {
  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <CustomHeader />
      <ServicesPageClient />
      <Footer />
    </div>
  );
}
