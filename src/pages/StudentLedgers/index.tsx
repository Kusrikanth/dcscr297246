import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, ConfirmationModal, SelectInput, TextInput } from "../../Components/Common";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import {
    generateColumns, getAppliedFiltersInfo, initialValues,
} from "./helper";
import { StudentConcessionFilterhProps } from "./FeeSummaryTypes";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, getBrchSectionByClassAct, resetBrchClassAct, resetBrchCurriculumAct, resetBrchSectionByClassAct, setBrchClassAct, setBrchCurriculumAct, setBrchSectionByClassAct } from "../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { default as ViewLedger } from "../../assets/imagesdps/academics/ViewLedger.svg?react";
import { createCredentialsAct, exportFeeSummaryAct, getFeeSummaryListAct, getLedgerDetailsAct } from "../../store/fee/feecollections/feecollectionactions";
import { IPaginationState } from "../../Components/Common/Pagination";
import { default as EyeSvg } from "../../assets/imagesdps/academics/EyeSvg.svg?react";
import { toast } from "react-toastify";
// import FeeSummary from "../../Dashboard/FeeSummary";


const FeeSummary = () => {
    const history = useHistory();
    const [feeSummuryListState, setFeeSummuryListState] = useState<any>([])
    const dispatch = useAppDispatch();

    const [studentConcessionFilterState, setStudentConcessionFilterState] =
        useState<StudentConcessionFilterhProps>(initialValues);

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10,

    })
    const sorting = useRef({
        orderBy: "asc",
        sortBy: "name"
    })
    const currentAcademicYearId = useRef<string | undefined>();
    const [appliedFilterState, setAppliedFilterState] = useState({
        canClearFilter: false
    })

    const feeSummaryListApiCall = (otherProps?: any) => {
        let filterPayload = {
            branchId: branchId, searchString: studentConcessionFilterState.searchString, academicYearId: studentConcessionFilterState.academicYearId, curriculumId: studentConcessionFilterState.curriculumId, classId: studentConcessionFilterState.classId,
            sectionId: studentConcessionFilterState.sectionId,
            ...otherProps
        };
        setAppliedFilterState(prevState => ({ ...prevState, ...getAppliedFiltersInfo(filterPayload, currentAcademicYearId.current) }))
        dispatch(getFeeSummaryListAct(generateActionPayload('fee_summary_list', undefined, {
            ...filterPayload, ...pagination.current, ...sorting.current
        })));
    }
    // const StudentConcessionFilterForm = useFormik({
    //   enableReinitialize: true,
    //   initialValues: studentConcessionFilterState,
    //   onSubmit: (values) => {},
    // });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        feeSummaryList,
        ledgerDetails,
        classroomManagmentErrorResp,
        currentBranchIdResp: branchId,
        createCredentialsResp,
        currentInstIdResp: instituteId,
        exportFeeSummaryResp,
        brchSectionByClassResp,
        showApiLoader,
        brchAcademicErrorResp,
        feeCollectionErrorResp
    } = useAppSelector(
        ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeCollections }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchSectionByClassResp: branchAcademics.brchSectionByClassResp,
            classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
            feeSummaryList: feeCollections.feeSummaryList,
            createCredentialsResp: feeCollections.createCredentialsResp,
            ledgerDetails: feeCollections.ledgerDetails,
            exportFeeSummaryResp: feeCollections.exportFeeSummaryResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
        }),
        shallowEqual
    );

    const feeSummaryRespRef = useRef({
        prevFeeCollectionErrorResp: feeCollectionErrorResp,
        prevBrchAcademicErrorResp: brchAcademicErrorResp
    })

    useEffect(() => {
        const { prevBrchAcademicErrorResp, prevFeeCollectionErrorResp } = feeSummaryRespRef.current;
        if (feeCollectionErrorResp && prevFeeCollectionErrorResp !== feeCollectionErrorResp) {
            const { details, message } = feeCollectionErrorResp || {};
            toast.error(details || message || 'Something went wrong.');
        }
        else if (brchAcademicErrorResp && prevBrchAcademicErrorResp !== brchAcademicErrorResp) {
            const { details, message } = brchAcademicErrorResp || {};
            toast.error(details || message || 'Something went wrong.');
        }
        feeSummaryRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
        feeSummaryRespRef.current.prevBrchAcademicErrorResp = brchAcademicErrorResp;
    }, [feeCollectionErrorResp, brchAcademicErrorResp]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: studentConcessionFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    

    useEffect(() => {
        return () => {
            dispatch(setBrchCurriculumAct(undefined));
            dispatch(setBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) =>  year.yearStatus === "CURRENT")?.academicYearId
        if (yearId) {
            currentAcademicYearId.current = yearId?.toString();
            feeSummaryListApiCall({ academicYearId: yearId });
            setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
            getCurriculumApiCall({ academicYearId: yearId })
        }
    }, [academicYearListResp]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetBrchSectionByClassAct(undefined));
            feeSummaryListApiCall({ academicYearId: value, curriculumId: "", classId: "", sectionId: "" })
            setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" }))
        }
        else if (name === 'curriculumId') {
            dispatch(setBrchClassAct(undefined));
            dispatch(resetBrchSectionByClassAct(undefined));
            if (value) {
                const payload = { branchId: branchId, curriculumId: value, academicYearId: studentConcessionFilterState.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));

            }
            feeSummaryListApiCall({ [name]: value, classId: "", sectionId: "" })
            setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
        } else if (name === 'classId') {
            dispatch(setBrchSectionByClassAct(undefined));
            if (value) {
                let payload = {
                    branchClassId: value,
                    masterAcademicYearId: studentConcessionFilterState.academicYearId,
                    curriculumId: studentConcessionFilterState.curriculumId,
                    pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc"
                }
                dispatch(getBrchSectionByClassAct(generateActionPayload("get_section_list", undefined, payload)));
            }
            feeSummaryListApiCall({ [name]: value, sectionId: "" })
            setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))
        }
        else {
            setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
            feeSummaryListApiCall({ [name]: value })
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        // setAcademicsFilterState((pre:any)=>({...pre,pageNo:paginationInfo.pageNo,pageSize:paginationInfo.pageSize}));
        feeSummaryListApiCall();
    }

    function clearFilterHndlr() {
        const payload = { ...initialValues, academicYearId: currentAcademicYearId.current };
        pagination.current.pageNo = 0;
        setStudentConcessionFilterState((prev: any) => ({
            ...prev, ...payload
        }))
        feeSummaryListApiCall(payload);
        getCurriculumApiCall({ academicYearId: currentAcademicYearId.current });
        dispatch(resetBrchClassAct(undefined));
        dispatch(resetBrchSectionByClassAct(undefined));
    }
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { data: feeSummaryData, totalPages, totalElements, pageNumber } = feeSummaryList || {};
    const feeSummaryColumns = useMemo(() => generateColumns(), [feeSummaryList]);
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Fee Summary" pageTitle="Fee" />

                    <div className="card">
                        <div className="card-header">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-grow">
                                    <h4 className="card-title tw-mb-0">
                                        Student Fee Ledger
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={studentConcessionFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-50"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                        />

                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={studentConcessionFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={studentConcessionFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        defaultSelect="Curriculum"
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={studentConcessionFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        defaultSelect="Class"
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="sectionId"
                                        value={studentConcessionFilterState.sectionId}
                                        onChange={filterHandler}
                                        menuItems={brchSectionByClassResp?.data}
                                        valueKey="sectionId"
                                        textKey="sectionName"
                                        defaultSelect="Section"
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>
                                {appliedFilterState.canClearFilter && (
                                    <div className="tw-col-span-2 tw-ml-auto tw-flex tw-items-center">
                                        <Button 
                                            variant="wrong" 
                                            onClick={clearFilterHndlr} 
                                        >
                                            Clear filter
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <TableContainer
                            columns={feeSummaryColumns}
                            data={Array.isArray(feeSummaryData) ? feeSummaryData : []}
                            divClass="table-responsive tw-mb-3"
                            theadClass="table-light tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageNumber}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeeSummary;
