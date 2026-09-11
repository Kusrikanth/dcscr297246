import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { generateColumns, hasStateChanged } from './helper';
import ObservationandInterviewerReportModal from './ObservationandInterviewerReportModal';
import { shallowEqual, useDispatch } from 'react-redux';
import { exportObsIntListAct, getObservationAndInterviewerReportAct, resetObservationInterviewSubjectsAct } from '../../../../store/FrontDesk/Interview/interviewactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getInstAcademicYearAct } from '../../../../store/mastersettings/instacademics/instacademicactions';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { useAppSelector } from '../../../../hooks/storehook';
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getStatasticResp } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { setRegistrationTabIdAct } from '../../../../store/global/globalslice';
import AdvanceFilterModal from './AdvanceFilterModal';
import ExportModal from '../../../Directory/StudentManagement/ExportModal';
import { downloadExcelFile } from '../../../../utility/commonutility';
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon} from "@hugeicons-pro/core-stroke-standard";
import Button from '../../../../Components/Common/Button';


const initalFilter = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    searchString: "",
    startDate:"",
    endDate:"",
    admissionSource: null,
}
const ObservationandInterviewerReport = ({ tabId }: any) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [observationAndInterviewerReportFilter, setObservationAndInterviewerReportFilter] = useState(initalFilter);
    const [open, setOpen] = useState<boolean>(false);
    const [count, setCount] = useState<any>(null);
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const paginationRef = useRef({ pageNo: 0, pageSize: 10 })

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,exportObsIntListResp,
        observationAndInterviewerReportResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        interviewErrorResp,showApiLoader,
    } = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo,globalData, instAcademics, branchAcademics, appData, feeConcession, feeCollections, applicationSale, interview }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            observationAndInterviewerReportResp: interview.observationAndInterviewerReportResp,
            interviewErrorResp: interview.interviewErrorResp,
            exportObsIntListResp: interview.exportObsIntListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );

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
                actionIcon:<HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18}/>,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    let id = event.currentTarget.getAttribute('data-id');
                    //   toggleApproveRejectModal("REJECTED",itFormId);
                    if (id) {
                        dispatch(setRegistrationTabIdAct(tabId));
                        history.push('/admission-management/observation-interview-report', { obsId: id })
                    }
                },
            },
            // {
            //     id: "delete",
            //     actionIcon: <DeleteSvg className="d-inline-block me-2" fill="#878A99" />,
            //     actionName: "Delete",
            //     // onClick: () => { },
            //   },
            // {
            //     id: "rescheduleExam",
            //     actionIcon: <EditSvg className="d-inline-block me-2" fill='#878A99' />,
            //     actionName: "Reschedule Exam",
            //     onClickHndlr: (event: any) => {
            //         // let itFormId = event.currentTarget.getAttribute('data-id');
            //         //   toggleApproveRejectModal("REJECTED",itFormId);
            //     },
            // },
        ],
        []
    );
    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    const [preliminaryScrutinyModal, setPreliminaryScrutinyModal] = useState({
        showModal: false,
        applicationId: undefined
    })

    const ObsAndIntRepRef = useRef({
        prevInterviewErrorResp: interviewErrorResp,
        prevExportObsIntListResp: exportObsIntListResp,
    })

    useEffect(() => {
        const { prevInterviewErrorResp,prevExportObsIntListResp } = ObsAndIntRepRef.current;

        if (exportObsIntListResp && prevExportObsIntListResp !== exportObsIntListResp) {
            toast.success("Observation Data Download Successfully.")
            downloadExcelFile(exportObsIntListResp,"Observation_Interview_Report")
            toggleExportExcelModal()
        }
        else if (interviewErrorResp && prevInterviewErrorResp !== interviewErrorResp) {

            const { details } = interviewErrorResp;
            toast.error(details)
        }
        ObsAndIntRepRef.current.prevInterviewErrorResp = interviewErrorResp;
        ObsAndIntRepRef.current.prevExportObsIntListResp = exportObsIntListResp;
    }, [interviewErrorResp,exportObsIntListResp])

    const ObservationAndInterviewerReportList = (otherProps?: any) => {
        let payload = { ...observationAndInterviewerReportFilter, ...paginationRef.current, branchId: branchId, ...otherProps,instituteId }
        dispatch(getObservationAndInterviewerReportAct(generateActionPayload('get_observation_and_interviewer_report', undefined, payload)))
    }

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : observationAndInterviewerReportFilter?.academicYearId, curriculumId: observationAndInterviewerReportFilter?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
         dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: observationAndInterviewerReportFilter.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const ChangeHandler = (event: any) => {
        const { name, value } = event.target;
        paginationRef.current.pageNo = 0;
        let stateChanged = hasStateChanged({ ...observationAndInterviewerReportFilter, [name]: value, academicYearId: "" });
        if (name === "academicYearId") {
            !(value === "") && dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId: +value, branchId })))
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            setObservationAndInterviewerReportFilter((prev:any) => ({ ...prev, [name]: value , classId : null,curriculumId:"" }));
            stateChanged = hasStateChanged({ ...observationAndInterviewerReportFilter, academicYearId: "",classId : null,curriculumId:"" });
            ObservationAndInterviewerReportList({ [name]: value, classId: null , curriculumId:"" });
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ curriculumId: value,academicYearId:observationAndInterviewerReportFilter.academicYearId});
            }
            else {
                dispatch(resetBrchClassAct(undefined));
            }
            ObservationAndInterviewerReportList({ [name]: value, classId: null  });
            setObservationAndInterviewerReportFilter((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            ObservationAndInterviewerReportList({ [name]: value, });
            setObservationAndInterviewerReportFilter((prevState: any) => ({ ...prevState, [name]: value }));
        }
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    }

    const togglePreliminaryScrutinyModal = () => {
        setPreliminaryScrutinyModal((prev: any) => ({ ...prev, showModal: !prev.showModal }));
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        ObservationAndInterviewerReportList(paginationInfo);
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetObservationInterviewSubjectsAct(undefined))
        }
    }, []);

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            setObservationAndInterviewerReportFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
            getCurriculumApiCall({ academicYearId : yearId });
            dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId : yearId, branchId })))
            ObservationAndInterviewerReportList({ academicYearId: yearId })
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
        dispatch(exportObsIntListAct(generateActionPayload("export_obs_int_list",undefined, { ...observationAndInterviewerReportFilter,branchId },{
            responseType: 'blob'
        })));
    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationRef.current={...paginationRef.current,pageNo:0}
        const stateChanged = hasStateChanged( {...observationAndInterviewerReportFilter,...appliedFilters,academicYearId : ""});
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setObservationAndInterviewerReportFilter((prevState: any) => ({ ...prevState, ...appliedFilters }));
        ObservationAndInterviewerReportList(appliedFilters)
    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    useEffect(() => {
        if (observationAndInterviewerReportResp) {
          setOpen(false);
        }
      }, [observationAndInterviewerReportResp])

      const clearFilterHndlr = ()=>{
        if(academicYearListResp){
            paginationRef.current={...paginationRef.current,pageNo:0}
            let { academicYearId="" } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            dispatch(resetBrchClassAct(undefined));
            setCount(null)
            setObservationAndInterviewerReportFilter({...initalFilter,academicYearId})
            ObservationAndInterviewerReportList({...initalFilter,academicYearId})
            setShowClearFilterState(false)
        }
      }


    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};
    const { content: ObservationAndInterviewerList, totalElements, totalPages, pageable } = observationAndInterviewerReportResp || {};

    return (<>
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-inline-block tw-w-full">
            <div className='tw-flex tw-items-center tw-p-2 tw-px-3 tw-border-b'>
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Observation and Interviewer Report
                </h4>
                <div className="tw-ml-auto tw-text-center tw-flex tw-gap-2">
                    <Button
                    variant='primary'
                        onClick={() => {
                            dispatch(setRegistrationTabIdAct(tabId));
                            history.push('/admission-management/observation-interview-report', { obsId: "" });
                        }}
                    >
                        <div className="tw-flex tw-items-center">
                            <span><i className="ri-add-line tw-mr-1" /></span>
                            <span>Add New</span>
                        </div>
                    </Button>
                    <Button
                        variant='info'
                        
                        onClick={toggleExportExcelModal}
                    >
                        <div className="tw-flex tw-items-center">
                            <span><i className="ri-add-line tw-mr-1" /></span>
                            <span>Export</span>
                        </div>
                    </Button>
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-px-3 tw-gap-3 tw-py-3">
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                    <div className="tw-relative search-box">
                        <TextInput
                            name="searchString"
                            value={observationAndInterviewerReportFilter?.searchString}
                            onChange={ChangeHandler}
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search..."
                            labelText="Search"
                            floatingLabel
                        />
                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2"></i>
                    </div>
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="academicYearId"
                        value={observationAndInterviewerReportFilter.academicYearId}
                        onChange={ChangeHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText='Academic Year'
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="curriculumId"
                        value={observationAndInterviewerReportFilter.curriculumId}
                        onChange={ChangeHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        labelText='Curriculum'
                        floatingLabel
                        formgroupClassName="tw-mb-0"
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="classId"
                        value={observationAndInterviewerReportFilter.classId}
                        onChange={ChangeHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        labelText='Class'
                        floatingLabel
                        formgroupClassName="tw-mb-0"
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

                <div className='tw-col-span-auto tw-ml-auto tw-flex'>
                    {showClearFilterState && (
                        <Button
                            type="button"
                            variant='wrong'
                            onClick={clearFilterHndlr}
                        >
                            Clear filter
                        </Button>
                    )}
                </div>
            </div>

            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="observation-advance-filter"
            >
                <AdvanceFilterModal
                    getClassApiCall={ObservationAndInterviewerReportList}
                    appliedFilter={observationAndInterviewerReportFilter}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>

            <TableContainer
                columns={roleColumns || []}
                data={ObservationAndInterviewerList || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
            />
        </div>
        {/* <ConfirmationModal
            id="observation-data-export"
            isOpen={exportExcel.showModal}
            confirmMessage="Are you sure you want Download excel file ?"
            cancelHndlr={toggleExportExcelModal}
            confirmHndlr={exportExcelHndler}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        /> */}
        <ModalContainerUpdated
             id="observation-data-export"
             isOpen={exportExcel.showModal}
            toggle={toggleExportExcelModal}
            modalTitle="Export Observation and Interviewer Report Data"
            modalSize="md"
        >
            <ExportModal
                 isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                instituteId={instituteId}
                branchId={branchId}
                submitHndlr={exportExcelHndler}
                feature="admission"
                subFeature="observation_interview_report"
                remarksText="Enter remarks to export observation and interviewer report data?"
            />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id=""
            isOpen={preliminaryScrutinyModal.showModal}
            toggle={togglePreliminaryScrutinyModal}
            modalTitle="Observation and Interviewer Report"
            modalSize="lg"
        >
            <ObservationandInterviewerReportModal toggle={togglePreliminaryScrutinyModal} />

            {/* <PreliminaryScrutinyModal toggle={togglePreliminaryScrutinyModal}/> */}
        </ModalContainerUpdated>
    </>
    );
}

export default ObservationandInterviewerReport
