"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const database_1 = require("../config/database");
const User_1 = require("../models/User");
(0, vitest_1.describe)('Testes de Integracao: Rotas de Usuarios (/api/users)', () => {
    // Executa uma vez antes de todos os testes da suite
    (0, vitest_1.beforeAll)(async () => {
        // Sincroniza os models e recria as tabelas no SQLite em memoria
        await database_1.sequelize.sync({ force: true });
    });
    // Executa antes de cada caso de teste individual
    (0, vitest_1.beforeEach)(async () => {
        // Limpa a tabela de usuarios para que cada teste execute de forma independente
        await User_1.User.destroy({ where: {}, truncate: true });
    });
    // Executa apos a conclusao de todos os testes da suite
    (0, vitest_1.afterAll)(async () => {
        // Encerra o pool de conexao do banco
        await database_1.sequelize.close();
    });
    // 1. Testando Listagem Geral
    (0, vitest_1.describe)('GET /api/users', () => {
        (0, vitest_1.it)('deve retornar status 200 e uma lista de usuarios no formato JSON', async () => {
            // Act
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users');
            // Assert
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(Array.isArray(response.body)).toBe(true);
            if (response.body.length > 0) {
                (0, vitest_1.expect)(response.body[0]).toHaveProperty('id');
                (0, vitest_1.expect)(response.body[0]).toHaveProperty('nome');
                (0, vitest_1.expect)(response.body[0]).toHaveProperty('email');
                // Garante que o hash da senha nunca seja exposto na resposta HTTP
                (0, vitest_1.expect)(response.body[0]).not.toHaveProperty('senha_hash');
            }
        });
    });
    // 2. Testando Busca por ID
    (0, vitest_1.describe)('GET /api/users/:id', () => {
        (0, vitest_1.it)('deve retornar status 400 se o ID informado nao for um numero valido', async () => {
            // Act
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users/abc-invalido');
            // Assert
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toHaveProperty('erro');
        });
        (0, vitest_1.it)('deve retornar status 404 se o usuario nao existir', async () => {
            // Act
            const response = await (0, supertest_1.default)(app_1.app).get('/api/users/999999');
            // Assert
            (0, vitest_1.expect)(response.status).toBe(404);
            (0, vitest_1.expect)(response.body).toHaveProperty('erro');
            (0, vitest_1.expect)(response.body.erro).toBe('Usuário não encontrado.');
        });
    });
    // 3. Testando Criacao de Recursos com Validacao de Payload
    (0, vitest_1.describe)('POST /api/users', () => {
        (0, vitest_1.it)('deve cadastrar um novo usuario com sucesso e retornar status 201', async () => {
            // Arrange
            const novoUsuario = {
                nome: 'Mariana Silva',
                email: `mariana${Date.now()}@email.com`,
                password: 'senhaForte123',
            };
            // Act
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send(novoUsuario);
            // Assert
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body).toHaveProperty('id');
            (0, vitest_1.expect)(response.body.nome).toBe(novoUsuario.nome);
            (0, vitest_1.expect)(response.body.email).toBe(novoUsuario.email);
            (0, vitest_1.expect)(response.body).not.toHaveProperty('password');
            (0, vitest_1.expect)(response.body).not.toHaveProperty('senha_hash');
        });
        (0, vitest_1.it)('deve retornar status 400 se o campo obrigatorio nome estiver ausente', async () => {
            // Arrange
            const payloadInvalido = {
                email: `semnome${Date.now()}@email.com`,
                password: 'senhaForte123',
            };
            // Act
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/users')
                .send(payloadInvalido);
            // Assert
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toHaveProperty('erro');
            (0, vitest_1.expect)(response.body.erro).toBe('O campo nome é obrigatório.');
        });
        (0, vitest_1.it)('deve retornar status 400 se o e-mail informado for invalido', async () => {
            // Arrange
            const payloadEmailInvalido = {
                nome: 'Carlos Eduardo',
                email: 'formato-invalido-sem-arroba',
                password: 'senhaForte123',
            };
            // Act
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/users')
                .send(payloadEmailInvalido);
            // Assert
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toHaveProperty('erro');
        });
        (0, vitest_1.it)('deve retornar status 400 ao tentar cadastrar e-mail duplicado', async () => {
            // Arrange: Primeiro cadastro
            const emailDuplicado = `duplicado${Date.now()}@email.com`;
            await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 'Usuario Original',
                email: emailDuplicado,
                password: 'senhaOriginal123',
            });
            // Act: Tentativa de cadastro com o mesmo e-mail
            const response = await (0, supertest_1.default)(app_1.app).post('/api/users').send({
                nome: 'Usuario Clone',
                email: emailDuplicado,
                password: 'outraSenha123',
            });
            // Assert
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body).toHaveProperty('erro');
            (0, vitest_1.expect)(response.body.erro).toBe('Já existe um usuário cadastrado com este e-mail.');
        });
    });
    // 4. Testando Atualizacao de Recursos
    (0, vitest_1.describe)('PUT /api/users/:id', () => {
        (0, vitest_1.it)('deve retornar status 404 ao tentar atualizar um usuario inexistente', async () => {
            // Act
            const response = await (0, supertest_1.default)(app_1.app)
                .put('/api/users/999999')
                .send({ nome: 'Nome Atualizado' });
            // Assert
            (0, vitest_1.expect)(response.status).toBe(404);
            (0, vitest_1.expect)(response.body).toHaveProperty('erro');
            (0, vitest_1.expect)(response.body.erro).toBe('Usuário não encontrado.');
        });
    });
    // 5. Testando Exclusao de Recursos
    (0, vitest_1.describe)('DELETE /api/users/:id', () => {
        (0, vitest_1.it)('deve retornar status 404 ao tentar excluir um usuario inexistente', async () => {
            // Act
            const response = await (0, supertest_1.default)(app_1.app).delete('/api/users/999999');
            // Assert
            (0, vitest_1.expect)(response.status).toBe(404);
            (0, vitest_1.expect)(response.body).toHaveProperty('erro');
            (0, vitest_1.expect)(response.body.erro).toBe('Usuário não encontrado.');
        });
    });
});
