export interface IAccessManagementReducerState {
    roleTypesListResp: any;
    addRoleTypeResp: any;
    updateRoleTypeResp: any;
    deleteRoleTypeResp: any;

    featureListResp: any;
    mutateFeatureResp: any;
    deleteFeatureResp: any;

    permissionsListResp: any;
    mutatePermissionResp: any;
    deletePermissionResp: any;

    rootFeaturesResp: any;
    subFeatureOfRootFeatureResp: any;
    mutateFeaturePermissionResp: any;

    accessManagementErrorResp: any;
}