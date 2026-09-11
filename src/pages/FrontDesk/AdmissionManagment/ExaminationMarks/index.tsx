import React, { useEffect, useMemo, useRef, useState } from 'react'
import {  ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import {  generateColumns, hasStateChanged } from './helper';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { exportExamMarksListAct, getExaminationMarksListAct, getStatasticResp, resetExamMarksByIdAct, resetExaminationMarksList } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { useHistory } from 'react-router-dom';
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { getEvaluationClassList, resetEvaluationClassList } from '../../../../store/FrontDesk/Interview/interviewactions';
import { setRegistrationTabIdAct } from '../../../../store/global/globalslice';
import { toast } from 'react-toastify';
import AdvanceFilterModal from './AdvanceFilterModal';
import ExportModal from '../../../Directory/StudentManagement/ExportModal';
import { downloadExcelFile } from '../../../../utility/commonutility';
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from '../../../../Components/Common/Button';


const initialValues = {
    academicYearId: "",
    search: "",
    curriculumId: "",
    classId: "",
    examStartDate:"",
    examEndDate:"",
    recommended:null,
    admissionType:null,
}

const ExaminationMarks = ({ tabId }: any) => {

    const dispatch = useAppDispatch();

    const history = useHistory();

    const [initialState, setInitialState] = useState(initialValues);
    const [open, setOpen] = useState<boolean>(false);
    const [count,setCount] = useState<any>(null);
    const examinationMarksRef = useRef({
        pageNo: 0, pageSize: 10
    })

    function paginationHndlr(paginationInfo: any) {
        examinationMarksRef.current = paginationInfo;
        ExaminationMarksList(paginationInfo);
    }

    const [showClearFilterState, setShowClearFilterState] = useState(false);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        examinationMarksListResp,
        evaluationClassList,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,exportExamMarksListResp,
    } = useAppSelector(
        ({  instAcademics,globalData, branchAcademics, appData,applicationSale, interview }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            showApiLoader: globalData.showApiLoader,
            examinationMarksListResp: applicationSale.examinationMarksListResp,
            evaluationClassList: interview.evaluationClassList,
            exportExamMarksListResp: applicationSale.exportExamMarksListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );

    const ExaminationMarksList = (otherProps?: any) => {
        const payload = { instituteId, branchId, ...initialState, ...examinationMarksRef.current, ...otherProps };
        if (payload.academicYearId ) {
            dispatch(getExaminationMarksListAct(generateActionPayload('get_examination_marks', undefined, payload)))
        }
    }

    const ObsAndIntRepRef = useRef({
        prevExportExamMarksListResp: exportExamMarksListResp,
    })

    useEffect(() => {
        const { prevExportExamMarksListResp } = ObsAndIntRepRef.current;

        if (exportExamMarksListResp && prevExportExamMarksListResp !== exportExamMarksListResp) {
            toast.success("Exam Marks Downloaded Successfully.")
            downloadExcelFile(exportExamMarksListResp,"Examination_Marks")
            toggleExportExcelModal()
        }

        ObsAndIntRepRef.current.prevExportExamMarksListResp = exportExamMarksListResp;
    }, [exportExamMarksListResp])

    const menuOptions = useMemo(
        () => [
            // {
            //     id: "view",
            //     actionIcon: <EyeSvg className="d-inline-block me-2" fill='#878A99' />,
            //     actionName: "View",
            //     onClick: () => {
            //         //   toggleHostelExitApprovalViewLedgerModal();
            //     },
            // },
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18}/>,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    let id = event.currentTarget.getAttribute('data-id');
                    if (id) {
                        dispatch(setRegistrationTabIdAct(tabId));
                        const marksEntryId = id?.split(',')[0]
                        const studentRegId = id?.split(',')[1]
                        history.push('/admission-management/examination-marks', { meId: marksEntryId, srId: studentRegId })
                        //   toggleApproveRejectModal("REJECTED",itFormId);
                    }
                },
            },
        ],
        []
    );
    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    const toggleExaminationMarks = () => {
        dispatch(setRegistrationTabIdAct(tabId));
        history.push('/admission-management/examination-marks')
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: initialState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const ChangeHandler = (event: any) => {
        const { name, value } = event.target;
        examinationMarksRef.current.pageNo = 0;
        let stateChanged = hasStateChanged({ ...initialState, [name]: value, academicYearId: "" });
        if (name === "academicYearId") {
            !(value === "") && dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId: +value, branchId })))
            getCurriculumApiCall({ [name]: value });
            dispatch(resetEvaluationClassList(undefined));
            setInitialState((prev:any) => ({ ...prev, [name]: value , classId : null ,curriculumId:""}));
            stateChanged = hasStateChanged({ ...initialState, academicYearId: "",classId : null,curriculumId:"" });
            ExaminationMarksList({ [name]: value, classId: null,curriculumId : "" });
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall({curriculumId:value,academicYearId:initialState.academicYearId});
            }
            else {
                dispatch(resetEvaluationClassList(undefined));
            }
            ExaminationMarksList({ [name]: value, classId: null });
            setInitialState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            ExaminationMarksList({ [name]: value});
            setInitialState((prevState: any) => ({ ...prevState, [name]: value }));
        }
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    }

    function getClassApiCall(otherProps?: any) {
        const payload = { academicYearId: initialState.academicYearId,branchId, curriculumId: initialState.curriculumId, evaluationCode: "EXAM", ...otherProps };
        if (payload.academicYearId && payload.curriculumId) {
            dispatch(getEvaluationClassList(generateActionPayload('get_evaluation_class_list', undefined, payload)));
        }
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetExaminationMarksList(undefined));
            dispatch(resetExamMarksByIdAct(undefined));
        }
    }, []);

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            setInitialState((prev: any) => ({ ...prev, academicYearId: yearId }))
            getCurriculumApiCall({ academicYearId : yearId });
            dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId : yearId, branchId })))
            ExaminationMarksList({ academicYearId : yearId, });
        }
    }, [academicYearListResp]);

    const [exportExcel, setExportExcel] = useState({
        showModal: false,
        scrutinyId: undefined
    })

    const toggleExportExcelModal = (id?: any) => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };

    const exportExcelHndler = ()=>{
        dispatch(exportExamMarksListAct(generateActionPayload("export_exam_marks",undefined, { ...initialState,branchId ,instituteId },{
            responseType: 'blob'
        })));
    }
    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        examinationMarksRef.current={...examinationMarksRef.current,pageNo:0}
        const stateChanged = hasStateChanged( {...initialState,...appliedFilters,academicYearId : ""});
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setInitialState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        ExaminationMarksList(appliedFilters)

    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    useEffect(() => {
        if (examinationMarksListResp) {
          setOpen(false);
        }
      }, [examinationMarksListResp])

    const clearFilterHndlr = ()=>{
        if(academicYearListResp){
            examinationMarksRef.current={...examinationMarksRef.current,pageNo:0}
            let { academicYearId="" } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            dispatch(resetEvaluationClassList(undefined));
            setInitialState({...initialValues,academicYearId})
            setCount(null)
            ExaminationMarksList({...initialValues,academicYearId})
            setShowClearFilterState(false)
        }
      }

    const { data: academicYearData } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { data: ListofExaminationMarks, totalElements, totalPages, pageSize, pageNumber } = examinationMarksListResp || {};
    return (<>
        <div className="tw-inline-block tw-w-full tw-bg-white tw-rounded-lg tw-shadow">
            <div className='tw-flex tw-items-center tw-p-2 tw-px-3 tw-border-b tw-border-gray-200'>
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Marks Entry List
                </h4>
                <div className="tw-ml-auto tw-gap-2 tw-text-center tw-flex">
                    <Button variant='primary' onClick={toggleExaminationMarks}>
                        <i className="ri-add-line" />
                        <span>Add Marks</span>
                    </Button>
                    <Button
                        variant='info'
                        onClick={toggleExportExcelModal}
                    >
                        <i className="ri-add-line" />
                        <span>Export</span>
                    </Button>
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-py-3">
                <div className="tw-col-span-12 sm:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                    <div className="tw-relative">
                        <TextInput
                            name="search"
                            value={initialState?.search}
                            onChange={ChangeHandler}
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search..."
                            labelText="Search"
                            floatingLabel
                        />
                        <i className="ri-search-line tw-absolute tw-top-1/2 tw-left-3 tw-transform tw--translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                </div>

                <div className="tw-col-span-12 sm:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="academicYearId"
                        value={initialState?.academicYearId}
                        onChange={ChangeHandler}
                        menuItems={academicYearData || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText='Academic Year'
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-12 sm:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="curriculumId"
                        value={initialState?.curriculumId}
                        onChange={ChangeHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        labelText="Curriculum"
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-12 sm:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="classId"
                        value={initialState?.classId}
                        onChange={ChangeHandler}
                        menuItems={evaluationClassList || []}
                        valueKey="branchClassId"
                        textKey="className"
                        formgroupClassName="tw-mb-0"
                        labelText="Class"
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
                    <div
                        onClick={toggleAdvanceFilter}
                        className="tw-flex tw-items-center tw-gap-2 tw-bg-[#F4F7FA] tw-p-2 tw-rounded"
                    >
                        <FilterSvg height="18px" width="18px" />
                        <span>Filters</span>
                    </div>
                    <span className="badge tw-align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                        {count}
                    </span>
                </div>

                <div className='tw-col-auto tw-ml-auto tw-flex'>
                    {showClearFilterState && (
                        <Button
                            type="button"
                            onClick={clearFilterHndlr}
                            variant='wrong'
                        >
                            Clear filter
                        </Button>
                    )}
                </div>
            </div>

            <ModalContainerUpdated
                id="examination-marks-export"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Examination Marks Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="admission"
                    subFeature="examination_marks"
                    remarksText="Enter remarks to export examination marks data?"
                />
            </ModalContainerUpdated>

            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="examination-marks-advance-filter"
            >
                <AdvanceFilterModal
                    getClassApiCall={ExaminationMarksList}
                    appliedFilter={initialState}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>

            <TableContainer
                columns={roleColumns || []}
                data={ListofExaminationMarks || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber || 0}
            />
        </div>
    </>
    );
}

export default ExaminationMarks
