import { MouseEvent, ReactNode } from "react";
import { css } from "@emotion/react";
import { useContext, useEffect, useState, useRef } from "react";
import { isAxiosError } from "axios";

import { AppContext } from "~/appState";
import { ThemeProvider, THEME_COLORS } from "~/themeProvider";
import { TasksState, capitalize } from "~/utils";

import AppControls from "./components/Controls";
import InputForm from "./components/InputForm";
import Header from "./components/Layout/Header";
import Panel from "./components/Layout/Panel";
import Sidebar from "./components/Layout/Sidebar";
import ThemeSwitcher from "./components/Layout/ThemeSwitcher";
import Tasks from "./components/Tasks";
import ReactDOM from "react-dom";

import { createProject, getAllProjectsPaginated, deleteProjectById } from "./API/projects";

interface ModalProps {
  onClose: () => void;
  children?: ReactNode;
  onDelete?: () => void;
}
const modalRoot = document.getElementById("modal-root");

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (e.type === "keyup" && e.code === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keyup", callback);
    return () => {
      window.removeEventListener("keyup", callback);
    };
  });

  if (modalRoot) {
    return ReactDOM.createPortal(
      <>
        <div css={modalCSS}>{children}</div>
        <div
          onClick={onClose}
          css={modalOverlay}
        />
      </>,
      modalRoot
    );
  }
};

const paginatorCSS = css`
  color: #7b7b7b;
  font-size: 12px;
  padding: 16px;
  display: flex;
  justify-content: center;

  span {
    margin: 3px; 6px 0 6px;
  }

  button {
    font-size: 12px;
    padding: 3px 9px;
    margin: 0;
    border: 0;
    cursor: pointer;
    border-radius: 2px;
  }
  
  button:hover {
    background-color: #fff;
  }
  
  button[disabled] {
    cursor: not-allowed;
  }
`;

const footerCSS = css`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0 0 0;
`;

const searchFooter = css`
  padding: 1rem 0 0 0;
`;

const searchFooterProjects = css`
  list-style: none;
  padding: 10px 10px 0 10px;
  border: 1px solid #e5e5e5;
  margin: 0 0 15px 0;

  // li {
  // }

  :last-child {
    margin: 0;
  }
`;
const searchFooterTasks = css`
  list-style: none;
  padding: 10px 10px 0 10px;
  border: 1px solid #e5e5e5;
  margin: 0 0 15px 0;

  li {
    padding: 0 0 5px 0;
  }
`;

const footerButton = css`
  margin: 0 3px;
  padding: 10px 25px;
  border: 0;
  cursor: pointer;
  outline: none;
  transition: background-color 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  box-shadow: rgba(0, 0, 0, 0.117647) 0 1px 4px, rgba(0, 0, 0, 0.117647) 0 1px 2px;
  border-radius: 2px;
  border-bottom: 2px solid ${"#d8d8d8"};
  color: #fff;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.117647) 0 0;
  }
`;

const footerButtonCancel = css`
  color: #000;
  background-color: #fff;
`;
const footerButtonCreate = css`
  background-color: ${THEME_COLORS.WORKDAY_BLUE.MAIN_COLOR};
  border-bottom: 2px solid ${THEME_COLORS.WORKDAY_BLUE.MAIN_COLOR_DARK};
`;

const confirmDeletionButtonCreate = css`
  background-color: ${THEME_COLORS.ANGULAR_RED.MAIN_COLOR};
  border-bottom: 2px solid ${THEME_COLORS.ANGULAR_RED.MAIN_COLOR_DARK};
`;

const preDataState = css`
  padding: 22px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
`;

interface ProjectProps {
  children: ReactNode;
}

interface ProjectData {
  _id: string;
  name: string;
  tags?: string[];
  tasks?: string[];
}

const ConfirmDeletionModal: React.FC<ModalProps> = ({ onClose, onDelete }) => {
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (e.type === "keyup" && e.code === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keyup", callback);
    return () => {
      window.removeEventListener("keyup", callback);
    };
  });

  if (modalRoot) {
    return ReactDOM.createPortal(
      <>
        <div css={modalCSS}>
          <button
            onClick={onClose}
            css={modalCloseBtn}
          >
            ⨯
          </button>
          <h3>Confirm Deletion</h3>
          <h4>The project has unsolved tasks. Delete anyway?</h4>
          <footer css={footerCSS}>
            <button
              onClick={onClose}
              css={[footerButton, footerButtonCancel]}
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              css={[footerButton, confirmDeletionButtonCreate]}
            >
              Delete
            </button>
          </footer>
        </div>
        <div
          onClick={onClose}
          css={modalOverlay}
        />
      </>,
      modalRoot
    );
  }
};

