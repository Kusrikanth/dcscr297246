import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    SelectInput,TextArea,TextIconInput,ModalContainerUpdated,ConfirmationModal,AutoSearchInputUpdated,MultipleFileUpload,TextInputGroup,
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import {
    concessionMode,checkDisablePreviousBtn,generateColumns,
} from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct, setBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getEmployeeByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { getStudentsListAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getLedgerDetailsAct, resetLedgerDetailsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { getAmountValueWithDecimal, percentageConverter, valueConverter } from "../../../../utility/commonutility";
import { editStuConcessionListV2Act, getStuConcessionV2ByIdAct, saveStuConcessionListV2Act } from "../../../../store/fee/feeconcessions/feeconcessionactions";
import { useHistory, useLocation } from "react-router-dom";
import { getFeeConcessionTypeListAct, getFeeTypesAct } from "../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { getSiblingForRegistrationAct } from "../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { useModal } from "../../../../hooks/modalhook";
import CheckConcessionModal from "./CheckConcessionModal";
import StudentConcessionModal from "./StudentConcessionModal";
import { setStuConcessionV2ByIdAct } from "../../../../store/fee/feeconcessions/feeconcessionslice";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    feeTypeId: "",
    academicYearId: "",
    curriculumId: "",
    studentId: "",
    siblingId: "",
    employeeId: "",
    concessionType: "",
    concessionMode: "",
    concessionValue: "",
    totalConcessionAmount: "",
    classId: "",
    document: "",
    isNoFeeSelected: "",
    remarks: "",
    subConcessionType: "",
};

const validationSchema = Yup.object().shape({
    concessionMode: Yup.string().required("Select Concession Mode").nullable(),
    concessionValue: Yup.number().min(0, 'Concession should be more than 0').required("Enter Concession Value.").when('concessionMode', {
        is: (item: any) => item === "PERCENTAGE",
        then: Yup.number().max(100, 'Concession should be less than 100').min(0, 'Concession should be more than 0').nullable(),
        otherwise: Yup.number().nullable()
    }),
    concessionType: Yup.string().required("Select Concession Type").nullable(),
    studentId: Yup.string().required("Student is required").nullable(),
    siblingId: Yup.string().nullable().when('concessionType', {
        is: (item: any) => item === "SIBLING",
        then: Yup.string().required('Sibling id is required.')
    }),
    employeeId: Yup.string().nullable().when('concessionType', {
        is: (item: any) => item === "EMPLOYEE",
        then: Yup.string().required('Employee id is required.').nullable()
    }),
    remarks: Yup.string().required("Remarks are required.").nullable(),
    document: Yup.array().test('is-files-required', 'At least one file is required', function (value) {
        if (!value || value.length === 0) {
            return false;
        }
        return true;
    }).nullable(),
})

