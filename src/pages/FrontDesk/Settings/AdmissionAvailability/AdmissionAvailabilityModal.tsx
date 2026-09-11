
import { useEffect, useMemo, useState } from "react";
import {
    SelectInput,
} from "../../../../Components/Common";
import { useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import TableContainer from "../../../../Components/Common/TableContainer";
import * as Yup from 'yup';
import { generateColumnsAddNewAdmissionAvailability } from "./helper";
import { addAdmissionAvailability, admissionAvailabilityClassListAct, editAdmissionAvailability, getAdmissionAvailablityByIdAct, setAdmissionAvailablityClassListAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
};

const AdmissionAvailabilityModal = (props: any) => {
    const dispatch = useAppDispatch();
    const [admissionAvailabilityClassList, setAdmissionAvailabilityClassList] = useState<any[]>([]);

    const validationSchema = Yup.object().shape({
        academicYearId: Yup.string().required("Academic Year is required."),
        curriculumId: Yup.string().required("Curriculum is required."),
    });
    const AdmissionAvailabilityForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {

            if (props.modalId && admissionAvailabilityClassList.length > 0) {

                const { availabilityStatus, ageLimit, months, desiredStrength } = admissionAvailabilityClassList[0] || {}

                const params = {
                    id: props.modalId,
                }
                const payload = {
                    availabilityStatus, ageLimit, months, desiredStrength,
                }

                dispatch(editAdmissionAvailability(generateActionPayload('edit_admission_availability_class', params, payload)));
            } else {
                const classData = admissionAvailabilityClassList && admissionAvailabilityClassList.filter((cls: any) => cls.availabilityStatus).map((cls: any) => ({
                    classId: cls.id,
                    availabilityStatus: cls.availabilityStatus,
                    desiredStrength: cls.desiredStrength || 0,
                    months: cls.months,
                    ageLimit: cls.ageLimit,
                }))

                const payload = {
                    academicYearId: values.academicYearId,
                    curriculumId: values.curriculumId,
                    branchId,
                    classData: classData
                }

                dispatch(addAdmissionAvailability(generateActionPayload('save_admission_availability', undefined, payload)));
            }

        },
    });
    const valueChangeHandler = (id: any, value: any, name: string) => {
        const updated = admissionAvailabilityClassList.map((cls: any) => +cls.id === +id ? ({ ...cls, [name]: value }) : cls)
        setAdmissionAvailabilityClassList(updated);
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: AdmissionAvailabilityForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        admissionAvailabilityClassListResp,
        getadmissionAvailabilityByIdResp,
        showApiLoader,
    } = useAppSelector(
        ({ instAcademics, branchAcademics, appData, admissionAvailabilityRequest, globalData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            admissionAvailabilityClassListResp: admissionAvailabilityRequest.admissionAvailabilityClassListResp,
            getadmissionAvailabilityByIdResp: admissionAvailabilityRequest.getadmissionAvailabilityByIdResp,
            showApiLoader: globalData.showApiLoader,

        }),
        shallowEqual
    );

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        
        if (name === "curriculumId") {
            const payload = { branchId, curriculumId: value, academicYearId: AdmissionAvailabilityForm.values?.academicYearId };
            dispatch(admissionAvailabilityClassListAct(generateActionPayload("admission_availability_class_list", undefined, payload)));
            AdmissionAvailabilityForm.setValues((prev) => ({ ...prev, [name]: value }))
        } else if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value })
            setAdmissionAvailabilityClassList([])
            AdmissionAvailabilityForm.setValues((prev) => ({ ...prev, [name]: value,curriculumId:"" }))
        }
    }

    useEffect(() => {
        admissionAvailabilityClassListResp && setAdmissionAvailabilityClassList(admissionAvailabilityClassListResp)
    }, [admissionAvailabilityClassListResp])

    useEffect(() => {
        if (academicYearListResp && !props.modalId) {
            let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year?.isAdmissionDefault)?.academicYearId;
            AdmissionAvailabilityForm.setValues((prev: any) => ({ ...prev, "academicYearId": yearId }))
            getCurriculumApiCall({ academicYearId: yearId })
        }
        else if (props.modalId) {
            dispatch(getAdmissionAvailablityByIdAct(generateActionPayload('get_admission_availability_by_id', { id: props.modalId })))
        }

        return () => {
            dispatch(setAdmissionAvailablityClassListAct(undefined))
        }
    }, [])

    const EditAdmissionAvailability = (getadmissionAvailabilityByIdResp: any) => {
        if (getadmissionAvailabilityByIdResp) {

            const { availabilityStatus, className, id, academicYearId, curriculumId, ageLimit, months, desiredStrength } = getadmissionAvailabilityByIdResp
            setAdmissionAvailabilityClassList([{
                id, availabilityStatus, className, ageLimit, months, desiredStrength
            }])
            AdmissionAvailabilityForm.setValues({ academicYearId: academicYearId, curriculumId: curriculumId })
        }
    }

    useEffect(() => {
        if (getadmissionAvailabilityByIdResp && props.modalId) {
            EditAdmissionAvailability(getadmissionAvailabilityByIdResp)
        }
    }, [getadmissionAvailabilityByIdResp])

    const roleColumns = useMemo(() => generateColumnsAddNewAdmissionAvailability(), [admissionAvailabilityClassList]);

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};

    return (

        <div>
            {/* Filters */}
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4 tw-p-3">

                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                    <SelectInput
                        name="academicYearId"
                        value={AdmissionAvailabilityForm.values.academicYearId}
                        onChange={filterHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        invalid={
                            AdmissionAvailabilityForm.touched.academicYearId &&
                                AdmissionAvailabilityForm.errors.academicYearId
                                ? true
                                : false
                        }
                        error={
                            AdmissionAvailabilityForm.touched.academicYearId &&
                                AdmissionAvailabilityForm.errors.academicYearId
                                ? AdmissionAvailabilityForm.errors.academicYearId
                                : ""
                        }
                        formgroupClassName="tw-mb-0"
                        isDisabled={props.modalId && true}
                        labelText="Academic Year"
                        floatingLabel
                    />
                </div>

                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                    <SelectInput
                        name="curriculumId"
                        value={AdmissionAvailabilityForm.values.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        invalid={
                            AdmissionAvailabilityForm.touched.curriculumId &&
                                AdmissionAvailabilityForm.errors.curriculumId
                                ? true
                                : false
                        }
                        error={
                            AdmissionAvailabilityForm.touched.curriculumId &&
                                AdmissionAvailabilityForm.errors.curriculumId
                                ? AdmissionAvailabilityForm.errors.curriculumId
                                : ""
                        }
                        isDisabled={props.modalId && true}
                        formgroupClassName="tw-mb-0"
                        labelText="Curriculum"
                        floatingLabel
                    />
                </div>

            </div>

            {/* Table */}
            <div className="tw-grid tw-grid-cols-1 tw-gap-4">
                <TableContainer
                    columns={roleColumns || []}
                    data={admissionAvailabilityClassList || []}
                    divClass="tw-overflow-x-auto tw-mb-3"
                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                    onChangeInputHndlr={valueChangeHandler}
                />
            </div>

            {/* Footer Buttons */}
            <div className="tw-flex tw-justify-end tw-gap-2 tw-pb-3 tw-pr-3">

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        props.toggle();
                        AdmissionAvailabilityForm.resetForm();
                        setAdmissionAvailabilityClassList([]);
                    }}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => AdmissionAvailabilityForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    Submit
                </Button>

            </div>
        </div>


    );
};

export default AdmissionAvailabilityModal;
