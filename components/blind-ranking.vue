<template>
  <div class="grid grid-cols-2">
    <div class="flex flex-col gap-6 font-nunito">
      <div class="flex gap-6" v-for="(position, i) in sessionData">
        <div
          class="flex w-28 h-28 justify-center items-center bg-red-500 rounded-md cursor-pointer"
          @click="position.value === null ? rank(i, themeData?.themeItems[current]) : null"
        >
          <span class="text-3xl font-semibold">
            {{ position.rank }}
          </span>
        </div>
        <div class="flex justify-center items-center">
          <h2 v-if="position.value !== null">
            {{ position.value.name }}
          </h2>
        </div> 
      </div>
    </div>
    <div>
      <div v-if="sessionData.length !== 0">
        <NuxtImg :src="themeData?.themeItems[current].image" alt=""></NuxtImg>
        <h2>{{ themeData?.themeItems[current].name }}</h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const items = ref<string[]>(["item1", "item2", "item3", "item4", "item5"]);

const { data: themeData } = await useFetch<Theme>("http://localhost:80/api/themes/1");

// Les données pour le classement sont stockées ici
const sessionData = ref<SessionData[]>([]);

const current = ref<number>(0);

const iterations = ref<number>(0);

const isShuffling = ref<boolean>(false);
const shuffleInterval = ref();

// Fonction pour classer les éléments
const rank = (index: number, value: any) => {
  // Si la valeur est déjà classée, on ne fait rien
  if (sessionData.value[index].value !== null) {
    return;
  }

  // Si le mélange est en cours, on ne fait rien
  if (isShuffling.value) {
    return;
  }

  sessionData.value[index].value = value;
  themeData.value?.themeItems.splice(current.value, 1);
  startShuffle(themeData.value?.themeItems);
}

// Fonction pour initialiser les données au début du composant
const initializeData = () => {
  for (let i = 0; i < items.value.length; i++) {
    sessionData.value.push({
      rank: i+1,
      value: null,
    });
  }
}

const startShuffle = (array: any) => {
  if (isShuffling.value) {
    return;
  }

  isShuffling.value = true;
  shuffleInterval.value = setInterval(() => {
    shuffleArray(array);
    iterations.value++;
    console.log(iterations.value);
    if (iterations.value === 10) {
      iterations.value = 0;
      isShuffling.value = false;
      clearInterval(shuffleInterval.value);
    }
  }, 100); // Vitesse du mélange
}

const shuffleArray = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

onMounted(() => {
  initializeData();
  startShuffle(themeData.value?.themeItems);
});
</script>

<style></style>
