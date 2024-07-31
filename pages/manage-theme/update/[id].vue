<template>
  <div
    class="mx-auto my-12 min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0"
  >
    <h1 class="text-3xl mb-12">Modifier un thème: {{ themeData?.name }}</h1>
    <div class="flex flex-col gap-4" v-if="tempThemeData !== null">
      <div>
        <Label for="name">Nom du thème</Label>
        <Input type="text" id="name" v-model="tempThemeData.name" />
      </div>
      <!-- <div>
        <label for="description">Description</label>
        <textarea id="description" v-model="themeData?.description"></textarea>
      </div> -->
      <div>
        <Label for="maxRanking">Nombre de places</Label>
        <Input
          type="number"
          min="3"
          max="10"
          id="maxRanking"
          v-model="maxRanking"
        />
      </div>
      <div>
        <h2 class="font-medium">Liste des éléments</h2>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-6" v-for="item in tempThemeData.themeItems">
            <NuxtImg
              fit="fill"
              :src="item.image"
              width="100"
              height="100"
              alt=""
            ></NuxtImg>
            <Input class="w-96" type="text" v-model="item.name" />
            <Button variant="destructive" @click="deleteItem(item.id)">
              <LucideTrash2 class="w-4 h-4" />
            </Button>
          </div>
          <Button @click="createItem">
              <LucidePlus class="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Button as-child>
        <NuxtLink :to="`/manage-theme/update/${themeData?.id}`"
          >Enregistrer</NuxtLink
        >
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

// Récupération des données du thème
const { data: themeData } = await useFetch<Theme>(
  `http://localhost:80/api/themes/${route.params.id}`
);

// Récupération des données du thème en cours de modification (pour comparer) (JSON.parse puis JSON.stringify pour dupliquer les valeurs et non les références)
const tempThemeData = ref(JSON.parse(JSON.stringify(themeData.value)));

// Récupération des éléments modifiés
const modifiedItems = ref<ModifiedThemeData>({
  created: [],
  updated: [],
  deleted: [],
});

const maxRanking = ref<number | undefined>(themeData.value?.maxRanking);

const deleteItem = (id: number) => {
  modifiedItems.value.deleted.push(id);

  tempThemeData.value.themeItems = tempThemeData.value.themeItems.filter(
    (item: ThemeItem) => item.id !== id
  );
};

const createItem = () => {
  const tempId = Math.floor(Math.random() * 1000); // On génère un id aléatoire pour l'élément créé (on ne peut pas utiliser la longueur du tableau car on peut supprimer des éléments)

  tempThemeData.value.themeItems.push({
    id: tempId, 
    name: "",
    image: "",
  });

  modifiedItems.value.created.push({
    themeId: themeData.value?.id,
    tempId: tempId,
    name: "",
    image: "",
  });
};

onMounted(() => {
  // Si on modifie le thème,
  watch(
    () => tempThemeData.value,
    (newValue) => {
      // On récupère les éléments modifiés et on les ajoute a modifiedItems dans la catégorie correspondante avec ce format: {id:'id' name: 'nouveau nom', image: 'nouvelle image'} (si on a supprimé un élément, on ne le met pas dans updated mais dans deleted) (si on a ajouté un élément, on le met dans created avec ce format: {name: 'nom', image: 'image'})
      newValue.themeItems?.forEach((item: ThemeItem) => {
        const originalItem = themeData.value?.themeItems.find(
          (originalItem) => originalItem.id === item.id
        );
        // Si l'élément existait déjà et a été modifié
        if (originalItem) {
          // Si le nom ou l'image a été modifié
          if (
            originalItem.name !== item.name ||
            originalItem.image !== item.image
          ) {
            if (modifiedItems.value.updated.length === 0) {
              modifiedItems.value.updated.push({
                itemId: item.id,
                name: item.name,
                image: item.image,
              });
            } else {
              modifiedItems.value.updated.forEach((updatedItem) => {
                // Si l'élément a déjà été modifié, on met à jour le nom et l'image dans modifiedItems
                if (updatedItem.itemId === item.id) {
                  updatedItem.name = item.name;
                  updatedItem.image = item.image;
                }
                // Sinon, on ajoute l'élément dans modifiedItems
                else {
                  modifiedItems.value.updated.push({
                    itemId: item.id,
                    name: item.name,
                    image: item.image,
                  });
                  console.log("pipi");
                }
              });
            }
          } else {
            // Si l'élément n'a pas été modifié, on le supprime de modifiedItems
            modifiedItems.value.updated = modifiedItems.value.updated.filter(
              (updatedItem) => updatedItem.itemId !== item.id
            );
          }
        } else {
          // Si l'élément n'existait pas, on met à jour l'élément qui a été créé dans modifiedItems
          modifiedItems.value.created.forEach((createdItem) => {
            if (createdItem.tempId === item.id) {
                  createdItem.name = item.name;
                  createdItem.image = item.image;
                }
          });
        }
      });

      console.log(modifiedItems.value);
    },
    { deep: true }
  );
});
</script>

<style></style>
