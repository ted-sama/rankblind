const { rankblindApi } = useRuntimeConfig();

export const fetchThemeData = async (id: number): Promise<Theme> => {
    return await $fetch(`${rankblindApi}/api/theme/${id}`);
}