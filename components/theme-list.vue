<template>
  <div class="grid grid-cols-7 gap-6">
        <NuxtLink class="group" :to="`/manage-theme/update/${theme.id}`" v-for="theme in themes" v-if="editMode">
            <div class="flex flex-col">
              <NuxtImg :src="theme.image" :alt="theme.name" class="w-40 h-40 object-cover rounded-lg mb-2 ease-in-out duration-100 outline-4 outline-offset-2 outline-primary group-hover:outline" />
                <h1 class="w-40 h-20">{{ theme.name }}</h1>
            </div>
        </NuxtLink>

        <NuxtLink class="group" :to="`/game/${slugify(theme.name, theme.id)}`" v-for="theme in themes" v-else>
            <div class="flex flex-col">
              <NuxtImg :src="theme.image" :alt="theme.name" class="w-40 h-40 object-cover rounded-lg mb-2 ease-in-out duration-100 outline-4 outline-offset-2 outline-primary group-hover:outline" />
                <h1 class="w-40 h-20">{{ theme.name }}</h1>
            </div>
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>
// Récupération des thèmes
const { themes, editMode } = defineProps<{
  themes: Theme[],
  editMode: boolean
}>();
</script>

<style>

</style>