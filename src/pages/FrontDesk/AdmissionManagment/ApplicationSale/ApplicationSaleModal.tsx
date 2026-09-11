import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DateInput, InputCheckbox, NewPhoneInput, SelectInput, TextArea, TextIconInput, TextInput } from '../../../../Components/Common';
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from 'formik';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getCountriesAct, getCountryStateAct, getDistrictAct, getGenderListAct } from '../../../../store/masterdata/masterdataactions';
import { SourceTypes, admissionTypesForOthers, admissionTypesForDps, admissionSourceOptions } from './helper';
import { getAcademicLanguagesDataAct } from '../../../../store/mastersettings/instituteinfo/instituteinfoactions';
import * as Yup from 'yup';
import { addApplicationSale, editApplicationSale, getApplicationSaleById, getApplicationSaleClassList, getEnquirySourceListAct, getSecoundLanguagesList, getSubjectListForCBSEList, getSubjectListForCambridgeList, getThirdLanguagesListAct, resetApplicationSaleClassListAct, resetSubjectListForCBSEAct } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { getStreamList } from '../../../../store/academic/assignGroup/assigngroupactions';
import { toast } from 'react-toastify';
import { Current_Date, Current_Date_YYYYMMDD, Current_Year, MinDate_YYYYMMDD, Min_Date, getYearGapCurrentDate, getYyyyMmDdFormat } from '../../../../utility/dateutility';
import { setShowGlobalLoaderAct } from '../../../../store/global/globalslice';
import { getBranchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { getInstBranchesAct } from '../../../../store/mastersettings/branch/branchactions';

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    fullName: "",
    other: "",
    contactPerson: "",
    dob: "",
    contactNumber: "",
    genderId: "",
    emailId: "",
    admissionClassId: "",
    groupId: "",
    cambrigeLanguageId: "",
    secondLanguageId: "",
    secondLanguageName: "",
    thirdLanguageId: "",
    admissionType: "",
    leadSource: "",
    leadSourceRemarks: "",
    address: "",
    countryId: "",
    stateId: "",
    districtId: "",
    admissionSource: "NEW_ADMISSION",
    oldBranchId: "",
    optionalSubjects: []
}
const LanguagesForCambridge: any = [
    { id: 3, language: "HINDI" },
    { id: 7, language: "FRENCH" },
    { id: 37, language: "SPANISH" },
]

