import api from "./api";

export const getNotes = async () => {
  try {
    return api.get("/api/notes");
  } catch (error) {
    console.log("Error getNotes:", error);
    return { auth: false };
  }
};

export const postNotes = async (data: CreateNotes) => {
  try {
    return await api.post(`/api/notes`, data);
  } catch (error) {
    console.log("Error postNotes:", error);
    return { auth: false };
  }
};

export const putNotes = async (id: string, data: UpdateNotes) => {
  try {
    return api.put(`/api/notes/${id}`, data);
  } catch (error) {
    console.log("Error putNotes:", error);
    return { auth: false };
  }
};

export const deleteNotes = async (id: string) => {
  try {
    return api.delete(`/api/notes/${id}`);
  } catch (error) {
    console.log("Error Delete:", error);
    return { auth: false };
  }
};

export const deleteAllNotes = async () => {
  try {
    return api.delete(`/api/notes`);
  } catch (error) {
    console.log("Error Delete All:", error);
    return { auth: false };
  }
};
