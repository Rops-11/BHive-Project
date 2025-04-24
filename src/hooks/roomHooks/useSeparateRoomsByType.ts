import { Room } from "@/types/types";
import { useEffect, useState } from "react";

const useSeparateRoomsByType = (rooms: Room[]) => {
  const [queenBeeRooms, setQueenBeeRooms] = useState<Room[]>();
  const [suites, setSuites] = useState<Room[]>();
  const [familySuites, setFamilySuites] = useState<Room[]>();
  const [singleStandardRooms, setSingleStandardRooms] = useState<Room[]>();
  const [singleDeluxeRooms, setSingleDeluxeRooms] = useState<Room[]>();
  const [twinBeeRooms, setTwinBeeRooms] = useState<Room[]>();

  useEffect(() => {
    const handleFilter = (rooms: Room[]) => {
      if (rooms) {
        setQueenBeeRooms(rooms.filter((room) => room.roomType === "Queen"));
        setSuites(rooms.filter((room) => room.roomType === "Suite"));
        setFamilySuites(
          rooms.filter((room) => room.roomType === "Family Suite")
        );
        setSingleStandardRooms(
          rooms.filter((room) => room.roomType === "Single Standard")
        );
        setSingleDeluxeRooms(
          rooms.filter((room) => room.roomType === "Single Deluxe")
        );
        setTwinBeeRooms(rooms.filter((room) => room.roomType === "Twin Bee"));
      }
    };

    handleFilter(rooms);
  }, [rooms]);

  return {
    queenBeeRooms,
    suites,
    familySuites,
    singleStandardRooms,
    singleDeluxeRooms,
    twinBeeRooms,
  };
};

export default useSeparateRoomsByType;
