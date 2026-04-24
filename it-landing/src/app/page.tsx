import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Cases } from "@/components/sections/cases";
import { Portfolio } from "@/components/sections/portfolio";
import { Contacts } from "@/components/sections/contacts";
import { SchemaOrg } from "@/components/schema-org";

export default function Home() {
  return (
    <>
      <SchemaOrg />
      <Hero />
      <Services />
      <Process />
      <Cases />
      <Portfolio />
      <Contacts />
    </>
  );
}
