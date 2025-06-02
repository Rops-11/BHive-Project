import sinon from "sinon";

export const mockRouterPush = sinon.spy();
export const mockRouterBack = sinon.spy();

export const useRouter = () => ({
  push: mockRouterPush,
  back: mockRouterBack,
});
