"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express_1 = require("express");
exports.healthRoutes = (0, express_1.Router)();
exports.healthRoutes.get('/health', (req, res) => {
    const healthData = {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        memoryUsage: {
            rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
            heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        },
    };
    return res.status(200).json(healthData);
});
