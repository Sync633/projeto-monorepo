"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Mock do model User
vitest_1.vi.mock('../models/User', () => ({
    User: {
        findOne: vitest_1.vi.fn(),
    },
}));
// Mock do bcrypt
vitest_1.vi.mock('bcryptjs', () => ({
    default: {
        compare: vitest_1.vi.fn(),
        hash: vitest_1.vi.fn(),
    },
}));
// Mock do jsonwebtoken
vitest_1.vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vitest_1.vi.fn(),
        verify: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)('AuthController - POST /api/auth/login', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('deve retornar 400 se email e senha não forem fornecidos', async () => {
        const response = await (0, supertest_1.default)(app_1.app).post('/api/auth/login').send({});
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.erro).toBe('Email e senha são obrigatórios');
    });
    (0, vitest_1.it)('deve retornar 400 se apenas o email for fornecido', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({ email: 'teste@email.com' });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.erro).toBe('Email e senha são obrigatórios');
    });
    (0, vitest_1.it)('deve retornar 400 se apenas a senha for fornecida', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({ password: 'senha123' });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.erro).toBe('Email e senha são obrigatórios');
    });
    (0, vitest_1.it)('deve retornar 401 se o usuário não for encontrado', async () => {
        vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue(null);
        const response = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({ email: 'naoexiste@email.com', password: 'senha123' });
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.erro).toBe('Credenciais invalidas.');
    });
    (0, vitest_1.it)('deve retornar 401 se o usuário não tiver senha_hash', async () => {
        vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue({
            id: 1,
            email: 'teste@email.com',
            nome: 'Teste',
            senha_hash: null,
        });
        const response = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({ email: 'teste@email.com', password: 'senha123' });
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.erro).toBe('Credenciais invalidas.');
    });
    (0, vitest_1.it)('deve retornar 401 se a senha estiver incorreta', async () => {
        vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue({
            id: 1,
            email: 'teste@email.com',
            nome: 'Teste',
            senha_hash: '$2a$10$hashinvalida',
        });
        vitest_1.vi.mocked(bcryptjs_1.default.compare).mockResolvedValue(false);
        const response = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({ email: 'teste@email.com', password: 'senhaerrada' });
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.erro).toBe('Credenciais invalidas.');
    });
    (0, vitest_1.it)('deve retornar 200 e token JWT em login bem-sucedido', async () => {
        const fakeUser = {
            id: 1,
            email: 'teste@email.com',
            nome: 'Teste Silva',
            senha_hash: '$2a$10$hashvalido',
        };
        vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue(fakeUser);
        vitest_1.vi.mocked(bcryptjs_1.default.compare).mockResolvedValue(true);
        vitest_1.vi.mocked(jsonwebtoken_1.default.sign).mockReturnValue('fake.jwt.token');
        const response = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({ email: 'teste@email.com', password: 'senha123' });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.mensagem).toBe('Login realizado com sucesso!');
        (0, vitest_1.expect)(response.body.token).toBe('fake.jwt.token');
    });
    (0, vitest_1.it)('deve retornar 500 se ocorrer um erro inesperado', async () => {
        vitest_1.vi.mocked(User_1.User.findOne).mockRejectedValue(new Error('Erro de banco'));
        const response = await (0, supertest_1.default)(app_1.app)
            .post('/api/auth/login')
            .send({ email: 'teste@email.com', password: 'senha123' });
        (0, vitest_1.expect)(response.status).toBe(500);
        (0, vitest_1.expect)(response.body.erro).toBe('Erro de banco');
    });
});
