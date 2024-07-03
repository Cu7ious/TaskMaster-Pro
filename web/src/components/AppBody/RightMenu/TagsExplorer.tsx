import { useState, SetStateAction } from "react";
import { css } from "@emotion/react";
import { isSafari } from "~/utils";
import { getAllUniqueTags } from "~/API";
import { getProjectsByTag } from "~/API/projects";

import { Modal } from "~/components/Modals/Modal";

interface TagsExplorerProps {
  showTagsExplorer: boolean;
  tags: string[];
  loading: boolean;
  error: string | null;
  handleCloseUI: () => void;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

interface ProjectsLoaderProps {
  projects: any[];
}

const ProjectsLoader: React.FC<ProjectsLoaderProps> = ({ projects }) => {
  if (projects.length === 0) return;
  console.log("projects:", projects);
  return (
    <footer css={searchFooter}>
      <ul css={searchFooterTasks}>
        <h4>Projects:</h4>
        {projects.map((project: any) => {
          return (
            <li key={project._id}>
              <a href={`/project/${project._id}`}>{project.name}</a>
            </li>
          );
        })}
      </ul>
    </footer>
  );
};

const TagsLoader: React.FC<TagsExplorerProps> = ({
  showTagsExplorer,
  tags,
  loading,
  error,
  handleCloseUI,
  handleClick,
  children,
}) => {
  if (loading) return <div css={preDataState}>Loading...</div>;
  if (error) return <div css={preDataState}>Error: {error}</div>;
  return (
    showTagsExplorer && (
      <Modal onClose={handleCloseUI}>
        <section css={searchBody}>
          <button
            onClick={handleCloseUI}
            css={modalCloseBtn}
          >
            ⨯
          </button>
          <h3>Tags Explorer</h3>
          {tags && <p>Number of tags: {tags.length}</p>}
          <ul css={projectTagsCSS}>
            {tags.map((tag, idx) => {
              return (
                <li key={idx}>
                  <button
                    onClick={handleClick}
                    title={tag}
                  >
                    {tag}
                  </button>
                </li>
              );
            })}
          </ul>
          {children}
        </section>
      </Modal>
    )
  );
};

export const TagsExplorer: React.FC = () => {
  const [showTagsExplorer, setShowTagsExplorer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);

  const handleOpenUI = () => {
    setShowTagsExplorer(true);
    setLoading(true);
    getAllUniqueTags()
      .then(response => {
        setTags(response.data);
      })
      .catch((error: { response: { data: { message: SetStateAction<string | null> } } }) => {
        setError(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseUI = () => {
    setShowTagsExplorer(false);
    projects.length > 0 && setProjects([]);
  };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.title);
    getProjectsByTag(e.currentTarget.title)
      .then(response => {
        setLoading(true);
        console.log(response.data);
        setProjects(response.data);
      })
      .catch((error: { response: { data: { message: SetStateAction<string | null> } } }) => {
        setError(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div
        css={menuButtonCSS}
        onClick={handleOpenUI}
        title="Tags Explorer"
      >
        <b css={projectName}>🔖</b>
      </div>
      <TagsLoader
        showTagsExplorer={showTagsExplorer}
        tags={tags}
        loading={loading}
        error={error}
        handleCloseUI={handleCloseUI}
        handleClick={handleClick}
      >
        <ProjectsLoader projects={projects} />
      </TagsLoader>
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
  padding: 1rem 0 0 0;

  h4 {
    margin-top: 0;
  }
`;

const searchFooterTasks = css`
  list-style: none;
  padding: 10px 10px 0 10px;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  margin: 0 0 15px 0;

  li {
    padding: 0 0 5px 0;
  }

  :last-child {
    margin: 0;
    padding: 10px;
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
  transition: color 0.3s linear;

  :hover {
    color: #6b6b6b;
  }
`;

const preDataState = css`
  padding: 22px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
`;

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
