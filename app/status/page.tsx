import Link from "next/link";
import { ContentPageLayout } from "@/components/marketing/content-page-layout";

export const metadata = {
  title: "System status – DevTalk",
  description: "Current operational status of DevTalk services.",
};

const services = [
  { name: "Web application", status: "Operational" },
  { name: "Realtime messaging", status: "Operational" },
  { name: "Authentication", status: "Operational" },
  { name: "File attachments", status: "Operational" },
  { name: "Billing (Stripe)", status: "Operational" },
] as const;

export default function StatusPage() {
  return (
    <ContentPageLayout
      category="Product"
      title="System status"
      description="Live service health for DevTalk."
      lastUpdated="June 12, 2026"
    >
      <div className="not-prose mb-8 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
        </span>
        <p className="text-sm font-medium text-emerald-300">
          All systems operational
        </p>
      </div>

      <h2>Services</h2>
      <ul>
        {services.map((service) => (
          <li key={service.name}>
            <strong>{service.name}</strong> — {service.status}
          </li>
        ))}
      </ul>

      <h2>Incident history</h2>
      <p>No incidents reported in the last 90 days.</p>

      <p>
        Questions? Contact{" "}
        <a href="mailto:support@devtalk.app">support@devtalk.app</a> or visit
        our <Link href="/contact">support page</Link>.
      </p>
    </ContentPageLayout>
  );
}
