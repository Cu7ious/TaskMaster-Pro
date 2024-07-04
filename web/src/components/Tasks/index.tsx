import { css } from "@emotion/react";
import { AxiosResponse } from "axios";

import { DispatchTypes, useAppState } from "~/context/AppStateContext";
import { ApiDesc } from "~/API";
import { deleteItemById, updateContentById, updateResolvedById } from "~/API/tasks";
import { filterItems } from "~/utils";
import { isKeyboardEvent, Task } from "~/types";
import { TaskBox } from "./TaskBox";
import { getProjectTasks } from "~/utils";

export const Tasks: React.FC = () => {
  const [appState, dispatch] = useAppState();
  const tasks = getProjectTasks(appState.currentProjectId, appState.projects);
  const filteredTasks = filterItems(tasks, appState.tasksFilter);
  function editItem(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const items = [...tasks];
    const itemIdx = items.findIndex(item => item._id === id);
    items[itemIdx].content = e.currentTarget.value;
    dispatch({
      type: DispatchTypes.EDIT_TASK,
      payload: { id: appState.currentProjectId, newTasks: [...items] },
    });
  }

  const _saveEditedItemCallback = (res: AxiosResponse<ApiDesc>, id: string) => {
    const updatedItems = [...tasks];
    const updatedIdx = updatedItems.findIndex(itm => itm._id === id);
    updatedItems[updatedIdx] = { ...res.data, editing: false };
    dispatch({
      type: DispatchTypes.UNMARK_TASK_EDITABLE,
      payload: { id: appState.currentProjectId, newTasks: updatedItems },
    });
  };

  const saveEditedItem = (
    id: string,
    e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    const items = [...tasks];
    const index = items.findIndex(item => item._id === id);
    if (isKeyboardEvent(e)) {
      if (e.code === "Escape") {
        items[index].editing = false;
        dispatch({
          type: DispatchTypes.UNMARK_TASK_EDITABLE,
          payload: { id: appState.currentProjectId, newTasks: items },
        });
        return;
      }
      if (e.code === "Enter") {
        items[index].editing = false;
        updateContentById(id, items[index].content).then(res => _saveEditedItemCallback(res, id));
      }
    } else {
      items[index].editing = false;
      dispatch({
        type: DispatchTypes.UNMARK_TASK_EDITABLE,
        payload: { id: appState.currentProjectId, newTasks: items },
      });
      updateContentById(id, items[index].content).then(res => _saveEditedItemCallback(res, id));
    }
  };

  function removeItem(id: string) {
    deleteItemById(appState.currentProjectId, id).then(res => {
      if ((res as any)?.status === 200) {
        const items = [...tasks];
        const index = tasks && tasks.findIndex((item: Task) => item._id === id);
        index && items.splice(index, 1);
        dispatch({
          type: DispatchTypes.DELETE_TASK,
          payload: { id: appState.currentProjectId, newTasks: items },
        });
      }
    });
  }

  function setItemIsEditable(id: string) {
    const items = [...tasks];
    const index = items.findIndex(item => item._id === id);
    items[index].editing = true;
    dispatch({
      type: DispatchTypes.MARK_TASK_EDITABLE,
      payload: { id: appState.currentProjectId, newTasks: items },
    });
  }

  function toggleMarkAsDone(id: string) {
    const toggledResolve = !tasks.filter((item: Task) => item._id === id)[0].resolved;
    updateResolvedById(id, toggledResolve).then(res => {
      const updatedIdx = tasks.findIndex((itm: Task) => itm._id === id);
      const updatedItems = [...tasks];
      updatedItems[updatedIdx] = { ...res.data, editing: false };
      dispatch({
        type: DispatchTypes.TOGGLE_RESOLVE_TASK,
        payload: { id: appState.currentProjectId, newTasks: updatedItems },
      });
    });
  }

  return (
    <ul css={list}>
      {filteredTasks.map(task => (
        <TaskBox
          task={task}
          _id={task._id}
          key={task._id}
          actions={{
            editItem,
            saveEditedItem,
            setItemIsEditable,
            toggleMarkAsDone,
            removeItem,
          }}
        />
      ))}
    </ul>
  );
};

const list = css`
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.8);
`;
