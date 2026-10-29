"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const userMetrics_1 = require("./userMetrics");
(0, vitest_1.describe)('Cálculo de Estatísticas e Métricas: userMetrics.ts', () => {
    (0, vitest_1.it)('deve retornar zeros para uma lista vazia de usuários', () => {
        // Arrange
        const emptyUsers = [];
        // Act
        const result = (0, userMetrics_1.calculateUserMetrics)(emptyUsers);
        // Assert
        (0, vitest_1.expect)(result).toEqual({
            totalUsers: 0,
            activeCount: 0,
            inactiveCount: 0,
            pendingCount: 0,
            activePercentage: 0,
        });
    });
    (0, vitest_1.it)('deve calcular corretamente 50% de contas ativas quando metade dos usuários estiver ativa', () => {
        // Arrange
        const users = [
            {
                id: 1,
                name: 'Carlos',
                email: 'carlos@fatec.sp.gov.br',
                role: 'aluno',
                status: 'ativo',
            },
            {
                id: 2,
                name: 'Ana',
                email: 'ana@fatec.sp.gov.br',
                role: 'professor',
                status: 'ativo',
            },
            {
                id: 3,
                name: 'Beatriz',
                email: 'beatriz@fatec.sp.gov.br',
                role: 'aluno',
                status: 'pendente',
            },
            {
                id: 4,
                name: 'Daniel',
                email: 'daniel@fatec.sp.gov.br',
                role: 'admin',
                status: 'inativo',
            },
        ];
        // Act
        const result = (0, userMetrics_1.calculateUserMetrics)(users);
        // Assert
        (0, vitest_1.expect)(result.totalUsers).toBe(4);
        (0, vitest_1.expect)(result.activeCount).toBe(2);
        (0, vitest_1.expect)(result.pendingCount).toBe(1);
        (0, vitest_1.expect)(result.inactiveCount).toBe(1);
        (0, vitest_1.expect)(result.activePercentage).toBe(50);
    });
    (0, vitest_1.it)('deve retornar 100% de usuários ativos quando todas as contas estiverem ativas', () => {
        // Arrange
        const users = [
            {
                id: 1,
                name: 'Carlos',
                email: 'carlos@fatec.sp.gov.br',
                role: 'aluno',
                status: 'ativo',
            },
            {
                id: 2,
                name: 'Ana',
                email: 'ana@fatec.sp.gov.br',
                role: 'professor',
                status: 'ativo',
            },
        ];
        // Act
        const result = (0, userMetrics_1.calculateUserMetrics)(users);
        // Assert
        (0, vitest_1.expect)(result.activePercentage).toBe(100);
    });
});
