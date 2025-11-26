import request from "supertest";
import app from "../src/index";
import fetch from "node-fetch";

jest.mock("node-fetch", () => jest.fn());

beforeAll(() => {
  (fetch as jest.Mock).mockImplementation((url, options) => {
    if (url === "http://localhost:5002/predict") {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            category: "Development",
            confidence: 0.95,
            all_probabilities: {
              Design: 0.05,
              Development: 0.95,
              Marketing: 0.0,
              Operations: 0.0,
              Research: 0.0,
            },
          }),
        status: 200,
      });
    }
    return Promise.reject(new Error(`Unknown URL: ${url}`));
  });
});

describe("API Health Check", () => {
  test("GET /api/health should return 200", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toEqual({ ok: true });
  });
});

describe("Authentication Endpoints", () => {
  test("POST /api/auth/signup should create a new user", async () => {
    const newUser = {
      email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
      password: "testpassword123",
      name: "Test User",
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(newUser)
      .expect(200); // Signup returns 200, not 201

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe(newUser.email);
    expect(response.body.user.name).toBe(newUser.name);
  });

  test("POST /api/auth/signin should authenticate existing user", async () => {
    // First create a user
    const newUser = {
      email: `signin${Date.now()}@example.com`,
      password: "testpassword123",
      name: "Signin Test User",
    };

    await request(app).post("/api/auth/signup").send(newUser);

    // Then try to sign in
    const response = await request(app)
      .post("/api/auth/signin")
      .send({
        email: newUser.email,
        password: newUser.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe(newUser.email);
  });

  test("POST /api/auth/signin should reject invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/signin")
      .send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      })
      .expect(401);

    expect(response.body).toHaveProperty("error");
  });
});

describe("Protected Routes", () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    // Create a user and get their token for protected route tests
    const newUser = {
      email: `protected${Date.now()}@example.com`,
      password: "testpassword123",
      name: "Protected Route Test User",
    };

    const response = await request(app).post("/api/auth/signup").send(newUser);

    authToken = response.body.token;
    userId = response.body.user.id;
  });

  test("GET /api/projects should require authentication", async () => {
    await request(app).get("/api/projects").expect(401);
  });

  test("GET /api/projects should return projects for authenticated user", async () => {
    const response = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /api/projects should create a new project", async () => {
    const newProject = {
      title: "Test Project",
      description: "A test project for API testing",
    };

    const response = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newProject)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(newProject.title);
    expect(response.body.description).toBe(newProject.description);
    expect(response.body.ownerId).toBe(userId); // Field is called ownerId, not userId
  });
});

describe("ML Prediction Endpoint", () => {
  test("POST /api/ml/predict-category should return a valid category", async () => {
    const response = await request(app)
      .post("/api/ml/predict-category")
      .send({ text: "test data" })
      .expect(200); // Expect a 200 status code now that the ML service is functional

    expect(response.body).toHaveProperty("category");
    expect(typeof response.body.category).toBe("string");
    expect(response.body).toHaveProperty("confidence");
    expect(typeof response.body.confidence).toBe("number");
    expect(response.body).toHaveProperty("all_probabilities");
    expect(typeof response.body.all_probabilities).toBe("object");
  });

  test("POST /api/ml/predict-category should handle empty input", async () => {
    const response = await request(app)
      .post("/api/ml/predict-category")
      .send({ text: "" })
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Text is required");
  });

  test("POST /api/ml/predict-category should handle invalid input", async () => {
    const response = await request(app)
      .post("/api/ml/predict-category")
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Text is required");
  });
});
