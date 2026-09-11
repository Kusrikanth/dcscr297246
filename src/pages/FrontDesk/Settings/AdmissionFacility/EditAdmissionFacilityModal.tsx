import React, { useEffect, useRef } from 'react';
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from 'formik';
import * as Yup from "yup";
import { SelectInput, TextInput } from '../../../../Components/Common';
import { nanoid } from 'nanoid';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getInstDepartmentAct } from '../../../../store/mastersettings/instituteinfo/instituteinfoactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { editAdmissionFacilitysListAct, getAdmissionFacilitysListByIdAct, saveAdmissionFacilitysListAct } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction';
import { toast } from 'react-toastify';
import Button from '../../../../Components/Common/Button';

interface EditAdmitionFacilityModalProps {
    instituteId: number,
    branchId: number,
    facilityId: number,
    show: boolean;
    onCloseClick: (apiCall?: boolean) => void;
    onSave: (data: any) => void;
    mode: 'add' | 'edit';
}

const validationSchema = Yup.object().shape({
    departmentId: Yup.string().required("Department required."),
    facilities: Yup.array().of(
        Yup.object().shape({
            facilityName: Yup.string().required("Facility name required.")
        })
    ),
});

function getAddEditFacilitySettings(editData?: any) {
    if (editData) {
        return {
            departmentId: editData?.departmentId,
            facilities: [{
                uniqueId: editData?.id,
                facilityName: editData?.facilityName
            }]
        }
    }
    return {
        departmentId: "",
        facilities: [{
            uniqueId: nanoid(),
            facilityName: ""
        }]
    }
}

