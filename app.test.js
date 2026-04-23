const request = require('supertest');
const app = require('./app');

describe('Testy API Aplikacji Licznika', () => {
    it('GET /api/health powinno zwrocic status 200', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('OK');
    });

    it('GET / powinno zwrocic plik HTML', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toMatch(/text\/html/);
    });
});