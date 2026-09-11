import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AutoSearchInput, DateInput, ModalContainerUpdated, NewPhoneInput, SelectInput, TextArea, TextInput, TextInputGroup, UserDetails } from '../../../../Components/Common'

import { useFormik } from 'formik';
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { setBrchClassAct } from '../../../../store/branchsettings/branchacademics/branchacademicsslice';
import { getBranchClassAct, getBrchSectionsAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { addNewRequesrItFormAct, getStudentFeeItFormAct, getStudentsItFromAct, resetStudentFeeItFormAct } from '../../../../store/fee/feeapprovals/feeapprovalactions';
import { Current_Date_YYYYMMDD, getDdMmYyyyFormat, getYyyyMmDdFormat } from '../../../../utility/dateutility';
import * as Yup from 'yup';
import { getAmountValueWithDecimal } from '../../../../utility/commonutility';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns, requestTypeOptions } from './helper';
import { getTransportAvalabilityStatus, setTransportAvalabilityStatus } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import LocationSelectorModal from './LocationSelectorModal';
import { toast } from 'react-toastify';
import { createTransportRequestAct, getNearestStopsAct, setNearestStopsAct } from '../../../../store/transportation/transportationaction';
import Button from '../../../../Components/Common/Button';


function editTransportInfo(editInfo?: any) {
    return ({
        startFromDate: Current_Date_YYYYMMDD,
        requestType: "", // NEW_REQUEST , CHANGE_REQUEST , TERMINATION_REQUEST
        description: "",
        address: editInfo?.address || "",
        latitude: editInfo?.latitude || "",
        longitude: editInfo?.longitude || "",
        landmark: "",
        academicYearId: editInfo?.academicYearId || "",
        branchId: editInfo?.branchId || "",
        branchCurriculumId: editInfo?.curriculumId || "",
        classId: editInfo?.classId || "",
        source: "",
        pincode: editInfo?.pincode || "",
        studentId: editInfo?.childId || "",
        alternativePhoneNo: editInfo?.alternativePhoneNo || "",
        remarks: "remarks",
        preferenceStopId: "",

        //
        slabFeeExist: false,
    })
}

const validationSchema = Yup.object().shape({
    requestType: Yup.string().required("Request type is required."),
    address: Yup.string().required("Address is required."),
    description: Yup.string().required("Description is required."),
    landmark: Yup.string().required("Landmark is required."),
    remarks: Yup.string().required("Remarks is required."),
    alternativePhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.'),
    pincode: Yup.string().required("Pincode is required.").matches(/^\d{6}$/, 'Pin code must be 6 digits'),
    // slabFeeExist: Yup.bool().oneOf(
    //     [true],
    //     'Slab fee is not there for the selected location.'
    // ),
});

