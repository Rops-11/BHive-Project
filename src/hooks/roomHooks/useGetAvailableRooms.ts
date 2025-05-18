import { Room, UnknownError } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useGetAvailableRooms = () => {
  const [roomsAvailable, setRoomsAvailable] = useState<Room[]>();
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<UnknownError>();
  const [loading, setLoading] = useState<boolean>(true);
  const fetchAvailableRooms = async () => {
    try {
      const response = await normalFetch("/api/room/available", "get");

      if (!response.ok) {
        const error = await response.json();
        toast.error(error);
        return;
      }

      const data = await response.json();

      if (data.message) {
        setMessage(data.message);
        return;
      }

      setRoomsAvailable(data.rooms);
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

  return { roomsAvailable, error, loading, message };
};

export default useGetAvailableRooms;
