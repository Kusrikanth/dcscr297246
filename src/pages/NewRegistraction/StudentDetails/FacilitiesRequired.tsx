import React, { useState, useEffect, useContext, useMemo } from "react";
import { shallowEqual } from "react-redux";
import {
    AccordionBody,
    AccordionHeader
} from "reactstrap";
import {
    InputCheckbox,
    InputCheckboxUpdated,
    ModalContainerUpdated,
    TextInputGroup,
} from "../../../Components/Common";
import { StepperFormContext } from "../helper";
import { getAdmissionFacilitysListAct } from "../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useModal } from "../../../hooks/modalhook";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";
import LocationSelectorModal from "../../ApplicationSaleParent/LocationSelectorModal";

const validationSchema = Yup.object().shape({
    address: Yup.string().when("hasOptedTransport", {
        is: true,
        then: Yup.string().required("Please provide your address to use the transport service."),
        otherwise: Yup.string().notRequired(),
    }),
    transportAccept: Yup.string().when("hasOptedTransport", {
        is: true,
        then: Yup.string().required("You must confirm acceptance to opt for transport."),
        otherwise: Yup.string().notRequired(),
    }),
});

function getInitialState(initialState?: any) {
    return {
        facilitiesIds: new Set(
            Array.isArray(initialState?.facilitiesIds)
                ? initialState.facilitiesIds
                : []
        ),
        hasOptedTransport: false,
        latitude: initialState?.latitude ?? '',
        longitude: initialState?.longitude ?? '',
        address: initialState?.address ?? '',
        transportAccept: initialState?.transportAccept === 'irr_transport_facility' ? initialState?.transportAccept : ''
    }
}

