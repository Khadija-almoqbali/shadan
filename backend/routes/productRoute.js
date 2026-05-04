import express from 'express';
const router = express.Router();
import {getProducts , getProductById} from '../controllers/productController.js';

router.route('/').get(getProducts); //all products
router.route('/:id').get(getProductById); //single product

export default router;