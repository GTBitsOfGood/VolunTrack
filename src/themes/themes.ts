import { ThemeType } from "./types";
import { createTheme } from "./utils";

export const baseTheme: ThemeType = createTheme("red", "blue");
export const darkTheme: ThemeType = createTheme("grey", "black");
