<template>
  <div>
    <h2>Course Management</h2>

    <!-- Add Course Form -->
    <div style="margin-bottom: 20px;">
      <h3>Add a Course</h3>
      <form @submit.prevent="addCourse">
        <div><label>Course ID: </label><input v-model="newCourse.courseId" required /></div>
        <div><label>Course Name: </label><input v-model="newCourse.courseName" required /></div>
        <button type="submit" style="margin-top: 5px;">Add Course</button>
      </form>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    </div>

    <!-- Courses List Table -->
    <h3>Courses List:</h3>
    <table border="1" cellpadding="5" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Course ID</th>
          <th>Course Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course.courseId">
          <td>{{ course.courseId }}</td>
          <td>{{ course.courseName }}</td>
          <td><button @click="deleteCourse(course.courseId)">Delete</button></td>
        </tr>
        <tr v-if="courses.length === 0">
          <td colspan="3" style="text-align: center;">No courses found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = ref([])
const newCourse = ref({ courseId: '', courseName: '' })
const errorMessage = ref('')
const successMessage = ref('')

const fetchCourses = async () => {
  try {
    errorMessage.value = ''
    const response = await axios.get('http://localhost:3000/courses')
    courses.value = response.data
  } catch (err) {
    errorMessage.value = 'Failed to load courses.'
  }
}

const addCourse = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    const response = await axios.post('http://localhost:3000/add-course', newCourse.value)
    successMessage.value = response.data.message || 'Course added successfully!'
    newCourse.value = { courseId: '', courseName: '' }
    fetchCourses()
  } catch (err) {
    successMessage.value = ''
    errorMessage.value = err.response?.data?.error || 'Failed to add course. ID might be a duplicate.'
  }
}

const deleteCourse = async (courseId) => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    await axios.post('http://localhost:3000/delete-course', { courseId })
    fetchCourses()
    successMessage.value = 'Course deleted successfully!'
  } catch (err) {
    errorMessage.value = 'Failed to delete course.'
  }
}

onMounted(() => {
  fetchCourses()
})
</script>