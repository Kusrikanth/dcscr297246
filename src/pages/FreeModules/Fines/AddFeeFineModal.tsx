import React, { useEffect, useState, useRef, useMemo } from "react";
import { shallowEqual } from "react-redux";
import {
    SelectInput, TextInput, RadioInputContainer,
    TextIconInput, TextInputGroup,
    DateInput
} from "../../../Components/Common";
import { Col, Row } from "reactstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
// Formik validation
import * as Yup from "yup";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getFeeParticularsAct, addFeeFineAct, updateFeeFineAct,
} from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { getFeeTypesAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
//Helper
import {
    getGracePeriodItems,
    fineModuleOptions, fineCalculationOptions, feeTypes,
    admissionTypeOptions
} from "./helper";
//Utility
import { getAmountValueWithDecimal } from "../../../utility/commonutility";


import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { setFeeNameByTypeAct } from "../../../store/fee/feereport/feereportslice";
import { getFeeNameByTypeAct } from "../../../store/fee/feereport/feereportactions";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import Button from "../../../Components/Common/Button";

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "string") {
        return fieldValue === "YES";
    }
    return false;
}


function getAddEditFeeName(editData?: any) {
    return {
        academicYearId: editData?.academicYearId || "",
        feeType: editData?.feeType || "",
        feeName: editData?.feeName || "",
        // gracePeriod: editData?.gracePeriod || "",
        dueDate: editData?.dueDate || "",
        admissionTypesForFines: editData?.admissionTypesForFines || "",
        finePerDay: getAmountValueWithDecimal(editData?.finePerDay),
    }
}

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic year required."),
    feeType: Yup.string().required("Fee type required."),
    feeName: Yup.string().required("Fine name required."),
    admissionTypesForFines: Yup.string().required("Type required."),
    // gracePeriod: Yup.number().typeError("Enter a valid number").required("Grace period required."),

    finePerDay: Yup.string().test("finePerDayValidation", "Fine amount should be greater than zero.",
        (value: any, schema: any) => {
            if (!Number(value)) {
                return false;
            }
            return true;
        }),
});

