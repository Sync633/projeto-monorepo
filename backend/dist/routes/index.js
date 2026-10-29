"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const express_1 = require("express");
const authRoutes_1 = require("./authRoutes");
const userRoutes_1 = require("./userRoutes");
const router = (0, express_1.Router)();
exports.appRoutes = router;
router.use('/auth', authRoutes_1.authRoutes);
// Registra as rotas de usuários sob o prefixo /users
router.use('/users', userRoutes_1.userRoutes);
