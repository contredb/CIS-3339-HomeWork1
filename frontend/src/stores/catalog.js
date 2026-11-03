import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    students: [],
    courses: []
  }),
  actions: {
    async fetchStudents() {
      const response = await axios.get(`${API_URL}/students`)
      this.students = response.data
    },
    async addStudent(student) {
      const response = await axios.post(`${API_URL}/add-student`, student)
      this.students.push(response.data.student)
      return response.data
    },
    async deleteStudent(name) {
      const response = await axios.post(`${API_URL}/delete-student`, { name })
      this.students = this.students.filter(student => student.id !== response.data.student.id)
      return response.data
    },
    async fetchCourses() {
      const response = await axios.get(`${API_URL}/courses`)
      this.courses = response.data
    },
    async addCourse(course) {
      const response = await axios.post(`${API_URL}/add-course`, course)
      this.courses.push(response.data.course)
      return response.data
    },
    async deleteCourse(courseId) {
      const response = await axios.post(`${API_URL}/delete-course`, { courseId })
      this.courses = this.courses.filter(course => course.courseId !== response.data.course.courseId)
      return response.data
    }
  }
})
