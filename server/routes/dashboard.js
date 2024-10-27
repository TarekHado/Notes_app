const express = require('express');
const router = express.Router();
const  isLoggedIn  = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashBoardController');

router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/add', isLoggedIn, dashboardController.createNotePage);
router.get('/dashboard/search', isLoggedIn, dashboardController.searchNotePage);
router.post('/dashboard/search', isLoggedIn, dashboardController.searchNote);
router.post('/dashboard/add', isLoggedIn, dashboardController.createNote);
router.get('/dashboard/note/:id', isLoggedIn, dashboardController.viewNote);
router.delete('/dashboard/note/:id', isLoggedIn, dashboardController.deleteNote);
router.put('/dashboard/note/:id', isLoggedIn, dashboardController.editNote);



module.exports = router;