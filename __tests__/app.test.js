const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

const app = require("../app");
const request = require("supertest");
const endpoints = require("../endpoints.json");

afterAll(() => {
  db.end();
});

beforeEach(() => seed(testData));
////////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Testing the api", () => {
  test("responds error 200 and object matches the contents of endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject(endpoints);
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////
test("2- GET /api/articles returns status:200, responds with an array of articles sorted by created_at", () => {
  return request(app)
    .get("/api/articles?sort_by=created_at&order=desc")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeInstanceOf(Array);
      expect(articles).toHaveLength(10);//default limit is 10
      expect(articles).toBeSorted("created_at");
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        expect(comments).toHaveLength(10);//default limit is 10
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
////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Testing GET api/users/:username", () => {
  test("1- GET /api/user returns status:200, responds with user object", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toBeInstanceOf(Object);
        expect(user.username).toBe("lurker");
        expect(user.name).toBe("do_nothing");
      });
  });
});



////////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Testing GET api/articles", () => {
  test("1- GET /api/articles returns status:200, responds with an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(10);//default limit is 10

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

  test("2- GET /api/articles returns status:200, responds with an array of articles sorted by created_at", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(10);//default limit is 10
        expect(articles).toBeSorted("created_at");
      });
  });

  test("3- GET /api/articles returns status:200, responds with an array of articles sorted by created_at and filterd by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(1);
        expect(articles).toBeSorted("created_at");
      });
  });

  test("4- GET /api/articles returns status:200, responds with an array of articles sorted by article_id ", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(0);
        expect(articles).toBeSorted("article_id");
      });
  });

  test("5- GET /api/articles returns status:200, responds with an array of articles and filterd by non-exist topic", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(0);
      });
  });

  test("6- GET /api/articles returns status:200, responds with an array of articles sorted by invalid key", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(10);//default limit is 10
        expect(articles).toBeSorted("created_at");
      });
  });
  test("7- GET /api/articles returns status:200, responds with an array of articles that contains two articles", () => {
    return request(app)
      .get("/api/articles?limit=2")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(2);
      });
  });

});
////////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Testing ADD api/articles/:article_id/comments ", () => {
  test("1- POST /api/articles/:article_id/comments returns status:201, responds with inserted comment", () => {
    const insertedData = {
      username: "butter_bridge",
      body: "Good article",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(insertedData)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toBeInstanceOf(Object);
        expect(comment.comment_id).toBe(19);
        expect(comment.article_id).toBe(3);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("Good article");
      });
  });

  test("2- POST /api/articles/:article_id/comments with username that not exists", () => {
    const insertedData = {
      username: "not_exists",
      body: "Good article",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(insertedData)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Testing DELETE /api/comments/:comment_id ", () => {
  test("1- DELETE /api/comments/:comment_id returns status:204, ", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("2- DELETE /api/comments/:comment_id returns status:404, when sending non-exist comment id", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
describe("Testing ADD api/articles ", () => {
  test.only("1- POST /api/articles returns status:201, responds with inserted article", () => {
    const insertedData = {
      author: "butter_bridge",
      body: "Good new article",
      topic:'cats',
      title:"new title"
    };

    return request(app)
      .post("/api/articles")
      .send(insertedData)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        //expect(article).toBeInstanceOf(Object);
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("Good article");
      });
  });
});
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Testing DELETE /api/articles/:article_id ", () => {
  test("1- DELETE /api/articles/:article_id returns status:204, ", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });

  test("2- DELETE /api/articles/:article_id returns status:404, when sending non-exist article id", () => {
    return request(app)
      .delete("/api/articles/invalidId")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Testing POST /api/topics ", () => {
  test("1- POST /api/topics returns status:201, responds with inserted topic", () => {
    const insertedData = {
      "slug": "topic name here",
      "description": "description here"
    };

    return request(app)
      .post("/api/topics")
      .send(insertedData)
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic).toBeInstanceOf(Object);
        expect(topic.slug).toBe("topic name here");
        expect(topic.description).toBe("description here");
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////