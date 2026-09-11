import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ConfirmationModal,ModalContainerUpdated,SelectInput,TextInput,} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { deleteBreaksAct, getBreaksAct, getBreaksTypeAct } from "../../../../store/academic/timetableManagment/timetableManagmentactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { debounce } from "../../../../utility/commonutility";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFilterState } from "../../../../hooks/filterhook";
import { toast } from "react-toastify";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import ViewBreaksCount from "./ViewBreaksCount";
import AddBreaksModal from "./AddBreaksModal";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    searchString: "",
}
const Breaks = () => {
    const dispatch = useAppDispatch();
    const { showClearFilterState, advanceFilterChange } = useFilterState();
    const { openModal: openViewBreaksModal, closeModal: closeViewBreaksModal, modalState: openViewBreaksModalState } = useModal()

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const {
        closeModal: closeBreaksModal,
        openModal: openBreaksModal,
        modalState: breaksModalState,
    } = useModal();

    const {
        closeModal: closeDeleteBreaksModal,
        openModal: openDeleteBreaksModal,
        modalState: deleteBreaksModalState,
    } = useModal();

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        brchCurriculumResp,
        branchClassResp,
        getBreaksResp,
        deleteBreaksResp,
        saveBreaksResp,
        getTimeTableErrResp,
        updateBreaksResp,
        showApiLoader
    } = useAppSelector(
        ({ timeTableManagement, appData, globalData, branchAcademics, instAcademics }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            currentInstIdResp: appData.currentInstIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            getBreaksResp: timeTableManagement.getBreaksResp,
            deleteBreaksResp: timeTableManagement.deleteBreaksResp,
            saveBreaksResp: timeTableManagement.saveBreaksResp,
            getTimeTableErrResp: timeTableManagement.getTimeTableErrResp,
            updateBreaksResp: timeTableManagement.updateBreaksResp,
        }),
        shallowEqual
    );

    const periodCategoryRef = useRef({
        prevDeleteBreaksResp: deleteBreaksResp,
        prevSaveBreaksResp: saveBreaksResp,
        prevGetTimeTableErrResp: getTimeTableErrResp,
        prevUpdateBreaksResp: updateBreaksResp,
    })

    const breaksForm = useFormik({
        initialValues,
        onSubmit: (values) => { },
    });

    useEffect(() => {
        const { prevDeleteBreaksResp, prevSaveBreaksResp, prevGetTimeTableErrResp, prevUpdateBreaksResp } = periodCategoryRef.current;

        if (deleteBreaksResp && prevDeleteBreaksResp !== deleteBreaksResp) {
            toast.success("Breaks Deleted Successfully")
            closeDeleteBreaksModal()
            getBreaksApiCall()
        }
        else if (saveBreaksResp && prevSaveBreaksResp !== saveBreaksResp) {
            toast.success("Breaks  Saved Successfully")
            closeBreaksModal()
            getBreaksApiCall()
        }
        else if (getTimeTableErrResp && prevGetTimeTableErrResp !== getTimeTableErrResp) {
            const { details } = getTimeTableErrResp;
            toast.error(details || "Something went wrong.")
        }
        else if (updateBreaksResp && prevUpdateBreaksResp !== updateBreaksResp) {
            toast.success("Breaks Updated Successfully")
            closeBreaksModal()
            getBreaksApiCall()
        }

        periodCategoryRef.current.prevDeleteBreaksResp = deleteBreaksResp;
        periodCategoryRef.current.prevSaveBreaksResp = saveBreaksResp;
        periodCategoryRef.current.prevGetTimeTableErrResp = getTimeTableErrResp;
        periodCategoryRef.current.prevUpdateBreaksResp = updateBreaksResp;
    }, [getTimeTableErrResp, deleteBreaksResp, saveBreaksResp, updateBreaksResp])

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openBreaksModal(id);
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDeleteBreaksModal(id);
                },
            },
        ],
        []
    );
    const getBreaksApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            academicYearId: breaksForm.values.academicYearId,
            curriculumId: breaksForm.values.curriculumId,
            classId: breaksForm.values.classId,
            searchString: breaksForm.values.searchString,
            ...pagination.current,
            ...otherProps
        }
        dispatch(getBreaksAct(generateActionPayload("get_breaks", undefined, payload)));
    }

    const getBreaksTypeApiCall = (otherProps?: any) => {
        const payload = {
          ...otherProps
        }
        dispatch(getBreaksTypeAct(generateActionPayload("get_breaks_type", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: breaksForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    useEffect(() => {
        getBreaksTypeApiCall();
    }, []);
    
    useEffect(() => {
        const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        breaksForm.setFieldValue("academicYearId", yearId)
        getCurriculumApiCall({ academicYearId: yearId });
        getBreaksApiCall({ academicYearId: yearId });
    }, [academicYearListResp]);


    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getBreaksApiCall(paginationInfo)
    }

    function delModalSubmitHndlr() {
        dispatch(deleteBreaksAct(generateActionPayload("delete_breaks", { id: deleteBreaksModalState.modalData })));
    }

    function search(value: string) {
        getBreaksApiCall({ ...breaksForm.values, searchString: value });
    }

    const debounceFun = useCallback(debounce(search, 200), [getBreaksResp]);

    const filterChangeHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            breaksForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "" }));
            getBreaksApiCall({ ...breaksForm.values, academicYearId: value, curriculumId: "", classId: "" });
        }
        else if (name === "curriculumId") {
            breaksForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "" }));
            const payload = {
                branchId,
                curriculumId: value,
                academicYearId: breaksForm.values.academicYearId,
                sortBy: "classSequence",
                orderBy: "asc",
                pageNo: 0,
                pageSize: 100,
            };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            getBreaksApiCall({ ...breaksForm.values, curriculumId: value, classId: "" });
        }
        else if (name === "searchString") {
            breaksForm.setValues((prev: any) => ({ ...prev, [name]: value }));
            debounceFun(value);
        }
        else {
            breaksForm.setValues((prev: any) => ({ ...prev, [name]: value }));
            getBreaksApiCall({ [name]: value });
        }
        advanceFilterChange({
            keys: { ...breaksForm.values, [name]: value },
            ignoredKeys: [],
        });
    };

    const clearFilterHndlr = () => {
        const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        pagination.current = { ...pagination.current, pageNo: 0 }
        breaksForm.setValues({ ...initialValues, academicYearId: yearId || "" });
        getBreaksApiCall({ ...initialValues, academicYearId: yearId });
        advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
    };

    const tableColumns = useMemo(() => generateColumns(menuOptions, openViewBreaksModal), [menuOptions]);

    const { data: BreaksData, pageNumber, totalPages, totalElements } = getBreaksResp || {};
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb
                        title="Breaks"
                        pageTitle="Time Table Management"
                    />
                </div>

                <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">

                    <div className="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
                        <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                            Breaks
                        </h4>

                        <Button
                            onClick={() => openBreaksModal()}
                            variant="primary"
                        >
                            <i className="ri-add-line"></i>
                            Add New
                        </Button>
                    </div>

                    <div className="tw-p-0">

                        <div className="tw-flex tw-flex-col xl:tw-flex-row tw-gap-4 tw-flex-wrap tw-items-start xl:tw-items-end tw-p-5">

                            <div className="tw-w-full md:tw-w-80 tw-relative search-box ">
                                <TextInput
                                    name="searchString"
                                    formgroupClassName="mb-0"
                                    placeHolder="Search"
                                    value={breaksForm.values.searchString}
                                    onChange={filterChangeHndlr}
                                    labelText="Search"
                                    floatingLabel
                                />
                                <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                            </div>

                            <div className="tw-w-60">
                                <SelectInput
                                    name="academicYearId"
                                    value={breaksForm.values.academicYearId}
                                    onChange={filterChangeHndlr}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    formgroupClassName="mb-0"
                                    labelText="Academic Year"
                                    floatingLabel
                                    invalid={(breaksForm.touched.academicYearId && breaksForm.errors.academicYearId) ? true : false}
                                    error={(breaksForm.touched.academicYearId && breaksForm.errors.academicYearId) ? breaksForm.errors.academicYearId : ""}
                                />
                            </div>

                            <div className="tw-w-60">
                                <SelectInput
                                    name="curriculumId"
                                    value={breaksForm.values.curriculumId}
                                    onChange={filterChangeHndlr}
                                    menuItems={curriculumTypes || []}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    formgroupClassName="mb-0"
                                    labelText="Curriculum"
                                    floatingLabel
                                    invalid={
                                        breaksForm.touched.curriculumId &&
                                            breaksForm.errors.curriculumId
                                            ? true
                                            : false
                                    }
                                    error={
                                        breaksForm.touched.curriculumId &&
                                            breaksForm.errors.curriculumId
                                            ? breaksForm.errors.curriculumId
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-w-60">
                                <SelectInput
                                    name="classId"
                                    value={breaksForm.values.classId}
                                    onChange={filterChangeHndlr}
                                    menuItems={classTypes || []}
                                    valueKey="id"
                                    textKey="shortName"
                                    formgroupClassName="mb-0"
                                    labelText="Class"
                                    floatingLabel
                                    invalid={
                                        breaksForm.touched.classId &&
                                            breaksForm.errors.classId
                                            ? true
                                            : false
                                    }
                                    error={
                                        breaksForm.touched.classId &&
                                            breaksForm.errors.classId
                                            ? breaksForm.errors.classId
                                            : ""
                                    }
                                />
                            </div>

                            {showClearFilterState && (
                                <div className="tw-ml-auto">
                                    <Button
                                        type="button"
                                        onClick={clearFilterHndlr}
                                        variant="wrong"
                                    >
                                        Clear Filter
                                    </Button>
                                </div>
                            )}

                        </div>

                        <div className="tw-rounded-lg tw-border tw-border-gray-200 tw-overflow-hidden">
                            <TableContainer
                                columns={tableColumns || []}
                                data={BreaksData || []}
                                tableClass="tw-min-w-full"
                                divClass="tw-overflow-x-auto"
                                theadClass="tw-bg-gray-100 tw-text-gray-600"
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

            <ModalContainerUpdated
                id="BreaksTypeModal"
                isOpen={breaksModalState.showModal}
                toggle={closeBreaksModal}
                modalTitle={
                    breaksModalState.modalData
                        ? "Edit Breaks"
                        : "Add Breaks"
                }
                modalSize="lg"
            >
                <AddBreaksModal
                    toggle={() => closeBreaksModal()}
                    isOpen={breaksModalState.showModal}
                    modalData={breaksModalState.modalData}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="BreaksTypeModal"
                isOpen={openViewBreaksModalState.showModal}
                toggle={closeViewBreaksModal}
                modalTitle={"Breaks"}
                modalSize="lg"
            >
                <ViewBreaksCount
                    toggle={closeViewBreaksModal}
                    isOpen={openViewBreaksModalState.showModal}
                    modalData={openViewBreaksModalState.modalData}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-period-category"
                isOpen={deleteBreaksModalState.showModal}
                confirmMessage="Are you sure you want to delete a breaks type?"
                cancelHndlr={closeDeleteBreaksModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                iconType="reject"
            ></ConfirmationModal>
        </>
    );
};

export default Breaks;
