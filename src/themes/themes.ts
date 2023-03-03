import { ThemeType } from "./types";
import { createTheme } from "./utils";

export const lightTheme: ThemeType = createTheme("#1f2937", "white");
export const darkTheme: ThemeType = createTheme("white", "#1f2937");
