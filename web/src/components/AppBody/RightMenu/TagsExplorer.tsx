// import { useState } from "react";
import { css } from "@emotion/react";

// import { Modal } from "~/components/Modals/Modal";

export const TagsExplorer: React.FC = () => {
  // Didn't have time to implement
  return;
  return (
    <div
      css={menuButtonCSS}
      title="Tags Explorer"
    >
      <b css={projectName}>🔖</b>
    </div>
  );
};

const projectName = css`
  color: #868686;
`;

const menuButtonCSS = css`
  cursor: pointer;
  padding: 20px;
  text-align: center;
  width: 17px;
  height: 17px;
  background-color: #f9f9f9;
  border-bottom: 1px solid transparent;
  box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 100px;
  margin-bottom: 5px;
`;
