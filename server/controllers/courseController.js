const Course = require('../models/courseModel');

// Fonction pour créer un nouveau cours
exports.createCourse = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCourse = new Course({ name, description });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du cours' });
    }
};

// Fonction pour obtenir tous les cours
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
    }
};