const initialValues = editTransportInfo();
const AddTransportationModal = (props: any) => {
    const dispatch = useDispatch();
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [mapSelectedInfoState, setMapSelectedInfoState] = useState({
        mapAddress: "",
        latitute: "",
        longitude: ""
    });
    const selectedLocation = useRef<any>(null);
    const [mapModal, setMapModal] = useState<any>({
        showModal: false,
        // applicationId: undefined
    });

    const transportRequestForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload: any = { ...values };
            delete payload?.slabFeeExist;
            payload.branchId = branchId;
            dispatch(createTransportRequestAct(generateActionPayload('create_transport_request', undefined, payload)))
        },
    });

    const {
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        transportAvalabilityStatus,
        createTransportRequestResp, nearestStopResp,
        showApiLoader } =
        useAppSelector(({ appData, applicationSale, transportrequest, globalData }) => ({
            showApiLoader: globalData.showApiLoader,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            transportAvalabilityStatus: applicationSale.transportAvalabilityStatus,
            createTransportRequestResp: transportrequest.createTransportRequestResp,
            nearestStopResp: transportrequest.nearestStopResp,
        }), shallowEqual);

    const traportModalRef = useRef({
        prevTransportAvalabilityStatus: transportAvalabilityStatus,
        prevCreateTransportRequestResp: createTransportRequestResp,
    })

    useEffect(() => {
        const { prevTransportAvalabilityStatus, prevCreateTransportRequestResp } = traportModalRef.current;
        if (transportAvalabilityStatus && prevTransportAvalabilityStatus !== transportAvalabilityStatus) {
            if (Array.isArray(transportAvalabilityStatus) && transportAvalabilityStatus.length > 0) {
                transportRequestForm.setFieldValue("slabFeeExist", true);
            } else {
                transportRequestForm.setFieldValue("slabFeeExist", false);
            }
        } else if (createTransportRequestResp && prevCreateTransportRequestResp !== createTransportRequestResp) {
            toast.success("Transport request created successfully");
            props.toggle(true);
        }
        traportModalRef.current.prevTransportAvalabilityStatus = transportAvalabilityStatus;
        traportModalRef.current.prevCreateTransportRequestResp = createTransportRequestResp;
    }, [transportAvalabilityStatus, createTransportRequestResp]);

    useEffect(() => {
        const { childInfo } = props;
        if (childInfo) {
            const formData = editTransportInfo(childInfo);
            transportRequestForm.resetForm({
                values: formData
            })
        }
    }, [props.childInfo]);

    useEffect(() => {
        return () => { dispatch(setTransportAvalabilityStatus(undefined)); }
    }, []);

    const toggleMapModal = (address?: string, lat?: string, long?: string) => {
        const { childInfo } = props;
        if (address && lat && long) {
            setMapSelectedInfoState(prevState => ({
                ...prevState,
                latitute: lat,
                mapAddress: address,
                longitude: long,
            }));

            transportRequestForm.setFieldValue("landmark", address);
            transportRequestForm.setValues(prevValues => ({
                ...prevValues,
                landmark: address, latitude: lat, longitude: long
            }));
            transportRequestForm.setFieldTouched("slabFeeExist", true);
            transportRequestForm.setFieldError("slabFeeExist", "");
            dispatch(setNearestStopsAct(undefined));
            // const payload = { academicYearId: childInfo.academicYearId, branchId: props.branchId, locationLatitude: lat, locationLongitude: long }
            // dispatch(getTransportAvalabilityStatus(generateActionPayload('transport_availability_status', undefined, payload)))
            const stopParams = { branchId, latitude: lat, longitude: long };
            dispatch(getNearestStopsAct(generateActionPayload('nearest_stops', undefined, stopParams)))
        }
        setMapModal((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
        }));
    }

    const ContactNoChangeHandler = (contactNo: any) => {
        const alternativePhoneNo = contactNo.substring(2)
        transportRequestForm.setFieldValue('alternativePhoneNo', alternativePhoneNo);
    }

    const roleColumns = useMemo(() => generateColumns(), []),
        { childInfo } = props;
    return (
        <>
            <div className="tw-p-5">
                <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div>
                        <TextInput
                            name="academicYearId"
                            labelClass='required'
                            value={childInfo?.academicYearName}
                            onChange={null}
                            labelText='Academic Year'
                            isDisabled={true}
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="requestType"
                            labelClass='required'
                            value={transportRequestForm.values.requestType}
                            onChange={transportRequestForm.handleChange}
                            menuItems={requestTypeOptions}
                            valueKey="id"
                            textKey="name"
                            // inputClassName="bg-light border-0"
                            // formgroupClassName="mb-0"
                            labelText='Request Type'
                            invalid={(transportRequestForm.touched.requestType && transportRequestForm.errors.requestType) ? true : false}
                            error={(transportRequestForm.touched.requestType && transportRequestForm.errors.requestType) ? transportRequestForm.errors.requestType : ""}
                        />
                    </div>
                    <div>
                        <DateInput
                            name="date"
                            labelClass="required"
                            value={transportRequestForm.values.startFromDate}
                            onChange={null}
                            labelText="Date"
                            inputClassName="tw-bg-gray-100"
                            isReadOnly={true}
                        />
                    </div>
                    <div>
                        <TextInput
                            name="studentDetails"
                            labelClass="required"
                            value={`${childInfo?.childName}-${childInfo?.childCode}`}
                            onChange={null}
                            labelText="Student Details"
                            isDisabled={true}
                        />
                    </div>
                    <div>
                        <TextInput
                            name="pincode"
                            labelClass="required"
                            value={transportRequestForm.values.pincode}
                            onChange={(event: any) => {
                                if (event.target.value.length < 7) {
                                    transportRequestForm.handleChange(event);
                                }
                            }}
                            onBlur={transportRequestForm.handleBlur}
                            inputType="number"
                            labelText="Pincode"
                            invalid={(transportRequestForm.touched.pincode && transportRequestForm.errors.pincode) ? true : false}
                            error={(transportRequestForm.touched.pincode && transportRequestForm.errors.pincode) ? transportRequestForm.errors.pincode : ""}
                        />
                    </div>
                    <div>
                        <NewPhoneInput
                            name="alternativePhoneNo"
                            labelText="Alternative Phone No."
                            value={transportRequestForm.values.alternativePhoneNo}
                            onChange={ContactNoChangeHandler}
                            invalid={(transportRequestForm.touched.alternativePhoneNo && transportRequestForm.errors.alternativePhoneNo) ? true : false}
                            error={(transportRequestForm.touched.alternativePhoneNo && transportRequestForm.errors.alternativePhoneNo) ? transportRequestForm.errors.alternativePhoneNo : ""}
                        />
                    </div>
                </div>

                <div className="tw-mb-3">
                    <TextInput
                        name="address"
                        labelClass="required"
                        value={transportRequestForm.values.address}
                        onChange={transportRequestForm.handleChange}
                        labelText="Address"
                        invalid={(transportRequestForm.touched.address && transportRequestForm.errors.address) ? true : false}
                        error={(transportRequestForm.touched.address && transportRequestForm.errors.address) ? transportRequestForm.errors.address : ""}
                    />
                    <TextInputGroup
                        name="landmark"
                        labelClass="required"
                        inputgroupClassName="tw-input-group-md"
                        inputClassName="tw-bg-white"
                        labelText="Landmark"
                        value={mapSelectedInfoState.mapAddress}
                        onChange={null}
                        placeHolder="Select Landmark"
                        isDisabled={true}
                        invalid={(transportRequestForm.touched.landmark && transportRequestForm.errors.landmark) ? true : false}
                        error={(transportRequestForm.touched.landmark && transportRequestForm.errors.landmark) ? transportRequestForm.errors.landmark : ""}
                    >
                        <i
                            onClick={() => toggleMapModal()}
                            className="fs-16 ri-map-pin-fill text-green tw-cursor-pointer"
                        ></i>
                    </TextInputGroup>
                    <SelectInput
                        name="preferenceStopId"
                        value={transportRequestForm.values.preferenceStopId}
                        onChange={transportRequestForm.handleChange}
                        menuItems={nearestStopResp}
                        valueKey="id"
                        textKey="stopName"
                        labelText="Preference Stop"
                    />
                    {/* <div className='row g-3'>
                            <div className='col'>
                                <TextInput
                                    name={"latitute"}
                                    value={mapSelectedInfoState?.latitute}
                                    onChange={null}
                                    // isDisabled={true}
                                    labelText='Latitute'
                                    isDisabled={true}
                                />
                            </div>
                            <div className='col'>
                                <TextInput
                                    name={"longitude"}
                                    value={mapSelectedInfoState?.longitude}
                                    onChange={null}
                                    // isDisabled={true}
                                    labelText='Longitude'
                                    isDisabled={true}
                                />
                            </div>
                        </div> */}
                    <TextArea
                        name="description"
                        labelClass="required"
                        value={transportRequestForm.values.description}
                        formgroupClassName="tw-mb-0"
                        onChange={transportRequestForm.handleChange}
                        labelText="Request Description"
                        invalid={(transportRequestForm.touched.description && transportRequestForm.errors.description) ? true : false}
                        error={(transportRequestForm.touched.description && transportRequestForm.errors.description) ? transportRequestForm.errors.description : ""}
                    />
                    {/* <div className='col'>
                        
                        <div>
                            <label htmlFor="">Fee Details</label>
                            <div style={{ border: "1px solid #CED4DA", borderRadius: "5px", }}>
                                <TableContainer
                                    columns={roleColumns}
                                    data={Array.isArray(transportAvalabilityStatus) ? transportAvalabilityStatus : []}
                                    divClass="table-responsive"
                                    theadClass="table-light text-muted align-middle"
                                    showPagination={false}
                                />
                            </div>
                            {(transportRequestForm.touched.slabFeeExist && transportRequestForm.errors.slabFeeExist) && <div className='d-block invalid-feedback mt-1'>
                                {(transportRequestForm.touched.slabFeeExist && transportRequestForm.errors.slabFeeExist) ? transportRequestForm.errors.slabFeeExist : ""}
                            </div>}

                        </div>
                    </div> */}
                </div>

                <div className="tw-mb-4">
                    <p className="tw-text-[13px] tw-font-semibold tw-mb-1 tw-text-gray-500">
                        Note : Allotment of transportion is subject to availability of buses for the given location.
                    </p>
                </div>

                <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
                    <Button
                        type="button"
                        variant='secondary'
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant='primary'
                        onClick={(event: any) => transportRequestForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>

                </div>
            </div>
            <ModalContainerUpdated
                id="map-modal-transport"
                isOpen={mapModal.showModal}
                toggle={toggleMapModal}
                modalTitle="Map Modal"
                modalSize="lg"
            >
                <LocationSelectorModal
                    isOpen={mapModal.showModal}
                    toggle={toggleMapModal}
                    selectedLocation={mapSelectedInfoState}
                />
            </ModalContainerUpdated>
        </>
    )
}

export default AddTransportationModal