const ApplicationSaleModal = (props: any) => {

    const dispatch = useDispatch();

    const [initialState, setInitialState] = useState(initialValues);

    const [curriculumName, setCurriculumName] = useState('');
    const [className, setClassName] = useState('');

    const [selectedSubjects, setSelectedSubjects] = useState<any>([]);

    const [showLanguageSelect, setShowLanguageSelect] = useState(false);

    const [subjectsCBSE, setSubjectsCBSE] = useState<any>([]);
    const [languageForCambridgeState, setLanguageForCambridgeState] = useState<any>();
    const [academicYearListData, setAcademicYearListData] = useState<any>();


    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        applicationSaleListResp,
        applicationSaleByIdResp,
        applicationSaleClassListResp,
        subjectListForCBSEResp,
        subjectListForCambridgeResp,
        secoundLanguageResp,
        thirdLanguageResp,
        addApplicationSaleResp,
        editApplicationSaleResp,
        countriesResp,
        districtResp,
        countryStateResp,
        genderListResp,
        academicLanguages,
        streamListResp,
        showApiLoader,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        branchListResp,
        currentInstCodeResp: instituteCode,
        enquirySourceListResp
    }: any = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, instituteInfo, branchAcademics, appData, masterData, feeConcession, feeCollections, applicationSale, globalData, branch }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            applicationSaleListResp: applicationSale.applicationSaleListResp,
            applicationSaleByIdResp: applicationSale.applicationSaleByIdResp,
            applicationSaleClassListResp: applicationSale.applicationSaleClassListResp,
            subjectListForCBSEResp: applicationSale.subjectListForCBSEResp,
            subjectListForCambridgeResp: applicationSale.subjectListForCambridgeResp,
            secoundLanguageResp: applicationSale.secoundLanguageResp,
            thirdLanguageResp: applicationSale.thirdLanguageResp,
            addApplicationSaleResp: applicationSale.addApplicationSaleResp,
            editApplicationSaleResp: applicationSale.editApplicationSaleResp,
            streamListResp: assignGroupInfo.streamListResp,
            countriesResp: masterData.countriesResp,
            districtResp: masterData.districtResp,
            countryStateResp: masterData.countryStateResp,
            genderListResp: masterData.genderListResp,
            showApiLoader: globalData.showApiLoader,
            academicLanguages: instituteInfo.academicLanguages,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            branchListResp: branch.branchListResp,
            currentInstCodeResp: appData.currentInstCodeResp,
            enquirySourceListResp: applicationSale.enquirySourceListResp,
        }),
        shallowEqual
    );


    const validationSchema = Yup.object().shape({
        academicYearId: Yup.string().required('Select Academic Year'),
        curriculumId: Yup.string().required('Select Curriculum'),
        fullName: Yup.string().required('Enter Student Name'),
        contactPerson: Yup.string().required('Enter Parent Name'),
        dob: Yup.date().min(MinDate_YYYYMMDD, `DOB should be more than ${Min_Date}.`)
            .max(Current_Date_YYYYMMDD, `Can not be future Date.`).required("Select dob."),
        contactNumber: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required('Enter Contact Number'),
        genderId: Yup.string().required('Select Gender'),
        emailId: Yup.string().email().required('Enter Email Id'),
        admissionClassId: Yup.string().required('Select Class'),
        leadSource: Yup.string().required('Select Source'),
        admissionSource: Yup.string().required('Select Source'),
        oldBranchId: Yup.string().nullable().when("admissionSource", (admissionSource, schema) => {
            if (admissionSource === "OLD_ADMISSION") {
                return schema.required("Branch is Required");
            }
            return schema.notRequired();
        }),

        secondLanguageId: Yup.string().nullable().when("admissionClassId", (classId, schema) => {

            if (!checkHigherClass(classId) && secoundLanguageList?.length) {
                return schema.required("Select Secound Language")
            }
        }),
        thirdLanguageId: Yup.string().nullable().test(
            "isThirdLanguageRequired",
            "Select Third Language",
            (value: any, context: any) => {
                const { admissionClassId, secondLanguageName } = context?.parent || {};

                if (
                    curriculumName === "CBSE" &&
                    !checkHigherClass(admissionClassId) &&
                    !!secondLanguageName && thirdLanguageResp?.data.length > 0
                ) {
                    if (secondLanguageName !== "TELUGU") {
                        return !!value;
                    } else if (checkThirdLanguage(admissionClassId)) {
                        return !!value;
                    }
                }
                return true;
            }
        ),
        groupId: Yup.string().nullable().when("admissionClassId", (classId, schema) => {
            if (+ApplicationDetailsForm.values.curriculumId === 1 && checkHigherClass(classId)) {
                return schema.required("Select Group")
            }
        }),
        cambrigeLanguageId: Yup.string().nullable().when("admissionClassId", (classId, schema) => {
            if (checkHigherClass(classId) && showLanguageSelect) {
                return schema.required("Select language")
            }
        }),
        admissionType: Yup.string().nullable().when("admissionClassId", (classId, schema) => {

            if (+ApplicationDetailsForm.values.curriculumId === 1) {
                return schema.required('Select Admission Type')
            }
            // then:Yup.string().required("Select Secound Language Id")
        }),
        address: Yup.string().required('Enter Address'),
        countryId: Yup.string().nullable().required('Select Country'),
        stateId: Yup.string().nullable().when('countryId', (countryId, schema) => {
            if (countryName(countryId) === "India") {
                return schema.required("State is required")
            }
        }),
        districtId: Yup.string().nullable().when('stateId', (stateId, schema) => {
            if (stateName(stateId) === "Telangana") {
                return schema.required("District is required")
            }
        }),
        leadSourceRemarks: Yup.string().when('leadSource', {
            is: (val: string) => val === "OTHERS",
            then: (schema) => schema.required('Please enter text'),
            otherwise: (schema) => schema.notRequired(),
        }),
    })




    const ApplicationDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialState,
        validationSchema,
        onSubmit: (values) => {
            dispatch(setShowGlobalLoaderAct(true));
            let payload = {
                instituteId: instituteId,
                branchId: branchId,
                academicYearId: values.academicYearId,
                curriculumId: values.curriculumId,
                fullName: values.fullName,
                dob: values.dob,
                contactNumber: values.contactNumber,
                genderId: values.genderId,
                emailId: values.emailId,
                contactPerson: values.contactPerson,
                admissionClassId: values.admissionClassId,
                secondLanguageId: values.secondLanguageId,
                thirdLanguageId: values.thirdLanguageId ? values.thirdLanguageId?.toString() : null,
                admissionType: values.admissionType,
                leadSource: values.leadSource,
                leadSourceRemarks: values.leadSourceRemarks,
                address: values.address,
                countryId: values.countryId,
                groupId: values.groupId,
                stateId: values.stateId,
                districtId: values.districtId,
                admissionSource: values.admissionSource,
                oldBranchId: values.oldBranchId,
                mode: "Offline"
            }
            
            if (curriculumName === "CBSE") {
                let optionalSubjects: any = {};
                // values.optionalSubjects.map((sub: any, index: number) => { optionalSubjects[`optionalSubj${index + 1}Id`] = +sub.subjectId })
                let payloadCBSE = { ...payload, ...optionalSubjects };
                if (props.applicationId) {
                    dispatch(editApplicationSale(generateActionPayload('edit_application_sale', { applicationId: props.applicationId }, payloadCBSE)));
                }
                else {
                    dispatch(addApplicationSale(generateActionPayload('add_application_sale', undefined, payloadCBSE)));
                }
            }
            else if (curriculumName === "CAMBRIDGE INTERNATIONAL") {
                let payloadCambridge;
                if (checkHigherClass(payload?.admissionClassId) && showLanguageSelect && languageForCambridgeState) {
                    payloadCambridge = {
                        ...payload,
                        subjectIds: selectedSubjects,
                        igcseLanguageId: null,
                        cambrigeLanguage: languageForCambridgeState,
                    };
                } else {
                    payloadCambridge = {
                        ...payload,
                        subjectIds: selectedSubjects,
                        igcseLanguageId: null,
                    };
                }
                if (checkHigherClass(values.admissionClassId) && subjectForCambridge?.optionalSubjects.length > 0) {
                    if (+(payloadCambridge?.subjectIds.length) === 4) {
                        if (props.applicationId) {
                            dispatch(editApplicationSale(generateActionPayload('edit_application_sale', { applicationId: props.applicationId }, payloadCambridge)));
                        }
                        else {
                            dispatch(addApplicationSale(generateActionPayload('add_application_sale', undefined, payloadCambridge)));
                        }
                    }
                }
                else {
                    if (props.applicationId) {
                        dispatch(editApplicationSale(generateActionPayload('edit_application_sale', { applicationId: props.applicationId }, payloadCambridge)));
                    }
                    else {
                        dispatch(addApplicationSale(generateActionPayload('add_application_sale', undefined, payloadCambridge)));
                    }
                }

            } else {
                if (!props.applicationId) {
                    dispatch(addApplicationSale(generateActionPayload('add_application_sale', undefined, payload)));
                } else {
                    dispatch(editApplicationSale(generateActionPayload('edit_application_sale', { applicationId: props.applicationId }, payload)));
                }
            }
        }
    })

    function fetchEnquirySourceList() {
        dispatch(getEnquirySourceListAct(generateActionPayload("get_enquiry_source_list", undefined, {})));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: ApplicationDetailsForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const ChangeHandler = (event: any) => {
        ApplicationDetailsForm.handleChange(event);
        const { academicYearId, curriculumId, admissionClassId, countryId } = ApplicationDetailsForm.values;
        const { name, value } = event.target;

        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            ApplicationDetailsForm.setValues((prev: any) => ({ ...prev, [name]: value, admissionType: "", admissionClassId: "", secondLanguageId: "", dob: "", curriculumId: "" }))
        }
        else if (name === "curriculumId") {
            dispatch(resetApplicationSaleClassListAct(undefined));
            setCurriculumName(brchCurriculumResp.data.find((curr: any) => curr.branchCurriculumId === +value)?.curriculumName);
            ApplicationDetailsForm.setValues((prev: any) => ({ ...prev, admissionType: "", admissionClassId: "", secondLanguageId: "", dob: "", curriculumId: value }))
            // const payload = { instituteId: instituteId, branchId: branchId, curriculumId: value, academicYearId: academicYearId };
            // dispatch(getApplicationSaleClassList(generateActionPayload("get_application_sale_class_list", undefined, payload)));
        }
        else if (name === "admissionClassId") {
            const { dob, admissionType } = ApplicationDetailsForm.values;
            const selectedClass = applicationSaleClassListResp?.data.find((cls: any) => cls.classId === +value);
            dispatch(resetSubjectListForCBSEAct(undefined));
            // if (new Date(selectedClass.ageLimit) < new Date(dob)) {
            //     ApplicationDetailsForm.setFieldValue('admissionClassId', "")
            //     toast.error('Admission is not available for the selected age');
            //     return;
            // }
            if (curriculumName === "CBSE" && admissionType === "Residential" && selectedClass.hostelFacility.toLowerCase() === 'no') {
                ApplicationDetailsForm.setFieldValue('admissionClassId', "")
                toast.error('Hostel Facility is not available for this class')
                return;
            }
            // if (selectedClass?.available?.toLowerCase() === "no") {
            //     ApplicationDetailsForm.setFieldValue('admissionClassId', "")
            //     toast.error('Admission is not available for this class');
            //     return;
            // }
            if (curriculumName === "CBSE" && checkHigherClass(value)) {
                ApplicationDetailsForm.setFieldValue('groupId', "")
                ApplicationDetailsForm.setFieldValue('optionalSubjects', [])
                const payload = { academicYearId: academicYearId, curriculumId: curriculumId, classId: value, branchId: branchId, pageNo: 0, pageSize: 1000, sortBy: "streamGroupName", orderBy: "asc" }
                if (payload.classId && payload.curriculumId) {
                    dispatch(
                        getStreamList(
                            generateActionPayload("get_stream_list", undefined, payload)
                        )
                    );
                }
            }
            else if (curriculumName === "CAMBRIDGE INTERNATIONAL" && checkHigherClass(value)) {
                setSelectedSubjects([])
                const params = { instituteId: instituteId, classId: value, academicYearId: academicYearId };
                if (params.classId) {
                    dispatch(getSubjectListForCambridgeList(generateActionPayload('get_preadmission_subject_cambridge', undefined, params)));
                }
            }
            else {
                const params = { instituteId: instituteId, academicYearId: academicYearId, branchId: branchId, curriculumId: curriculumId, classId: value, type: "SECOND" }
                if (params.classId) {
                    dispatch(getSecoundLanguagesList(generateActionPayload('get_secound_language_list', undefined, params)));
                    dispatch(getThirdLanguagesListAct(generateActionPayload('get_secound_language_list', undefined, {
                        instituteId: instituteId, academicYearId: academicYearId, branchId: branchId,
                        curriculumId: curriculumId, classId: value, type: "THIRD"
                    })));
                }
                ApplicationDetailsForm.setFieldValue('secondLanguageId', "");
                ApplicationDetailsForm.setFieldValue('secondLanguageName', "");
                ApplicationDetailsForm.setFieldValue('thirdLanguageId', "");
            }
        }
        else if (name === "admissionType") {
            if (value === "Residential") {
                // ApplicationDetailsForm.setFieldValue('genderId', 1)
            }
        }
        else if (name === "dob") {
            if (ApplicationDetailsForm.values.curriculumId) {
                const payload = { instituteId: instituteId, branchId: branchId, curriculumId: curriculumId, academicYearId: academicYearId, dateOfBirth: value };
                dispatch(getApplicationSaleClassList(generateActionPayload("get_application_sale_class_list", undefined, payload)));
            }
        }
        else if (name === "countryId") {
            if (value) {
                dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: value })));
            }
        }
        else if (name === "stateId") {
            if (value) {
                dispatch(getDistrictAct(generateActionPayload("get_state_district", undefined, { countryId: countryId, stateId: value })));
            }
        }
        else if (name === "groupId") {
            const params = { instituteId: instituteId, classId: admissionClassId, groupId: value };
            dispatch(getSubjectListForCBSEList(generateActionPayload('get_preadmission_subject_cbse', undefined, params)));
        }
    }

    // const CheckBoxHandler = (subjectId: any) => {

    //     if (selectedSubjects.includes(subjectId)) {
    //         let leftSubjects = selectedSubjects.filter((sub: any) => sub !== subjectId);
    //         setSelectedSubjects(leftSubjects);
    //     }
    //     else {
    //         setSelectedSubjects([...selectedSubjects, subjectId]);
    //     }
    // }
    const CheckBoxHandler = (subjectId: any) => {
        let LanguagesubjectId: any;
        subjectForCambridge && subjectForCambridge?.optionalSubjects?.map((item: any) => {
            if (item?.subjectName === "LANGUAGES") {
                LanguagesubjectId = +item?.subjectId
            }
        })
        if (selectedSubjects.includes(subjectId)) {
            let leftSubjects = selectedSubjects.filter(
                (sub: any) => sub !== subjectId
            );
            if (leftSubjects?.includes(LanguagesubjectId)) {
                setShowLanguageSelect(true)
            } else {
                setShowLanguageSelect(false)
            }
            setSelectedSubjects(leftSubjects);
        } else {

            if (([...selectedSubjects, subjectId]?.includes(LanguagesubjectId)) && +([...selectedSubjects, subjectId].length) !== 5) {
                setShowLanguageSelect(true)
            } else {
                setShowLanguageSelect(false)
            }
            if (([...selectedSubjects, subjectId].length) > 4) {
                toast.warning("You can choose any four subjects")
            } else {
                setSelectedSubjects([...selectedSubjects, subjectId]);
            }
        }

    };

    const ContactNoChangeHandler = (contactNo: any) => {
        const contactNumber = contactNo.substring(2)
        ApplicationDetailsForm.setFieldValue('contactNumber', contactNumber);
    }

    const checkHigherClass = (classId: any) => {
        if (classId && applicationSaleClassListResp) {
            const classSequenceNo = +(applicationSaleClassListResp.data.find(
                (cls: any) => +cls.classId === +classId
            )?.classSequence?.toString())
            if (classSequenceNo >= 14) {
                return true
            } else {
                return false
            }
        }
    }

    const checkThirdLanguage = (classId: any) => {
        if (classId && applicationSaleClassListResp) {
            const classSequenceNo = +(applicationSaleClassListResp.data.find(
                (cls: any) => +cls.classId === +classId
            )?.classSequence?.toString())
            if (classSequenceNo === 8 || classSequenceNo === 9 || classSequenceNo === 10 ||
                classSequenceNo === 11
            ) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    };


    const lowerClass = (classId: any) => {
        if (classId && applicationSaleClassListResp) {
            switch (
            applicationSaleClassListResp.data.find(
                (cls: any) => +cls.classId === +classId
            )?.classShortName
            ) {
                case "EY-1(NUR)":
                case "EY-2(PP1/LKG)":
                case "EY-3(PP2/UKG)":
                case "I":
                case "II":
                case "III":
                case "IV":
                case "V":
                    return true;
                default:

                    return false;
            }
        }
    }
    const countryName = (countryId: any) => {
        return countriesResp && countriesResp.find((country: any) => country.id === +countryId)?.countryName;
    }
    const stateName = (stateId: any) => {
        return countryStateResp && countryStateResp.find((state: any) => state.id === +stateId)?.stateName;
    }

    const applicationSaleRef = useRef<any>({
        prevAddApplicationSaleResp: addApplicationSaleResp,
        prevEditApplicationSaleResp: editApplicationSaleResp,
        prevApplicationSaleByIdResp: applicationSaleByIdResp
    })

    useEffect(() => {
        fetchEnquirySourceList()
    }, [])

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (props.isOpen) {
            if (props.applicationId) {
                dispatch(getApplicationSaleById(generateActionPayload('get_application_sale_by_id', { applicationSaleId: props.applicationId })))
            }
            if (Array.isArray(data) && data.length > 0) {
                let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId;
                ApplicationDetailsForm.setFieldValue('academicYearId', yearId);
                if (!props.applicationId) {
                    getCurriculumApiCall({ academicYearId: yearId });
                }
            }
            dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc" })));
            const payload = { instituteId, pageNo: 0, pageSize: 10000, sortBy: "languageName", orderBy: "asc" };
            dispatch(
                getAcademicLanguagesDataAct(
                    generateActionPayload("get_academic_language_data", undefined, payload)
                )
            );
            dispatch(getCountriesAct(generateActionPayload("get_countries")));
            dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc" })));
        }
        else {
            ApplicationDetailsForm.resetForm();
            // setInitialState((prev: any) => ({ ...prev, curriculumId: "2" }));
        }
    }, [props.isOpen]);

    useEffect(() => {
        let subjects: any = [];
        if (subjectListForCBSEResp) {
            if (!props.applicationId) {
                subjectListForCBSEResp.data.optionalSubjects.map((sub: any) => {
                    subjects.push({
                        subjectId: ""
                    })
                })
                ApplicationDetailsForm.setFieldValue('optionalSubjects', subjects);
            }
            setSubjectsCBSE(subjectListForCBSEResp.data.optionalSubjects)
        }
    }, [subjectListForCBSEResp])

    useEffect(() => {
        const { prevAddApplicationSaleResp, prevEditApplicationSaleResp } = applicationSaleRef.current || {};
        if (addApplicationSaleResp && addApplicationSaleResp !== prevAddApplicationSaleResp) {
            props.toggle(undefined, true)
            toast.success('New Request Added for Application Sale !!');
            dispatch(setShowGlobalLoaderAct(false));
        }
        else if (editApplicationSaleResp && editApplicationSaleResp !== prevEditApplicationSaleResp) {
            props.toggle(undefined, true)
            toast.success('Application Sale Request Edited Successfully !!')
        }
        applicationSaleRef.current.prevAddApplicationSaleResp = addApplicationSaleResp;
        applicationSaleRef.current.prevEditApplicationSaleResp = editApplicationSaleResp;
    }, [addApplicationSaleResp, editApplicationSaleResp])

    useEffect(() => {
        const { prevApplicationSaleByIdResp } = applicationSaleRef.current;
        if (applicationSaleByIdResp && applicationSaleByIdResp !== prevApplicationSaleByIdResp) {
            let saleFormDetails = applicationSaleByIdResp.saleFormDetails;
            let curriculum = brchCurriculumResp.data.find((curr: any) => curr.branchCurriculumId === +saleFormDetails.curriculumId)?.curriculumName;
            setCurriculumName(curriculum)
            let optionalSubjects: any = [];
            saleFormDetails.optionalSubj1Id && optionalSubjects.push({ subjectId: saleFormDetails.optionalSubj1Id })
            saleFormDetails.optionalSubj2Id && optionalSubjects.push({ subjectId: saleFormDetails.optionalSubj2Id })
            setInitialState({ ...applicationSaleByIdResp.saleFormDetails, oldBranchId: applicationSaleByIdResp.saleFormDetails.oldBranchId, optionalSubjects: optionalSubjects });
            const payload = { instituteId: instituteId, branchId: branchId, curriculumId: saleFormDetails.curriculumId, academicYearId: saleFormDetails.academicYearId, dateOfBirth: saleFormDetails.dob };
            getCurriculumApiCall({ academicYearId: saleFormDetails.academicYearId });
            dispatch(getApplicationSaleClassList(generateActionPayload("get_application_sale_class_list", undefined, payload)));
            if (saleFormDetails.countryId) {
                dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: saleFormDetails.countryId })));
                if (saleFormDetails.stateId) {
                    dispatch(getDistrictAct(generateActionPayload("get_state_district", undefined, { countryId: saleFormDetails.countryId, stateId: saleFormDetails.stateId })));
                }
            }
            if (saleFormDetails.subjectIds) {
                let subjects: any = [];
                saleFormDetails.subjectIds.map((sub: any) => subjects.push(sub.subjectId))
                setSelectedSubjects(subjects);
            }
        }
    }, [applicationSaleByIdResp])

    useEffect(() => {
        if (applicationSaleClassListResp && applicationSaleByIdResp) {
            let saleFormDetails = applicationSaleByIdResp.saleFormDetails;
            if (curriculumName === "CBSE" && checkHigherClass(saleFormDetails.admissionClassId)) {
                const payload = { academicYearId: saleFormDetails.academicYearId, curriculumId: saleFormDetails.curriculumId, classId: saleFormDetails.admissionClassId, branchId: branchId, pageNo: 0, pageSize: 1000, sortBy: "streamGroupName", orderBy: "asc" }
                dispatch(
                    getStreamList(
                        generateActionPayload("get_stream_list", undefined, payload)
                    )
                );
                if (saleFormDetails.groupId) {
                    const params = { instituteId: instituteId, classId: saleFormDetails.admissionClassId, groupId: saleFormDetails.groupId };
                    dispatch(getSubjectListForCBSEList(generateActionPayload('get_preadmission_subject_cbse', undefined, params)));
                }
            }
            else if (curriculumName === "CAMBRIDGE INTERNATIONAL" && checkHigherClass(saleFormDetails.admissionClassId)) {
                const params = { instituteId: instituteId, classId: saleFormDetails.admissionClassId, academicYearId: saleFormDetails.academicYearId };
                dispatch(getSubjectListForCambridgeList(generateActionPayload('get_preadmission_subject_cambridge', undefined, params)));
            }
            else {
                const params = { instituteId: instituteId, academicYearId: saleFormDetails.academicYearId, branchId: branchId, curriculumId: saleFormDetails.curriculumId, classId: saleFormDetails.admissionClassId, type: "SECOND" }
                dispatch(getSecoundLanguagesList(generateActionPayload('get_secound_language_list', undefined, params)))
                dispatch(getThirdLanguagesListAct(generateActionPayload('get_secound_language_list', undefined, {
                    instituteId: instituteId, academicYearId: saleFormDetails.academicYearId, branchId: branchId,
                    curriculumId: saleFormDetails.curriculumId, classId: saleFormDetails.admissionClassId, type: "THIRD"
                })));
            }
        }
    }, [applicationSaleClassListResp, applicationSaleByIdResp])

    function onChangeSecondLangHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        const { data: secondLanguageList = [] } = secoundLanguageResp || {};
        const { data: thirdLanguageList = [] } = thirdLanguageResp || {};

        if (!value) {
            ApplicationDetailsForm.setValues(prevValues => ({
                ...prevValues,
                [name]: "",
                secondLanguageName: "",
                thirdLanguageId: ""
            }));
            return;
        }
        const selectedLang = secondLanguageList.find(item => item.languageId === +value);
        const languageName = selectedLang?.languageName || "";
        const updatedValues: any = {
            [name]: value,
            secondLanguageName: languageName,
            thirdLanguageId: ""
        };
        if (languageName !== "TELUGU") {
            const teluguLang = thirdLanguageList.find(item => item.languageName === "TELUGU");
            updatedValues.thirdLanguageId = teluguLang?.languageId || "";
        }
        ApplicationDetailsForm.setValues(prevValues => ({
            ...prevValues,
            ...updatedValues,
        }));
    }


    const {
        thirdLanguages,
        canShowThirdLanguage,
        isDisabledThirdLanguage
    } = useMemo(() => {
        const { data } = thirdLanguageResp || {};
        const { secondLanguageName, admissionClassId } = ApplicationDetailsForm.values;

        let filteredLanguages: any[] = [];
        let showThirdLanguage = false;
        let disableThirdLanguage = false;

        if (Array.isArray(data)) {
            if (secondLanguageName === "TELUGU") {
                filteredLanguages = data.filter(item => item.languageName !== "TELUGU");
            } else {
                filteredLanguages = data;
                disableThirdLanguage = true; // disable dropdown
            }
        }

        if (!checkHigherClass(admissionClassId) && curriculumName === "CBSE" && secondLanguageName) {
            if (secondLanguageName !== "TELUGU") {
                showThirdLanguage = true;
            } else {
                showThirdLanguage = checkThirdLanguage(admissionClassId);
            }
        }

        return {
            thirdLanguages: filteredLanguages,
            canShowThirdLanguage: showThirdLanguage,
            isDisabledThirdLanguage: disableThirdLanguage
        };
    }, [
        thirdLanguageResp,
        ApplicationDetailsForm.values.secondLanguageName,
        ApplicationDetailsForm.values.admissionClassId,
        curriculumName
    ]);



    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { data: classTypes } = applicationSaleClassListResp || {};
    const { data: languages } = academicLanguages || {};
    const { content: streamList } = streamListResp || {};
    const { data: subjectForCBSE } = subjectListForCBSEResp || {};
    const { data: subjectForCambridge } = subjectListForCambridgeResp || {};
    const { data: secoundLanguageList } = secoundLanguageResp || {};
    const { data: districtList } = districtResp || {};
    useEffect(() => {
        if (academicYearListResp) {
            setAcademicYearListData(academicYearList?.filter((item: any) => {
                return item?.yearStatus.toLowerCase() !== "old"
            }))
        }
    }, [academicYearListResp])

    useEffect(() => {
            if (ApplicationDetailsForm.values.admissionSource === "OLD_ADMISSION") {
                dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, {
                    pageSize: 100, pageNo: 0,
                })));
            }
        }, [ApplicationDetailsForm.values.admissionSource]);

    return (
        <div>
            <div className='row g-3 p-3'>
                <div className='col-6'>
                    <SelectInput
                        name="academicYearId"
                        value={ApplicationDetailsForm.values.academicYearId}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={academicYearListData || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelClass='required'
                        labelText='Academic Year'
                        isDisabled={props.applicationId}
                        invalid={ApplicationDetailsForm.touched.academicYearId &&
                            ApplicationDetailsForm.errors.academicYearId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.academicYearId &&
                            ApplicationDetailsForm.errors.academicYearId
                            ? ApplicationDetailsForm.errors.academicYearId
                            : ""}
                    />
                </div>
                <div className='col-6'>
                    <SelectInput
                        name="admissionSource"
                        value={ApplicationDetailsForm.values.admissionSource}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={admissionSourceOptions || []}
                        valueKey="id"
                        textKey="name"
                        labelClass='required'
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Admission Source'
                        invalid={ApplicationDetailsForm.touched.admissionSource &&
                            ApplicationDetailsForm.errors.admissionSource
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.admissionSource &&
                            ApplicationDetailsForm.errors.admissionSource
                            ? ApplicationDetailsForm.errors.admissionSource
                            : ""}
                    />
                </div>
                {ApplicationDetailsForm.values.admissionSource === "OLD_ADMISSION" && (
                    <div className='col-6'>
                        <SelectInput
                            name="oldBranchId"
                            value={ApplicationDetailsForm.values.oldBranchId}
                            onChange={ChangeHandler}
                            onBlur={ApplicationDetailsForm.handleBlur}
                            menuItems={Array.isArray(branchListResp.data) ? branchListResp.data : []}
                            valueKey="branchId"
                            textKey="branchName"
                            labelClass='required'
                            formgroupClassName="mb-0"
                            labelText='Branch'
                            invalid={ApplicationDetailsForm.touched.oldBranchId &&
                                ApplicationDetailsForm.errors.oldBranchId
                                ? true
                                : false}
                            error={ApplicationDetailsForm.touched.oldBranchId &&
                                ApplicationDetailsForm.errors.oldBranchId
                                ? ApplicationDetailsForm.errors.oldBranchId
                                : ""}
                        />
                    </div>
                )}
                <div className='col-6'>
                    <SelectInput
                        name="curriculumId"
                        value={ApplicationDetailsForm.values.curriculumId}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        labelClass='required'
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Curriculum'
                        invalid={ApplicationDetailsForm.touched.curriculumId &&
                            ApplicationDetailsForm.errors.curriculumId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.curriculumId &&
                            ApplicationDetailsForm.errors.curriculumId
                            ? ApplicationDetailsForm.errors.curriculumId
                            : ""}
                    />
                </div>

                {/* <div className='row mb-3'> */}
                <div className='col-6'>
                    <TextInput
                        name='fullName'
                        labelText={<span>Student Name <span className="fw-bold flash-text text-danger"> (As per  Aadhaar)</span></span>}
                        value={ApplicationDetailsForm.values.fullName}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        formgroupClassName='mb-0'
                        labelClass='required'
                        invalid={ApplicationDetailsForm.touched.fullName &&
                            ApplicationDetailsForm.errors.fullName
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.fullName &&
                            ApplicationDetailsForm.errors.fullName
                            ? ApplicationDetailsForm.errors.fullName
                            : ""}
                    />
                </div>
                <div className='col-6'>
                    <TextInput
                        name='contactPerson'
                        labelText={<span>Parent Name <span className="fw-bold flash-text text-danger"> (As per  Aadhaar)</span></span>}
                        value={ApplicationDetailsForm.values.contactPerson}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        formgroupClassName='mb-0'
                        labelClass='required'
                        invalid={ApplicationDetailsForm.touched.contactPerson &&
                            ApplicationDetailsForm.errors.contactPerson
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.contactPerson &&
                            ApplicationDetailsForm.errors.contactPerson
                            ? ApplicationDetailsForm.errors.contactPerson
                            : ""}
                    />
                </div>
                <div className='col-6'>
                    <DateInput
                        name={'dob'}
                        value={ApplicationDetailsForm.values.dob}
                        formgroupClassName="mb-0"
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        labelText={<span>DOB <span className="fw-bold flash-text text-danger"> (As per Date of Birth Certificate)</span></span>}
                        labelClass='required'
                        maxDate={Current_Date}
                        invalid={ApplicationDetailsForm.touched.dob &&
                            ApplicationDetailsForm.errors.dob
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.dob &&
                            ApplicationDetailsForm.errors.dob
                            ? ApplicationDetailsForm.errors.dob
                            : ""}
                    />
                </div>
                {/* </div> */}
                {/* <div className='row'> */}
                <div className='col-6'>
                    <NewPhoneInput
                        name="contactNumber"
                        labelText="Contact No (For SMS)"
                        value={ApplicationDetailsForm.values.contactNumber}
                        onChange={ContactNoChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        // formgroupClassName="mb-0"
                        // isDisabled={!edit}
                        labelClass='required'
                        // inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent phone_no' : ""}`}
                        invalid={(ApplicationDetailsForm.touched.contactNumber && ApplicationDetailsForm.errors.contactNumber) ? true : false}
                        error={(ApplicationDetailsForm.touched.contactNumber && ApplicationDetailsForm.errors.contactNumber) ? ApplicationDetailsForm.errors.contactNumber : ""}
                    />
                </div>

                <div className='col-6'>
                    <TextIconInput
                        name="emailId"
                        labelText="Email Id (For Communication)"
                        value={ApplicationDetailsForm.values.emailId}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        formgroupClassName='mb-0'
                        invalid={ApplicationDetailsForm.touched.emailId &&
                            ApplicationDetailsForm.errors.emailId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.emailId &&
                            ApplicationDetailsForm.errors.emailId
                            ? ApplicationDetailsForm.errors.emailId
                            : ""}
                        // onBlur={employeeCurrentJobForm.handleBlur}
                        // isReadOnly={!edit}
                        // inputClassName={`bg-transparent ${!edit ? 'border-0 border-bottom rounded-0' : ""}`}
                        labelClass='required'
                    >
                        <i className="ri-mail-unread-line"></i>
                    </TextIconInput>
                </div>
                {/* </div> */}
                {/* <div className='row mb-3'> */}
                {curriculumName === "CBSE" && <div className='col-6'>
                    <SelectInput
                        name="admissionType"
                        value={ApplicationDetailsForm.values.admissionType}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={instituteCode === "DPS" ? admissionTypesForDps : admissionTypesForOthers}
                        valueKey="id"
                        textKey="name"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelClass='required'
                        labelText='Admission Type'
                        invalid={ApplicationDetailsForm.touched.admissionType &&
                            ApplicationDetailsForm.errors.admissionType
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.admissionType &&
                            ApplicationDetailsForm.errors.admissionType
                            ? ApplicationDetailsForm.errors.admissionType
                            : ""}
                    />
                </div>}

                <div className='col-6'>
                    <SelectInput
                        name="genderId"
                        value={ApplicationDetailsForm.values.genderId}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={genderListResp?.data || []}
                        valueKey="genderId"
                        textKey="genderName"
                        labelClass='required'
                        // inputClassName="bg-light border-0"
                        // isDisabled={ApplicationDetailsForm.values.admissionType === "Residential"}
                        formgroupClassName="mb-0"
                        labelText='Gender'
                        invalid={ApplicationDetailsForm.touched.genderId &&
                            ApplicationDetailsForm.errors.genderId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.genderId &&
                            ApplicationDetailsForm.errors.genderId
                            ? ApplicationDetailsForm.errors.genderId
                            : ""}
                    />
                </div>
                {/* </div> */}
                {/* <div className='row mb-3'> */}
                <div className='col-6'>
                    <SelectInput
                        name="admissionClassId"
                        value={ApplicationDetailsForm.values.admissionClassId}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={classTypes || []}
                        valueKey="classId"
                        labelClass='required'
                        textKey="classShortName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Admission For Class'
                        invalid={ApplicationDetailsForm.touched.admissionClassId &&
                            ApplicationDetailsForm.errors.admissionClassId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.admissionClassId &&
                            ApplicationDetailsForm.errors.admissionClassId
                            ? ApplicationDetailsForm.errors.admissionClassId
                            : ""}
                    />
                </div>
                {
                    curriculumName === "CBSE" && checkHigherClass(ApplicationDetailsForm.values.admissionClassId) && <div className='col-6'>
                        <SelectInput
                            name="groupId"
                            value={ApplicationDetailsForm.values.groupId}
                            onChange={ChangeHandler}
                            onBlur={ApplicationDetailsForm.handleBlur}
                            menuItems={streamList || []}
                            valueKey="id"
                            labelClass='required'
                            textKey="shortName"
                            // inputClassName="bg-light border-0"
                            formgroupClassName="mb-0"
                            labelText='Group'
                            invalid={ApplicationDetailsForm.touched.groupId &&
                                ApplicationDetailsForm.errors.groupId
                                ? true
                                : false}
                            error={ApplicationDetailsForm.touched.groupId &&
                                ApplicationDetailsForm.errors.groupId
                                ? ApplicationDetailsForm.errors.groupId
                                : ""}
                        />
                        <p className='text-muted fs-13 pt-1 mb-0'>CORE SUBJECTS :<span>{subjectForCBSE?.mandatorySubjects.join(',')}</span></p>
                    </div>
                }

                {/* {
                    curriculumName === "CBSE" && ApplicationDetailsForm.values.groupId && checkHigherClass(ApplicationDetailsForm.values.admissionClassId) && <FormikProvider value={ApplicationDetailsForm}><FieldArray name="optionalSubjects">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }
                            return <>
                                {
                                    ApplicationDetailsForm.values.optionalSubjects && ApplicationDetailsForm.values.optionalSubjects.map((sub: any, index: number) => {
                                        const inputFieldErrors: any = ApplicationDetailsForm.errors.optionalSubjects && ApplicationDetailsForm.errors.optionalSubjects[index] || {};
                                        const inputFieldTouched: any = ApplicationDetailsForm.touched.optionalSubjects && ApplicationDetailsForm.touched.optionalSubjects[index] || {};
                                        return <div className='col-6' key={index}>
                                            <SelectInput
                                                name={`optionalSubjects[${index}].subjectId`}
                                                value={sub.subjectId}
                                                onChange={ChangeHandler}
                                                onBlur={ApplicationDetailsForm.handleBlur}
                                                menuItems={subjectsCBSE[index]?.subjects || []}
                                                valueKey="subjectId"
                                                textKey="subjectName"
                                                labelClass='required'
                                                // inputClassName="bg-light border-0"
                                                formgroupClassName="mb-0"
                                                labelText={`${subjectForCBSE?.mandatorySubjects.length + index + 1}th Subject`}
                                                invalid={inputFieldTouched.subjectId &&
                                                    inputFieldErrors.subjectId
                                                    ? true
                                                    : false}
                                                error={inputFieldTouched.subjectId &&
                                                    inputFieldErrors.subjectId
                                                    ? inputFieldErrors.subjectId
                                                    : ""}
                                            />
                                        </div>
                                    })
                                }

                            </>
                        }
                        }

                    </FieldArray>
                    </FormikProvider>
                } */}
                {
                    curriculumName === "CAMBRIDGE INTERNATIONAL" && checkHigherClass(ApplicationDetailsForm.values.admissionClassId) && <div className='col-12'>
                        <p className='my-1'>Choose any four subjects</p>
                        <div>
                            <InputCheckbox
                                name={"english"}
                                // labelName={shortName}
                                value={true}
                                onChange={() => { }}
                                isDisabled={true}
                                formgroupClassName="mb-0"
                            />
                            <label className='fs-18'>English</label>
                        </div>
                        {
                            subjectForCambridge && subjectForCambridge?.optionalSubjects.map((sub: any, index: number) => {
                                return <div key={index}>
                                    <InputCheckbox
                                        name={`${sub.subjectName}`}
                                        labelName={`${sub.subjectName}`}
                                        value={selectedSubjects.includes(sub.subjectId)}
                                        onChange={() => CheckBoxHandler(sub.subjectId)}
                                        formgroupClassName="mb-0"
                                    />
                                </div>
                            })
                        }
                    </div>
                }
                {
                    curriculumName === "CAMBRIDGE INTERNATIONAL" && checkHigherClass(
                        ApplicationDetailsForm.values.admissionClassId
                    ) && subjectForCambridge?.optionalSubjects.length > 0 && +(selectedSubjects?.length) !== 4 && <div className="text-danger">Must Select 4 subjects</div>
                }

                {curriculumName === "CAMBRIDGE INTERNATIONAL" && checkHigherClass(
                    ApplicationDetailsForm.values.admissionClassId
                ) && showLanguageSelect && <div className="col-12 col-md-6">
                        <label>Choose your language <span className="text-danger">*</span></label>
                        <SelectInput
                            name="cambrigeLanguageId"
                            value={
                                ApplicationDetailsForm?.values.cambrigeLanguageId
                            }
                            onChange={(e: any) => {
                                setLanguageForCambridgeState(e?.target?.value)
                                ApplicationDetailsForm.handleChange(e)
                            }}
                            labelClass='required'
                            onBlur={ApplicationDetailsForm.handleBlur}
                            menuItems={LanguagesForCambridge || []}
                            valueKey="id"
                            textKey="language"
                            invalid={ApplicationDetailsForm.touched.cambrigeLanguageId &&
                                ApplicationDetailsForm.errors.cambrigeLanguageId
                                ? true
                                : false}
                            error={ApplicationDetailsForm.touched.cambrigeLanguageId &&
                                ApplicationDetailsForm.errors.cambrigeLanguageId
                                ? ApplicationDetailsForm.errors.cambrigeLanguageId
                                : ""}
                        />

                    </div>}

                {
                    !checkHigherClass(ApplicationDetailsForm.values.admissionClassId) && secoundLanguageList?.length > 0 && <div className='col-6'>
                        <SelectInput
                            name="secondLanguageId"
                            value={ApplicationDetailsForm.values.secondLanguageId}
                            onChange={onChangeSecondLangHandler}
                            onBlur={ApplicationDetailsForm.handleBlur}
                            menuItems={secoundLanguageList || []}
                            valueKey="languageId"
                            textKey="languageName"
                            labelClass='required'
                            // inputClassName="bg-light border-0"
                            formgroupClassName="mb-0"
                            labelText='Second Language'
                            invalid={ApplicationDetailsForm.touched.secondLanguageId &&
                                ApplicationDetailsForm.errors.secondLanguageId
                                ? true
                                : false}
                            error={ApplicationDetailsForm.touched.secondLanguageId &&
                                ApplicationDetailsForm.errors.secondLanguageId
                                ? ApplicationDetailsForm.errors.secondLanguageId
                                : ""}
                        />
                    </div>
                }
                {
                    canShowThirdLanguage && <div className='col-6'>
                        <SelectInput
                            name="thirdLanguageId"
                            value={ApplicationDetailsForm.values.thirdLanguageId}
                            onChange={ApplicationDetailsForm.handleChange}
                            onBlur={ApplicationDetailsForm.handleBlur}
                            menuItems={thirdLanguages}
                            valueKey="languageId"
                            textKey="languageName"
                            labelClass={thirdLanguageResp?.data.length > 0 ? 'required' : ''}
                            // isDisabled={isDisabledThirdLanguage}
                            // inputClassName="bg-light border-0"
                            formgroupClassName="mb-0"
                            labelText='Third Language'
                            invalid={ApplicationDetailsForm.touched.thirdLanguageId &&
                                ApplicationDetailsForm.errors.thirdLanguageId
                                ? true
                                : false}
                            error={ApplicationDetailsForm.touched.thirdLanguageId &&
                                ApplicationDetailsForm.errors.thirdLanguageId
                                ? ApplicationDetailsForm.errors.thirdLanguageId
                                : ""}
                        />
                    </div>
                }

                <div className="col-12 col-sm-6">
                    <label>How were you informed about us?</label>
                    <SelectInput
                        name="leadSource"
                        value={
                            ApplicationDetailsForm.values.leadSource
                        }
                        onChange={ApplicationDetailsForm.handleChange}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={enquirySourceListResp || []}
                        valueKey="sourceName"
                        textKey="sourceName"
                        labelClass='required'
                        formgroupClassName='mb-0'
                        invalid={ApplicationDetailsForm.touched.leadSource &&
                            ApplicationDetailsForm.errors.leadSource
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.leadSource &&
                            ApplicationDetailsForm.errors.leadSource
                            ? ApplicationDetailsForm.errors.leadSource
                            : ""}
                    />
                </div>
                {ApplicationDetailsForm.values.leadSource === "OTHERS" && <div className="col-12">
                    {/* <label>Other</label> */}
                    <TextArea
                        name='leadSourceRemarks'
                        // labelText='Parent Name(As per  Aadhaar)'
                        value={ApplicationDetailsForm.values.leadSourceRemarks}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        formgroupClassName='mb-0'
                        labelClass='required'
                        labelText="Others"
                        maxLength={250}
                        invalid={ApplicationDetailsForm.touched.leadSourceRemarks &&
                            ApplicationDetailsForm.errors.leadSourceRemarks
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.leadSourceRemarks &&
                            ApplicationDetailsForm.errors.leadSourceRemarks
                            ? ApplicationDetailsForm.errors.leadSourceRemarks
                            : ""}
                    />
                </div>}

                {/* </div> */}
                {/* <div className='row mb-3'> */}
                <div className='col-12'>
                    <TextArea
                        name="address"
                        value={ApplicationDetailsForm.values.address}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        formgroupClassName="mb-0"
                        labelText="Residential Address"
                        labelClass='required'
                        helperText='Note : Please fill the complete address including H.No,Landmark,city,state and country in address columns'
                        invalid={ApplicationDetailsForm.touched.address &&
                            ApplicationDetailsForm.errors.address
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.address &&
                            ApplicationDetailsForm.errors.address
                            ? ApplicationDetailsForm.errors.address
                            : ""}
                    />
                </div>
                {/* </div> */}
                {/* <div className='row mb-4'> */}
                <div className='col-6'>
                    <SelectInput
                        name="countryId"
                        value={ApplicationDetailsForm.values.countryId}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={countriesResp || []}
                        valueKey="id"
                        textKey="countryName"
                        labelClass='required'
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='Country'
                        invalid={ApplicationDetailsForm.touched.countryId &&
                            ApplicationDetailsForm.errors.countryId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.countryId &&
                            ApplicationDetailsForm.errors.countryId
                            ? ApplicationDetailsForm.errors.countryId
                            : ""}
                    />
                </div>
                {countryName(ApplicationDetailsForm.values.countryId) === "India" && <div className='col-6'>
                    <SelectInput
                        name="stateId"
                        value={ApplicationDetailsForm.values.stateId}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={countryStateResp || []}
                        valueKey="id"
                        textKey="stateName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='State'
                        labelClass='required'
                        invalid={ApplicationDetailsForm.touched.stateId &&
                            ApplicationDetailsForm.errors.stateId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.stateId &&
                            ApplicationDetailsForm.errors.stateId
                            ? ApplicationDetailsForm.errors.stateId
                            : ""}
                    />
                </div>}
                {stateName(ApplicationDetailsForm.values.stateId) === "Telangana" && <div className='col-6'>
                    <SelectInput
                        name="districtId"
                        value={ApplicationDetailsForm.values.districtId}
                        onChange={ChangeHandler}
                        onBlur={ApplicationDetailsForm.handleBlur}
                        menuItems={districtList || []}
                        valueKey="districtId"
                        textKey="districtName"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        labelText='District'
                        labelClass='required'
                        invalid={ApplicationDetailsForm.touched.districtId &&
                            ApplicationDetailsForm.errors.districtId
                            ? true
                            : false}
                        error={ApplicationDetailsForm.touched.districtId &&
                            ApplicationDetailsForm.errors.districtId
                            ? ApplicationDetailsForm.errors.districtId
                            : ""}
                    />
                </div>}
            </div>
            {/* </div> */}
            <div className='row'>
                <div className='d- flex w-auto ms-auto mx-4 my-3'>
                    <button
                        type="submit"
                        className="btn btn-light px-4 me-3"
                        onClick={() => props.toggle()}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success px-4"
                        onClick={(event: any) => ApplicationDetailsForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Submit
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ApplicationSaleModal;
