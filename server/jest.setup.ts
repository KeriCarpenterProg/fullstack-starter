// server/tests/jest.setup.ts
// Minimal mock for the ML service used by server/src/index.ts
const originalFetch = (global as any).fetch;

beforeAll(() => {
  (global as any).fetch = jest.fn(async (input: any, init?: any) => {
    // If you want to only mock the ML endpoint, check the URL:
    const url = typeof input === "string" ? input : input?.url;
    if (url && url.endsWith("/predict")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ category: "test", score: 0.9 }),
      };
    }
    // Fallback for other fetches if needed
    return {
      ok: true,
      status: 200,
      json: async () => ({}),
    };
  });
});

afterAll(() => {
  (global as any).fetch = originalFetch;
});