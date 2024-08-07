<template>
  <div>
    <div v-if="themeData">
      <h1 class="text-3xl mb-12">Modifier un thème: {{ themeData.name }}</h1>
      <div class="flex flex-col gap-4" v-if="tempThemeData">
        <div>
          <Label for="name">Nom du thème</Label>
          <Input type="text" id="name" v-model="tempThemeData.name"/>
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
              v-model="tempThemeData.maxRanking"
          />
        </div>
        <div>
          <h2 class="font-medium">Liste des éléments</h2>
          <div class="flex flex-col gap-4">
            <div
                class="flex items-center gap-6"
                v-for="item in tempThemeData.themeItems"
            >
              <div
                  v-if="item.image !== ''"
              >
                <label :for="`fileInput-${item.id}`" class="relative">
                  <img
                      :src="item.image"
                      class="w-[100px] h-[100px] object-cover rounded-md cursor-pointer"
                      alt=""
                  />
                  <div
                      class="absolute top-0 left-0 w-[100px] h-[100px] bg-black bg-opacity-50 opacity-0 rounded-md flex items-center justify-center cursor-pointer hover:opacity-100"
                  >
                    <LucidePencil class="w-8 h-8 text-white"/>
                  </div>
                </label>
              </div>
              <div
                  v-else
              >
                <label :for="`fileInput-${item.id}`" class="relative">
                  <div
                      class="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
                  >
                    <LucidePlus class="w-8 h-8 text-gray-400"/>
                  </div>
                </label>
              </div>
              <input
                  :id="`fileInput-${item.id}`"
                  type="file"
                  class="hidden"
                  @change="uploadImage(item.id, $event)"
                  accept="image/jpeg, image/jpg, image/png, image/gif, image/webp"
              />
              <Input class="w-96" type="text" v-model="item.name"/>
              <Button variant="destructive" @click="deleteItem(item.id)">
                <LucideTrash2 class="w-4 h-4"/>
              </Button>
            </div>
            <Button @click="createItem">
              <LucidePlus class="w-4 h-4"/>
            </Button>
          </div>
        </div>
        <Button @click="saveChanges">
          >Enregistrer
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const route = useRoute();

// Récupération des données du thème
const themeData: Theme = await fetchThemeData(parseInt(route.params.id as string));

// Récupération des données du thème en cours de modification (pour comparer) (JSON.parse puis JSON.stringify pour dupliquer les valeurs et non les références)
const tempThemeData = ref(JSON.parse(JSON.stringify(themeData)));

// Récupération des éléments modifiés
const modifiedItems = ref<ModifiedThemeData>({
  created: [],
  updated: [],
  deleted: [],
});

const maxRanking = ref<number | undefined>(themeData.maxRanking);

const deleteItem = (id: number) => {
  if (themeData) {
    // Si l'élément a été créé et n'a pas été enregistré, on le supprime de modifiedItems.created
    modifiedItems.value.created = modifiedItems.value.created.filter(
        (item) => item.tempId !== id
    );
    // Si l'élément a été modifié et n'a pas été enregistré, on le supprime de modifiedItems.updated
    modifiedItems.value.updated = modifiedItems.value.updated.filter(
        (item) => item.itemId !== id
    );
  }
  // Si l'élément existait déjà, on l'ajoute à modifiedItems.deleted sinon on ne l'ajoute pas
  if (themeData.themeItems.find((item) => item.id === id)) {
    modifiedItems.value.deleted.push(id);
  }

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
    themeId: tempThemeData.value.id,
    tempId: tempId,
    name: "",
    image: null,
  });
};

