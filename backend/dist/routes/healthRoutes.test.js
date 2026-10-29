"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const healthRoutes_1 = require("./healthRoutes");
(0, vitest_1.describe)('healthRoutes', () => {
    const app = (0, express_1.default)();
    app.use(healthRoutes_1.healthRoutes);
    (0, vitest_1.it)('GET /health retorna 200 com os dados de saúde', async () => {
        const res = await (0, supertest_1.default)(app).get('/health');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.status).toBe('ok');
        (0, vitest_1.expect)(res.body).toHaveProperty('uptime');
        (0, vitest_1.expect)(res.body).toHaveProperty('timestamp');
        (0, vitest_1.expect)(res.body.memoryUsage).toHaveProperty('rss');
        (0, vitest_1.expect)(res.body.memoryUsage).toHaveProperty('heapUsed');
    });
});
