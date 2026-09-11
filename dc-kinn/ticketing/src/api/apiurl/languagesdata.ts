
export const languagesUrl = {
  // get_inst_details: ({ instituteId }: any) => `${settingsUrl}/settings-service/api/v1/institutes/${instituteId}`,
  get_languages_list: ({ curriculumId, searchString }: any) =>
    `/academic-service/language/curriculum/${curriculumId}?searchString=${searchString}`,
  delete_language: ({ curriculumId }: any) =>
    `/academic-service/language/curriculums/${curriculumId}`,
};
