import sinon from "sinon";
import { Room } from "../../src/types/types";

const useSeparateRoomsByType = sinon.spy((rooms: Room[] = []) => ({
  queenBeeRooms: rooms.filter((r) => r.roomType === "Queen Bee Room"),
  suites: rooms.filter((r) => r.roomType === "Suite"),
  familySuites: rooms.filter((r) => r.roomType === "Family Suite"),
  singleStandardRooms: rooms.filter(
    (r) => r.roomType === "Single Standard Room"
  ),
  singleDeluxeRooms: rooms.filter((r) => r.roomType === "Single Deluxe Room"),
  twinBeeRooms: rooms.filter((r) => r.roomType === "Twin Bee Room"),
}));

export default useSeparateRoomsByType;
