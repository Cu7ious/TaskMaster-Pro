import { Task, Filter } from "~/types";

export function capitalize(text: string): string {
  return text.trim().replace(text.charAt(0), text.charAt(0).toUpperCase());
}

export function filterItems(items: Task[], filter: string): Task[] {
  switch (filter) {
    case Filter.REMAINED:
      return items.filter(item => item.resolved === false);
    case Filter.COMPLETED:
      return items.filter(item => item.resolved === true);
    default:
      return items;
  }
}

export const getProject = (id: string, projects: any[]) => projects.find(proj => proj._id === id);

export const getProjectTasks = (id: string, projects: any[]) => getProject(id, projects)?.tasks;

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
