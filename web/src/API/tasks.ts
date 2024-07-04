import axios, { AxiosResponse } from "axios";
import { ApiDesc, apiURL } from "~/API";

/**
 * Saves the resolved status of multiple tasks.
 *
 * @param {string[]} ids - An array of task IDs.
 * @param {boolean} resolved - The resolved status to be saved.
 * @return {Promise<AxiosResponse<ApiDesc>>} A promise that resolves to the response of the PUT request.
 * @throws {Error} If there is an error during the request.
 */
export async function saveAllResolved(ids: string[], resolved: boolean) {
  const url = `${apiURL}/tasks/update-all`;
  let response;
  try {
    response = await axios.put<ApiDesc>(
      url,
      {
        ids,
        update: { resolved },
      },
      { withCredentials: true }
    );
  } catch (error) {
    response = error;
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
  return response;
}

/**
 * Deletes all completed items from the specified project.
 *
 * @param {string} projectId - The ID of the project.
 * @param {string[]} ids - An array of item IDs to be deleted.
 * @return {Promise<ApiDesc>} A promise that resolves to the API response.
 * @throws {Error} If there is an error during the deletion process.
 */
export async function deleteAllCompletedItems(projectId: string, ids: string[]) {
  const url = `${apiURL}/tasks/delete-all`;
  try {
    return await axios.delete<ApiDesc>(url, { data: { projectId, ids }, withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

/**
 * Retrieves all items associated with a specific project.
 *
 * @param {string} projectId - The ID of the project.
 * @return {Promise<AxiosResponse<ApiDesc[]>>} A promise that resolves to an Axios response containing an array of ApiDesc objects representing the items.
 * @throws {Error} If there is an error during the retrieval process.
 */
export async function getAllItemsByProject(projectId: string): Promise<AxiosResponse<ApiDesc[]>> {
  const url = `${apiURL}/tasks/${projectId}`;
  try {
    return await axios.get<ApiDesc[]>(url, { withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

/**
 * Creates a new item with the given projectId and content.
 *
 * @param {string} projectId - The ID of the project.
 * @param {string} content - The content of the item.
 * @return {Promise<AxiosResponse<ApiDesc>>} A promise that resolves to the response from the API.
 * @throws {Error} If there is an error during the creation process.
 */
export async function createItem(
  projectId: string,
  content: string
): Promise<AxiosResponse<ApiDesc>> {
  const url = `${apiURL}/tasks`;
  try {
    const response = await axios.post<ApiDesc>(
      url,
      {
        projectId,
        content,
      },
      { withCredentials: true }
    );
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

/**
 * Updates the content of a task by its ID.
 *
 * @param {string} id - The ID of the task to update.
 * @param {string} content - The new content to update the task with.
 * @return {Promise} A promise that resolves with the updated task data.
 */
export async function updateContentById(id: string, content: string) {
  const url = `${apiURL}/tasks/${id}`;
  try {
    return await axios.put<ApiDesc>(url, { content }, { withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

/**
 * Updates the 'resolved' property of a task with the specified ID.
 *
 * @param {string} id - The ID of the task to update.
 * @param {boolean} resolved - The new value for the 'resolved' property.
 * @return {Promise<AxiosResponse<ApiDesc>>} A Promise that resolves to the response from the API.
 * @throws {Error} If there was an error making the API request.
 */
export async function updateResolvedById(id: string, resolved: boolean) {
  const url = `${apiURL}/tasks/${id}`;
  try {
    return await axios.put<ApiDesc>(url, { resolved }, { withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}

/**
 * Deletes an item by its ID.
 *
 * @param {string} id - The ID of the item to delete.
 * @return {Promise} A promise that resolves with the deletion result.
 */
export async function deleteItemById(projectId: string, id: string) {
  const url = `${apiURL}/tasks/${projectId}/${id}`;
  try {
    return await axios.delete<ApiDesc>(url, { withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios Error:", error);
    } else {
      console.log("Unexpected Error:", error);
    }
    throw error;
  }
}
