import { db } from "~/adapters/db/client";
import type { SampleId } from "~/adapters/db/tables/sample";
import { buildMail, type MailComposer } from "~/adapters/mailer/mail";
import { findSampleByIdOrThrow } from "~/models/sample/query";

export const sample: MailComposer<{ sampleId: SampleId }> = async ({
  sampleId,
}) => {
  const { name } = await findSampleByIdOrThrow(db, sampleId);
  return buildMail({
    to: "sample@example.com",
    subject: `Sample mail: ${name}`,
    text: `This is a sample mail for ${name}.`,
  });
};
