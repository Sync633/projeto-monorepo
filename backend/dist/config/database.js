"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isTestEnvironment = process.env.NODE_ENV === 'test';
exports.sequelize = isTestEnvironment
    ? new sequelize_1.Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false, // Desativa logs SQL no terminal durante os testes para manter a saida limpa
    })
    : new sequelize_1.Sequelize(process.env.DB_NAME || 'fatec_db', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'postgres', {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        dialectOptions: process.env.DB_SSL === 'true'
            ? { ssl: { require: true, rejectUnauthorized: false } }
            : {},
        logging: false,
    });
