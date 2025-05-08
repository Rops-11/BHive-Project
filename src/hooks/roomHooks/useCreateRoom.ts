import { useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useCreateRoom = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const createRoom = async (roomData: FormData) => {
    setLoading(true);
    try {
      const response = await normalFetch("/api/room", "post", roomData);

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error);
        return;
      }

      toast.success("Room successfully created");
    } catch {
      toast.error("Unknown error has occured when creating room");
    } finally {
      setLoading(false);
    }
  };

  return { createRoom, loading };
};

export default useCreateRoom;
