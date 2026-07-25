import type { MailComposer } from "~/adapters/mailer/mail";
import { sample } from "./sample";

export const registry = {
  sample,
} satisfies Record<string, MailComposer>;

type Registry = typeof registry;

export type MailName = keyof Registry;

export type MailParams<T extends MailName> = Parameters<Registry[T]>[0];
