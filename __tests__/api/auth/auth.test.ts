import { GET } from "@/app/api/auth/callback/route";
import { createClient } from "@/../utils/supabase/server";


jest.mock("@/../utils/supabase/server");

const mockedCreateClient = createClient as jest.Mock;

describe("OAuth callback handler", () => {
  beforeEach(() => {
    jest.clearAllMocks(); //reset mocks before each test
  });
  it("redirects to /admin if code is valid and exchange is successful", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({ error: null }),
      }, // Mock successful exchange because null error means success
    });

    const url = "http://localhost:3000/api/auth/callback?code=validCode";
    const req = new Request(url);

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin");
  });

  it("redirects to error page if no code is provided", async () => {
    const url = "http://localhost:3000/api/auth/callback";
    const req = new Request(url);

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/auth/auth-code-error");
  });

  it("redirects to error page if exchange fails", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({
          error: { message: "Invalid code" },
        }),
      },
    });

    const url = "http://localhost:3000/api/auth/callback?code=invalidCode";
    const req = new Request(url);

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/auth/auth-code-error");
  });
});
