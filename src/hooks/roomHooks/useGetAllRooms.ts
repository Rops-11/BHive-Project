import { Room, UnknownError } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useGetAllRooms = () => {
  const [rooms, setRooms] = useState<Room[]>();
  const [error, setError] = useState<UnknownError>();
  const [loading, setLoading] = useState<boolean>(true);
  const fetchAvailableRooms = async () => {
    try {
      const response = await normalFetch("/api/room", "get");

      if (!response.ok) {
        const error = await response.json();
        toast.error(error);
        return;
      }

      const data = await response.json();

      if (data.message) {
        toast.info(data.message);
        return;
      }

      setRooms(data.rooms);
    } catch {
      toast.error("An Unknown Error Occurred.");
      setError({ message: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  return { rooms, error, loading };
};

export default useGetAllRooms;
