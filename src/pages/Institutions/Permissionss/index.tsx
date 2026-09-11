import React, { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { InputCheckbox, SelectInput } from "../../../Components/Common";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";

//types
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getPermssionAct, mutateFeaturePermissionAct, rootFeaturesAct, subFeatureOfRootFeatureAct } from "../../../store/accessmanagement/accessmanagementaction";
import { ModuleTree } from "./TreeComponent";
import classnames from "classnames";
import "../../AccessAdmin/FeaturePermissionManagement/_featurepermission.scss";
import { generatePayload, recursiveUpdatePermission, updateAllPermission, updateFeatureAllPermissionRecursive, updateFeaturePermissionRecursive } from "./helper";
import { editLibraryUserTypeListAct } from "../../../store/library/settings/librarysettingsaction";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderFileStorageIcon } from "@hugeicons-pro/core-stroke-standard";
import { useLocation } from "react-router-dom";
import { getInstituteListAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import classNames from "classnames";
import Button from "../../../Components/Common/Button";

export interface IRoleTypes {
    id: string,
    code: string,
    description: string
}

const FeaturePermissionManagement: React.FC = () => {
    const { state } = useLocation();
    const { instituteId }: any = state || {};
    const [activeRootId, setActiveRootId] = useState("");
    const searchStringRef = useRef("");
    const dispatch = useAppDispatch();
    const { subFeatureOfRootFeatureResp, instituteListResp, mutateFeaturePermissionResp,
        permissionsListResp, accessManagementErrorResp, rootFeaturesResp, showApiLoader } =
        useAppSelector(({ accessManagement, instituteInfo, globalData }) => ({
            rootFeaturesResp: accessManagement.rootFeaturesResp,
            subFeatureOfRootFeatureResp: accessManagement.subFeatureOfRootFeatureResp,
            mutateFeaturePermissionResp: accessManagement.mutateFeaturePermissionResp,
            permissionsListResp: accessManagement.permissionsListResp,
            showApiLoader: globalData.showApiLoader,
            instituteListResp: instituteInfo.instituteListResp,
            accessManagementErrorResp: accessManagement.accessManagementErrorResp
        }), shallowEqual);

    const featurePermissionRespRef = useRef({
        prevRootFeaturesResp: rootFeaturesResp,
        prevMutateFeaturePermissionResp: mutateFeaturePermissionResp,
        prevAccessManagementErrorResp: accessManagementErrorResp
    });



    function getSubFeature(featureId: string) {
        dispatch(subFeatureOfRootFeatureAct(generateActionPayload("sub_features_inst", {
            featureId,
            instituteId
        })));
    }

    useEffect(() => {
        dispatch(getPermssionAct(generateActionPayload("get_permissions")));
        dispatch(rootFeaturesAct(generateActionPayload("root_features_inst", {
            instituteId
        })));
        dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, {
            instituteGroupId: "1"
        })));
    }, []);

    const [subFeaturesState, setSubFeaturesState] = useState<any>([]);

    useEffect(() => {
        if (Array.isArray(subFeatureOfRootFeatureResp) && subFeatureOfRootFeatureResp.length > 0) {
            const { subFeatures } = subFeatureOfRootFeatureResp[0];
            if (Array.isArray(subFeatures)) {
                if (subFeatures.length) {
                    const updatedFeatures = subFeatures.map((feature: any) => recursiveUpdatePermission(feature));
                    setSubFeaturesState(updatedFeatures);
                } else {
                    setSubFeaturesState([])
                }
            }
        }
    }, [permissionsListResp, subFeatureOfRootFeatureResp]);


    useEffect(() => {
        const { prevRootFeaturesResp,
            prevMutateFeaturePermissionResp, prevAccessManagementErrorResp } = featurePermissionRespRef.current;
        if (rootFeaturesResp && prevRootFeaturesResp !== rootFeaturesResp) {
            if (Array.isArray(rootFeaturesResp) && rootFeaturesResp.length > 0) {
                const { id } = rootFeaturesResp[0];
                setActiveRootId(id);
                getSubFeature(id);
            }
        } else if (mutateFeaturePermissionResp && prevMutateFeaturePermissionResp !== mutateFeaturePermissionResp) {
            toast.success("Feature permission updated successfully.");
        }
        else if (accessManagementErrorResp && accessManagementErrorResp !== prevAccessManagementErrorResp) {
            const { message }: any = accessManagementErrorResp;
            toast.error(message || "Something went wrong.");
        }
        featurePermissionRespRef.current.prevRootFeaturesResp = rootFeaturesResp;
        featurePermissionRespRef.current.prevMutateFeaturePermissionResp = mutateFeaturePermissionResp;
        featurePermissionRespRef.current.prevAccessManagementErrorResp = accessManagementErrorResp;
    }, [searchStringRef, rootFeaturesResp, mutateFeaturePermissionResp, accessManagementErrorResp]);

    function onClickRootModuleHandler(event: React.MouseEvent<HTMLLIElement>) {
        const moduleId = event.currentTarget.getAttribute('data-id');
        if (moduleId) {
            setActiveRootId(moduleId);
            getSubFeature(moduleId);
        }
    }

    const permissionUpdateHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>,
        featureIds: string) => {
        const { name, checked } = event.target;
        const updatedSubFeatures = [...updateFeaturePermissionRecursive(featureIds, subFeaturesState, name, checked)]
        setSubFeaturesState(updatedSubFeatures);
    }, [subFeaturesState]);

    const updateFeatureAllPermissionHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>, featureString: string) => {
        const { name, checked } = event.target,
            permissions = permissionsListResp?.map((item: any) => item.id);
        const updatedSubFeatures = [...updateFeatureAllPermissionRecursive(featureString, subFeaturesState, permissions, checked)];
        setSubFeaturesState(updatedSubFeatures);
    }, [subFeaturesState, permissionsListResp]);

    function updateAllFeaturePermissionHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = event.target;
        const updatedFeatureState: any[] = [];
        const permissions = permissionsListResp?.map((item: any) => item.id);
        for (let i = 0; i < subFeaturesState.length; i++) {
            updatedFeatureState.push(updateAllPermission(subFeaturesState[i], permissions, checked));
        }
        setSubFeaturesState(updatedFeatureState);
    }




    function savePermissionHandler() {
        const payload = generatePayload(subFeaturesState);
        dispatch(mutateFeaturePermissionAct(
            generateActionPayload("mutate_feature_permission_inst", {
                instituteId, rootFeatureId: activeRootId
            }, { fpIds: payload }, {
                version: import.meta.env.VITE_AUTH_VERSION
            })));
    }

    function cancelHandler() {
        if (activeRootId) {
            getSubFeature(activeRootId);
        }
    }

    const { isAllPermissionSelected, isAllPermissionDisabled } = useMemo(() => {
        if (!subFeaturesState.length) {
            return { isAllPermissionSelected: false, isAllPermissionDisabled: true }
        }
        return {
            isAllPermissionSelected: subFeaturesState.every((item: any) => !!item.enabledPermissionIds.length && item.permissionIds.length === item.enabledPermissionIds.length),
            isAllPermissionDisabled: !subFeaturesState.some((item: any) => !!item.enabledPermissionIds.length)
        };
    }, [subFeaturesState]);


    const permissionLength = Array.isArray(permissionsListResp) ? permissionsListResp.length : 0;
    return (
        <React.Fragment>
            <div className="page-content master-setup-wrapper">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Digital Caampus" />

                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                        <div className="tw-col-span-12 md:tw-col-span-4 xl:tw-col-span-3">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                <div className="tw-p-0">
                                    <div className="tw-px-4 tw-py-3 tw-flex tw-gap-2 tw-items-center tw-border-b">
                                        <HugeiconsIcon
                                            icon={FolderFileStorageIcon}
                                            size={18}
                                        />
                                        <h6 className="tw-mb-0 tw-text-base" style={{ fontSize: '16px' }}>Modules Access</h6>
                                    </div>
                                    <div className='tw-px-4 tw-pb-3 tw-pt-4 tw-border-b'>
                                        <SelectInput
                                            labelText="Institute"
                                            name={`institute`}
                                            value={instituteId?.toString()}
                                            formgroupClassName="tw-mb-0"
                                            onChange={() => { }}
                                            menuItems={instituteListResp?.data}
                                            valueKey="id"
                                            textKey="instituteName"
                                            floatingLabel
                                            isDisabled
                                        />
                                    </div>
                                    <ul className="left-menu-section">
                                        {Array.isArray(rootFeaturesResp) && rootFeaturesResp.map((item: any) => <li
                                            data-id={item.id}
                                            onClick={onClickRootModuleHandler}
                                            className={classnames(
                                                { active: item.id === activeRootId }
                                            )}
                                            key={item?.id}>
                                            {item.description}
                                        </li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-8 xl:tw-col-span-9">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                <div className="tw-border-b tw-px-4 tw-py-3">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Institute Feature Permission</h4>
                                </div>
                                <div className="tw-p-0">
                                    <div className="featurepermission-modules-container" style={{
                                        overflowX: 'auto',
                                        gridTemplateColumns: `45px minmax(280px, 1fr) repeat(${permissionLength}, 80px)`
                                    }}>
                                        <div className="custom-row header">
                                            <div className="custom-column tw-sticky tw-left-0 tw-z-[1]">
                                                <InputCheckbox
                                                    name={'allpermission'}
                                                    value={isAllPermissionSelected}
                                                    onChange={updateAllFeaturePermissionHandler}
                                                    isDisabled={isAllPermissionDisabled}
                                                    formgroupClassName={classNames(`tw-mb-0`, isAllPermissionDisabled ? 'tw-cursor-not-allowed' : '')}
                                                />
                                            </div>
                                            <div className="custom-column  tw-sticky tw-left-[46px]  tw-z-[1]">Module</div>
                                            {
                                                Array.isArray(permissionsListResp) && permissionsListResp.map(item => {
                                                    return (<div key={`permssion-${item.id}`} className="custom-column tw-text-center">{item?.description}</div>)
                                                })
                                            }
                                        </div>

                                        {subFeaturesState.map((item: any, index: number) => (
                                            <ModuleTree
                                                key={index}
                                                level={1}
                                                parentsInfo={[]}
                                                parentFeatureId={''}
                                                permissionUpdateHandler={permissionUpdateHandler}
                                                updateFeatureAllPermissionHandler={updateFeatureAllPermissionHandler}
                                                masterPermissions={permissionsListResp}
                                                {...item}
                                            />
                                        ))}
                                    </div>
                                    <div className="tw-flex tw-justify-end tw-gap-3 tw-px-5 tw-py-4">
                                        <Button
                                            variant="secondary"
                                            onClick={cancelHandler}
                                            disabled={showApiLoader}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            variant="primary"
                                            onClick={savePermissionHandler}
                                            disabled={showApiLoader}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment >
    )
}

export default FeaturePermissionManagement;