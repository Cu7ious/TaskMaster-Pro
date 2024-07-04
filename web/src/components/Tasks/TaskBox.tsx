import { css } from "@emotion/react";
import { useState } from "react";

import { Task } from "~/types";

interface UITask extends Task {
  editing?: boolean;
}

interface TaskBoxActions {
  editItem: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  saveEditedItem: (
    id: string,
    e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>
  ) => void;
  setItemIsEditable: (id: string) => void;
  toggleMarkAsDone: (id: string) => void;
  removeItem: (id: string) => void;
}

interface TaskBoxProps {
  task: UITask;
  _id: string;
  actions: TaskBoxActions;
}

function renderSVG(isDone: boolean) {
  const circleColor = isDone ? "#bddad5" : "rgba(0, 0, 0, 0.1)";
  return (
    <svg
      width="36"
      height="36"
      viewBox="-10 -18 100 135"
    >
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="none"
        stroke={circleColor}
        strokeWidth="3"
      />
      {isDone && (
        <path
          fill="#5dc2af"
          d="M72 25L42 71 27 56l-4 4 20 20 34-52z"
        />
      )}
    </svg>
  );
}

function renderRemoveButton(_id: string, action: TaskBoxActions["removeItem"]) {
  return (
    <span
      css={remove}
      onClick={() => action(_id)}
    >
      &#x000D7;
    </span>
  );
}

export const TaskBox = (props: TaskBoxProps) => {
  const [hover, setHover] = useState(false);
  const toggleHover = () => setHover(!hover);

  return props.task.editing ? (
    <input
      css={input}
      autoFocus={true}
      value={props.task.content}
      type="text"
      onChange={e => props.actions.editItem(props._id, e)}
      onKeyDown={e => props.actions.saveEditedItem(props._id, e)}
      onBlur={e => props.actions.saveEditedItem(props._id, e)}
    />
  ) : (
    <li
      css={[listItem, props.task.resolved && isDone]}
      onDoubleClick={() => props.actions.setItemIsEditable(props._id)}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      <span
        css={toggleDone}
        onClick={() => props.actions.toggleMarkAsDone(props._id)}
      >
        {renderSVG(props.task.resolved)}
      </span>
      <span css={textWrapper}>{props.task.content}</span>
      {hover && renderRemoveButton(props._id, props.actions.removeItem)}
    </li>
  );
};

const input = css`
  outline: none;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  height: 56px;
  font-size: 30px;
  font-weight: 100;
  line-height: 40px;
  padding: 0 0 0 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 0;
  border-right: 0;
  border-left: 0;
`;

const textWrapper = css`
  padding: 0 60px;
  width: 100%;
  box-sizing: border-box;
  display: block;
`;

const toggleDone = css`
  position: absolute;
  color: transparent;
  border-radius: 50px;
  display: inline-block;
  width: 36px;
  height: 36px;
  margin: 8px 0 0 10px;
  text-align: center;
  line-height: 38px;
`;

const listItem = css`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-height: 55px;
  font-size: 30px;
  font-weight: 100;
  line-height: 55px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const isDone = css`
  text-decoration: line-through;
  color: #bbb;
`;

const remove = css`
  color: rgba(181, 24, 24, 0.7);
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 20px;

  &:hover {
    color: rgba(181, 24, 24, 1);
  }
`;
