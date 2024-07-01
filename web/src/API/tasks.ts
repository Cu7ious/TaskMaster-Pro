import axios, { AxiosResponse } from "axios";
import { ApiDesc, apiURL } from "~/API";

export async function saveAllResolved(ids: string[], resolved: boolean) {
  const url = `${apiURL}/tasks/update-all`;
  let response;
  try {
    response = await axios.put<ApiDesc>(url, {
      ids,
      update: { resolved },
    });
  } catch (error) {
    response = error;
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
  }
  return response;
}

export async function deleteAllCompletedItems(ids: string[]) {
  const url = `${apiURL}/tasks/delete-all`;
  try {
    return await axios.put<ApiDesc>(url, { ids });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
      throw error;
    } else {
      console.log("Unexpected Error:", error);
      throw error;
    }
  }
}

export async function getAllItemsByProject(projectId: string): Promise<AxiosResponse<ApiDesc[]>> {
  const url = `${apiURL}/tasks/${projectId}`;
  try {
    return await axios.get<ApiDesc[]>(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

export async function createItem(userId: string, projectId: string, content: string): Promise<AxiosResponse<ApiDesc>> {
  const url = `${apiURL}/tasks`;
  // console.log(projectId);
  
  try {
    const response = await axios.post<ApiDesc>(url, {
      userId,
      projectId,
      content,
    });
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

export async function updateContentById(id: string, content: string) {
  const url = `${apiURL}/tasks/${id}`;
  try {
    return await axios.put<ApiDesc>(url, { content });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

export async function updateResolvedById(id: string, resolved: boolean) {
  const url = `${apiURL}/tasks/${id}`;
  try {
    return await axios.put<ApiDesc>(url, { resolved });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

export async function deleteItemById(id: string) {
  const url = `${apiURL}/tasks/${id}`;
  try {
    return await axios.delete<ApiDesc>(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}