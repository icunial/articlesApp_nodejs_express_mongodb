const request = require("supertest");
const { app, db } = require("../index");

beforeAll(async () => {
  try {
    await db.dropCollection("articles");
  } catch (error) {
    console.log(error);
  }
});

afterAll((done) => {
  db.close();
  done();
});

let cookie = "";

describe("User login process", () => {
  it("it should return 200 status code -> user logged in", async () => {
    const response = await request(app).post("/users/login").send({
      username: "user1",
      password: "1234",
    });
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
});

describe("Collection empty -> no articles saved in DB", () => {
  it("it should return 404 status code -> no articles saved in DB", async () => {
    const response = await request(app).get("/articles");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No articles saved in DB");
  });
});
