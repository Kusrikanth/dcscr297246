import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import Button from "../../../../Components/Common/Button";
import { useHistory } from "react-router-dom";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { getEvaluationProcessList } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { toast } from "react-toastify";


const initialValues: any = {
    search: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
};

const AdmissionWithdrawalSetting = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const [changesEvaluationProcessState, setChangesEvaluationProcessState] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const toggleChangeEvaluationProcessModal = (id?: any) => {
        // history.push("/new-student-concessions", { id: id });
        setChangesEvaluationProcessState((prev: any) => ({ ...prev, showModal: !prev.showModal,applicationId : null }))
    };

    const EvaluationProcessList = (paramsProps?: any, otherProps?: any) => {
        const { academicYearId, curriculumId, classId, type } = studentConcessionFilterState;
        const params = { ...paramsProps, ...pagination.current }
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            classId: "",
            sortBy: "",
            orderBy : "",
            ...pagination.current,
            ...otherProps
        };
       if(payload.academicYearId && payload.curriculumId ){
           dispatch(getEvaluationProcessList(generateActionPayload('evaluation_process_list', undefined, payload)))
       }
    }

    const [studentConcessionFilterState, setStudentConcessionFilterState] =
        useState<any>(initialValues);



    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getEvaluationProcessListResp,
        addEvaluationProcessResp,
        editEvaluationProcessByIdResp
    }: any = useAppSelector(
        ({ admissionAvailabilityRequest,classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, feeConcession, feeCollections }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getEvaluationProcessListResp:admissionAvailabilityRequest.getEvaluationProcessListResp,
            addEvaluationProcessResp:admissionAvailabilityRequest.addEvaluationProcessResp,
            editEvaluationProcessByIdResp : admissionAvailabilityRequest.editEvaluationProcessByIdResp,
        }),
        shallowEqual
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <EditSvg className="me-2 d-inline-block" fill="#405189" />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    setChangesEvaluationProcessState((prev: any) => ({ ...prev, showModal: !prev.showModal,applicationId : id }))
                    // moveToNewStudentConcessionHandler(id);
                },
            },
        ],
        []
    );

    // const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );
        const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    const AddEvaluationProcessRef = useRef({
        prevAddEvaluationProcess: addEvaluationProcessResp
    })
    useEffect(() => {
        const { prevAddEvaluationProcess } = AddEvaluationProcessRef.current;
        if (addEvaluationProcessResp && prevAddEvaluationProcess !== addEvaluationProcessResp) {
            toast.success('Evaluation Process Assign Successfully')
            toggleChangeEvaluationProcessModal(true);
            EvaluationProcessList()
        }
        AddEvaluationProcessRef.current.prevAddEvaluationProcess = addEvaluationProcessResp;

    }, [addEvaluationProcessResp])


    const EditEvaluationProcessRef = useRef({
        prevEditEvaluationProcessRef: editEvaluationProcessByIdResp
    })
    useEffect(() => {
        const { prevEditEvaluationProcessRef } = EditEvaluationProcessRef.current;
        if (editEvaluationProcessByIdResp && prevEditEvaluationProcessRef !== editEvaluationProcessByIdResp) {
            toast.success('Evaluation Process Edit Successfully')
            toggleChangeEvaluationProcessModal(true);
            EvaluationProcessList()
        }
        EditEvaluationProcessRef.current.prevEditEvaluationProcessRef = editEvaluationProcessByIdResp;

    }, [editEvaluationProcessByIdResp])

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current").academicYearId
        // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
        setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0) {
            const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            setStudentConcessionFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
            EvaluationProcessList(undefined, { curriculumId: data[0].branchCurriculumId })
        }
    }, [brchCurriculumResp])
    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {
            // const payload = { branchId: branchId, curriculumId: branchClassResp.content[0].branchCurriculumId, pageNo: 0, pageSize: 100 };
            // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            setStudentConcessionFilterState((prev: any) => ({ ...prev, classId: content[0].id }))
            // EvaluationProcessList(undefined, { classId: content[0].id })
            // getSectionListResp({branchClassId: content[0].id});
        }
    }, [branchClassResp])

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
        if (name === 'curriculumId') {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            EvaluationProcessList(undefined, { curriculumId: value })
        }
        else if (name === 'classId') {
            EvaluationProcessList(undefined, { [name]: value })
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        EvaluationProcessList(paginationInfo)
        // getSectionListResp(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { content: EvaluationProcessData, pageble, totalPages, totalElements } = getEvaluationProcessListResp || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    // const { ledgers: LedgerList } = ledgerDetails || {};


    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Fee" />

                    <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm">
                        <div className="tw-p-4 tw-border-b tw-border-gray-200 tw-bg-gray-50">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-lg tw-font-medium tw-mb-0 tw-grow tw-text-gray-900">
                                        Evaluation Process
                                    </h4>
                                </div>
                                <div className="tw-w-auto">
                                    <div className="tw-flex">
                                        <Button
                                            variant="primary"
                                            onClick={() => {toggleChangeEvaluationProcessModal()}}
                                        >
                                            <i className="ri-add-line tw-mr-2" />
                                            Add New
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            {/* <form onSubmit={StudentConcessionFilterForm.handleSubmit}> */}
                            <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4">
                               

                                <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-3">
                                    <SelectInput
                                        name="academicYearId"
                                        value={studentConcessionFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        // inputClassName="border-0"
                                        formgroupClassName="tw-mb-0"
                                        // isDisabled={true}
                                        defaultSelect="2022-23"
                                    />
                                </div>

                                <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-3">
                                    <SelectInput
                                        name="curriculumId"
                                        value={studentConcessionFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        // inputClassName="bg-light border-0"
                                        formgroupClassName="tw-mb-0"
                                        defaultSelect="Curriculum"
                                    />
                                </div>

                            </div>
                            {/* </form> */}
                        </div>

                  
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="avc"
                isOpen={changesEvaluationProcessState.showModal}
                toggle={toggleChangeEvaluationProcessModal}
                modalTitle="Evaluation Process"
                modalSize="lg"
            >
                {/* <EvaluationProcessModal modalId={changesEvaluationProcessState.applicationId}/> */}
                {/* <ExamSubjectsModal toggle={toggleChangeEvaluationProcessModal}/> */}
            </ModalContainerUpdated>

        </>
    );
};

export default AdmissionWithdrawalSetting;
