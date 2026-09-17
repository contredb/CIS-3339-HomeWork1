<template>
  <div>
    <h2>Student Management</h2>

    <!-- Search Student -->
    <div style="margin-bottom: 20px;">
      <h3>Search for a Student</h3>
      <label>Student Name: </label>
      <input v-model="searchName" placeholder="Enter name" />
      <button @click="searchStudents">Search</button>
    </div>

    <!-- Add Student Form -->
    <div style="margin-bottom: 20px;">
      <h3>Add a Student</h3>
      <form @submit.prevent="addStudent">
        <div><label>Name: </label><input v-model="newStudent.name" required /></div>
        <div><label>ID: </label><input v-model="newStudent.id" required /></div>
        <div><label>Phone: </label><input v-model="newStudent.phone" required /></div>
        <div><label>Zip: </label><input v-model="newStudent.zip" required /></div>
        <button type="submit" style="margin-top: 5px;">Add Student</button>
      </form>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    </div>

    <!-- Results Table -->
    <h3>Result:</h3>
    <table border="1" cellpadding="5" style="border-collapse: collapse;">
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
          <td><button @click="deleteStudent(student.name)">Delete</button></td>
        </tr>
        <tr v-if="students.length === 0">
          <td colspan="5" style="text-align: center;">No students found</td>
        </tr>
      </tbody>
    </table>
  </div>
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
    const response = await axios.post('http://localhost:3000/find-student', { name: searchName.value })
    students.value = [response.data]
  } catch (err) {
    errorMessage.value = 'Student not found.'
    students.value = []
  }
}

const addStudent = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    const response = await axios.post('http://localhost:3000/add-student', newStudent.value)
    successMessage.value = response.data.message || 'Student added successfully!'
    students.value.push({ ...newStudent.value })
    newStudent.value = { name: '', id: '', phone: '', zip: '' }
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Failed to add student.'
  }
}

const deleteStudent = async (name) => {
  try {
    errorMessage.value = ''
    await axios.post('http://localhost:3000/delete-student', { name })
    students.value = students.value.filter(s => s.name !== name)
  } catch (err) {
    errorMessage.value = 'Failed to delete student.'
  }
}
</script>