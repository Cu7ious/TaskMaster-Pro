import { css } from "@emotion/react";
import { useContext, useState } from "react";
import { capitalize } from "~/utils";
import { saveAllResolved, createItem } from "~/API/tasks";
import { useAppState } from "~/context/AppStateContext";
import { AuthContext } from "~/components/auth/AuthContext";

interface TasksCreatorProps {
  hidden?: boolean;
}

import { getProjectTasks } from "~/utils";

const TasksInput: React.FC<TasksCreatorProps> = ({ hidden }) => {
  const [appState, dispatch] = useAppState();

  const auth = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const projectTasks = getProjectTasks(appState.currentProjectId, appState.projects);
  const isEmpty = projectTasks.length === 0;

  function markAllAsResolved() {
    const ids = projectTasks.map(itm => itm._id);
    const resolved = !projectTasks.every(itm => itm.resolved);
    saveAllResolved(ids, resolved).then(() => {
      console.log("resolved:", resolved);
      dispatch({
        type: "MARK_ALL_TASKS_AS_RESOLVED",
        payload: {
          id: appState.currentProjectId,
          newTasks: projectTasks.map(itm => {
            return { ...itm, resolved };
          }),
        },
      });
    });
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.trim() === "") return;
      createItem(auth?.user?._id, appState.currentProjectId, capitalize(inputValue)).then(res => {
        setInputValue("");
        dispatch({
          type: "CREATE_TASK",
          payload: {
            id: appState.currentProjectId,
            newTask: { ...res.data, editing: false },
          },
        });
      });
    } else if (e.key === "Escape") {
      setInputValue("");
    }
  };

  if (hidden) return;
  return (
    <div css={inputForm}>
      {!isEmpty && (
        <span
          css={control}
          onClick={markAllAsResolved}
        >
          &#x025BE;
        </span>
      )}
      <input
        name="tasks-creator"
        placeholder="Create new task"
        value={inputValue}
        autoFocus={true}
        css={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="text"
      />
    </div>
  );
};

export default TasksInput;

const inputForm = css`
  display: inline-block;
  padding-top: 10px;
  width: 100%;
  color: #bbb;
  font: 16px monospace;
  box-shadow: inset 0 -4px 5px 0 rgba(0, 0, 0, 0.08);
  background-color: rgba(255, 255, 255, 0.8);
  height: 55px;
`;

const control = css`
  position: absolute;
  margin-left: 20px;
  margin-top: 3px;
  font-size: 30px;
  display: inline-block;
  transition: color 0.3s linear;
  cursor: pointer;

  &:hover {
    color: #909090;
  }
`;

const input = css`
  outline: none;
  box-sizing: border-box;
  width: 100%;
  color: #3d4255;
  border: 0;
  height: 40px;
  padding: 0 0 0 62px;
  background: rgba(0, 0, 0, 0);
  font-size: 30px;
  font-weight: 100;

  ::placeholder {
    color: #c3c3c3;
  }
`;
