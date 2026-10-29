"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
class UserController {
    // GET /api/users - Lista todos os usuários
    static async index(req, res) {
        try {
            const users = await User_1.User.findAll({
                attributes: ['id', 'nome', 'email', 'createdAt', 'updatedAt'],
            });
            return res.status(200).json(users);
        }
        catch (error) {
            return res
                .status(500)
                .json({ erro: 'Erro ao listar usuários', detalhe: error.message });
        }
    }
    // GET /api/users/:id - Busca um usuario por ID
    static async show(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                return res
                    .status(400)
                    .json({ erro: 'O ID informado deve ser um numero valido.' });
            }
            const user = await User_1.User.findByPk(id, {
                attributes: ['id', 'nome', 'email', 'createdAt'],
            });
            if (!user) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res
                .status(500)
                .json({ erro: 'Erro ao buscar usuário', detalhe: error.message });
        }
    }
    // POST /api/users - Cadastrar um novo usuário
    static async create(req, res) {
        try {
            const { nome, email, password } = req.body;
            if (!nome || typeof nome !== 'string' || nome.trim() === '') {
                return res.status(400).json({ erro: 'O campo nome é obrigatório.' });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email.trim())) {
                return res.status(400).json({ erro: 'Informe um e-mail valido.' });
            }
            if (!password || typeof password !== 'string' || password.length < 6) {
                return res
                    .status(400)
                    .json({ erro: 'A senha deve conter no minimo 6 caracteres.' });
            }
            const userExistente = await User_1.User.findOne({
                where: { email: email.trim() },
            });
            if (userExistente) {
                return res
                    .status(400)
                    .json({ erro: 'Já existe um usuário cadastrado com este e-mail.' });
            }
            const senha_hash = await bcryptjs_1.default.hash(password, 10);
            const novoUser = await User_1.User.create({
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                senha_hash,
            });
            return res.status(201).json({
                id: novoUser.id,
                nome: novoUser.nome,
                email: novoUser.email,
                createdAt: novoUser.createdAt,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ erro: 'Erro ao cadastrar usuário', detalhe: error.message });
        }
    }
    // PUT /api/users/:id - Atualiza um usuário existente
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                return res
                    .status(400)
                    .json({ erro: 'O ID informado deve ser um numero valido.' });
            }
            const { nome, email } = req.body;
            const user = await User_1.User.findByPk(id);
            if (!user) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }
            if (nome !== undefined) {
                if (typeof nome !== 'string' || nome.trim() === '') {
                    return res
                        .status(404)
                        .json({ erro: 'O campo nome deve ser um texto valido.' });
                }
                user.nome = nome.trim();
            }
            if (email != undefined) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.trim())) {
                    return res.status(400).json({ erro: 'Informe um e-mail valido.' });
                }
                const emailEmUso = await User_1.User.findOne({
                    where: { email: email.trim().toLowerCase() },
                });
                if (emailEmUso && emailEmUso.id !== id) {
                    return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
                }
                user.email = email.trim().toLowerCase();
            }
            await user.save();
            return res.status(200).json({
                id: user.id,
                nome: user.nome,
                email: user.email,
                createdAt: user.createdAt,
            });
        }
        catch (error) {
            return res
                .status(500)
                .json({ erro: 'Erro ao atualizar usuário', detalhe: error.message });
        }
    }
    // DELETE /api/users/:id - Remove um usuário
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                return res
                    .status(400)
                    .json({ erro: 'O ID informado deve ser um numero valido.' });
            }
            const user = await User_1.User.findByPk(id);
            if (!user) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }
            await user.destroy();
            // 204 No Content
            return res.status(204).send();
        }
        catch (error) {
            return res
                .status(500)
                .json({ erro: 'Erro ao excluir usuário', detalhe: error.message });
        }
    }
}
exports.UserController = UserController;
