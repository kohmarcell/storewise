import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Suppliers index endpoint - to be implemented' });
});

export default router;