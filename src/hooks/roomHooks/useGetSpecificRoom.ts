import { Room } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useGetSpecificRoom = (roomId: string) => {
  const [roomData, setRoomData] = useState<Room>();
  const [loading, setLoading] = useState<boolean>(true);
  
  const getRoom = async (roomId: string) => {
    try {
      const response = await normalFetch(`/api/room/specific/${roomId}`, "get");

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error);
        return;
      }

      const roomData = await response.json();

      setRoomData(roomData);
    } catch {
      toast.error("Unknown error has occured.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoom(roomId);
  }, [roomId]);

  return { roomData, loading };
};

export default useGetSpecificRoom;
