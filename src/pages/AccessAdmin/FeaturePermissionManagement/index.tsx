import React, { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { ConfirmationModal, InputCheckbox, ModalContainerUpdated, Switch, TextIconInput } from "../../../Components/Common";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component

//Modal Component
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { deleteInstRoleTypeV2Act, getInstRoleTypeV2Act } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

//types
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { useModal } from "../../../hooks/modalhook";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getPermssionAct, getRoleTypesAct, rootFeaturesAct, subFeatureOfRootFeatureAct } from "../../../store/accessmanagement/accessmanagementaction";
import { searhWithTextInList } from "../../../utility/commonutility";
import { ModuleTree } from "./TreeComponent";
import classnames from "classnames";
import "../FeatureManagement/_treecomponent.scss";

export interface IRoleTypes {
    id: string,
    code: string,
    description: string
}

const FeaturePermissionManagement: React.FC = () => {
    const [activeRootId, setActiveRootId] = useState("");
    const [rootFeatures, setRootFeatures] = useState([]);
    const searchStringRef = useRef("");
    const dispatch = useAppDispatch();
    const { subFeatureOfRootFeatureResp, permissionsListResp, accessManagementErrorResp, rootFeaturesResp, showApiLoader } =
        useAppSelector(({ accessManagement, globalData }) => ({
            rootFeaturesResp: accessManagement.rootFeaturesResp,
            subFeatureOfRootFeatureResp: accessManagement.subFeatureOfRootFeatureResp,
            permissionsListResp: accessManagement.permissionsListResp,
            showApiLoader: globalData.showApiLoader,
            accessManagementErrorResp: accessManagement.accessManagementErrorResp
        }), shallowEqual);

    const featurePermissionRespRef = useRef({
        prevRootFeaturesResp: rootFeaturesResp,
        prevAccessManagementErrorResp: accessManagementErrorResp
    });

    function getSubFeature(featureId: string) {
        dispatch(subFeatureOfRootFeatureAct(generateActionPayload("sub_features", { featureId })));
    }

    useEffect(() => {
        dispatch(getPermssionAct(generateActionPayload("get_permissions")));
        dispatch(rootFeaturesAct(generateActionPayload("root_features")));
    }, []);

    const [subFeaturesState, setSubFeaturesState] = useState<any>([]);
    useEffect(() => {
        if (Array.isArray(subFeatureOfRootFeatureResp) && subFeatureOfRootFeatureResp.length > 0) {
            const { subFeatures } = subFeatureOfRootFeatureResp[0];
            console.log({ subFeatures });
            if (Array.isArray(subFeatures) && subFeatures.length > 0) {
                setSubFeaturesState(subFeatures);
            }
        }
    }, [permissionsListResp, subFeatureOfRootFeatureResp]);

    useEffect(() => {
        const { prevRootFeaturesResp, prevAccessManagementErrorResp } = featurePermissionRespRef.current;
        if (rootFeaturesResp && prevRootFeaturesResp !== rootFeaturesResp) {
            if (Array.isArray(rootFeaturesResp) && rootFeaturesResp.length > 0) {
                const { id } = rootFeaturesResp[0];
                setActiveRootId(id);
                getSubFeature(id);
            }
        }
        else if (accessManagementErrorResp && accessManagementErrorResp !== prevAccessManagementErrorResp) {
            const { message }: any = accessManagementErrorResp;
            toast.error(message || "Something went wrong.");
        }
        featurePermissionRespRef.current.prevRootFeaturesResp = rootFeaturesResp;
        featurePermissionRespRef.current.prevAccessManagementErrorResp = accessManagementErrorResp;
    }, [searchStringRef, rootFeaturesResp, accessManagementErrorResp]);

    function onClickRootModuleHandler(event: React.MouseEvent<HTMLLIElement>) {
        const moduleId = event.currentTarget.getAttribute('data-id');
        if (moduleId) {
            setActiveRootId(moduleId);
            getSubFeature(moduleId);
        }
    }

    const permissionUpdateHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>, featureString: string) => {
        console.log(featureString);
        const { name, value, checked } = event.target;
        console.log({ name, value, checked })
    }, [subFeaturesState]);

    const permissionLength = Array.isArray(permissionsListResp) ? permissionsListResp.length : 0;
    console.log({ permissionsListResp });
    return (
        <React.Fragment>
            <div className="page-content master-setup-wrapper">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Digital Caampus" />

                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                        <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border">
                                <div className="tw-py-0 tw-px-0">

                                    <div className="tw-p-3 tw-border-b">
                                        <h6 className="tw-mb-0 tw-text-base tw-font-semibold">
                                            Root Modules
                                        </h6>
                                    </div>

                                    <ul className="left-menu-section tw-divide-y">
                                        {Array.isArray(rootFeaturesResp) &&
                                            rootFeaturesResp.map((item: any) => (
                                                <li
                                                    data-id={item.id}
                                                    onClick={onClickRootModuleHandler}
                                                    className={classnames(
                                                        "tw-px-3 tw-py-2 tw-cursor-pointer hover:tw-bg-gray-100",
                                                        {
                                                            "tw-bg-blue-50 tw-text-blue-600 tw-font-medium":
                                                                item.id === activeRootId,
                                                        }
                                                    )}
                                                    key={item.id}
                                                >
                                                    {item.description}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="tw-col-span-12 lg:tw-col-span-8 xl:tw-col-span-9">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border">

                                <div className="tw-px-4 tw-py-3 tw-border-b">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-1">
                                        Feature Permission
                                    </h4>
                                </div>

                                <div className="tw-p-0 tw-overflow-x-auto">
                                    <div
                                        className="modules-container tw-min-w-max"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: `45px minmax(280px, 1fr) repeat(${permissionLength}, 80px)`,
                                        }}
                                    >

                                        <div className="custom-row header tw-contents">

                                            <div className="custom-column tw-flex tw-items-center tw-justify-center tw-p-2">
                                                <InputCheckbox
                                                    name={"english"}
                                                    value={false}
                                                    onChange={() => { }}
                                                    formgroupClassName="tw-mb-0"
                                                />
                                            </div>

                                            <div className="custom-column tw-flex tw-items-center tw-p-2 tw-font-medium">
                                                Module
                                            </div>

                                            {Array.isArray(permissionsListResp) &&
                                                permissionsListResp.map((item) => (
                                                    <div
                                                        key={`permssion-${item.id}`}
                                                        className="custom-column tw-flex tw-items-center tw-justify-center tw-text-sm tw-text-nowrap tw-truncate tw-p-2"
                                                    >
                                                        {item?.description}
                                                    </div>
                                                ))}
                                        </div>
                                        
                                        {subFeaturesState.map((item: any, index: number) => (
                                            <ModuleTree
                                                key={index}
                                                level={1}
                                                parentsInfo={[]}
                                                parentFeatureId={''}
                                                permissionUpdateHandler={permissionUpdateHandler}
                                                masterPermissions={permissionsListResp}
                                                {...item}
                                            />
                                        ))}
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