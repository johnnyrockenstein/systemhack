import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => res.render('index.html'));
routes.get('/hack', (req, res) => res.render('hacker.html'));

export default routes;