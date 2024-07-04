export interface User {
  _id: string;
  githubId: string;
  username: string;
  displayName: string;
  profilePic: string;
}

export interface Project {
  _id: string;
  name: string;
  user: string;
  tags: string[];
  tasks: Task[];
}
export interface Task {
  _id: string;
  userId: string;
  projectId: string;
  content: string;
  resolved: boolean;
  editing?: boolean;
}

export enum Filter {
  ALL = "all",
  REMAINED = "remained",
  COMPLETED = "completed",
}

export interface AppState {
  currentProjectId: string;
  currentPage: number;
  totalPages: number;
  projects: Project[];
  tasksFilter: Filter;
}

// Type guard for keyboard events
export const isKeyboardEvent = (
  event: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
): event is React.KeyboardEvent<HTMLInputElement> => {
  return (event as React.KeyboardEvent<HTMLInputElement>).key !== undefined;
};
