export const applyTheme = (theme: string) => {
  const root = document.documentElement;
  if (!theme || !(theme in themes)) theme = "magenta";
  Object.keys(themes[theme]).forEach((cssVar) => {
    root.style.setProperty(cssVar, themes[theme][cssVar]);
  });
};

const createTheme = (
  primary: string,
  secondary: string,
  hover: string
): ThemeType => ({
  "--primary-color": primary,
  "--secondary-color": secondary,
  "--hover-color": hover,
});

// TODO: change these all to primary=800, hover=700, secondary=200?
// Depends how we want the secondary color to be used. Regardless, the colors need to be adjusted

export const themes: { [theme: string]: ThemeType } = {
  red: createTheme("#991b1b", "#dc2626", "#b91c1c"),
  orange: createTheme("#c2410c", "#f97316", "#ea580c"),
  yellow: createTheme("#854d0e", "#fef08a", "#a16207"),
  green: createTheme("#166534", "#86efac", "#15803d"),
  sky: createTheme("#0891b2", "#cffafe", "#06b6d4"),
  blue: createTheme("#1e40af", "#bfdbfe", "#1d4ed8"),
  purple: createTheme("#6b21a8", "#e9d5ff", "#7e22ce"),
  magenta: createTheme("#9d174d", "#fbcfe8", "#be185d"),
};

type ThemeType = {
  [cssVariable: string]: string;
};
