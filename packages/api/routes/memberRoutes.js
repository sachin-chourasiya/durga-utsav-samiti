const express = require('express');
const router = express.Router();
const { getMembers, updatePayment, getMonthlyTotals, setDefaultAmount } = require('../controllers/memberController');
const { auth, isAdmin } = require('../middlewares/auth');

router.get('/members', auth, getMembers);
router.post('/admin/update-payment', auth, isAdmin, updatePayment);
router.get('/admin/monthly-collection', auth, isAdmin, getMonthlyTotals);
router.post('/admin/set-amount', auth, isAdmin, setDefaultAmount);

module.exports = router;