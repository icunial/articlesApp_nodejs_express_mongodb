const request = require("supertest");
const { app, db } = require("../index");

beforeAll(async () => {
  try {
    await db.dropCollection("users");
  } catch (error) {
    console.log(error.message);
  }
});

afterAll((done) => {
  db.close();
  done();
});

describe("Collection empty", () => {
  it("it should return a 404 status code -> User collection is empty", async () => {
    const response = await request(app).get("/users/all");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No users saved in DB");
  });
});

describe("User Register", () => {
  it("it should return a 400 status code -> Name is required", async () => {
    const user = {
      email: "user1@email.com",
      username: "user1",
      password: "1234",
      password2: "1234",
    };
    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name is required!");
  });
  it("it should return a 400 status code -> Email is required", async () => {
    const user = {
      name: "User 1",
      username: "user1",
      password: "1234",
      password2: "1234",
    };
    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email is required!");
  });
  it("it should return a 400 status code -> Username is required", async () => {
    const user = {
      name: "User 1",
      email: "user1@email.com",
      password: "1234",
      password2: "1234",
    };
    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Username is required!");
  });
});
