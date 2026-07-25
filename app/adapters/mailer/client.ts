import { Resend } from "resend";
import { RESEND_API_KEY } from "~env";
import type { Mail } from "./mail";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : undefined;

export async function sendMail(mail: Mail) {
  if (!resend) {
    console.log("[mail]", mail);
    return;
  }
  const { error } = await resend.emails.send(mail);
  if (error) {
    throw new Error(`Failed to send mail: ${error.name}: ${error.message}`);
  }
}
