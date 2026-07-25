import { sendMail } from "~/adapters/mailer/client";
import type { MailComposer } from "~/adapters/mailer/mail";
import { type MailName, type MailParams, registry } from "~/mails";
import type { JobHandler } from "../job-handler";

export const deliverMail: JobHandler<
  { [K in MailName]: { mailName: K; params: MailParams<K> } }[MailName]
> = async ({ mailName, params }) => {
  const mail = await composeMail(registry, mailName, params);
  await sendMail(mail);
};

async function composeMail(
  composers: Record<string, MailComposer>,
  mailName: string,
  params: unknown,
) {
  const compose = composers[mailName];
  if (!compose) {
    throw new Error(`Unknown mail name: ${mailName}`);
  }
  // params is deserialized JSON from Redis. The typed enqueue in client.ts
  // guarantees it matches the composer's params type.
  return await compose(params as never);
}
