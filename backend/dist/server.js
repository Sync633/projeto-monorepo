"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const healthRoutes_1 = require("./routes/healthRoutes");
const app = (0, express_1.default)();
app.disable('x-powered-by');
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Registro da rota de verificação de integridade
app.use(healthRoutes_1.healthRoutes);
// Demais rotas da aplicação
// app.use('/users', userRoutes);
app.listen(port, () => {
    console.log(`[API] Servidor ativo e escutando na porta ${port}`);
});
