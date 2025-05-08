import { v4 as uuidv4 } from "uuid";
import { createClient } from "./server";

export const uploadImage = async (
  from: string,
  roomId: string,
  file: File | Blob
) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(from)
    .upload(roomId + "/" + uuidv4(), file);

  return { data, error };
};

export const getMedia = async (from: string, roomId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from(from).list(roomId + "/", {
    limit: 10,
    offset: 0,
    sortBy: {
      column: "name",
      order: "asc",
    },
  });

  return { data, error };
};

export const updateFile = async (
  from: string,
  roomId: string,
  fileId: string,
  newFile: File | Blob
) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(from)
    .update(roomId + "/" + fileId, newFile, {
      cacheControl: "3600",
      upsert: true,
    });

  return { data, error };
};
