import { Task } from "~/utils";

export const apiURL = import.meta.env.VITE_API_URL;

export interface ApiDesc extends Task {
  createdAt: Date;
  updatedAt: Date;
}
