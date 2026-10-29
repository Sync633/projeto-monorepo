"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./docs/swagger.json"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
exports.app = app;
app.disable('x-powered-by');
// Middlewares globais
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rota de Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        mensagem: 'Servidor Backend rodando com sucesso.',
        timestamp: new Date().toISOString(),
    });
});
// Rota da documentação interativa
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// Registra todas as rotas da aplicacao sob o prefixo /api
app.use('/api', routes_1.appRoutes);
