// Pure digest composition: a user's due reminders → the single plain-text message they receive.
// Locale is not known here — the service-name translator is injected, so this stays a pure,
// locale-agnostic function the caller renders in the recipient's locale (see delivery.ts).

// One due reminder as the digest needs it: the system-stamped context plus the user's own text.
export type TDueReminderBlock = {
  propertyName: string;
  serviceTypeCode: string;
  text: string;
};

// Resolves a service-type code (e.g. "electricity") to its label in the recipient's locale.
export type TTranslateService = (serviceTypeCode: string) => string;

// Blank line between blocks; the context header frames property + service.
const BLOCK_SEPARATOR = "\n\n";
const blockHeader = (propertyName: string, serviceLabel: string): string =>
  `[${propertyName} · ${serviceLabel}]`;

// One message combining every due reminder for the day. Each block is the context header
// followed by the user's own text; blocks are separated by a blank line. Plain text — the
// header uses no Telegram markup, so property/service names need no escaping.
export const buildDigest = (
  blocks: TDueReminderBlock[],
  translateService: TTranslateService,
): string =>
  blocks
    .map(
      (block) =>
        `${blockHeader(block.propertyName, translateService(block.serviceTypeCode))}\n${block.text}`,
    )
    .join(BLOCK_SEPARATOR);
