import { useEffect } from "react";

// Quill draws its toolbar buttons as bare icons, so screen readers announce
// each one only as "button". This names them after their format while a page
// with an editor is open.
const NAMES = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  strike: "Strikethrough",
  blockquote: "Quote",
  "code-block": "Code block",
  link: "Insert link",
  image: "Insert image",
  video: "Insert video",
  clean: "Clear formatting",
  header: "Heading",
  size: "Text size",
  font: "Font",
  color: "Text color",
  background: "Highlight color",
  align: "Text alignment",
  list: "List",
  indent: "Indent",
  script: "Script",
};
const NAMES_BY_VALUE = {
  list: { ordered: "Numbered list", bullet: "Bulleted list" },
  indent: { "-1": "Decrease indent", "+1": "Increase indent" },
  script: { sub: "Subscript", super: "Superscript" },
  align: { center: "Align center", right: "Align right", justify: "Justify" },
};
const NOT_FORMATS = new Set([
  "ql-active",
  "ql-picker",
  "ql-expanded",
  "ql-picker-label",
  "ql-icon-picker",
  "ql-color-picker",
]);

const formatOf = (element) =>
  [...element.classList]
    .find((name) => name.startsWith("ql-") && !NOT_FORMATS.has(name))
    ?.slice(3);

export const nameQuillToolbarButtons = (root) => {
  root
    .querySelectorAll(".ql-toolbar button:not([aria-label]):not([aria-hidden])")
    .forEach((button) => {
      const format = formatOf(button);
      if (!format) return;
      if (format === "undefined") {
        // An empty {} in a toolbar setting draws a spacer button that does
        // nothing, so keep it away from screen readers and the Tab key.
        button.setAttribute("aria-hidden", "true");
        button.tabIndex = -1;
        return;
      }
      const value = button.getAttribute("value");
      button.setAttribute(
        "aria-label",
        (value && NAMES_BY_VALUE[format]?.[value]) || NAMES[format] || format
      );
    });
  root
    .querySelectorAll(".ql-toolbar .ql-picker-label:not([aria-label])")
    .forEach((label) => {
      const picker = label.closest(".ql-picker");
      const format = picker && formatOf(picker);
      if (format) label.setAttribute("aria-label", NAMES[format] || format);
    });
};

const useQuillToolbarLabels = () => {
  useEffect(() => {
    nameQuillToolbarButtons(document);
    // Editors load after the page renders, so name buttons as they appear.
    const observer = new MutationObserver(() =>
      nameQuillToolbarButtons(document)
    );
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
};

export default useQuillToolbarLabels;
