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
describe("Testing GET api/topics", () => {
  test("1- GET /api/topics returns status:200, responds with an array of topic objects", () => {
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
describe("Testing GET api/articles/:article_id with different conditions", () => {
  test("1- GET /api/articles/:article_id returns status:200, responds with an array of articles objects", () => {
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
  test("2- GET /api/articles/:article_id returns status:400, {'message': 'Bad Request'} for the invalid inputs", () => {
    return request(app)
      .get("/api/articles/abc")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });

  test("3- GET /api/articles/:article_id returns status:200, responds with an array of articles objects and comments count", () => {
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

  test("3- GET /api/articles/:article_id/comments returns status:200, responds with an array of comments objects for this article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Object);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });

});


describe("Testing PATCH api/articles/:article_id ", () => {
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


describe("Testing GET api/users", () => {
  test("1- GET /api/users returns status:200, responds with an array of users objects", () => {
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


describe("Testing GET api/articles", () => {
  test("1- GET /api/articles returns status:200, responds with an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
 
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              comment_count: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
});


describe("Testing ADD api/articles/:article_id/comments ", () => {
  test("POST /api/articles/:article_id/comments returns status:204, responds with inserted comment", () => {
    const insertedData = {
      username: 'butter_bridge',
      body:'Good article'
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(insertedData)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toBeInstanceOf(Object);
        expect(comment.comment_id).toBe(19);
        expect(comment.article_id).toBe(3);
        expect(comment.author).toBe('butter_bridge');
        expect(comment.body).toBe('Good article');
      });
  });
});