const AddStudentConcessionV2 = () => {

    const dispatch = useAppDispatch();
    const location: any = useLocation();
    const history = useHistory();
    const [document, setDocument] = useState<any>([]);
    const [ledgerList, setLedgerList] = useState<any[]>([]);
    const [allFeeSelectedState, setAllFeeSelectedState] = useState(false);
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [siblingState, setSiblingState] = useState<any>(null);
    const [employeeState, setEmployeeState] = useState<any>(null);
    const [checkTotalConcession, setCheckTotalConcession] = useState(false);
    const [selectedFees, setSelectedFees] = useState<any[]>([]);

    const { closeModal: closeSubmitConfirmationModal, modalState: submitConfirmationModalState, openModal: openSubmitConfirmationModal } = useModal();
    const { closeModal: closeCheckConcessionModal, modalState: checkConcessionModalState, openModal: openCheckConcessionModal } = useModal();
    const { closeModal: closeStudentConcessionModal, modalState: studentConcessionModalState, openModal: openStudentConcessionModal } = useModal();

    const studentConcessionForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            let payload = {};
            const getPayload = (stu: any) => {
                return {
                    studentLedgerId: stu.id,
                    concessionValueInPerc: getAmountValueWithDecimal(percentageConverter(stu.amountToPay, values?.concessionMode, values?.concessionMode === "AMOUNT" ? (stu?.concessionAmount || 0) : values?.concessionValue)),
                    concessionAmount: Math.ceil(valueConverter((+stu.remainingAmount), values?.concessionMode, values?.concessionMode === "AMOUNT" ? (+stu?.concessionAmount || 0) : +values?.concessionValue)) || 0,
                }
            }
            if (location.state?.id) {
                payload = {
                    feeType: "TERM",
                    concessionMode: values.concessionMode,
                    concessionValue: values.concessionValue,
                    studentConcessionFeeDetailsDTO: ledgerList?.map((item: any) => ({ ...getPayload(item), isDeleted: !item?.isSelected ? true : false, })),
                    siblingId: siblingState?.studentId || "",
                    employeeId: employeeState?.id || "",
                    totalConcessionAmount: values.totalConcessionAmount,
                    remarks: values.remarks,
                    concessionType: values.concessionType,
                    subConcessionType: values.subConcessionType
                }

                if (ledgerList.length > 0 && ledgerList.some((item: any) => item?.isSelected)) {

                    if (values.concessionMode === "AMOUNT" && (+values.totalConcessionAmount !== +values.concessionValue)) {
                        openCheckConcessionModal()
                    } else {
                        openSubmitConfirmationModal(payload)
                    }
                }
                else {
                    studentConcessionForm.setFieldError('isNoFeeSelected', "*Select At least One Fee")
                }
            }
            else {
                payload = {
                    studentConcessionDTO: {
                        classId: values.classId,
                        curriculumId: values.curriculumId,
                        studentId: searchStudentState.studentId,
                        siblingId: siblingState?.studentId || "",
                        employeeId: employeeState?.id || "",
                        feeTypeId: values.feeTypeId,
                        concessionMode: values.concessionMode,
                        concessionValue: values.concessionValue
                    },
                    studentConcessionFeeDetailsDTOs: ledgerList.filter((i: any) => i?.isSelected).map(getPayload),
                    concessionType: values.concessionType,
                    subConcessionType: values.subConcessionType,
                    remarks: values.remarks,
                    totalConcessionAmount: values.totalConcessionAmount
                }

                if (ledgerList.length > 0 && ledgerList.some((item: any) => item?.isSelected)) {
                    if (values.concessionMode === "AMOUNT" && (+values.totalConcessionAmount !== +values.concessionValue)) {
                        openCheckConcessionModal()
                    } else {
                        openSubmitConfirmationModal(payload)
                    }
                }
                else {
                    studentConcessionForm.setFieldError('isNoFeeSelected', "*Select At least One Fee")
                }

            }
        },
    });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        feeTypesResp,
        ledgerDetails,
        getStuConcessionV2ByIdResp,
        editStuConcessionListV2Resp,
        studentsListResp,
        getEmployeesByFilterResp,
        feeConcessionErrorState,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        siblingsForRegistrationResp,
        saveStuConcessionListV2Resp,
        getFeeConcessionTypeListResp
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, directoryStudent, directoryEmployee, feeCollections, feeConcession, masterFeeSettings, admissionRegistration }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            ledgerDetails: feeCollections.ledgerDetails,
            getStuConcessionV2ByIdResp: feeConcession.getStuConcessionV2ByIdResp,
            editStuConcessionListV2Resp: feeConcession.editStuConcessionListV2Resp,
            saveStuConcessionListV2Resp: feeConcession.saveStuConcessionListV2Resp,
            studentsListResp: directoryStudent.studentsListResp,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            feeTypesResp: masterFeeSettings.feeTypesResp,
            feeConcessionErrorState: feeConcession.feeConcessionErrorState,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            siblingsForRegistrationResp: admissionRegistration.siblingsForRegistrationResp,
            showApiLoader: globalData.showApiLoader,
            getFeeConcessionTypeListResp: masterFeeSettings.getFeeConcessionTypeListResp,
        }),
        shallowEqual
    );

    const StudentConcessionRef = useRef({
        prevSaveStuConcessionListV2Resp: saveStuConcessionListV2Resp,
        prevEditStuConcessionListV2Resp: editStuConcessionListV2Resp,
        prevGetStuConcessionV2ByIdResp: getStuConcessionV2ByIdResp,
        prevFeeConcessionErrorState: feeConcessionErrorState
    })

     function getFeeConcessionTypeApiCall(otherProps?: any) {
            const payload = {
                branchId,
                pageNo: 0,
                pageSize: 200
            };
            dispatch(getFeeConcessionTypeListAct(generateActionPayload("get_fee_concession_type", undefined, payload)));
        }
    useEffect(() => {
        const { prevSaveStuConcessionListV2Resp, prevEditStuConcessionListV2Resp, prevGetStuConcessionV2ByIdResp, prevFeeConcessionErrorState } = StudentConcessionRef.current;
        if (getStuConcessionV2ByIdResp && feeTypesResp && getStuConcessionV2ByIdResp !== prevGetStuConcessionV2ByIdResp) {

            const { studentId, studentName, studentCode, totalConcessionAmount, curriculumId, classId, academicYearId, siblingName, siblingId, siblingCode, employeeId, employeeName, employeeCode } = getStuConcessionV2ByIdResp;
            const feeType = feeTypesResp && feeTypesResp.find((fee: any) => fee.feeType === "TERM");

            studentConcessionForm.setValues({ ...getStuConcessionV2ByIdResp, feeTypeId: feeType?.feeTypeId, document: getStuConcessionV2ByIdResp?.fileInfo?.map((i: any) => ({ ...i, name: i?.originalFileName })) });
            const payload1 = { academicYearId, branchId: branchId, curriculumId: curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload1)));
            setSearchStudentState({ studentId: studentId, studentCode: studentCode, studentName: studentName, curriculumId, classId });
            setSelectedFees(getStuConcessionV2ByIdResp?.studentLedgersIds || [])

            setDocument(getStuConcessionV2ByIdResp?.fileInfo?.map((i: any) => ({ ...i, name: i?.originalFileName })));

            fetchLedgerDetails(studentId)
            if (getStuConcessionV2ByIdResp?.concessionType === "SIBLING") {
                setSiblingState({ studentId: siblingId, studentCode: siblingCode, studentName: siblingName })
            } else if (getStuConcessionV2ByIdResp?.concessionType === "EMPLOYEE") {
                setEmployeeState({ employeeId: employeeId, employeeCode: employeeCode, employeeName: employeeName })
            }
        }
        else if (saveStuConcessionListV2Resp && saveStuConcessionListV2Resp !== prevSaveStuConcessionListV2Resp) {
            toast.success('student concession created successfully.');
            history.push("/academic-concessions");
        }
        else if (editStuConcessionListV2Resp && editStuConcessionListV2Resp !== prevEditStuConcessionListV2Resp) {
            toast.success('student concession edited successfully.');
            history.push("/academic-concessions");
        } else if (feeConcessionErrorState && feeConcessionErrorState !== prevFeeConcessionErrorState) {
            const { message, details }: any = feeConcessionErrorState;
            toast.error(message || details || "Something went wrong.");
        }
        StudentConcessionRef.current.prevSaveStuConcessionListV2Resp = saveStuConcessionListV2Resp;
        StudentConcessionRef.current.prevEditStuConcessionListV2Resp = editStuConcessionListV2Resp;
        StudentConcessionRef.current.prevGetStuConcessionV2ByIdResp = getStuConcessionV2ByIdResp;
        StudentConcessionRef.current.prevFeeConcessionErrorState = feeConcessionErrorState;
    }, [saveStuConcessionListV2Resp, editStuConcessionListV2Resp, getStuConcessionV2ByIdResp, feeTypesResp, feeConcessionErrorState])

    useEffect(() => {
        const params = { instituteId: instituteId };
        dispatch(getFeeTypesAct(generateActionPayload('get_fee_types', undefined, params)))
        getFeeConcessionTypeApiCall();
        return () => {
            dispatch(resetBrchClassAct(undefined));
            dispatch(setStuConcessionV2ByIdAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        !location.state?.StudentDetails?.academicYearId && studentConcessionForm.setFieldValue("academicYearId", yearId)
        const payload1 = { academicYearId: yearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }, [academicYearListResp]);

    useEffect(() => {
        if (branchClassResp && searchStudentState) {
            studentConcessionForm.setValues((prev: any) => ({
                ...prev,
                curriculumId: searchStudentState?.curriculumId,
                classId: searchStudentState?.classId
            }))
        }
    }, [branchClassResp])

    useEffect(() => {
        if (ledgerDetails) {
            let ledgerValue: number = getStuConcessionV2ByIdResp && location.state?.id ? +getStuConcessionV2ByIdResp?.concessionValue : 0
            let updatedLedgers = (((getStuConcessionV2ByIdResp && location.state?.id) ? getStuConcessionV2ByIdResp?.studentConcessionChildDTO : ledgerDetails.ledgers) || []).map((ledger: any) => {
                if (selectedFees.includes(+ledger.id)) {
                    if (getStuConcessionV2ByIdResp && location.state?.id) {
                        ledgerValue = +ledgerValue - (+ledger?.studentConcessionAmount || 0)
                    } else {
                        ledgerValue = +ledgerValue + (+ledger?.studentConcessionAmount || 0)
                    }
                    return { ...ledger, isSelected: selectedFees.includes(+ledger.id) ? true : false, concessionAmount: +ledger?.studentConcessionAmount || 0, remainingAmount: (getStuConcessionV2ByIdResp && location.state?.id) ? +ledger?.concessionAllocatedAmount : ((+ledger?.amountToPay - +ledger?.studentConcessionAmount) || 0) }
                } else {
                    return { ...ledger, isSelected: false, concessionAmount: +ledger?.studentConcessionAmount || 0, remainingAmount: (getStuConcessionV2ByIdResp && location.state?.id) ? +ledger?.concessionAllocatedAmount : ((+ledger?.amountToPay - (+ledger?.studentConcessionAmount + +ledger?.employeeConcessionAmount)) || 0) }
                }
            })

            setLedgerList(updatedLedgers);
            updateSelectedAllHndlr(updatedLedgers);
        }
        else {
            setLedgerList([]);
        }
    }, [ledgerDetails, selectedFees])

    useEffect(() => {
        if (location.state?.id && location.state?.fromComponent === 'Student Concession') {
            dispatch(getStuConcessionV2ByIdAct(generateActionPayload('stu_concession_v2_by_id', { concessionId: location.state?.id })))
        }
        else if (location.state?.fromComponent === "Fee Summary") {
            const payload = { academicYearId: studentConcessionForm.values.academicYearId, branchId: branchId, curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            studentConcessionForm.setValues((prev: any) => ({
                ...prev,
                'studentId': location.state?.StudentDetails?.studentDetails?.id,
                curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, classId: location.state?.StudentDetails?.studentAcademicDetails?.classId, academicYearId: location.state?.StudentDetails?.academicYearId
            }));
            setSearchStudentState({ studentId: location.state?.StudentDetails?.studentDetails?.id, studentCode: location.state?.StudentDetails?.studentDetails?.studentCode, studentName: location.state?.StudentDetails?.studentDetails?.studentName, curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, classId: location.state?.StudentDetails?.studentAcademicDetails?.classId })

            // Call Fee Types API
            dispatch(getFeeTypesAct(generateActionPayload('get_fee_types', undefined, { instituteId: instituteId })))

        }
    }, [location.state])

    useEffect(() => {
        if (feeTypesResp && location.state?.fromComponent === "Fee Summary") {
            fetchLedgerDetails(location.state?.StudentDetails?.studentDetails?.id)
        }
    }, [feeTypesResp])


    useEffect(() => {

        dispatch(resetLedgerDetailsAct(undefined));
        return () => {

            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            setSearchStudentState(null);
            studentConcessionForm.resetForm();
            dispatch(resetLedgerDetailsAct(undefined));
        }
    }, [])

    const fetchLedgerDetails = (studentId: any) => {

        let payload = {
            studentId: studentId,
            instituteId,
            branchId: branchId,
            academicYearId: studentConcessionForm.values.academicYearId,
            studentInfo: "studentInfo",
            allowStudentConcession: "",
            allowEmployeeConcession: "",
            allowRefund: "",
            feeType: [],
            instituteDeptNames : ["ACADEMICS"],
            paymentStatus: ""
        }
        dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload)));

    }

    const typesListData = useMemo(() => {
        if (Array.isArray(feeTypesResp)) {
            feeTypesResp?.map((item: any) => {
                if (item.feeType === "TERM") {
                    studentConcessionForm.setFieldValue("feeTypeId", item?.feeTypeId);
                }
            })
            return feeTypesResp.filter(item => item.feeType === "MONTH" || item.feeType === "TERM");
        }
        return [];
    }, [feeTypesResp]);

    const selectAllFeeHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        let globalConcession: number = 0
        let value: number = 0;

        setAllFeeSelectedState(checked);
        const updateSearchStudentListState: any = [...ledgerList];

        updateSearchStudentListState.forEach((item: any) => {
            let { concessionMode, concessionValue } = studentConcessionForm.values;
            if ((concessionMode === "AMOUNT") || (concessionMode === "PERCENTAGE" && +concessionValue <= 100)) {
                // concession amonut set to 0 once unchecked
                if (!item?.isSelected) { item.concessionAmount = 0 }
                item.isSelected = checked;

                if (checked) {
                    value = value + (+item?.concessionAmount || 0)
                }
            }
        });

        let totalValue = +studentConcessionForm.values.concessionValue - +value;

        const newList = updateSearchStudentListState?.map((item: any) => {
            
            let updatedItem = { ...item };

            // Apply the logic for selected items without concessionAmount
            if (item.isSelected && !item?.concessionAmount) {
                if (+item?.remainingAmount > totalValue) {
                    const newValue: any = totalValue;
                    totalValue = 0;
                    updatedItem = { ...item, concessionAmount: newValue };
                } else {
                    totalValue = totalValue - +item?.remainingAmount;
                    updatedItem = { ...item, concessionAmount: +item?.remainingAmount };
                }
            }

            // Update the globalConcession based on the same condition
            if (item.isSelected) {
                if (studentConcessionForm.values.concessionMode === "AMOUNT") {
                    globalConcession += Math.ceil(+valueConverter(
                        item?.remainingAmount,
                        studentConcessionForm.values.concessionMode,
                        updatedItem?.concessionAmount || 0
                    ));
                } else {
                    globalConcession += Math.ceil(+valueConverter(
                        item?.remainingAmount,
                        studentConcessionForm.values.concessionMode,
                        studentConcessionForm.values.concessionValue || 0
                    ));
                }
            }

            return updatedItem;
        });

        studentConcessionForm.setFieldValue('totalConcessionAmount', +globalConcession);
        setLedgerList(newList);
        setCheckTotalConcession(false)
    }, [ledgerList]);

    const studentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            studentId = event.currentTarget.getAttribute("data-id"),
            studentIndexInSearchedStudent = ledgerList.findIndex((item: any) => item.id === Number(studentId)),
            student: any = ledgerList.find((item: any) => item.id === Number(studentId))
        let updatedLegder: any[] = ledgerList;

        if (student?.isSelected) {
            let totalConcession: number = +studentConcessionForm.values.totalConcessionAmount;
            if (studentConcessionForm.values.concessionMode === "PERCENTAGE") {
                totalConcession -= Math.ceil(+valueConverter(student?.remainingAmount, studentConcessionForm.values.concessionMode, studentConcessionForm.values.concessionValue));
            } else {
                totalConcession -= Math.ceil(student?.concessionAmount || 0)
            }
            studentConcessionForm.setFieldValue('totalConcessionAmount', totalConcession);
        }
        else {
            if (!(studentConcessionForm.values.concessionMode === "PERCENTAGE")) {
                const concessionValue = +studentConcessionForm.values.concessionValue - +studentConcessionForm.values.totalConcessionAmount
                updatedLegder = updatedLegder?.map((i: any) => {
                    if (+i?.id === +studentId) {

                        if (+concessionValue <= (+i?.remainingAmount)) {
                            return {
                                ...i,
                                concessionAmount: +concessionValue
                            }
                        } else if (+concessionValue > (+i?.remainingAmount)) {
                            return {
                                ...i,
                                concessionAmount: (+i?.remainingAmount)
                            }
                        }
                    }
                    return { ...i, concessionAmount: i?.isSelected ? i?.concessionAmount : 0 }
                })
            }
        }
        if (studentIndexInSearchedStudent > -1) {
            const updatedStudentDetails: any = updatedLegder[studentIndexInSearchedStudent],
                updatedSearchStudentState: any = [...updatedLegder];
            updatedSearchStudentState.splice(studentIndexInSearchedStudent, 1, { ...updatedStudentDetails, isSelected: checked });

            let totalValue: number = 0;
            updatedSearchStudentState.map((ledger: any) => {
                if (ledger?.isSelected) {
                    if (studentConcessionForm.values.concessionMode === "PERCENTAGE") {
                        totalValue = +totalValue + Math.ceil(+valueConverter((+ledger?.remainingAmount), studentConcessionForm.values.concessionMode, +studentConcessionForm.values.concessionValue));
                    } else {
                        totalValue += Math.ceil(+ledger.concessionAmount || 0)
                    }
                }
            })

            studentConcessionForm.setFieldValue('totalConcessionAmount', +totalValue);
            setCheckTotalConcession(false)
            setLedgerList(updatedSearchStudentState);
            updateSelectedAllHndlr(updatedSearchStudentState);
        }
    }, [ledgerList, studentConcessionForm.values]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "concessionValue") {
            if (studentConcessionForm.values.concessionMode === "PERCENTAGE") {
                if (+value <= 100) {
                    studentConcessionForm.handleChange(event);
                }
            } else {
                studentConcessionForm.handleChange(event);
            }
        } else {
            studentConcessionForm.handleChange(event);
        }
        setCheckTotalConcession(false)
        if (name === 'curriculumId') {
            const payload = { academicYearId: studentConcessionForm.values.academicYearId, branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));

            setSearchStudentState({});
            dispatch(setBrchClassAct(undefined));
            setLedgerList([]);
        }
        else if (name === 'academicYearId') {
            studentConcessionForm.setValues((prev: any) => ({ ...initialValues, feeTypeId: prev?.feeTypeId, [name]: value }));
            setSearchStudentState({});
            dispatch(setBrchClassAct(undefined));
            setLedgerList([]);
            const payload1 = { academicYearId: value, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
        else if (name === "concessionMode") {
            const newLed: any[] = ledgerList.map((ledger: any) => ({ ...ledger, isSelected: false }));
            setLedgerList(newLed);
            updateSelectedAllHndlr(newLed)
            studentConcessionForm.setValues((prev: any) => ({ ...prev, [name]: value, concessionValue: "", totalConcessionAmount: "" }));
        }
        else if (name === "concessionValue") {
            let totalValue = +event.target.value;
            let newled: any;
            if (studentConcessionForm.values.concessionMode === "AMOUNT") {
                newled = ledgerList?.map((ledger: any) => {
                    if (ledger?.isSelected) {
                        if ((+ledger?.remainingAmount) <= totalValue) {
                            totalValue = totalValue - (+ledger?.remainingAmount)
                            return { ...ledger, concessionAmount: (+ledger?.remainingAmount) }
                        } else {
                            let newValue: any = totalValue
                            totalValue = 0
                            return { ...ledger, concessionAmount: newValue || 0 }
                        }
                    }
                    return { ...ledger, concessionAmount: 0, isSelected: false }
                })
            } else {
                newled = ledgerList.map((ledger: any) => ({ ...ledger, isSelected: false }));
            }
            let totalConcession: any = 0;
            newled.map((ledger: any) => {
                if (ledger?.isSelected) {
                    totalConcession += (+ledger.concessionAmount || 0)
                }
            })
            studentConcessionForm.setFieldValue('totalConcessionAmount', +totalConcession);
            setLedgerList(newled);
            updateSelectedAllHndlr(newled)
        }
        else if (name === 'feeTypeId') {
            fetchLedgerDetails(searchStudentState?.studentId)

        } else if (name === 'classId') {
            setLedgerList([]);
            studentConcessionForm.setValues((prevValues: any) => ({
                ...prevValues,
                feeTypeId: '', studentId: '', concessionMode: '',
                concessionType: '',
                subConcessionType: '',
                concessionValue: '', [name]: value
            }));
            setSearchStudentState({});
        }
    }
    function onInputSearchChange(inputString: any) {
        const { academicYearId } = studentConcessionForm.values;
        if (inputString && academicYearId) {
            const params = {
                branchId, academicYearId,
                // classId: classId,
                // curriculumId: curriculumId, 
                searchString: inputString,
            };
            dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
        }
    }
    function onSiblingInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString, instituteId };
            dispatch(getSiblingForRegistrationAct(generateActionPayload("get_siblings_registration", undefined,
                params)));
        }
    }


    function onEmployeeInputSearchChange(inputString: any) {
        if (inputString) {
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name",
                { searchString: inputString }, undefined)));
        }
    }
    const selectedStudent = (student: any) => {
        setSearchStudentState(student);
        setLedgerList([]);
        if (!student) {
            studentConcessionForm.setValues((prevValue: any) => ({
                ...prevValue, studentId: '',
                feeTypeId: prevValue?.feeTypeId, concessionMode: '', concessionValue: ''
            }));
        } else {
            studentConcessionForm.setFieldValue('studentId', student?.studentId);

            // Fetch student class
            const newpayload = { academicYearId: studentConcessionForm.values.academicYearId, branchId: branchId, curriculumId: student?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, newpayload)));

            // Fetch Student Ledger
            fetchLedgerDetails(student?.studentId)
        }
    }

    const selectedSibling = (student: any) => {
        studentConcessionForm.setFieldValue('siblingId', student.studentId)
        setSiblingState(student);
    }
    const selectedEmployee = (employee: any) => {
        studentConcessionForm.setFieldValue('employeeId', employee.id)
        setEmployeeState(employee);
    }

    function updateSelectedAllHndlr(feeList: any) {
        if (Array.isArray(feeList) && feeList.length > 0) {
            const isAnyUnselected = feeList.some((item: any) => !item.isSelected);
            setAllFeeSelectedState(!isAnyUnselected);
        } else {
            setAllFeeSelectedState(false);
        }
    }

    function CancelHandler() {
        history.push("/academic-concessions");
    }

    const confirmSubmitHndler = () => {
        if (location.state.id) {
            const formData = new FormData();

            const prevArr = getStuConcessionV2ByIdResp?.fileInfo
            let newArr;
            if (Array.isArray(prevArr) && prevArr.length > 0) {
                newArr = prevArr.filter((obj: any) => !document.some((obj2: any) => obj2?.id === obj?.id))
            }
            if (Array.isArray(newArr) && newArr.length > 0) {
                formData.append(`deletedFileIds`, newArr.map((i: any) => i?.id).join(","));
            }
            document?.map((item: any) => {
                if (!item?.id) {
                    formData.append(`file`, item);
                }
            })
            formData.append('request', JSON.stringify(submitConfirmationModalState.modalData))
            dispatch(editStuConcessionListV2Act(generateActionPayload('edit_student_concession_v2', { id: location.state?.id }, formData)))
        } else {

            const formData = new FormData();
            document?.map((item: any) => {
                formData.append(`file`, item);
            })
            formData.append('requestvalue', JSON.stringify(submitConfirmationModalState.modalData))
            dispatch(saveStuConcessionListV2Act(generateActionPayload('save_stu_concession_v2', { branchId: branchId, instituteId: instituteId, academicYearId: studentConcessionForm.values.academicYearId }, formData)))
        }
    }

    const handleFileChange = (files: any) => {
        setDocument(files);
        studentConcessionForm.setFieldValue('document', files);
    }

    const concessionAmountChangeHandler = (id: any, value: any) => {

        let totalValue: any = 0;
        const abcd: any = ledgerList.map((ledger: any) => {
            if (+ledger.id === +id) {
                if ((+value <= (+ledger?.remainingAmount))) {
                    totalValue += Math.ceil(+value)
                } else {
                    totalValue += Math.ceil(+ledger?.concessionAmount)
                }
                return {
                    ...ledger, concessionAmount: (+value <= (+ledger?.remainingAmount)) ? +value : +ledger?.concessionAmount
                }
            } else {
                if (ledger?.isSelected) totalValue += (+ledger.concessionAmount || 0)
            }
            return { ...ledger }
        })

        if (totalValue <= +studentConcessionForm.values.concessionValue) {
            setCheckTotalConcession(false)
            setLedgerList(abcd)
            studentConcessionForm.setFieldValue('totalConcessionAmount', +totalValue);
        } else {
            setCheckTotalConcession(true)
        }
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { data: StudentList } = studentsListResp || {};
    
    const selectedConcessionType = getFeeConcessionTypeListResp?.data?.find((item) => item.concessionTypeName === studentConcessionForm.values.concessionType);

    const subConcessionTypeOptions = selectedConcessionType?.subTypes || [];

    const roleColumns = useMemo(() => generateColumns(studentConcessionForm.values.concessionMode, studentConcessionForm.values.concessionValue, allFeeSelectedState,
        selectAllFeeHndlr, studentCheckHndlr), [studentConcessionForm, ledgerList]);

    return (
        <>
            <div className="page-content tution_fee_concession_wrap">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Fee" pageTitleUrl={location.state?.fromComponent === "Fee Summary" ? "/student-fee-ledger/fee-details" : "/academic-concessions"} linkState={{ studentId: location.state?.StudentDetails?.studentDetails?.id, academicYearId: location.state?.StudentDetails?.academicYearId, curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, classId: location.state?.StudentDetails?.studentAcademicDetails?.classId }} />
                    <div className="tw-flex tw-justify-center">
                        <div className="tw-bg-white tw-rounded tw-shadow tw-w-full tw-mb-6">
                            <div className="tw-border-b tw-p-4 tw-font-bold tw-text-lg">
                                {`${location.state?.id ? "Edit" : "Create"} Concession`}
                            </div>

                            <div className="tw-p-4">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-border-b tw-border-dashed tw-border-gray-300 tw-pb-4">
                                    <div className="tw-col-span-4">
                                        <SelectInput
                                            name="academicYearId"
                                            value={studentConcessionForm.values.academicYearId}
                                            onChange={filterHandler}
                                            menuItems={academicYearList || []}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            defaultSelect="Academic Year"
                                            formgroupClassName="tw-mb-2"
                                            isDisabled={
                                                location.state?.id ||
                                                location.state?.fromComponent === "Fee Summary"
                                            }
                                            invalid={studentConcessionForm.touched.academicYearId && studentConcessionForm.errors.academicYearId ? true : false}
                                                error={studentConcessionForm.touched.academicYearId && studentConcessionForm.errors.academicYearId ? studentConcessionForm.errors.academicYearId : ""}
                                        />

                                        <AutoSearchInputUpdated
                                            formgroupClassName="search-box"
                                            name="studentId"
                                            placeHolder="Search..."
                                            onChange={(string: any) => {
                                                if (!string)
                                                    studentConcessionForm.setFieldValue("studentId", "");
                                                onInputSearchChange(string);
                                            }}
                                            onBlur={studentConcessionForm.handleBlur}
                                            valueKey="studentId"
                                            labelHeader="Student Code"
                                            labelKey="studentCode"
                                            subLabelHeader="Student Name"
                                            subLabelKey="studentName"
                                            options={StudentList}
                                            selected={searchStudentState}
                                            selectedOptionCallbck={selectedStudent}
                                            isDisabled={
                                                location.state?.id ||
                                                location.state?.fromComponent === "Fee Summary"
                                            }
                                            invalid={studentConcessionForm.touched.studentId && studentConcessionForm.errors.studentId ? true : false}
                                                error={studentConcessionForm.touched.studentId && studentConcessionForm.errors.studentId ? studentConcessionForm.errors.studentId : ""}
                                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                                            <SelectInput
                                                name="curriculumId"
                                                value={studentConcessionForm.values.curriculumId}
                                                onChange={filterHandler}
                                                menuItems={curriculumTypes || []}
                                                valueKey="branchCurriculumId"
                                                textKey="curriculumName"
                                                defaultSelect="Curriculum"
                                                formgroupClassName="tw-my-2"
                                                isDisabled={true}
                                                invalid={studentConcessionForm.touched.curriculumId && studentConcessionForm.errors.curriculumId ? true : false}
                                                error={studentConcessionForm.touched.curriculumId && studentConcessionForm.errors.curriculumId ? studentConcessionForm.errors.curriculumId : ""}
                                            />
                                            <SelectInput
                                                name="classId"
                                                value={studentConcessionForm.values.classId}
                                                onChange={filterHandler}
                                                menuItems={classTypes || []}
                                                valueKey="id"
                                                textKey="shortName"
                                                defaultSelect="Class"
                                                formgroupClassName="tw-mb-2"
                                                isDisabled={true}
                                                invalid={studentConcessionForm.touched.classId && studentConcessionForm.errors.classId ? true : false}
                                                error={studentConcessionForm.touched.classId && studentConcessionForm.errors.classId ? studentConcessionForm.errors.classId : ""}
                                            />

                                        <div className="tw-mt-3 tw-mb-2">
                                            <Button
                                                onClick={openStudentConcessionModal}
                                                disabled={checkDisablePreviousBtn(
                                                    studentConcessionForm.values
                                                )}
                                                variant="linkBtn"
                                                className="tw-px-3"
                                            >
                                                View Previous Concessions
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="tw-col-span-4 tw-col-start-9">
                                        <SelectInput
                                            name="concessionMode"
                                            labelText="Concession"
                                            value={studentConcessionForm.values.concessionMode}
                                            onChange={filterHandler}
                                            menuItems={concessionMode}
                                            valueKey="concessionModeType"
                                            textKey="concessionMode"
                                            formgroupClassName="tw-mb-1"
                                            invalid={
                                                    studentConcessionForm.touched.concessionMode &&
                                                        studentConcessionForm.errors.concessionMode
                                                        ? true
                                                        : false
                                                }
                                                error={
                                                    studentConcessionForm.touched.concessionMode &&
                                                        studentConcessionForm.errors.concessionMode
                                                        ? studentConcessionForm.errors.concessionMode
                                                        : ""
                                                }
                                        />

                                        <TextInputGroup
                                            name="concessionValue"
                                            value={studentConcessionForm.values.concessionValue}
                                            onChange={filterHandler}
                                            inputGroupStart={true}
                                            allowedInputRegex="^[0-9]*$"
                                            invalid={
                                                    studentConcessionForm.touched.concessionValue &&
                                                        studentConcessionForm.errors.concessionValue
                                                        ? true
                                                        : false
                                                }
                                                error={
                                                    studentConcessionForm.touched.concessionValue &&
                                                        studentConcessionForm.errors.concessionValue
                                                        ? studentConcessionForm.errors.concessionValue
                                                        : ""
                                                }
                                        >
                                            <i className="">
                                                {studentConcessionForm.values.concessionMode === "AMOUNT"
                                                    ? "₹"
                                                    : "%"}
                                            </i>
                                        </TextInputGroup>
                                    </div>
                                </div>

                                <div className="tw-border-b tw-border-dashed tw-border-gray-300">
                                    <TableContainer
                                        columns={roleColumns || []}
                                        data={Array.isArray(ledgerList) ? ledgerList : []}
                                        divClass="tw-overflow-x-auto tw-my-3"
                                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                        rowDataInfo={{ ...studentConcessionForm.values }}
                                        onChangeInputHndlr={concessionAmountChangeHandler}
                                    />
                                    <span className="tw-text-red-600 tw-pl-4">
                                        {studentConcessionForm.errors.isNoFeeSelected
                                            ? String(studentConcessionForm.errors.isNoFeeSelected)
                                            : ""}
                                    </span>
                                    <span className="tw-text-red-600 tw-pl-4">
                                        {checkTotalConcession
                                            ? "* Your Concession Amount should not be greater than total Concession Amount"
                                            : ""}
                                    </span>
                                </div>

                                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-4">
                                    <div className="tw-col-span-5 tw-col-start-8">
                                        <div className="tw-grid tw-grid-cols-12 tw-items-center">
                                            <label className="tw-col-span-4">Concession Type</label>

                                            <div className="tw-col-span-8">
                                                <SelectInput
                                                    name="concessionType"
                                                    value={studentConcessionForm.values.concessionType}
                                                    onChange={studentConcessionForm.handleChange}
                                                    menuItems={getFeeConcessionTypeListResp?.data}
                                                    valueKey="concessionTypeName"
                                                    textKey="concessionTypeName"
                                                    isDisabled={location.state?.id && true}
                                                    formgroupClassName="tw-w-full"
                                                    invalid={
                                                        studentConcessionForm.touched.concessionType &&
                                                            studentConcessionForm.errors.concessionType
                                                            ? true
                                                            : false
                                                    }
                                                    error={
                                                        studentConcessionForm.touched.concessionType &&
                                                            studentConcessionForm.errors.concessionType
                                                            ? studentConcessionForm.errors.concessionType
                                                            : ""
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {subConcessionTypeOptions.length > 0 && (
                                            <div className="tw-grid tw-grid-cols-12 tw-items-center tw-mt-3">
                                                <label className="tw-col-span-4">Concession Sub Type</label>

                                                <div className="tw-col-span-8">
                                                    <SelectInput
                                                        name="subConcessionType"
                                                        value={studentConcessionForm.values.subConcessionType}
                                                        onChange={studentConcessionForm.handleChange}
                                                        menuItems={subConcessionTypeOptions}
                                                        valueKey="concessionSubTypeName"
                                                        textKey="concessionSubTypeName"
                                                        formgroupClassName="tw-w-full"
                                                        isDisabled={location.state?.id && true}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {studentConcessionForm.values.concessionType === "SIBLING" && (
                                            <div className="tw-grid tw-grid-cols-12 tw-items-center tw-mt-3">
                                                <label className="tw-col-span-4">Sibling</label>

                                                <div className="tw-col-span-8">
                                                    <AutoSearchInputUpdated
                                                        name="siblingId"
                                                        placeHolder="Search..."
                                                        formgroupClassName="tw-w-full"
                                                        onChange={(string: any) => {
                                                            if (!string) {
                                                                studentConcessionForm.setFieldValue("siblingId", "");
                                                            }
                                                            onSiblingInputSearchChange(string);
                                                        }}
                                                        alignRight={true}
                                                        valueKey="studentId"
                                                        labelHeader="Student Code"
                                                        labelKey="studentCode"
                                                        subLabelHeader="Student Name"
                                                        subLabelKey="studentName"
                                                        options={siblingsForRegistrationResp?.filter(
                                                            (item: any) => +item?.studentId !== searchStudentState?.studentId
                                                        )}
                                                        selected={siblingState}
                                                        selectedOptionCallbck={selectedSibling}
                                                        onBlur={studentConcessionForm.handleBlur}
                                                        invalid={
                                                            studentConcessionForm.touched.siblingId &&
                                                            !!studentConcessionForm.errors.siblingId
                                                        }
                                                        error={
                                                            studentConcessionForm.touched.siblingId
                                                                ? studentConcessionForm.errors.siblingId
                                                                : ""
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {studentConcessionForm.values.concessionType === "EMPLOYEE" && (
                                            <div className="tw-grid tw-grid-cols-12 tw-items-center tw-mt-3">
                                                <label className="tw-col-span-4">Employee</label>

                                                <div className="tw-col-span-8">
                                                    <AutoSearchInputUpdated
                                                        name="employeeId"
                                                        placeHolder="Search..."
                                                        formgroupClassName="tw-w-full"
                                                        onChange={(string: any) => {
                                                        if (!string) studentConcessionForm.setFieldValue('employeeId', "");
                                                        onEmployeeInputSearchChange(string)
                                                    }}
                                                    alignRight={true}
                                                    valueKey="id"
                                                    labelHeader="Employee Code"
                                                    labelKey="employeeCode"
                                                    subLabelHeader="Employee Name"
                                                    subLabelKey="employeeName"
                                                    containerClassName="tw-min-w-[300px]"
                                                    labelHeaderClassName="!tw-p-[8px] !tw-w-[38%]"
                                                    subLabelHeaderClassName="!tw-p-[8px] !tw-w-[62%]"
                                                    labelClassName="!tw-p-[8px] !tw-w-[38%]"
                                                    subLabelClassName="!tw-p-[8px] !tw-w-[62%]"


                                                    options={(Array.isArray(getEmployeesByFilterResp) && getEmployeesByFilterResp) || []}
                                                    selected={employeeState}
                                                    selectedOptionCallbck={selectedEmployee}
                                                    invalid={
                                                        studentConcessionForm.touched.employeeId &&
                                                            studentConcessionForm.errors.employeeId
                                                            ? true
                                                            : false
                                                    }
                                                    error={
                                                        studentConcessionForm.touched.employeeId &&
                                                            studentConcessionForm.errors.employeeId
                                                            ? studentConcessionForm.errors.employeeId
                                                            : ""
                                                    }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-mb-4">
                                            <label className="tw-col-span-4">Total Concession Amount</label>

                                            <div className="tw-col-span-8">
                                                <TextIconInput
                                                    name="totalConcessionAmount"
                                                    value={Math.ceil(+studentConcessionForm.values.totalConcessionAmount)}
                                                    onChange={studentConcessionForm.handleChange}
                                                    onBlur={studentConcessionForm.handleBlur}
                                                    isDisabled
                                                    formgroupClassName="tw-w-full"
                                                >
                                                    <i className="tw-text-lg">₹</i>
                                                </TextIconInput>
                                            </div>
                                        </div>

                                        <div className="tw-grid tw-grid-cols-12 tw-items-start tw-mb-4">
                                            <label className="tw-col-span-4">Remarks</label>

                                            <div className="tw-col-span-8">
                                                <TextArea
                                                    name="remarks"
                                                    value={studentConcessionForm.values.remarks}
                                                    onChange={studentConcessionForm.handleChange}
                                                    formgroupClassName="tw-w-full"
                                                    invalid={
                                                        studentConcessionForm.touched.remarks &&
                                                            studentConcessionForm.errors.remarks
                                                            ? true
                                                            : false
                                                    }
                                                    error={
                                                        studentConcessionForm.touched.remarks &&
                                                            studentConcessionForm.errors.remarks
                                                            ? studentConcessionForm.errors.remarks
                                                            : ""
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="tw-grid tw-grid-cols-12 tw-items-start">
                                            <label className="tw-col-span-4">Document</label>

                                            <div className="tw-col-span-8">
                                                <MultipleFileUpload
                                                    name="document"
                                                    prevFiles={document}
                                                    onChange={handleFileChange}
                                                    containerClass="tw-w-full"
                                                    maxSizeInMb={2}
                                                    helperText="Note : Max File Size is 2MB"
                                                    error={
                                                        studentConcessionForm.touched.document &&
                                                            studentConcessionForm.errors.document
                                                            ? studentConcessionForm.errors.document
                                                            : ""
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tw-flex tw-justify-end tw-gap-2 tw-pt-4">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={CancelHandler}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        onClick={(e: any) => studentConcessionForm.handleSubmit(e)}
                                    >
                                        {location.state?.id ? "Update" : "Submit"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="student-concession-modal"
                isOpen={studentConcessionModalState.showModal}
                toggle={closeStudentConcessionModal}
                modalTitle="Previous Concession"
                modalSize="xl"
            >
                <StudentConcessionModal
                    dispatch={dispatch}
                    branchId={branchId}
                    concessionDetails={studentConcessionForm.values}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="student-concession-create-modal"
                isOpen={submitConfirmationModalState.showModal}
                confirmMessage={`You want to ${location.state?.id ? "Update" : "Create"} this concession ?`}
                cancelHndlr={closeSubmitConfirmationModal}
                confirmHndlr={confirmSubmitHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType="approve"
                btnClassName='btn w-sm btn-success'
            />
            <ModalContainerUpdated
                id="student-concession-check-modal"
                isOpen={checkConcessionModalState.showModal}
                toggle={closeCheckConcessionModal}
                modalTitle=""
                headerClassName="bg-white"
                modalSize="md"
            >
                <CheckConcessionModal
                    toggle={closeCheckConcessionModal}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default AddStudentConcessionV2;