"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isStrongPassword = isStrongPassword;
exports.validateUserInput = validateUserInput;
/**
 * Valida o formato de um endereço de e-mail
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string')
        return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}
/**
 * Valida os requisitos de segurança de uma senha:
 * - Mínimo de 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos um número
 */
function isStrongPassword(password) {
    if (!password || password.length < 8)
        return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasNumber;
}
/**
 * Valida os dados para cadastro ou atualização de um usuário
 */
function validateUserInput(input) {
    const errors = [];
    if (!input.name || input.name.trim().length < 3) {
        errors.push('O nome deve conter no mínimo 3 caracteres.');
    }
    if (!input.email || !isValidEmail(input.email)) {
        errors.push('O e-mail informado é inválido.');
    }
    if (input.password !== undefined && !isStrongPassword(input.password)) {
        errors.push('A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula e 1 número.');
    }
    const validRoles = ['admin', 'aluno', 'professor'];
    if (input.role && !validRoles.includes(input.role)) {
        errors.push('O Perfil de acesso informado é inválido.');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
