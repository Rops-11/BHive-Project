import sinon from "sinon";

export const mockGetAvailableRoomsWithDateStub = sinon.stub();

const useOnlyAvailableRoomsOnSpecificDateDefaultExport = sinon.stub().returns({
  getAvailableRoomsWithDate: mockGetAvailableRoomsWithDateStub,
  loading: false,
  availableRoomsWithDate: [],
});

export default useOnlyAvailableRoomsOnSpecificDateDefaultExport;
