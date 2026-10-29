"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const validators_1 = require("./validators");
(0, vitest_1.describe)('Módulo de Validação: validators.ts', () => {
    (0, vitest_1.describe)('Função isValidEmail', () => {
        (0, vitest_1.it)('Deve retornar true para um endereço de e-mail válido AAA( Arrange, Act, Assert)', () => {
            // 1. Arrange (Preparar)
            const validEmail = 'aluno.fatec@so.gov.br';
            // 2. Act (Agir)
            const result = (0, validators_1.isValidEmail)(validEmail);
            // 3. Assert (Afirmar)
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('deve retornar false para e-mails com formato inválido', () => {
            // Arrange & Act
            (0, vitest_1.expect)((0, validators_1.isValidEmail)('usuario_sem_arroba.com')).toBe(false);
            (0, vitest_1.expect)((0, validators_1.isValidEmail)('usuario@dominio')).toBe(false);
            (0, vitest_1.expect)((0, validators_1.isValidEmail)('')).toBe(false);
        });
    });
    (0, vitest_1.describe)('Função isStrongPassword', () => {
        (0, vitest_1.it)('Deve aceitar uma senha com 8 caracteres, maiúscula e número', () => {
            // Arrange
            const strongPassword = 'Password123';
            // Act
            const result = (0, validators_1.isStrongPassword)(strongPassword);
            // Assert
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('Deve rejeitar senhas com menos de 8 caracteres', () => {
            const shortPassword = 'Pass1';
            const result = (0, validators_1.isStrongPassword)(shortPassword);
            (0, vitest_1.expect)(result).toBe(false);
        });
        (0, vitest_1.it)('Deve rejeitar senhas sem letras maiúsculas', () => {
            const noUpperPassword = 'password123';
            const result = (0, validators_1.isStrongPassword)(noUpperPassword);
            (0, vitest_1.expect)(result).toBe(false);
        });
        (0, vitest_1.it)('Deve rejeitar senhas sem números', () => {
            const noNumberPassword = 'PassowrdSemNumero';
            const result = (0, validators_1.isStrongPassword)(noNumberPassword);
            (0, vitest_1.expect)(result).toBe(false);
        });
    });
    (0, vitest_1.describe)('Função validateUserInput', () => {
        (0, vitest_1.it)('deve validar com sucesso um usuário com todos os campos corretos', () => {
            // Arrange
            const input = {
                name: 'Carlos Silva',
                email: 'carlos.silva@fatec.sp.gov.br',
                password: 'Password123',
                role: 'aluno',
            };
            // Act
            const validation = (0, validators_1.validateUserInput)(input);
            // Assert
            (0, vitest_1.expect)(validation.isValid).toBe(true);
            (0, vitest_1.expect)(validation.errors).toHaveLength(0);
        });
        (0, vitest_1.it)('deve retornar erro quando o nome tiver menos de 3 caracteres', () => {
            // Arrange
            const input = {
                name: 'AB',
                email: 'aluno@fatec.sp.gov.br',
            };
            // Act
            const validation = (0, validators_1.validateUserInput)(input);
            // Assert
            (0, vitest_1.expect)(validation.isValid).toBe(false);
            (0, vitest_1.expect)(validation.errors).toContain('O nome deve conter no mínimo 3 caracteres.');
        });
        (0, vitest_1.it)('deve retornar erro para perfil de acesso inválido', () => {
            // Arrange
            const input = {
                name: 'Carlos Silva',
                email: 'carlos.silva@fatec.sp.gov.br',
                role: 'visitante',
            };
            // Act
            const validation = (0, validators_1.validateUserInput)(input);
            // Assert
            (0, vitest_1.expect)(validation.isValid).toBe(false);
            (0, vitest_1.expect)(validation.errors).toContain('O Perfil de acesso informado é inválido.');
        });
    });
});
