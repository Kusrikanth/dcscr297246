import { useFormik } from 'formik';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { getDisplayAmountValue, parseQueryStringToObject } from '../../../../../utility/commonutility';
import { CustomSelect, InputCheckbox, InputCheckboxUpdated, ModalContainerUpdated, SelectInput, TextArea, TextInput, TextInputGroup } from '../../../../../Components/Common';
import { admissionTypes, admissionTypesForNonResidential, createPaymentPayload, renderCountryOption, renderCountryValue, renderDistrictOption, renderDistrictValue, renderStateOption, renderStateValue, SourceTypes } from './helper';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { getLocalStorage } from '../../../../../utility/storageUtility';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getCountryStateAct, getDistrictAct } from '../../../../../store/masterdata/masterdataactions';
import { shallowEqual } from 'react-redux';
import { resetTransportAvalabilityStatus } from '../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentslice';
import LocationSelectorModal from '../../../../ApplicationSaleParent/LocationSelectorModal';
import Email from "../../../../../assets/imagesdps/authiconV1/login-2.png"
import TermsAndCondition from '../../ApplicationSaleOnline/TermsAndCondition';
import WarningModal from '../../../../ApplicationSaleParent/WarningModal';
import RegistrationFormModal from '../../../../ApplicationSaleParent/RegistrationFormModal';
import { toast } from 'react-toastify';
import { addApplicationSale, createJodoOrder, getEnquirySourceListAct } from '../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import * as Yup from "yup";
import { feePaymentAct } from '../../../../../store/fee/feecollections/feecollectionactions';
import { instituteCodeOptions, PaymentGatewayTypes } from '../../../../../Components/constants/common';
import { useModal } from '../../../../../hooks/modalhook';
import { WHATSAPP_LINK } from '../../../../../Components/constants/common';
import { getPaymentGatewaysBranchListAct } from '../../../../../store/mastersettings/feesettings/feesettingsactions';


const initialValue = {
    leadSourceRemarks: "",
    residentialAddress: "",
    source: "",
    address: "",
    countryId: "",
    stateId: "",
    districtId: "",
    amount: "0",
    isTransportFacility: false,
    location: "",
    longitude: "",
    latitude: "",
    transportAccept: "",
    hostelType: "",
}

