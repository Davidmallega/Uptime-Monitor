// routes/index.js
import { Router } from 'express';
import { listar, crear, eliminar } from '../controllers/urlsController.js';
import { dashboard, historico } from '../controllers/dashboardController.js';
import { pingearTodas } from '../controllers/jobController.js';
import { autenticarJob } from '../middleware/autenticarJob.js';

const router = Router();

// Públicas (lo que usa el frontend)
router.get('/urls', listar);
router.post('/urls', crear);
router.delete('/urls/:id', eliminar);
router.get('/dashboard', dashboard);
router.get('/dashboard/urls/:id/historico', historico);

// Protegida (solo Cloud Scheduler la puede llamar)
router.post('/jobs/ping-all', autenticarJob, pingearTodas);

export default router;
