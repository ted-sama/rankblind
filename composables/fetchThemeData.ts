export const fetchThemeData = async (id: number): Promise<Theme> => {
    const config = useRuntimeConfig();
    return await $fetch(`${config.public.rankblindApi}/themes/${id}`);
}