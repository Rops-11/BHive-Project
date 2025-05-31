import { Room } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useGetAllRooms = () => {
  const [rooms, setRooms] = useState<Room[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const fetchAllRooms = async () => {
    setLoading(true);
    try {
      const response = await normalFetch("/api/room", "get");

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        return;
      }

      const data = await response.json();

      if (data.message) {
        toast.info(data.message);
        return;
      }

      setRooms(data);
    } catch {
      toast.error("An Unknown Error Occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  return { rooms, loading, fetchAllRooms };
};

export default useGetAllRooms;
