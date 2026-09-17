const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const STUDENTS_FILE = path.join(__dirname, 'students.json');
const COURSES_FILE = path.join(__dirname, 'courses.json');

// --- Helper Functions for Students ---
async function loadStudents() {
    try {
        const data = await fs.promises.readFile(STUDENTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        console.error('Error reading students file:', error);
        return [];
    }
}

async function saveStudents(students) {
    try {
        await fs.promises.writeFile(STUDENTS_FILE, JSON.stringify(students, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing students file:', error);
        throw error;
    }
}

// --- Helper Functions for Courses ---
async function loadCourses() {
    try {
        const data = await fs.promises.readFile(COURSES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        console.error('Error reading courses file:', error);
        return [];
    }
}

async function saveCourses(courses) {
    try {
        await fs.promises.writeFile(COURSES_FILE, JSON.stringify(courses, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing courses file:', error);
        throw error;
    }
}


// ==========================================
// STUDENT ENDPOINTS
// ==========================================

// Endpoint to get all students (if needed)
app.get('/students', async (req, res) => {
    try {
        const students = await loadStudents();
        res.send(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to search for a student by name
app.post('/find-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const students = await loadStudents();
        const student = students.find((item) => item.name.toLowerCase() === name.toLowerCase());
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send(student);
    } catch (error) {
        console.error('Error finding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to save a student with duplicate ID validation
app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;
        if (!name || !id || !phone || !zip) {
            return res.status(400).send({ error: 'All fields (name, id, phone, zip) are required' });
        }

        const students = await loadStudents();
        
        // Prevent duplicate student IDs
        const existingStudent = students.find((item) => item.id === id);
        if (existingStudent) {
            return res.status(400).send({ error: 'Failed to add student. ID might be a duplicate.' });
        }

        const newStudent = { name, id, phone, zip };
        students.push(newStudent);
        await saveStudents(students);

        res.status(201).send({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to delete a student by name
app.post('/delete-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const students = await loadStudents();
        const index = students.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
        if (index === -1) {
            return res.status(404).send({ error: 'Student not found' });
        }

        const deletedStudent = students.splice(index, 1)[0];
        await saveStudents(students);

        res.send({ message: 'Student deleted successfully', student: deletedStudent });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});


// ==========================================
// COURSE ENDPOINTS
// ==========================================

// Endpoint to list all courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await loadCourses();
        res.send(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to add a course with duplicate course ID validation
app.post('/add-course', async (req, res) => {
    try {
        const { courseId, courseName } = req.body;
        if (!courseId || !courseName) {
            return res.status(400).send({ error: 'Both Course ID and Course Name are required' });
        }

        const courses = await loadCourses();
        
        // Prevent duplicate course IDs
        const existingCourse = courses.find((item) => item.courseId === courseId);
        if (existingCourse) {
            return res.status(400).send({ error: 'Failed to add course. Course ID might be a duplicate.' });
        }

        const newCourse = { courseId, courseName };
        courses.push(newCourse);
        await saveCourses(courses);

        res.status(201).send({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to delete a course by courseId
app.post('/delete-course', async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).send({ error: 'Course ID is required' });
        }

        const courses = await loadCourses();
        const index = courses.findIndex((item) => item.courseId === courseId);
        if (index === -1) {
            return res.status(404).send({ error: 'Course not found' });
        }

        const deletedCourse = courses.splice(index, 1)[0];
        await saveCourses(courses);

        res.send({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});