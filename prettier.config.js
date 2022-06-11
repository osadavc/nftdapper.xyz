module.exports = {
  singleQuote: false,
  semi: true,
  importOrder: [
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "next-seo.config",
    "^components/(.*)$",
    "^utils/(.*)$",
    "^assets/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
};
