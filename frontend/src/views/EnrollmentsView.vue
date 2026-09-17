<template>
  <div>
    <h2>Enrollment Management</h2>

    <!-- Enroll Student Form -->
    <div style="margin-bottom: 30px; border: 1px solid #ccc; padding: 15px;">
      <h3>Enroll a Student in a Course</h3>
      <form @submit.prevent="enrollStudent">
        <div style="margin-bottom: 10px;">
          <label>Select Student: </label>
          <select v-model="selectedStudentId" required>
            <option disabled value="">-- Choose a Student --</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.name }} (ID: {{ student.id }})
            </option>
          </select>
        </div>

        <div style="margin-bottom: 10px;">
          <label>Select Course: </label>
          <select v-model="selectedCourseId" required>
            <option disabled value="">-- Choose a Course --</option>
            <option v-for="course in courses" :key="course.courseId" :value="course.courseId">
              {{ course.courseName }} (Code: {{ course.courseId }})
            </option>
          </select>
        </div>

        <button type="submit">Enroll Student</button>
      </form>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    </div>

    <!-- View Course Roster -->
    <div style="border: 1px solid #ccc; padding: 15px;">
      <h3>View Course Roster</h3>
      <div style="margin-bottom: 10px;">
        <label>Select Course to View Roster: </label>
        <select v-model="rosterCourseId" @change="fetchRoster">
          <option disabled value="">-- Choose a Course --</option>
          <option v-for="course in courses" :key="course.courseId" :value="course.courseId">
            {{ course.courseName }} (Code: {{ course.courseId }})
          </option>
        </select>
      </div>

      <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>ID</th>
            <th>Phone</th>
            <th>Zip</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in enrolledStudents" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.id }}</td>
            <td>{{ student.phone }}</td>
            <td>{{ student.zip }}</td>
          </tr>
          <tr v-if="enrolledStudents.length === 0">
            <td colspan="4" style="text-align: center;">No students enrolled in this course</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const students = ref([])
const courses = ref([])
const selectedStudentId = ref('')
const selectedCourseId = ref('')
const rosterCourseId = ref('')
const enrolledStudents = ref([])

const errorMessage = ref('')
const successMessage = ref('')

// Load students and courses from backend for dropdowns
const fetchDropdownData = async () => {
  try {
    const studentRes = await axios.get('http://localhost:3000/students')
    students.value = studentRes.data

    const courseRes = await axios.get('http://localhost:3000/courses')
    courses.value = courseRes.data
  } catch (err) {
    errorMessage.value = 'Failed to load dropdown data from backend.'
  }
}

const enrollStudent = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    
    const response = await axios.post('http://localhost:3000/enroll-student', {
      studentId: selectedStudentId.value,
      courseId: selectedCourseId.value
    })
    
    successMessage.value = response.data.message
    selectedStudentId.value = ''
    selectedCourseId.value = ''
    
    // Refresh roster if currently viewing that course
    if (rosterCourseId.value) {
      fetchRoster()
    }
  } catch (err) {
    successMessage.value = ''
    errorMessage.value = err.response?.data?.error || 'Failed to enroll student.'
  }
}

const fetchRoster = async () => {
  try {
    errorMessage.value = ''
    const response = await axios.post('http://localhost:3000/course-enrollments', {
      courseId: rosterCourseId.value
    })
    enrolledStudents.value = response.data
  } catch (err) {
    errorMessage.value = 'Failed to load course roster.'
  }
}

onMounted(() => {
  fetchDropdownData()
})
</script>