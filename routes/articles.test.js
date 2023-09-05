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
let user_id = "";

describe("Collection empty -> no articles saved in DB", () => {
  it("it should return 404 status code -> no articles saved in DB", async () => {
    const response = await request(app).get("/articles");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No articles saved in DB");
  });
});

describe("Create new articles -> no user logged in", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const article = {
      title: "Title 1",
      body: "Body of title 1",
    };
    const response = await request(app).post("/articles").send(article);
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("You are not authorized! Please login...");
  });
});

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
  it("it should return 200 status code -> return user logged in data", async () => {
    const response = await request(app)
      .get("/users/user")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("User 1");
    user_id = response.body.data._id;
  });
});

describe("Create Article process", () => {
  it("it should return 400 status code -> title is required", async () => {
    const article = {
      body: "Body of title 1",
    };
    const response = await request(app)
      .post("/articles")
      .send(article)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Title is required!");
  });
  it("it should return 400 status code -> Body is required", async () => {
    const article = {
      title: "Title 1",
    };
    const response = await request(app)
      .post("/articles")
      .send(article)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Body is required!");
  });
  it("it should return 201 status code -> create new article success", async () => {
    const article = {
      title: "Title 1",
      body: "Body of Title 1",
    };
    const response = await request(app)
      .post("/articles")
      .send(article)
      .set("Cookie", cookie);
    console.log(response.body.data);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Title 1");
    expect(response.body.data.author).toBe(user_id);
  });
});