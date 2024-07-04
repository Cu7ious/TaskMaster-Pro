import { useContext } from "react";
import { css } from "@emotion/react";

import { AuthContext } from "~/context/AuthContext";
import { useAppState } from "~/context/AppStateContext";
import { Panel } from "~/components/Layout/Panel";

import { Projects } from "~/components/Projects";

import { RightMenu } from "../RightMenu";
import { Search } from "../RightMenu/Search";
import { TagsExplorer } from "../RightMenu/TagsExplorer";
import { Helmet } from "react-helmet-async";
import Login from "~/components/Auth/Login";
import { Project } from "~/types";

const getCurrentPageName = (id: string, projects: Project[]) => {
  return projects.find(project => project._id === id)?.name;
};

const AppBody: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [appState] = useAppState();

  const currentPageName = getCurrentPageName(appState.currentProjectId, appState.projects);
  const appTitle = "TaskMaster Pro";
  const windowTitle = currentPageName ? `${appTitle}: ${currentPageName}` : appTitle;

  return authContext?.user ? (
    <>
      <Helmet>
        <title>{windowTitle}</title>
      </Helmet>
      <Panel title={windowTitle} />
      <div css={taskMasterApp}>
        <div css={appWrapper}>
          <RightMenu>
            <Search />
            <TagsExplorer />
          </RightMenu>
          <Projects />
        </div>
      </div>
    </>
  ) : (
    <Login />
  );
};

export default AppBody;

const taskMasterApp = css`
  padding: 55px 0 25px;
  display: block;
  text-align: center;
  position: relative;

  @media screen and (max-width: 850px) {
    display: block;
    padding: 8px 5px;
  }

  @media screen and (max-width: 650px) {
    display: block;
    padding: 8px 5px;

    ul li {
      font-size: 20px !important;
    }
  }
`;

const appWrapper = css`
  display: inline-block;
  text-align: initial;
  min-width: 40vw;
  max-width: 60vw;
  // background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;

  @media screen and (max-width: 850px) {
    min-width: 70vw;
  }

  @media screen and (max-width: 650px) {
    min-width: 96.5vw;
  }

  @media screen and (max-width: 400px) {
    min-width: 390px;
    width: 390px;
  }
`;
