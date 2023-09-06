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
let article_id = "";

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
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Title 1");
    expect(response.body.data.author).toBe(user_id);
    article_id = response.body.data._id;
  });
  it("it should return 201 status code -> create a new article", async () => {
    const article = {
      title: "Title 2",
      body: "Body of Title 2",
    };
    const response = await request(app)
      .post("/articles")
      .send(article)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Title 2");
    expect(response.body.data.author).toBe(user_id);
  });
  it("it should return 200 status code -> articles collection is not empty", async () => {
    const response = await request(app).get("/articles");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
  });
});

describe("Get an article by its id", () => {
  it("it should return 404 status code -> article id not found", async () => {
    const response = await request(app)
      .get("/articles/64f7d1c5c19c8e4e9718caaf")
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Article with ID: 64f7d1c5c19c8e4e9718caaf not found!"
    );
  });
  it("it should return 200 status code -> article id found", async () => {
    const response = await request(app)
      .get(`/articles/${article_id}`)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Title 1");
  });
});

describe("Update articles process", () => {
  it("it should return 404 status code -> article id not found", async () => {
    const id = "64f7d1c5c19c8e4e9718caaf";
    const body = {
      title: "New Title",
    };
    const response = await request(app)
      .put(`/articles/${id}`)
      .send(body)
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(`Article with ID: ${id} not found!`);
  });
  it("it should return 200 status code -> article updated successfully", async () => {
    const body = {
      title: "New Title",
    };
    const response = await request(app)
      .put(`/articles/${article_id}`)
      .send(body)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("New Title");
  });
});

describe("Delete article process", () => {
  it("it should return 404 status code -> article not found", async () => {
    const id = "64f7d1c5c19c8e4e9718caaf";
    const response = await request(app)
      .delete(`/articles/${id}`)
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(`Article with ID: ${id} not found!`);
  });
  it("it should return 200 status code -> article deleted successfully", async () => {
    const response = await request(app)
      .delete(`/articles/${article_id}`)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("New Title");
  });
  it("it should return 200 status code -> articles collection length must be 1", async () => {
    const response = await request(app).get("/articles");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});

describe("Logout user", () => {
  it("it should return 200 status code -> user is logged out", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(false);
  });
});
