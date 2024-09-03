export const fetchAllThemes = async (): Promise<Theme[]> => {
    const config = useRuntimeConfig();
    return await $fetch(`${config.public.rankblindApi}/themes`);
}