const initialState = getAddEditFeeName();
const AddFeeFineModal: React.FC<any> = (props) => {
    const dispatch = useAppDispatch();
    const isEditMode = !!props.feeFineId;

    const { academicYearListResp, feeNameByTypeResp,
        addFeeFineResp, showApiLoader, updateFeeFineResp } = useAppSelector(({ instAcademics, globalData, feeReport, masterFeeSettings }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            feeNameByTypeResp: feeReport.feeNameByTypeResp,
            addFeeFineResp: masterFeeSettings.addFeeFineResp,
            updateFeeFineResp: masterFeeSettings.updateFeeFineResp,
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    const feeFineModalRef = useRef({
        prevAddFeeFineResp: addFeeFineResp,
        prevUpdateFeeFineResp: updateFeeFineResp
    });

    useEffect(() => {
        const { prevAddFeeFineResp, prevUpdateFeeFineResp } = feeFineModalRef.current;
        if (addFeeFineResp && prevAddFeeFineResp !== addFeeFineResp) {
            props.toggle(true);
            toast.success("Fee fine added successfully.");
        } else if (updateFeeFineResp && prevUpdateFeeFineResp !== updateFeeFineResp) {
            props.toggle(true);
            toast.success("Fee fine updated successfully.");
        }
        feeFineModalRef.current.prevAddFeeFineResp = addFeeFineResp;
        feeFineModalRef.current.prevUpdateFeeFineResp = updateFeeFineResp;
    }, [addFeeFineResp, updateFeeFineResp]);

    useEffect(() => {
        if (isEditMode) return;
        if (academicYearListResp) {
            let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId;
            feeFineModalForm.setFieldValue("academicYearId", yearId || '');
        }
    }, [isEditMode, academicYearListResp]);

    useEffect(() => {
        if (props.editFeeFineDetails && academicYearListResp) {
            const feeFineData = getAddEditFeeName(props.editFeeFineDetails);
            const { feeType, academicYearId } = props.editFeeFineDetails;
            getFeenameApiCall(feeType, academicYearId);
            feeFineModalForm.resetForm({
                values: feeFineData
            })
        }
    }, [props.editFeeFineDetails, academicYearListResp]);

    const feeFineModalForm = useFormik({
        initialValues: initialState,
        validationSchema,
        onSubmit: (values) => {
            const payload: any = { ...values };
            delete payload.academicYearId;
            if (props.feeFineId) {
                const params = { feeFineId: props.feeFineId };
                dispatch(updateFeeFineAct(generateActionPayload("update_fee_fine", params, payload)));
            } else {
                const payload = { ...values },
                    params = {
                        instituteId: props.instituteId,
                        branchId: props.branchId,
                        academicYearId: values.academicYearId
                    }
                dispatch(addFeeFineAct(generateActionPayload("add_fee_fine", params, payload)));
            }
        },
    });

    function onBlurAmountHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeFineModalForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: getAmountValueWithDecimal(value),
        }));
        feeFineModalForm.handleBlur(event);
    }
    function getFeenameApiCall(feeType: string, academicYearId: string) {
        dispatch(getFeeNameByTypeAct(generateActionPayload("get_feename_byfeetype", undefined, {
            branchId: props.branchId,
            feeType, academicYearId
        })));
    }

    function onChangeFeeTypeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeFineModalForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value,
            feeName: ''
        }));
        dispatch(setFeeNameByTypeAct(undefined));
        if (value && feeFineModalForm.values.academicYearId) {
            getFeenameApiCall(value, feeFineModalForm.values.academicYearId);
        }
    }

    function onChangeAcademicYearHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeFineModalForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value,
            feeName: ''
        }));
        dispatch(setFeeNameByTypeAct(undefined));
        if (value && feeFineModalForm.values.feeType) {
            getFeenameApiCall(feeFineModalForm.values.feeType, value);
        }
    }

    const feeNameOptions = useMemo(() => {
        if (Array.isArray(feeNameByTypeResp)) {
            return feeNameByTypeResp.map(item => ({ name: item }));
        }
        return [];
    }, [feeNameByTypeResp]);


    return (
        <form onSubmit={feeFineModalForm.handleSubmit}>
            <div className="tw-pb-0 tw-p-4">
                <div className="tw-flex tw-flex-col">

                    <div className="tw-grid tw-grid-cols-12 tw-gap-x-3">

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="academicYearId"
                                labelText="Academic Year"
                                labelClass={isEditMode ? "" : "required"}
                                value={feeFineModalForm.values.academicYearId}
                                onChange={onChangeAcademicYearHndlr}
                                menuItems={academicYearListResp?.data}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                isDisabled={isEditMode}
                                invalid={(feeFineModalForm.touched.academicYearId && feeFineModalForm.errors.academicYearId) ? true : false}
                                error={(feeFineModalForm.touched.academicYearId && feeFineModalForm.errors.academicYearId) ? feeFineModalForm.errors.academicYearId : ""}
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="feeType"
                                labelClass="required"
                                value={feeFineModalForm.values.feeType}
                                onChange={onChangeFeeTypeHndlr}
                                menuItems={feeTypes}
                                valueKey="id"
                                textKey="name"
                                labelText="Fee Type"
                                invalid={(feeFineModalForm.touched.feeType && feeFineModalForm.errors.feeType) ? true : false}
                                error={(feeFineModalForm.touched.feeType && feeFineModalForm.errors.feeType) ? feeFineModalForm.errors.feeType : ""}

                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="feeName"
                                labelClass="required"
                                value={feeFineModalForm.values.feeName}
                                onChange={feeFineModalForm.handleChange}
                                menuItems={feeNameOptions}
                                valueKey="name"
                                textKey="name"
                                labelText="Fee Name"
                                invalid={(feeFineModalForm.touched.feeName && feeFineModalForm.errors.feeName) ? true : false}
                                error={(feeFineModalForm.touched.feeName && feeFineModalForm.errors.feeName) ? feeFineModalForm.errors.feeName : ""}
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <DateInput
                                name="dueDate"
                                value={feeFineModalForm.values?.dueDate}
                                onChange={feeFineModalForm.handleChange}
                                labelText="Due Date"
                            />
                        </div>

                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInputGroup
                                labelText="Fine Amount"
                                name="finePerDay"
                                allowedInputRegex="^[0-9]+\.?[0-9]*$"
                                inputGroupStart={true}
                                value={feeFineModalForm.values.finePerDay}
                                onChange={feeFineModalForm.handleChange}
                                onBlur={onBlurAmountHndlr}
                                labelClass="required"
                                invalid={(feeFineModalForm.touched.finePerDay && feeFineModalForm.errors.finePerDay) ? true : false}
                                error={(feeFineModalForm.touched.finePerDay && feeFineModalForm.errors.finePerDay) ? feeFineModalForm.errors.finePerDay : ""}
                            >
                                <RupeeSvg width="11px" height="11px" fill="#495057" />
                            </TextInputGroup>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="admissionTypesForFines"
                                labelClass="required"
                                value={feeFineModalForm.values.admissionTypesForFines}
                                onChange={feeFineModalForm.handleChange}
                                menuItems={admissionTypeOptions}
                                valueKey="id"
                                textKey="name"
                                labelText="Admission Type"
                                invalid={(feeFineModalForm.touched.admissionTypesForFines && feeFineModalForm.errors.admissionTypesForFines) ? true : false}
                                error={(feeFineModalForm.touched.admissionTypesForFines && feeFineModalForm.errors.admissionTypesForFines) ? feeFineModalForm.errors.admissionTypesForFines : ""}
                            />
                        </div>

                    </div>
                </div>
            </div>

            <div className="tw-border-t tw-shadow-inner">
                <div className="tw-flex tw-gap-2 tw-justify-end tw-p-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AddFeeFineModal;
