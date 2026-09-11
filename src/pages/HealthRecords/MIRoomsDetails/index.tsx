
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import classnames from "classnames"
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct,  resetBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import { useHistory } from "react-router-dom";
import { deleteMiRoomListAct, getMiRoomListAct, getMiRoomListByIdAct } from "../../../store/healthrecords/healthrecordsaction";
import AddMiRoomsModal from "./AddMiRoomsModal";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../Components/Common/Button";


const initialValues = {
    searchString: "",
    inchargeId: "",
};

const MIRoomsDetails = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const [exportExcel, setExportExcel] = useState<any>({
        showModal: false,
        scrutinyId: undefined
    })

    const [addMiRoomsModalState, setAddMiRoomsModalState] = useState<any>({
        showModal: false,
        id: undefined
    })

    const [delMiRoomModalState, setDelMiRoomModalState] = useState<any>({
        showModal: false,
        id: ""
    })

    const miRoomsList = (otherProps?: any) => {
        const { searchString } = miRoomsFilterState;
        const payload = {
            instituteId: instituteId,
            branchId,
            searchString,
            ...pagination.current,
            ...otherProps,
        };
        dispatch(getMiRoomListAct(generateActionPayload('get_mi_room_list', undefined, payload)))
    }

    const [miRoomsFilterState, setMiRoomsFilterState] = useState<any>(initialValues);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getMiRoomListResp,
        saveMiRoomListResp,
        editMiRoomListResp,
        deleteMiRoomListResp,
        healthRecordsErrResp,
    }: any = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, healthRecords }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getMiRoomListResp: healthRecords.getMiRoomListResp,
            saveMiRoomListResp: healthRecords.saveMiRoomListResp,
            editMiRoomListResp: healthRecords.editMiRoomListResp,
            deleteMiRoomListResp: healthRecords.deleteMiRoomListResp,
            healthRecordsErrResp: healthRecords.healthRecordsErrResp,
        }),
        shallowEqual
    );

    const hostelFeeReversalRef = useRef<any>({
        prevSaveMiRoomListResp: saveMiRoomListResp,
        prevEditMiRoomListResp : editMiRoomListResp,
        prevDeleteMiRoomListResp : deleteMiRoomListResp,
        prevHealthRecordsErrResp: healthRecordsErrResp
    });

    useEffect(() => {
        const { prevSaveMiRoomListResp, prevEditMiRoomListResp , prevDeleteMiRoomListResp , prevHealthRecordsErrResp } = hostelFeeReversalRef.current;

        if (saveMiRoomListResp && prevSaveMiRoomListResp !== saveMiRoomListResp) {
            toast.success("MI Room added successfully.");
            toggleMiRoomsModal()
            miRoomsList()
        }
        else if(editMiRoomListResp && prevEditMiRoomListResp !== editMiRoomListResp){
            toast.success("MI Room updated successfully.");
            toggleMiRoomsModal()
            miRoomsList()
        }
        else if(deleteMiRoomListResp && prevDeleteMiRoomListResp !== deleteMiRoomListResp){
            toast.success("MI Room deleted successfully.");
            toggleDelMiRoomModal()
            miRoomsList()
        }
        else if(healthRecordsErrResp && prevHealthRecordsErrResp !== healthRecordsErrResp){
            const { details } = healthRecordsErrResp || {};
            toast.error(details || "Something went wrong.");
        }

        hostelFeeReversalRef.current.prevSaveMiRoomListResp = saveMiRoomListResp;
        hostelFeeReversalRef.current.prevEditMiRoomListResp = editMiRoomListResp;
        hostelFeeReversalRef.current.prevDeleteMiRoomListResp = deleteMiRoomListResp;
        hostelFeeReversalRef.current.prevHealthRecordsErrResp = healthRecordsErrResp;
        
    }, [saveMiRoomListResp,editMiRoomListResp,deleteMiRoomListResp,healthRecordsErrResp]);


    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    dispatch(getMiRoomListByIdAct(generateActionPayload("get_mi_room_list_by_id", { id: id })));
                    toggleMiRoomsModal(id)
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    toggleDelMiRoomModal(id)
                },
            }
        ],
        []
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        miRoomsList()
    }, [academicYearListResp]);


    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setMiRoomsFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0;
        if (name === 'curriculumId') {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            miRoomsList({ [name]: value })
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
        else {
            miRoomsList({ [name]: value })
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        miRoomsList(paginationInfo)
    }


    const toggleExportExcelModal = (id?: any) => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };

    const toggleMiRoomsModal = (id?: any) => {
        setAddMiRoomsModalState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            id: id || "",
        }));
    };

    const toggleDelMiRoomModal = (id?: any) => {
        setDelMiRoomModalState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            id: id || "",
        }));
    }

    const delStuLongLeaveConfirmHndler = () => {
        dispatch(deleteMiRoomListAct(generateActionPayload("delete_mi_room_list", { id: delMiRoomModalState.id },)));
    }

    const { content: studentResp, totalElements, totalPages, pageble } = getMiRoomListResp || {}


    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Health Records" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        {/* Card Header */}
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-flex-1">
                                    <h4 className="tw-text-[16px] tw-font-[600] tw-text-gray-800 text-align-center tw-mb-0">
                                        MI Room
                                    </h4>
                                </div>

                                <div className="tw-flex tw-justify-end">
                                    <Button
                                        variant="primary"
                                onClick={() => toggleMiRoomsModal()}
                                    >
                                        Add New
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-12">

                                {/* Search */}
                                <div className="md:tw-col-span-12 lg:tw-col-span-4">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={miRoomsFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-slate-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer
                            columns={roleColumns || []}
                            data={getMiRoomListResp?.data || []}
                            divClass="tw-overflow-x-auto !tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>

            <ConfirmationModal
                id="delete-mi-room-modal"
                isOpen={delMiRoomModalState.showModal}
                confirmMessage="Are you sure you want to delete this MI Room ?"
                cancelHndlr={() => toggleDelMiRoomModal()}
                confirmHndlr={delStuLongLeaveConfirmHndler}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
            <ModalContainerUpdated
                id="add-mi-rooms-details-modal"
                isOpen={addMiRoomsModalState.showModal}
                toggle={()=>toggleMiRoomsModal()}
                modalTitle="Create MI Room"
                modalSize="md"
            >
                <AddMiRoomsModal
                    id={addMiRoomsModalState.id}
                    toggle={()=>toggleMiRoomsModal()}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default MIRoomsDetails;
