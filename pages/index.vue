<template>
    <div>
      <client-only>
        <ThemeList :themes="themes" :edit-mode="false" v-show="themes"/>
      </client-only>
      <NuxtLink to="/manage-theme">Gérer les thèmes</NuxtLink>
    </div>
  </template>
  
<script lang="ts" setup>
const themes: Theme[] = await fetchAllThemes();
</script>
  
<style>
  
</style>