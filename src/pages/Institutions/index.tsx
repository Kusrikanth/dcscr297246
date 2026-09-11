import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainer, ModalContainerUpdated, TextIconInput } from "../../Components/Common";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { generateBranchesColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { useEffect, useRef } from "react";

//Action Generator
import { generateActionPayload } from "../../utility/reduxutility";
import { getInstBranchesAct, updateMainBranchAct, deleteBranchAct } from "../../store/mastersettings/branch/branchactions";
import { getInstituteListAct } from "../../store/mastersettings/instituteinfo/instituteinfoactions";

//Modal Component
import AddInstituteModal from "./AddInstituteModal";

//
import ViewInstituteDetailsCard from "./ViewInstituteDetailsCard";
// Interface & Types
import {
    IBranchProps, IBranchModal, IBranchState, IDelBranchModalState, IBranchResp, IFilterBranchState
} from "./institutetypes";
import { IBranchInfo } from "../../store/mastersettings/branch/branchtypes";
import { IOptionsHrtl } from "../../Components/Common/MenuOptions";
import { IPaginationState } from "../../Components/Common/Pagination";
import { useModal } from "../../hooks/modalhook";
import { EyeIcon, PencilEdit02Icon, LockKeyStrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../Components/Common/Button";

const Institutions: React.FC<IBranchProps> = ({ instituteId, instituteName }) => {
    const [addInstModalState, setAddInstModalState] = useState<any>({
        showModal: false,
        instituteId: ""
    });
    const { modalState: institutionsModal, closeModal: closeInstitutionsModal, openModal: openInstitutionsModal } = useModal();
    const [delInstModalState, setDelInstModalState] = useState<any>({
        showModal: false,
        instituteId: ""
    })
    const [viewInstituteState, setViewInstituteState] = useState<any>(undefined);
    const history = useHistory();
    const [branchState, setBranchState] = useState<IBranchState>({
        isListMode: true
    });
    const [filterState, setFilterState] = useState<IFilterBranchState>({
        branchName: undefined
    });
    const dispatch = useAppDispatch();
    const { instituteListResp, instInfoError, addBranchResp, branchErrorResp } = useAppSelector(({ instituteInfo, branch }) => ({
        instituteListResp: instituteInfo.instituteListResp,
        instInfoError: instituteInfo.instInfoError,
        addBranchResp: branch.addBranchResp,
        branchErrorResp: branch.branchErrorResp

    }), shallowEqual);

    const instituteRespRef = useRef<any>({
        prevInstituteListResp: undefined,
        prevInstInfoError: instInfoError,
        prevAddBranchResp: addBranchResp,
        prevBranchErrorResp: branchErrorResp
    });

    useEffect(() => {
        const { prevInstituteListResp, prevInstInfoError, prevAddBranchResp, prevBranchErrorResp } = instituteRespRef.current;
        if (instituteListResp && prevInstituteListResp !== instituteListResp) {
            if (Array.isArray(instituteListResp?.data) && instituteListResp.data?.length > 0) {
                const instDetails = instituteListResp?.data
                setViewInstituteState(instDetails);
            }
        } else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { details }: any = instInfoError;
            toast.error(details);
        }
        else if (addBranchResp && addBranchResp !== prevAddBranchResp) {
           setAddInstModalState((prevState: any) => ({ ...prevState, showModal: false }));
            getInstituteApiCall();
        }
        else if (branchErrorResp && branchErrorResp !== prevBranchErrorResp) {
            const { details }: any = branchErrorResp;
            toast.error(details);
        }
        instituteRespRef.current.prevInstituteListResp = instituteListResp;
        instituteRespRef.current.prevInstInfoError = instInfoError;
        instituteRespRef.current.prevAddBranchResp = addBranchResp;
        instituteRespRef.current.prevBranchErrorResp = branchErrorResp;
    }, [instituteListResp, instInfoError, addBranchResp, branchErrorResp]);


    function addBranchHndlr() {
        setAddInstModalState((prevState: any) => ({ ...prevState, showModal: true, instituteId: undefined, modalData: undefined }));
    }
    const toggleInstModal = useCallback((apiCall?: boolean) => {
        setAddInstModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }));
        if (typeof (apiCall) === "boolean" && apiCall) {
            getInstituteApiCall();
        }
    }, [instituteListResp]);


    function editInstHandler(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id");
        let modalData: any = undefined;
        if (instituteId) {
            modalData = instituteListResp?.data?.find((item: any) => item.id === Number(instituteId));
        }
        if (modalData) {
            setAddInstModalState((prevState: any) => ({ ...prevState, showModal: true, instituteId, modalData }));
        }
    }

    function viewInstHndlr(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id");
        openInstitutionsModal(instituteId)

    }

    function assignInstPermissionHandler(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id");
        history.push('/institutes/permissions', {
            instituteId
        })
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => {
        return ([{
            id: "edit",
            actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
            actionName: "Edit",
            onClickHndlr: editInstHandler,
        }, {
            id: "view",
            actionIcon: <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />,
            actionName: "View Student Info",
            onClickHndlr: viewInstHndlr,
        },
        {
            id: "permission",
            actionIcon: <HugeiconsIcon icon={LockKeyStrokeStandard} className="text-muted" size={18} />,
            actionName: "Permission",
            onClickHndlr: assignInstPermissionHandler,
        }])
    }, [branchState.isListMode, instituteListResp]);

    function getInstituteApiCall(otherProps?: (IPaginationState | IFilterBranchState)) {
        // dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
        const params = {
            instituteGroupId: "1", ...otherProps,
            // approvalStatus: "APPROVED"
        };
        dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, params)));
    }

    function delModalCancelHndlr() {
        setDelInstModalState((prevState: any) => ({ ...prevState, showModal: false, instituteId: "" }));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        getInstituteApiCall(paginationInfo);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getInstituteApiCall({ "branchName": value });
    }

    function delModalSubmitHndlr() {
        const { instituteId } = delInstModalState;
        dispatch(deleteBranchAct(generateActionPayload("delete_branch", { instituteId })));
    }

    const branchColumns = useMemo(() => generateBranchesColumns(menuOptions), [instituteListResp]),
        { data: branchList, pageNumber, totalPages, totalElements } = instituteListResp || {};
    return (
        <React.Fragment>

            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Institutions" pageTitle="DPS" />

                    <div className="tw-grid tw-grid-cols-1">
                        <div>
                            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-0">

                                <div className="tw-px-4 tw-py-3 tw-border-b">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">Institutes</h4>
                                </div>

                                <div className="tw-px-4 tw-py-3 tw-border-b tw-bg-white">
                                    <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3 tw-items-start sm:tw-items-center">

                                        <div className="tw-w-full sm:tw-w-1/3">
                                            <TextIconInput
                                                formgroupClassName="search-box"
                                                name="branchName"
                                                value={filterState.branchName}
                                                placeHolder="Search..."
                                                onChange={onChangeFilterHndlr}
                                            >
                                                <i className="ri-search-line tw-absolute tw-left-3 !tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                                            </TextIconInput>
                                        </div>

                                        <div className="tw-w-full sm:tw-w-auto sm:tw-ml-auto">
                                            <Button
                                                type="button"
                                                variant="primary"
                                                onClick={addBranchHndlr}
                                            >
                                                <i className="ri-add-fill tw-mr-1"></i>
                                                Add Institute
                                            </Button>
                                        </div>

                                    </div>
                                </div>

                                <TableContainer
                                    columns={branchColumns}
                                    data={Array.isArray(branchList) ? branchList : []}
                                    divClass="table-responsive tw-mb-3"
                                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                    showPagination={true}
                                    totalPages={totalPages}
                                    totalRecords={totalElements}
                                    callbackPaginationHndlr={paginationHndlr}
                                    currentPageNumber={pageNumber}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ModalContainerUpdated
                id="add-branch-modal"
                isOpen={institutionsModal.showModal}
                toggle={closeInstitutionsModal}
                modalSize="md"
            >

                <ViewInstituteDetailsCard
                    isOpen={institutionsModal.showModal}
                    instituteDetailsArray={viewInstituteState}
                    id={institutionsModal.modalData}
                    toggle={closeInstitutionsModal}
                />
            </ModalContainerUpdated>
            <AddInstituteModal
                isOpen={addInstModalState.showModal}
                toggle={toggleInstModal}
                modalTitle={addInstModalState.instituteId ? "Edit Institute" : "Add Institute"}
                instituteId={addInstModalState.instituteId}
                editInstituteDetails={addInstModalState.modalData}
            />
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delInstModalState.showModal}
                confirmMessage="Are you sure you want to delete this institute ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}


export default Institutions;
// import { Container, Card, CardBody } from "reactstrap";

// //Common Component
// import BreadCrumb from "../../Components/Common/BreadCrumb";

// const Institutions = () => {
//     return (
// <div className="page-content">
//     <div className="container-fluid">
//         <BreadCrumb title="Institutions" pageTitle="DPS" />
//         <div className="card">
//             <div className="card-header">
//                 <h4 className="card-title mb-0 flex-grow-1">Institutes</h4>
//             </div>
//             <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center px-2">
//                     Institutions Screen
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
//     )
// }

// export default Institutions;