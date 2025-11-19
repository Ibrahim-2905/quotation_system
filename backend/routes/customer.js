import express from 'express';
import customerController from '../controllers/customerController.js';
import authenticateUser from '../middlewares/authenticateUser.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer);
router.get('/:id', customerController.getCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;