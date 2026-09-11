
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import Button from "../../../../Components/Common/Button";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
    generateColumns
} from "./helper";
import { useHistory } from "react-router-dom";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {  getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import AgeCriteriaModal from "./AgeCriteriaModal";
import { ageCriteriaListAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
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

    const [generateAgeCriteriaModalState, setGenerateAgeCriteriaModalState] = useState<any>({
        showModal: false,
        editData: undefined,
        recordId : undefined,
    })
    const [ageCriteriaFilterState, setAgeCriteriaFilterState] =
        useState<any>(initialValues);


    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        studentConcessionList,
        ledgerDetails,
        ageCriteriaListResp,
        generateAgeCriteriaResp,
        classroomManagmentErrorResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        editAgeCriteriaByIdResp,
        academicAvailabilityErrorResp,
    }: any = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, feeConcession, feeCollections, admissionAvailabilityRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            studentConcessionList: feeConcession.studentConcessionList,
            ledgerDetails: feeCollections.ledgerDetails,
            classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
            ageCriteriaListResp: admissionAvailabilityRequest.ageCriteriaListResp,
            generateAgeCriteriaResp: admissionAvailabilityRequest.generateAgeCriteriaResp,
            editAgeCriteriaByIdResp: admissionAvailabilityRequest.editAgeCriteriaByIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            academicAvailabilityErrorResp : admissionAvailabilityRequest.academicAvailabilityErrorResp,
        }),
        shallowEqual
    );

       
    const getAgeCriteria = (otherProps?: any) => {
        
        const params = { branchId: branchId, academicYearId: ageCriteriaFilterState.academicYearId, curriculumId: ageCriteriaFilterState.curriculumId, orderBy: "asc", sortBy: "className", ...pagination.current, ...otherProps }
        if(branchId && params.academicYearId){
            dispatch(ageCriteriaListAct(generateActionPayload('age_criteria_list', undefined, params)))
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
                    
                    setGenerateAgeCriteriaModalState((prev:any)=>({showModal:true,recordId:id}));
                    // moveToNewStudentConcessionHandler(id);
                },
            },
        ],
        []
    );

    const toggleAgeCriteriaModal = (apiCall?: any) => {
        // history.push("/new-student-concessions", { id: id });
        setGenerateAgeCriteriaModalState((prev: any) => ({ ...prev, showModal: !prev.showModal,recordId : null }));

        if (typeof (apiCall) && apiCall) {
            getAgeCriteria();
        }
    };

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

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
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault).academicYearId
        if (yearId) {
            getAgeCriteria({ academicYearId: yearId })
            setAgeCriteriaFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        }
        // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        
        if (Array.isArray(data) && data.length > 0) {
            // const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            // setAgeCriteriaFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
            // getAgeCriteria({curriculumId:data[0].branchCurriculumId})
        }
    }, [brchCurriculumResp])

    const AgeCriteriaRef = useRef({
        prevGenerateAgeCriteriaResp: generateAgeCriteriaResp,
        prevEditAgeCriteriaRef: editAgeCriteriaByIdResp,
        prevAcademicAvailabilityErrorRef: academicAvailabilityErrorResp,
    })
    useEffect(() => {
        const { prevGenerateAgeCriteriaResp,prevEditAgeCriteriaRef,prevAcademicAvailabilityErrorRef } = AgeCriteriaRef.current;
        if (generateAgeCriteriaResp && prevGenerateAgeCriteriaResp !== generateAgeCriteriaResp) {
            toast.success('Added Age Criteria Successfully')
            toggleAgeCriteriaModal(true);
        }
        if (editAgeCriteriaByIdResp && prevEditAgeCriteriaRef !== editAgeCriteriaByIdResp) {
            toast.success('Age Criteria Edited Successfully')
            toggleAgeCriteriaModal(true);
        }
        if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorRef !== academicAvailabilityErrorResp) {
            const { details } =academicAvailabilityErrorResp;
            toast.error(details)       
        }
        AgeCriteriaRef.current.prevGenerateAgeCriteriaResp = generateAgeCriteriaResp;
        AgeCriteriaRef.current.prevEditAgeCriteriaRef = editAgeCriteriaByIdResp;
        AgeCriteriaRef.current.prevAcademicAvailabilityErrorRef = academicAvailabilityErrorResp;

    }, [generateAgeCriteriaResp,editAgeCriteriaByIdResp,academicAvailabilityErrorResp])




    // useEffect(() => {
    //     const { content } = branchClassResp || {};
    //     if (Array.isArray(content) && content.length > 0) {
    //         // const payload = { branchId: branchId, curriculumId: branchClassResp.content[0].branchCurriculumId, pageNo: 0, pageSize: 100 };
    //         // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    //         setStudentConcessionFilterState((prev: any) => ({ ...prev, classId: content[0].id }))
    //         // StudentConcessionList(undefined, { classId: content[0].id })
    //         // getSectionListResp({branchClassId: content[0].id});
    //     }
    // }, [branchClassResp])

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setAgeCriteriaFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0
        getAgeCriteria({ [name]: value });
        if (name === 'curriculumId') {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            // getAgeCriteria({curriculumId:value})
        }

        // else if (name === 'classId') {
        //     // StudentConcessionList(undefined, { [name]: value })
        // }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getAgeCriteria(paginationInfo)
        // getSectionListResp(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    // const { data: StudentConcessionData, pageNumber } = studentConcessionList || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { ledgers: LedgerList } = ledgerDetails || {};
    const { content: ageCriteriaList,totalElements,totalPages ,pageable} = ageCriteriaListResp || {};


    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Admissions" />

                    <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm">
                        <div className="tw-p-4 tw-border-b tw-border-gray-200 tw-bg-gray-50">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-lg tw-font-medium tw-mb-0 tw-grow tw-text-gray-900">
                                        Age Criteria
                                    </h4>
                                </div>
                                <div className="tw-w-auto">
                                    <div className="tw-flex">
                                        <Button
                                            variant="primary"
                                            className="tw-flex tw-items-center"
                                            onClick={() => toggleAgeCriteriaModal()}
                                        >
                                            <i className="ri-add-line tw-mr-2" />
                                            Generate New
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            {/* <form onSubmit={StudentConcessionFilterForm.handleSubmit}> */}
                            <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4">
                                {/* <div className="tw-w-full md:tw-w-full lg:tw-w-1/3 xl:tw-w-1/4 tw-px-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="search"
                                            value={studentConcessionFilterState.search}
                                            onChange={filterHandler}
                                            inputClassName="bg-soft-light"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                        />

                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div> */}

                                <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-3">
                                    <SelectInput
                                        name="academicYearId"
                                        value={ageCriteriaFilterState.academicYearId}
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
                                        value={ageCriteriaFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        // inputClassName="bg-light border-0"
                                        formgroupClassName="tw-mb-0"
                                        defaultSelect="Curriculum"
                                    />
                                </div>

                                {/* <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-3">
                                    <SelectInput
                                        name="classId"
                                        value={ageCriteriaFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        // inputClassName="bg-light border-0"
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div> */}
                                {/* <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-3">
                    <SelectInput
                      name="type"
                      value={studentConcessionFilterState.type}
                      onChange={filterHandler}
                      menuItems={TermData}
                      valueKey="value"
                      textKey="type"
                      // inputClassName="bg-light border-0"
                      formgroupClassName="tw-mb-0"
                      defaultSelect="Type"
                    />
                  </div> */}
{/* 
                                <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-3">
                    <TextInput
                      name="dateRange"
                      value={ageCriteriaFilterState.dateRange}
                      onChange={filterHandler}
                      inputClassName="bg-light border-0"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Select date range"
                    />
                  </div> */}

                            
                            </div>
                            {/* </form> */}
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={ageCriteriaList || []}
                            divClass="table-responsive tw-mb-4"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            // showCheckbox={true}
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={ pageable?.pageNumber ||0}
                        />
                    </div>
                </div>
            </div>

            {/* <AgeCriteriaModal toggle={() => toggleAgeCriteriaModal()} /> */}
            <ModalContainerUpdated
                id="generate-age-criteria"
                isOpen={generateAgeCriteriaModalState.showModal}
                toggle={toggleAgeCriteriaModal}
                modalTitle="Generate Age Criteria"
                modalSize="lg"
            >
            <AgeCriteriaModal
                isOpen={generateAgeCriteriaModalState.showModal}
                toggle={toggleAgeCriteriaModal}
                modalTitle="Generate Age Criteria"
                editData={generateAgeCriteriaModalState.editData}
                recordId={generateAgeCriteriaModalState.recordId}
            />
            </ModalContainerUpdated>

        </>
    );
};

export default ProposedAdmission;
