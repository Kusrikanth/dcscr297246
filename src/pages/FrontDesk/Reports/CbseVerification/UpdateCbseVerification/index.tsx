import { useFormik } from "formik";
import * as Yup from "yup";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import React, { useEffect, useRef, useState } from "react";
import { AutoSearchInputUpdated, DateInput, InputCheckbox, ModalContainerUpdated, PhoneInput, RadioInputContainer, SelectInput, TextArea, TextIconInput, TextInput, TextInputWithRegex, UploadFileInput } from "../../../../../Components/Common";
import {
    boardNames, generatePayloadForCbseVerification, handicapOptions, signRadioOptions, undertakingOptions, uploadFileErrorHndlr, uploadImageErrorHndlr,
    validateDimension, yesNoRadioOptions
} from "../../../../CBSEVerificationForm/helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getCbseVerificationsAct, setCbseVerificationsAct, addCbseVerificationAct, getStudentSubjectsAct } from "../../../../../store/cbseverification/cbseverificationactions";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getCasteListAct, getGenderListAct, getMasterIncomeAct } from "../../../../../store/masterdata/masterdataactions";
import { getRegistrationSecondLangAct, getRegistrationThirdLangAct, getSiblingForRegistrationAct } from "../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { useModal } from "../../../../../hooks/modalhook";
import PreviewCbseVerificationModal from "../../../../CBSEVerificationForm/PreviewModal";
import { toast } from "react-toastify";
import { getSiblingDetailsAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";
import { getInstAcademicYearAct } from "../../../../../store/mastersettings/instacademics/instacademicactions";
import { useHistory } from "react-router-dom";
import { Min_Date, MinDate_YYYYMMDD, getYyyyMmDdFormat, getYearGapCurrentDate, Current_Date_YYYYMMDD } from "../../../../../utility/dateutility";
import Button from "../../../../../Components/Common/Button";
const Max_Age_Year = 3;
const Student_Dob_MaxDate_YYYYMMDD = getYyyyMmDdFormat(getYearGapCurrentDate(Max_Age_Year));
const validationSchema = Yup.object().shape({
    genderId: Yup.string().required("Gender is required."),
    casteId: Yup.string().required("CasteId is required."),
    casteName: Yup.string(),
    castEmail: Yup.boolean(),
    caste: Yup.string().test("casteDocument", "Caste document is required.",
        (value: any, schema: any) => {
            const { casteName, castEmail } = schema.parent;
            if (!value && (casteName === 'SC' || casteName === 'ST') && !castEmail) {
                return false;
            }
            return true;
        }),
    isAadharCardPresent: Yup.string(),
    studentAadhar: Yup.string().when('isAadharCardPresent', {
        is: (isAadharCardPresent: any) => isAadharCardPresent === "YES",
        then: Yup.string().required("Aadhar card is required."),
    }),
    aadharCardNo: Yup.string().when('isAadharCardPresent', {
        is: (isAadharCardPresent: any) => isAadharCardPresent === "YES",
        then: Yup.string().required("Aadhar card number is required."),
    }),
    emailId: Yup.string().email('Invalid Email.').required("Email id required."),
    mobileNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Mobile number with 10 digit is valid.').required("Mobile number is required."),

    isHandicapped: Yup.string(),
    handicappedFor: Yup.string().when('isHandicapped', {
        is: (isHandicapped: any) => isHandicapped === "YES",
        then: Yup.string().required("Select handicapped for."),
    }),
    handicappedRemarks: Yup.string().test("handicappedRemarksValidation", "Handicapped remarks is required.",
        (value: any, schema: any) => {
            const { handicappedFor } = schema.parent;
            if (!value && handicappedFor === 'Others') {
                return false;
            }
            return true;
        }),
    medicalCondition: Yup.string(),
    medicalRemarks: Yup.string().when('medicalCondition', {
        is: (medicalCondition: any) => medicalCondition === "YES",
        then: Yup.string().required("Medical remarks is required."),
    }),

    siblingStudentId: Yup.string().test("siblingValidation", "Sibling is required.",
        (value: any, schema: any) => {
            const { hasSibling, isSiblingStudyingInSameSchool } = schema.parent;
            if (!value && hasSibling === "YES" && isSiblingStudyingInSameSchool === 'YES') {
                return false;
            }
            return true;
        }),

    correctedStudentName: Yup.string().required("Student name is required."),
    correctedFatherName: Yup.string().required("Father name is required."),
    correctedMotherName: Yup.string().required("Mother name is required."),
    correctedDob: Yup.date().min(MinDate_YYYYMMDD, `DOB should be more than ${Min_Date}.`)
        .max(Student_Dob_MaxDate_YYYYMMDD, `Student age should be greater than ${Max_Age_Year} year.`)
        .required("Dob is required.").nullable(),

    documentMail: Yup.boolean(),
    requestLetter: Yup.string().test("casteDocument", "Document is required.",
        (value: any, schema: any) => {
            const { documentMail } = schema.parent;
            if (!value && !documentMail) {
                return false;
            }
            return true;
        }),
    affidavit: Yup.string().test("casteDocument", "Document is required.",
        (value: any, schema: any) => {
            const { documentMail } = schema.parent;
            if (!value && !documentMail) {
                return false;
            }
            return true;
        }),
    evidenceProof: Yup.string().test("casteDocument", "Document is required.",
        (value: any, schema: any) => {
            const { documentMail } = schema.parent;
            if (!value && !documentMail) {
                return false;
            }
            return true;
        }),
    sign: Yup.string().required('Sign is required.'),
    isClassAboveTenth: Yup.boolean(),
    // subjectsRequired: Yup.string().test("subjectRequiredValidation", "Subject registered is required.",
    //     (value: any, schema: any) => {
    //         const { isClassAboveTenth } = schema.parent;
    //         if (!value && isClassAboveTenth) {
    //             return false;
    //         }
    //         return true;
    //     }),
    haveSkillSubject: Yup.string(),
    skillSubjectName: Yup.string().test("skillSubjectValidation", "Skill subject is required.",
        (value: any, schema: any) => {
            const { isClassAboveTenth, haveSkillSubject } = schema.parent;
            if (!value && isClassAboveTenth && haveSkillSubject === 'YES') {
                return false;
            }
            return true;
        }),
    boardRollNo: Yup.string().test("boardRollNoValidation", "Board roll number is required.",
        (value: any, schema: any) => {
            const { isClassAboveTenth } = schema.parent;
            if (!value && isClassAboveTenth) {
                return false;
            }
            return true;
        }),
    boardName: Yup.string().test("boardNameValidation", "Board name is required.",
        (value: any, schema: any) => {
            const { isClassAboveTenth } = schema.parent;
            if (!value && isClassAboveTenth) {
                return false;
            }
            return true;
        }),
    boardOtherName: Yup.string().test("boartOtherNameValidation", "Board name is required.",
        (value: any, schema: any) => {
            const { isClassAboveTenth, boardName } = schema.parent;
            if (!value && isClassAboveTenth && boardName === 'Others') {
                return false;
            }
            return true;
        }),
    marksSheet: Yup.string().test("boartCertificateValidation", "Board certificate is required.",
        (value: any, schema: any) => {
            const { isClassAboveTenth } = schema.parent;
            if (!value && isClassAboveTenth) {
                return false;
            }
            return true;
        }),

});

function setCbseVerificationFormValues(initialData?: any) {
    let existingAadhardFileId = "";
    const { isAadharCardPresent, aadharCardFile, classSequence } = initialData || {};
    if (isAadharCardPresent === 'YES') {
        existingAadhardFileId = aadharCardFile?.id || "";
    }
    return ({
        cbseVerificationId: initialData?.cbseVerificationId || "",
        studentId: initialData?.studentId || "",
        studentCode: initialData?.studentCode || "",
        academicYearId: initialData?.academicYearId || "",
        isHasAadharNumber: initialData?.isHasAadharNumber || "",

        mobileNo: initialData?.smsPriorityNo || "",
        emailId: initialData?.emailId || "",

        castEmail: initialData?.casteMail === "YES",
        handicappedFor: initialData?.handicappedFor || "",
        medicalRemarks: initialData?.medicalRemarks || "",
        handicappedRemarks: initialData?.handicappedOtherRemarks || "",
        siblingStudentCode: initialData?.siblingStudentCode || "",
        siblingStudentId: initialData?.siblingStudentId || "",
        siblingStudentName: initialData?.siblingStudentName || "",
        siblingBranchName: initialData?.siblingBranchName || "",
        siblingCurriculumName: initialData?.siblingCurriculumName || "",
        siblingSectionName: initialData?.siblingSectionName || "",
        isChangeSibling: initialData?.isChangeSibling || "",

        studentAadhar: initialData?.aadharCardFile?.originalFileName || "",
        requestLetter: initialData?.requestLetterFile?.originalFileName || "",
        affidavit: initialData?.affidavitFile?.originalFileName || "",
        evidenceProof: initialData?.evidenceProofFile?.originalFileName || "",
        sign: initialData?.signFile?.originalFileName || "",
        caste: initialData?.casteFile?.originalFileName || "",
        marksSheet: initialData?.marksSheetFile?.originalFileName || "",

        studentAadharFile: "",
        requestLetterFile: "",
        affidavitFile: "",
        evidenceProofFile: "",
        signFile: null,
        casteFile: "",
        marksSheetFile: "",


        secondLanguage: initialData?.secondLanguageId || "",
        thirdLanguage: initialData?.thirdLanguageId || "",
        casteId: initialData?.casteId || "",
        casteName: initialData?.casteName || "",
        genderId: initialData?.genderId || "",
        todayDate: Current_Date_YYYYMMDD,
        studentName: initialData?.studentName || "",
        className: initialData?.className || "",
        isClassAboveTenth: Number(classSequence) > 13,
        curriculumName: initialData?.curriculumName || "",
        sectionName: initialData?.sectionName || "",
        motherIncome: initialData?.motherIncome || "",
        fatherIncome: initialData?.fatherIncome || "",
        isAadharCardPresent: initialData?.isAadharCardPresent || "YES",
        aadharCardNo: initialData?.aadharCardNo || "",
        existingAadhardFileId,
        isHandicapped: initialData?.isHandicapped || "NO",
        correctedStudentName: initialData?.correctedStudentName ?
            initialData?.correctedStudentName : initialData?.studentName,
        correctedFatherName: initialData?.correctedFatherName ?
            initialData?.correctedFatherName : initialData?.fatherName,
        correctedMotherName: initialData?.correctedMotherName ?
            initialData?.correctedMotherName : initialData?.motherName,
        correctedDob: initialData?.correctedDob ?
            (initialData?.correctedDob || '') : (initialData?.dob || ''),
        isMinority: initialData?.isMinority || "NO",
        medicalCondition: initialData?.medicalCondition || "NO",
        hasSibling: initialData?.hasSibling || "NO",
        isSiblingStudyingInSameSchool: initialData?.isSiblingStudyingInSameSchool || "NO",
        signName: initialData?.signName || "FATHER",
        documentMail: initialData?.documentMail === "YES",
        undertaking: initialData?.undertaking || "NOCORRECTIONS",
        submissionStatus: initialData?.submissionStatus,

        subjectsRequired: initialData?.subjectsRequired || "",
        haveSkillSubject: initialData?.haveSkillSubject || "NO",
        skillSubjectName: initialData?.skillSubjectName || "",
        boardRollNo: initialData?.boardRollNo || "",
        boardName: initialData?.boardName || "",
        boardOtherName: initialData?.boardOtherName || "",


    })
}
const initialValues = setCbseVerificationFormValues();
const UpdateCbseVerificationPage = () => {
    const history = useHistory();
    const { modalState: previewModalState, closeModal: closePreviewModalHndlr,
        openModal: openPreviewModalHndlr
    } = useModal();

    const [selectedChildState, setSelectedChildState] = useState<any>(null);
    const [selectedSiblingState, setSelectedSiblingState] = useState<any>(null);
    const dispatch = useAppDispatch();
    const { showApiLoader, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        academicYearListResp,
        cbseVerificationsResp, siblingsForRegistrationResp, studentSubjectsResp, addCbseVerificationResp, genderListResp,
        getSiblingDetailsResp,
        registrationSecondLangResp, registrationThirdLangResp, masterIncomeResp,
        casteListResp, cbseVerificationErrorResp } = useAppSelector(({
            globalData, instAcademics,
            appData, directoryStudent, masterData, admissionRegistration, cbseVerification }) => ({
                showApiLoader: globalData.showApiLoader,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                academicYearListResp: instAcademics.academicYearListResp,
                currentStudentId: appData.currentStudentId,
                genderListResp: masterData.genderListResp,
                casteListResp: masterData.casteListResp,
                masterIncomeResp: masterData.masterIncomeResp,
                registrationSecondLangResp: admissionRegistration.registrationSecondLangResp,
                registrationThirdLangResp: admissionRegistration.registrationThirdLangResp,
                siblingsForRegistrationResp: admissionRegistration.siblingsForRegistrationResp,
                cbseVerificationsResp: cbseVerification.cbseVerificationsResp,
                studentSubjectsResp: cbseVerification.studentSubjectsResp,
                addCbseVerificationResp: cbseVerification.addCbseVerificationResp,
                cbseVerificationErrorResp: cbseVerification.cbseVerificationErrorResp,
                parentChildrensResp: directoryStudent.parentChildrensResp,
                getSiblingDetailsResp: directoryStudent.getSiblingDetailsResp,
            }), shallowEqual);

    const { data: secondLanguageList } = registrationSecondLangResp || {},
        { data: thirdLanguageList } = registrationThirdLangResp || {},
        { data: genderList } = genderListResp || {},
        { data: casteList } = casteListResp || {};

    const verificationFormRespRef = useRef({
        prevGetSiblingDetailsResp: getSiblingDetailsResp,
        prevAddCbseVerificationResp: addCbseVerificationResp,
        prevStudentSubjectsResp: studentSubjectsResp,
        prevCbseVerificationErrorResp: cbseVerificationErrorResp
    });

    useEffect(() => {
        const { prevAddCbseVerificationResp, prevGetSiblingDetailsResp, prevStudentSubjectsResp,
            prevCbseVerificationErrorResp } = verificationFormRespRef.current;
        if (addCbseVerificationResp && prevAddCbseVerificationResp !== addCbseVerificationResp) {
            toast.success('Cbse verification form updated successfully.');
            history.push('/cbse-verification-report');
        } else if (getSiblingDetailsResp && prevGetSiblingDetailsResp !== getSiblingDetailsResp) {
            cbseVerificationForm.setValues(prevValues => ({
                ...prevValues,
                siblingStudentCode: getSiblingDetailsResp?.studentCode || "",
                siblingStudentName: getSiblingDetailsResp?.studentName || "",
                siblingBranchName: getSiblingDetailsResp?.branchName || "",
                siblingCurriculumName: getSiblingDetailsResp?.curriculumName || "",
                siblingSectionName: getSiblingDetailsResp?.sectionName || "",
            }));
        } else if (studentSubjectsResp && studentSubjectsResp !== prevStudentSubjectsResp) {
            const { subjectNames } = studentSubjectsResp;
            cbseVerificationForm.setFieldValue('subjectsRequired', subjectNames || '');
        } else if (cbseVerificationErrorResp && prevCbseVerificationErrorResp !== cbseVerificationErrorResp) {
            const { message, details } = cbseVerificationErrorResp;
            toast.error(details || message || "Something went wrong.");
        }
        verificationFormRespRef.current.prevAddCbseVerificationResp = addCbseVerificationResp;
        verificationFormRespRef.current.prevGetSiblingDetailsResp = getSiblingDetailsResp;
        verificationFormRespRef.current.prevStudentSubjectsResp = studentSubjectsResp;

        verificationFormRespRef.current.prevCbseVerificationErrorResp = cbseVerificationErrorResp;
    }, [addCbseVerificationResp, getSiblingDetailsResp, studentSubjectsResp, cbseVerificationErrorResp]);

    useEffect(() => {
        if (academicYearListResp && Array.isArray(academicYearListResp?.data)) {
            const { academicYearId } = academicYearListResp.data?.find((year: any) => year.isAdmissionDefault) || {};
            cbseVerificationForm.setValues(prevValue => ({ ...prevValue, academicYearId }));
        }
    }, [academicYearListResp]);

    useEffect(() => {
        dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc" })));
        dispatch(getMasterIncomeAct(generateActionPayload("get_master_income")));
        dispatch(getCasteListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "caste", sortBy: "casteName", orderBy: "asc", pageNo: 0, pageSize: 100 })));

        return () => {
            dispatch(setCbseVerificationsAct(undefined));
        }
    }, []);

    useEffect(() => {
        if (instituteId) {
            const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        }
    }, [instituteId]);

    const cbseVerificationForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { content } = cbseVerificationsResp || {};
            const intitalVerificationData = content?.find((item: any) => item.studentId?.toString() === selectedChildState?.studentId?.toString());
            if (intitalVerificationData) {
                const payload = generatePayloadForCbseVerification(intitalVerificationData, values);
                dispatch(addCbseVerificationAct(generateActionPayload("add_cbse_verification", undefined, payload)));
            } else {
                toast.error('Something went wrong.');
            }
        },
    });

    function getCbseVerificationApiCall(otherProps?: any) {
        const payload = {
            academicYearId: cbseVerificationForm.values.academicYearId,
            branchId,
            curriculumId: selectedChildState?.curriculumId,
            searchString: selectedChildState?.studentCode,
            ...otherProps,
            pageNo: 0,
            pageSize: 20,
        }
        dispatch(getCbseVerificationsAct(generateActionPayload("get_cbse_verifications", undefined, payload)));
    }

    function getSecondLangApiCall(paramInfo: any) {
        const params = {
            instituteId,
            academicYearId: paramInfo?.academicYearId,
            branchId: paramInfo?.branchId,
            curriculumId: paramInfo?.curriculumId,
            classId: paramInfo?.classId,
            type: 'SECOND'
        }
        dispatch(getRegistrationSecondLangAct(generateActionPayload("get_registration_lang", undefined, params)));
    }

    function getThirdLangApiCall(paramInfo: any) {
        const params = {
            instituteId,
            academicYearId: paramInfo?.academicYearId,
            branchId: paramInfo?.branchId,
            curriculumId: paramInfo?.curriculumId,
            classId: paramInfo?.classId,
            type: 'THIRD'
        }
        dispatch(getRegistrationThirdLangAct(generateActionPayload("get_registration_lang", undefined, params)));
    }
    function getStudentSubjectApiCall(params: any) {
        dispatch(getStudentSubjectsAct(generateActionPayload("get_student_subjects", undefined, params)));
    }

    function onChangeCasteHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value) {
            const { casteName = '' } = casteListResp?.data?.find((item: any) => item?.casteId.toString() === value) || {};
            cbseVerificationForm.setValues(prevValues => ({
                ...prevValues, [name]: value, casteName, casteFile: '', caste: ''
            }))
        } else {
            cbseVerificationForm.setValues(prevValues => ({
                ...prevValues, [name]: value, casteName: '', casteFile: '', caste: ''
            }))
        }
    }

    function onChangeHaveSiblingHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        cbseVerificationForm.setValues(prevValues => ({
            ...prevValues, [name]: value,
            isSiblingStudyingInSameSchool: 'NO',
            siblingStudentCode: "",
            siblingStudentId: "",
            siblingStudentName: "",
            siblingBranchName: "",
            siblingCurriculumName: "",
            siblingSectionName: "",
        }));
        setSelectedSiblingState(null);
    }
    function onChangeSameSchoolSibHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        cbseVerificationForm.setValues(prevValues => ({
            ...prevValues, [name]: value,
            siblingStudentCode: "",
            siblingStudentId: "",
            siblingStudentName: "",
            siblingBranchName: "",
            siblingCurriculumName: "",
            siblingSectionName: "",
        }));
        setSelectedSiblingState(null);
    }

    function fileUploadHandler(event: any) {
        const { name } = event.target;
        const file = event.target.files[0];
        const errorMessage = uploadFileErrorHndlr(file.size, file.type);
        if (errorMessage) {
            cbseVerificationForm.setFieldTouched(name, true, false);
            cbseVerificationForm.setFieldValue(name, "", false);
            cbseVerificationForm.setFieldError(name, errorMessage);
        } else {
            const fileKeyName = `${name}File`;
            cbseVerificationForm.setValues(prevValues => ({
                ...prevValues,
                [name]: file?.name,
                [fileKeyName]: file
            }))
        }
        event.target.value = '';
    }

    function fileImageUploadHandler(event: any) {
        const { name } = event.target;
        const file = event.target.files[0];
        const errorMessage = uploadImageErrorHndlr(file.size, file.type);
        if (errorMessage) {
            cbseVerificationForm.setFieldTouched(name, true, false);
            cbseVerificationForm.setFieldValue(name, "", false);
            cbseVerificationForm.setFieldError(name, errorMessage);
        } else {
            const previewUrl = URL.createObjectURL(file);
            const image = new Image();
            image.src = previewUrl;
            image.onload = () => {
                const width = image.width;
                const height = image.height;
                const dimensionError = validateDimension(height, width);
                if (dimensionError) {
                    URL.revokeObjectURL(previewUrl);
                    cbseVerificationForm.setFieldTouched(name, true, false);
                    cbseVerificationForm.setFieldValue(name, "", false);
                    cbseVerificationForm.setFieldError(name, dimensionError);
                } else {
                    const fileKeyName = `${name}File`;
                    cbseVerificationForm.setValues(prevValues => ({
                        ...prevValues,
                        [name]: file?.name,
                        [fileKeyName]: file
                    }))
                }
            };
        }
        event.target.value = '';
    }

    function removeFileHandler(inputName: string) {
        const fileKeyName = `${inputName}File`;
        cbseVerificationForm.setValues(prevValues => ({
            ...prevValues,
            [inputName]: "",
            [fileKeyName]: ""
        }))
    }

    function previewModalHandler() {
        const { content } = cbseVerificationsResp,
            { genderId, secondLanguage, thirdLanguage, signFile,
                fatherIncome, motherIncome
            } = cbseVerificationForm.values;
        let previewUrl = "";
        if (signFile) {
            previewUrl = URL.createObjectURL(signFile);
        } else {
            previewUrl = content?.[0]?.signFile?.s3URL;
        }
        openPreviewModalHndlr({
            studentCode: cbseVerificationForm.values.studentCode,
            studentName: cbseVerificationForm.values.studentName,
            classSection: cbseVerificationForm.values.sectionName,
            admissionNo: content?.[0]?.admissionNo,
            dateOfAdmission: content?.[0]?.dateOfAdmission,
            dateOfBirth: cbseVerificationForm.values.correctedDob,
            gender: genderList?.find((item: any) => item?.genderId.toString() === genderId)?.genderName,
            mobileNo: content?.[0]?.smsPriorityNo,
            emailId: content?.[0]?.emailId,
            aadharNo: cbseVerificationForm.values.aadharCardNo,
            casteName: cbseVerificationForm.values.casteName,
            fatherName: cbseVerificationForm.values.correctedFatherName,
            fatherAnnualIncome: fatherIncome,
            motherName: cbseVerificationForm.values.correctedMotherName,
            motherAnnualIncome: motherIncome,
            isHandicapped: cbseVerificationForm.values.isHandicapped,
            isMinority: cbseVerificationForm.values.isMinority,
            hasSibling: cbseVerificationForm.values.hasSibling,
            isSiblingStudyingInSameSchool: cbseVerificationForm.values.isSiblingStudyingInSameSchool,

            siblingStudentCode: cbseVerificationForm.values.siblingStudentCode,

            siblingStudentName: cbseVerificationForm.values.siblingStudentName,
            siblingBranchName: cbseVerificationForm.values.siblingBranchName,
            siblingCurriculumName: cbseVerificationForm.values.siblingCurriculumName,
            siblingSectionName: cbseVerificationForm.values.siblingSectionName,
            medicalCondition: cbseVerificationForm.values.medicalCondition,
            secondLanguage: secondLanguageList?.find((item: any) => item?.languageId.toString() === secondLanguage)?.languageName,
            thirdLanguage: thirdLanguageList?.find((item: any) => item?.languageId.toString() === thirdLanguage)?.languageName,
            dateOfSubmission: cbseVerificationForm.values.todayDate,
            requireCorrection: cbseVerificationForm.values.undertaking === 'CORRECTION' ? 'YES' : 'NO',
            signName: cbseVerificationForm.values.signName,


            documentMail: cbseVerificationForm.values.documentMail,
            signPreviewUrl: previewUrl,
            isClassAboveTenth: cbseVerificationForm.values.isClassAboveTenth,
            subjectsRequired: cbseVerificationForm.values.subjectsRequired,
            haveSkillSubject: cbseVerificationForm.values.haveSkillSubject,
            skillSubjectName: cbseVerificationForm.values.skillSubjectName,
            boardRollNo: cbseVerificationForm.values.boardRollNo,
            boardName: cbseVerificationForm.values.boardName,
            boardOtherName: cbseVerificationForm.values.boardOtherName,

        });
    }

    function onChangeDocumentMailHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target;
        cbseVerificationForm.setValues(prevValues => ({
            ...prevValues,
            [name]: checked,
            requestLetter: "",
            requestLetterFile: "",
            affidavit: "",
            affidavitFile: "",
            evidenceProof: "",
            evidenceProofFile: ""
        }))
    }

    function onChangeCasteEmailHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target;
        cbseVerificationForm.setValues(prevValues => ({
            ...prevValues,
            [name]: checked,
            caste: "",
            casteFile: "",
        }))
    }


    function onChangeSearchSiblingHndlr(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString, instituteId };
            dispatch(getSiblingForRegistrationAct(generateActionPayload("get_siblings_registration", undefined,
                params)));
        }
    }

    function selectedSiblingCallbackHndlr(selectedStudent: any) {
        const { studentId } = selectedStudent || {};
        if (studentId) {
            const params = { studentId }
            dispatch(getSiblingDetailsAct(generateActionPayload("get_siblings_registration_update", undefined, params)));
            cbseVerificationForm.setValues(prevValues => ({ ...prevValues, siblingStudentId: studentId || "" }));
        } else {
            cbseVerificationForm.setValues(prevValues => ({
                ...prevValues,
                siblingStudentCode: "",
                siblingStudentId: "",
                siblingCurriculumName: "",
                siblingBranchName: "",
                siblingSectionName: "",
                siblingStudentName: ""
            }));
        }
        setSelectedSiblingState(selectedStudent);
    }


    function onChangeSearchStudentHndlr(inputString: any) {
        if (inputString) {
            getCbseVerificationApiCall({ searchString: inputString, academicYearId, branchId });
        }
    }

    function selectedStudentCallback(selectedStudent: any) {
        if (selectedStudent) {
            const { academicYearId } = cbseVerificationForm.values;
            setSelectedSiblingState({
                studentId: selectedStudent?.siblingStudentId,
                studentName: selectedStudent?.siblingStudentName,
                studentCode: selectedStudent?.siblingStudentCode,
            })
            const formValues = setCbseVerificationFormValues(selectedStudent);
            cbseVerificationForm.resetForm({ values: formValues });
            const langApiParams = {
                academicYearId,
                branchId,
                curriculumId: selectedStudent?.branchCurriculumId,
                classId: selectedStudent?.classId,
            };
            getSecondLangApiCall(langApiParams);
            getThirdLangApiCall(langApiParams);
            const subjectApiCallParams = {
                academicYearId,
                branchId,
                studentId: selectedStudent?.studentId,
            }
            getStudentSubjectApiCall(subjectApiCallParams);
        } else {
            cbseVerificationForm.resetForm({
                values: { ...initialValues, academicYearId: cbseVerificationForm.values.academicYearId }
            })
        }
        setSelectedChildState({
            studentId: selectedStudent?.studentId || "",
            studentName: selectedStudent?.studentName || "",
            studentCode: selectedStudent?.studentCode || "",
        });
    }

    function onChangeHandicappedHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        cbseVerificationForm.setValues(prevValues => ({
            ...prevValues,
            [name]: value,
            handicappedFor: "",
            handicappedRemarks: "",
        }))
    }
    function onChangeMedicalCondHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        cbseVerificationForm.setValues(prevValues => ({
            ...prevValues,
            [name]: value,
            medicalRemarks: ""
        }))
    }

    function aadharcardChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        cbseVerificationForm.setValues(prevValues => ({
            ...prevValues,
            [name]: value,
            aadharCardNo: "",
            studentAadhar: "",
            studentAadharFile: ""
        }))
    }


    function onChangeSkillSubjectHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        cbseVerificationForm.setValues(prevValues => ({
            ...prevValues,
            [name]: value,
            skillSubjectName: ""
        }))
    }

    function resetHandler() {
        getCbseVerificationApiCall();
    }

    function onChangeAcademicYearHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        cbseVerificationForm.resetForm({
            values: { ...initialValues, academicYearId: value }
        })
        setSelectedChildState(null);
    }

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        cbseVerificationForm.setFieldValue(name, updateDate);
    }

    const {
        academicYearId, casteName, isAadharCardPresent, isHandicapped, medicalCondition, isSiblingStudyingInSameSchool, undertaking,
        castEmail, documentMail, submissionStatus, handicappedFor, studentId
    } = cbseVerificationForm.values;
    const isSubmitted = submissionStatus === 'SUBMITTED';
    const emptySelectedStudentId = !studentId;
    const siblingFilterStudentId: any = [studentId];
    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Cbse Verification Form" />
                    <div className="tw-grid tw-grid-cols-12 tw-gap-x-2 tw-justify-center">
                        <div className="tw-col-span-12 tw-mx-auto">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                                <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                                        Update CBSE Verification
                                    </h4>
                                </div>
                                <div className="tw-p-5">
                                    {isSubmitted && (
                                        <div className="tw-bg-green-500 tw-text-white tw-mb-2 tw-px-3 tw-py-2 tw-rounded">
                                            CBSE Verification form already submitted.
                                        </div>
                                    )}
                                    <form onSubmit={cbseVerificationForm.handleSubmit}>
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <SelectInput
                                                    name="academicYearId"
                                                    labelText="Academic Year"
                                                    labelClass="required"
                                                    value={cbseVerificationForm.values.academicYearId}
                                                    onChange={onChangeAcademicYearHndlr}
                                                    menuItems={academicYearListResp?.data || []}
                                                    valueKey="academicYearId"
                                                    textKey="academicYearName"
                                                    defaultSelect="Academic Year"
                                                    formgroupClassName="tw-mb-0"
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <AutoSearchInputUpdated
                                                    labelText="Student Details"
                                                    labelClass="required"
                                                    formgroupClassName="tw-relative tw-mb-0"
                                                    name="studentId"
                                                    placeHolder="Search..."
                                                    onChange={onChangeSearchStudentHndlr}
                                                    valueKey="studentId"
                                                    labelKey="studentCode"
                                                    labelHeader="Student Code"
                                                    subLabelKey="studentName"
                                                    subLabelHeader="Student Name"
                                                    options={cbseVerificationsResp?.content}
                                                    selected={selectedChildState}
                                                    selectedOptionCallbck={selectedStudentCallback}
                                                    isDisabled={!academicYearId}
                                                    helperText={academicYearId ? '' : "Select academic year to search student."}
                                                    invalid={(cbseVerificationForm.touched.studentId && cbseVerificationForm.errors.studentId) ? true : false}
                                                    error={(cbseVerificationForm.touched.studentId && cbseVerificationForm.errors.studentId) ? cbseVerificationForm.errors.studentId : ""}
                                                >
                                                    <i className="ri-search-line tw-absolute tw-top-1/2 tw-right-3 tw-translate-y-1/2 tw-text-gray-400"></i>
                                                </AutoSearchInputUpdated>
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <TextInput
                                                    name="studentCode"
                                                    labelText="Student Id"
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.studentCode}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    isDisabled={true}
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <TextInput
                                                    name="studentName"
                                                    labelText="Student Name"
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.studentName}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    isDisabled={true}
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <TextInput
                                                    name="className"
                                                    labelText="Class"
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.className}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    isDisabled={true}
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <TextInput
                                                    name="sectionName"
                                                    labelText="Section"
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.sectionName}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    isDisabled={true}
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <DateInput
                                                    name="todayDate"
                                                    labelText="Date"
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.todayDate}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    isReadOnly={true}
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <SelectInput
                                                    name="genderId"
                                                    labelText="Gender"
                                                    labelClass="required"
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.genderId}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    menuItems={genderList}
                                                    valueKey="genderId"
                                                    textKey="genderName"
                                                    isDisabled={emptySelectedStudentId}
                                                    invalid={(cbseVerificationForm.touched.genderId && cbseVerificationForm.errors.genderId) ? true : false}
                                                    error={(cbseVerificationForm.touched.genderId && cbseVerificationForm.errors.genderId) ? cbseVerificationForm.errors.genderId : ""}
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <SelectInput
                                                    name="casteId"
                                                    labelText="Caste"
                                                    labelClass="required"
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.casteId}
                                                    onChange={onChangeCasteHandler}
                                                    menuItems={casteList}
                                                    valueKey="casteId"
                                                    textKey="casteName"
                                                    isDisabled={emptySelectedStudentId}
                                                    invalid={(cbseVerificationForm.touched.casteId && cbseVerificationForm.errors.casteId) ? true : false}
                                                    error={(cbseVerificationForm.touched.casteId && cbseVerificationForm.errors.casteId) ? cbseVerificationForm.errors.casteId : ""}
                                                />
                                                {(casteName === 'SC' || casteName === 'ST') && (
                                                    <>
                                                        <UploadFileInput
                                                            name="caste"
                                                            labelText="Please upload Caste Certificate"
                                                            helperText="File supports : .pdf,.PDF formats"
                                                            formgroupClassName="tw-mt-2 tw-mb-2"
                                                            labelClass={castEmail ? '' : 'required'}
                                                            value={cbseVerificationForm.values.caste}
                                                            onChange={fileUploadHandler}
                                                            hideUploadBtn={true}
                                                            canRemove={!emptySelectedStudentId}
                                                            isDisabled={cbseVerificationForm.values.castEmail || emptySelectedStudentId}
                                                            removeFileHandler={removeFileHandler}
                                                            invalid={(cbseVerificationForm.touched.caste && cbseVerificationForm.errors.caste) ? true : false}
                                                            error={(cbseVerificationForm.touched.caste && cbseVerificationForm.errors.caste) ? cbseVerificationForm.errors.caste : ""}
                                                        />
                                                        <div className="tw-text-center">
                                                            <span className="tw-font-bold tw-mb-2">Or</span>
                                                        </div>
                                                        <div className="tw-col-span-12">
                                                            <InputCheckbox
                                                                name="castEmail"
                                                                labelName="I Will mail the soft copy of the above certificates to admissioninfo@dpssecunderabad.in in a week's time"
                                                                formgroupClassName="tw-mb-0"
                                                                value={cbseVerificationForm.values.castEmail}
                                                                isDisabled={emptySelectedStudentId}
                                                                onChange={onChangeCasteEmailHandler}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {cbseVerificationForm.values.isClassAboveTenth && (
                                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                    <TextArea
                                                        name="subjectsRequired"
                                                        labelText="Subjects Registered"
                                                        formgroupClassName="tw-mb-3"
                                                        value={cbseVerificationForm.values.subjectsRequired}
                                                        onChange={cbseVerificationForm.handleChange}
                                                        isDisabled={true}
                                                    />
                                                    <RadioInputContainer
                                                        name="haveSkillSubject"
                                                        labelText="Have you registed for skill subject ?"
                                                        formgroupClassName={cbseVerificationForm.values.haveSkillSubject === 'YES' ? "tw-mb-1" : 'tw-mb-0'}
                                                        containerClassName="tw-flex"
                                                        inputContainerClassName="tw-ml-2"
                                                        radioOptions={yesNoRadioOptions}
                                                        value={cbseVerificationForm.values.haveSkillSubject}
                                                        onChange={onChangeSkillSubjectHndlr}
                                                        isDisabled={emptySelectedStudentId}
                                                    />
                                                    {cbseVerificationForm.values.haveSkillSubject === 'YES' && (
                                                        <TextInput
                                                            name="skillSubjectName"
                                                            placeHolder="Please specify"
                                                            labelClass="required"
                                                            formgroupClassName="tw-mb-0"
                                                            value={cbseVerificationForm.values.skillSubjectName}
                                                            onChange={cbseVerificationForm.handleChange}
                                                            isDisabled={emptySelectedStudentId}
                                                            invalid={(cbseVerificationForm.touched.skillSubjectName && cbseVerificationForm.errors.skillSubjectName) ? true : false}
                                                            error={(cbseVerificationForm.touched.skillSubjectName && cbseVerificationForm.errors.skillSubjectName) ? cbseVerificationForm.errors.skillSubjectName : ""}
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {!cbseVerificationForm.values.isClassAboveTenth && (
                                                <>
                                                    <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                        <SelectInput
                                                            name="secondLanguage"
                                                            labelText="IInd Language"
                                                            formgroupClassName="tw-mb-0"
                                                            value={cbseVerificationForm.values.secondLanguage}
                                                            onChange={cbseVerificationForm.handleChange}
                                                            menuItems={secondLanguageList}
                                                            isDisabled={emptySelectedStudentId}
                                                            valueKey="languageId"
                                                            textKey="languageName"
                                                        />
                                                    </div>
                                                    <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                        <SelectInput
                                                            name="thirdLanguage"
                                                            labelText="IIInd Language"
                                                            value={cbseVerificationForm.values.thirdLanguage}
                                                            onChange={cbseVerificationForm.handleChange}
                                                            menuItems={thirdLanguageList}
                                                            isDisabled={emptySelectedStudentId}
                                                            valueKey="languageId"
                                                            textKey="languageName"
                                                            formgroupClassName="tw-mb-2"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <SelectInput
                                                    name="fatherIncome"
                                                    labelText="Annual Income of Father"
                                                    value={cbseVerificationForm.values.fatherIncome}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    menuItems={masterIncomeResp}
                                                    isDisabled={emptySelectedStudentId}
                                                    valueKey="annualIncome"
                                                    textKey="annualIncome"
                                                    formgroupClassName="tw-mb-2"
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <SelectInput
                                                    name="motherIncome"
                                                    labelText="Annual Income of Mother"
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.motherIncome}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    menuItems={masterIncomeResp}
                                                    isDisabled={emptySelectedStudentId}
                                                    valueKey="annualIncome"
                                                    textKey="annualIncome"
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <RadioInputContainer
                                                    name="isAadharCardPresent"
                                                    labelText="Does the Candidate have Aadhar Details ?"
                                                    formgroupClassName="tw-mb-2"
                                                    inputContainerClassName="tw-mt-2"
                                                    radioOptions={yesNoRadioOptions}
                                                    value={cbseVerificationForm.values.isAadharCardPresent}
                                                    onChange={aadharcardChangeHandler}
                                                    isDisabled={emptySelectedStudentId}
                                                />
                                                {isAadharCardPresent === 'YES' && (
                                                    <>
                                                        <TextInputWithRegex
                                                            name="aadharCardNo"
                                                            labelText="Aadhar Number"
                                                            labelClass="required"
                                                            value={cbseVerificationForm.values.aadharCardNo}
                                                            onChange={cbseVerificationForm.handleChange}
                                                            onBlur={cbseVerificationForm.handleBlur}
                                                            isDisabled={emptySelectedStudentId}
                                                            maxLength={12}
                                                            allowedInputRegex="^[0-9]+$"
                                                            invalid={(cbseVerificationForm.touched.aadharCardNo && cbseVerificationForm.errors.aadharCardNo) ? true : false}
                                                            error={(cbseVerificationForm.touched.aadharCardNo && cbseVerificationForm.errors.aadharCardNo) ? cbseVerificationForm.errors.aadharCardNo : ""}
                                                        />
                                                        <UploadFileInput
                                                            name="studentAadhar"
                                                            labelText="Please upload Student Aadhar Card"
                                                            labelClass="required"
                                                            helperText="File supports : .pdf,.PDF formats"
                                                            formgroupClassName="tw-mb-0"
                                                            value={cbseVerificationForm.values.studentAadhar}
                                                            onChange={fileUploadHandler}
                                                            hideUploadBtn={true}
                                                            canRemove={!emptySelectedStudentId}
                                                            isDisabled={emptySelectedStudentId}
                                                            removeFileHandler={removeFileHandler}
                                                            invalid={(cbseVerificationForm.touched.studentAadhar && cbseVerificationForm.errors.studentAadhar) ? true : false}
                                                            error={(cbseVerificationForm.touched.studentAadhar && cbseVerificationForm.errors.studentAadhar) ? cbseVerificationForm.errors.studentAadhar : ""}
                                                        />
                                                    </>
                                                )}
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <TextIconInput
                                                    name="emailId"
                                                    labelText="Email Id"
                                                    labelClass="required"
                                                    isDisabled={emptySelectedStudentId}
                                                    value={cbseVerificationForm.values.emailId}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    onBlur={cbseVerificationForm.handleBlur}
                                                    invalid={(cbseVerificationForm.touched.emailId && cbseVerificationForm.errors.emailId) ? true : false}
                                                    error={(cbseVerificationForm.touched.emailId && cbseVerificationForm.errors.emailId) ? cbseVerificationForm.errors.emailId : ""}
                                                >
                                                    <i className="ri-mail-unread-line"></i>
                                                </TextIconInput>
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <PhoneInput
                                                    name="mobileNo"
                                                    labelText="Mobile Number"
                                                    labelClass="required"
                                                    isDisabled={emptySelectedStudentId}
                                                    value={cbseVerificationForm.values.mobileNo}
                                                    onChange={onChangePhoneInput}
                                                    onBlur={cbseVerificationForm.handleBlur}
                                                    invalid={(cbseVerificationForm.touched.mobileNo && cbseVerificationForm.errors.mobileNo) ? true : false}
                                                    error={(cbseVerificationForm.touched.mobileNo && cbseVerificationForm.errors.mobileNo) ? cbseVerificationForm.errors.mobileNo : ""}
                                                />
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <RadioInputContainer
                                                    name="isHandicapped"
                                                    labelText="Is the Candidate Handicap ?"
                                                    formgroupClassName="tw-mb-0"
                                                    radioOptions={yesNoRadioOptions}
                                                    value={cbseVerificationForm.values.isHandicapped}
                                                    onChange={onChangeHandicappedHndlr}
                                                    isDisabled={emptySelectedStudentId}
                                                />
                                                {isHandicapped === 'YES' && (
                                                    <>
                                                        <RadioInputContainer
                                                            name="handicappedFor"
                                                            formgroupClassName="tw-mt-2 tw-mb-0"
                                                            inputContainerClassName="tw-flex-wrap"
                                                            radioOptions={handicapOptions}
                                                            value={cbseVerificationForm.values.handicappedFor}
                                                            onChange={cbseVerificationForm.handleChange}
                                                            isDisabled={emptySelectedStudentId}
                                                            invalid={(cbseVerificationForm.touched.handicappedFor && cbseVerificationForm.errors.handicappedFor) ? true : false}
                                                            error={(cbseVerificationForm.touched.handicappedFor && cbseVerificationForm.errors.handicappedFor) ? cbseVerificationForm.errors.handicappedFor : ""}
                                                        />
                                                        {handicappedFor === 'Others' && (
                                                            <TextArea
                                                                name="handicappedRemarks"
                                                                formgroupClassName="tw-mt-2 tw-mb-0"
                                                                placeHolder="Handicap Remarks"
                                                                value={cbseVerificationForm.values.handicappedRemarks}
                                                                onChange={cbseVerificationForm.handleChange}
                                                                isDisabled={emptySelectedStudentId}
                                                                invalid={(cbseVerificationForm.touched.handicappedRemarks && cbseVerificationForm.errors.handicappedRemarks) ? true : false}
                                                                error={(cbseVerificationForm.touched.handicappedRemarks && cbseVerificationForm.errors.handicappedRemarks) ? cbseVerificationForm.errors.handicappedRemarks : ""}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                <RadioInputContainer
                                                    name="isMinority"
                                                    labelText="Minority"
                                                    formgroupClassName="tw-mb-0"
                                                    radioOptions={yesNoRadioOptions}
                                                    value={cbseVerificationForm.values.isMinority}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    isDisabled={emptySelectedStudentId}
                                                />
                                            </div>

                                            <div className="tw-col-span-12">
                                                <RadioInputContainer
                                                    name="medicalCondition"
                                                    labelText="Please Share any Medical Condition of your ward that warrant medical provision in school during board exams and hence take consent from CBSE"
                                                    formgroupClassName="tw-mb-0"
                                                    radioOptions={yesNoRadioOptions}
                                                    value={cbseVerificationForm.values.medicalCondition}
                                                    onChange={onChangeMedicalCondHndlr}
                                                    isDisabled={emptySelectedStudentId}
                                                />
                                                {medicalCondition === 'YES' && (
                                                    <TextArea
                                                        name="medicalRemarks"
                                                        formgroupClassName="tw-mt-2 tw-mb-0"
                                                        placeHolder="Medical Remarks"
                                                        value={cbseVerificationForm.values.medicalRemarks}
                                                        onChange={cbseVerificationForm.handleChange}
                                                        isDisabled={emptySelectedStudentId}
                                                        invalid={(cbseVerificationForm.touched.medicalRemarks && cbseVerificationForm.errors.medicalRemarks) ? true : false}
                                                        error={(cbseVerificationForm.touched.medicalRemarks && cbseVerificationForm.errors.medicalRemarks) ? cbseVerificationForm.errors.medicalRemarks : ""}
                                                    />
                                                )}
                                            </div>

                                            <div className="tw-col-span-6">
                                                <RadioInputContainer
                                                    name="hasSibling"
                                                    labelText="Does the Candidate have any siblings ?"
                                                    formgroupClassName="tw-mb-0"
                                                    radioOptions={yesNoRadioOptions}
                                                    value={cbseVerificationForm.values.hasSibling}
                                                    onChange={onChangeHaveSiblingHndlr}
                                                    isDisabled={emptySelectedStudentId}
                                                />
                                            </div>

                                            {cbseVerificationForm.values.hasSibling === 'YES' && (
                                                <div className="tw-col-span-6">
                                                    <RadioInputContainer
                                                        name="isSiblingStudyingInSameSchool"
                                                        labelText="Is Sibling Studying in the Same School ?"
                                                        formgroupClassName="tw-mb-0"
                                                        radioOptions={yesNoRadioOptions}
                                                        value={cbseVerificationForm.values.isSiblingStudyingInSameSchool}
                                                        onChange={onChangeSameSchoolSibHndlr}
                                                        isDisabled={emptySelectedStudentId}
                                                    />
                                                    {isSiblingStudyingInSameSchool === 'YES' && (
                                                        <>
                                                            <AutoSearchInputUpdated
                                                                labelText="Sibling Details"
                                                                formgroupClassName="tw-relative tw-mt-2 tw-mb-3"
                                                                name="siblingStudentId"
                                                                placeHolder="Search..."
                                                                onChange={onChangeSearchSiblingHndlr}
                                                                valueKey="studentId"
                                                                labelKey="studentCode"
                                                                labelHeader="Student Code"
                                                                subLabelKey="studentName"
                                                                subLabelHeader="Student Name"
                                                                filterIds={siblingFilterStudentId}
                                                                options={siblingsForRegistrationResp}
                                                                selected={selectedSiblingState}
                                                                selectedOptionCallbck={selectedSiblingCallbackHndlr}
                                                                isDisabled={emptySelectedStudentId}
                                                                invalid={(cbseVerificationForm.touched.siblingStudentId && cbseVerificationForm.errors.siblingStudentId) ? true : false}
                                                                error={(cbseVerificationForm.touched.siblingStudentId && cbseVerificationForm.errors.siblingStudentId) ? cbseVerificationForm.errors.siblingStudentId : ""}
                                                            >
                                                                <i className="ri-search-line tw-absolute tw-top-1/2 tw-right-3 tw--translate-y-1/2 tw-text-gray-400"></i>
                                                            </AutoSearchInputUpdated>
                                                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">
                                                                    <TextInput
                                                                        name="siblingBranchName"
                                                                        labelText="Sibling Branch Name"
                                                                        formgroupClassName="tw-mb-0"
                                                                        value={cbseVerificationForm.values.siblingBranchName}
                                                                        onChange={null}
                                                                        isDisabled={true}
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">
                                                                    <TextInput
                                                                        name="siblingCurriculumName"
                                                                        labelText="Sibling Curriculum Name"
                                                                        formgroupClassName="tw-mb-0"
                                                                        value={cbseVerificationForm.values.siblingCurriculumName}
                                                                        onChange={null}
                                                                        isDisabled={true}
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">
                                                                    <TextInput
                                                                        name="siblingSectionName"
                                                                        labelText="Sibling Class"
                                                                        formgroupClassName="tw-mb-0"
                                                                        value={cbseVerificationForm.values.siblingSectionName}
                                                                        onChange={null}
                                                                        isDisabled={true}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            <div className="tw-col-span-12 tw-mb-2 tw-mt-3">
                                                <div className="tw-bg-gray-100">
                                                    <div className="tw-grid tw-grid-cols-12 tw-px-3 tw-gap-3 tw-py-2 tw-mt-3">
                                                        <div className="tw-col-span-12">
                                                            <span className="tw-text-red-500 tw-font-bold">
                                                                * To fill up the details /correct the data , please select 'I REQUIRE CORRECTIONS 'option below.
                                                            </span>
                                                        </div>
                                                        <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                            <TextInput
                                                                name="correctedStudentName"
                                                                labelText="Name of the Candidate"
                                                                labelClass="required"
                                                                formgroupClassName="tw-mb-0"
                                                                value={cbseVerificationForm.values.correctedStudentName}
                                                                onChange={cbseVerificationForm.handleChange}
                                                                isDisabled={!(undertaking === 'CORRECTIONS') || emptySelectedStudentId}
                                                                invalid={(cbseVerificationForm.touched.correctedStudentName && cbseVerificationForm.errors.correctedStudentName) ? true : false}
                                                                error={(cbseVerificationForm.touched.correctedStudentName && cbseVerificationForm.errors.correctedStudentName) ? cbseVerificationForm.errors.correctedStudentName : ""}
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                            <TextInput
                                                                name="correctedFatherName"
                                                                labelText="Father's Name"
                                                                labelClass="required"
                                                                formgroupClassName="tw-mb-0"
                                                                value={cbseVerificationForm.values.correctedFatherName}
                                                                onChange={cbseVerificationForm.handleChange}
                                                                isDisabled={!(undertaking === 'CORRECTIONS') || emptySelectedStudentId}
                                                                invalid={(cbseVerificationForm.touched.correctedFatherName && cbseVerificationForm.errors.correctedFatherName) ? true : false}
                                                                error={(cbseVerificationForm.touched.correctedFatherName && cbseVerificationForm.errors.correctedFatherName) ? cbseVerificationForm.errors.correctedFatherName : ""}
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                            <TextInput
                                                                name="correctedMotherName"
                                                                labelText="Mother's Name"
                                                                labelClass="required"
                                                                formgroupClassName="tw-mb-0"
                                                                value={cbseVerificationForm.values.correctedMotherName}
                                                                onChange={cbseVerificationForm.handleChange}
                                                                isDisabled={!(undertaking === 'CORRECTIONS') || emptySelectedStudentId}
                                                                invalid={(cbseVerificationForm.touched.correctedMotherName && cbseVerificationForm.errors.correctedMotherName) ? true : false}
                                                                error={(cbseVerificationForm.touched.correctedMotherName && cbseVerificationForm.errors.correctedMotherName) ? cbseVerificationForm.errors.correctedMotherName : ""}
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-6">
                                                            <DateInput
                                                                name="correctedDob"
                                                                labelText="Date of Birth"
                                                                labelClass="required"
                                                                value={cbseVerificationForm.values.correctedDob}
                                                                onChange={cbseVerificationForm.handleChange}
                                                                maxDate={Student_Dob_MaxDate_YYYYMMDD}
                                                                isDisabled={!(undertaking === 'CORRECTIONS') || emptySelectedStudentId}
                                                                invalid={(cbseVerificationForm.touched.correctedDob && cbseVerificationForm.errors.correctedDob) ? true : false}
                                                                error={(cbseVerificationForm.touched.correctedDob && cbseVerificationForm.errors.correctedDob) ? cbseVerificationForm.errors.correctedDob : ""}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="tw-col-span-12">
                                                <RadioInputContainer
                                                    name="undertaking"
                                                    labelText="Undertaking(Tick the Appropriate Option)"
                                                    labelClassName="tw-font-bold"
                                                    formgroupClassName="tw-mb-0"
                                                    inputContainerClassName="tw-flex-col"
                                                    radioOptions={undertakingOptions}
                                                    value={cbseVerificationForm.values.undertaking}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    isDisabled={emptySelectedStudentId}
                                                />
                                            </div>

                                            {cbseVerificationForm.values.isClassAboveTenth && (
                                                <>
                                                    <div className="tw-col-span-6">
                                                        <TextInput
                                                            name="boardRollNo"
                                                            labelText="Class X Board Roll No."
                                                            labelClass="required"
                                                            formgroupClassName="tw-mb-0"
                                                            value={cbseVerificationForm.values.boardRollNo}
                                                            onChange={cbseVerificationForm.handleChange}
                                                            isDisabled={emptySelectedStudentId}
                                                            invalid={(cbseVerificationForm.touched.boardRollNo && cbseVerificationForm.errors.boardRollNo) ? true : false}
                                                            error={(cbseVerificationForm.touched.boardRollNo && cbseVerificationForm.errors.boardRollNo) ? cbseVerificationForm.errors.boardRollNo : ""}
                                                        />
                                                    </div>
                                                    <div className="tw-col-span-6">
                                                        <SelectInput
                                                            name="boardName"
                                                            labelText="Class X Board Name"
                                                            formgroupClassName="tw-mb-2"
                                                            labelClass="required"
                                                            value={cbseVerificationForm.values.boardName}
                                                            onChange={cbseVerificationForm.handleChange}
                                                            menuItems={boardNames}
                                                            valueKey="name"
                                                            textKey="name"
                                                            isDisabled={emptySelectedStudentId}
                                                            invalid={(cbseVerificationForm.touched.boardName && cbseVerificationForm.errors.boardName) ? true : false}
                                                            error={(cbseVerificationForm.touched.boardName && cbseVerificationForm.errors.boardName) ? cbseVerificationForm.errors.boardName : ""}
                                                        />
                                                        {cbseVerificationForm.values.boardName === 'Others' && (
                                                            <TextInput
                                                                name="boardOtherName"
                                                                placeHolder="Specify Board Name"
                                                                labelClass="required"
                                                                formgroupClassName="tw-mb-0"
                                                                value={cbseVerificationForm.values.boardOtherName}
                                                                onChange={cbseVerificationForm.handleChange}
                                                                isDisabled={emptySelectedStudentId}
                                                                invalid={(cbseVerificationForm.touched.boardOtherName && cbseVerificationForm.errors.boardOtherName) ? true : false}
                                                                error={(cbseVerificationForm.touched.boardOtherName && cbseVerificationForm.errors.boardOtherName) ? cbseVerificationForm.errors.boardOtherName : ""}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-8">
                                                        <UploadFileInput
                                                            name="marksSheet"
                                                            labelText="Please upload class X Board Certificate"
                                                            labelClass={documentMail ? "" : "required"}
                                                            value={cbseVerificationForm.values.marksSheet}
                                                            onChange={fileUploadHandler}
                                                            hideUploadBtn={true}
                                                            canRemove={true}
                                                            isDisabled={emptySelectedStudentId}
                                                            removeFileHandler={removeFileHandler}
                                                            invalid={(cbseVerificationForm.touched.marksSheet && cbseVerificationForm.errors.marksSheet) ? true : false}
                                                            error={(cbseVerificationForm.touched.marksSheet && cbseVerificationForm.errors.marksSheet) ? cbseVerificationForm.errors.marksSheet : ""}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Document submission section */}
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-4">
                                            <div className="tw-col-span-12">
                                                <span className="tw-font-bold">Please submit the following</span>
                                            </div>
                                            <div className="tw-col-span-12 tw-m-0">
                                                <span className="tw-text-red-500 tw-font-bold">
                                                    File supports : .pdf,.PDF formats
                                                </span>
                                            </div>
                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-8">
                                                <UploadFileInput
                                                    name="requestLetter"
                                                    labelText="1.Letter of request addressed to Principal for Correction"
                                                    labelClass={documentMail ? "" : "required"}
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.requestLetter}
                                                    onChange={fileUploadHandler}
                                                    hideUploadBtn={true}
                                                    canRemove={!emptySelectedStudentId}
                                                    isDisabled={documentMail || emptySelectedStudentId}
                                                    removeFileHandler={removeFileHandler}
                                                    invalid={(cbseVerificationForm.touched.requestLetter && cbseVerificationForm.errors.requestLetter) ? true : false}
                                                    error={(cbseVerificationForm.touched.requestLetter && cbseVerificationForm.errors.requestLetter) ? cbseVerificationForm.errors.requestLetter : ""}
                                                />
                                            </div>
                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-8">
                                                <UploadFileInput
                                                    name="affidavit"
                                                    labelText="2.Notary affidavit to the effect of correction required(any denomination of stamp amount)"
                                                    labelClass={documentMail ? "" : "required"}
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.affidavit}
                                                    onChange={fileUploadHandler}
                                                    hideUploadBtn={true}
                                                    canRemove={!emptySelectedStudentId}
                                                    isDisabled={documentMail || emptySelectedStudentId}
                                                    removeFileHandler={removeFileHandler}
                                                    invalid={(cbseVerificationForm.touched.affidavit && cbseVerificationForm.errors.affidavit) ? true : false}
                                                    error={(cbseVerificationForm.touched.affidavit && cbseVerificationForm.errors.affidavit) ? cbseVerificationForm.errors.affidavit : ""}
                                                />
                                            </div>
                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-8">
                                                <UploadFileInput
                                                    name="evidenceProof"
                                                    labelText="3.Proof of evidence ( Date of Birth or AAdhar or Passport)"
                                                    labelClass={documentMail ? "" : "required"}
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.evidenceProof}
                                                    onChange={fileUploadHandler}
                                                    hideUploadBtn={true}
                                                    canRemove={!emptySelectedStudentId}
                                                    isDisabled={documentMail || emptySelectedStudentId}
                                                    removeFileHandler={removeFileHandler}
                                                    invalid={(cbseVerificationForm.touched.evidenceProof && cbseVerificationForm.errors.evidenceProof) ? true : false}
                                                    error={(cbseVerificationForm.touched.evidenceProof && cbseVerificationForm.errors.evidenceProof) ? cbseVerificationForm.errors.evidenceProof : ""}
                                                />
                                            </div>
                                            <div className="tw-col-span-12">
                                                <span className="tw-font-bold">Or</span>
                                                <div className="tw-col-span-12">
                                                    <InputCheckbox
                                                        name="documentMail"
                                                        labelName="I Will mail the soft copy of the above certificates to admissioninfo@dpssecunderabad.in in a week's time"
                                                        formgroupClassName="form-check-green tw-mb-0 tw-mt-2"
                                                        value={cbseVerificationForm.values.documentMail}
                                                        onChange={onChangeDocumentMailHandler}
                                                        isDisabled={emptySelectedStudentId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="tw-col-span-12">
                                                <span className="tw-font-bold">
                                                    We parents of '{cbseVerificationForm.values.studentName}' studying in class '{cbseVerificationForm.values.sectionName}' have carefully checked the data. We confirm the data is correct. It can be submitted to CBSE. We understand after finalization of data, No corrections/changes will be accepted by CBSE.
                                                </span>
                                            </div>
                                            <div className="tw-col-span-12">
                                                <RadioInputContainer
                                                    name="signName"
                                                    labelText="Please upload Signature of Father/Mother"
                                                    formgroupClassName="tw-mb-0"
                                                    radioOptions={signRadioOptions}
                                                    value={cbseVerificationForm.values.signName}
                                                    onChange={cbseVerificationForm.handleChange}
                                                    isDisabled={emptySelectedStudentId}
                                                />
                                            </div>
                                            <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-5">
                                                <UploadFileInput
                                                    name="sign"
                                                    formgroupClassName="tw-mb-0"
                                                    value={cbseVerificationForm.values.sign}
                                                    onChange={fileImageUploadHandler}
                                                    helperText="Dimension for uploading signature should not be above 300 x 120 pixel size."
                                                    hideUploadBtn={true}
                                                    canRemove={!emptySelectedStudentId}
                                                    isDisabled={emptySelectedStudentId}
                                                    removeFileHandler={removeFileHandler}
                                                    invalid={(cbseVerificationForm.touched.sign && cbseVerificationForm.errors.sign) ? true : false}
                                                    error={(cbseVerificationForm.touched.sign && cbseVerificationForm.errors.sign) ? cbseVerificationForm.errors.sign : ""}
                                                />
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="tw-grid tw-grid-cols-12 tw-justify-center">
                                            <div className="tw-col-span-12 tw-flex tw-justify-center tw-gap-2">
                                                <Button
                                                    type="submit"
                                                    variant="secondary"
                                                    disabled={showApiLoader || emptySelectedStudentId}
                                                    onClick={resetHandler}
                                                >
                                                    Reset
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="primary"
                                                    disabled={showApiLoader || emptySelectedStudentId}
                                                >
                                                    Update
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="tw-grid tw-grid-cols-12 tw-justify-center tw-mt-2">
                                            <div className="tw-col-span-12 tw-flex tw-justify-center tw-gap-2">
                                                <Button
                                                    type="button"
                                                    className="tw-px-4 tw-py-2 tw-rounded tw-bg-transparent tw-text-gray-500 hover:tw-underline disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-cursor-pointer"
                                                    onClick={previewModalHandler}
                                                    disabled={!cbseVerificationForm.isValid || showApiLoader || emptySelectedStudentId}
                                                    style={{ textDecoration: 'underline', color: '#3B82F6' }}
                                                >
                                                    Preview
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="cbseverification-preview-modal"
                isOpen={previewModalState.showModal}
                toggle={closePreviewModalHndlr}
                modalTitle="Preview"
                modalSize="lg"

            >
                <PreviewCbseVerificationModal
                    studentDetails={previewModalState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default UpdateCbseVerificationPage;
