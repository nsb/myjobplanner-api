import request from 'supertest'
import server from './app'
// import express from 'express';

// function uselessMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) { next() }

afterAll((done) => {
  server.close()
  done()
})

test('should return a list of businesses', async () => {
  const res = await request(server)
    .get('/businesses').send()

  expect(res.statusCode).toEqual(200)
});
