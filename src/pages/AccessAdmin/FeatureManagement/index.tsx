import React, { useMemo, useEffect, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../Components/Common";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
//Modal Component
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
//types
import { useModal } from "../../../hooks/modalhook";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getFeaturesAct } from "../../../store/accessmanagement/accessmanagementaction";
import { searhWithTextInList } from "../../../utility/commonutility";
import { getAllParentIds, TreeContextProvider } from "./helper";
import { ModuleTree } from "./TreeComponent";
import { ISubTreeParentInfo, ITreeContextValue, IFeature } from "./types";
import "./_treecomponent.scss";
import AddEditFeatureModal from "./AddEditFeatureModal";
import Button from "../../../Components/Common/Button";

export interface IRoleTypes {
    id: string,
    code: string,
    description: string
}

const FeatureManagement: React.FC = () => {
    const [modulesTreeState, setModulesTreeState] = useState<IFeature[]>([]);
    const [filterState, setFilterState] = useState({ searchString: "" });
    const { closeModal: closeFeatureModalHndlr, modalState: featureModalState,
        openModal: openFeatureModalHndlr } = useModal();
    const { closeModal: closeDeleteRoleTypeModal, modalState: deleteRoleTypeModalState, openModal: openDeleteRoleTypeModal } = useModal();
    const searchStringRef = useRef("");
    const dispatch = useAppDispatch();
    const [expandCollapseState, setExpandCollapseState] = useState<ITreeContextValue>({
        action: '',
        ids: []
    })

    const { deletePermissionResp, accessManagementErrorResp, featureListResp, showApiLoader } =
        useAppSelector(({ accessManagement, globalData }) => ({
            featureListResp: accessManagement.featureListResp,
            deletePermissionResp: accessManagement.deletePermissionResp,
            showApiLoader: globalData.showApiLoader,
            accessManagementErrorResp: accessManagement.accessManagementErrorResp
        }), shallowEqual);

    const departmentRespRef = useRef({
        prevFeatureListResp: featureListResp,
        prevDeletePermissionResp: deletePermissionResp,
        prevAccessManagementErrorResp: accessManagementErrorResp
    });

    useEffect(() => {
        getFeaturesApiCall();
    }, []);

    useEffect(() => {
        const { prevFeatureListResp, prevDeletePermissionResp, prevAccessManagementErrorResp } = departmentRespRef.current;
        if (featureListResp && prevFeatureListResp !== featureListResp) {
            const filterData = searhWithTextInList(featureListResp, "description", searchStringRef.current);
            setModulesTreeState(filterData);
        }
        else if (deletePermissionResp && prevDeletePermissionResp !== deletePermissionResp) {
            closeDeleteRoleTypeModal()
            getFeaturesApiCall();
            toast.success("Permission deleted successfully.");
        }
        else if (accessManagementErrorResp && accessManagementErrorResp !== prevAccessManagementErrorResp) {
            const { message }: any = accessManagementErrorResp;
            toast.error(message || "Something went wrong.");
        }
        departmentRespRef.current.prevFeatureListResp = featureListResp;
        departmentRespRef.current.prevDeletePermissionResp = deletePermissionResp;
        departmentRespRef.current.prevAccessManagementErrorResp = accessManagementErrorResp;
    }, [searchStringRef, featureListResp, deletePermissionResp, accessManagementErrorResp]);


    function deleteDepartmentHndlr(event: any) {
        const roleId = event.currentTarget.getAttribute("data-id")
        if (roleId)
            openDeleteRoleTypeModal(roleId)
    }

    function delModalSubmitHndlr() {
        // const { modalData } = deleteRoleTypeModalState;
        //     dispatch(deleteInstRoleTypeV2Act(generateActionPayload("delete_inst_role_type_v2",undefined, { id: modalData })));
    }

    function getFeaturesApiCall() {
        dispatch(getFeaturesAct(generateActionPayload("get_features")));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }))
        searchStringRef.current = value;
        const filterData = searhWithTextInList(featureListResp, "description", value);
        setModulesTreeState(filterData);
    }

    function closeFeatureModalCllbckHndlr(apiCall?: boolean) {
        if (typeof apiCall === 'boolean' && apiCall) {
            getFeaturesApiCall();
        }
        closeFeatureModalHndlr();
    }

    function expandCollapseHndlr(action: 'COLLAPSE' | 'EXPAND_ALL' | 'COLLAPSE_ALL', ids: string[]) {
        setExpandCollapseState(prevState => ({ ...prevState, action, ids }))
    }

    function editModuleHandler({ isRootFeature, parentFeatureId, featureId, featureName, parentsInfo }: {
        isRootFeature: boolean,
        parentFeatureId: string,
        featureId: string, featureName: string,
        parentsInfo: ISubTreeParentInfo[]
    }) {
        openFeatureModalHndlr({
            isRootFeature,
            parentFeatureId,
            featureId,
            featureName,
            parentsInfo,
            action: parentFeatureId ? 'UPDATE_CHILDFEATURE' : 'UPDATE_ROOTFEATURE',
            descriptionNote: parentFeatureId ? `Updating sub-feature of feature:` : 'Updating root feature.'
        });
    }

    function addModuleHandler({ isRootFeature, featureId, featureName, parentsInfo }: {
        isRootFeature: boolean, featureId: string, featureName: string,
        parentsInfo: ISubTreeParentInfo[],
    }) {
        openFeatureModalHndlr({
            isRootFeature,
            featureId,
            featureName,
            descriptionNote: `Adding sub-feature to feature:`,
            action: 'CREATE_CHILDFEATURE',
            parentsInfo
        });
    }

    function deleteModuleHndlr({ isRootFeature, featureId, featureName, subFeatureNames }: {
        isRootFeature: boolean,
        featureId: string, featureName: string, subFeatureNames: string[]
    }) {
        openDeleteRoleTypeModal();
    }

    const parentIds = useMemo(() => {
        return getAllParentIds(modulesTreeState);
    }, [modulesTreeState]);
    function expandAllHndlr() {
        setExpandCollapseState(prevState => ({ ...prevState, action: 'EXPAND_ALL', ids: parentIds }))
    }
    function collapseAllHndlr() {
        setExpandCollapseState(prevState => ({ ...prevState, action: 'COLLAPSE_ALL', ids: parentIds }))
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Digital Caampus" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">

                        <div className="tw-px-4 tw-py-3 tw-border-b">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">Feature Management</h4>
                        </div>

                        <div className="tw-p-0">
                            <div className="tw-p-4">
                                <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-4 tw-items-start md:tw-items-center">

                                    <div className="tw-w-full md:tw-w-1/3">
                                        <TextIconInput
                                            formgroupClassName="search-box"
                                            name="searchString"
                                            value={filterState.searchString}
                                            placeHolder="Search Root Feature..."
                                            onChange={onChangeFilterHndlr}
                                        >
                                            <i className="ri-search-line tw-absolute tw-left-3 !tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                                        </TextIconInput>
                                    </div>

                                    <div className="tw-w-full md:tw-w-auto md:tw-ml-auto">
                                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3">

                                            <Button
                                                variant="soft"
                                                onClick={expandAllHndlr}
                                            >
                                                Expand All
                                            </Button>

                                            <Button
                                                variant="soft"
                                                onClick={collapseAllHndlr}
                                            >
                                                Collapse All
                                            </Button>

                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    openFeatureModalHndlr({
                                                        isRootFeature: true,
                                                        descriptionNote: "Adding root feature.",
                                                        action: "CREATE_ROOTFEATURE",
                                                        modalData: null,
                                                    });
                                                }}
                                            >
                                                Add Root Feature
                                            </Button>

                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="tw-px-4 tw-pb-4">
                                <div className="tw-border tw-rounded-md tw-overflow-hidden">

                                    <div className="tw-grid tw-grid-cols-1 tw-bg-gray-100 tw-text-gray-600 tw-font-medium tw-px-4 tw-py-2">
                                        <div>Module</div>
                                    </div>

                                    <TreeContextProvider.Provider
                                        value={{
                                            value: expandCollapseState,
                                            toggle: expandCollapseHndlr,
                                            editModuleHandler,
                                            addModuleHandler,
                                            deleteModuleHndlr,
                                        }}
                                    >
                                        {modulesTreeState.map((item) => (
                                            <ModuleTree
                                                key={item.id}
                                                level={1}
                                                parentsInfo={[]}
                                                parentFeatureId={""}
                                                {...item}
                                            />
                                        ))}
                                    </TreeContextProvider.Provider>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                id="delete-permission-modal"
                isOpen={deleteRoleTypeModalState.showModal}
                confirmMessage="Are you sure you want to delete this feature ?"
                cancelHndlr={closeDeleteRoleTypeModal}
                confirmHndlr={delModalSubmitHndlr}
                isDisble={showApiLoader}
                iconType="reject"
                showImgIcon={true}
            />

            <ModalContainerUpdated
                id="add-edit-feature-modal"
                modalSize="md"
                isOpen={featureModalState.showModal}
                toggle={closeFeatureModalHndlr}
                modalTitle={featureModalState.modalData?.parentFeatureId ? "Edit Feature" : "Add Feature"}
            >
                <AddEditFeatureModal
                    toggle={closeFeatureModalCllbckHndlr}
                    modalData={featureModalState.modalData || null}
                />
            </ModalContainerUpdated>
        </React.Fragment >
    )
}

export default FeatureManagement;