import { css } from "@emotion/react";
import { useAppState } from "~/context/AppStateContext";

interface RightMenuProps {
  children?: React.ReactNode;
}
export const RightMenu: React.FC<RightMenuProps> = ({ children }) => {
  const [appState] = useAppState();
  if (appState.projects.length === 0) return null;
  return <section css={rightMenu}>{children}</section>;
};

const rightMenu = css`
  position: absolute;
  display: grid;
  place-items: center;
  right: -70px;
`;
