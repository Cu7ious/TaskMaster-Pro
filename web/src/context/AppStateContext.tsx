import React, { createContext, useReducer, ReactNode, useContext } from "react";
import { AppState, Filter, Project, Task } from "~/types";

export enum DispatchTypes {
  MARK_ALL_TASKS_AS_RESOLVED = "MARK_ALL_TASKS_AS_RESOLVED",
  CREATE_TASK = "CREATE_TASK",
  EDIT_TASK = "EDIT_TASK",
  MARK_TASK_EDITABLE = "MARK_TASK_EDITABLE",
  UNMARK_TASK_EDITABLE = "UNMARK_TASK_EDITABLE",
  TOGGLE_RESOLVE_TASK = "TOGGLE_RESOLVE_TASK",
  DELETE_TASK = "DELETE_TASK",
  CREATE_PROJECT = "CREATE_PROJECT",
  SET_PROJECTS = "SET_PROJECTS",
  SET_PROJECTS_PAGINATED = "SET_PROJECTS_PAGINATED",
  SET_CURRENT_PROJECT = "SET_CURRENT_PROJECT",
  UPDATE_PROJECT = "UPDATE_PROJECT",
  CLEAR_ALL_COMPLETED_TASKS = "CLEAR_ALL_COMPLETED_TASKS",
  SET_FILTER = "SET_FILTER",
}

interface CREATE_TASK_PAYLOAD {
  id: string;
  newTask: Task;
}

interface CreateTaskAction {
  type: DispatchTypes.CREATE_TASK;
  payload: CREATE_TASK_PAYLOAD;
}

type NewTasksPayload =
  | DispatchTypes.EDIT_TASK
  | DispatchTypes.CLEAR_ALL_COMPLETED_TASKS
  | DispatchTypes.DELETE_TASK
  | DispatchTypes.UNMARK_TASK_EDITABLE
  | DispatchTypes.MARK_TASK_EDITABLE
  | DispatchTypes.TOGGLE_RESOLVE_TASK
  | DispatchTypes.MARK_ALL_TASKS_AS_RESOLVED;

interface NEW_TASKS_PAYLOAD {
  id: string;
  newTasks: Task[];
}

interface NewTasksAction {
  type: NewTasksPayload;
  payload: NEW_TASKS_PAYLOAD;
}

interface SET_FILTER_PAYLOAD {
  newFilter: Filter;
}

interface SetFilterAction {
  type: DispatchTypes.SET_FILTER;
  payload: SET_FILTER_PAYLOAD;
}

type ProjectsPayload =
  | DispatchTypes.CREATE_PROJECT
  | DispatchTypes.SET_PROJECTS
  | DispatchTypes.UPDATE_PROJECT;

interface PROJECTS_PAYLOAD {
  newProjects: Project[];
}

interface ProjectsAction {
  type: ProjectsPayload;
  payload: PROJECTS_PAYLOAD;
}
interface SET_PROJECTS_PAGINATED_payload {
  newProjects: Project[];
  currentPage: number;
  totalPages: number;
}

interface PaginatedProjectsAction {
  type: DispatchTypes.SET_PROJECTS_PAGINATED;
  payload: SET_PROJECTS_PAGINATED_payload;
}

interface SetCurrentProjectAction {
  type: DispatchTypes.SET_CURRENT_PROJECT;
  payload: { currentProjectId: AppState["currentProjectId"] };
}

const initialState: AppState = {
  currentProjectId: "",
  currentPage: 1,
  totalPages: 1,
  projects: [],
  tasksFilter: Filter.ALL,
};

type DispatchAction =
  | CreateTaskAction
  | NewTasksAction
  | SetFilterAction
  | ProjectsAction
  | PaginatedProjectsAction
  | SetCurrentProjectAction;

const AppStateContext = createContext<[AppState, React.Dispatch<DispatchAction>]>([
  initialState,
  () => initialState,
]);

const appStateReducer = (state: AppState, action: DispatchAction): AppState => {
  switch (action.type) {
    case DispatchTypes.CREATE_TASK:
      console.log("creating task");
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project._id === action.payload.id) {
            project.tasks.push(action.payload.newTask);
          }
          return project;
        }),
      };
    case DispatchTypes.EDIT_TASK:
      console.log("editing task");
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project._id === action.payload.id) {
            project.tasks = action.payload.newTasks;
          }
          return project;
        }),
      };
    case DispatchTypes.SET_FILTER:
      console.log("filtering tasks");
      return {
        ...state,
        tasksFilter: action.payload.newFilter,
      };
    case DispatchTypes.CLEAR_ALL_COMPLETED_TASKS:
      console.log("clearing all completed tasks");
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project._id === action.payload.id) {
            project.tasks = action.payload.newTasks;
          }
          return project;
        }),
      };
    case DispatchTypes.DELETE_TASK:
      console.log("deleting task");
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project._id === action.payload.id) {
            project.tasks = action.payload.newTasks;
          }
          return project;
        }),
      };
    case DispatchTypes.UNMARK_TASK_EDITABLE:
      console.log("unmarking");
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project._id === action.payload.id) {
            project.tasks = action.payload.newTasks;
          }
          return project;
        }),
      };
    case DispatchTypes.MARK_TASK_EDITABLE:
      console.log("marking");
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project._id === action.payload.id) {
            project.tasks = action.payload.newTasks;
          }
          return project;
        }),
      };
    case DispatchTypes.TOGGLE_RESOLVE_TASK:
      console.log("toggling");
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project._id === action.payload.id) {
            project.tasks = action.payload.newTasks;
          }
          return project;
        }),
      };
    case DispatchTypes.MARK_ALL_TASKS_AS_RESOLVED:
      console.log("marking all as resolved");
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project._id === action.payload.id) {
            project.tasks = action.payload.newTasks;
          }
          return project;
        }),
      };
    case DispatchTypes.CREATE_PROJECT:
      console.log("creating project");
      return {
        ...state,
        currentProjectId: action.payload.newProjects[action.payload.newProjects.length - 1]._id,
        projects: action.payload.newProjects,
      };
    case DispatchTypes.SET_PROJECTS:
      console.log("setting projects");
      return {
        ...state,
        projects: action.payload.newProjects,
      };
    case DispatchTypes.SET_PROJECTS_PAGINATED:
      console.log("setting paginated projects");
      return {
        ...state,
        currentProjectId: action.payload?.newProjects[0]?._id,
        projects: action.payload.newProjects,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      };
    case DispatchTypes.SET_CURRENT_PROJECT:
      console.log("setting current project");
      return {
        ...state,
        currentProjectId: action.payload.currentProjectId,
      };
    case DispatchTypes.UPDATE_PROJECT:
      console.log("updating project");
      return {
        ...state,
        projects: action.payload.newProjects,
      };
    default:
      return state;
  }
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  return <AppStateContext.Provider value={[state, dispatch]}>{children}</AppStateContext.Provider>;
};

// "@ts-expect-warning no chance to export this from anywhere else"
export const useAppState = () => useContext(AppStateContext);
