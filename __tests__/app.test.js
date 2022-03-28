const devData = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')

const app = require('../app')
const request = require('supertest')

afterAll(() => {
  db.end()
})

beforeEach(() => seed(devData))

describe('GET /api/topics', () => {
  test('status:200, responds with an array of topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body
        expect(topics).toBeInstanceOf(Array)
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            }),
          )
        })
      })
  })
})
