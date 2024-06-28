import axios, { AxiosResponse } from "axios";
import { apiURL } from "~/API";

export async function getAllProjectsPaginated(page: number): Promise<AxiosResponse> {
  const url = `${apiURL}/projects/page/${page}`;
  try {
    return await axios.get(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

export async function getProjectById(id: string): Promise<AxiosResponse> {
  const url = `${apiURL}/projects${id}`;
  try {
    return await axios.get(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

export async function createProject(name: string, tags: string[]): Promise<AxiosResponse> {
  const url = `${apiURL}/projects`;
  try {
    const response = await axios.post(url, { name, tags });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

// export async function updateContentById(id: string, content: string) {
//   const url = `${apiURL}/tasks/${id}`;
//   try {
//     return await axios.put<ApiDesc>(url, { content });
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.log("Axios Error:", error);
//     } else {
//       console.log("Unexpected Error:", error);
//     }
//     throw error;
//   }
// }

export async function deleteProjectById(id: string) {
  console.log("deleteProjectById param id:", id);
  const url = `${apiURL}/projects/${id}`;
  try {
    return await axios.delete(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}