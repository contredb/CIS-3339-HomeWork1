<template>
  <div id="app">
    <nav class="app-nav" aria-label="Main navigation">
      <router-link to="/students">Students</router-link>
      <router-link to="/courses">Courses</router-link>
      <router-link to="/enrollments">Enrollments</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
// App layout component
</script>