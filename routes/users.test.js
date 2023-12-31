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
  it("it should return a 400 status code -> Password is required", async () => {
    const user = {
      name: "User 1",
      email: "user1@email.com",
      username: "user1",
      password2: "1234",
    };
    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password is required!");
  });
  it("it should return a 400 status code -> Password Confirmation is required", async () => {
    const user = {
      name: "User 1",
      email: "user1@email.com",
      username: "user1",
      password: "1234",
    };
    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password confirmation is required!");
  });
  it("it should return a 400 status code -> Password and Password confirmation must match", async () => {
    const user = {
      name: "User 1",
      email: "user1@email.com",
      username: "user1",
      password: "1234",
      password2: "123",
    };
    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password and Password Confirmation not match!"
    );
  });
  it("it should return a 201 status code -> New User Creation", async () => {
    const user = {
      name: "User 1",
      email: "user1@email.com",
      username: "user1",
      password: "1234",
      password2: "1234",
    };
    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("User 1");
  });
});

describe("User collection is not empty", () => {
  it("it should return a 200 status code -> User collection is not empty", async () => {
    const response = await request(app).get("/users/all");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});

let cookie = "";

describe("Login Process", () => {
  it("it should return 400 -> Username is required", async () => {
    const user = {
      password: "1234",
    };
    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Username is required!");
  });
  it("it should return 400 -> Password is required", async () => {
    const user = {
      username: "user1",
    };
    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password is required!");
  });
  it("it should return 404 -> Incorrect username", async () => {
    const user = {
      username: "user2",
      password: "1234",
    };
    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Incorrect username");
  });
  it("it should return 404 -> Incorrect password", async () => {
    const user = {
      username: "user1",
      password: "12345",
    };
    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Incorrect password");
  });
  it("it should return 200 status code -> Login success", async () => {
    const user = {
      username: "user1",
      password: "1234",
    };
    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
});

describe("Get logged in user", () => {
  it("it should return 200 status code -> user is logged in", async () => {
    const response = await request(app)
      .get("/users/user")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("User 1");
  });
});

describe("Logout process", () => {
  it("it should return 200 status code -> user is logged out", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(false);
  });
});

describe("Get Bad Request -> no user logged in", () => {
  it("it should return 400 status code -> no user logged in", async () => {
    const response = await request(app)
      .get("/users/user")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("No user logged in!");
  });
});
