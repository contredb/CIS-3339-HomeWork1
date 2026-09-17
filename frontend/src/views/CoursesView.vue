<template>
  <div>
    <h2>Course Management</h2>

    <!-- Add Course Form -->
    <div style="margin-bottom: 20px;">
      <h3>Add a Course</h3>
      <form @submit.prevent="addCourse">
        <div><label>Course Name: </label><input v-model="newCourse.name" required /></div>
        <div><label>Course Code: </label><input v-model="newCourse.code" required /></div>
        <div><label>Credits: </label><input v-model="newCourse.credits" type="number" required /></div>
        <button type="submit" style="margin-top: 5px;">Add Course</button>
      </form>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    </div>

    <!-- Results Table -->
    <h3>Courses List:</h3>
    <table border="1" cellpadding="5" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Code</th>
          <th>Credits</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course.code">
          <td>{{ course.name }}</td>
          <td>{{ course.code }}</td>
          <td>{{ course.credits }}</td>
          <td><button @click="deleteCourse(course.code)">Delete</button></td>
        </tr>
        <tr v-if="courses.length === 0">
          <td colspan="4" style="text-align: center;">No courses found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const courses = ref([])
const newCourse = ref({ name: '', code: '', credits: '' })
const errorMessage = ref('')
const successMessage = ref('')

const addCourse = () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    
    // Check for duplicate course code
    if (courses.value.some(c => c.code === newCourse.value.code)) {
      errorMessage.value = 'Course code already exists.'
      return
    }

    courses.value.push({ ...newCourse.value })
    successMessage.value = 'Course added successfully!'
    newCourse.value = { name: '', code: '', credits: '' }
  } catch (err) {
    errorMessage.value = 'Failed to add course.'
  }
}

const deleteCourse = (code) => {
  try {
    errorMessage.value = ''
    courses.value = courses.value.filter(c => c.code !== code)
  } catch (err) {
    errorMessage.value = 'Failed to delete course.'
  }
}
</script>