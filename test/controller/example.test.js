'use strict';

require('should');
const supertest = require('supertest');
const app = require('../../app');
const log = require('../../common/log');

const request = supertest(app.listen());

describe('controller/smart.js', () => {
  it('测试接口', (done) => {
    request
      .get('/smart/energy')
      .send({})
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        const data = res.body;
        log.info('TEST_SMART_ENERGY', data);
        data.success.should.equal(true);
        done();
      });
  });
});
