import { Router } from 'express';
import SeedController from './app/controllers/SeedController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ teste: 'ok' });
});

routes.post('/seeds', SeedController.store);

export default routes;
