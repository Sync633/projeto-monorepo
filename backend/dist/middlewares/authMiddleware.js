"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        // Verifica se o token foi enviado no formato "Bearer <token>"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ erro: 'Token não fornecido.' });
        }
        const token = authHeader.split(' ')[1];
        // Valida a assinatura matematica do token com a chave secreta
        const usuarioDecodificado = jsonwebtoken_1.default.verify(token, auth_1.JWT_SECRET);
        // Salva os dados do usuario na requisição
        req.user = usuarioDecodificado;
        return next();
    }
    catch {
        return res.status(401).json({ erro: 'Token invalido ou expirado.' });
    }
}
