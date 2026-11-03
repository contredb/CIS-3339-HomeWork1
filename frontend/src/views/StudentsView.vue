<template>
  <main class="page">
    <h1 class="page-title">Student Management</h1>

    <section class="card">
      <h2>Search for a Student</h2>
      <div class="inline-form">
        <label for="student-search">Student name</label>
        <input id="student-search" v-model="searchName" placeholder="Enter name" />
        <button type="button" @click="searchStudents">Search</button>
        <button type="button" class="button-secondary" @click="clearResults">Clear</button>
      </div>
    </section>

    <section class="card">
      <h2>Add a Student</h2>
      <form class="form-grid" @submit.prevent="addStudent">
        <label class="field">Name<input v-model="newStudent.name" required /></label>
        <label class="field">ID<input v-model="newStudent.id" required /></label>
        <label class="field">Phone<input v-model="newStudent.phone" required /></label>
        <label class="field">Zip<input v-model="newStudent.zip" required /></label>
        <div class="form-actions"><button type="submit">Add Student</button></div>
      </form>
      <p v-if="errorMessage" class="feedback feedback-error" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="feedback feedback-success" role="status">{{ successMessage }}</p>
    </section>

    <section class="card table-card">
      <h2>Search Results</h2>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Phone</th>
              <th>Zip</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.name }}</td>
              <td>{{ student.id }}</td>
              <td>{{ student.phone }}</td>
              <td>{{ student.zip }}</td>
              <td><button class="button-danger" @click="deleteStudent(student.name)">Delete</button></td>
            </tr>
            <tr v-if="students.length === 0">
              <td colspan="5" class="empty-state">No students searched or found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const students = ref([])
const searchName = ref('')
const newStudent = ref({ name: '', id: '', phone: '', zip: '' })
const errorMessage = ref('')
const successMessage = ref('')

const searchStudents = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    const response = await axios.post('http://localhost:3000/api/find-student', { name: searchName.value })
    students.value = [response.data]
  } catch (err) {
    errorMessage.value = 'Student not found.'
    successMessage.value = ''
    students.value = []
  }
}

const clearResults = () => {
  students.value = []
  searchName.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

const addStudent = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    const response = await axios.post('http://localhost:3000/api/add-student', newStudent.value)
    successMessage.value = response.data.message || 'Student added successfully!'
    newStudent.value = { name: '', id: '', phone: '', zip: '' }
  } catch (err) {
    successMessage.value = ''
    errorMessage.value = err.response?.data?.error || 'Failed to add student. ID might be a duplicate.'
  }
}

const deleteStudent = async (name) => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    await axios.post('http://localhost:3000/api/delete-student', { name })
    students.value = students.value.filter(s => s.name !== name)
    successMessage.value = 'Student deleted successfully!'
  } catch (err) {
    errorMessage.value = 'Failed to delete student.'
  }
}
</script>