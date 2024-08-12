<template>
    <div>
      <ThemeList :themes="themes" v-if="themes"/>
      <NuxtLink to="/manage-theme">Gestion des thèmes</NuxtLink>
    </div>
  </template>
  
  <script lang="ts" setup>
  const { data: themes } = await useFetch<Theme[]>("http://localhost:80/api/themes");

  </script>
  
  <style>
  
  </style>