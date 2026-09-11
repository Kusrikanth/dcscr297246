
export const formatRequestTypeLabel = (requestType: string) => {
  return requestType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
