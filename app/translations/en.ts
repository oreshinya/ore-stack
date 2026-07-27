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
  ui: {
    common: {
      yes: "Yes",
      no: "No",
      backToList: "Back to list",
    },
    sample: {
      common: {
        id: "ID",
        name: "Name",
        nameLabel: "Name:",
        active: "Active",
        edit: "Edit",
      },
      list: {
        title: "Samples",
        newSample: "Create New Sample",
        actions: "Actions",
        view: "View",
        empty: "No samples found.",
      },
      detail: {
        title: "Sample Detail",
      },
      creation: {
        title: "Create New Sample",
        create: "Create Sample",
      },
      edit: {
        title: "Edit Sample",
        viewDetail: "View detail",
        update: "Update Sample",
      },
    },
  },
} satisfies Translation;
