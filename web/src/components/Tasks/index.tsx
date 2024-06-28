import { css } from "@emotion/react";
import { useContext, useEffect, useState } from "react";
import { AxiosResponse, isAxiosError } from "axios";

import { AppContext } from "~/appState";
import { ApiDesc } from "~/API";
import {
  getAllItemsByProject,
  deleteItemById,
  updateContentById,
  updateResolvedById,
} from "~/API/tasks";
import { filterItems, isKeyboardEvent } from "~/utils";
import TaskBox from "./Task";

const list = css`
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.8);
`;

const preDataState = css`
  padding: 22px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
`;

export default function Tasks() {
  const state = useContext(AppContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (state.projectId.length > 0) {
        try {
          setLoading(true);
          const response = await getAllItemsByProject(state.projectId);
          state.setState && state.setState({ ...state, items: response.data });
        } catch (error) {
          if (isAxiosError(error)) {
            setError(error.message);
          } else {
            setError("An unexpected error occurred");
          }
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [state.projectId]);

  function editItem(id: string, e: any) {
    const items = state.items;
    const itemIdx = state.items.findIndex(item => item._id === id);
    items[itemIdx].content = e.target.value;
    state.setState && state.setState({ ...state, items });
  }

  const _saveEditedItemCallback = (res: AxiosResponse<ApiDesc>, id: string) => {
    const updatedIdx = state.items.findIndex(itm => itm._id === id);
    const updatedItems = state.items;
    updatedItems[updatedIdx] = { ...res.data, editing: false };
    state.setState({ ...state, items: updatedItems });
  };

  function saveEditedItem(
    id: string,
    e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>
  ) {
    const items = state.items;
    const index = state.items.findIndex(item => item._id === id);

    if (isKeyboardEvent(e)) {
      if (e.code === "Escape") return;
      if (e.code === "Enter") {
        items[index].editing = false;
        updateContentById(id, items[index].content).then(res => _saveEditedItemCallback(res, id));
      }
    } else {
      items[index].editing = false;
      updateContentById(id, items[index].content).then(res => _saveEditedItemCallback(res, id));
    }
  }

  function removeItem(id: string) {
    deleteItemById(id).then(res => {
      if ((res as any)?.status === 204) {
        const items = state.items;
        const index = state.items.findIndex(item => item._id === id);
        items.splice(index, 1);
        state.setState && state.setState({ ...state, items });
      }
    });
  }

  function setItemIsEditable(id: string) {
    const index = state.items.findIndex(item => item._id === id);
    state.items[index].editing = true;
    state.setState && state.setState({ ...state, items: state.items });
  }

  function toggleMarkAsDone(id: string) {
    const toggledResolve = !state.items.filter(item => item._id === id)[0].resolved;
    updateResolvedById(id, toggledResolve).then(res => {
      const updatedIdx = state.items.findIndex(itm => itm._id === id);
      const updatedItems = state.items;
      updatedItems[updatedIdx] = { ...res.data, editing: false };
      state.setState({ ...state, items: updatedItems });
    });
  }

  if (loading) return <div css={preDataState}>Loading...</div>;
  if (error) return <div css={preDataState}>Error: {error}</div>;

  return state.items.length > 0 ? (
    <ul css={list}>
      {filterItems(state.items, state.filter).map(item => (
        <TaskBox
          item={item}
          _id={item._id}
          key={item._id}
          actions={{
            editItem,
            saveEditedItem,
            setItemIsEditable,
            toggleMarkAsDone,
            removeItem,
          }}
        />
      ))}
    </ul>
  ) : null;
}
