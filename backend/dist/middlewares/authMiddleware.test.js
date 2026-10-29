"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("./authMiddleware");
// Mock do jsonwebtoken
vitest_1.vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vitest_1.vi.fn(),
        verify: vitest_1.vi.fn(),
    },
}));
// Helper para criar mocks de req, res e next
function createMocks() {
    const req = {
        headers: {},
    };
    const res = {
        status: vitest_1.vi.fn().mockReturnThis(),
        json: vitest_1.vi.fn().mockReturnThis(),
    };
    const next = vitest_1.vi.fn();
    return { req, res, next };
}
(0, vitest_1.describe)('authMiddleware', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('deve retornar 401 se o header Authorization não estiver presente', () => {
        const { req, res, next } = createMocks();
        (0, authMiddleware_1.authMiddleware)(req, res, next);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(401);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ erro: 'Token não fornecido.' });
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('deve retornar 401 se o header Authorization não começar com "Bearer "', () => {
        const { req, res, next } = createMocks();
        req.headers.authorization = 'Basic token123';
        (0, authMiddleware_1.authMiddleware)(req, res, next);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(401);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ erro: 'Token não fornecido.' });
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('deve retornar 401 se o token for inválido ou expirado', () => {
        const { req, res, next } = createMocks();
        req.headers.authorization = 'Bearer tokeninvalido';
        vitest_1.vi.mocked(jsonwebtoken_1.default.verify).mockImplementation(() => {
            throw new Error('jwt malformed');
        });
        (0, authMiddleware_1.authMiddleware)(req, res, next);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(401);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            erro: 'Token invalido ou expirado.',
        });
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('deve chamar next() e salvar o usuário decodificado se o token for válido', () => {
        const { req, res, next } = createMocks();
        req.headers.authorization = 'Bearer tokenvalido';
        const decodedUser = { id: 1, email: 'teste@email.com', nome: 'Teste' };
        vitest_1.vi.mocked(jsonwebtoken_1.default.verify).mockReturnValue(decodedUser);
        (0, authMiddleware_1.authMiddleware)(req, res, next);
        (0, vitest_1.expect)(next).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(req.user).toEqual(decodedUser);
        (0, vitest_1.expect)(res.status).not.toHaveBeenCalled();
    });
});
