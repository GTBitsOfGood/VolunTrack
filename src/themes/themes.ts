import { ThemeType } from "./types";
import { createTheme } from "./utils";

export const lightTheme: ThemeType = createTheme("#1f2937", "white");
export const darkTheme: ThemeType = createTheme("white", "#1f2937");
// export const sampleOrgTheme: ThemeType = createTheme(
//   "#F2D2BD",
//   "#9F2B68"
// );
export const sampleOrgTheme: ThemeType = createTheme("#210e72", "#6b86d5");
