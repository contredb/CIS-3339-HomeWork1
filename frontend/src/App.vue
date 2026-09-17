<template>
  <div id="app">
    <nav style="margin-bottom: 20px;">
      <router-link to="/students">Students</router-link> | 
      <router-link to="/courses">Courses</router-link> |
      <router-link to="/enrollments">Enrollments</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
// App layout component
</script>