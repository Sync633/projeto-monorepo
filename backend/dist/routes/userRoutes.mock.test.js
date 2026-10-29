"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const User_1 = require("../models/User");
// Intercepta o modulo do Model User
vitest_1.vi.mock('../models/User', () => ({
    User: {
        findAll: vitest_1.vi.fn(),
        findByPk: vitest_1.vi.fn(),
        findOne: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        destroy: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)('Testes de Rotas com Mocking do Model User', () => {
    // Limpa o historico de chamadas e retornos de todos os mocks antes de cada teste
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('GET /api/users - deve retornar lista mockada de usuarios com status 200', async () => {
        // Arrange: Define o retorno que o mock do Sequelize devera fornecer
        const usuariosFalsos = [
            {
                id: 1,
                nome: 'Alice Santos',
                email: 'alice@fatec.sp.gov.br',
                createdAt: '2026-01-01',
            },
            {
                id: 2,
                nome: 'Bob Silva',
                email: 'bob@fatec.sp.gov.br',
                createdAt: '2026-01-02',
            },
        ];
        vitest_1.vi.mocked(User_1.User.findAll).mockResolvedValue(usuariosFalsos);
        // Act
        const response = await (0, supertest_1.default)(app_1.app).get('/api/users');
        // Assert
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toEqual(usuariosFalsos);
        // Garante que o controller realmente chamou o metodo findAll com os atributos corretos
        (0, vitest_1.expect)(User_1.User.findAll).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(User_1.User.findAll).toHaveBeenCalledWith({
            attributes: ['id', 'nome', 'email', 'createdAt', 'updatedAt'],
        });
    });
    (0, vitest_1.it)('POST /api/users - deve retornar status 409 quando o e-mail ja existir', async () => {
        // Arrange: Simula que o findOne encontrou um usuario com o mesmo e-mail
        vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue({
            id: 10,
            email: 'existente@fatec.sp.gov.br',
        });
        // Act
        const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
            nome: 'Usuario Teste',
            email: 'existente@fatec.sp.gov.br',
            password: 'senha123456',
        });
        // Assert
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.erro).toBe('Já existe um usuário cadastrado com este e-mail.');
        // Garante que o metodo create NUNCA foi chamado apos a deteccao do conflito
        (0, vitest_1.expect)(User_1.User.create).not.toHaveBeenCalled();
    });
});
