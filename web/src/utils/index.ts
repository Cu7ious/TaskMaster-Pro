export enum Filter {
  ALL = "all",
  REMAINED = "remained",
  COMPLETED = "completed",
}

export interface TasksState {
  projects: Project[];
  currentPage: number;
  totalPages: number;

  projectId: string;
  allDone: boolean;
  filter: Filter;
  items: Task[];
  setState: (props: any) => void;
}

export interface Project {
  _id: string;
  name: string;
  tags?: string[];
  tasks: string[];
}

export interface Task {
  _id: string;
  userId?: string;
  projectId: string;
  content: string;
  resolved: boolean;
  editing?: boolean;
}

export function capitalize (text: string): string {
  return text.trim()
    .replace(
      text.charAt(0),
      text.charAt(0).toUpperCase()
    );
}

export function filterItems(items: Task[], filter: string): Task[] {
  switch (filter) {
    case Filter.REMAINED:
      return items.filter(item => item.resolved === false)
    case Filter.COMPLETED:
      return items.filter(item => item.resolved === true)
    default:
      return items;
  }
}

  // Type guard for keyboard events
  export const isKeyboardEvent = (
    event: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
  ): event is React.KeyboardEvent<HTMLInputElement> => {
    return (event as React.KeyboardEvent<HTMLInputElement>).key !== undefined;
  };