import { css } from "@emotion/react";
import { useAppState } from "~/context/AppStateContext";

import { filterItems } from "~/utils";
import { Filter, Task } from "~/types";
import { deleteAllCompletedItems } from "~/API/tasks";
import Filters from "./Filters";

import { getProjectTasks } from "~/utils";
export default function AppControls() {
  const [appState, dispatch] = useAppState();
  const tasks = getProjectTasks(appState.currentProjectId, appState.projects);

  function clearAllCompleted() {
    const ids = tasks?.map((itm: Task) => {
      if (itm.resolved) return itm._id;
    });
    ids &&
      ids?.length > 0 &&
      deleteAllCompletedItems(appState.currentProjectId, ids).then(res => {
        if ((res as any)?.status === 200) {
          const items = tasks.filter((item: Task) => item.resolved !== true);
          dispatch({
            type: "CLEAR_ALL_COMPLETED_TASKS",
            payload: { id: appState.currentProjectId, newTasks: items },
          });
        }
      });
  }

  function renderRemained(items: Task[]): React.ReactNode {
    const remainedItems = filterItems(items, Filter.REMAINED);
    return (
      <span css={remained}>
        {remainedItems.length} {remainedItems.length === 1 ? "item" : "items"} left
      </span>
    );
  }

  if (!tasks) return;
  return (
    tasks.length > 0 && (
      <div css={controlsCSS}>
        {renderRemained(tasks)}
        <Filters />
        <button
          css={clearButton}
          onClick={clearAllCompleted}
        >
          Clear completed
        </button>
      </div>
    )
  );
}

const controlsCSS = css`
  padding: 20px;
  display: grid;
  line-height: 55px;
  text-align: center;
  grid-template-columns: 30% 40% 30%;
  background-color: rgba(255, 255, 255, 0.8);
`;

const clearButton = css`
  background: none;
  outline: none;
  cursor: pointer;
  border: none;
  color: #bbb;
  font-size: 14px;
  text-align: right;
  padding: 0;
  transition: color 0.3s linear;

  &:hover {
    color: #3d4255;
    text-decoration: underline;
  }

  @media screen and (max-width: 500px) {
    font-size: 11px;
  }
`;

const remained = css`
  font-size: 14px;
  color: #bbb;
  text-align: left;

  @media screen and (max-width: 500px) {
    font-size: 11px;
  }
`;
