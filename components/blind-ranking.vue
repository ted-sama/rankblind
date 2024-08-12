<template>
  <div>
      <div class="grid grid-cols-2">
        <div class="flex flex-col gap-6 font-nunito">
          <div class="flex gap-6" v-for="(position, i) in sessionData">
            <div
                class="flex w-28 h-28 justify-center items-center rounded-lg ease-in-out duration-100"
                :class="positionClasses(i)"
                @click="position.value === null ? rank(i, themeData.themeItems[0]) : null"
            >
          <span class="text-3xl font-semibold">
            {{ position.rank }}
          </span>
            </div>
            <div class="flex justify-center items-center gap-6" v-if="position.value !== null">
              <NuxtImg :src="position.value.image" alt="Item Image" class="w-28 h-28 object-cover rounded-md" v-if="position.value.image"></NuxtImg>
              <h2 class="text-lg">
                {{ position.value.name }}
              </h2>
            </div>
          </div>
        </div>
        <div v-if="themeData.themeItems.length > 0">
          <div v-if="sessionData.length !== 0" class="flex flex-col items-center sticky top-10">
            <NuxtImg :src="themeData.themeItems[0].image" alt="Item Image" class="w-64 h-64 mb-4 object-cover rounded-md" v-if="themeData.themeItems[0].image"></NuxtImg>
            <h2 class="text-3xl text-center">{{ themeData.themeItems[0].name }}</h2>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
// Récupération des données du thème
const { themeData } = defineProps<{
  themeData: Theme;
}>();

// Les données pour le classement sont stockées ici
const sessionData = ref<SessionData[]>([]);

const iterations = ref<number>(0);

const isShuffling = ref<boolean>(false);
const shuffleInterval = ref();

const positionClasses = (index: number) => {
  if (sessionData.value[index].value === null) {
    return 'bg-gray-950/20 cursor-pointer outline-4 outline-offset-2 outline-primary hover:outline';
  }
  return 'bg-primary';
}

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
  themeData.themeItems.splice(0, 1);
  shuffleArray(themeData.themeItems);
  console.log(sessionData.value);
  // startShuffle(themeData.themeItems);
}

// Fonction pour initialiser les données au début du composant
const initializeData = () => {
  for (let i = 0; i < themeData.maxRanking; i++) {
    sessionData.value.push({
      rank: i+1,
      value: null,
    });
  }

  // On mélange les éléments du thème
  shuffleArray(themeData.themeItems);
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
  watch(sessionData, (newSessionData) => {
    // Si tous les éléments sont classés, on envoie les données
    if (newSessionData.every((position) => position.value !== null)) {
      console.log('All items ranked');
      console.log(newSessionData);
    }
  }, { deep: true });
  // startShuffle(themeData.themeItems);
});
</script>

<style></style>
