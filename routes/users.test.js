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
  it("it should return a 404 status code -> Database is empty", async () => {
    const response = await request(app).get("/users/all");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No users saved in DB");
  });
});
