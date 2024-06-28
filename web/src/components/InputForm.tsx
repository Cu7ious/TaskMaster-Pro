import { css } from "@emotion/react";
import { useContext, useState } from "react";
import { capitalize, Task } from "~/utils";
import { saveAllResolved, createItem } from "~/API/tasks";
import { AppContext } from "~/appState";

interface InputBoxProps {
  hidden?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ hidden }) => {
  const state = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  const isEmpty = state.items.length === 0;

  function markAllAsResolved() {
    const ids = state.items.map(itm => itm._id);
    const resolved = !state.items.every(itm => itm.resolved);
    saveAllResolved(ids, resolved).then(() => {
      const items = state.items.map(itm => {
        itm.resolved = resolved;
        return itm;
      });
      state.setState({ ...state, items });
    });
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createItem(state.projectId, capitalize(inputValue)).then(res => {
        const newItems = [...state.items];
        const newItem: Task = { ...res.data, editing: false };
        newItems.push(newItem);
        state.setState({ ...state, items: newItems });
        setInputValue("");
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

export default InputBox;

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
