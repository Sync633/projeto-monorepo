"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("./app");
(0, vitest_1.describe)('Testes de Integração: Endpoints Base da Aplicação', () => {
    (0, vitest_1.describe)('GET /api/health', () => {
        (0, vitest_1.it)('deve responder com status 200 e payload de status operacional', async () => {
            // Act: Dispara a requisição HTTP para a rota de health check
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/health')
                .set('Accept', 'application/json');
            // Assert: Valida status, cabeçalhos e corpo retornado
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.headers['content-type']).toMatch(/json/);
            (0, vitest_1.expect)(response.body).toHaveProperty('status', 'OK');
            (0, vitest_1.expect)(response.body).toHaveProperty('mensagem', 'Servidor Backend rodando com sucesso.');
            (0, vitest_1.expect)(response.body).toHaveProperty('timestamp');
        });
    });
    (0, vitest_1.describe)('Tratamento de Rotas Inexistentes', () => {
        (0, vitest_1.it)('deve retornar status 404 ao requisitar uma rota não mapeada', async () => {
            const response = await (0, supertest_1.default)(app_1.app).get('/api/rota-que-nao-existe');
            (0, vitest_1.expect)(response.status).toBe(404);
        });
    });
});
