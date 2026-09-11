export const moduleSettings = {
    get_fee_categories: `/fee/api/fee/categoryNames`,
    add_fee_category: ({ instituteId }: any) => `/fee/api/fee/categoryNames?instituteId=${instituteId}`,
    update_fee_category: ({ feeCategoryId, instituteId }: any) => `/fee/api/fee/categoryNames/${feeCategoryId}?instituteId=${instituteId}`,
    del_fee_category: ({ feeCategoryId }: any) => `/fee/api/fee/categoryNames/${feeCategoryId}`,
    get_fee_types: `/fee/api/fee-service/fee/types/all`,
    get_fee_type_byid: ({ feeTypeId }: any) => `/fee/api/fee-service/fee/types/${feeTypeId}`,
    add_fee_type: `/fee/api/fee-service/fee/types`,
    update_fee_type: ({ feeTypeId }: any) => `/fee/api/fee-service/fee/types/${feeTypeId}`,
    delete_fee_type: ({ feeTypeId }: any) => `/fee/api/fee-service/fee/types/${feeTypeId}`,

    get_month_names_terms : `/academic/api/v1/settings/months`,
}