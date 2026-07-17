import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/constants/contact";
import { LegalPage } from "../_components/legal-page";
import { LegalSection } from "../_components/legal-section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What data UtilityBills Tracker collects, why, and what you can do about it.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="June 17, 2026">
      <p>
        UtilityBills Tracker (&ldquo;the Service&rdquo;, &ldquo;we&rdquo;) is a personal tool for
        tracking household utility bills. This policy explains what data we collect, why, and what
        you can do about it.
      </p>

      <LegalSection title="What we collect">
        <ul>
          <li>
            <em>Account information.</em> When you sign in with Google, we receive your name, email
            address, and Google account identifier, and use them to create and identify your
            account.
          </li>
          <li>
            <em>Data you enter.</em> The properties, meters, readings, bills, payments, and related
            records you add. This may include financial information such as amounts paid.
          </li>
          <li>
            <em>Optional integrations.</em> If you connect Telegram for reminders, we store the
            identifier needed to message you. You can disconnect it at any time.
          </li>
          <li>
            <em>Technical data.</em> Server logs (timestamps, errors) to operate and debug the
            Service. We use no analytics or advertising trackers.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use a single session cookie to keep you signed in. No advertising or third-party
          tracking cookies.
        </p>
      </LegalSection>

      <LegalSection title="Where your data is stored">
        <p>
          Your data is stored in a PostgreSQL database hosted in the European Union (Frankfurt,
          Germany). The Service is hosted on Vercel.
        </p>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <p>
          We do not sell your data and we do not show ads. We rely on a small set of providers to
          run the Service:
        </p>
        <ul>
          <li>
            <strong>Google</strong> &mdash; sign-in
          </li>
          <li>
            <strong>Vercel</strong> &mdash; hosting
          </li>
          <li>
            <strong>Neon</strong> &mdash; database
          </li>
          <li>
            <strong>Telegram</strong> &mdash; only if you connect it, and only to deliver reminders
            you set up
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep your data for as long as your account exists. If you delete your account or ask us
          to remove your data, we delete it.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You can access, export, or delete your data. Because the Service holds personal and
          financial information, we take these requests seriously. To make a request, contact{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>If this policy changes, we will update the date above.</p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
