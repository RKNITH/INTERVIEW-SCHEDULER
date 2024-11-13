const express = require('express');
const router = express.Router();

const apiCtrl = require('../controllers/api');
const userCtrl = require('../controllers/user');
const middleware = require('./middleware/middleware');

router.get('/interviews',apiCtrl.getAllInterviews);

router.post('/create-interview',apiCtrl.createInterview);
router.put('/update-interview/:id',apiCtrl.updateInterview);
router.delete('/delete-interview/:id',apiCtrl.deleteInterview);

router.get('/get-all-users',userCtrl.getAllUsers);

router.post('/generate-fake-users',middleware.apiGuard,userCtrl.generateFakeUsers);

module.exports = router;