const initialValues = getAddEditFacilitySettings();
const EditAdmitionFacilityModal: React.FC<EditAdmitionFacilityModalProps> = (props) => {
    const isEditMode = props.mode === "edit";
    const dispatch = useAppDispatch();
    const { saveAdmissionFacilityResp, editAdmissionFacilityResp,
        getAdmissionFacilitysListByIdResp, hrmDepartmentResp, showApiLoader
    } = useAppSelector(({ admissionAvailabilityRequest, masterData, globalData }) => ({
        hrmDepartmentResp: masterData.hrmDepartmentResp,
        saveAdmissionFacilityResp: admissionAvailabilityRequest.saveAdmissionFacilityResp,
        editAdmissionFacilityResp: admissionAvailabilityRequest.editAdmissionFacilityResp,
        getAdmissionFacilitysListByIdResp: admissionAvailabilityRequest.getAdmissionFacilitysListByIdResp,
        showApiLoader: globalData.showApiLoader
    }), shallowEqual);

    const facilitySettingsRespRef = useRef({
        prevSaveResp: saveAdmissionFacilityResp,
        prevEditResp: editAdmissionFacilityResp,
        prevGetAdmissionFacilitysListByIdResp: getAdmissionFacilitysListByIdResp,
    });

    useEffect(() => {
        const { prevSaveResp, prevEditResp, prevGetAdmissionFacilitysListByIdResp } = facilitySettingsRespRef.current;
        if (saveAdmissionFacilityResp && prevSaveResp !== saveAdmissionFacilityResp) {
            toast.success("Facility added successfully!");
            props.onCloseClick(true);
        } else if (getAdmissionFacilitysListByIdResp && prevGetAdmissionFacilitysListByIdResp !== getAdmissionFacilitysListByIdResp) {
            const formData = getAddEditFacilitySettings(getAdmissionFacilitysListByIdResp);
            facilityForm.resetForm({
                values: formData
            })
        }
        else if (editAdmissionFacilityResp && prevEditResp !== editAdmissionFacilityResp) {
            props.onCloseClick(true);
            toast.success("Facility updated successfully!");
        }
        facilitySettingsRespRef.current.prevSaveResp = saveAdmissionFacilityResp;
        facilitySettingsRespRef.current.prevEditResp = editAdmissionFacilityResp;
        facilitySettingsRespRef.current.prevGetAdmissionFacilitysListByIdResp = getAdmissionFacilitysListByIdResp;
    }, [saveAdmissionFacilityResp, editAdmissionFacilityResp, getAdmissionFacilitysListByIdResp]);

    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const facilityForm = useFormik({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (isEditMode) {
                const { facilityName, uniqueId: facilityId } = values.facilities?.[0];
                const payload = { facilityName };
                dispatch(editAdmissionFacilitysListAct(generateActionPayload("edit_admission_facility_by_id", {
                    id: facilityId
                }, payload)));
            } else {
                const payload = {
                    instituteId: props.instituteId,
                    branchId: props.branchId,
                    departmentId: values.departmentId,
                    facilities: values.facilities.map(facility => facility.facilityName),
                };
                dispatch(saveAdmissionFacilitysListAct(generateActionPayload("save_admission_facility", undefined, payload)));

            }
        }
    });

    useEffect(() => {
        if (props.facilityId) {
            dispatch(getAdmissionFacilitysListByIdAct(generateActionPayload("get_admission_facility_by_id", { id: props.facilityId })));
        }
    }, [props.facilityId]);

    function addNewFacilityHandler() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: nanoid(), facilityName: "" });
        }
    }

    function removeFacilityHandler(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }


    return (
        <form onSubmit={facilityForm.handleSubmit}>
            <div className='modal-body'>
                <SelectInput
                    name="departmentId"
                    labelText="Department Name"
                    labelClass="required"
                    value={facilityForm.values.departmentId}
                    onChange={facilityForm.handleChange}
                    invalid={(facilityForm.touched.departmentId && facilityForm.errors.departmentId) ? true : false}
                    error={(facilityForm.touched.departmentId && facilityForm.errors.departmentId) ? facilityForm.errors.departmentId : ""}
                    menuItems={hrmDepartmentResp}
                    textKey='departmentName'
                    valueKey='hrmDeptId'
                    isDisabled={isEditMode}
                />
                <h6 className="form-label required tw-mb-2">Facilities</h6>
                <div>
                    <FormikProvider value={facilityForm}>
                        <FieldArray name="facilities">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                return (
                                    <>
                                        {facilityForm.values.facilities.length > 0 &&
                                            facilityForm.values.facilities.map((term, index) => {
                                                const inputFieldErrors: any = facilityForm.errors.facilities && facilityForm?.errors?.facilities[index] || {};
                                                const inputFieldTouched: any = facilityForm.touched.facilities && facilityForm?.touched?.facilities[index] || {};
                                                return (
                                                    <div key={term.uniqueId} className='tw-flex tw-mb-4'>
                                                        <TextInput
                                                            name={`facilities.${index}.facilityName`}
                                                            data-index={index}
                                                            value={term.facilityName}
                                                            formgroupClassName="mb-0 me-4 tw-w-[85%]"
                                                            onChange={facilityForm.handleChange}
                                                            invalid={(inputFieldTouched.facilityName && inputFieldErrors.facilityName) ? true : false}
                                                            error={(inputFieldTouched.facilityName && inputFieldErrors.facilityName) ? inputFieldErrors.facilityName : ""}
                                                        />
                                                        {(index !== 0) && <button data-index={index} onClick={removeFacilityHandler} className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white tw-mt-1 tw-shrink-0">
                                                            <i className="ri-delete-bin-2-fill" />
                                                        </button>}
                                                    </div>
                                                )
                                            })}
                                    </>
                                )
                            }}
                        </FieldArray>
                    </FormikProvider>
                    {!isEditMode && <Button onClick={addNewFacilityHandler}
                        type="button" variant="primary">
                        Add New
                    </Button>}
                </div>
            </div>
            <div className='modal-footer tw-gap-3'>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => props.onCloseClick()}
                    disabled={showApiLoader}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={showApiLoader}
                >
                    {isEditMode ? 'Update' : 'Save'}
                </Button>
            </div>
        </form>
    );
};

export default EditAdmitionFacilityModal;