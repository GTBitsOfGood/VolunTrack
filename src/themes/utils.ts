import { ThemeType } from "./types";

export const applyTheme = (theme: ThemeType): void => {
  const root = document.documentElement;
  Object.keys(theme).forEach((cssVar) => {
    root.style.setProperty(cssVar, theme[cssVar]);
  });
};

export const createTheme = (primary: string, secondary: string): ThemeType => ({
  "--primary-color": primary,
  "--secondary-color": secondary,
});
