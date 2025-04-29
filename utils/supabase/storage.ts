import { supabase } from "./client";
import { v4 as uuidv4 } from "uuid";

export const uploadImage = async (
  from: string,
  roomId: string,
  file: File | Blob
) => {
  const { data, error } = await supabase.storage
    .from(from)
    .upload(roomId + uuidv4(), file);

  return { data, error };
};

export const getMedia = async (from: string, roomId: string) => {
  const { data, error } = await supabase.storage.from(from).list(roomId + "/");

  return { data, error };
};

export const updateFile = async (
  from: string,
  roomId: string,
  fileId: string,
  newFile: File | Blob
) => {
  const { data, error } = await supabase.storage
    .from(from)
    .update(roomId + "?" + fileId, newFile, {
      cacheControl: "3600",
      upsert: true,
    });

  return { data, error };
};
