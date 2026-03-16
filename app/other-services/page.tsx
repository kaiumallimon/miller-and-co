import type { Metadata } from "next";
import CustomHeader from "@/components/custom/shared/header";
import OtherServicesPageClient from "@/components/custom/other-services/OtherServicesPageClient";

export const metadata: Metadata = {
  title: "Other Services | Miller & Co. Migration Lawyers",
  description:
    "Explore our other specialized services – from employer recruitment support for subclass 186 and 482 visas to creative mortgage solutions.",
};

export default function OtherServicesPage() {
  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <CustomHeader />
      <OtherServicesPageClient />
    </div>
  );
}
