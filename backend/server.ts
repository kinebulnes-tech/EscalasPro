import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor de Escalas Clínicas Pro funcionando' });
});

app.get('/api/scales', (req, res) => {
  res.json({
    message: 'API de escalas disponible para futuras extensiones',
    scales: []
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
});

export default app;
