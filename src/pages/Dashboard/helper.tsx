export const calculateTotal = (data: any) => {
    return data?.value?.reduce((total: number, item: any) => total + item.value, 0);
  };

export const percentageCount = (prev: number, current: number) => {
    if (prev === 0 || current === 0) {
        return 0;
    }
    return ((current - prev) / prev) * 100;
}
