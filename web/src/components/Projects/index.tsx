import { MouseEvent } from "react";
import { useContext, useEffect, useState, useRef } from "react";
import { isAxiosError } from "axios";
import { css } from "@emotion/react";
import { isSafari } from "~/utils";

import { THEME_COLORS } from "~/themeProvider";
import { AuthContext } from "~/components/auth/AuthContext";
import { useAppState, Task } from "~/context/AppStateContext";
import { capitalize } from "~/utils";

import { Modal } from "~/components/Modals/Modal";
import { EditionModal } from "~/components/Modals/EditionModal";
import { ConfirmDeletionModal } from "~/components/Modals/ConfirmDeletionModal";

import {
  createProject,
  getAllProjectsPaginated,
  updateProjectById,
  deleteProjectById,
} from "~/API/projects";

import { Tasks } from "~/components/Tasks";
import TasksControls from "~/components/Tasks/TasksControls";
import TaskCreator from "~/components/Tasks/TasksCreator";

interface ProjectData {
  _id: string;
  name: string;
  tags?: string[];
  tasks?: string[];
}

const REMOVE_SPACES = /\s+/g;
const REMOVE_SPECIAL_CHARS = /[^\w\s]/g;

import { getProjectTasks } from "~/utils";

export const Projects: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [appState, dispatch] = useAppState();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Pager
  const [currentPage, setCurrentPage] = useState(appState.currentPage);

  // Creation Modal
  const [creationModal, setCreationShowModal] = useState(false);
  const [nameIsInvalid, setNameIsInvalid] = useState(false);
  const [tagsAreInvalid, setTagsAreInvalid] = useState(false);
  const projectNameRef = useRef<HTMLInputElement>(null);
  const projectTagsRef = useRef<HTMLInputElement>(null);

  const [editionModal, setEditionModal] = useState(false);

  // Deletion Modal
  const [confirmDeletionModal, setConfirmDeletionModal] = useState(false);
  const [toDelete, setToDelete] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllProjectsPaginated(currentPage);
        if (response.data.projects.length > 0) {
          dispatch({ type: "SET_PROJECTS_PAGINATED", payload: response.data });
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
    let name: string = "";
    let tags: string[] = [];

    if (projectNameRef.current && projectNameRef.current.value.trim() === "") {
      setNameIsInvalid(true);
      return;
    }

    if (projectTagsRef.current) {
      try {
        tags = Array.from(
          new Set(
            projectTagsRef.current.value
              .trim()
              .split(",")
              .filter(tag => tag !== "" && tag !== " ")
              .map(tag => tag.trim().replace(REMOVE_SPACES, "_").replace(REMOVE_SPECIAL_CHARS, ""))
          )
        );
      } catch (err) {
        setTagsAreInvalid(true);
        return;
      }
    }

    name = capitalize(projectNameRef.current?.value as string);
    createProject(name, tags).then(res => {
      const newProjects: ProjectData[] = !appState.projects.length
        ? [res.data]
        : [...appState.projects, res.data];

      if (projectNameRef.current) projectNameRef.current.value = "";
      dispatch({ type: "CREATE_PROJECT", payload: newProjects });
      setCreationShowModal(false);
    });
  };

  const handleSwitchCurrentProject = (id: any) => {
    dispatch({ type: "SET_CURRENT_PROJECT", payload: id });
  };

  const handleOpenProjectModal = () => {
    setCreationShowModal(true);
  };

  const handleCloseProjectModal = () => {
    setNameIsInvalid(false);
    setCreationShowModal(false);
  };

  const handleOpenEditProjectModal = () => {
    setEditionModal(true);
  };

  const handleCloseEditProjectModal = () => {
    setEditionModal(false);
  };
  const handleUpdateProject = (name: string, tags: string) => {
    const validTags = Array.from(
      new Set(
        tags
          .trim()
          .split(",")
          .filter(tag => tag !== "" && tag !== " ")
          .map(tag => tag.trim().replace(REMOVE_SPACES, "_").replace(REMOVE_SPECIAL_CHARS, ""))
      )
    );

    updateProjectById(appState.currentProjectId, name, validTags).then(res => {
      const payload = appState.projects.map(proj => {
        if (proj._id === appState.currentProjectId) {
          proj.name = name;
          proj.tags = validTags;
        }
        return proj;
      });
      dispatch({ type: "UPDATE_PROJECT", payload });
      console.log(res.data);
      console.log("handleUpdateProject:", name, tags);
      setEditionModal(false);
    });
  };

  const handleCloseDeletionModal = () => {
    setConfirmDeletionModal(false);
  };

  const callConfirmedProjectDeletion = (id: ProjectData["_id"]) => {
    deleteProjectById(id).then(() => {
      const remainingProjects = appState.projects?.filter(proj => proj._id !== id);

      if (appState.currentProjectId === id && remainingProjects.length > 0) {
        dispatch({
          type: "SET_CURRENT_PROJECT",
          payload: remainingProjects[remainingProjects.length - 1]._id,
        });
      }

      dispatch({ type: "SET_PROJECTS", payload: remainingProjects });
      setToDelete("");
      setConfirmDeletionModal(false);
    });
  };

  const handleDeleteProject = (id: ProjectData["_id"], e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const tasks: Task[] = getProjectTasks(id, appState.projects);
    console.log("tasks: ", tasks);

    if (tasks.length > 0 && tasks.find(el => el.resolved === false)) {
      setToDelete(id);
      setConfirmDeletionModal(true);
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

  const activeProjectData = appState.projects.find(proj => proj._id === appState.currentProjectId);
  const projectTags = activeProjectData?.tags || [];

  return (
    <>
      <section css={projectCSS}>
        <ul css={projectsTabs}>
          <div css={leftMenu}>
            <div
              css={menuButtonCSS}
              title="Create New Project"
              onClick={handleOpenProjectModal}
            >
              <b css={projectName}>➕</b>
            </div>
            {appState.projects.length > 0 && (
              <div
                css={[menuButtonCSS, editProject]}
                title="Edit Project"
                onClick={handleOpenEditProjectModal}
              >
                <b css={projectName}>✍🏻</b>
              </div>
            )}
          </div>
          {appState.projects.map(proj => {
            const clsName = proj._id === appState.currentProjectId ? "active" : "non-active";
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
        <ul css={projectTagsCSS}>
          {projectTags.map((tag, idx) => {
            return (
              <li key={idx}>
                <button title={tag}>{tag}</button>
              </li>
            );
          })}
        </ul>
      </section>
      {creationModal && (
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
      {editionModal && (
        <EditionModal
          projectName={appState.projects.find(proj => proj._id === appState.currentProjectId)?.name}
          projectTags={projectTags}
          onClose={handleCloseEditProjectModal}
          onSubmit={handleUpdateProject}
        />
      )}
      {confirmDeletionModal && (
        <ConfirmDeletionModal
          onClose={handleCloseDeletionModal}
          onSubmit={() => callConfirmedProjectDeletion(toDelete)}
        />
      )}
      {appState.projects.length > 0 && (
        <main css={projectBody}>
          <TaskCreator />
          <Tasks />
          <TasksControls />
          <div css={paginatorCSS}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              {"< Prev"}
            </button>
            <span>
              Page {currentPage} of {appState.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === appState.totalPages}
            >
              {"Next >"}
            </button>
          </div>
        </main>
      )}
    </>
  );
};

const projectTagsCSS = css`
  list-style: none;
  padding: 1px;
  margin: 0;
  display: inline-block;
  min-height: 21px;

  li {
    display: inline-block;
    padding: 2px 1px;
  }

  button {
    cursor: pointer;
    color: #000;
    background-color: #eee;
    border-radius: 2px;
    border: 1px solid #bababa;
    padding: 1px 6px;
    font-size: 14px;
  }

  button:hover {
    background-color: #dedede;
  }

  button:active {
    background-color: #fff;
  }
`;

const preDataState = css`
  padding: 22px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
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

  ${isSafari && "font-size: 13px;"}
`;

const projectBody = css`
  margin: 0;
  padding: 0;
  position: relative;
`;

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

const leftMenu = css`
  position: absolute;
  display: grid;
  place-items: center;
  left: -70px;
`;

const editProject = css`
  padding: 12px;
`;

const validationFlash = css`
  margin: 10px 0;
  min-height: 20px;
  color: red;
`;

const projectDeleteBtn = css`
  color: #868686;
  cursor: pointer;
  font-size: 25px;
  padding: 0;
  border: none;
  background-color: transparent;
  transition: background-color 0.8s ease;

  :hover {
    color: #b51818;
    background-image: linear-gradient(to left, #ff000010, #ff000001);
  }
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
  transition: color 0.3s linear;

  :hover {
    color: #6b6b6b;
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

const footerCSS = css`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0 0 0;
`;

const footerButtonCreate = css`
  background-color: ${THEME_COLORS.WORKDAY_BLUE.MAIN_COLOR};
  border-bottom: 2px solid ${THEME_COLORS.WORKDAY_BLUE.MAIN_COLOR_DARK};
`;
