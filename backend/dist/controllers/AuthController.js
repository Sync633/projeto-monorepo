"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth_1 = require("../config/auth");
class AuthController {
    // POST /api/auth/login
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
            }
            // Busca usuario no banco local
            const user = await User_1.User.findOne({
                where: { email: email.trim().toLowerCase() },
            });
            if (!user || !user.senha_hash) {
                return res.status(401).json({ erro: 'Credenciais invalidas.' });
            }
            // Valida a senha comparando o texto puro com o hash
            const senhaValida = await bcryptjs_1.default.compare(password, user.senha_hash);
            if (!senhaValida) {
                return res.status(401).json({ erro: 'Credenciais invalidas.' });
            }
            // Gera o token JWT com validade de 1 hora
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, nome: user.nome }, auth_1.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                mensagem: 'Login realizado com sucesso!',
                token,
            });
        }
        catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
}
exports.AuthController = AuthController;