const initialValues = getInitialState();
export default function FacilitiesRequired({ stepId, branchId, instituteId, formId, storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);
    const { openModal: openLocationModalHndlr, closeModal: closeLocationModalHndlr, modalState: locationModalState } = useModal();
    const dispatch = useAppDispatch();
    const { getAdmissionFacilitysListResp: facilityList, branchListResp } = useAppSelector(({ branch, admissionAvailabilityRequest }) => ({
        getAdmissionFacilitysListResp: admissionAvailabilityRequest.getAdmissionFacilitysListResp,
        branchListResp: branch.branchListResp,
    }), shallowEqual);

    const facilityForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            console.log({ values });
            const { facilitiesIds, transportAccept, hasOptedTransport, ...locationInfo } = values;
            storeMultiFormDataCallback(formId, true, facilityForm.dirty, {
                facilitiesIds: Array.from(facilitiesIds),
                transportAccept: transportAccept || 'verified_transport_facility',
                ...locationInfo
            });
        }
    })

    useEffect(() => {
        if (branchId) {
            dispatch(getAdmissionFacilitysListAct(generateActionPayload("get_admission_facility_list", undefined, { branchId })));
        }
        if (instituteId) {
            const payload = { instituteId, pageNo: 0, pageSize: 20 };
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
        }
    }, [branchId, instituteId]);

    const transportFacilityId = React.useMemo(() => {
        const transport = facilityList?.find(
            (f: any) => f.facilityName?.toLowerCase().includes("transport")
        );
        return transport?.id ?? null;
    }, [facilityList]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const formData = getInitialState(tabsData[stepId]);
            if (formData.latitude && formData.longitude && !formData.facilitiesIds.has(transportFacilityId)) {
                formData.facilitiesIds.add(transportFacilityId);
            }
            const hasOptedTransport =
                transportFacilityId !== null &&
                formData.facilitiesIds.has(transportFacilityId);
            facilityForm.resetForm({
                values: { ...formData, hasOptedTransport }
            });
        }
    }, [tabsData, stepId, transportFacilityId]);


    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            facilityForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = event.target;
        const facilityId = Number(name.split("-")[1]);
        const updatedIds = new Set(facilityForm.values.facilitiesIds);
        if (checked) {
            updatedIds.add(facilityId);
        } else {
            updatedIds.delete(facilityId);
        }
        facilityForm.setValues(values => {
            const nextValues: typeof values = {
                ...values,
                facilitiesIds: updatedIds,
            };
            if (facilityId === transportFacilityId) {
                nextValues.hasOptedTransport = checked;
                if (!checked) {
                    nextValues.latitude = "";
                    nextValues.longitude = "";
                    nextValues.address = "";
                    nextValues.transportAccept = "";
                }
            }
            return nextValues;
        });
    }

    function selectionLocationHandler() {
        const { latitude, longitude, address } = facilityForm.values;
        openLocationModalHndlr({
            lat: latitude ?? '',
            long: longitude ?? '',
            address: address ?? ''
        });
    }

    const toggleMapModal = (address?: any, lat?: any, long?: any) => {
        facilityForm.setValues(prev => ({
            ...prev,
            latitude: lat,
            longitude: long,
            address: address
        }))
        closeLocationModalHndlr();
    }

    function onAcceptTransportHandler(event: any) {
        const { name, checked } = event.target;
        facilityForm.setFieldValue(name, checked ? 'irr_transport_facility' : '');
    }

    const branchInfo: any = useMemo(() => {
        return branchListResp?.data?.find(item => item.branchId?.toString() === branchId?.toString())
    }, [branchListResp, branchId]);


    return (
        <>
            <form onSubmit={facilityForm.handleSubmit}>
                <AccordionHeader tag="h5" targetId="facilityRequired">
                    Facilities Required
                </AccordionHeader>
                <AccordionBody accordionId="facilityRequired">
                    <div className="tw-grid tw-grid-cols-4">
                        {
                            Array.isArray(facilityList) &&
                            facilityList.map(facility => (
                                <React.Fragment key={`facility-${facility?.id}`}>
                                    <InputCheckbox
                                        name={`facility-${facility?.id}`}
                                        labelName={facility.facilityName}
                                        formgroupClassName="form-check-green tw-mb-3"
                                        value={facilityForm.values.facilitiesIds.has(facility.id)}
                                        onChange={onChangeHandler}
                                    />
                                </React.Fragment>
                            ))
                        }
                    </div>
                    {facilityForm.values.hasOptedTransport && <><TextInputGroup
                        name="address"
                        // inputgroupClassName="input-group-md"
                        inputClassName="tw-bg-white"
                        formgroupClassName="tw-w-[75%] tw-mb-0"
                        labelClass="required"
                        labelText="Transport Location"
                        value={facilityForm.values.address}
                        onChange={() => { }}
                        placeHolder="Select your location"
                        isReadOnly={true}
                        isDisabled={true}
                        invalid={(facilityForm.touched.address && facilityForm.errors.address) ? true : false}
                        error={(facilityForm.touched.address && facilityForm.errors.address) ? facilityForm.errors.address : ""}
                    >
                        <i
                            onClick={selectionLocationHandler}
                            className="ri-map-pin-fill text-green cursor-pointer tw-text-xl"></i>
                    </TextInputGroup>
                        <div className="tw-col-span-12 tw-mb-3">
                            <InputCheckboxUpdated
                                name="transportAccept"
                                inputClassName="border-primary"
                                labelName="I agree to proceed further irrespective of transport facility."
                                formgroupClassName="form-check-green tw-mb-1 tw-mt-2"
                                value={Boolean(facilityForm.values.transportAccept)}
                                onChange={onAcceptTransportHandler}
                                invalid={(facilityForm.touched.transportAccept && facilityForm.errors.transportAccept) ? true : false}
                                error={(facilityForm.touched.transportAccept && facilityForm.errors.transportAccept) ? facilityForm.errors.transportAccept : ""}
                            >
                                <p className="m-0">
                                    I want to verify whether transport is available for my locality.{" "}
                                    <a className="text-info" target="_blank"
                                        href={`https://${branchInfo?.websiteUrl}/${branchId?.toString() === "1" ? "transport-facility" : "Transport"}`}
                                    >
                                        Check Here</a>&nbsp;
                                    to find the transport facility.</p>
                            </InputCheckboxUpdated>
                        </div></>}
                </AccordionBody>
            </form>
            <ModalContainerUpdated
                id="map-modal"
                isOpen={locationModalState.showModal}
                toggle={closeLocationModalHndlr}
                modalTitle="Transport Facility"
                modalSize="lg"
            >
                <LocationSelectorModal
                    isOpen={locationModalState.showModal}
                    selectedLocation={locationModalState.modalData}
                    toggle={toggleMapModal}
                />
            </ModalContainerUpdated>
        </>
    )
}