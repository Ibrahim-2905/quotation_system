import express from 'express';
import quotationController from '../controllers/quotationController.js';
import authenticateUser from '../middlewares/authenticateUser.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

router.get('/', quotationController.getQuotations);
router.post('/', quotationController.createQuotation);
router.get('/:id', quotationController.getQuotation);
router.put('/:id', quotationController.updateQuotation);
router.delete('/:id', quotationController.deleteQuotation);

export default router;