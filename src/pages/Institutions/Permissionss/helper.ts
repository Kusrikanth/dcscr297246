import { editLibraryUserTypeListAct } from "../../../store/library/settings/librarysettingsaction";

function updateSubfeaturePermissionRecursive(feature: any, permission: string, isChecked: boolean): any {
    return {
        ...feature,
        permissionIds: isChecked
            ? feature.permissionIds.includes(permission)
                ? feature.permissionIds
                : [...feature.permissionIds, permission]
            : feature.permissionIds.filter((p: any) => p !== permission),
        subFeatures: feature.subFeatures
            ? feature.subFeatures.map((sub: any) => updateSubfeaturePermissionRecursive(sub, permission, isChecked))
            : [],
    };
}

export function updateFeaturePermissionRecursive(featurePath: any, featureList: any[], permission: string, isChecked: boolean) {
    const featureIds = featurePath.split('|'); // Renamed 'idParts' for clarity
    if (!featurePath) {
        return featureList.map(feature => updateSubfeaturePermissionRecursive(feature, permission, isChecked));
    }

    for (let i = 0; i < featureList.length; i++) {
        if (featureList[i].id === featureIds[0]) {
            const updatedSubFeatures = updateFeaturePermissionRecursive(
                featurePath.includes('|') ? featurePath.slice(featurePath.indexOf('|') + 1) : '',
                featureList[i].subFeatures,
                permission,
                isChecked
            );
            const allSubFeaturesHavePermission = updatedSubFeatures.length ? updatedSubFeatures.every((subFeature: any) =>
                subFeature.permissionIds.includes(permission)
            ) : isChecked;

            featureList[i].subFeatures = updatedSubFeatures;
            featureList[i].permissionIds = allSubFeaturesHavePermission ?
                (featureList[i].permissionIds.includes(permission)
                    ? featureList[i].permissionIds
                    : [...featureList[i].permissionIds, permission]) : featureList[i].permissionIds.filter((p: any) => p !== permission);
        }
    }

    return featureList;
}


function updateSubfeatureAllPermissionRecursive(feature: any, permission: string[], isChecked: boolean): any {
    return {
        ...feature,
        permissionIds: isChecked ? feature.enabledPermissionIds : [],
        subFeatures: feature.subFeatures
            ? feature.subFeatures.map((sub: any) => updateSubfeatureAllPermissionRecursive(sub, permission, isChecked))
            : [],
    };
}


export function updateFeatureAllPermissionRecursive(featurePath: any, featureList: any[],
    permission: string[], isChecked: boolean) {
    const featureIds = featurePath.split('|'); // Renamed 'idParts' for clarity
    if (!featurePath) {
        return featureList.map(feature => updateSubfeatureAllPermissionRecursive(feature, permission, isChecked));
    }
    for (let i = 0; i < featureList.length; i++) {
        if (featureList[i].id === featureIds[0]) {
            const updatedSubFeatures = updateFeatureAllPermissionRecursive(
                featurePath.includes('|') ? featurePath.slice(featurePath.indexOf('|') + 1) : '',
                featureList[i].subFeatures,
                permission,
                isChecked
            );
            const allSubFeaturesHavePermission = updatedSubFeatures.length ? updatedSubFeatures.every((subFeature: any) =>
                subFeature.permissionIds.length ===
                featureList[i].enabledPermissionIds.length
            ) : isChecked;
            featureList[i].subFeatures = updatedSubFeatures;
            featureList[i].permissionIds = allSubFeaturesHavePermission ? featureList[i].enabledPermissionIds : []
        }
    }
    return featureList;
}


export function updateAllPermission(feature: any, permission: string[], isChecked: boolean): any {
    return {
        ...feature,
        permissionIds: isChecked
            ? feature?.enabledPermissionIds : [],
        subFeatures: feature.subFeatures
            ? feature.subFeatures.map((sub: any) => updateAllPermission(sub, permission, isChecked))
            : [],
    };
}


export function generatePayload(features: any[]) {
    let payload: any = [];
    function recursivePayload(feature: any) {
        const { permissions, initialPermissionIds, permissionIds } = feature;
        const setSelectedPermissionIds = new Set(initialPermissionIds);
        const setPermissionIds = new Set(permissionIds);

        // Check if both sets have the same values
        // let areSame: boolean = true;
        // if (setSelectedPermissionIds.size !== setPermissionIds.size) {
        //     areSame = false
        // } else {
        //     for (const value of setSelectedPermissionIds) {
        //         if (!setPermissionIds.has(value)) {
        //             areSame = false;
        //             break;
        //         }
        //     }
        // }

        // if (!areSame) {
        permissions.forEach((item: any) => {
            if (permissionIds.includes(item.id)) {
                payload.push(item?.fp?.fpID);
            }
        });
        // }
        if (feature.subFeatures.length > 0) {
            feature.subFeatures.forEach((subFeature: any) => recursivePayload(subFeature));
        }
    }

    features.forEach(feature => recursivePayload(feature));
    return payload;
}

export function recursiveUpdatePermission(feature: any) {
    return ({
        ...feature,
        enabledPermissionIds: (Array.isArray(feature.permissions) && feature.permissions.length) ?
            feature.permissions.map((item: any) => item.id) : [],
        permissionIds: (Array.isArray(feature.permissions) && feature.permissions.length) ?
            feature.permissions.filter((i: any) => i.isSelected).map((item: any) => item.id) : [],
        initialPermissionIds: (Array.isArray(feature.permissions) && feature.permissions.length) ?
            feature.permissions.filter((i: any) => i.isSelected).map((item: any) => item.id) : [],
        subFeatures: (Array.isArray(feature.subFeatures) && feature.subFeatures) ?
            feature.subFeatures.map((sub: any) => recursiveUpdatePermission(sub)) : []
    })
}

