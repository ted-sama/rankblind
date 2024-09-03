<template>
    <div>
      <ThemeList :themes="themes" :edit-mode="false" v-if="themes"/>
      <NuxtLink to="/manage-theme">Gérer les thèmes</NuxtLink>
    </div>
  </template>
  
<script lang="ts" setup>
const themes: Theme[] = await fetchAllThemes();
</script>
  
<style>
  
</style>