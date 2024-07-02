import { css } from "@emotion/react";
import { useCallback, useContext } from "react";
import { useAppState } from "~/context/AppStateContext";

import { Filter } from "~/utils";
import { THEME_COLORS } from "~/themeProvider";

// import { getProject } from "~/utils";
// import { getProjectTasks } from "~/utils";
export default function Filters() {
  const [appState, dispatch] = useAppState();
  // const tasks = getProjectTasks(appState.currentProjectId, appState.projects);
  // const project = getProject(appState.currentProjectId, appState.projects);
  // project.tasksFilter = project.tasksFilter ? project.tasksFilter : Filter.ALL;
  // console.log(project.tasksFilter);
  // console.log(project);

  const activeBtn = {
    color: "#fff",
    backgroundColor: `${THEME_COLORS.WORKDAY_BLUE.MAIN_COLOR}`,
    borderBottomColor: `${THEME_COLORS.WORKDAY_BLUE.MAIN_COLOR_DARK}`,
  };
  return (
    <div css={filtersBlock}>
      <button
        css={button}
        style={appState.tasksFilter === Filter.ALL ? activeBtn : undefined}
        onClick={() => dispatch({ type: "SET_FILTER", payload: { newFilter: Filter.ALL } })}
      >
        All
      </button>
      <button
        css={button}
        style={appState.tasksFilter === Filter.REMAINED ? activeBtn : undefined}
        onClick={() => dispatch({ type: "SET_FILTER", payload: { newFilter: Filter.REMAINED } })}
      >
        Remained
      </button>
      <button
        css={button}
        style={appState.tasksFilter === Filter.COMPLETED ? activeBtn : undefined}
        onClick={() => dispatch({ type: "SET_FILTER", payload: { newFilter: Filter.COMPLETED } })}
      >
        Completed
      </button>
    </div>
  );
}

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

  :active {
    box-shadow: rgba(0, 0, 0, 0.117647) 0 0;
  }
`;
