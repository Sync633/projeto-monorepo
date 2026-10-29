import express from 'express';
import { healthRoutes } from './routes/healthRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Registro da rota de verificação de integridade
app.use(healthRoutes);

// Demais rotas da aplicação
// app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`[API] Servidor ativo e escutando na porta ${port}`);
});