const PaymentDetails = ({ applicationSaleData }: any) => {
    const dispatch = useAppDispatch()
    const params = useLocation().search;
    const queryParamsObject = parseQueryStringToObject(params);
    const [mapModal, setMapModal] = useState({
        showModal: false,
        // applicationId: undefined
    });
    const [termsConditionModal, setTermsConditionModal] = useState({
        showModal: false,
    });
    const [openRegistrationModal, setOpenRegistrationModal] = useState({
        showModal: false,
        studentRegNo: ""
    });
    const [warningModal, setWarningModal] = useState({
        showModal: false,
        payload: ""
    });
    const [isChecked, setIsChecked] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<any>(undefined);
    const selectedLocation = useRef<any>(null);
    const [curriculumName, setCurriculumName] = useState("");
    const { isHostelAvailable, curriculumId } = applicationSaleData.current.basicDetails || {};
    const paymentGatewayTypeRef = useRef('');

    const [paymentInfoState, setPaymentInfoState] = useState({
        ccavenueUrl: "",
        payloadData: "",
        accessCode: "",
    });
    const {
        brchCurriculumResp,
        genderListResp,
        applicationSaleClassListResp,
        addApplicationSaleResp,
        subjectListForCambridgeResp,
        applicationSaleError,
        countriesResp,
        countryStateResp,
        districtResp,
        branchListResp,
        showApiLoader,
        createJodoOrderResp,
        getAmountForApplicationSaleResp,
        saveEnquiryAppSaleResp,
        feePaymentResp,
        getPaymentGatewaysBranchListResp,
        enquirySourceListResp
    } = useAppSelector(
        ({
            masterData,
            branchAcademics,
            branch,
            applicationSale,
            globalData,
            instFeeSettings,
            feeCollections
        }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            genderListResp: masterData.genderListResp,
            applicationSaleClassListResp:
                applicationSale.applicationSaleClassListResp,
            addApplicationSaleResp: applicationSale.addApplicationSaleResp,
            subjectListForCambridgeResp: applicationSale.subjectListForCambridgeResp,
            getAmountForApplicationSaleResp: applicationSale.getAmountForApplicationSaleResp,
            saveEnquiryAppSaleResp: applicationSale.saveEnquiryAppSaleResp,
            applicationSaleError: applicationSale.applicationSaleError,
            countriesResp: masterData.countriesResp,
            countryStateResp: masterData.countryStateResp,
            districtResp: masterData.districtResp,
            branchListResp: branch.branchListResp,
            createJodoOrderResp: applicationSale.createJodoOrderResp,
            showApiLoader: globalData.showApiLoader,
            feePaymentResp: feeCollections.feePaymentResp,
            getPaymentGatewaysBranchListResp:
                instFeeSettings.getPaymentGatewaysBranchListResp,
            enquirySourceListResp: applicationSale.enquirySourceListResp,
        }),
        shallowEqual
    );

    const { branchId, instituteId } = queryParamsObject || {};
    useEffect(() => {
        if (branchId && instituteId) {
            const payload = {
                instituteId,
                branchId,
            };
            dispatch(getPaymentGatewaysBranchListAct(generateActionPayload("get_payment_gateways_branches_list", undefined, payload)));
        }
    }, [branchId, instituteId]);

    const validationSchema = Yup.object().shape({
        source: Yup.string().required('Select Source'),
        // address: Yup.string().required('Enter Address'),
        // hostelType: Yup.string().required('Select Admission Type'),
        // residentialAddress: Yup.string().required('Enter Residential Address'),
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
        leadSourceRemarks: Yup.string().when('source', {
            is: (val: string) => val === "OTHERS",
            then: (schema) => schema.required('Please enter text'),
            otherwise: (schema) => schema.notRequired(),
        }),
    })

    const applicationSaleFormParent = useFormik({
        initialValues: initialValue,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {

            const { fullName, dob, contactNumber, emailId, contactPerson, admissionClassId, secondLanguageId, groupId, optionalSubjects, languageForCambridgeState, selectedSubjects, showLanguageSelect, enquiryId, optionalSubj1Id, optionalSubj2Id, genderId, hostelType } = applicationSaleData?.current?.basicDetails || {};
            let payload: any = {
                instituteId: queryParamsObject.instituteId,
                branchId: queryParamsObject.branchId,
                academicYearId: queryParamsObject.academicYearId,
                curriculumId: curriculumId,
                fullName: fullName,
                dob: dob,
                enquiryId: enquiryId,
                contactNumber: contactNumber,
                genderId: genderId,
                emailId: emailId,
                contactPerson: contactPerson,
                admissionClassId: admissionClassId,
                secondLanguageId: secondLanguageId,
                admissionType: hostelType || "Non-Residential",
                leadSource: values.source,
                leadSourceRemarks: values.leadSourceRemarks,
                address: values.address,
                countryId: values.countryId,
                groupId: groupId,
                stateId: values.stateId,
                districtId: values.districtId,
                mode: "Online",
                transportAccept: values.transportAccept ? "irr_transport_facility" : "verified_transport_facility",
                longitude: values.longitude,
                latitude: values.latitude,
                transportFacility: values.isTransportFacility ? "YES" : "NO"
            };
            if (queryParamsObject.enquiryRefId) {
                payload.enquiryId = saveEnquiryAppSaleResp?.enquiryId
            }
            if (curriculumName === "CBSE") {
                let optionalSubject: any = {};
                if (optionalSubj1Id) {
                    optionalSubject.optionalSubj1Id = optionalSubj1Id
                }
                if (optionalSubj2Id) {
                    optionalSubject.optionalSubj2Id = optionalSubj2Id
                }
                let payloadCBSE = { ...payload, ...optionalSubject };
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
                if (checkHigherClass(admissionClassId) && subjectForCambridge?.optionalSubjects.length > 0) {
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

    function fetchEnquirySourceList() {
        dispatch(getEnquirySourceListAct(generateActionPayload("get_enquiry_source_list", undefined, {})));
    }

    const applicationSaleParentRef = useRef({
        prevAddApplicationSaleResp: addApplicationSaleResp,
        prevCreateJodoOrderResp: createJodoOrderResp,
        prevApplicationSaleError: applicationSaleError,
        prevFeePaymentResp: feePaymentResp,
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

            if (!paymentGatewayTypeRef.current) {
                paymentGatewayTypeRef.current = PaymentGatewayTypes.JODO;
            }
            const paymentPayload = createPaymentPayload({ ...applicationSaleFormParent.values, ...applicationSaleData?.current?.basicDetails, ...applicationSaleData?.current?.otherDetails }, {
                branchId: queryParamsObject?.branchId,
                curriculumId: curriculumId,
                applicationSaleId: applicationId,
                amount: applicationSaleFormParent.values.amount,
                gateWayType: paymentGatewayTypeRef.current,
                academicYearId: queryParamsObject.academicYearId
            });
            dispatch(createJodoOrder(generateActionPayload("jodo_order_pay", undefined, paymentPayload)));
        }
        else if (createJodoOrderResp && createJodoOrderResp !== prevCreateJodoOrderResp) {
            const { data } = createJodoOrderResp;
            if (paymentGatewayTypeRef.current === PaymentGatewayTypes.JODO) {
                if (data?.redirect_url) {
                    applicationSaleFormParent.resetForm();
                    window.location.assign(data?.redirect_url);

                } else {
                    toast.error("Something went wrong.");
                }
                paymentGatewayTypeRef.current = '';
            } else {
                if (data.order_id) {
                    const { fullName, contactNumber, emailId } = applicationSaleData?.current?.basicDetails || {};
                    const { applicationId } = addApplicationSaleResp;
                    const { amount } = applicationSaleFormParent.values;
                    const paymentPayload = {
                        orderRef: data?.order_id,
                        branchId: queryParamsObject?.branchId,
                        amount: import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : amount,
                        identifier: {
                            type: "APPLICATION",
                            value: applicationId,
                            studentId: null
                        },
                        mobileNumber: contactNumber,
                        email: emailId,
                        studentName: fullName,
                        pgName: paymentGatewayTypeRef.current,
                        callbackUrl: `${window.location.origin}/applicationpaymentstatus/${queryParamsObject?.branchId}`,
                        redirectUrl: window.location.href,
                    }
                    dispatch(feePaymentAct(generateActionPayload("ccavenue_fee_payment", undefined, paymentPayload)));
                } else {
                    toast.error("Something went wrong.");
                }
            }
        }
        else if (applicationSaleError && applicationSaleError !== prevApplicationSaleError) {
            const { details } = applicationSaleError;
            setOpenRegistrationModal((prevState: any) => ({ ...prevState, showModal: false }));
            toast.error(details);
        } else if (feePaymentResp && prevFeePaymentResp !== feePaymentResp) {
            const { encRequest, accessCode, actionUrl } = feePaymentResp;
            if (paymentGatewayTypeRef.current === PaymentGatewayTypes.EASEBUZZ) {
                if (actionUrl) {
                    window.location.assign(actionUrl);
                } else {
                    toast.error("Something went wrong.");
                }
            } else if (paymentGatewayTypeRef.current === PaymentGatewayTypes.CCAVENUE) {
                setPaymentInfoState({
                    ccavenueUrl: actionUrl,
                    payloadData: encRequest,
                    accessCode: accessCode,
                });
            }
            paymentGatewayTypeRef.current = '';
        }

        applicationSaleParentRef.current.prevAddApplicationSaleResp =
            addApplicationSaleResp;
        applicationSaleParentRef.current.prevCreateJodoOrderResp = createJodoOrderResp;
        applicationSaleParentRef.current.prevApplicationSaleError =
            applicationSaleError;
        applicationSaleParentRef.current.prevFeePaymentResp = feePaymentResp;
    }, [addApplicationSaleResp, createJodoOrderResp, feePaymentResp, applicationSaleError]);

    const ChangeHandler = (event: any) => {
        const { name, value } = event.target || {};
        if (name !== "admissionClassId") {
            applicationSaleFormParent.handleChange(event);
        }
        if (getLocalStorage("accesstoken")) {
            if (name === "countryId") {
                if (value) {
                    dispatch(
                        getCountryStateAct(
                            generateActionPayload("get_country_state", { countryId: value })
                        )
                    );
                }
            }
            else if (name === "stateId") {
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
            }

        }
    };

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

    useEffect(() => {
        if (Array.isArray(getAmountForApplicationSaleResp) && getAmountForApplicationSaleResp.length > 0) {
            const totalValue = getAmountForApplicationSaleResp.reduce((total: any, curr: any) => total + +curr?.settingValue, 0);
            applicationSaleFormParent.setFieldValue("amount", getDisplayAmountValue(totalValue))
        }
    }, [getAmountForApplicationSaleResp])

    useEffect(() => {
        setCurriculumName(
            brchCurriculumResp?.data.find(
                (curr: any) => curr.branchCurriculumId === +curriculumId
            )?.curriculumName
        );
    }, [brchCurriculumResp]);

    useEffect(() => {
        if (branchListResp) {
            const branchDetails = branchListResp?.data?.find(
                (bnc: any) => +bnc.branchId === +queryParamsObject.branchId
            );
            setSelectedBranch(branchDetails);
        }
    }, [branchListResp]);

    useEffect(() => {
        fetchEnquirySourceList()
    }, [])

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

    function openMapModalHandler() {
        setMapModal((prev: any) => ({
            ...prev,
            showModal: true,
        }));
    }

    const toggleTermsCondition = () => {
        setTermsConditionModal((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
        }));
    };

    const toggleRegistrationModal = (apiCall?: boolean) => {
        setOpenRegistrationModal((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    };

    const toggleWarningModal = (payload?: any) => {
        setWarningModal((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, payload: payload || "" }))
    };

    const toggleMapModal = (address?: any, lat?: any, long?: any) => {
        if (getLocalStorage("accesstoken") && address && lat && long) {
            selectedLocation.current = {
                address, lat, long
            }
            // applicationSaleFormParent.setFieldValue('location', address);
            // applicationSaleFormParent.setFieldValue('longitude', long);
            // applicationSaleFormParent.setFieldValue('latitude', lat);
            applicationSaleFormParent.setValues((prev: any) => ({
                ...prev,
                location: address,
                address: address,
                longitude: long,
                latitude: lat,
            }))
        }
        setMapModal((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
        }));
    }

    function onAcceptTransportHandler(event: any) {
        const { name, checked } = event.target;
        applicationSaleFormParent.setFieldValue(name, checked);
    }

    const finalSubmitHndler = () => {
        dispatch(addApplicationSale(generateActionPayload("add_application_sale", undefined, warningModal.payload)));
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


    function handleCcAvenuePayment() {
        paymentGatewayTypeRef.current = PaymentGatewayTypes.CCAVENUE;
        applicationSaleFormParent.handleSubmit();
    }

    function easeBuzzPaymentHandler() {
        paymentGatewayTypeRef.current = PaymentGatewayTypes.EASEBUZZ;
        applicationSaleFormParent.handleSubmit();
    }



    const disablePayBtn = applicationSaleFormParent.values.isTransportFacility ?
        !applicationSaleFormParent.values.transportAccept
        : false;

    const { data: districtList } = districtResp || {};
    const { data: subjectForCambridge } = subjectListForCambridgeResp || {};

    const { isJodoEnabled, isCcAvenueEnabled, isEasyBuzzEnabled } = useMemo(() => {
        const pgs = getPaymentGatewaysBranchListResp?.[0]?.pgs ?? [];
        return {
            isJodoEnabled: pgs.some((pg: any) => pg.pgName === PaymentGatewayTypes.JODO),
            isCcAvenueEnabled: pgs.some((pg: any) => pg.pgName === PaymentGatewayTypes.CCAVENUE),
            isEasyBuzzEnabled: pgs.some((pg: any) => pg.pgName === PaymentGatewayTypes.EASEBUZZ),
        };
    }, [getPaymentGatewaysBranchListResp]);

    const handleCountrySelectChange = (
        selectedId: string | number,
        meta: { item: any; name: string }
    ) => {
        const fakeEvent = {
            target: {
                name: meta.name,
                value: selectedId,
            },
        } as any;

        ChangeHandler(fakeEvent);
    };

    const handleStateSelectChange = (
        selectedId: string | number,
        meta: { item: any; name: string }
    ) => {
        const fakeEvent = {
            target: {
                name: meta.name,
                value: selectedId,
            },
        } as any;

        ChangeHandler(fakeEvent);
    };


    const handleDistrictSelectChange = (
        selectedId: string | number,
        meta: { item: any; name: string }
    ) => {
        applicationSaleFormParent.setFieldValue(meta.name, selectedId);
    };

    return (
        <>
            <form className='form-inputs tw-grid md:tw-grid-cols-2 tw-gap-x-6 tw-mt-4 tw-gap-y-4'>

                {/* <p className="fs-13 fw-bold mb-3">
                    Note : Please fill the complete address including
                    H.No,Landmark,city,state and country in address columns
                </p>
                <div className="col-12 col-md-6">
                    <label>Residential Address <span className="text-danger">*</span></label>
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
                </div> */}
                {/* <div className="col-12 col-md-6">
                    <label>Admission Type <span className="text-danger">*</span></label>
                    <SelectInput
                        name="hostelType"
                        value={applicationSaleFormParent.values.hostelType}
                        onChange={applicationSaleFormParent.handleChange}
                        onBlur={applicationSaleFormParent.handleBlur}
                        menuItems={isHostelAvailable ? admissionTypes : admissionTypesForNonResidential}
                        valueKey="id"
                        textKey="name"
                        invalid={applicationSaleFormParent.touched.hostelType &&
                            applicationSaleFormParent.errors.hostelType
                            ? true
                            : false}
                        error={applicationSaleFormParent.touched.hostelType &&
                            applicationSaleFormParent.errors.hostelType
                            ? applicationSaleFormParent.errors.hostelType
                            : ""}
                    />
                </div> */}
                {/* <div className="col-12 col-md-6">
                    <label>
                        Address (From where the Application is made) <span className="text-danger">*</span>
                    </label>
                    <TextArea
                        name="address"
                        height="50px"
                        inputClassName={"overflow-auto"}
                        value={applicationSaleFormParent.values.address}
                        onChange={applicationSaleFormParent.handleChange}
                        onBlur={applicationSaleFormParent.handleBlur}
                        invalid={applicationSaleFormParent.touched.address &&
                            applicationSaleFormParent.errors.address
                            ? true
                            : false}
                        error={applicationSaleFormParent.touched.address &&
                            applicationSaleFormParent.errors.address
                            ? applicationSaleFormParent.errors.address
                            : ""}
                    />
                </div> */}
                <div className="tw-col-span-2 md:tw-col-span-1">
                    <label>How were you informed about us? <span className="text-danger">*</span></label>
                    <SelectInput
                        name="source"
                        value={
                            applicationSaleFormParent.values.source
                        }
                        onChange={applicationSaleFormParent.handleChange}
                        onBlur={applicationSaleFormParent.handleBlur}
                        menuItems={enquirySourceListResp || []}
                        valueKey="sourceName"
                        textKey="sourceName"
                        invalid={applicationSaleFormParent.touched.source &&
                            applicationSaleFormParent.errors.source
                            ? true
                            : false}
                        error={applicationSaleFormParent.touched.source &&
                            applicationSaleFormParent.errors.source
                            ? applicationSaleFormParent.errors.source
                            : ""}
                        formgroupClassName='mb-0'
                    />
                </div>
                {applicationSaleFormParent.values.source === "OTHERS" && <div className="tw-col-span-2">
                    {/* <label>Other</label> */}
                    <TextArea
                        name='leadSourceRemarks'
                        labelClass='required'
                        labelText="Other"
                        maxLength={250}
                        value={applicationSaleFormParent.values.leadSourceRemarks}
                        onChange={applicationSaleFormParent.handleChange}
                        formgroupClassName='mb-0'
                        invalid={applicationSaleFormParent.touched.leadSourceRemarks &&
                            applicationSaleFormParent.errors.leadSourceRemarks
                            ? true
                            : false}
                        error={applicationSaleFormParent.touched.leadSourceRemarks &&
                            applicationSaleFormParent.errors.leadSourceRemarks
                            ? applicationSaleFormParent.errors.leadSourceRemarks
                            : ""}
                    />
                </div>}
                <div className="tw-col-span-2 md:tw-col-span-1">
                    <label>
                        Country (From where the Application is made) <span className="text-danger">*</span>
                    </label>
                    <CustomSelect
                        name="countryId"
                        idKey="id"
                        defaultSelect="Select Country"
                        value={applicationSaleFormParent.values.countryId}
                        initialValue={
                            (countriesResp || []).find(
                                (c: any) =>
                                    c.id?.toString() ===
                                    applicationSaleFormParent.values.countryId?.toString()
                            ) || null
                        }
                        renderValue={renderCountryValue}
                        renderOptions={renderCountryOption}
                        onChange={handleCountrySelectChange}
                        searchKey="countryName"
                        options={countriesResp || []}
                        containerClassName="mb-0"
                        invalid={
                            applicationSaleFormParent.touched.countryId &&
                            !!applicationSaleFormParent.errors.countryId
                        }
                        error={
                            applicationSaleFormParent.touched.countryId &&
                                applicationSaleFormParent.errors.countryId
                                ? applicationSaleFormParent.errors.countryId
                                : ""
                        }
                    />
                </div>
                {countryName(
                    applicationSaleFormParent.values.countryId
                ) === "India" && (
                        <div className="tw-col-span-2 md:tw-col-span-1">
                            <label>State <span className="text-danger">*</span></label>
                            <CustomSelect
                                name="stateId"
                                idKey="id"
                                value={applicationSaleFormParent.values.stateId}
                                initialValue={
                                    (countryStateResp || []).find(
                                        (s: any) =>
                                            s.id?.toString() ===
                                            applicationSaleFormParent.values.stateId?.toString()
                                    ) || null
                                }
                                renderValue={renderStateValue}
                                renderOptions={renderStateOption}
                                onChange={handleStateSelectChange}
                                searchKey="stateName"
                                options={countryStateResp || []}
                                defaultSelect="Select State"
                                invalid={
                                    applicationSaleFormParent.touched.stateId &&
                                    !!applicationSaleFormParent.errors.stateId
                                }
                                error={
                                    applicationSaleFormParent.touched.stateId &&
                                        applicationSaleFormParent.errors.stateId
                                        ? applicationSaleFormParent.errors.stateId
                                        : ""
                                }
                                containerClassName="mb-0"
                            />
                        </div>
                    )}
                {stateName(applicationSaleFormParent.values.stateId) ===
                    "Telangana" && (
                        <div className="tw-col-span-2 md:tw-col-span-1">
                            <label>District <span className="text-danger">*</span></label>
                            <CustomSelect
                                name="districtId"
                                idKey="districtId"
                                value={applicationSaleFormParent.values.districtId}
                                initialValue={
                                    (districtList || []).find(
                                        (d: any) =>
                                            d.districtId?.toString() ===
                                            applicationSaleFormParent.values.districtId?.toString()
                                    ) || null
                                }
                                renderValue={renderDistrictValue}
                                renderOptions={renderDistrictOption}
                                onChange={handleDistrictSelectChange}
                                searchKey="districtName"
                                options={districtList || []}
                                defaultSelect="Select District"
                                invalid={
                                    applicationSaleFormParent.touched.districtId &&
                                    !!applicationSaleFormParent.errors.districtId
                                }
                                error={
                                    applicationSaleFormParent.touched.districtId &&
                                        applicationSaleFormParent.errors.districtId
                                        ? applicationSaleFormParent.errors.districtId
                                        : ""
                                }
                                containerClassName="mb-0"
                            />
                        </div>
                    )}
                <div className="tw-col-span-2 md:tw-col-span-1">
                    <label>Amount(₹)</label>
                    <TextInput
                        name="amount"
                        value={applicationSaleFormParent.values.amount}
                        onChange={applicationSaleFormParent.handleChange}
                        formgroupClassName="mb-0"
                        isDisabled={true}
                    />
                    <p className="fs-11 pt-2 tw-mb-0">
                        ({getAmountForApplicationSaleResp?.map((item: any, index: number) => (
                            `${index !== 0 ? " +" : " "} ${item?.settingKey?.split("_")?.join(" ")} : ${getDisplayAmountValue(+item?.settingValue)}`
                        ))})
                    </p>
                </div>
                <div className="tw-col-span-2">
                    <InputCheckboxUpdated
                        name="isTransportFacility"
                        labelName="School Transportation"
                        formgroupClassName={`form-check-green ${applicationSaleFormParent.values.isTransportFacility ? "mb-0" : "mb-0"} `}
                        inputClassName="!tw-h-4 !tw-w-4 !tw-flex-shrink-0"
                        value={applicationSaleFormParent.values.isTransportFacility}
                        onChange={TransportHandler}
                    // isDisabled={true}
                    />
                </div>
                {applicationSaleFormParent.values.isTransportFacility && <div className="tw-col-span-2 md:tw-col-span-1">
                    <TextInputGroup
                        name="location"
                        inputgroupClassName="input-group-md"
                        inputClassName="form-control-md bg-white"
                        formgroupClassName="mb-0"
                        value={applicationSaleFormParent.values.location}
                        onChange={applicationSaleFormParent.handleChange}
                        placeHolder="Select your location"
                        isReadOnly={true}
                        isDisabled={true}
                    >
                        <i
                            onClick={openMapModalHandler}
                            className="fs-20 ri-map-pin-fill text-green cursor-pointer"></i>
                    </TextInputGroup>
                </div>}
                {applicationSaleFormParent.values.location && applicationSaleFormParent.values.isTransportFacility &&
                    <div className="tw-col-span-2 mb-3">
                        <InputCheckboxUpdated
                            name="transportAccept"
                            labelName="I agree to proceed further irrespective of transport facility."
                            formgroupClassName="form-check-green mb-0"
                            inputClassName="!tw-h-4 !tw-w-4 !tw-flex-shrink-0"
                            value={Boolean(applicationSaleFormParent.values.transportAccept)}
                            onChange={onAcceptTransportHandler}
                        />
                        <p className=" m-0  ms-4">
                            I want to verify whether transport is available for my locality.{" "}
                            <a className="text-info" target="_blank" href={`https://${selectedBranch?.websiteUrl}/${queryParamsObject?.branchId?.toString() === "1" ? "transport-facility" : "Transport"}`}>
                                Check Here</a> to find the transport facility.</p>
                    </div>
                }
                <div className='tw-col-span-2 d-none'>
                    <p className='mb-0'><span className="font-bold">Note:</span> <span className="text-danger tw-font-medium tw-text-xs">
                        Application does not imply admission.  Admission is subject to the availability of seats and eligibility criteria.  There would be no refund of the application/registration fee in case the application is not processed
                    </span></p>

                </div>
                <div className="tw-col-span-2 tw-mb-3">
                    <InputCheckboxUpdated
                        name="flexCheckDefault"
                        formgroupClassName="form-check-green mb-0 mt-2"
                        inputClassName="!tw-h-4 !tw-w-4 !tw-flex-shrink-0"
                        value={isChecked}
                        onChange={(event: any) => setIsChecked(event.target.checked)}
                    >
                        <label className="form-check-label tw-font-medium tw-text-sm">
                            I Agree to the
                            <span
                                className="text-info"
                                onClick={toggleTermsCondition}
                            >
                                {" "}
                                Terms & Conditions
                            </span>
                        </label>
                    </InputCheckboxUpdated>
                </div>
                <div className="tw-col-span-2 bottom-list">
                    <div className='tw-flex tw-gap-2 tw-justify-center tw-flex-col sm:tw-flex-row tw-items-center tw-flex-wrap'>
                        {isJodoEnabled && <div className="tw-w-[90%] sm:tw-w-auto">
                            <button
                                className="tw-bg-[#155B2E] tw-text-white tw-border-none tw-rounded-[8px] tw-py-[10px] tw-px-[32px] hover:tw-bg-[#114925] tw-transition-colors tw-w-full sm:tw-w-auto disabled:tw-bg-[#588066] disabled:tw-cursor-not-allowed disabled:hover:tw-bg-gray-[#295b3b]"
                                type="submit"
                                onClick={(event: any) =>
                                    applicationSaleFormParent.handleSubmit(event)
                                }
                                disabled={showApiLoader || !isChecked || (disablePayBtn)}
                            >
                                Pay Through Jodo
                            </button>
                        </div>}
                        {isCcAvenueEnabled && <div className="tw-w-[90%] sm:tw-w-auto">
                            <button
                                className="tw-bg-[#155B2E] tw-text-white tw-border-none tw-rounded-[8px] tw-py-[10px] tw-px-[32px]  hover:tw-bg-[#114925] tw-transition-colors tw-w-full sm:tw-w-auto disabled:tw-bg-[#588066] disabled:tw-cursor-not-allowed disabled:hover:tw-bg-gray-[#295b3b]"
                                type="button"
                                onClick={handleCcAvenuePayment}
                                disabled={showApiLoader || !isChecked || (disablePayBtn)}
                            >
                                Pay Through Kotak
                            </button>
                        </div>}
                        {isEasyBuzzEnabled && <div className="tw-w-[90%] sm:tw-w-auto">
                            <button
                                className="tw-bg-[#155B2E] tw-text-white tw-border-none tw-rounded-[8px] tw-py-[10px] tw-px-[32px]  hover:tw-bg-[#114925] tw-transition-colors tw-w-full sm:tw-w-auto disabled:tw-bg-[#588066] disabled:tw-cursor-not-allowed disabled:hover:tw-bg-gray-[#295b3b]"
                                type="button"
                                onClick={easeBuzzPaymentHandler}
                                disabled={showApiLoader || !isChecked || (disablePayBtn)}
                            >
                                Pay Through Easebuzz
                            </button>
                        </div>}
                    </div>
                    <div className="col-12">
                        <div className="contact-container mt-3 d-flex align-items-center justify-content-center">
                            <p className='text-dark mb-0 tw-text-sm lg:tw-text-base'>
                                <span className='me-2'>
                                    <img className="img-fluid tw-w-[24px] tw-h-[24px]" src={Email} />
                                </span>
                                <span className="text-danger">Facing issue? </span>
                                <a
                                    href={WHATSAPP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration"
                                >
                                    <span className='text-info'>
                                        Click here
                                    </span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
            <form id="nonseamless" ref={paymentFormRef} method="post" name="redirect"
                action={paymentInfoState.ccavenueUrl}>
                <input type="hidden" id="encRequest" name="encRequest" value={paymentInfoState.payloadData} />
                <input type="hidden" name="access_code" id="access_code" value={paymentInfoState.accessCode} />
            </form>
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
        </>
    )
}

export default PaymentDetails