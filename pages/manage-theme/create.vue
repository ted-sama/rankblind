<template>
  <div>
    <h1 class="text-3xl mb-12">Créer un thème</h1>
    <div class="flex flex-col gap-4" v-if="tempThemeData">
    <div class="flex gap-6">
      <div>
        <div v-if="tempThemeData.imageUrl !== '' && tempThemeData.imageUrl !== null">
          <label for="fileInput-theme" class="relative">
            <img
              :src="tempThemeData.imageUrl"
              class="w-[200px] h-[200px] object-cover rounded-md cursor-pointer"
              alt=""
            />
            <div
              class="absolute top-0 left-0 w-[200px] h-[200px] bg-black bg-opacity-50 opacity-0 rounded-md flex items-center justify-center cursor-pointer hover:opacity-100"
            >
              <LucidePencil class="w-8 h-8 text-white" />
            </div>
          </label>
        </div>
        <div v-else>
          <label for="fileInput-theme" class="relative">
            <div
              class="w-[200px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
            >
              <LucidePlus class="w-8 h-8 text-gray-400" />
            </div>
          </label>
        </div>
        <input
          id="fileInput-theme"
          type="file"
          class="hidden"
          @change="uploadThemeImage"
          accept="image/jpeg, image/jpg, image/png, image/webp"
        />
      </div>
      <div class="flex flex-col justify-center">
        <h2 class="text-3xl mb-2">{{ tempThemeData.name }}</h2>
        <p>De: Ted</p>
        <p>{{ tempThemeData.description }}</p>
      </div>
    </div>
    <div>
      <Label for="name">Nom du thème</Label>
      <Input
        class="w-96"
        type="text"
        id="name"
        v-model="tempThemeData.name"
      />
    </div>
    <div>
      <Label for="description">Description</Label>
      <Textarea
        class="w-96"
        placeholder="Entrez une description"
        id="description"
        v-model="tempThemeData.description"
      />
    </div>
    <div>
      <Label for="maxRanking">Nombre de places</Label>
      <Input
        class="w-12"
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
          :key="item.id"
        >
          <div v-if="item.imageUrl !== ''">
            <label :for="`fileInput-${item.id}`" class="relative">
              <img
                :src="item.imageUrl!"
                class="w-[100px] h-[100px] object-cover rounded-md cursor-pointer"
                alt=""
              />
              <div
                class="absolute top-0 left-0 w-[100px] h-[100px] bg-black bg-opacity-50 opacity-0 rounded-md flex items-center justify-center cursor-pointer hover:opacity-100"
              >
                <LucidePencil class="w-8 h-8 text-white" />
              </div>
            </label>
          </div>
          <div v-else>
            <label :for="`fileInput-${item.id}`" class="relative">
              <div
                class="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
              >
                <LucidePlus class="w-8 h-8 text-gray-400" />
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
          <Input class="w-96" type="text" v-model="item.name" />
          <Button variant="destructive" @click="deleteItem(item.id)">
            <LucideTrash2 class="w-4 h-4" />
          </Button>
        </div>
        <div class="w-[100px]">
          <Button class="w-full" @click="createItem">
            <LucidePlus class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <Button class="text-end w-96 mt-10" @click="saveChanges">
        Enregistrer
      </Button>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const config = useRuntimeConfig();

const tempThemeData = ref<NewTheme>({
  id: 0,
  name: '',
  description: '',
  imageFile: null,
  imageUrl: '',
  maxRanking: 3,
  themeItems: [],
});

// Récupération de l'image du thème à uploader
const themeImageToUpload = ref<File>();

const createItem = () => {
    const newItem = {
      id: Date.now(),
      themeId: tempThemeData.value.id,
      name: '',
      imageFile: null,
      imageUrl: ''
    };
    tempThemeData.value.themeItems.push(newItem);
};

const deleteItem = (id: number) => {
    const index = tempThemeData.value.themeItems.findIndex((item) => item.id === id);
    tempThemeData.value.themeItems.splice(index, 1);
};

const uploadThemeImage = (e: any) => {
  tempThemeData.value.imageUrl = URL.createObjectURL(e.target.files[0]);
  themeImageToUpload.value = e.target.files[0];
};

const uploadImage = (id: number, e: any) => {
  const index = tempThemeData.value.themeItems.findIndex((item) => item.id === id);
  tempThemeData.value.themeItems[index].imageUrl = URL.createObjectURL(e.target.files[0]);
  tempThemeData.value.themeItems[index].imageFile = e.target.files[0];
};

const createTheme = async () => {
  const formData = new FormData();
  formData.append('name', tempThemeData.value.name);
  if (tempThemeData.value.description) {
    formData.append('description', tempThemeData.value.description);
  }
  else {
    formData.append('description', '');
  }
  formData.append('max_ranking', tempThemeData.value.maxRanking.toString());
  formData.append('image', themeImageToUpload.value!);

  // On crée le theme et on récupère l'id de la réponse pour les items
  return await $fetch(`${config.public.rankblindApi}/themes`, {
    method: 'POST',
    body: formData,
  })
}

const saveChanges = async () => {
  
   // On crée le thème et on récupère l'id grâce à la fonction createTheme
  const newThemeId: any = await createTheme();

  // On crée les items du thème 5, (async ?)
  tempThemeData.value.themeItems.forEach((item) => {
    const itemFormData = new FormData();
    itemFormData.append('theme_id', newThemeId[0].id.toString());
    if (item.name) {
      itemFormData.append('name', item.name);
    }
    else {
      itemFormData.append('name', '');
    }

    if (item.imageFile) {
      itemFormData.append('image', item.imageFile);
    }

    $fetch(`${config.public.rankblindApi}/theme-items`, {
      method: 'POST',
      body: itemFormData,
    });
  });

  // On redirige vers la page de gestion des thèmes
  router.push({ path: '/manage-theme' });
};
</script>

<style>

</style>