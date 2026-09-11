import { useEffect, useRef, useState } from "react";
import * as Yup from 'yup';
import frame from "../../assets/images/frame.png";
import {
    DateInput,
    InputCheckbox,
    ModalContainerUpdated,
    NewPhoneInput,
    SelectInput,
    TextArea,
    TextIconInput,
    TextInput,
    TextInputGroup,
} from "../../Components/Common";
import { shallowEqual } from "react-redux";
import {
    getCountriesAct,
    getCountryStateAct,
    getDistrictAct,
    getGenderListAct,
} from "../../store/masterdata/masterdataactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import {
    addApplicationSale,
    createJodoOrder,
    getApplicationSaleClassList,
    getSecoundLanguagesList,
    getSubjectListForCBSEList,
    getSubjectListForCambridgeList,
    resetTransportAvalabilityStatus,
    resetSubjectListForCBSEAct,
    generateTokenForUserAct,
    resetApplicationSaleClassListAct,
    getAmountForApplicationSaleAct,
} from "../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import "./_abc.scss";
import { getDisplayAmountValue, parseQueryStringToObject } from "../../utility/commonutility";
import { useLocation } from "react-router-dom";
import { getStreamList } from "../../store/academic/assignGroup/assigngroupactions";
import { getBranchCurriculumAct } from "../../store/branchsettings/branchacademics/branchacademicsactions";
import fb from "../../assets/images/brands/fb.png";
import twitter from "../../assets/images/brands/tw.png";
import insta from "../../assets/images/brands/insta.png";
import google from "../../assets/images/brands/google+.png";
import footer from "../../assets/images/brands/footerlogo.jpg";
import { toast } from "react-toastify";
import { getInstBranchesAct } from "../../store/mastersettings/branch/branchactions";
import CIE from "../../assets/images/brands/CIE_LOGO.png";
import TermsAndCondition from "../FrontDesk/AdmissionManagment/ApplicationSaleOnline/TermsAndCondition";
import { Current_Date, getDdMmYyyyFormat, } from "../../utility/dateutility";
import { SourceTypes } from "../FrontDesk/AdmissionManagment/ApplicationSale/helper";
import RegistrationFormModal from "./RegistrationFormModal";
import { createPaymentPayload } from "./helper";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "../../utility/storageUtility";
import LocationSelectorModal from "./LocationSelectorModal";
import WarningModal from "./WarningModal";
import { getInstAcademicYearAct } from "../../store/mastersettings/instacademics/instacademicactions";
import { getApplicationDetailsByCurriculumAct, getRegistrationInstructionAct, setRegistrationInstructionAct } from "../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { getInstituteListAct } from "../../store/mastersettings/instituteinfo/instituteinfoactions";
import Email from "../../assets/imagesdps/authiconV1/login-2.png";
import { feePaymentAct } from "../../store/fee/feecollections/feecollectionactions";
import { WHATSAPP_LINK } from "../../Components/constants/common";
import Button from "../../Components/Common/Button";

const initialValue = {
    fullName: "",
    dob: "",
    contactNumber: "",
    other: "",
    genderId: "",
    emailId: "",
    admissionClassId: "",
    secondLanguageId: "",
    residentialAddress: "",
    contactPerson: "",
    source: "",
    address: "",
    countryId: "",
    stateId: "",
    cambrigeLanguageId: "",
    districtId: "",
    amount: "0",
    groupId: "",
    optionalSubjects: [],
    isTransportFacility: false,
    location: "",
    longitude: "",
    latitude: "",
    transportAccept: ""
};
const LanguagesForCambridge: any = [
    { id: 3, language: "HINDI" },
    { id: 7, language: "FRENCH" },
    { id: 37, language: "SPANISH" },
]

const TransportOptions = [
    {
        id: "accept",
        name: 'I agree to proceed further irrespective of transport facility'
    },
    {
        id: "denay",
        name: 'I want to verify whether transport is available for my locality'
    },

]

const simpleOptions = [
    {
        id: "yes",
        name: "Yes"
    },
    {
        id: "no",
        name: "No"
    }
]

