import { v4 as uuidv4 } from "uuid";
import { createClient } from "./server";
import { SupabaseClient } from "@supabase/supabase-js";

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

export const deleteFile = async (
  from: string,
  roomId: string,
  fileId: string
) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(from)
    .remove([roomId + "/" + fileId]);

  return { data, error };
};

export async function deleteAllFilesInFolder(
  bucketName: string,
  folderPath: string,
  supabaseInstance?: SupabaseClient
) {
  const supabase = supabaseInstance || (await createClient(true));
  const { data: files, error: listError } = await supabase.storage
    .from(bucketName)
    .list(folderPath);

  if (listError) {
    console.error(
      `Error listing files in ${bucketName}/${folderPath} for deletion:`,
      listError
    );
    return { listError };
  }

  if (files && files.length > 0) {
    const filePathsToRemove = files.map((file) => `${folderPath}/${file.name}`);
    const { data: deleteData, error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(filePathsToRemove);

    if (deleteError) {
      console.error(
        `Error deleting files from ${bucketName}/${folderPath}:`,
        deleteError
      );
      return { listError, deleteError };
    }
    return { deleteData };
  } 
  return { data: null };
}

export async function emptyBucket(bucketName: string) {
  const supabase = await createClient();
  const { data: files, error: listError } = await supabase.storage
    .from(bucketName)
    .list();

  if (listError) {
    console.error(
      `Error listing files in bucket ${bucketName} for emptying:`,
      listError
    );
    return;
  }

  if (files && files.length > 0) {
    const filePathsToRemove = files.map((file) => file.name);

    await supabase.storage.from(bucketName).remove(filePathsToRemove);
  }
}
