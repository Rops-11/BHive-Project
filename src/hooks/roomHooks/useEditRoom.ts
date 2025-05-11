import { useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useEditRoom = () => {
  const [loading, setLoading] = useState(false);

  const editRoom = async (roomData: FormData) => {
    setLoading(true);
    try {
      const response = await normalFetch(
        `/api/room/specific/${roomData.get("id")}`,
        "put",
        roomData
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error);
        return;
      }

      toast.success("Room successfully edited");
    } catch {
      toast.error("Unknown error occured on edit");
    } finally {
      setLoading(false);
    }
  };

  return { editRoom, loading };
};

export default useEditRoom;
