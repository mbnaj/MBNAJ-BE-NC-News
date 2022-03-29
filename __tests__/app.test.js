const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

const app = require("../app");
const request = require("supertest");

afterAll(() => {
  db.end();
});

beforeEach(() => seed(testData));

describe("Testing the api url if valid", () => {
  test("responds error 404 and a message when requesting an invalid url", () => {
    return request(app)
      .get("/apii")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Route not found");
      });
  });
});
describe("Testing the api/topics", () => {
  test("GET /api/topics returns status:200, responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
describe("Testing the api/articles/:article_id ", () => {
  test("GET /api/articles/:article_id returns status:200, responds with an array of articles objects", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.author).toBe("jonny");
      });
  });
  test("GET /api/articles/:article_id returns status:400, {'message': 'Bad Request!!'} for the invalid inputs", () => {
    return request(app)
      .get("/api/articles/abc")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request!!");
      });
  });

  test.only("GET /api/articles/:article_id returns status:200, responds with an array of articles objects and comments count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.author).toBe("jonny");
        expect(article.comment_count).toBe("11");
      });
  });


});
describe("Testing the api/articles/:article_id ", () => {
  test("PATCH /api/articles/:article_id returns status:204, responds with updated article", () => {
    const updatedData = {
      inc_votes: 2,
    };

    return request(app)
      .patch("/api/articles/3")
      .send(updatedData)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article.article_id).toBe(3);
        expect(article.votes).toBe(2);
      });
  });
});


describe("Testing the api/users", () => {
  test("GET /api/users returns status:200, responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});