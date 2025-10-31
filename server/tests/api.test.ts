import request from 'supertest';
import app from '../src/index';

describe('API Health Check', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toEqual({ ok: true });
  });
});

describe('Authentication Endpoints', () => {
  test('POST /api/auth/signup should create a new user', async () => {
    const newUser = {
      email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
      password: 'testpassword123',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(newUser)
      .expect(200); // Signup returns 200, not 201

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(newUser.email);
    expect(response.body.user.name).toBe(newUser.name);
  });

  test('POST /api/auth/signin should authenticate existing user', async () => {
    // First create a user
    const newUser = {
      email: `signin${Date.now()}@example.com`,
      password: 'testpassword123',
      name: 'Signin Test User'
    };

    await request(app)
      .post('/api/auth/signup')
      .send(newUser);

    // Then try to sign in
    const response = await request(app)
      .post('/api/auth/signin')
      .send({
        email: newUser.email,
        password: newUser.password
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(newUser.email);
  });

  test('POST /api/auth/signin should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      })
      .expect(401);

    expect(response.body).toHaveProperty('error');
  });
});

describe('Protected Routes', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    // Create a user and get their token for protected route tests
    const newUser = {
      email: `protected${Date.now()}@example.com`,
      password: 'testpassword123',
      name: 'Protected Route Test User'
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(newUser);

    authToken = response.body.token;
    userId = response.body.user.id;
  });

  test('GET /api/projects should require authentication', async () => {
    await request(app)
      .get('/api/projects')
      .expect(401);
  });

  test('GET /api/projects should return projects for authenticated user', async () => {
    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/projects should create a new project', async () => {
    const newProject = {
      title: 'Test Project',
      description: 'A test project for API testing'
    };

    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newProject)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newProject.title);
    expect(response.body.description).toBe(newProject.description);
    expect(response.body.ownerId).toBe(userId); // Field is called ownerId, not userId
  });
});
