
import React, { useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames"
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import { useHistory } from "react-router-dom";
import { deleteMedicenListAct, getMedicenListAct, getMedicenListByIdAct } from "../../../../store/healthrecords/healthrecordsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ConfirmationModal, ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import AddMedicensModal from "./AddMedicensModal";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    searchString: "",
};

const MedicensDetails = () => {

    const dispatch = useAppDispatch();
    const history = useHistory();
    const [MedicensFilterState, setMedicensFilterState] = useState(initialValues);

    const pagination: any = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [addMedicensModalState, setAddMedicensModalState] = useState({
        showModal: false,
        medicineId: undefined
    })

    const [delMedicenModalState, setDelMedicenModalState] = useState({
        showModal: false,
        medicineId: ""
    })

    const medicinesList = (otherProps?: any) => {
        const { searchString } = MedicensFilterState;
        const payload = {
            instituteId: instituteId,
            branchId,
            searchString,
            ...pagination.current,
            ...otherProps,
        };
        dispatch(getMedicenListAct(generateActionPayload('get_medicen_list', undefined, payload)))
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getMedicenListResp,
        saveMedicenListResp,
        editMedicenListResp,
        deleteMedicenListResp,
        healthRecordsErrResp,
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, healthRecords }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getMedicenListResp: healthRecords.getMedicenListResp,
            saveMedicenListResp: healthRecords.saveMedicenListResp,
            editMedicenListResp: healthRecords.editMedicenListResp,
            deleteMedicenListResp: healthRecords.deleteMedicenListResp,
            healthRecordsErrResp: healthRecords.healthRecordsErrResp,
        }),
        shallowEqual
    );

    const hostelFeeReversalRef = useRef({
        prevSaveMedicenListResp: saveMedicenListResp,
        prevEditMedicenListResp : editMedicenListResp,
        prevDeleteMedicenListResp : deleteMedicenListResp,
        prevHealthRecordsErrResp: healthRecordsErrResp
    });

    useEffect(() => {
        const { prevSaveMedicenListResp, prevEditMedicenListResp , prevDeleteMedicenListResp , prevHealthRecordsErrResp } = hostelFeeReversalRef.current;

        if (saveMedicenListResp && prevSaveMedicenListResp !== saveMedicenListResp) {
            toast.success("Medicen added successfully.");
            toggleMedicensModal()
            medicinesList()
        }
        else if(editMedicenListResp && prevEditMedicenListResp !== editMedicenListResp){
            toast.success("Medicen updated successfully.");
            toggleMedicensModal()
            medicinesList()
        }
        else if(deleteMedicenListResp && prevDeleteMedicenListResp !== deleteMedicenListResp){
            toast.success("Medicen deleted successfully.");
            toggleDelMedicenModal()
            medicinesList()
        }
        else if(healthRecordsErrResp && prevHealthRecordsErrResp !== healthRecordsErrResp){
            const { details } = healthRecordsErrResp || {};
            toast.error(details || "Something went wrong.");
        }

        hostelFeeReversalRef.current.prevSaveMedicenListResp = saveMedicenListResp;
        hostelFeeReversalRef.current.prevEditMedicenListResp = editMedicenListResp;
        hostelFeeReversalRef.current.prevDeleteMedicenListResp = deleteMedicenListResp;
        hostelFeeReversalRef.current.prevHealthRecordsErrResp = healthRecordsErrResp;
        
    }, [saveMedicenListResp,editMedicenListResp,deleteMedicenListResp,healthRecordsErrResp]);


    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const medicineId = event.currentTarget.getAttribute("data-id");
                    dispatch(getMedicenListByIdAct(generateActionPayload("get_medicen_list_by_id", { medicineId })));
                    toggleMedicensModal(medicineId);
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const medicineId = event.currentTarget.getAttribute("data-id");
                    toggleDelMedicenModal(medicineId);
                },
            }
        ],
        [getMedicenListResp]
    );
    
    const medicineTableData = useMemo(() => generateColumns(menuOptions), [getMedicenListResp]);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        medicinesList()
    }, [academicYearListResp]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setMedicensFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0;
        medicinesList({ [name]: value })
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        medicinesList(paginationInfo)
    }

    const toggleMedicensModal = (medicineId?: any) => {
        setAddMedicensModalState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            medicineId : medicineId  || "",
        }));
    };

    const toggleDelMedicenModal = (medicineId?: any) => {
        setDelMedicenModalState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            medicineId : medicineId  || "",
        }));
    }

    const delStuLongLeaveConfirmHndler = () => {
        dispatch(deleteMedicenListAct(generateActionPayload("delete_medicen_list", { medicineId: delMedicenModalState.medicineId },)));
    }

    const { data: medicenData, totalElements, totalPages, pageble } = getMedicenListResp || {}

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Health Records" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        {/* Card Header */}
                        <div className="tw-border-b tw-p-4">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-flex-1">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Medicine Details
                                    </h4>
                                </div>

                                <div className="tw-flex tw-justify-end">
                                    <Button
                                        variant='primary'
                                        onClick={() => toggleMedicensModal()}
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
                                <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-4">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={MedicensFilterState.searchString}
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
                            columns={medicineTableData}
                            data={Array.isArray(getMedicenListResp?.data) ? getMedicenListResp?.data : []}
                            divClass="tw-overflow-x-auto tw-mb-3"
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
                id="delete-medicen-modal"
                isOpen={delMedicenModalState.showModal}
                confirmMessage="Are you sure you want to delete this Medicen ?"
                cancelHndlr={() => toggleDelMedicenModal()}
                confirmHndlr={delStuLongLeaveConfirmHndler}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
            <ModalContainerUpdated
                id="add-medicens-details-modal"
                isOpen={addMedicensModalState.showModal}
                toggle={toggleMedicensModal}
                modalTitle={addMedicensModalState.medicineId ? "Edit Medicen Details" : "Create Medicen Details"}
                modalSize="md"
            >
                <AddMedicensModal
                    medicineId={addMedicensModalState.medicineId}
                    toggle={toggleMedicensModal}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default MedicensDetails;
