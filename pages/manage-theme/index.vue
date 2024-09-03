<template>
  <div>
    <h1 class="text-3xl mb-12">Gestion des thèmes</h1>
    <Button as-child>
      <NuxtLink to="/manage-theme/create">Créer un thème</NuxtLink>
    </Button>
    <div class="flex flex-col mt-5 gap-4">
      <ThemeList :themes="themes" editMode/>
    </div>
  </div>
</template>

<script lang="ts" setup>
const themes: Theme[] = await fetchAllThemes();
</script>

<style>

</style>