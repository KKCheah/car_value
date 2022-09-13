import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles signup request', () => {
    const email = 'uniqueTest6@gmail.com'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'unique' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBeDefined();
        expect(email).toEqual(email)
      });
  });

  it('signup as new user then login as that new user', async()=>{
    const email = 'uniqueTest6@gmail.com'
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'unique' })
      .expect(201)
    
    const cookie = res.get('Set-Cookie');
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBeDefined();
        expect(email).toEqual(email)
      });
  })
});
