import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  res.render('chat');
});

router.get('/products', async (req, res) => {
  res.render('products');
});

export default router;
