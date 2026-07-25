import { MAIL_FROM } from "~env";

export interface Mail {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export type MailComposer<Params = never> = (params: Params) => Promise<Mail>;

export function buildMail(params: {
  to: string;
  subject: string;
  text: string;
}): Mail {
  return { from: MAIL_FROM, ...params };
}
