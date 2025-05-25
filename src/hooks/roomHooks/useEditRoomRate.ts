import React, { useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useEditRoomRate = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const editRoomRate = async (body: { roomType: string; roomRate: number }) => {
    setLoading(true);
    try {
      const response = await normalFetch("/api/room/room-rate", "put", body);

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        return;
      }
      const data = await response.json();
      toast.success(data.message || "Room rates updated successfully!");
    } catch {
      toast.error("An unknown error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return { editRoomRate, loading };
};

export default useEditRoomRate;
