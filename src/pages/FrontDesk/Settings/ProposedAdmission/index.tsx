import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { default as AllowSvg } from "../../../../assets/imagesdps/academics/AllowSvg.svg?react";
import {
    generateColumns
} from "./helper";
import { useHistory } from "react-router-dom";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { editProposedAdmissionAct, proposedAdmissionListAct } from "../../../../store/FrontDesk/AdmissionSettings/admissionsettingaction";
import { toast } from "react-toastify";


const initialValues: any = {
    search: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
};

const ProposedAdmission = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const [changesStudentModalState, setChangesStudentModalState] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const toggleChangeStudentDetailsModal = (id?: any) => {
        // history.push("/new-student-concessions", { id: id });
        // setChangesStudentModalState((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    };


    const [studentConcessionFilterState, setStudentConcessionFilterState] =
        useState<any>(initialValues);
    const [proposedAdmissions, setProposedAdmissions] = useState<any>([])

    // const StudentConcessionFilterForm = useFormik({
    //   enableReinitialize: true,
    //   initialValues: studentConcessionFilterState,
    //   onSubmit: (values) => {},
    // });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        studentConcessionList,
        ledgerDetails,
        proposedadmissionListResp,
        classroomManagmentErrorResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        editProposedAdmissionResp
    }: any = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, feeConcession, feeCollections, admissionSettingRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            studentConcessionList: feeConcession.studentConcessionList,
            ledgerDetails: feeCollections.ledgerDetails,
            classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            proposedadmissionListResp: admissionSettingRequest.proposedadmissionListResp,
            editProposedAdmissionResp: admissionSettingRequest.editProposedAdmissionResp,
        }),
        shallowEqual
    );

    const StudentConcessionList = (paramsProps?: any, otherProps?: any) => {
        const { academicYearId, curriculumId, classId, type } = studentConcessionFilterState;
        const params = { ...paramsProps, ...pagination.current }
        let payload = {
            academicYearId: studentConcessionFilterState.academicYearId || academicYearId,
            branchId,
            curriculumId: curriculumId || null,
            classId: null,
            studentName: null,
            type: null,
            pageNo:0,
            pageSize:100,
            ...otherProps
        };
        if (payload.academicYearId ) {
            dispatch(
                proposedAdmissionListAct(
                    generateActionPayload("get_proposed_admission", undefined, payload)
                )
            );
        }
    }
    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <EditSvg className="me-2 d-inline-block" fill="#405189" />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    
                    const updatedData = proposedAdmissions.map((item:any) => {
                        if (String(item?.id) === id) {
                          return { ...item, isEdit: true };
                        }else{
                            return { ...item, isEdit: false };
                        }
                      });             
                      setProposedAdmissions(updatedData)
                    // toggleChangeStudentDetailsModal(id)
                    // moveToNewStudentConcessionHandler(id);
                },
            },
            {
                id: "success",
                actionIcon: <AllowSvg className="me-2 d-inline-block" fill="#405189" style={{ width: "20px", height: "20px" }}/>,
                actionName: "Success",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    const newData = proposedAdmissions?.filter((i:any)=>{
                        return +i?.id === +id
                    })
                    
                    const params = {
                        academicYearId: studentConcessionFilterState.academicYearId,
                        curriculamId : "",
                        classId : newData[0]?.classId,
                        branchId:branchId,
                    }
                    let payload = {
                        id: newData[0]?.id,
                        // admissionAvailabilityId: newData[0]?.admissionAvailabilityId,
                        count: newData[0]?.proposedAdmissionCount,
                    };
                    
                    dispatch(
                        editProposedAdmissionAct(
                            generateActionPayload("edit_proposed_admission", payload, undefined)
                        )
                    );
                    // toggleChangeStudentDetailsModal(id)
                    // moveToNewStudentConcessionHandler(id);
                },
            },
        ],
        [proposedAdmissions]
    );


    const roleColumns = useMemo(() => generateColumns(menuOptions), [proposedAdmissions]);

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

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
        // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
        if (yearId) {

            const payload = { academicYearId: yearId, curriculumId: null, classId: null, branchId: branchId, pageNo:0,
                pageSize:100, }
            dispatch(
                proposedAdmissionListAct(
                    generateActionPayload("get_proposed_admission", undefined, payload)
                )
            );
            setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        }
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0) {
            // setStudentConcessionFilterState({curriculumId : data[0].branchCurriculumId})
            // const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            StudentConcessionList(undefined, { curriculumId: data[0].branchCurriculumId })
            setStudentConcessionFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
        }
    }, [brchCurriculumResp])

    // useEffect(() => {
    //     const { content } = branchClassResp || {};
    //     if (Array.isArray(content) && content.length > 0) {
    //         // const payload = { branchId: branchId, curriculumId: branchClassResp.content[0].branchCurriculumId, pageNo: 0, pageSize: 100 };
    //         // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    //         // setStudentConcessionFilterState((prev: any) => ({ ...prev, classId: content[0].id }))
    //         // StudentConcessionList(undefined, { classId: content[0].id })
    //         // getSectionListResp({branchClassId: content[0].id});
    //     }
    // }, [branchClassResp])

    useEffect(() => {
        if (proposedadmissionListResp) {
            const proposedadmissionListRespData = proposedadmissionListResp?.content;

            const updatedData = proposedadmissionListRespData?.map((item:any) => ({
              ...item, 
              isEdit: false, 
            }));
            setProposedAdmissions(updatedData)
        }
    }, [proposedadmissionListResp])

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))

        if (name === 'curriculumId') {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            if(value) StudentConcessionList(undefined, { curriculumId: value })
         
        }
        else if (name === 'classId') {
            StudentConcessionList(undefined, { [name]: value })
        }
    }

    const tableChangeHandler = (event: any) => {
        const id = event.currentTarget.getAttribute("data-id");
        const { value } = event.target;
        const data:any = proposedAdmissions.map((adm: any) => +adm.id === +id ? ({ ...adm, proposedAdmissionCount: value }) : adm);
        
        setProposedAdmissions(data)
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        StudentConcessionList(paginationInfo)
    }

    const ExamSubjectsRef = useRef({
        prevEditExamSubjectsRef: editProposedAdmissionResp,
    })
    useEffect(() => {
        const { prevEditExamSubjectsRef} = ExamSubjectsRef.current;
        if (editProposedAdmissionResp && prevEditExamSubjectsRef !== editProposedAdmissionResp) {
            toast.success('Proposed Admission Edited SuccessFully')
            StudentConcessionList()
        }
        ExamSubjectsRef.current.prevEditExamSubjectsRef = editProposedAdmissionResp;

    }, [editProposedAdmissionResp])

    const { data: academicYearList } = academicYearListResp || {};
    const { data: StudentConcessionData, pageNumber, totalPages, totalElements } = studentConcessionList || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { ledgers: LedgerList } = ledgerDetails || {};


    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Admissions" />

                    <div className="tw-bg-white tw-shadow tw-rounded-lg tw-mb-6">
                        <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-flex-1">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Proposed Admission / Class wise Vacancies
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            <div className="tw-flex tw-flex-wrap tw-gap-3">
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <SelectInput
                                        name="academicYearId"
                                        value={studentConcessionFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        isDisabled={true}
                                        defaultSelect="2022-23"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <SelectInput
                                        name="curriculumId"
                                        value={studentConcessionFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        defaultSelect="Curriculum"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={proposedAdmissions || []}
                            divClass="table-responsive tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            // showCheckbox={true}
                            // showPagination={true}
                            // totalPages={0}
                            // totalRecords={0}
                            // callbackPaginationHndlr={() => { }}
                            // currentPageNumber={0}
                            onChangeInputHndlr={tableChangeHandler}
                        />
                    </div>
                </div>
            </div>
            {/* <ModalContainerUpdated
                id="avc"
                isOpen={changesStudentModalState.showModal}
                toggle={toggleChangeStudentDetailsModal}
                modalTitle="Admission Availability"
                modalSize="lg"
            > */}
                {/* <AdmissionAvailabilityModal/> */}
                {/* <ChangeStudentDetailsModal toggle={toggleChangeStudentDetailsModal}/> */}
            {/* </ModalContainerUpdated> */}

        </>
    );
};

export default ProposedAdmission;
