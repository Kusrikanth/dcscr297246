import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { SelectInput, TextInput, TextInputWithRegex } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { MultiplicationSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { displayTypes, moduleTypes, result } from "./helper";
import { editPercentageSlabsListAct, savePercentageSlabsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { FormGroup, Input,Label } from "reactstrap";

const intialValues = (modalData?: any) => {
    return {
        departments: modalData ? modalData.departments ? modalData.departments : [{
            result: modalData.result,
            moduleType: modalData.moduleType,
            slabColor: modalData.slabColor,
            labelDisplayType: modalData.labelDisplayType,
            displayName: modalData.displayName,
            toPercentage: modalData.toPercentage,
            fromPercentage: modalData.fromPercentage,
        }] : [{
            uniqueId: generateUniqueNumber(),
            fromPercentage: "",
            toPercentage: "",
            displayName: "",
            moduleType: "",
            slabColor: "",
            labelDisplayType: "",
            result: "",
        }],
    }
}

const validationSchema = Yup.object().shape({
    departments: Yup.array().of(
        Yup.object().shape({
            moduleType: Yup.string().required("Module Type is required.").nullable(),
            labelDisplayType: Yup.string().required("Label Display Type is required.").nullable(),
            displayName: Yup.string().required("Display Name is required.").nullable(),
            toPercentage: Yup.string().required("To Percentage is required.").nullable(),
            fromPercentage: Yup.string().required("From Percentage is required.").nullable(),
        })
    )
});

const AddClassModal: React.FC<any> = (props) => {

    const [departmentListState, setDepartmentListState] = useState<any>(intialValues());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const dispatch = useAppDispatch();
    const { showApiLoader, currentInstIdResp: instituteId, currentBranchIdResp: branchId, getPercentageSlabsListResp } = useAppSelector(({ globalData, appData, examinationSettings }) => ({
        showApiLoader: globalData.showApiLoader,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        getPercentageSlabsListResp: examinationSettings.getPercentageSlabsListResp,

    }), shallowEqual);

    const addDepartmentForm: any = useFormik({
        enableReinitialize: true,
        initialValues: departmentListState,
        validationSchema,
        onSubmit: (values: any) => {
            if (!props?.id) {
                const payload = {

                    percentageSlabDto: values?.departments?.map((item: any) => ({
                        instituteId,
                        academicYearId: props?.modalData?.academicYearId,
                        fromPercentage: item?.fromPercentage,
                        toPercentage: item?.toPercentage,
                        displayName: item?.displayName,
                        labelDisplayType: item.labelDisplayType,
                        moduleType: item?.moduleType,
                        slabColor: item?.slabColor,
                        result: item.result,
                    }))
                };
                dispatch(savePercentageSlabsListAct(generateActionPayload("save_percentage_slabs_list", undefined, payload)));
            } else {
                const payload = {
                    id: props?.id,
                    instituteId,
                    academicYearId: props?.modalData?.academicYearId,
                    fromPercentage: values?.departments[0]?.fromPercentage,
                    toPercentage: values?.departments[0]?.toPercentage,
                    displayName: values?.departments[0]?.displayName,
                    labelDisplayType: values?.departments[0]?.labelDisplayType,
                    moduleType: values?.departments[0]?.moduleType,
                    slabColor: values?.departments[0]?.slabColor,
                    result: values?.departments[0]?.result,
                }

                dispatch(
                    editPercentageSlabsListAct(
                        generateActionPayload(
                            "update_percentage_slabs_list",
                            undefined,
                            payload
                        )
                    )
                );
            }

        },
    });

    useEffect(() => {
        if (props.id) {
            const data = getPercentageSlabsListResp?.content?.find((item: any) => +item?.id === +props?.id);
            setDepartmentListState(intialValues({
                departments: [
                    { displayName: data?.displayName, fromPercentage: data?.fromPercentage, toPercentage: data?.toPercentage, labelDisplayType: data?.labelDisplayType, result: data?.result, moduleType: data?.moduleType, slabColor: data?.slabColor }
                ]
            }))
        }
    }, [props.id]);

    function addNewDepartmentHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), displayName: "", fromPercentage: "", toPercentage: "", labelDisplayType: "", result: "", moduleType: "", slabColor: "" });
        }
    }

    function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    return (

        <div className="container-fluid">
            <FormikProvider value={addDepartmentForm}>
                <div className='d-inline-block w-100 py-4 px-2'>
                    <FieldArray name="departments">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }
                            return (
                                <>
                                    {addDepartmentForm.values.departments &&
                                        addDepartmentForm.values.departments.map((department: any, index: number) => {
                                            const inputFieldErrors: any = addDepartmentForm.errors.departments && addDepartmentForm.errors.departments[index] || {};
                                            const inputFieldTouched: any = addDepartmentForm.touched.departments && addDepartmentForm.touched.departments[index] || {};

                                            const getFilteredDisplayTypes = (moduleType?: string) => {
                                                if (!moduleType) {
                                                    return []; 
                                                }

                                                if (moduleType === "REPORT") {
                                                    return displayTypes.filter(
                                                    (item) => item.value === "PERCENTAGE_RANGE"
                                                    );
                                                }

                                                return displayTypes.filter(
                                                    (item) => item.value !== "PERCENTAGE_RANGE"
                                                );
                                            };


                                            return (
                                                <>
                                                    <div className="row" style={{ position: "relative" }}>
                                                        <div style={{ paddingRight: `${index !== 0 && "0.7rem"}` }} className={"col-12"}>
                                                            <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "10px" }}>
                                                                <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Percentage Slab</p>
                                                                <div className='d-inline-block w-100' key={`${index}-${department.uniqueId}`}>
                                                                    <div className="row w-100 mb-3 mx-0 gy-4">
                                                                        <div className='col-4'>
                                                                            <TextInput
                                                                                name={`departments[${index}].displayName`}
                                                                                value={department.displayName}
                                                                                onChange={addDepartmentForm.handleChange}
                                                                                invalid={inputFieldTouched.displayName && inputFieldErrors.displayName ? true : false}
                                                                                error={inputFieldTouched.displayName && inputFieldErrors.displayName ? inputFieldErrors.displayName : ""}
                                                                                formgroupClassName="mb-0"
                                                                                labelText="Display Name"
                                                                                labelClass="required"

                                                                            />
                                                                        </div>
                                                                        <div className='col-4'>
                                                                            <SelectInput
                                                                                name={`departments[${index}].moduleType`}
                                                                                value={department.moduleType}
                                                                                onChange={addDepartmentForm.handleChange}
                                                                                menuItems={moduleTypes}
                                                                                valueKey="value"
                                                                                textKey="label"
                                                                                invalid={inputFieldTouched.moduleType && inputFieldErrors.moduleType ? true : false}
                                                                                error={inputFieldTouched.moduleType && inputFieldErrors.moduleType ? inputFieldErrors.moduleType : ""}
                                                                                formgroupClassName="mb-0"
                                                                                labelText="Module Type"
                                                                                labelClass="required"

                                                                            />
                                                                        </div>
                                                                        <div className='col-4'>
                                                                            <SelectInput
                                                                                name={`departments[${index}].labelDisplayType`}
                                                                                value={department.labelDisplayType}
                                                                                onChange={addDepartmentForm.handleChange}
                                                                                menuItems={getFilteredDisplayTypes(department.moduleType)}
                                                                                valueKey="value"
                                                                                textKey="label"
                                                                                invalid={inputFieldTouched.labelDisplayType && inputFieldErrors.labelDisplayType ? true : false}
                                                                                error={inputFieldTouched.labelDisplayType && inputFieldErrors.labelDisplayType ? inputFieldErrors.labelDisplayType : ""}
                                                                                formgroupClassName="mb-0"
                                                                                labelText="Label Display Type"
                                                                                labelClass="required"

                                                                            />
                                                                        </div>
                                                                        <div className='col-4'>
                                                                            <SelectInput
                                                                                name={`departments[${index}].result`}
                                                                                value={department.result}
                                                                                onChange={addDepartmentForm.handleChange}
                                                                                menuItems={result}
                                                                                valueKey="value"
                                                                                textKey="label"
                                                                                invalid={inputFieldTouched.result && inputFieldErrors.result ? true : false}
                                                                                error={inputFieldTouched.result && inputFieldErrors.result ? inputFieldErrors.result : ""}
                                                                                formgroupClassName="mb-0"
                                                                                labelText="Result"

                                                                            />
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <TextInputWithRegex
                                                                                name={`departments[${index}].fromPercentage`}
                                                                                value={department.fromPercentage}
                                                                                onChange={addDepartmentForm.handleChange}
                                                                                formgroupClassName="mb-0"
                                                                                invalid={inputFieldTouched.fromPercentage && inputFieldErrors.fromPercentage ? true : false}
                                                                                error={inputFieldTouched.fromPercentage && inputFieldErrors.fromPercentage ? inputFieldErrors.fromPercentage : ""}
                                                                                allowedInputRegex="^\d{0,3}(\.\d{0,2})?$"
                                                                                labelText="From Percentage"
                                                                                labelClass="required"
                                                                            />
                                                                        </div>
                                                                        <div className='col-4'>
                                                                            <TextInputWithRegex
                                                                                name={`departments[${index}].toPercentage`}
                                                                                value={department.toPercentage}
                                                                                onChange={addDepartmentForm.handleChange}
                                                                                formgroupClassName="mb-0"
                                                                                invalid={inputFieldTouched.toPercentage && inputFieldErrors.toPercentage ? true : false}
                                                                                error={inputFieldTouched.toPercentage && inputFieldErrors.toPercentage ? inputFieldErrors.toPercentage : ""}
                                                                                labelText="To Percentage"
                                                                                labelClass="required"
                                                                                allowedInputRegex="^\d{0,3}(\.\d{0,2})?$"
                                                                            />
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <FormGroup>
                                                                                <Label htmlFor={`departments[${index}].slabColor`}>Slab Color</Label>
                                                                                <Input
                                                                                  name={`departments[${index}].slabColor`}
                                                                                  type="color"
                                                                                  className="form-control form-control-color w-100"
                                                                                  id={`departments[${index}].slabColor`}
                                                                                  value={department.slabColor || "#364574"} 
                                                                                  onChange={addDepartmentForm.handleChange} 
                                                                                />
                                                                            </FormGroup>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ position: "absolute", top: "5%", right: "0", transform: "translateY(-50%)", display: "flex", justifyContent: "end", padding: "0" }}>
                                                            {
                                                                (index !== 0) && (
                                                                    <button data-index={index} onClick={removeDepartmentHndlr} className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white">
                                                                        <HugeiconsIcon icon={MultiplicationSignIcon} className="text-danger" size={18} />
                                                                    </button>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                </>
                            )
                        }}
                    </FieldArray >
                    {!props.id && <div className="row mt-2">
                        <div className="col-12">
                            <button onClick={addNewDepartmentHndlr} type="button" className="btn btn-outline-primary btn-sm">
                                Add New
                            </button>
                        </div>
                    </div>}
                </div>
                <div className="hstack gap-2 justify-content-end mb-4 me-2">

                    <button
                        type="button"
                        className={"btn btn-light"}
                        onClick={props.toggle}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className={`btn btn-success
                `}
                        onClick={(event: any) => addDepartmentForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        {props.id ? "Update" : "Submit"}
                    </button>

                </div>
            </FormikProvider >
        </div >

    )
}

export default React.memo(AddClassModal);
