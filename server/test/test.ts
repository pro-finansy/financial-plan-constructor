import supertest from 'supertest';
const server = supertest.agent('http://localhost:3000');

describe('SAMPLE unit test', () => {
  it('should return home page', (done) => {
    server
      .get('/')
      .expect('Content-Type', /text/)
      .expect(200)
      .end(function (err, res) {
        done();
      })
  })
})