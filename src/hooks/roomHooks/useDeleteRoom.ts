import React, { useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useDeleteRoom = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteRoom = async (roomId: string) => {
    setLoading(true);
    try {
      const response = await normalFetch(`/api/room/specific/${roomId}`, "delete");

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error);
        return;
      }

      const success = await response.json();
      toast.success(success.message);
      return;
    } catch {
      toast.error("Unkown error occured while deleting room");
    } finally {
      setLoading(false);
    }
  };

  return { deleteRoom, loading };
};

export default useDeleteRoom;