const Projects: React.FC<ProjectProps> = ({ children }) => {
  const appState = useContext(AppContext);

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Pager
  const [currentPage, setCurrentPage] = useState(appState.currentPage);
  const [totalPages, setTotalPages] = useState(appState.totalPages);

  // Creation Modal
  const [showModal, setShowModal] = useState(false);
  const [nameIsInvalid, setNameIsInvalid] = useState(false);
  const [tagsAreInvalid, setTagsAreInvalid] = useState(false);

  // Deletion Modal
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [toDelete, setToDelete] = useState("");

  const projectNameRef = useRef<HTMLInputElement>(null);
  const projectTagsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllProjectsPaginated(currentPage);
        if (response.data.projects.length > 0) {
          console.log("currentPage:", response.data.currentPage);
          console.log("totalPages:", response.data.totalPages);

          appState.setState &&
            appState.setState({
              ...appState,
              projectId: response.data.projects[0]._id,
              projects: response.data.projects,
              currentPage: response.data.currentPage,
              totalPages: response.data.totalPages,
            });
          setProjects(response.data.projects);
          setTotalPages(response.data.totalPages);
          setActive(response.data.projects[0]._id);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleCreateNewProject = () => {
    if (projectNameRef.current && projectNameRef.current.value.trim() === "") {
      setNameIsInvalid(true);
      return;
    }

    const name = capitalize(projectNameRef.current?.value as string);
    const tags: string[] = [];
    createProject(name, tags).then(res => {
      const newProjects: ProjectData[] = !projects.length ? [res.data] : [...projects, res.data];

      if (projectNameRef.current) projectNameRef.current.value = "";
      setProjects(newProjects);
      setActive(res.data._id);
      appState.setState({ ...appState, projectId: res.data._id });
      setShowModal(false);
    });
  };

  const handleSwitchCurrentProject = (id: any) => {
    setActive(id);
    appState.setState({ ...appState, projectId: id });
    // console.log("handleSwitchCurrentProject id:", id);
  };

  const handleOpenProjectModal = () => {
    setShowModal(true);
  };

  const handleCloseProjectModal = () => {
    setNameIsInvalid(false);
    setShowModal(false);
  };

  // const handleOpenDeletionModal = () => {
  //   setConfirmationModal(true);
  // };

  const handleCloseDeletionModal = () => {
    setConfirmationModal(false);
  };

  const callConfirmedProjectDeletion = (id: ProjectData["_id"]) => {
    deleteProjectById(id).then(() => {
      const remainingProjects = projects?.filter(proj => proj._id !== id);
      if (active === id && remainingProjects.length > 0) {
        setActive(remainingProjects[remainingProjects.length - 1]._id);
        appState.setState &&
          appState.setState({
            ...appState,
            projectId: remainingProjects[remainingProjects.length - 1]._id,
          });
      }
      setProjects(remainingProjects);
      setToDelete("");
      setConfirmationModal(false);
    });
  };

  const handleDeleteProject = (id: ProjectData["_id"], e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (appState.items.length > 0 && appState.items.find(el => el.resolved === false)) {
      setToDelete(id);
      setConfirmationModal(true);
    } else {
      console.log("Project has no tasks, or all of it's tasks has been resolved");
      callConfirmedProjectDeletion(id);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  if (loading) return <div css={preDataState}>Loading...</div>;
  if (error) return <div css={preDataState}>Error: {error}</div>;

  return (
    <>
      <section css={projectCSS}>
        <ul css={projectsTabs}>
          <li
            title="Create New Project"
            onClick={handleOpenProjectModal}
          >
            <b css={projectName}>➕</b>
          </li>
          {projects.length > 0 &&
            projects.map(proj => {
              const clsName = proj._id === active ? "active" : "non-active";
              return (
                <li
                  onClick={() => handleSwitchCurrentProject(proj._id)}
                  className={clsName}
                  key={proj._id}
                >
                  <span title={proj.name}>{proj.name}</span>
                  <button
                    title="Delete Project"
                    onClick={event => handleDeleteProject(proj._id, event)}
                    css={projectDeleteBtn}
                  >
                    ⨯
                  </button>
                </li>
              );
            })}
        </ul>
      </section>
      {showModal && (
        <Modal onClose={handleCloseProjectModal}>
          <button
            css={modalCloseBtn}
            onClick={handleCloseProjectModal}
          >
            ⨯
          </button>
          <h3>Create New Project</h3>
          <label htmlFor="project-name">
            <input
              id="project-name"
              ref={projectNameRef}
              css={modalInput}
              type="text"
              placeholder="Project Name"
              autoFocus
            />
            <div css={validationFlash}>{nameIsInvalid && "Project name is required"}</div>
          </label>
          <label htmlFor="project-tags">
            <input
              id="project-tags"
              ref={projectTagsRef}
              css={modalInput}
              type="text"
              placeholder="Project Tags, Separated by Comma (Optional)"
            />
            <div css={validationFlash}>
              {tagsAreInvalid && "Wrong format, use tag1, tag2, etc."}
            </div>
          </label>
          <footer css={footerCSS}>
            <button
              css={[footerButton, footerButtonCancel]}
              onClick={handleCloseProjectModal}
            >
              Cancel
            </button>
            <button
              css={[footerButton, footerButtonCreate]}
              onClick={handleCreateNewProject}
            >
              Create
            </button>
          </footer>
        </Modal>
      )}
      {confirmationModal && (
        <ConfirmDeletionModal
          onClose={handleCloseDeletionModal}
          onDelete={() => callConfirmedProjectDeletion(toDelete)}
        />
      )}
      {projects.length > 0 && (
        <main css={projectBody}>
          {children}
          <div css={paginatorCSS}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              {"< Prev"}
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              {"Next >"}
            </button>
          </div>
        </main>
      )}
    </>
  );
};

export default function App() {
  const [state, setState] = useState<TasksState>(useContext<TasksState>(AppContext));
  const [activePanel, setActivePanel] = useState(false);

  function setActivePanelEffect(value: boolean) {
    document.body.classList.toggle("global-sidebar-is-active");
    setActivePanel(value);
  }

  // Global Sidebar
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (activePanel && e.type === "keyup" && e.code === "Escape") {
        setActivePanelEffect(false);
      }
    }
    window.addEventListener("keyup", callback);
    return () => {
      window.removeEventListener("keyup", callback);
    };
  }, [activePanel]);

  return (
    <ThemeProvider>
      <Header setActivePanel={setActivePanelEffect} />
      {/* <ThemeSwitcher /> */}
      <AppContext.Provider value={{ ...state, setState }}>
        <Sidebar
          activePanel={activePanel}
          setActivePanel={setActivePanelEffect}
        />
        <Panel />
        <div css={taskMasterApp}>
          <div css={appWrapper}>
            <Projects>
              <Switches>
                <Search />
                <TagsExplorer />
                <Settings />
              </Switches>
              <InputForm />
              <Tasks />
              <AppControls />
            </Projects>
          </div>
        </div>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

const Switches: React.FC<any> = ({ children }: any) => (
  <section css={switchesCSS}>{children}</section>
);

const switchesCSS = css`
  position: relative;
`;

const Settings: React.FC = () => {
  return (
    <div
      css={settingsCSS}
      title="Settings"
    >
      <b css={projectName}>⚙️</b>
    </div>
  );
};

const TagsExplorer: React.FC = () => {
  return (
    <div
      css={tagsExplorer}
      title="Tags Explorer"
    >
      <b css={projectName}>🔖</b>
    </div>
  );
};

const Search: React.FC = () => {
  const [showSearchUI, setShowSearchUI] = useState(false);

  const handleOpenUI = () => setShowSearchUI(true);
  const handleCloseUI = () => setShowSearchUI(false);

  return (
    <>
      <div
        css={searchCSS}
        title="Search"
        onClick={handleOpenUI}
      >
        <b css={projectName}>🔎</b>
      </div>
      {showSearchUI && (
        <Modal onClose={handleCloseUI}>
          <section css={searchBody}>
            <button
              onClick={handleCloseUI}
              css={modalCloseBtn}
            >
              ⨯
            </button>
            <h3>Search Tasks</h3>
            <label htmlFor="project-name">
              <input
                id="project-name"
                css={modalInput}
                type="text"
                placeholder="🔎 Type Query"
                autoFocus
              />
              {/* <div css={validationFlash}>{nameIsInvalid && "Project name is required"}</div> */}
            </label>
            <footer css={searchFooter}>
              <ul css={searchFooterProjects}>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
                <li>
                  <p>
                    Project: <a href="#link-to-project-pageFound">Found Project Name</a>
                  </p>
                  <ul css={searchFooterTasks}>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                    <li>Found Task</li>
                  </ul>
                </li>
              </ul>
            </footer>
          </section>
        </Modal>
      )}
    </>
  );
};

const validationFlash = css`
  margin: 10px 0;
  min-height: 20px;
  color: red;
`;

const modalCSS = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 45vw;
  min-height: 15vh;
  background-color: #fff;
  padding: 33px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

const modalOverlay = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0;
  cursor: pointer;
  -webkit-transition: visibility, opacity 0.5s ease-in-out;
  transition: visibility, opacity 0.5s ease-in-out;
  visibility: visible;
  z-index: 1;
  opacity: 0.6;
`;

const modalCloseBtn = css`
  position: absolute;
  top: 0;
  right: 15px;
  padding: 0;
  border: 0;
  color: #a9a9a9;
  background-color: transparent;
  font-size: 32px;
  cursor: pointer;
  outline: none;
  -webkit-transition: color 0.3s linear;
  transition: color 0.3s linear;

  :hover {
    color: #6b6b6b;
  }
`;

const modalInput = css`
  outline: none;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  height: 56px;
  font-size: 18px;
  font-weight: 100;
  line-height: 40px;
  padding: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 0;
  border-right: 0;
  border-left: 0;
`;

const projectCSS = css`
  min-height: 60px;
  padding: 0;
  background-color: #f3f3f3;
  width: 60vw;
`;

const projectsTabs = css`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 0;
  position: relative;

  li {
    text-align: center;
    padding: 0;
    cursor: pointer;
    background-color: #f9f9f9;
    text-decoration: none;
    border-bottom: 1px solid #0165c757;
    box-sizing: border-box;
    position: relative;
    display: grid;
    grid-template-columns: 80% 20%;
    transition: background-color 0.6s ease;
  }

  li.non-active {
    background-color: #f3f3f3;
  }

  li span {
    display: inline-block;
    padding: 25px 5px 20px 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  li:first-of-type {
    position: absolute;
    padding: 20px;
    width: 57px;
    height: 58px;
    left: -70px;
    border-bottom: 1px solid transparent;
    box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.1);
    border-radius: 100px;
    display: initial;
    text-align: center;
  }

  li:hover {
    background-color: #fff;
  }

  li.active::before {
    content: "";
    position: absolute;
    top: -3;
    right: 0;
    bottom: 0;
    left: 0;
    margin-bottom: -1px;
    border-bottom: 3px solid #0165c7b0;
    border-radius: 4px 4px 0 0;
    pointer-events: none;
    box-sizing: border-box;
  }
`;

const projectDeleteBtn = css`
  // color: #b51818b3;
  color: #868686;
  cursor: pointer;
  font-size: 28px;
  padding: 0;
  border: none;
  background-color: transparent;
  transition: background-color 0.8s ease;

  :hover {
    color: #b51818;
    background-image: linear-gradient(to left, #ff000010, #ff000001);
  }
`;

const projectName = css`
  // text-shadow: 1px 1px 15px #000000a1;
  color: #868686;
`;

const searchCSS = css`
  position: absolute;
  cursor: pointer;
  padding: 20px;
  text-align: center;
  width: 17px;
  height: 17px;
  top: 1px;
  left: -70px;
  background-color: #f9f9f9;
  border-bottom: 1px solid transparent;
  box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 100px;
`;

const searchBody = css`
  overflow-y: auto;
  max-height: 80vh;
`;

const tagsExplorer = css`
  position: absolute;
  cursor: pointer;
  padding: 20px;
  text-align: center;
  width: 17px;
  height: 17px;
  top: 66px;
  left: -70px;
  background-color: #f9f9f9;
  border-bottom: 1px solid transparent;
  box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 100px;
`;

const settingsCSS = css`
  position: absolute;
  cursor: pointer;
  padding: 20px;
  text-align: center;
  width: 17px;
  height: 17px;
  top: calc(66px * 2);
  left: -70px;
  background-color: #f9f9f9;
  border-bottom: 1px solid transparent;
  box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 100px;
`;

const projectBody = css`
  margin: 0;
  padding: 0;
  position: relative;
`;

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
