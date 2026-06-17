import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/constants/contact";
import { LegalPage } from "../_components/legal-page";
import { LegalSection } from "../_components/legal-section";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of UtilityBills CRM.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="June 17, 2026">
      <p>
        These terms govern your use of UtilityBills CRM (&ldquo;the Service&rdquo;). By signing in,
        you agree to them.
      </p>

      <LegalSection title="What the Service is">
        <p>
          UtilityBills CRM is a personal, non-commercial tool for tracking household utility bills
          across one or more properties, intended for personal and small-group use.
        </p>
      </LegalSection>

      <LegalSection title="Your account">
        <p>
          You sign in with Google. You are responsible for activity under your account and for the
          data you enter. Keep your Google account secure.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>
          Use the Service for its intended purpose. Do not attempt to access other users&apos; data,
          disrupt the Service, or use it for unlawful activity.
        </p>
      </LegalSection>

      <LegalSection title="Your data">
        <p>
          The data you enter belongs to you. We handle it as described in the Privacy Policy. You
          can export or delete it.
        </p>
      </LegalSection>

      <LegalSection title={'Availability and "as is"'}>
        <p>
          The Service is provided &ldquo;as is&rdquo;, without warranties of any kind. It may
          change, break, or become unavailable at any time. We do not guarantee it will be
          error-free or always accessible. Do not rely on it as your sole record for matters of
          financial or legal importance.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the extent permitted by law, we are not liable for any loss or damage arising from your
          use of, or inability to use, the Service.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          You can stop using the Service at any time. We may suspend or end access if these terms
          are violated.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>We may update these terms. Continued use after a change means you accept them.</p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
