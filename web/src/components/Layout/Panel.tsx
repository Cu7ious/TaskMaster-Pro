import { css } from "@emotion/react";

export const Panel: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div css={panel}>
      <h3 css={text}>{title || "Plan Smart, Solve Better"}</h3>
    </div>
  );
};

const panel = css`
  display: flex;
  background-color: rgba(255, 255, 255, 0.8);
  background-color: hsla(0, 0%, 100%, 0.8);
  min-height: 75px;
  line-height: 40px;
  text-align: center;
`;
const text = css`
  width: 100%;
`;
