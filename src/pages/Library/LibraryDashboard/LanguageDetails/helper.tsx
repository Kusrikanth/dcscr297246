export const categoriesData = (response: object) => {
    return Object?.entries(response)?.map(([key, value]) => key);
}