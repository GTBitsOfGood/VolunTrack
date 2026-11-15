// A waiver saved from an empty editor ("" or "<p><br></p>") has nothing to
// agree to, so it counts as no waiver.
export const hasWaiverText = (html) =>
  typeof html === "string" &&
  (/<img\b/i.test(html) ||
    html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim().length > 0);
