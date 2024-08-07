<template>
    <div class="flex flex-col">
        <NuxtLink :to="`/game/${slugify(theme.name, theme.id)}`" v-for="theme in themes">{{ theme.name }}</NuxtLink>
    </div>
  </template>
  
  <script lang="ts" setup>
  const { data: themes } = await useFetch<Theme[]>("http://localhost:80/api/themes");

  const slugify = (text: string, id: number): string => {
    return text.toLowerCase().replace(/ /g, '-') + '-' + id;
  }
  </script>
  
  <style>
  
  </style>