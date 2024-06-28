import { css } from "@emotion/react";
import { useCallback, useContext } from "react";

import { Filter } from "~/utils";
import { AppContext } from "~/appState";
import { THEME_COLORS, useTheme } from "~/themeProvider";

const filtersBlock = css`
  display: inline-block;
  min-width: 200px;
`;

const button = css`
  margin: 0 3px;
  padding: 10px;
  border: 0;
  cursor: pointer;
  outline: none;
  background-color: #fff;
  transition: background-color 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  box-shadow: rgba(0, 0, 0, 0.117647) 0 1px 4px, rgba(0, 0, 0, 0.117647) 0 1px 2px;
  border-radius: 2px;
  border-bottom: 2px solid ${"#d8d8d8"};

  &:active {
    box-shadow: rgba(0, 0, 0, 0.117647) 0 0;
  }
`;

export default function Filters() {
  const state = useContext(AppContext);
  const [{ appTheme }] = useTheme();
  const activeBtn = {
    color: "#fff",
    backgroundColor: `${(THEME_COLORS as any)[appTheme].MAIN_COLOR}`,
    borderBottomColor: `${(THEME_COLORS as any)[appTheme].MAIN_COLOR_DARK}`,
  };
  return (
    <div css={filtersBlock}>
      <button
        css={button}
        style={state.filter === Filter.ALL ? activeBtn : undefined}
        onClick={useCallback(() => state.setState({ ...state, filter: Filter.ALL }), [state])}
      >
        All
      </button>
      <button
        css={button}
        style={state.filter === Filter.REMAINED ? activeBtn : undefined}
        onClick={useCallback(() => state.setState({ ...state, filter: Filter.REMAINED }), [state])}
      >
        Remained
      </button>
      <button
        css={button}
        style={state.filter === Filter.COMPLETED ? activeBtn : undefined}
        onClick={useCallback(() => state.setState({ ...state, filter: Filter.COMPLETED }), [state])}
      >
        Completed
      </button>
    </div>
  );
}
