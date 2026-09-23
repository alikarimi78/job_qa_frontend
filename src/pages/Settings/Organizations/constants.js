/** Limits of an organization's logo upload, and the dialogs the organizations page can open. */
export const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export const LOGO_MAX_BYTES = 512 * 1024;

export const ORGANIZATION_DIALOGS = {
  create: "create",
  edit: "edit",
  view: "view",
  delete: "delete",
  addAdmin: "addAdmin",
};

export const BLANK_ORGANIZATION = { name: "", code: "", address: "", phone: "", email: "" };
