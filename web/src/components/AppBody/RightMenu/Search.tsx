import { useState } from "react";
import { css } from "@emotion/react";

import { search } from "~/API";
import { Modal } from "~/components/Modals/Modal";

interface SearchResults {
  projects: any[];
  tasks: any[];
}

export const Search: React.FC = () => {
  const [showSearchUI, setShowSearchUI] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const handleOpenUI = () => setShowSearchUI(true);
  const handleCloseUI = () => setShowSearchUI(false);

  const handleSearch = e => {
    setSearchQuery(e.target.value);
    search(e.target.value).then(response => {
      console.log(response.data);
      setSearchResults(response.data);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.target.value.trim() === "") return;
      handleSearch(e);
    } else if (e.key === "Escape") {
      setSearchQuery("");
    }
  };

  return (
    <>
      <div
        css={menuButtonCSS}
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
            <h3>Search Everywhere</h3>
            <label htmlFor="project-name">
              <input
                id="project-name"
                css={modalInput}
                type="text"
                placeholder="🔎 Type Query"
                autoFocus
                onKeyDown={handleKeyDown}
              />
              {/* <div css={validationFlash}>{nameIsInvalid && "Project name is required"}</div> */}
            </label>
            {searchResults && (
              <footer css={searchFooter}>
                <ul css={searchFooterProjects}>
                  <p>Projects:</p>
                  {searchResults?.projects.length > 0 ? (
                    <ul css={searchFooterTasks}>
                      {searchResults?.projects?.map(project => (
                        <li key={project._id}>{project.name}</li>
                      ))}
                    </ul>
                  ) : (
                    0
                  )}
                  <p>Tasks:</p>
                  {searchResults?.tasks.length > 0 ? (
                    <ul css={searchFooterTasks}>
                      {searchResults?.tasks?.map(task => (
                        <li key={task._id}>{task.content}</li>
                      ))}
                    </ul>
                  ) : (
                    0
                  )}
                  {/*
                  Original Idea:
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
                </li> */}
                </ul>
              </footer>
            )}
          </section>
        </Modal>
      )}
    </>
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

const searchFooter = css`
  padding: 1rem 0 0 0;
`;

const searchFooterProjects = css`
  list-style: none;
  padding: 10px 10px 0 10px;
  border: 1px solid #e5e5e5;
  margin: 0 0 15px 0;

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

const searchBody = css`
  overflow-y: auto;
  max-height: 80vh;
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