const ApplicationSaleParent = () => {
    const params = useLocation().search;

    const queryParamsObject = parseQueryStringToObject(params);

    const [initialValues, setInitialValues] = useState(initialValue);

    const dispatch = useAppDispatch();

    const [selectedSubjects, setSelectedSubjects] = useState<any>([]);
    const [showLanguageSelect, setShowLanguageSelect] = useState(false);
    const [curriculumName, setCurriculumName] = useState("");
    const [subjectsCBSE, setSubjectsCBSE] = useState<any>([]);
    const [selectedBranch, setSelectedBranch] = useState<any>(undefined);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [languageForCambridgeState, setLanguageForCambridgeState] = useState<any>();
    const [academicYearName, setAcademicYearName] = useState('');
    const [instituteName, setInstituteName] = useState('');
    const selectedLocation = useRef<any>(null);
    const isCcAvenuPayment = useRef(false);
    const [paymentInfoState, setPaymentInfoState] = useState({
        ccavenueUrl: "",
        payloadData: "",
        accessCode: "",
    });
    useEffect(() => {
        const formData = new FormData();
        formData.append("clientName","WEB")
        formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
        removeLocalStorage('accesstoken')
        dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
        return () => {
            dispatch(resetTransportAvalabilityStatus(undefined));
            dispatch(setRegistrationInstructionAct(undefined));
        }
    }, []);

    const {
        brchCurriculumResp,
        genderListResp,
        applicationSaleClassListResp,
        addApplicationSaleResp,
        subjectListForCambridgeResp,
        secoundLanguageResp,
        applicationSaleError,
        countriesResp,
        countryStateResp,
        districtResp,
        streamListResp,
        branchListResp,
        showApiLoader,
        generateTokenForUserResp,
        subjectListForCBSEResp,
        transportAvalabilityStatus,
        createJodoOrderResp,
        getAmountForApplicationSaleResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        academicYearListResp,
        instituteListResp,
        feePaymentResp,
        getApplicationDetailsByCurriculumResp,
    } = useAppSelector(
        ({
            assignGroupInfo,
            masterData,
            branchAcademics,
            appData,
            branch,
            applicationSale,
            globalData,
            instAcademics,
            instituteInfo,
            feeCollections,
            admissionAvailabilityRequest,
        }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            genderListResp: masterData.genderListResp,
            applicationSaleClassListResp:
                applicationSale.applicationSaleClassListResp,
            addApplicationSaleResp: applicationSale.addApplicationSaleResp,
            subjectListForCambridgeResp: applicationSale.subjectListForCambridgeResp,
            secoundLanguageResp: applicationSale.secoundLanguageResp,
            getAmountForApplicationSaleResp: applicationSale.getAmountForApplicationSaleResp,
            applicationSaleError: applicationSale.applicationSaleError,
            generateTokenForUserResp: applicationSale.generateTokenForUserResp,
            countriesResp: masterData.countriesResp,
            countryStateResp: masterData.countryStateResp,
            districtResp: masterData.districtResp,
            branchListResp: branch.branchListResp,
            streamListResp: assignGroupInfo.streamListResp,
            subjectListForCBSEResp: applicationSale.subjectListForCBSEResp,
            transportAvalabilityStatus: applicationSale.transportAvalabilityStatus,
            createJodoOrderResp: applicationSale.createJodoOrderResp,
            showApiLoader: globalData.showApiLoader,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            academicYearListResp: instAcademics.academicYearListResp,
            instituteListResp: instituteInfo.instituteListResp,
            feePaymentResp: feeCollections.feePaymentResp,
            getApplicationDetailsByCurriculumResp: admissionAvailabilityRequest.getApplicationDetailsByCurriculumResp,
        }),
        shallowEqual
    );

    const [openRegistrationModal, setOpenRegistrationModal] = useState({
        showModal: false,
        studentRegNo: ""
    });
    const [warningModal, setWarningModal] = useState({
        showModal: false,
        payload: ""
    });

    const toggleRegistrationModal = (apiCall?: boolean) => {
        setOpenRegistrationModal((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    };

    const toggleWarningModal = (payload?: any) => {
        setWarningModal((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, payload: payload || "" }))
    };

    const initalAPICalls = () => {
        if (
            queryParamsObject?.hostelType &&
            queryParamsObject?.hostelType === "hostel"
        ) {
            applicationSaleFormParent.setValues((prev: any) => ({ ...prev, genderId: '1' }));
        }
        const payload1 = {
            branchId: queryParamsObject?.branchId,
            academicYearId: queryParamsObject?.academicYearId,
            pageNo: 0,
            pageSize: 100,
            sortBy: "curriculumName",
            orderBy: "asc",
        };
        dispatch(
            getBranchCurriculumAct(
                generateActionPayload("get_brch_curriculum", undefined, payload1)
            )
        );
        dispatch(
            getGenderListAct(
                generateActionPayload("get_inst_global_records", undefined, {
                    categoryName: "gender",
                    sortBy: "genderName",
                    orderBy: "asc",
                })
            )
        );

        dispatch(getCountriesAct(generateActionPayload("get_countries")));

        const payload2 = {
            pageSize: 100,
            pageNo: 0,
            instituteId: queryParamsObject.instituteId,
        };
        dispatch(
            getInstBranchesAct(
                generateActionPayload("get_inst_branches", undefined, payload2, {
                    hideLoader: true,
                })
            )
        );

        const payload3 = {
            branchId: queryParamsObject?.branchId,
            instituteId: queryParamsObject?.instituteId,
        }
        dispatch(getAmountForApplicationSaleAct(generateActionPayload("get_amt_for_application_sale", undefined, payload3)));

        const payload4 = { instituteId: queryParamsObject.instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload4, { tokenNotRequired: true })
            )
        );

        const payload5 = {
            type: "terms_conditions",
            instituteId: queryParamsObject.instituteId,
        };
        dispatch(getRegistrationInstructionAct(generateActionPayload("get_registration_isntruction", undefined, payload5, { tokenNotRequired: true })));

        dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, payload2)));

        dispatch(getApplicationDetailsByCurriculumAct(generateActionPayload("get_application_details_by_curriculum", { curriculumId: queryParamsObject.curriculum })));

    }

    useEffect(() => {
        setCurriculumName(
            brchCurriculumResp?.data.find(
                (curr: any) => curr.branchCurriculumId === +queryParamsObject.curriculum
            )?.curriculumName
        );
    }, [brchCurriculumResp]);
    useEffect(() => {
        let subjects: any = [];
        if (subjectListForCBSEResp) {
            subjectListForCBSEResp?.data?.optionalSubjects.map((sub: any) => {
                subjects.push({
                    subjectId: "",
                });
            });
            applicationSaleFormParent.setFieldValue("optionalSubjects", subjects);
            setSubjectsCBSE(subjectListForCBSEResp.data.optionalSubjects);
        }
    }, [subjectListForCBSEResp]);

    useEffect(() => {
        if (branchListResp) {
            const branchDetails = branchListResp?.data?.find(
                (bnc: any) => +bnc.branchId === +queryParamsObject.branchId
            );
            setSelectedBranch(branchDetails);
        }
    }, [branchListResp]);

    useEffect(() => {
        if (generateTokenForUserResp?.token) {
            setLocalStorage('accesstoken', generateTokenForUserResp.token);
            initalAPICalls();
        }
    }, [generateTokenForUserResp]);

    useEffect(() => {
        if (Array.isArray(getAmountForApplicationSaleResp) && getAmountForApplicationSaleResp.length > 0) {
            const totalValue = getAmountForApplicationSaleResp.reduce((total: any, curr: any) => total + +curr?.settingValue, 0);
            applicationSaleFormParent.setFieldValue("amount", getDisplayAmountValue(totalValue))
        }
    }, [getAmountForApplicationSaleResp])

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let year = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearName || ""
            setAcademicYearName(year);
        }
    }, [academicYearListResp]);

    useEffect(() => {
        if (instituteListResp) {
            const { instituteName = "" } = instituteListResp?.data?.find((inst: any) => +inst.id === +queryParamsObject.instituteId) || {}
            setInstituteName(instituteName);
        }
    }, [instituteListResp])

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
    };
    const checkHigherThenClass = (classId: any) => {

        if (classId && applicationSaleClassListResp) {
            const classSequenceNo = +(applicationSaleClassListResp.data.find(
                (cls: any) => +cls.classId === +classId
            )?.classSequence?.toString())
            if (classSequenceNo <= 8) {
                return false
            } else {
                return true
            }
        }
    }
    const countryName = (countryId: any) => {
        return (
            countriesResp &&
            countriesResp.find((country: any) => country.id === +countryId)
                ?.countryName
        );
    };
    const stateName = (stateId: any) => {
        return (
            countryStateResp &&
            countryStateResp.find((state: any) => state.id === +stateId)?.stateName
        );
    };

    const ChangeHandler = (event: any) => {
        const { name, value } = event.target || {};
        if (name !== "admissionClassId") {
            applicationSaleFormParent.handleChange(event);
        }
        const { admissionClassId, dob } = applicationSaleFormParent.values;
        if (getLocalStorage("accesstoken")) {
            if (name === "admissionClassId") {
                const selectedClass = applicationSaleClassListResp?.data.find(
                    (cls: any) => cls.classId === +value
                )
                if (new Date(selectedClass.ageLimit) < new Date(dob)) {
                    applicationSaleFormParent.setFieldValue('admissionClassId', "")
                    toast.error(`Admission is not available for the selected age. DOB should be more than ${getDdMmYyyyFormat(selectedClass.ageLimit)}`);
                    return;
                }
                if (selectedClass?.available?.toLowerCase() === "no") {
                    applicationSaleFormParent.setFieldValue('admissionClassId', "")
                    toast.error('Admission is not available for this class');
                    return;
                }
                if (!queryParamsObject?.hostelType || queryParamsObject?.hostelType !== "hostel" || (queryParamsObject?.hostelType === "hostel" && selectedClass?.hostelFacility === "YES")) {
                    applicationSaleFormParent.handleChange(event);
                    dispatch(resetSubjectListForCBSEAct(undefined));
                    if (curriculumName === "CBSE" && checkHigherClass(value)) {
                        applicationSaleFormParent.setFieldValue("groupId", "");
                        applicationSaleFormParent.setFieldValue("optionalSubjects", []);
                        const payload = {
                            academicYearId: queryParamsObject.academicYearId,
                            curriculumId: queryParamsObject.curriculum,
                            classId: value,
                            branchId: queryParamsObject?.branchId,
                            pageNo: 0,
                            pageSize: 1000,
                            sortBy: "streamGroupName",
                            orderBy: "asc",
                        };
                        if (payload.classId && payload.curriculumId) {
                            dispatch(
                                getStreamList(
                                    generateActionPayload("get_stream_list", undefined, payload)
                                )
                            );
                        }
                    } else if (
                        curriculumName === "CAMBRIDGE INTERNATIONAL" &&
                        checkHigherClass(value)
                    ) {
                        setSelectedSubjects([]);
                        const params = {
                            instituteId: queryParamsObject.instituteId,
                            classId: value,
                            academicYearId: queryParamsObject.academicYearId,
                        };
                        if (params.classId) {
                            dispatch(
                                getSubjectListForCambridgeList(
                                    generateActionPayload(
                                        "get_preadmission_subject_cambridge",
                                        undefined,
                                        params
                                    )
                                )
                            );
                        }
                    } else {
                        const params = {
                            instituteId: queryParamsObject?.instituteId,
                            academicYearId: queryParamsObject.academicYearId,
                            branchId: queryParamsObject?.branchId,
                            curriculumId: queryParamsObject.curriculum,
                            classId: value,
                            type: "SECOND",
                        };
                        if (params.classId) {
                            dispatch(
                                getSecoundLanguagesList(
                                    generateActionPayload(
                                        "get_secound_language_list",
                                        undefined,
                                        params
                                    )
                                )
                            );
                        }
                        applicationSaleFormParent.setFieldValue("secondLanguageId", "");
                    }
                }
                else {
                    applicationSaleFormParent.setFieldValue('admissionClassId', "")
                    toast.error('Hostel Facility is not available for this class')
                }
            } else if (name === "countryId") {
                if (value) {
                    dispatch(
                        getCountryStateAct(
                            generateActionPayload("get_country_state", { countryId: value })
                        )
                    );
                }
            } else if (name === "stateId") {
                if (value) {
                    dispatch(
                        getDistrictAct(
                            generateActionPayload("get_state_district", undefined, {
                                countryId: applicationSaleFormParent.values.countryId,
                                stateId: value,
                            })
                        )
                    );
                }
            } else if (name === "groupId") {
                const params = {
                    instituteId: queryParamsObject?.instituteId,
                    classId: admissionClassId,
                    groupId: value,
                };
                dispatch(
                    getSubjectListForCBSEList(
                        generateActionPayload(
                            "get_preadmission_subject_cbse",
                            undefined,
                            params
                        )
                    )
                );
            } else if (name === "dob") {
                dispatch(resetApplicationSaleClassListAct(undefined));
                applicationSaleFormParent.setFieldValue('admissionClassId', "")
                if (value) {
                    const payload = {
                        instituteId: queryParamsObject?.instituteId,
                        branchId: queryParamsObject?.branchId,
                        curriculumId: queryParamsObject.curriculum,
                        academicYearId: queryParamsObject.academicYearId,
                        dateOfBirth: value
                    };
                    dispatch(
                        getApplicationSaleClassList(
                            generateActionPayload(
                                "get_application_sale_class_list",
                                undefined,
                                payload
                            )
                        )
                    );
                }
            }
        }
    };



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

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required('Enter Full Name'),
        dob: Yup.date().required("Select dob."),
        contactNumber: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required('Enter Contact Number'),
        genderId: Yup.string().required('Select Gender'),
        emailId: Yup.string().email("Enter valid mail.").required('Enter Email Id'),
        contactPerson: Yup.string().required('Enter Parent Name'),
        admissionClassId: Yup.string().required('Select Admission For Class'),
        source: Yup.string().required('Select Source'),
        secondLanguageId: Yup.string().when("admissionClassId", (classId, schema) => {
            if (!checkHigherClass(classId) && (secoundLanguageList?.length)) {
                return schema.required("Select Secound Language")
            }
        }),
        groupId: Yup.string().nullable().when("admissionClassId", (classId, schema) => {
            if (+queryParamsObject.curriculum === 1 && checkHigherClass(classId)) {
                return schema.required("Select Group")
            }
        }),
        cambrigeLanguageId: Yup.string().when("admissionClassId", (classId, schema) => {
            if (checkHigherClass(classId) && showLanguageSelect) {
                return schema.required("Choose your language")
            }
        }),
        optionalSubjects: Yup.array().of(
            Yup.object().shape({
                subjectId: Yup.string().required('Select Subject')
            })
        ),
        address: Yup.string().required('Enter Address'),
        residentialAddress: Yup.string().required('Enter Residential Address'),
        countryId: Yup.string().required('Select Country'),
        stateId: Yup.string().when('countryId', (countryId, schema) => {
            if (countryName(countryId) === "India") {
                return schema.required("State is required")
            }
        }),
        districtId: Yup.string().when('stateId', (stateId, schema) => {
            if (stateName(stateId) === "Telangana") {
                return schema.required("District is required")
            }
        }),
    })

    const applicationSaleFormParent = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {

            let payload = {
                instituteId: queryParamsObject.instituteId,
                branchId: queryParamsObject.branchId,
                academicYearId: queryParamsObject.academicYearId,
                curriculumId: queryParamsObject.curriculum,
                fullName: values.fullName,
                dob: values.dob,
                contactNumber: values.contactNumber,
                genderId: values.genderId,
                emailId: values.emailId,
                contactPerson: values.contactPerson,
                admissionClassId: values.admissionClassId,
                secondLanguageId: values.secondLanguageId,
                admissionType: queryParamsObject?.hostelType === "hostel" && checkHigherThenClass(values.admissionClassId) ? "Residential" : "Non-Residential",
                leadSource: values.source,
                address: values.address,
                countryId: values.countryId,
                groupId: values.groupId,
                stateId: values.stateId,
                districtId: values.districtId,
                mode: "Online",
                transportAccept: values.transportAccept ? "irr_transport_facility" : "verified_transport_facility",
                longitude: values.longitude,
                latitude: values.latitude,
                transportFacility: values.isTransportFacility ? "YES" : "NO"
            };

            if (curriculumName === "CBSE") {
                let optionalSubjects: any = {};
                values.optionalSubjects.map((sub: any, index: number) => {
                    optionalSubjects[`optionalSubj${index + 1}Id`] = +sub.subjectId;
                });
                let payloadCBSE = { ...payload, ...optionalSubjects };
                toggleWarningModal(payloadCBSE)
            } else if (curriculumName === "CAMBRIDGE INTERNATIONAL") {
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
                        toggleWarningModal(payloadCambridge)
                    }
                }
                else {
                    toggleWarningModal(payloadCambridge)
                }
            }
            else {
                toggleWarningModal(payload)
            }
        },
    });

    const finalSubmitHndler = () => {
        dispatch(addApplicationSale(generateActionPayload("add_application_sale", undefined, warningModal.payload)));
    }

    const applicationSaleParentRef = useRef({
        prevAddApplicationSaleResp: addApplicationSaleResp,
        prevCreateJodoOrderResp: createJodoOrderResp,
        prevFeePaymentResp: feePaymentResp,
        prevApplicationSaleError: applicationSaleError,
    });

    useEffect(() => {
        const { prevAddApplicationSaleResp, prevCreateJodoOrderResp, prevFeePaymentResp, prevApplicationSaleError } = applicationSaleParentRef.current;
        if (addApplicationSaleResp && addApplicationSaleResp !== prevAddApplicationSaleResp) {
            const { applicationId } = addApplicationSaleResp;
            if (!applicationId) {
                toast.error("Application sale id not generated.");
                return;
            }
            toast.success("New Request Added for Application Sale.");
            setOpenRegistrationModal((prevState: any) => ({ ...prevState, showModal: true }));
            const paymentPayload = createPaymentPayload(applicationSaleFormParent.values, {
                branchId: queryParamsObject?.branchId,
                curriculumId: queryParamsObject.curriculum,
                applicationSaleId: applicationId,
                amount: applicationSaleFormParent.values.amount,
                gateWayType: isCcAvenuPayment.current ? 'CCAVANUE' : 'JODO',
                academicYearId: queryParamsObject.academicYearId
            });
            dispatch(createJodoOrder(generateActionPayload("jodo_order_pay", undefined, paymentPayload)));
        }
        else if (createJodoOrderResp && createJodoOrderResp !== prevCreateJodoOrderResp) {
            const { data } = createJodoOrderResp;
            const { applicationId } = addApplicationSaleResp;
            if (isCcAvenuPayment.current) {
                if (!data?.order_id) {
                    toast.error("Something went wrong.");
                    return;
                }
                const paymentPayload = {
                    branchId: queryParamsObject.branchId,
                    amount: import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : applicationSaleFormParent.values?.amount,
                    customIdentifier: applicationId,
                    identifier: null,
                    studentName: applicationSaleFormParent.values.fullName,
                    identifierType: "APPLICATION",
                    orderRef: data?.order_id,
                    callbackUrl: `${window.location.origin}/paymentstatus/${queryParamsObject.branchId}`,
                    redirectUrl: window.location.href,
                }
                dispatch(feePaymentAct(generateActionPayload("ccavenue_fee_payment", undefined, paymentPayload)));
            } else {
                if (!data?.redirect_url) {
                    toast.error("Something went wrong.");
                    return;
                }
                setInitialValues(initialValue);
                applicationSaleFormParent.resetForm();
                window.location.assign(data?.redirect_url);
            }
            isCcAvenuPayment.current = false;
        } else if (feePaymentResp && prevFeePaymentResp !== feePaymentResp) {
            const { encRequest, accessCode, actionUrl } = feePaymentResp;
            setPaymentInfoState({
                ccavenueUrl: actionUrl,
                payloadData: encRequest,
                accessCode: accessCode,
            });
        }
        else if (applicationSaleError && applicationSaleError !== prevApplicationSaleError) {
            const { details } = applicationSaleError;
            setOpenRegistrationModal((prevState: any) => ({ ...prevState, showModal: false }));
            toast.error(details);
        }

        applicationSaleParentRef.current.prevAddApplicationSaleResp =
            addApplicationSaleResp;
        applicationSaleParentRef.current.prevCreateJodoOrderResp = createJodoOrderResp;
        applicationSaleParentRef.current.prevFeePaymentResp = feePaymentResp;
        applicationSaleParentRef.current.prevApplicationSaleError =
            applicationSaleError;
    }, [addApplicationSaleResp, createJodoOrderResp, feePaymentResp, applicationSaleError]);

    const ContactNoChangeHandler = (contactNo: any) => {
        const contactNumber = contactNo.substring(2);
        applicationSaleFormParent.setFieldValue("contactNumber", contactNumber);
    };

    const [termsConditionModal, setTermsConditionModal] = useState<any>({
        showModal: false,
        // applicationId: undefined
    });
    const [mapModal, setMapModal] = useState<any>({
        showModal: false,
        // applicationId: undefined
    });

    const toggleTermsCondition = () => {
        setTermsConditionModal((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
        }));
    };
    const toggleMapModal = (address?: any, lat?: any, long?: any) => {
        if (getLocalStorage("accesstoken") && address && lat && long) {
            selectedLocation.current = {
                address, lat, long
            }
            applicationSaleFormParent.setFieldValue('location', address);
            applicationSaleFormParent.setFieldValue('longitude', long);
            applicationSaleFormParent.setFieldValue('latitude', lat);
            // const payload = { academicYearId: queryParamsObject.academicYearId, branchId: queryParamsObject.branchId, locationLatitude: lat, locationLongitude: long }
            // dispatch(getTransportAvalabilityStatus(generateActionPayload('transport_availability_status', undefined, payload)))
        }
        setMapModal((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
        }));
    }

    function openMapModalHandler() {
        setMapModal((prev: any) => ({
            ...prev,
            showModal: true,
        }));
    }

    function TransportHandler(event: any) {
        const { name, value, checked } = event.target;
        if (name === "isTransportFacility") {
            applicationSaleFormParent.setFieldValue('isTransportFacility', checked);
            if (!checked) {
                applicationSaleFormParent.setFieldValue('transportAccept', false);
                applicationSaleFormParent.setFieldValue('location', "");
                dispatch(resetTransportAvalabilityStatus(undefined));
                selectedLocation.current = null;
            }
        }

    }

    function onAcceptTransportHandler(event: any) {
        const { name, checked } = event.target;
        applicationSaleFormParent.setFieldValue(name, checked);
    }

    function resetHandler() {
        applicationSaleFormParent.resetForm();
        if (queryParamsObject?.hostelType && queryParamsObject?.hostelType === "hostel") {
            applicationSaleFormParent.setFieldValue('genderId', '1');
        }
        if (Array.isArray(getAmountForApplicationSaleResp) && getAmountForApplicationSaleResp.length > 0) {
            const totalValue = getAmountForApplicationSaleResp.reduce((total: any, curr: any) => total + +curr?.settingValue, 0);
            applicationSaleFormParent.setFieldValue("amount", getDisplayAmountValue(totalValue))
        }
    }

    const paymentFormRef = useRef<any>(null);
    useEffect(() => {
        const { ccavenueUrl,
            payloadData,
            accessCode } = paymentInfoState;
        if (ccavenueUrl && payloadData && accessCode) {
            paymentFormRef?.current?.submit();
        }
    }, [paymentInfoState]);

    const { data: classTypes } = applicationSaleClassListResp || {};
    const { data: subjectForCambridge } = subjectListForCambridgeResp || {};
    const { data: districtList } = districtResp || {};
    const { data: secoundLanguageList } = secoundLanguageResp || {};
    const { content: streamList } = streamListResp || {};
    const { data: subjectForCBSE } = subjectListForCBSEResp || {};
    // const disablePayBtn = applicationSaleFormParent.values.isTransportFacility ?
    //     ((Array.isArray(transportAvalabilityStatus) && transportAvalabilityStatus.length > 0 ? false :
    //         !applicationSaleFormParent.values.transportAccept
    //     )) : false;
    const disablePayBtn = applicationSaleFormParent.values.isTransportFacility ?
        !applicationSaleFormParent.values.transportAccept
        : false;

    

    return (
        <>
            <div className="registration-container">
                <div>
                    <div className="main">
                        {/* <div className="header">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-6 col-6"></div>
                            </div>
                        </div>
                    </div> */}
                        <div>
                            <div className="container">
                                <div className="form-body">
                                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 form-header">

                                        <div className="tw-col-span-12 sm:tw-col-span-8 tw-flex tw-items-center">
                                            <h2 className="tw-text-2xl tw-font-bold tw-mr-3 apply">
                                                APPLY NOW
                                            </h2>
                                        </div>

                                        <div className="tw-col-span-12 sm:tw-col-span-4">
                                            {selectedBranch?.websiteUrl && (
                                                <div className="tw-flex tw-justify-end">
                                                    <p
                                                        className="tw-inline-block tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-cursor-pointer hover:tw-bg-blue-700 tw-transition-colors"
                                                        onClick={() =>
                                                            window.open(
                                                                `https://${selectedBranch?.websiteUrl}`,
                                                                "_blank"
                                                            )
                                                        }
                                                    >
                                                        RETURN TO THE MAIN WEBSITE
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="tw-col-span-12 tw-flex tw-justify-end tw-items-center">
                                            <span className="tw-font-bold tw-mr-1">
                                                Track your application:
                                            </span>
                                            <a
                                                href="/application-tracking"
                                                target="_blank"
                                                className="tw-font-bold tw-text-sky-500 tw-cursor-pointer hover:tw-underline"
                                            >
                                                Click here
                                            </a>
                                        </div>

                                    </div>
                                    <div className="tw-flex tw-content-end">
                                        <img src={frame} alt="" width={"150px"} />
                                    </div>
                                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                        {getApplicationDetailsByCurriculumResp?.curriculumShortName === "IGCSE" && (
                                            <div className="tw-col-span-12 tw-mb-3">
                                                <img
                                                    src={CIE}
                                                    alt="Cambridge Logo"
                                                    className="tw-max-w-full tw-h-auto"
                                                />
                                            </div>
                                        )}

                                        {+queryParamsObject.branchId === 1 &&
                                            queryParamsObject.curriculum === "5" && (
                                                <div className="tw-col-span-12">
                                                    <h3 className="tw-mt-3 tw-text-sm tw-font-bold">
                                                        * Hostel Facility Available for Boys from stage 6 onwards.
                                                    </h3>
                                                </div>
                                            )}

                                        {+queryParamsObject.branchId === 1 &&
                                            queryParamsObject.curriculum === "1" && (
                                                <div className="tw-col-span-12 tw-mb-3">
                                                    <h3 className="tw-mt-3 tw-text-sm tw-font-bold">
                                                        Instructions:
                                                    </h3>

                                                    <h3 className="tw-mt-3 tw-text-sm tw-font-bold">
                                                        * Hostel Facility Available for Boys from class (VI-XII) only at DPS Nacharam.
                                                    </h3>

                                                    <h3 className="tw-mt-3 tw-text-sm tw-font-bold">
                                                        * Class X/XII admissions are bound by CBSE norms.
                                                    </h3>
                                                </div>
                                            )}

                                    </div>
                                    {+queryParamsObject.branchId === 3 && (
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                            {queryParamsObject.curriculum === "4" && (
                                                <div className="tw-col-span-12">
                                                    <h3 className="tw-mt-3 tw-text-sm tw-font-bold">
                                                        Instructions:
                                                    </h3>
                                                    <h3 className="tw-mt-3 tw-text-sm tw-font-bold">
                                                        * Class X/XII admissions are bound by CBSE norms.
                                                    </h3>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {+queryParamsObject.branchId === 2 && (
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                            {queryParamsObject.curriculum === "3" && (
                                                <div className="tw-col-span-12">
                                                    <h3 className="tw-mt-3 tw-text-sm tw-font-bold">
                                                        Instructions:
                                                    </h3>
                                                    <h3 className="tw-mt-3 tw-text-sm tw-font-bold">
                                                        * Class X admissions are bound by CBSE norms
                                                    </h3>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                Full name along with Surname{" "}
                                                <span className="tw-font-bold flash-text tw-text-red-500">
                                                    (As per Aadhaar)
                                                </span>{" "}
                                                <span className="tw-text-red-500">*</span>
                                            </label>
                                            <TextInput
                                                name="fullName"
                                                value={applicationSaleFormParent.values.fullName}
                                                onChange={applicationSaleFormParent.handleChange}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                invalid={
                                                    applicationSaleFormParent.touched.fullName &&
                                                        applicationSaleFormParent.errors.fullName
                                                        ? true
                                                        : false
                                                }
                                                error={
                                                    applicationSaleFormParent.touched.fullName &&
                                                        applicationSaleFormParent.errors.fullName
                                                        ? applicationSaleFormParent.errors.fullName
                                                        : ""
                                                }
                                            />

                                        </div>

                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                Contact No (For SMS) <span className="tw-text-red-500">*</span>
                                            </label>
                                            <NewPhoneInput
                                                name="contactNumber"
                                                // labelText={`Contact No(For SMS) <span className="text-danger">*</span>`}
                                                value={applicationSaleFormParent.values.contactNumber}
                                                onChange={ContactNoChangeHandler}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                // formgroupClassName="mb-0"
                                                // isDisabled={!edit}
                                                // labelClass="text-muted"
                                                // inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent phone_no' : ""}`}
                                                invalid={
                                                    applicationSaleFormParent.touched.contactNumber &&
                                                        applicationSaleFormParent.errors.contactNumber
                                                        ? true
                                                        : false
                                                }
                                                error={
                                                    applicationSaleFormParent.touched.contactNumber &&
                                                        applicationSaleFormParent.errors.contactNumber
                                                        ? applicationSaleFormParent.errors.contactNumber
                                                        : ""
                                                }
                                            />
                                        </div>

                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                DOB{" "}
                                                <span className="tw-font-bold flash-text tw-text-red-500">
                                                    (As per Date of Birth Certificate)
                                                </span>{" "}
                                                <span className="tw-text-red-500">*</span>
                                            </label>
                                            <DateInput
                                                name="dob"
                                                value={applicationSaleFormParent.values.dob}
                                                onChange={ChangeHandler}
                                                maxDate={Current_Date}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                invalid={
                                                    applicationSaleFormParent.touched.dob &&
                                                        applicationSaleFormParent.errors.dob
                                                        ? true
                                                        : false
                                                }
                                                error={
                                                    applicationSaleFormParent.touched.dob &&
                                                        applicationSaleFormParent.errors.dob
                                                        ? applicationSaleFormParent.errors.dob
                                                        : ""
                                                }
                                            />

                                        </div>

                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                Gender <span className="tw-text-red-500">*</span>
                                            </label>
                                            <SelectInput
                                                name="genderId"
                                                value={applicationSaleFormParent.values.genderId}
                                                onChange={applicationSaleFormParent.handleChange}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                menuItems={genderListResp?.data || []}
                                                valueKey="genderId"
                                                textKey="genderName"
                                                isDisabled={queryParamsObject.hostelType === "hostel"}
                                                invalid={applicationSaleFormParent.touched.genderId &&
                                                    applicationSaleFormParent.errors.genderId
                                                    ? true
                                                    : false}
                                                error={applicationSaleFormParent.touched.genderId &&
                                                    applicationSaleFormParent.errors.genderId
                                                    ? applicationSaleFormParent.errors.genderId
                                                    : ""}
                                            />
                                        </div>

                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                Parent Name{" "}
                                                <span className="tw-font-bold flash-text tw-text-red-500">
                                                    (As per Aadhaar)
                                                </span>{" "}
                                                <span className="tw-text-red-500">*</span>
                                            </label>
                                            <TextInput
                                                name="contactPerson"
                                                value={applicationSaleFormParent.values.contactPerson}
                                                onChange={applicationSaleFormParent.handleChange}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                // formgroupClassName='mb-0'
                                                invalid={applicationSaleFormParent.touched.contactPerson &&
                                                    applicationSaleFormParent.errors.contactPerson
                                                    ? true
                                                    : false}
                                                error={applicationSaleFormParent.touched.contactPerson &&
                                                    applicationSaleFormParent.errors.contactPerson
                                                    ? applicationSaleFormParent.errors.contactPerson
                                                    : ""}
                                            />
                                        </div>


                                        {/* </div> */}
                                        {/* <div className="row"> */}
                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                Email Id (For Communication) <span className="tw-text-red-500">*</span>
                                            </label>
                                            <TextIconInput
                                                name="emailId"
                                                value={applicationSaleFormParent.values.emailId}
                                                onChange={applicationSaleFormParent.handleChange}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                invalid={(applicationSaleFormParent.touched.emailId && applicationSaleFormParent.errors.emailId) ? true : false}
                                                error={(applicationSaleFormParent.touched.emailId && applicationSaleFormParent.errors.emailId) ? applicationSaleFormParent.errors.emailId : ""}
                                            >
                                                <i className="ri-mail-unread-line"></i>
                                            </TextIconInput>
                                        </div>

                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                Admission For <span className="tw-text-red-500">*</span>
                                            </label>
                                            <SelectInput
                                                name="admissionClassId"
                                                value={applicationSaleFormParent.values.admissionClassId}
                                                onChange={ChangeHandler}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                menuItems={classTypes || []}
                                                valueKey="classId"
                                                textKey="classShortName"
                                                formgroupClassName="mb-2"
                                                invalid={applicationSaleFormParent.touched.admissionClassId &&
                                                    applicationSaleFormParent.errors.admissionClassId
                                                    ? true
                                                    : false}
                                                error={applicationSaleFormParent.touched.admissionClassId &&
                                                    applicationSaleFormParent.errors.admissionClassId
                                                    ? applicationSaleFormParent.errors.admissionClassId
                                                    : ""}
                                            />

                                            {!(+(queryParamsObject?.branchId) === 6) && (
                                                <div className="tw-mt-2 tw-text-green-600 tw-text-sm">
                                                    <p className="tw-mb-0">Note :- EY-1 is equivalent to NURSERY.</p>
                                                    <p className="tw-mb-0">EY-2 is equivalent to PP I / LKG</p>
                                                    <p className="tw-mb-0">EY-3 is equivalent to PP II / UKG</p>
                                                </div>
                                            )}
                                        </div>

                                        {curriculumName === "CBSE" &&
                                            checkHigherClass(applicationSaleFormParent.values.admissionClassId) && (
                                                <div className="tw-col-span-1">
                                                    <label className="tw-block tw-mb-1">
                                                        Group <span className="tw-text-red-500">*</span>
                                                    </label>
                                                    <SelectInput
                                                        name="groupId"
                                                        value={applicationSaleFormParent.values.groupId}
                                                        onChange={ChangeHandler}
                                                        onBlur={applicationSaleFormParent.handleBlur}
                                                        menuItems={streamList || []}
                                                        valueKey="id"
                                                        textKey="shortName"
                                                        // inputClassName="bg-light border-0"
                                                        formgroupClassName="!tw-mb-0"
                                                        // labelText="Group"
                                                        invalid={
                                                            applicationSaleFormParent.touched.groupId &&
                                                                applicationSaleFormParent.errors.groupId
                                                                ? true
                                                                : false
                                                        }
                                                        error={
                                                            applicationSaleFormParent.touched.groupId &&
                                                                applicationSaleFormParent.errors.groupId
                                                                ? applicationSaleFormParent.errors.groupId
                                                                : ""
                                                        }
                                                    />
                                                    <p className="tw-text-gray-500 tw-text-sm tw-pt-1 tw-mb-0">
                                                        CORE SUBJECTS :
                                                        <span>{subjectForCBSE?.mandatorySubjects.join(",")}</span>
                                                    </p>
                                                </div>
                                            )}

                                        {curriculumName === "CBSE" &&
                                            applicationSaleFormParent.values.groupId &&
                                            checkHigherClass(applicationSaleFormParent.values.admissionClassId) && (
                                                <FormikProvider value={applicationSaleFormParent}>
                                                    <FieldArray name="optionalSubjects">
                                                        {(arrayHelpers: ArrayHelpers) => {
                                                            if (!formikArrayHelpers.current) {
                                                                formikArrayHelpers.current = arrayHelpers;
                                                            }
                                                            return (
                                                                <>
                                                                    {applicationSaleFormParent.values.optionalSubjects &&
                                                                        applicationSaleFormParent.values.optionalSubjects.map(
                                                                            (sub: any, index: number) => {
                                                                                const inputFieldErrors: any =
                                                                                    (applicationSaleFormParent.errors.optionalSubjects &&
                                                                                        applicationSaleFormParent.errors.optionalSubjects[index]) ||
                                                                                    {};
                                                                                const inputFieldTouched: any =
                                                                                    (applicationSaleFormParent.touched.optionalSubjects &&
                                                                                        applicationSaleFormParent.touched.optionalSubjects[index]) ||
                                                                                    {};
                                                                                return (
                                                                                    <div className="tw-col-span-1" key={index}>
                                                                                        <SelectInput
                                                                                            name={`optionalSubjects[${index}].subjectId`}
                                                                                            value={sub.subjectId}
                                                                                            onChange={applicationSaleFormParent.handleChange}
                                                                                            onBlur={applicationSaleFormParent.handleBlur}
                                                                                            menuItems={subjectsCBSE[index]?.subjects || []}
                                                                                            valueKey="subjectId"
                                                                                            textKey="subjectName"
                                                                                            labelText={`${subjectForCBSE?.mandatorySubjects.length +
                                                                                                index +
                                                                                                1
                                                                                                }th Subject`}
                                                                                            invalid={
                                                                                                inputFieldTouched.subjectId &&
                                                                                                    inputFieldErrors.subjectId
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
                                                                                            error={
                                                                                                inputFieldTouched.subjectId &&
                                                                                                    inputFieldErrors.subjectId
                                                                                                    ? inputFieldErrors.subjectId
                                                                                                    : ""
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                </>
                                                            );
                                                        }}
                                                    </FieldArray>
                                                </FormikProvider>
                                            )}
                                        {/* <div className="row"> */}
                                        {curriculumName === "CAMBRIDGE INTERNATIONAL" &&
                                            checkHigherClass(applicationSaleFormParent.values.admissionClassId) && (
                                                <div className="tw-col-span-1">
                                                    <p className="tw-my-1">Choose any four subjects</p>
                                                    <div>
                                                        <InputCheckbox
                                                            name={"english"}
                                                            value={true}
                                                            onChange={() => { }}
                                                            isDisabled={true}
                                                        />
                                                        <label className="tw-text-lg">English</label>
                                                    </div>
                                                    {subjectForCambridge &&
                                                        subjectForCambridge?.optionalSubjects.map(
                                                            (sub: any, index: number) => {
                                                                return (
                                                                    <InputCheckbox
                                                                        key={index}
                                                                        name={`${sub.subjectName}`}
                                                                        labelName={`${sub.subjectName}`}
                                                                        value={selectedSubjects.includes(sub.subjectId)}
                                                                        onChange={() => CheckBoxHandler(sub.subjectId)}
                                                                    />
                                                                );
                                                            }
                                                        )}

                                                    {curriculumName === "CAMBRIDGE INTERNATIONAL" &&
                                                        checkHigherClass(
                                                            applicationSaleFormParent.values.admissionClassId
                                                        ) &&
                                                        subjectForCambridge?.optionalSubjects.length > 0 &&
                                                        +(selectedSubjects?.length) !== 4 && (
                                                            <div className="tw-text-red-500">Must Select 4 subjects</div>
                                                        )}
                                                </div>
                                            )}
                                        {curriculumName === "CAMBRIDGE INTERNATIONAL" &&
                                            checkHigherClass(applicationSaleFormParent.values.admissionClassId) &&
                                            showLanguageSelect && (
                                                <div className="tw-col-span-1">
                                                    <label className="tw-block tw-mb-1">
                                                        Choose your language <span className="tw-text-red-500">*</span>
                                                    </label>
                                                    <SelectInput
                                                        name="cambrigeLanguageId"
                                                        value={applicationSaleFormParent?.values.cambrigeLanguageId}
                                                        onChange={(e: any) => {
                                                            setLanguageForCambridgeState(e?.target?.value);
                                                            applicationSaleFormParent.handleChange(e);
                                                        }}
                                                        onBlur={applicationSaleFormParent.handleBlur}
                                                        menuItems={LanguagesForCambridge || []}
                                                        valueKey="id"
                                                        textKey="language"
                                                        invalid={
                                                            applicationSaleFormParent.touched.cambrigeLanguageId &&
                                                                applicationSaleFormParent.errors.cambrigeLanguageId
                                                                ? true
                                                                : false
                                                        }
                                                        error={
                                                            applicationSaleFormParent.touched.cambrigeLanguageId &&
                                                                applicationSaleFormParent.errors.cambrigeLanguageId
                                                                ? applicationSaleFormParent.errors.cambrigeLanguageId
                                                                : ""
                                                        }
                                                    />
                                                </div>
                                            )}

                                        {!checkHigherClass(applicationSaleFormParent.values.admissionClassId) &&
                                            secoundLanguageList?.length > 0 && (
                                                <div className="tw-col-span-1">
                                                    <label className="tw-block tw-mb-1">
                                                        Second Language <span className="tw-text-red-500">*</span>
                                                    </label>
                                                    <SelectInput
                                                        name="secondLanguageId"
                                                        value={
                                                            applicationSaleFormParent.values.secondLanguageId
                                                        }
                                                        onChange={applicationSaleFormParent.handleChange}
                                                        onBlur={applicationSaleFormParent.handleBlur}
                                                        menuItems={secoundLanguageList || []}

                                                        valueKey="languageId"
                                                        textKey="languageName"
                                                        invalid={applicationSaleFormParent.touched.secondLanguageId &&
                                                            applicationSaleFormParent.errors.secondLanguageId
                                                            ? true
                                                            : false}
                                                        error={applicationSaleFormParent.touched.secondLanguageId &&
                                                            applicationSaleFormParent.errors.secondLanguageId
                                                            ? applicationSaleFormParent.errors.secondLanguageId
                                                            : ""}
                                                    />
                                                </div>
                                            )}
                                        {/* </div> */}
                                        {/* </div> */}
                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                How were you informed about us? <span className="tw-text-red-500">*</span>
                                            </label>
                                            <SelectInput
                                                name="source"
                                                value={applicationSaleFormParent.values.source}
                                                onChange={applicationSaleFormParent.handleChange}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                menuItems={SourceTypes || []}
                                                valueKey="id"
                                                textKey="value"
                                                invalid={applicationSaleFormParent.touched.source &&
                                                    applicationSaleFormParent.errors.source
                                                    ? true
                                                    : false}
                                                error={applicationSaleFormParent.touched.source &&
                                                    applicationSaleFormParent.errors.source
                                                    ? applicationSaleFormParent.errors.source
                                                    : ""}
                                            />
                                        </div>

                                        {applicationSaleFormParent.values.source === "Any Other" && (
                                            <div className="tw-col-span-1">
                                                <label className="tw-block tw-mb-1">Other</label>
                                                <TextInput
                                                    name="other"
                                                    value={applicationSaleFormParent.values.other}
                                                    onChange={applicationSaleFormParent.handleChange}
                                                    formgroupClassName='tw-mb-0'
                                                    invalid={applicationSaleFormParent.touched.other &&
                                                        applicationSaleFormParent.errors.other
                                                        ? true
                                                        : false}
                                                    error={applicationSaleFormParent.touched.other &&
                                                        applicationSaleFormParent.errors.other
                                                        ? applicationSaleFormParent.errors.other
                                                        : ""}
                                                />
                                            </div>
                                        )}

                                        <p className="tw-text-sm tw-font-bold tw-mb-1">
                                            Note : Please fill the complete address including H.No, Landmark, city,
                                            state and country in address columns
                                        </p>

                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                Residential Address <span className="tw-text-red-500">*</span>
                                            </label>
                                            <TextArea
                                                name="residentialAddress"
                                                height="50px"
                                                inputClassName={"overflow-auto"}
                                                value={
                                                    applicationSaleFormParent.values.residentialAddress
                                                }
                                                onChange={applicationSaleFormParent.handleChange}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                invalid={applicationSaleFormParent.touched.residentialAddress &&
                                                    applicationSaleFormParent.errors.residentialAddress
                                                    ? true
                                                    : false}
                                                error={applicationSaleFormParent.touched.residentialAddress &&
                                                    applicationSaleFormParent.errors.residentialAddress
                                                    ? applicationSaleFormParent.errors.residentialAddress
                                                    : ""}
                                            />
                                        </div>

                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                Address (From where the Application is made){" "}
                                                <span className="tw-text-red-500">*</span>
                                            </label>
                                            <TextArea
                                                name="address"
                                                height="50px"
                                                inputClassName="tw-overflow-auto"
                                                value={applicationSaleFormParent.values.address}
                                                onChange={applicationSaleFormParent.handleChange}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                // formgroupClassName="mb-0"
                                                invalid={applicationSaleFormParent.touched.address &&
                                                    applicationSaleFormParent.errors.address
                                                    ? true
                                                    : false}
                                                error={applicationSaleFormParent.touched.address &&
                                                    applicationSaleFormParent.errors.address
                                                    ? applicationSaleFormParent.errors.address
                                                    : ""}
                                            />
                                        </div>

                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">
                                                Country (From where the Application is made){" "}
                                                <span className="tw-text-red-500">*</span>
                                            </label>
                                            <SelectInput
                                                name="countryId"
                                                value={applicationSaleFormParent.values.countryId}
                                                onChange={ChangeHandler}
                                                onBlur={applicationSaleFormParent.handleBlur}
                                                menuItems={countriesResp || []}
                                                valueKey="id"
                                                textKey="countryName"
                                                invalid={applicationSaleFormParent.touched.countryId &&
                                                    applicationSaleFormParent.errors.countryId
                                                    ? true
                                                    : false}
                                                error={applicationSaleFormParent.touched.countryId &&
                                                    applicationSaleFormParent.errors.countryId
                                                    ? applicationSaleFormParent.errors.countryId
                                                    : ""}
                                            />
                                        </div>

                                        {countryName(applicationSaleFormParent.values.countryId) === "India" && (
                                            <div className="tw-col-span-1">
                                                <label className="tw-block tw-mb-1">
                                                    State <span className="tw-text-red-500">*</span>
                                                </label>
                                                <SelectInput
                                                    name="stateId"
                                                    value={applicationSaleFormParent.values.stateId}
                                                    onChange={ChangeHandler}
                                                    onBlur={applicationSaleFormParent.handleBlur}
                                                    menuItems={countryStateResp || []}
                                                    valueKey="id"
                                                    textKey="stateName"
                                                    invalid={applicationSaleFormParent.touched.stateId &&
                                                            applicationSaleFormParent.errors.stateId
                                                            ? true
                                                            : false}
                                                    error={applicationSaleFormParent.touched.stateId &&
                                                            applicationSaleFormParent.errors.stateId
                                                            ? applicationSaleFormParent.errors.stateId
                                                            : ""}
                                                />
                                            </div>
                                        )}

                                        {stateName(applicationSaleFormParent.values.stateId) === "Telangana" && (
                                            <div className="tw-col-span-1">
                                                <label className="tw-block tw-mb-1">
                                                    District <span className="tw-text-red-500">*</span>
                                                </label>
                                                <SelectInput
                                                    name="districtId"
                                                    value={applicationSaleFormParent.values.districtId}
                                                    onChange={applicationSaleFormParent.handleChange}
                                                    onBlur={applicationSaleFormParent.handleBlur}
                                                    menuItems={districtList || []}
                                                    valueKey="districtId"
                                                    textKey="districtName"
                                                    invalid={
                                                        applicationSaleFormParent.touched.districtId &&
                                                            applicationSaleFormParent.errors.districtId
                                                            ? true
                                                            : false
                                                    }
                                                    error={
                                                        applicationSaleFormParent.touched.districtId &&
                                                            applicationSaleFormParent.errors.districtId
                                                            ? applicationSaleFormParent.errors.districtId
                                                            : ""
                                                    }
                                                />
                                            </div>
                                        )}
                                        <div className="tw-col-span-1">
                                            <label className="tw-block tw-mb-1">Amount(₹)</label>
                                            <TextInput
                                                name="amount"
                                                value={applicationSaleFormParent.values.amount}
                                                onChange={applicationSaleFormParent.handleChange}
                                                formgroupClassName="tw-mb-0"
                                                isDisabled={true}
                                            />
                                            <p className="tw-text-xs tw-pt-2">
                                                (
                                                {getAmountForApplicationSaleResp?.map((item: any, index: number) =>
                                                    `${index !== 0 ? " +" : " "} ${item?.settingKey
                                                        ?.split("_")
                                                        ?.join(" ")} : ${getDisplayAmountValue(+item?.settingValue)}`
                                                )}
                                                )
                                            </p>
                                        </div>

                                        <div className="tw-col-span-1">
                                            <InputCheckbox
                                                name="isTransportFacility"
                                                labelName="School Transportation"
                                                formgroupClassName={`${applicationSaleFormParent.values.isTransportFacility
                                                        ? "tw-mb-2"
                                                        : "tw-mb-3"
                                                    }`}
                                                value={applicationSaleFormParent.values.isTransportFacility}
                                                onChange={TransportHandler}
                                            />
                                        </div>

                                        {applicationSaleFormParent.values.isTransportFacility && (
                                            <div className="tw-col-span-1">
                                                <TextInputGroup
                                                    name="location"
                                                    value={applicationSaleFormParent.values.location}
                                                    onChange={applicationSaleFormParent.handleChange}
                                                    placeHolder="Check your location"
                                                    isReadOnly={true}
                                                    isDisabled={true}
                                                >
                                                    <i
                                                        onClick={openMapModalHandler}
                                                        className="tw-text-xl tw-text-green-600 tw-cursor-pointer ri-map-pin-fill"
                                                    ></i>
                                                </TextInputGroup>
                                            </div>
                                        )}
                                        {/* {transportAvalabilityStatus && applicationSaleFormParent.values.isTransportFacility ? transportAvalabilityStatus.length > 0 ? <div className="mb-3">
                                            <p className="text-success m-0">Transportation is available for selected location.</p>
                                        </div> : <div>
                                            <p className="text-warning m-0">Sorry Transportation is not available for selected location</p>
                                        </div> : ''} */}
                                        {/* {transportAvalabilityStatus && transportAvalabilityStatus.length === 0 && applicationSaleFormParent.values.isTransportFacility &&
                                            <div className="col-12 mb-3">
                                                <InputCheckbox
                                                    name="transportAccept"
                                                    labelName="I agree to proceed further irrespective of transport facility."
                                                    formgroupClassName="form-check-green mb-1 mt-2"
                                                    value={Boolean(applicationSaleFormParent.values.transportAccept)}
                                                    onChange={onAcceptTransportHandler}
                                                />
                                                <p className=" m-0  ms-4">
                                                    I want to verify whether transport is available for my locality.{" "}
                                                    <a className="text-info" target="_blank" href={`https://${selectedBranch?.websiteUrl}/${branchId?.toString() === "1" ? "transport-facility" : "Transport"}`}>
                                                        Check Here</a> to find the transport facility.</p>
                                            </div>
                                        } */}
                                        {applicationSaleFormParent.values.location &&
                                            applicationSaleFormParent.values.isTransportFacility && (
                                                <div className="tw-col-span-1 tw-mb-3">
                                                    <InputCheckbox
                                                        name="transportAccept"
                                                        labelName="I agree to proceed further irrespective of transport facility."
                                                        formgroupClassName="tw-mb-1 tw-mt-2"
                                                        value={Boolean(applicationSaleFormParent.values.transportAccept)}
                                                        onChange={onAcceptTransportHandler}
                                                    />
                                                    <p className="tw-m-0 tw-ml-4">
                                                        I want to verify whether transport is available for my locality.{" "}
                                                        <a
                                                            className="tw-text-sky-500"
                                                            target="_blank"
                                                            href={`https://${selectedBranch?.websiteUrl}/${queryParamsObject?.branchId?.toString() === "1"
                                                                    ? "transport-facility"
                                                                    : "Transport"
                                                                }`}
                                                        >
                                                            Check Here
                                                        </a>{" "}
                                                        to find the transport facility.
                                                    </p>
                                                </div>
                                            )}

                                        <div className="tw-col-span-1">
                                            <p>
                                                <span className="tw-font-bold">Note:</span>{" "}
                                                <span className="tw-text-red-500 tw-font-bold">
                                                    Application does not imply admission. Admission is subject to the
                                                    availability of seats and eligibility criteria. There would be no refund
                                                    of the application/registration fee in case the application is not
                                                    processed
                                                </span>
                                            </p>
                                        </div>



                                    </div>
                                        <div className="tw-col-span-1 tw-w-full">
                                            <div className="tw-flex tw-items-center tw-mb-2">
                                                <input
                                                    type="checkbox"
                                                    className="tw-mr-2"
                                                    style={{ width: "30px", height: "30px" }}
                                                    onChange={(event: any) => setIsChecked(event.target.checked)}
                                                    id="flexCheckDefault"
                                                    checked={isChecked}
                                                />
                                                <label className="tw-p-2 tw-text-base">
                                                    I Agree to the
                                                    <span className="tw-text-sky-500" onClick={toggleTermsCondition}>
                                                        {" "}
                                                        Terms & Conditions
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="tw-col-span-1">
                                            <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-gap-3 tw-my-3 tw-w-full tw-text-center">
                                                <div className="tw-w-full md:tw-w-1/4">
                                                    <Button
                                                        className="tw-w-full tw-py-3 tw-text-base tw-text-white"
                                                        style={{ backgroundColor: "#a5abaf" }}
                                                        onClick={resetHandler}
                                                    >
                                                        Reset
                                                    </Button>
                                                </div>

                                                <div className="tw-w-full md:tw-w-1/4">
                                                    <Button
                                                        className="tw-w-full tw-py-3 tw-text-base tw-bg-green-600 tw-text-white disabled:tw-opacity-50"
                                                        type="submit"
                                                        onClick={(event: any) =>
                                                            applicationSaleFormParent.handleSubmit(event)
                                                        }
                                                        disabled={showApiLoader || !isChecked || disablePayBtn}
                                                    >
                                                        Pay Through Jodo
                                                    </Button>
                                                </div>

                                                <div className="tw-w-full md:tw-w-1/4">
                                                    <Button
                                                        className="tw-w-full tw-py-3 tw-text-base tw-bg-green-600 tw-text-white disabled:tw-opacity-50"
                                                        type="button"
                                                        onClick={(event: any) => {
                                                            isCcAvenuPayment.current = true;
                                                            applicationSaleFormParent.handleSubmit(event);
                                                        }}
                                                        disabled={showApiLoader || !isChecked || disablePayBtn}
                                                    >
                                                        Pay Through Kotak
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tw-col-span-1">
                                            <div className="tw-mt-3 tw-flex tw-items-center tw-justify-center">
                                                <p className="tw-text-base tw-mb-0">
                                                    <span className="tw-mr-2">
                                                        <img
                                                            className="tw-h-8 tw-w-8"
                                                            src={Email}
                                                        />
                                                    </span>
                                                    <span className="tw-text-red-500">Facing issue? </span>
                                                    <a
                                                        href={WHATSAPP_LINK}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="tw-no-underline"
                                                    >
                                                        <span className="tw-text-sky-500">Click here</span>
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    {/* </form> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="instruction-footer">
                    <div className="tw-text-center">
                        <p className="tw-text-white tw-text-sm">
                            {`© ${academicYearName && academicYearName.split("-")[0]
                                } ${instituteName}, ${selectedBranch?.branchName
                                }. All Rights Reserved`}
                        </p>
                    </div>

                    <div className="footer-content">
                        <div className="footer-icon">
                            <img src={fb} alt="fb" />
                            <img src={twitter} alt="twitter" />
                            <img src={insta} alt="insta" />
                            <img src={google} alt="google+" />
                        </div>
                        <div>
                            <img src={footer} alt="footerlogo" />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="terms-condition-modal"
                isOpen={termsConditionModal.showModal}
                toggle={toggleTermsCondition}
                modalTitle="Terms & Condition"
                modalSize="lg"
            >
                <TermsAndCondition
                    isOpen={termsConditionModal.showModal}
                    toggle={toggleTermsCondition}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="map-modal"
                isOpen={mapModal.showModal}
                toggle={toggleMapModal}
                modalTitle="Transport Facility"
                modalSize="lg"
            >
                <LocationSelectorModal
                    isOpen={mapModal.showModal}
                    selectedLocation={selectedLocation.current}
                    toggle={toggleMapModal}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="change-newPassword-modal"
                hideHeader={true}
                isOpen={openRegistrationModal.showModal}
                toggle={toggleRegistrationModal}
                modalSize="md"
            >
                <RegistrationFormModal
                    isOpen={openRegistrationModal.showModal}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="warning-message-modal"
                isOpen={warningModal.showModal}
                toggle={() => toggleWarningModal()}
                modalTitle="Alert"
                modalSize="md"
            >
                <WarningModal
                    isOpen={warningModal.showModal}
                    toggle={() => toggleWarningModal()}
                    submitHndler={finalSubmitHndler}
                />
            </ModalContainerUpdated>

            {/* <VerifyNumberModal
                isOpen={verifyNumberModal.showModal} toggle={toggleVerifyNumberModal} modalTitle={"Verify Your Number"}
            /> */}
            <form id="nonseamless" ref={paymentFormRef} method="post" name="redirect"
                action={paymentInfoState.ccavenueUrl}>
                <input type="hidden" id="encRequest" name="encRequest" value={paymentInfoState.payloadData} />
                <input type="hidden" name="access_code" id="access_code" value={paymentInfoState.accessCode} />
            </form>

        </>
    );
};

export default ApplicationSaleParent;
