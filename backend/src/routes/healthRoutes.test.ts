import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { healthRoutes } from './healthRoutes';

describe('healthRoutes', () => {
  const app = express();
  app.use(healthRoutes);

  it('GET /health retorna 200 com os dados de saúde', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body.memoryUsage).toHaveProperty('rss');
    expect(res.body.memoryUsage).toHaveProperty('heapUsed');
  });
});
