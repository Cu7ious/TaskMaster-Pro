import React, { createContext, useReducer, ReactNode, useContext } from "react";
import { AppState, Filter } from "~/types";

const initialState: AppState = {
  currentProjectId: "",
  currentPage: 1,
  totalPages: 1,
  projects: [],
  tasksFilter: Filter.ALL,
};

const AppStateContext = createContext<[AppState, React.Dispatch<any>]>([
  initialState,
  () => initialState,
]);

const MARK_ALL_TASKS_AS_RESOLVED = "MARK_ALL_TASKS_AS_RESOLVED";
const CREATE_TASK = "CREATE_TASK";
const EDIT_TASK = "EDIT_TASK";
const MARK_TASK_EDITABLE = "MARK_TASK_EDITABLE";
const UNMARK_TASK_EDITABLE = "UNMARK_TASK_EDITABLE";
const TOGGLE_RESOLVE_TASK = "TOGGLE_RESOLVE_TASK";
const DELETE_TASK = "DELETE_TASK";
const CREATE_PROJECT = "CREATE_PROJECT";
const SET_PROJECTS = "SET_PROJECTS";
const SET_PROJECTS_PAGINATED = "SET_PROJECTS_PAGINATED";
const SET_CURRENT_PROJECT = "SET_CURRENT_PROJECT";
const UPDATE_PROJECT = "UPDATE_PROJECT";
const CLEAR_ALL_COMPLETED_TASKS = "CLEAR_ALL_COMPLETED_TASKS";
const SET_FILTER = "SET_FILTER";

const appStateReducer = (state: AppState, action: any): AppState => {
  switch (action.type) {
    case CREATE_TASK:
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
    case EDIT_TASK:
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
    case SET_FILTER:
      console.log("filtering tasks");
      return {
        ...state,
        tasksFilter: action.payload.newFilter,
      };
    case CLEAR_ALL_COMPLETED_TASKS:
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
    case DELETE_TASK:
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
    case UNMARK_TASK_EDITABLE:
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
    case MARK_TASK_EDITABLE:
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
    case TOGGLE_RESOLVE_TASK:
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
    case MARK_ALL_TASKS_AS_RESOLVED:
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
    case CREATE_PROJECT:
      console.log("creating project");
      return {
        ...state,
        currentProjectId: action.payload[action.payload.length - 1]._id,
        projects: action.payload,
      };
    case SET_PROJECTS:
      console.log("setting projects");
      return {
        ...state,
        projects: action.payload,
      };
    case SET_PROJECTS_PAGINATED:
      console.log("setting paginated projects");
      return {
        ...state,
        currentProjectId: action.payload?.projects[0]?._id,
        projects: action.payload.projects,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      };
    case SET_CURRENT_PROJECT:
      console.log("setting current project");
      return {
        ...state,
        currentProjectId: action.payload,
      };
    case UPDATE_PROJECT:
      console.log("updating project");
      return {
        ...state,
        projects: action.payload,
      };
    default:
      return state;
  }
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  return <AppStateContext.Provider value={[state, dispatch]}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => useContext(AppStateContext);
