
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import classnames from "classnames"
// import { StudentConcessionFilterhProps } from "./studentConcessionsTypes";
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, setBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { generateColumns, advanceFilterValues, checkFitlersApplied, getAppliedAdvanceFilterCount } from "./helper";
import AddStudentHolidayDetails from "./AddStudentHolidayDetailsModal";
import { deleteHolidayAct, exportHolidayAct, getHolidayDetailsListAct, setHolidayDetailsListAct } from "../../../store/StudentAttendance/HolidayDetails/holidaydetailsaction";
import { useModal } from "../../../hooks/modalhook";
import { debounce } from "../../../utility/commonutility";
// import { generateColumns, stuAttData } from "./helper";
// import AddDailyAttendanceModal from "./AddDailyAttendanceModal";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilter from "./AdvanceFilters";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classIds: "",
};

const StudentConcessions = () => {
    const dispatch = useAppDispatch();
    const [stuHolidayFilterState, setStuHolidayFilterState] = useState(initialValues);
    const [helperState, setHelperState] = useState({
        showClearFilter: false,
        advanceFilterCount: 0
    })
    const { closeModal: closeConfirmHolidayModalHnldr,
        openModal: openConfirmHolidayModalHnldr, modalState: confirmHolidayModalState } = useModal();

    const { closeModal: closeExportHolidayModalHnldr,
        openModal: openExportHolidayModalHnldr, modalState: exportHolidayModalState } = useModal();

    const { closeModal: closeAdvanceFilterHndlr, openModal: openAdvanceFilterHndlr,
        modalState: advanceFilterModalState
    } = useModal();
    const paginationRef = useRef({
        pageNo: 0,
        pageSize: 10
    })
    const advanceFilterRef = useRef(advanceFilterValues)
    const [addStuLongLeaveModal, setAddStuLongLeaveModal] = useState({
        showModal: false,
        holidayDetailId: undefined,
        modalInfo: undefined
    })
    const curriculumRef = useRef(1);

    const getStudentHolidayApiCall = (otherProps?: any) => {
        let payload = {
            branchId,
            ...stuHolidayFilterState,
            startDate: advanceFilterRef.current.startDate,
            endDate: advanceFilterRef.current.endDate,
            ...otherProps,
            ...paginationRef.current,
        };
        setHelperState(prevState => ({
            ...prevState,
            showClearFilter: checkFitlersApplied(payload),
            advanceFilterCount: getAppliedAdvanceFilterCount(payload)
        }))
        dispatch(getHolidayDetailsListAct(generateActionPayload('get_holidays', undefined, payload)))
    }

    const toggleAddStuLongLeaveModal = (apiCall?: any) => {
        if (typeof apiCall === 'boolean' && apiCall) {
            getStudentHolidayApiCall();
        }
        setAddStuLongLeaveModal((prev) => ({ ...prev, showModal: !prev.showModal, holidayDetailId: undefined, modalInfo: undefined }))
    };


    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getHolidayDetailsListResp,
        showApiLoader,
        deleteHolidayResp,
        exportHolidayResp,
        holidayDetailsErrResp,
    }: any = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, holidayDetails }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getHolidayDetailsListResp: holidayDetails.getHolidayDetailsListResp,
            deleteHolidayResp: holidayDetails.deleteHolidayResp,
            exportHolidayResp: holidayDetails.exportHolidayResp,
            holidayDetailsErrResp: holidayDetails.holidayDetailsErrResp,
        }),
        shallowEqual
    );

    const holidayDetailRef = useRef({
        prevGetHolidayDetailsListResp: getHolidayDetailsListResp,
        prevDeleteHolidayResp: deleteHolidayResp,
        prevExportHolidayResp: exportHolidayResp
    });

    useEffect(() => {
        return () => {
            dispatch(setHolidayDetailsListAct(undefined))
        }
    }, [dispatch]);

    useEffect(() => {
        const { prevGetHolidayDetailsListResp, prevExportHolidayResp, prevDeleteHolidayResp } = holidayDetailRef.current;
        if (getHolidayDetailsListResp && prevGetHolidayDetailsListResp !== getHolidayDetailsListResp) {
            closeAdvanceFilterHndlr();
        } else if (exportHolidayResp && prevExportHolidayResp !== exportHolidayResp) {
            const url = window.URL.createObjectURL(new Blob([(exportHolidayResp)]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'holidaydetails.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            closeExportHolidayModalHnldr();
        } else if (deleteHolidayResp && prevDeleteHolidayResp !== deleteHolidayResp) {
            toast.success('Holiday details deleted successfully.');
            paginationRef.current.pageNo = 0;
            getStudentHolidayApiCall();
            closeConfirmHolidayModalHnldr();
        }
        holidayDetailRef.current.prevDeleteHolidayResp = deleteHolidayResp;
        holidayDetailRef.current.prevExportHolidayResp = exportHolidayResp;
        holidayDetailRef.current.prevGetHolidayDetailsListResp = getHolidayDetailsListResp;
    }, [getHolidayDetailsListResp, exportHolidayResp, deleteHolidayResp]);

    const menuOptions = useMemo(() => [
        {
            id: "edit",
            actionIcon: <HugeiconsIcon icon={PencilEdit02StrokeStandard} className="text-muted" size={18} />,
            actionName: "Edit",
            onClickHndlr: (event: any) => {
                const id = event.currentTarget.getAttribute("data-id");
                const { content } = getHolidayDetailsListResp;
                const holidayDetails = content.find((item: any) => item?.id?.toString() === id);
                if (holidayDetails) {
                    setAddStuLongLeaveModal(prevState => ({
                        ...prevState, showModal: true,
                        modalInfo: holidayDetails,
                        holidayDetailId: id
                    }))
                }
            },
        },
        {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
            actionName: "Delete",
            onClickHndlr: (event: any) => {
                const id = event.currentTarget.getAttribute("data-id");
                openConfirmHolidayModalHnldr(id);
            },
        }
    ], [getHolidayDetailsListResp]);


    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(setBrchClassAct(undefined));
        }
    }, []);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: stuHolidayFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    useEffect(() => {
        if (academicYearListResp) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            getCurriculumApiCall({ academicYearId: yearId });
        }
    }, [academicYearListResp, branchId, instituteId]);

    useEffect(() => {
        const { data: curriculumData } = brchCurriculumResp || {},
            { data: academicYearList } = academicYearListResp || {};
        if (curriculumData && academicYearList && curriculumRef.current === 1) {
            curriculumRef.current = 0;
            const { academicYearId, startDate = '', endDate = '' } = academicYearList.find((year: any) => year.yearStatus === "CURRENT") || {};
            const { branchCurriculumId } = curriculumData.find((item: any) => item?.curriculumName?.toLowerCase() === "cbse") || {};
            setStuHolidayFilterState((prev: any) => ({
                ...prev,
                academicYearId,
                curriculumId: branchCurriculumId
            }))
            getStudentHolidayApiCall({ academicYearId, curriculumId: branchCurriculumId });
            const payload = { branchId: branchId, curriculumId: branchCurriculumId, academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            advanceFilterRef.current = { ...advanceFilterRef.current, minDate: startDate, maxDate: endDate }
        }
    }, [academicYearListResp, brchCurriculumResp])



    function filterHandler(event: any) {
        const { name, value } = event.target;
        paginationRef.current.pageNo = 0;
        if (name === 'curriculumId') {
            dispatch(setBrchClassAct(undefined))
            getStudentHolidayApiCall({ [name]: value, classIds: "" });
            setStuHolidayFilterState((prev: any) => ({ ...prev, [name]: value, classIds: "" }))
            if (value) {
                const payload = { branchId: branchId, curriculumId: value, academicYearId: stuHolidayFilterState.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            return;
        } else if (name === "academicYearId") {
            let { startDate = '', endDate = '' } = academicYearListResp?.data.find((year: any) => year.academicYearId?.toString() === value) || {};
            advanceFilterRef.current = { startDate: '', endDate: '', minDate: startDate, maxDate: endDate };
            getCurriculumApiCall({ academicYearId: value });
            setStuHolidayFilterState((prev: any) => ({ ...prev, [name]: value, classIds: "" }));
        }
        setStuHolidayFilterState((prev: any) => ({ ...prev, [name]: value }))
        getStudentHolidayApiCall({ [name]: value })
    }

    const debounceFun = useCallback(debounce(function (value: string) {
        getStudentHolidayApiCall({ "searchString": value });
    }, 200), [getHolidayDetailsListResp]);

    const searchHandler = (event: any) => {
        const { name, value } = event.target;
        paginationRef.current.pageNo = 0;
        setStuHolidayFilterState((prev: any) => ({ ...prev, [name]: value }))
        debounceFun(value)
    }

    const studentHolidayRef = useRef<any>({
        prevHolidayDetailsErrResp: holidayDetailsErrResp,
        prevBranchClassResp: branchClassResp,
    });

    useEffect(() => {
        const { prevHolidayDetailsErrResp } = studentHolidayRef.current;
        if (holidayDetailsErrResp && holidayDetailsErrResp !== prevHolidayDetailsErrResp) {
            const { details } = holidayDetailsErrResp || {}
            toast.error(details || "Something went wrong")
        }
        studentHolidayRef.current.prevHolidayDetailsErrResp = holidayDetailsErrResp;
    }, [branchClassResp, holidayDetailsErrResp]);

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        getStudentHolidayApiCall(paginationInfo)
    }

    function confirmModalHndlr() {
        const { modalData: holidayId } = confirmHolidayModalState;
        dispatch(deleteHolidayAct(generateActionPayload('delete_holiday', { holidayId })))
    }

    function advanceFilterCallbckHndlr(appliedFitler: any) {
        paginationRef.current.pageNo = 0;
        advanceFilterRef.current = appliedFitler;
        getStudentHolidayApiCall()
    }

    function clearFilterHandler() {
        paginationRef.current.pageNo = 0;
        dispatch(setBrchClassAct(undefined))
        const { academicYearId, startDate = '', endDate = '' } = academicYearList.find((year: any) => year.yearStatus === "CURRENT") || {};
        const resetFilterState = { ...initialValues, academicYearId };
        setStuHolidayFilterState(resetFilterState);
        advanceFilterRef.current = { ...advanceFilterRef.current, startDate: '', endDate: '', minDate: startDate, maxDate: endDate }
        getStudentHolidayApiCall(resetFilterState);
    }

    function confirmExportModalHndlr() {
        const payload = {
            branchId,
            ...stuHolidayFilterState,
            startDate: advanceFilterRef.current.startDate,
            endDate: advanceFilterRef.current.endDate,
        };
        dispatch(exportHolidayAct(generateActionPayload('export_holidays', undefined, payload, {
            responseType: 'blob'
        })))
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { content: holidayList, totalElements, totalPages, pageble } = getHolidayDetailsListResp || {};
    const holidayDetailsColumn = useMemo(() => generateColumns(menuOptions), [getHolidayDetailsListResp]);
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Student Attendance" />

                    <div className="card">
                        <div className="card-header tw-py-2">
                            <div className="tw-flex tw-items-center">
                                <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">
                                    Student Holiday Details
                                </h4>

                                <div className="tw-flex tw-gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={toggleAddStuLongLeaveModal}
                                    >
                                        <i className="ri-add-line tw-me-2" />
                                        Add New
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="info"
                                        onClick={openExportHolidayModalHnldr}
                                    >
                                        <div className="tw-flex tw-items-center">
                                            <i className="ri-add-line tw-me-1" />
                                            Export
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div
                                className="
            tw-grid tw-gap-3 tw-items-end
            tw-grid-cols-1
            md:tw-grid-cols-2
            lg:tw-grid-cols-4
            xl:tw-grid-cols-6
          "
                            >
                                <div className="xl:tw-col-span-2 tw-relative search-box">
                                    <TextInput
                                        name="searchString"
                                        value={stuHolidayFilterState.searchString}
                                        onChange={searchHandler}
                                        inputClassName="bg-soft-light"
                                        formgroupClassName="tw-mb-0"
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                    />
                                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2" />
                                </div>

                                <SelectInput
                                    name="academicYearId"
                                    value={stuHolidayFilterState.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Academic Year"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="curriculumId"
                                    value={stuHolidayFilterState.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Curriculum"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="classIds"
                                    value={stuHolidayFilterState.classIds}
                                    onChange={filterHandler}
                                    menuItems={classTypes || []}
                                    valueKey="id"
                                    textKey="shortName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Class"
                                    floatingLabel
                                />

                                <div className="tw-flex tw-items-center tw-relative">
                                    <div
                                        onClick={openAdvanceFilterHndlr}
                                        title="Filters"
                                        className="tw-bg-[#F4F7FA] tw-p-2 tw-cursor-pointer tw-flex tw-items-center tw-rounded"
                                    >
                                        <FilterSvg height="18px" width="18px" />
                                        <span className="tw-ms-2">Filters</span>
                                    </div>

                                    {!!helperState.advanceFilterCount && (
                                        <span
                                            className="
                  tw-absolute -tw-top-2 tw-left-16
                  tw-bg-[#0ab39c] tw-text-white
                  tw-rounded-full tw-px-2 tw-text-xs
                "
                                        >
                                            {helperState.advanceFilterCount}
                                        </span>
                                    )}
                                </div>

                                {helperState.showClearFilter && (
                                    <div className="tw-flex tw-justify-end">
                                        <Button
                                            type="button"
                                            onClick={clearFilterHandler}
                                            variant="wrong"
                                        >
                                            Clear filter
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <TableContainer
                            columns={holidayDetailsColumn}
                            data={holidayList || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={paginationRef.current.pageNo}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="student-holiday-details-modal"
                isOpen={addStuLongLeaveModal.showModal}
                toggle={toggleAddStuLongLeaveModal}
                modalTitle={`${addStuLongLeaveModal.holidayDetailId ? 'Update' : 'Add'} Holiday Details`}
                modalSize="md"
            >
                <AddStudentHolidayDetails
                    isOpen={addStuLongLeaveModal.showModal}
                    toggle={toggleAddStuLongLeaveModal}
                    holidayId={addStuLongLeaveModal.holidayDetailId}
                    holidayInfo={addStuLongLeaveModal.modalInfo}
                    academicYearId={stuHolidayFilterState?.academicYearId}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-holidaydetails"
                isOpen={confirmHolidayModalState.showModal}
                confirmMessage="You want to delete student holiday details?"
                cancelHndlr={closeConfirmHolidayModalHnldr}
                confirmHndlr={confirmModalHndlr}
                isDisble={showApiLoader}
                iconType='reject'
                btnClassName='btn w-sm btn-danger'
            />

            <ConfirmationModal
                id="export-holidaydetails"
                isOpen={exportHolidayModalState.showModal}
                confirmMessage="You want to export student holiday details?"
                cancelHndlr={closeExportHolidayModalHnldr}
                confirmHndlr={confirmExportModalHndlr}
                isDisble={showApiLoader}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
            <OffCanvasContainer
                id="advance-filters"
                isOpen={advanceFilterModalState.showModal}
                closeHndlr={closeAdvanceFilterHndlr}
                headerTitle='Advance Filters'
            >
                <AdvanceFilter
                    toggleModal={closeAdvanceFilterHndlr}
                    showApiLoader={showApiLoader}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    appliedFilters={advanceFilterRef.current}
                />
            </OffCanvasContainer>

        </>
    );
};

export default StudentConcessions;
