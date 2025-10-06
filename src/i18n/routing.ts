import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["am", "en", "ru"],
  localePrefix: "as-needed",

  defaultLocale: "am",
});
