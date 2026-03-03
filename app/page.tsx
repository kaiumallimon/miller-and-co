import HomeHero from "@/components/custom/home/hero";
import CustomHeader from "@/components/custom/shared/header";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <CustomHeader/>
      <HomeHero></HomeHero>
    </div>
  );
}
