# Brief (Claude Design): Terms of Service & Privacy Policy pages

## Context

UtilityBills CRM is a multi-tenant tool for tracking household utility bills. Its login page footer links to "Terms of Service" and "Privacy Policy", but those pages don't exist yet. Design them.

These belong to the public layer, which is **English-only**.

## Goal

A mockup for two long-form content pages — Terms of Service and Privacy Policy — that feel like part of a real, trustworthy product rather than an afterthought. The challenge here is making a "wall of legal text" pleasant and easy to read.

## Scope

- **One variant.** A single, considered design — not a set of options.
- These two pages share one design treatment (same layout family, same components).
- Reachable from the login footer links. The login page itself is already designed — no need to touch it.

## Visual direction

- Inherit the existing Design System (the established Zinc / Violet / Inter language). These pages should look like they belong to the same product, not a separate site.
- Calm, clean, trustworthy. This is the page a careful user reads before trusting us with financial data — the design should feel honest and unhurried.
- Long-form text done well: comfortable measure (line width), clear section hierarchy, generous spacing, easy scanning.

## Room to bring craft

This is where you can add something the brief didn't ask for. A few directions worth exploring (pick what fits, don't cram them all): a section index / anchor navigation for quick jumps, a subtle "last updated" treatment, a clean header that ties back to the app brand, thoughtful typography for headings vs. body, a graceful back-to-app affordance. If you see a nicer way to present this kind of content, show it.

## Copy (final, use verbatim)

### Terms of Service

_Last updated: June 17, 2026_

These terms govern your use of UtilityBills CRM ("the Service"). By signing in, you agree to them.

**What the Service is**

UtilityBills CRM is a personal, non-commercial tool for tracking household utility bills across one or more properties, intended for personal and small-group use.

**Your account**

You sign in with Google. You are responsible for activity under your account and for the data you enter. Keep your Google account secure.

**Acceptable use**

Use the Service for its intended purpose. Do not attempt to access other users' data, disrupt the Service, or use it for unlawful activity.

**Your data**

The data you enter belongs to you. We handle it as described in the Privacy Policy. You can export or delete it.

**Availability and "as is"**

The Service is provided "as is", without warranties of any kind. It may change, break, or become unavailable at any time. We do not guarantee it will be error-free or always accessible. Do not rely on it as your sole record for matters of financial or legal importance.

**Limitation of liability**

To the extent permitted by law, we are not liable for any loss or damage arising from your use of, or inability to use, the Service.

**Termination**

You can stop using the Service at any time. We may suspend or end access if these terms are violated.

**Changes**

We may update these terms. Continued use after a change means you accept them.

**Contact**

utilitybills.crm@gmail.com

---

### Privacy Policy

_Last updated: June 17, 2026_

UtilityBills CRM ("the Service", "we") is a personal tool for tracking household utility bills. This policy explains what data we collect, why, and what you can do about it.

**What we collect**

- _Account information._ When you sign in with Google, we receive your name, email address, and Google account identifier, and use them to create and identify your account.
- _Data you enter._ The properties, meters, readings, bills, payments, and related records you add. This may include financial information such as amounts paid.
- _Optional integrations._ If you connect Telegram for reminders, we store the identifier needed to message you. You can disconnect it at any time.
- _Technical data._ Server logs (timestamps, errors) to operate and debug the Service. We use no analytics or advertising trackers.

**Cookies**

We use a single session cookie to keep you signed in. No advertising or third-party tracking cookies.

**Where your data is stored**

Your data is stored in a PostgreSQL database hosted in the European Union (Frankfurt, Germany). The Service is hosted on Vercel.

**Who we share it with**

We do not sell your data and we do not show ads. We rely on a small set of providers to run the Service:

- **Google** — sign-in
- **Vercel** — hosting
- **Neon** — database
- **Telegram** — only if you connect it, and only to deliver reminders you set up

**How long we keep it**

We keep your data for as long as your account exists. If you delete your account or ask us to remove your data, we delete it.

**Your rights**

You can access, export, or delete your data. Because the Service holds personal and financial information, we take these requests seriously. To make a request, contact utilitybills.crm@gmail.com.

**Changes**

If this policy changes, we will update the date above.

**Contact**

utilitybills.crm@gmail.com
