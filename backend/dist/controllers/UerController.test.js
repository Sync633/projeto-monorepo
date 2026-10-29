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
// Mock do model User
vitest_1.vi.mock('../models/User', () => ({
    User: {
        findAll: vitest_1.vi.fn(),
        findByPk: vitest_1.vi.fn(),
        findOne: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
    },
}));
// Mock do bcrypt
vitest_1.vi.mock('bcryptjs', () => ({
    default: {
        hash: vitest_1.vi.fn(),
        compare: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)('UserController', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ──────────────────────────────────────────────
    // GET /api/users - index
    // ──────────────────────────────────────────────
    (0, vitest_1.describe)('GET /api/users', () => {
        (0, vitest_1.it)('deve retornar lista de usuários com status 200', async () => {
            const usuarios = [
                {
                    id: 1,
                    nome: 'Alice',
                    email: 'alice@email.com',
                    createdAt: '2026-01-01',
                    updatedAt: '2026-01-01',
                },
            ];
            vitest_1.vi.mocked(User_1.User.findAll).mockResolvedValue(usuarios);
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users');
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toEqual(usuarios);
        });
        (0, vitest_1.it)('deve retornar 500 em caso de erro no banco', async () => {
            vitest_1.vi.mocked(User_1.User.findAll).mockRejectedValue(new Error('Falha no banco'));
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users');
            (0, vitest_1.expect)(response.status).toBe(500);
            (0, vitest_1.expect)(response.body.erro).toBe('Erro ao listar usuários');
        });
    });
    // ──────────────────────────────────────────────
    // GET /api/users/:id - show
    // ──────────────────────────────────────────────
    (0, vitest_1.describe)('GET /api/users/:id', () => {
        (0, vitest_1.it)('deve retornar usuário por ID com status 200', async () => {
            const usuario = {
                id: 1,
                nome: 'Alice',
                email: 'alice@email.com',
                createdAt: '2026-01-01',
            };
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(usuario);
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users/1');
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body).toEqual(usuario);
        });
        (0, vitest_1.it)('deve retornar 400 se o ID for NaN (texto)', async () => {
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users/abc');
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('O ID informado deve ser um numero valido.');
        });
        (0, vitest_1.it)('deve retornar 400 se o ID for zero ou negativo', async () => {
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users/0');
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('O ID informado deve ser um numero valido.');
        });
        (0, vitest_1.it)('deve retornar 404 se o usuário não for encontrado', async () => {
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users/999');
            (0, vitest_1.expect)(response.status).toBe(404);
            (0, vitest_1.expect)(response.body.erro).toBe('Usuário não encontrado.');
        });
        (0, vitest_1.it)('deve retornar 500 em caso de erro no banco', async () => {
            vitest_1.vi.mocked(User_1.User.findByPk).mockRejectedValue(new Error('Falha no banco'));
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users/1');
            (0, vitest_1.expect)(response.status).toBe(500);
            (0, vitest_1.expect)(response.body.erro).toBe('Erro ao buscar usuário');
        });
    });
    // ──────────────────────────────────────────────
    // POST /api/users - create
    // ──────────────────────────────────────────────
    (0, vitest_1.describe)('POST /api/users', () => {
        (0, vitest_1.it)('deve criar usuário com sucesso e retornar 201', async () => {
            vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue(null);
            vitest_1.vi.mocked(bcryptjs_1.default.hash).mockResolvedValue('hash123');
            vitest_1.vi.mocked(User_1.User.create).mockResolvedValue({
                id: 1,
                nome: 'Alice Santos',
                email: 'alice@email.com',
                createdAt: new Date('2026-01-01'),
            });
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 'Alice Santos',
                email: 'alice@email.com',
                password: 'senha123',
            });
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body.nome).toBe('Alice Santos');
            (0, vitest_1.expect)(response.body.email).toBe('alice@email.com');
        });
        (0, vitest_1.it)('deve retornar 400 se o nome estiver vazio', async () => {
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: '   ',
                email: 'alice@email.com',
                password: 'senha123',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('O campo nome é obrigatório.');
        });
        (0, vitest_1.it)('deve retornar 400 se o nome não for string', async () => {
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 123,
                email: 'alice@email.com',
                password: 'senha123',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('O campo nome é obrigatório.');
        });
        (0, vitest_1.it)('deve retornar 400 se o nome não for fornecido', async () => {
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                email: 'alice@email.com',
                password: 'senha123',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('O campo nome é obrigatório.');
        });
        (0, vitest_1.it)('deve retornar 400 se o email for inválido', async () => {
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 'Alice',
                email: 'email-invalido',
                password: 'senha123',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('Informe um e-mail valido.');
        });
        (0, vitest_1.it)('deve retornar 400 se o email não for fornecido', async () => {
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 'Alice',
                password: 'senha123',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('Informe um e-mail valido.');
        });
        (0, vitest_1.it)('deve retornar 400 se a senha tiver menos de 6 caracteres', async () => {
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 'Alice',
                email: 'alice@email.com',
                password: '123',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('A senha deve conter no minimo 6 caracteres.');
        });
        (0, vitest_1.it)('deve retornar 400 se a senha não for fornecida', async () => {
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 'Alice',
                email: 'alice@email.com',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('A senha deve conter no minimo 6 caracteres.');
        });
        (0, vitest_1.it)('deve retornar 400 se o e-mail já estiver cadastrado', async () => {
            vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue({
                id: 10,
                email: 'alice@email.com',
            });
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 'Alice',
                email: 'alice@email.com',
                password: 'senha123',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('Já existe um usuário cadastrado com este e-mail.');
        });
        (0, vitest_1.it)('deve retornar 500 em caso de erro inesperado', async () => {
            vitest_1.vi.mocked(User_1.User.findOne).mockRejectedValue(new Error('Falha no banco'));
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 'Alice',
                email: 'alice@email.com',
                password: 'senha123',
            });
            (0, vitest_1.expect)(response.status).toBe(500);
            (0, vitest_1.expect)(response.body.erro).toBe('Erro ao cadastrar usuário');
        });
    });
    // ──────────────────────────────────────────────
    // PUT /api/users/:id - update
    // ──────────────────────────────────────────────
    (0, vitest_1.describe)('PUT /api/users/:id', () => {
        (0, vitest_1.it)('deve atualizar o usuário com sucesso', async () => {
            const mockUser = {
                id: 1,
                nome: 'Alice',
                email: 'alice@email.com',
                createdAt: new Date(),
                save: vitest_1.vi.fn().mockResolvedValue(undefined),
            };
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(mockUser);
            vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app_1.app).put('/api/users/1').send({
                nome: 'Alice Atualizada',
                email: 'alicenova@email.com',
            });
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.nome).toBe('Alice Atualizada');
        });
        (0, vitest_1.it)('deve retornar 400 se o ID for inválido', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .put('/api/users/abc')
                .send({ nome: 'Alice' });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('O ID informado deve ser um numero valido.');
        });
        (0, vitest_1.it)('deve retornar 404 se o usuário não for encontrado', async () => {
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app_1.app)
                .put('/api/users/999')
                .send({ nome: 'Alice' });
            (0, vitest_1.expect)(response.status).toBe(404);
            (0, vitest_1.expect)(response.body.erro).toBe('Usuário não encontrado.');
        });
        (0, vitest_1.it)('deve retornar 404 se o nome fornecido for inválido (apenas espaços)', async () => {
            const mockUser = {
                id: 1,
                nome: 'Alice',
                email: 'alice@email.com',
                save: vitest_1.vi.fn(),
            };
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(mockUser);
            const response = await (0, supertest_1.default)(app_1.app)
                .put('/api/users/1')
                .send({ nome: '   ' });
            (0, vitest_1.expect)(response.status).toBe(404);
            (0, vitest_1.expect)(response.body.erro).toBe('O campo nome deve ser um texto valido.');
        });
        (0, vitest_1.it)('deve retornar 400 se o e-mail fornecido for inválido', async () => {
            const mockUser = {
                id: 1,
                nome: 'Alice',
                email: 'alice@email.com',
                save: vitest_1.vi.fn(),
            };
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(mockUser);
            const response = await (0, supertest_1.default)(app_1.app)
                .put('/api/users/1')
                .send({ email: 'email-invalido' });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('Informe um e-mail valido.');
        });
        (0, vitest_1.it)('deve retornar 400 se o e-mail já estiver em uso por outro usuário', async () => {
            const mockUser = {
                id: 1,
                nome: 'Alice',
                email: 'alice@email.com',
                save: vitest_1.vi.fn(),
            };
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(mockUser);
            vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue({
                id: 2,
                email: 'outro@email.com',
            });
            const response = await (0, supertest_1.default)(app_1.app)
                .put('/api/users/1')
                .send({ email: 'outro@email.com' });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('Este e-mail já está em uso.');
        });
        (0, vitest_1.it)('não deve retornar erro se o email em uso pertencer ao próprio usuário', async () => {
            const mockUser = {
                id: 1,
                nome: 'Alice',
                email: 'alice@email.com',
                createdAt: new Date(),
                save: vitest_1.vi.fn().mockResolvedValue(undefined),
            };
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(mockUser);
            // findOne retorna o próprio usuário (mesmo id)
            vitest_1.vi.mocked(User_1.User.findOne).mockResolvedValue({
                id: 1,
                email: 'alice@email.com',
            });
            const response = await (0, supertest_1.default)(app_1.app)
                .put('/api/users/1')
                .send({ email: 'alice@email.com' });
            (0, vitest_1.expect)(response.status).toBe(200);
        });
        (0, vitest_1.it)('deve retornar 500 em caso de erro inesperado', async () => {
            vitest_1.vi.mocked(User_1.User.findByPk).mockRejectedValue(new Error('Falha no banco'));
            const response = await (0, supertest_1.default)(app_1.app)
                .put('/api/users/1')
                .send({ nome: 'Alice' });
            (0, vitest_1.expect)(response.status).toBe(500);
            (0, vitest_1.expect)(response.body.erro).toBe('Erro ao atualizar usuário');
        });
    });
    // ──────────────────────────────────────────────
    // DELETE /api/users/:id - delete
    // ──────────────────────────────────────────────
    (0, vitest_1.describe)('DELETE /api/users/:id', () => {
        (0, vitest_1.it)('deve deletar usuário com sucesso e retornar 204', async () => {
            const mockUser = {
                id: 1,
                destroy: vitest_1.vi.fn().mockResolvedValue(undefined),
            };
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(mockUser);
            const response = await (0, supertest_1.default)(app_1.app).delete('/api/users/1');
            (0, vitest_1.expect)(response.status).toBe(204);
        });
        (0, vitest_1.it)('deve retornar 400 se o ID for inválido', async () => {
            const response = await (0, supertest_1.default)(app_1.app).delete('/api/users/abc');
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.erro).toBe('O ID informado deve ser um numero valido.');
        });
        (0, vitest_1.it)('deve retornar 404 se o usuário não for encontrado', async () => {
            vitest_1.vi.mocked(User_1.User.findByPk).mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app_1.app).delete('/api/users/999');
            (0, vitest_1.expect)(response.status).toBe(404);
            (0, vitest_1.expect)(response.body.erro).toBe('Usuário não encontrado.');
        });
        (0, vitest_1.it)('deve retornar 500 em caso de erro inesperado', async () => {
            vitest_1.vi.mocked(User_1.User.findByPk).mockRejectedValue(new Error('Falha no banco'));
            const response = await (0, supertest_1.default)(app_1.app).delete('/api/users/1');
            (0, vitest_1.expect)(response.status).toBe(500);
            (0, vitest_1.expect)(response.body.erro).toBe('Erro ao excluir usuário');
        });
    });
});