const uploadImage = (id: number, e: any) => {
  const idToUpload = tempThemeData.value.themeItems.findIndex((item: ThemeItem) => item.id === id);

  if (idToUpload > -1) {
    const createdItem = modifiedItems.value.created.find((createdItem) => createdItem.tempId === id);
    tempThemeData.value.themeItems[idToUpload].image = URL.createObjectURL(e.target.files[0]);

    if (createdItem) {
      createdItem.image = e.target.files[0];
    } else {
      const updatedItem = modifiedItems.value.updated.find((updatedItem) => updatedItem.itemId === id);
      if (updatedItem) {
        updatedItem.image = e.target.files[0];
      } else {
        modifiedItems.value.updated.push({
          itemId: tempThemeData.value.themeItems[idToUpload].id,
          name: tempThemeData.value.themeItems[idToUpload].name,
          image: e.target.files[0],
        });
      }
    }
  }

  // tempThemeData.value.themeItems.forEach((item: ThemeItem) => {
  //   if (item.id === id) {
  //     item.image = URL.createObjectURL(e.target.files[0]);
  //
  //     // Si on upload une image pour un objet nouvellement créé, on met l'image en File dans modifiedItems.created
  //     const createdItem = modifiedItems.value.created.find(
  //       (createdItem) => createdItem.tempId === id
  //     );
  //     if (createdItem) {
  //       createdItem.image = e.target.files[0];
  //       return;
  //     }
  //
  //     if (imagesToUpload.value.length === 0) {
  //       imagesToUpload.value.push({
  //         itemId: id,
  //         image: e.target.files[0],
  //       });
  //     } else {
  //       // Si l'image a déjà été uploadée, on la met à jour
  //       const i = imagesToUpload.value.findIndex(
  //         (image) => image.itemId === id
  //       );
  //       if (i > -1) {
  //         imagesToUpload.value[i].image = e.target.files[0];
  //       } else {
  //         imagesToUpload.value.push({
  //           itemId: id,
  //           image: e.target.files[0],
  //         });
  //       }
  //     }
  //   }

  // console.log(id);
  console.log(tempThemeData.value);
};

const postCreated = async (body: FormData) => {
  const create = await $fetch(`${config.public.rankblindApi}/theme-items`, {
    method: "POST",
    body: body,
  });
};

const postUpdated = async (id: number, body: FormData) => {
  const update = await $fetch(`${config.public.rankblindApi}/theme-items/${id}`, {
    method: "PUT",
    body: body,
  });
};

const postDeleted = async (id: number) => {
  const deleteItem = await $fetch(`${config.public.rankblindApi}/theme-items/${id}`, {
    method: "DELETE",
  });
};

// Enregistrement des modifications
const saveChanges = async () => {
  if (tempThemeData.value.name !== themeData.name || tempThemeData.value.maxRanking !== themeData.maxRanking) {
    // Si le nom du thème a été modifié, on le met à jour
    const update = await $fetch(`${config.public.rankblindApi}/themes/${themeData.id}`, {
      method: "PUT",
      body: {
        name: tempThemeData.value.name,
        max_ranking: tempThemeData.value.maxRanking,
      },
    });
  }

  if (modifiedItems.value.created.length > 0) {
    // On crée des formData pour chaque élément créé

    modifiedItems.value.created.forEach((item) => {
      const formData = new FormData();
      formData.append("themeId", item.themeId.toString());
      formData.append("name", item.name);
      formData.append("image", item.image as File);

      postCreated(formData);
    });
  }

  if (modifiedItems.value.updated.length > 0) {
    // On crée des formData pour chaque élément modifié
    modifiedItems.value.updated.forEach((item) => {
      const formData = new FormData();
      if (item.name) {
        formData.append("name", item.name);
      } else {
        formData.append("name", "");
      }
      formData.append("image", item.image as File);

      postUpdated(item.itemId, formData);
    });
  }

  if (modifiedItems.value.deleted.length > 0) {
    // On supprime les éléments supprimés
    modifiedItems.value.deleted.forEach((id) => {
      postDeleted(id);
    });
  }
};

onMounted(() => {
  // Si on modifie le thème,
  watch(
      () => tempThemeData.value,
      (newValue) => {
        // On compare les valeurs du thème modifié avec celles du thème initial pour avoir si un nom a été modifié
        if (themeData) {
          // Si on modifie un item du thème qui existait déjà (et qui n'a pas été supprimé), on l'ajoute à modifiedItems.updated sinon, si on modifie un item qui a été créé, on l'ajoute à modifiedItems.created
          newValue.themeItems.forEach((item: ThemeItem) => {
            const initialItem = themeData.themeItems.find(
                (initialItem) => initialItem.id === item.id
            );
            if (initialItem) {
              if (
                  initialItem.name !== item.name ||
                  initialItem.image !== item.image
              ) {
                const updatedItem = modifiedItems.value.updated.find(
                    (updatedItem) => updatedItem.itemId === item.id
                );
                if (updatedItem) {
                  updatedItem.name = item.name;
                } else {
                  modifiedItems.value.updated.push({
                    itemId: item.id,
                    name: item.name,
                    image: null,
                  });
                }
              }
            } else {
              const createdItem = modifiedItems.value.created.find(
                  (createdItem) => createdItem.tempId === item.id
              );
              if (createdItem) {
                createdItem.name = item.name as string;
              }
            }
          });
        }
        console.log(modifiedItems.value);
      },
      {deep: true}
  );
});
</script>

<style></style>