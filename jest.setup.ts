import fetch, { Request, Response, Headers } from "node-fetch";

interface MockedCookies {
  get: jest.Mock<{ name: string; value: string } | undefined, [name: string]>;
  getAll: jest.Mock<Array<{ name: string; value: string }>, []>;
  set: jest.Mock<void, [name: string, value: string, options?: any]>;
  has: jest.Mock<boolean, [name: string]>;
  delete: jest.Mock<
    boolean | void,
    [name: string | { name: string; value: string; [key: string]: any }]
  >;
}

declare global {
  namespace NodeJS {
    interface Global {
      Request: typeof Request;
      Response: typeof Response;
      Headers: typeof Headers;
      fetch: typeof fetch;
    }
  }
}

if (!global.Request) {
  global.Request = Request as any;
}
if (!global.Response) {
  global.Response = Response as any;
}
if (!global.Headers) {
  global.Headers = Headers as any;
}
if (!global.fetch) {
  global.fetch = fetch as any;
}

jest.mock("next/headers", () => {
  const mockCookiesInstance: MockedCookies = {
    get: jest.fn((cookieName: string) => {
      if (cookieName && cookieName.startsWith("sb-")) {
        return { name: cookieName, value: `mock-value-for-${cookieName}` };
      }
      return undefined;
    }),
    getAll: jest.fn(() => {
      return [
        { name: "sb-mock-access-token", value: "mock-access-token-value" },
        { name: "sb-mock-refresh-token", value: "mock-refresh-token-value" },
      ];
    }),
    set: jest.fn((name: string, value: string, options?: any) => {}),
    has: jest.fn((cookieName: string) => {
      if (cookieName && cookieName.startsWith("sb-")) {
        return true;
      }
      return false;
    }),
    delete: jest.fn(
      (
        cookieName: string | { name: string; value: string; [key: string]: any }
      ) => {
        return true;
      }
    ),
  };

  const mockHeadersInstance = new Map<string, string>();

  return {
    cookies: jest.fn(() => mockCookiesInstance),
    headers: jest.fn(() => mockHeadersInstance),
  };
});
