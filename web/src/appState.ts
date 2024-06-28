import { createContext } from "react";
import { Filter, TasksState } from "~/utils";

export const defaultState: TasksState = {
  projects: [],
  currentPage: 1,
  totalPages: 1,
  projectId: '',
  filter: Filter.ALL,
  allDone: false,
  items: [],
  setState: () => {},
};

export const AppContext = createContext<TasksState>({
  ...defaultState
});