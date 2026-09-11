import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {  MultiSelect, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { exportChangeStudentListAct } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { feeCollectionData,  generateColumns, generateColumnsForFeeCollection } from "./helper";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { getFeeSumAmountListAct, getFeeTypeWiseListAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { resetFeeSumAmountListAct, resetFeeTypeWiseListAct } from "../../../../store/FrontDesk/Reports/reportsslice";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";

const initialValues: any = {
    academicYearId: "",
    curriculumId: "",
    classId: [],
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is Required").nullable(),
    curriculumId: Yup.string().required("Curriculum is Required").nullable(),
})

const AdmissionReports = () => {
    const history = useHistory();

    const dispatch = useDispatch();
    const [open, setOpen] = useState<boolean>(false);

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const [changesStudentModalState, setChangesStudentModalState] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const toggleChangeStudentDetailsModal = (id?: any) => {
        // history.push("/student-concessions/create-concession", { id: id });
        setChangesStudentModalState((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    };

    const StudentConcessionList = (paramsProps?: any, otherProps?: any) => {
        const { academicYearId, curriculumId, type } = feeReportState;
        const params = { ...paramsProps, ...pagination.current }
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId: "",
            searchString: "",
            ...otherProps,
            ...params
        };
        if (payload.academicYearId) {
            // dispatch(getAllChangeStudentsListAct(generateActionPayload('get_all_change_student_list', params, payload)))
        }
    }

    const [feeReportState, setFeeReportState] =
        useState<any>(initialValues);
    const [feeSumAmountState, setFeeSumAmountState] = useState<any>(null)
    const [feeTypeWiseSum, setFeeTypeWiseSum] = useState<any>([])



    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        ledgerDetails,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getAllChangeStudentsListActResp,
        saveChangeStudentDetailsResp,
        applicationSaleError,
        showApiLoader, exportChangeStudentListResp,
        getFeeSumAmountListResp,
        getFeeTypeWiseListResp,
    }: any = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, feeConcession, feeCollections, reports }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getAllChangeStudentsListActResp: applicationSale.getAllChangeStudentsListActResp,
            saveChangeStudentDetailsResp: applicationSale.saveChangeStudentDetailsResp,
            applicationSaleError: applicationSale.applicationSaleError,
            showApiLoader: globalData.showApiLoader,
            exportChangeStudentListResp: applicationSale.exportChangeStudentListResp,
            getFeeSumAmountListResp: reports.getFeeSumAmountListResp,
            getFeeTypeWiseListResp: reports.getFeeTypeWiseListResp,
        }),
        shallowEqual
    );

    const FeeReportFilterForm = useFormik({
        initialValues: feeReportState,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {

            const payload = {
                branchId,
                academicYearId: values.academicYearId,
                curriculumId: values.curriculumId,
                classIds: Array.isArray(values.classId) ? values?.classId?.map((item: any) => item?.id).join(',') : ""
            }
            dispatch(getFeeSumAmountListAct(generateActionPayload("get_fee_sum_amount", undefined, payload)));
            dispatch(getFeeTypeWiseListAct(generateActionPayload("get_fee_type_wise_sum", undefined, payload)));
        },
    });

    useEffect(() => {
        if (getFeeSumAmountListResp) {
            const cashPayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "cash")
            const chequePayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "cheque")
            const onlinePayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "online")
            const cardPayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "card_payment")
            const onlinePGPayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "online_pg")
            const upiPayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "upi")
            const jodoPayPayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "jodo_pay")
            const jodoQRPayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "jodo_qr")
            const jodoFlexPayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "jodo_flex")
            const jodoCredPayment = getFeeSumAmountListResp?.find((i: any) => i?.paymentMode?.toLowerCase() === "jodo_cred")

            setFeeSumAmountState((prev: any) => ({
                ...prev,
                cashPayment: cashPayment?.sumOfPaidAmounts || 0.00,
                chequePayment: chequePayment?.sumOfPaidAmounts || 0.00,
                onlinePayment: onlinePayment?.sumOfPaidAmounts || 0.00,
                cardPayment: cardPayment?.sumOfPaidAmounts || 0.00,
                onlinePGPayment: onlinePGPayment?.sumOfPaidAmounts || 0.00,
                upiPayment: upiPayment?.sumOfPaidAmounts || 0.00,
                jodoPayPayment: jodoPayPayment?.sumOfPaidAmounts || 0.00,
                jodoQRPayment: jodoQRPayment?.sumOfPaidAmounts || 0.00,
                jodoFlexPayment: jodoFlexPayment?.sumOfPaidAmounts,
                jodoCredPayment: jodoCredPayment?.sumOfPaidAmounts
            }))
        }
    }, [getFeeSumAmountListResp])

    useEffect(() => {
        if (getFeeTypeWiseListResp) {
            const array: any = [];
            getFeeTypeWiseListResp?.map((item: any) => {
                if (!(array?.includes(item?.feeDetails))) {
                    array.push(item?.feeDetails)
                }
            })
            const newArray = array?.map((item: any) => {
                const abc: any = [];
                getFeeTypeWiseListResp?.map((i: any) => {
                    if (i?.feeDetails === item) {
                        return abc.push(i)
                    }
                })
                const resultObject = abc?.reduce((acc: any, obj: any) => {
                    const key = `${obj.paymentMode?.toLowerCase()}`;
                    acc[key] = obj.sumOfAmountsPaid;
                    return acc;
                }, {});
                return { feeDetails: item, ...resultObject }
            })
            setFeeTypeWiseSum(newArray)
        }
    }, [getFeeTypeWiseListResp])



    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <EditSvg className="me-2 d-inline-block" color="#878A99" />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");

                    // moveToNewStudentConcessionHandler(id);
                },
            },
        ],
        []
    );

    const feeTypeWiseroleColumns = useMemo(() => generateColumns(menuOptions), []);

    const feeCollectionReportColumns = useMemo(() => generateColumnsForFeeCollection(), [])

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
            dispatch(resetFeeTypeWiseListAct(undefined));
            dispatch(resetFeeSumAmountListAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
        // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
        setFeeReportState((prev: any) => ({ ...prev, academicYearId: yearId }))
        StudentConcessionList(undefined, { academicYearId: yearId })
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};

        if (Array.isArray(data) && data.length > 0) {
            // const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            // setFeeReportState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
            // StudentConcessionList(undefined, { curriculumId: data[0].branchCurriculumId })
        }
    }, [brchCurriculumResp])
    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {
            // const payload = { branchId: branchId, curriculumId: branchClassResp.content[0].branchCurriculumId, pageNo: 0, pageSize: 100 };
            // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            setFeeReportState((prev: any) => ({ ...prev, classId: content[0].id }))
            // getSectionListResp({branchClassId: content[0].id});
        }
    }, [branchClassResp])

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setFeeReportState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0;
        if (name === 'curriculumId') {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            StudentConcessionList(undefined, { [name]: value })
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
        else {
            StudentConcessionList(undefined, { [name]: value })
        }
    }

    function downloadExcelFile(blobStream: any) {

        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Student_Change_Details.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const changeStudentDetailRef = useRef<any>({
        prevExportChangeStudentListResp: exportChangeStudentListResp,
    });

    useEffect(() => {
        const { prevExportChangeStudentListResp } = changeStudentDetailRef.current;

        if (exportChangeStudentListResp && exportChangeStudentListResp !== prevExportChangeStudentListResp) {
            toast.success("Change Student List Download Successfully.");
            downloadExcelFile(exportChangeStudentListResp)
            toggleExportExcelModal();
        }
        changeStudentDetailRef.current.prevExportChangeStudentListResp = exportChangeStudentListResp;
    }, [exportChangeStudentListResp]);

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        StudentConcessionList(paginationInfo)
        // getSectionListResp(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: studentResp, totalElements, totalPages, pageble } = getAllChangeStudentsListActResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { ledgers: LedgerList } = ledgerDetails || {};

    const ChangeStudentDetail = useRef({
        prevAddChangeStudentDetail: saveChangeStudentDetailsResp,
        prevApplicationSaleError: applicationSaleError,
    })
    useEffect(() => {
        const { prevAddChangeStudentDetail, prevApplicationSaleError } = ChangeStudentDetail.current;
        if (saveChangeStudentDetailsResp && prevAddChangeStudentDetail !== saveChangeStudentDetailsResp) {
            toast.success('Student Change Successfully')
            toggleChangeStudentDetailsModal(true);
            StudentConcessionList()
        }
        if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
            const { details } = applicationSaleError;
            toast.error(details)

        }
        ChangeStudentDetail.current.prevAddChangeStudentDetail = saveChangeStudentDetailsResp;
        ChangeStudentDetail.current.prevApplicationSaleError = applicationSaleError;

    }, [saveChangeStudentDetailsResp, applicationSaleError])

    const [exportExcel, setExportExcel] = useState<any>({
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


    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        pagination.current = { ...pagination.current, pageNo: 0 }

        feeReportState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        StudentConcessionList(appliedFilters)
    }

    const exportExcelHndler = () => {
        dispatch(exportChangeStudentListAct(generateActionPayload("export_change_student_list", undefined, { ...feeReportState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Fee" />

                    <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-mb-6">
                        <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200 tw-bg-gray-50">
                            <div className="tw-flex tw-items-center tw-flex-wrap">
                                <div className="tw-w-1/2 tw-px-3">
                                    <h4 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-0 tw-grow">
                                        Fee Reports
                                    </h4>
                                </div>

                            </div>
                        </div>

                        <div className="tw-p-6">
                            {/* <form onSubmit={FeeReportFilterForm.handleSubmit}> */}
                            <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4">
                                {/* <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/4 tw-px-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={feeReportState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="bg-soft-light"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                        />

                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div> */}

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-3">
                                    <SelectInput
                                        name="academicYearId"
                                        value={feeReportState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        // inputClassName="border-0"
                                        invalid={(FeeReportFilterForm.touched.academicYearId && FeeReportFilterForm.errors.academicYearId) ? true : false}
                                        error={(FeeReportFilterForm.touched.academicYearId && FeeReportFilterForm.errors.academicYearId) ? FeeReportFilterForm.errors.academicYearId : ""}
                                        formgroupClassName="tw-mb-0"
                                        defaultSelect="Academic Year"
                                    />
                                </div>

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-3">
                                    <SelectInput
                                        name="curriculumId"
                                        value={feeReportState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        invalid={(FeeReportFilterForm.touched.curriculumId && FeeReportFilterForm.errors.curriculumId) ? true : false}
                                        error={(FeeReportFilterForm.touched.curriculumId && FeeReportFilterForm.errors.curriculumId) ? FeeReportFilterForm.errors.curriculumId : ""}
                                        // inputClassName="bg-light border-0"
                                        formgroupClassName="tw-mb-0"
                                        defaultSelect="Curriculum"
                                    />
                                </div>

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/3 tw-px-3">

                                    <MultiSelect
                                        name="classId"
                                        // labelText="Fee Category"
                                        onChange={(event: any) => {
                                            setFeeReportState((prev: any) => ({ ...prev, classId: event }))
                                        }}

                                        value={feeReportState.classId}
                                        menuItems={classTypes || []}
                                        // onBlur={handleBlur}
                                        // formgroupClassName="tw-mb-0"
                                        valueKey="id"
                                        textKey="shortName"
                                    // isDisabled={props.feeConcessionId}
                                    // error={(addFeeConcessionForm.touched.feeCategoriesId && addFeeConcessionForm.errors.feeCategoriesId) ? addFeeConcessionForm.errors.feeCategoriesId : ""}
                                    />
                                </div>

                                <div className="tw-w-auto tw-ml-auto tw-flex tw-px-3">

                                    <div
                                        style={{
                                            backgroundColor: "#F4F7FA",
                                            height: "2.5rem"
                                        }}
                                        onClick={toggleAdvanceFilter}
                                        className="tw-p-2 tw-rounded-md tw-flex tw-cursor-pointer tw-items-center tw-mr-3 tw-border tw-border-transparent"
                                    >
                                        <FilterSvg height={"18px"} width={"18px"} />
                                        <span className='tw-ml-2'>Filters</span>
                                    </div>


                                    <Button style={{ height: "2.5rem" }}
                                        variant="primary"
                                        onClick={(event: any) => FeeReportFilterForm.handleSubmit(event)} >

                                        Get Report
                                    </Button>

                                </div>
                            </div>
                            {/* </form> */}
                            <div className="tw-flex tw-flex-wrap tw--mx-2 tw-gap-y-4 tw-mt-4">

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>Cash</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.cashPayment)}</div>
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>Cheque</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.chequePayment)}</div>
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>Online</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.onlinePayment)}</div>
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>Card Payment</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.cardPayment)}</div>
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>Online PG</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.onlinePGPayment)}</div>
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>UPI</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.upiPayment)}</div>
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>JODO PAY</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.jodoPayPayment)}</div>
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>JODO QR</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.jodoQRPayment)}</div>
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>JODO FLEX</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.jodoFlexPayment)}</div>
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/4 tw-px-2">
                                    <div className="tw-border tw-border-gray-800 tw-rounded tw-flex tw-flex-col tw-justify-center tw-items-center" style={{ height: "8rem" }}>
                                        <div>JODO CRED</div>
                                        <div>₹ {getAmountValueWithDecimal(feeSumAmountState?.jodoCredPayment)}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="tw-flex tw-items-center tw-flex-wrap" style={{ margin: "0 0 1.5rem 0.2rem" }}>
                            <div className="tw-w-1/2 tw-px-3">
                                <h4 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-grow">
                                    Fee Type Wise Summary
                                </h4>
                            </div>

                        </div>
                        <TableContainer
                            columns={feeTypeWiseroleColumns || []}
                            data={feeTypeWiseSum || []}
                            divClass="table-responsive tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            // showCheckbox={true}
                            showPagination={false}
                        // totalPages={totalPages || 0}
                        // totalRecords={totalElements || 0}
                        // callbackPaginationHndlr={paginationHndlr}
                        // currentPageNumber={pageble?.pageNumber || 0}
                        />
                        <div className="tw-flex tw-items-center tw-flex-wrap" style={{ margin: "1.5rem 0 0.5rem 0.2rem" }}>
                            <div className="tw-w-1/2 tw-px-3">
                                <h4 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-grow">
                                    Fee Collection Report
                                </h4>
                            </div>

                        </div>
                        <div className="tw-flex tw-flex-wrap tw-gap-y-4 tw--mx-3 tw-p-3">
                            <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/4 tw-px-3">
                                <div className="tw-relative">
                                    <TextInput
                                        name="searchString"
                                        value={feeReportState.searchString}
                                        onChange={filterHandler}
                                        inputClassName="tw-bg-gray-50"
                                        formgroupClassName="tw-mb-0"
                                        placeHolder="Search..."
                                    />

                                    <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400"></i>
                                </div>
                            </div>

                            <div className="tw-w-auto tw-ml-auto tw-flex tw-px-3">

                                <Button variant="info" onClick={toggleExportExcelModal} >
                                    <i className="ri-add-line tw-mr-2" />
                                    Export
                                </Button>

                            </div>
                        </div>
                        <OffCanvasContainer
                            isOpen={open}
                            headerTitle="Advance Filters"
                            closeHndlr={toggleAdvanceFilter}
                            id="feereceipt-advance-filter"
                        >
                            <AdvanceFilterModal
                                getClassApiCall={StudentConcessionList}
                                appliedFilter={feeReportState}
                                applyFilterCallback={advanceFilterCallbckHndlr}
                                toggleAdvanceFilter={toggleAdvanceFilter}
                                isOpen={open}
                            />

                        </OffCanvasContainer>
                        <TableContainer
                            columns={feeCollectionReportColumns || []}
                            data={feeCollectionData || []}
                            divClass="table-responsive tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            // showCheckbox={true}
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>


        </>
    );
};

export default AdmissionReports;
