require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cis3339_homework1';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// --- Mongoose Schemas & Models ---
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    zip: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true }
});
const Course = mongoose.model('Course', courseSchema);

const enrollmentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    courseId: { type: String, required: true }
});
// Ensure a student cannot enroll in the same course twice at the schema/index level
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// STUDENT ENDPOINTS

app.get('/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.send(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/find-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const student = await Student.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send(student);
    } catch (error) {
        console.error('Error finding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;
        if (!name || !id || !phone || !zip) {
            return res.status(400).send({ error: 'All fields (name, id, phone, zip) are required' });
        }

        const newStudent = new Student({ name, id, phone, zip });
        await newStudent.save();

        res.status(201).send({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ error: 'Failed to add student. ID already exists.' });
        }
        console.error('Error adding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/delete-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const deletedStudent = await Student.findOneAndDelete({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!deletedStudent) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send({ message: 'Student deleted successfully', student: deletedStudent });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// COURSE ENDPOINTS

app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({});
        res.send(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/add-course', async (req, res) => {
    try {
        const { courseId, courseName } = req.body;
        if (!courseId || !courseName) {
            return res.status(400).send({ error: 'Both Course ID and Course Name are required' });
        }

        const newCourse = new Course({ courseId, courseName });
        await newCourse.save();

        res.status(201).send({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ error: 'Failed to add course. Course ID already exists.' });
        }
        console.error('Error adding course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/delete-course', async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).send({ error: 'Course ID is required' });
        }

        const deletedCourse = await Course.findOneAndDelete({ courseId });
        if (!deletedCourse) {
            return res.status(404).send({ error: 'Course not found' });
        }

        res.send({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// ENROLLMENT ENDPOINTS

app.post('/enroll-student', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        if (!studentId || !courseId) {
            return res.status(400).send({ error: 'Both student ID and course ID are required' });
        }

        const newEnrollment = new Enrollment({ studentId, courseId });
        await newEnrollment.save();

        res.status(201).send({ message: 'Student enrolled successfully!', enrollment: newEnrollment });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ error: 'Student is already enrolled in this course.' });
        }
        console.error('Error enrolling student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/course-enrollments', async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).send({ error: 'Course ID is required' });
        }

        const enrollments = await Enrollment.find({ courseId });
        const enrolledStudentIds = enrollments.map(e => e.studentId);
        const students = await Student.find({ id: { $in: enrolledStudentIds } });

        res.send(students);
    } catch (error) {
        console.error('Error fetching course enrollments:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Serve Vue production build assets from the frontend dist folder
const frontendDistPath = path.join(__dirname, '../frontend/dist'); 
app.use(express.static(frontendDistPath));

// Fallback to index.html for Vue Router (SPA support)
// Use a regular expression catch-all to prevent path-to-regexp errors
app.get(/^[^\/].*$/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});