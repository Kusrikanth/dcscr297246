export const accessManagementUrl = {
    role_types: `/auth-service/v2/roles/type`,
    mutate_role_type: `/auth-service/v2/roles/type`,
    delete_role_type: ``,

    get_features: `/auth-service/v2/feature-permission/features`,
    mutate_feature: `/auth-service/v2/feature-permission/feature`,

    get_permissions: `/auth-service/v2/feature-permission/permissions`,
    mutate_permission: `/auth-service/v2/feature-permission/permissions`,

    root_features: `/auth-service/v2/feature-permission/features?isOnlyRootFeatureNeeded=true`,
    sub_features: ({ featureId }: any) => `/auth-service/v2/feature-permission/features?rootFeatureId=${featureId}`,
};