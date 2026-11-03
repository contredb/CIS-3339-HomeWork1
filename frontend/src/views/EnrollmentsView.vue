<template>
  <main class="page">
    <h1 class="page-title">Enrollment Management</h1>

    <section class="card">
      <h2>Enroll a Student in a Course</h2>
      <form class="form-grid" @submit.prevent="enrollStudent">
        <label class="field">
          Select Student
          <select v-model="selectedStudentId" required>
            <option disabled value="">-- Choose a Student --</option>
            <option v-for="student in catalogStore.students" :key="student.id" :value="student.id">
              {{ student.name }} (ID: {{ student.id }})
            </option>
          </select>
        </label>

        <label class="field">
          Select Course
          <select v-model="selectedCourseId" required>
            <option disabled value="">-- Choose a Course --</option>
            <option v-for="course in catalogStore.courses" :key="course.courseId" :value="course.courseId">
              {{ course.courseName }} (Code: {{ course.courseId }})
            </option>
          </select>
        </label>

        <div class="form-actions"><button type="submit">Enroll Student</button></div>
      </form>
      <p v-if="errorMessage" class="feedback feedback-error" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="feedback feedback-success" role="status">{{ successMessage }}</p>
    </section>

    <section class="card table-card">
      <h2>View Course Roster</h2>
      <div class="roster-filter">
        <label class="field">
          Select Course
          <select v-model="rosterCourseId" @change="fetchRoster">
            <option disabled value="">-- Choose a Course --</option>
            <option v-for="course in catalogStore.courses" :key="course.courseId" :value="course.courseId">
              {{ course.courseName }} (Code: {{ course.courseId }})
            </option>
          </select>
        </label>
      </div>

      <div class="table-scroll">
        <table class="data-table">
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
              <td colspan="4" class="empty-state">No students enrolled in this course</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useCatalogStore } from '../stores/catalog'

const catalogStore = useCatalogStore()
const selectedStudentId = ref('')
const selectedCourseId = ref('')
const rosterCourseId = ref('')
const enrolledStudents = ref([])

const errorMessage = ref('')
const successMessage = ref('')

const fetchDropdownData = async () => {
  try {
    await Promise.all([catalogStore.fetchStudents(), catalogStore.fetchCourses()])
  } catch (err) {
    errorMessage.value = 'Failed to load dropdown data from backend.'
  }
}

const enrollStudent = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    
    const response = await axios.post('http://localhost:3000/api/enroll-student', {
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
    const response = await axios.post('http://localhost:3000/api/course-enrollments', {
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