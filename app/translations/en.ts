import type { Translation } from "./index";

export const en = {
  err: {
    request: {
      invalid: "Invalid request.",
    },
    sample: {
      nameRequired: "Name is required.",
      nameTooLong: ({ max }: { max: number }) =>
        `Name must not exceed ${max} characters.`,
      nameTaken: "Name already exists.",
    },
  },
} satisfies Translation;
