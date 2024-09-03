<template>
  <div>
    <div class="mb-16">
      <h1 class="text-3xl mb-2">{{ themeData.name }} - Classement à l'aveugle</h1>
      <p class="text-lg">De: Ted</p>
      <p class="text-lg">{{ themeData.description }}</p>
    </div>
    <BlindRanking :theme-data="themeData"/>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();

const slug: string = route.params.slug as string;

// Dans le slug, on a le nom du thème (ex: "skins-valorant-caca-rrr") (les espaces sont remplacés par des tirets) et l'id du thème (ex: "1") séparés par un tiret (ex: "skins-valorant-caca-rrr-1")
const themeName = slug.split('-').slice(0, -1).join('-');
const themeId = parseInt(slug.split('-').slice(-1)[0]);

// On récupère le thème correspondant
const themeData: Theme = await fetchThemeData(themeId);

// On vérifie si le nom du thème correspond à celui de la base de données en convertissant les espaces en tirets et en supprimant les majuscules
if (themeData.name.toLowerCase().replace(/ /g, '-') !== themeName) {
  // Si le nom du thème ne correspond pas à celui de la base de données, on redirige l'utilisateur vers la page d'accueil
  router.push('/');
}


</script>

<style>

</style>