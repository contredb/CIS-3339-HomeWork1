<template>
  <main class="page">
    <h1 class="page-title">Course Management</h1>

    <section class="card">
      <h2>Add a Course</h2>
      <form class="form-grid" @submit.prevent="addCourse">
        <label class="field">Course ID<input v-model="newCourse.courseId" required /></label>
        <label class="field">Course Name<input v-model="newCourse.courseName" required /></label>
        <div class="form-actions"><button type="submit">Add Course</button></div>
      </form>
      <p v-if="errorMessage" class="feedback feedback-error" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="feedback feedback-success" role="status">{{ successMessage }}</p>
    </section>

    <section class="card table-card">
      <h2>Courses List</h2>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in catalogStore.courses" :key="course.courseId">
              <td>{{ course.courseId }}</td>
              <td>{{ course.courseName }}</td>
              <td><button class="button-danger" @click="deleteCourse(course.courseId)">Delete</button></td>
            </tr>
            <tr v-if="catalogStore.courses.length === 0">
              <td colspan="3" class="empty-state">No courses found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCatalogStore } from '../stores/catalog'

const catalogStore = useCatalogStore()
const newCourse = ref({ courseId: '', courseName: '' })
const errorMessage = ref('')
const successMessage = ref('')

const fetchCourses = async () => {
  try {
    errorMessage.value = ''
    await catalogStore.fetchCourses()
  } catch (err) {
    errorMessage.value = 'Failed to load courses.'
  }
}

const addCourse = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    const response = await catalogStore.addCourse(newCourse.value)
    successMessage.value = response.message || 'Course added successfully!'
    newCourse.value = { courseId: '', courseName: '' }
  } catch (err) {
    successMessage.value = ''
    errorMessage.value = err.response?.data?.error || 'Failed to add course. ID might be a duplicate.'
  }
}

const deleteCourse = async (courseId) => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    await catalogStore.deleteCourse(courseId)
    successMessage.value = 'Course deleted successfully!'
  } catch (err) {
    errorMessage.value = 'Failed to delete course.'
  }
}

onMounted(() => {
  fetchCourses()
})
</script>