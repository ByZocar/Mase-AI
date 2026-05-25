import { PageHeader } from "@/components/ui";
import { DiscoveryClient } from "./discovery-client";

export const dynamic = "force-dynamic";

export default function DiscoveryPage() {
  return (
    <>
      <PageHeader
        title="Discovery"
        subtitle="Identifica leads de alta intención combinando LinkedIn Sales Navigator (Apify) + ValueSerp + señales en redes"
      />
      <div className="p-8">
        <DiscoveryClient />
      </div>
    </>
  );
}
