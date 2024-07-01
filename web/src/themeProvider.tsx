import { createContext, Dispatch, useContext, useReducer } from "react";

export enum THEME {
  WORKDAY_BLUE = "WORKDAY_BLUE",
  ANGULAR_RED = "ANGULAR_RED",
  BRAVE_SKY = "BRAVE_SKY",
}

interface ThemeColorsData {
  MAIN_COLOR: string;
  MAIN_COLOR_DARK: string;
}

interface ThemeColors {
  [propName: string]: ThemeColorsData;
}

export const THEME_COLORS: ThemeColors = {
  WORKDAY_BLUE: { MAIN_COLOR: "#0165c7", MAIN_COLOR_DARK: "#014d98" },
  ANGULAR_RED: { MAIN_COLOR: "#dd0130", MAIN_COLOR_DARK: "#a50023" },
  BRAVE_SKY: { MAIN_COLOR: "#0393d6", MAIN_COLOR_DARK: "#a264b2" },
};

interface AppTheme {
  appTheme: THEME;
}
type ThemeAction = { type: "SWITCH_APP_THEME"; payload: THEME };

type InitialState = { appTheme: THEME };
const initialState: InitialState = { appTheme: THEME.WORKDAY_BLUE };

type ThemeContextType = [AppTheme, Dispatch<ThemeAction>];
export const ThemeContext = createContext<ThemeContextType>([initialState, () => false]);

function reducer(state: AppTheme, action: ThemeAction) {
  switch (action.type) {
    case "SWITCH_APP_THEME":
      return { ...state, appTheme: action.payload };
    default:
      return state;
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue = useReducer(reducer, initialState);
  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
