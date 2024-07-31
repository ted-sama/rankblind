<template>
  <div class="mx-auto my-12 min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
    <h1 class="text-3xl mb-12">Gestion des thèmes</h1>
    <Button as-child>
      <NuxtLink to="/manage-theme/create">Créer un thème</NuxtLink>
    </Button>
    <div class="flex flex-col mt-5 gap-4">
      <div v-for="theme in themes">
        <h2>{{ theme.name }}</h2>
        <div class="flex gap-2">
          <Button as-child>
            <NuxtLink :to="`/manage-theme/update/${theme.id}`"><LucidePencil class="w-4 h-4" /></NuxtLink>
          </Button>
          <Button variant="destructive">
            <LucideX class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: themes } = await useFetch<Theme[]>("http://localhost:80/api/themes");
</script>

<style>

</style>