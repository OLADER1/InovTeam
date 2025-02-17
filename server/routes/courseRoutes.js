const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses } = require('../controllers/courseController');

// Route pour créer un nouveau cours
router.post('/create', createCourse);

// Route pour obtenir tous les cours
router.get('/', getAllCourses);

module.exports = router;
