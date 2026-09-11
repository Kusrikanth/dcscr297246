export const admissionData = (data: object) => {
    return Object?.entries(data)?.map(([key, value]) => value);
  };  

  export const categoriesData = (response: object) => {
    return Object?.entries(response)?.map(([key, value]) => key);
  }
