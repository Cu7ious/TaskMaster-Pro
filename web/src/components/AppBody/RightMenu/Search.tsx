import { useState } from "react";
import { css } from "@emotion/react";

import { search } from "~/API";
import { Modal } from "~/components/Modals/Modal";
import { isSafari } from "~/utils";
import { Project } from "~/context/AppStateContext";

interface SearchResults {
  byProjectName: Project[];
  byTaskContent: Project[];
}

const markedTextCSS = css`
  color: #3d4255;
`;

const highlightSearchQuery = (searchQuery: string, content: string) => {
  if (!searchQuery) {
    return content;
  }

  const regex = new RegExp(searchQuery, "gi");
  const match = content.match(regex);
  if (!match) {
    return content;
  }

  return content.replace(regex, `<mark css=${markedTextCSS}>${match[0]}</mark>`);
};

export const Search: React.FC = () => {
  const [showSearchUI, setShowSearchUI] = useState(false);
  // @ts-ignore
  const [searchQuery, setSearchQuery] = useState("");
  const [showValidationMessage, setValidationMessage] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const handleOpenUI = () => setShowSearchUI(true);
  const handleCloseUI = () => setShowSearchUI(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    search(e.target.value).then(response => {
      console.log(response.data);
      setSearchResults(response.data);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.currentTarget.value.trim() === "") {
        setValidationMessage("Should not be empty");
        return;
      }

      handleSearch(e);
      setValidationMessage("");
    } else if (e.key === "Escape") {
      setSearchQuery("");
      setValidationMessage("");
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
              <div css={validationFlash}>{showValidationMessage && showValidationMessage}</div>
            </label>
            {searchResults && (
              <footer css={searchFooter}>
                <p>By project name:</p>
                <ul css={searchFooterProjects}>
                  {searchResults?.byProjectName?.map(project => (
                    <li key={project._id}>
                      <a
                        href={`/project/${project._id}`}
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchQuery(searchQuery, project.name),
                        }}
                      />
                      <ul css={searchFooterTasks}>
                        {project.tasks.map(task => {
                          return (
                            <li
                              key={task._id}
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchQuery(searchQuery, task.content),
                              }}
                            />
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
                <p>By tasks content:</p>
                <ul css={searchFooterProjects}>
                  {searchResults?.byTaskContent?.map(project => (
                    <li key={project._id}>
                      <a href={`/project/${project._id}`}>{project.name}</a>
                      <ul css={searchFooterTasks}>
                        {project.tasks.map(task => {
                          return (
                            <li
                              key={task._id}
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchQuery(searchQuery, task.content),
                              }}
                            />
                          );
                        })}
                      </ul>
                    </li>
                  ))}
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

  ${isSafari && "font-size: 13px;"}
`;

const searchFooter = css`
  padding: 0;
`;

const searchFooterProjects = css`
  list-style: none;
  padding: 10px 10px 0 10px;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  margin: 0 0 15px 0;

  :last-child {
    margin: 0;
  }
`;
const searchFooterTasks = css`
  list-style: none;
  padding: 10px 10px 5px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  margin: 10px 0 15px;

  li {
    padding: 0 0 5px 0;
    list-style: circle inside;
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

const validationFlash = css`
  margin: 10px 0;
  min-height: 20px;
  color: red;
`;
