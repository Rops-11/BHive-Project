import { normalFetch } from "utils/fetch";
import { toast } from "react-toastify";
import { useState } from "react";
import { Room } from "@prisma/client";

const useOnlyAvailableRoomsOnSpecificDate = () => {
  const [loading, setLoading] = useState(false);
  const [availableRoomsWithDate, setAvailableRoomsWithDate] = useState<Room[]>(
    []
  );

  const getAvailableRoomsWithDate = async (checkIn: Date, checkOut: Date) => {
    setLoading(true);
    try {
      const response = await normalFetch(
        "/api/utils/getRoomsAvailableThisDate",
        "post",
        { checkIn, checkOut }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error);
        return [];
      }

      const roomsAvailableWithDate = await response.json();

      setAvailableRoomsWithDate(roomsAvailableWithDate);
    } catch {
      toast.error("Unknown error has occurred");
    } finally {
      setLoading(false);
    }
  };

  return { getAvailableRoomsWithDate, loading, availableRoomsWithDate };
};

export default useOnlyAvailableRoomsOnSpecificDate;
