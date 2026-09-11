import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { RadioInput, RadioInputContainer, SelectInput, TextInput, TextInputWithRegex } from "../../../../Components/Common";
import { UpdatedRadioInput } from "../../../../Components/Common/UpdatedRadioInput";
import { useAppSelector } from "../../../../hooks/storehook";
import { getBranchClassAct, getBranchCurriculumAct, getBrchSectionsAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { updateStudentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getSalaryCategoryAct, getTaxCategoryAct } from "../../../../store/masterdata/masterdataactions";
import { getAcademicLanguagesDataAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { EligibilityStatus } from "../helper";
import { IPropsTypes, IUpdateEmployeeRepRef } from "./EmployeeInfoTypes";
import * as Yup from 'yup';
import { default as EditSvg } from "../../../../assets/imagesdps/directory/EditSvgIcon.svg?react";
import { amountType, CampusTypeOptions, details, formSectionSaveKey } from "./helper";
import { AccordionBody, AccordionHeader } from "reactstrap";
import Button from "../../../../Components/Common/Button";


export default function SalaryDetails({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) {
    const dispatch = useDispatch()
    const initialValues = (data?: any) => {
        return {
            sId: data?.id || "",
            taxCategoryTypeId: data?.taxCategoryTypeId || "",
            amountType: data?.amountType || "",
            salaryCategoryId: data?.salaryCategoryId || "",
            basicSalary: data?.basicSalary || "",
            grossSalary: data?.grossSalary || "",
            panCardNo: data?.panCardNo || "",
            isPfEligible: data ? data.isPfEligible ? "true" : "false" : "false",
            pfAccountNo: data?.pfAccountNo || "",
            uanNo: data?.uanNo || "",
            isEsiEligible: data ? data.isEsiEligible ? "true" : "false" : "false",
            esiAccountNo: data?.esiAccountNo || "",
            netTaxBenefitsPa: data?.netTaxBenefitsPa || "",
            remarks: data?.remarks || "",
        }
    }
    const [edit, setEdit] = useState(false);
    const [sectionList, setSectionList] = useState([]);
    const [initialData, setInitialData] = useState(initialValues());

    const salaryDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validateOnBlur: true,
        onSubmit: (values) => {
            let formData = new FormData();
            const data = details(getEmployeeByIdResp, values, "Employee Salary Details", { branchId: branchId, instituteId: instituteId }, formSectionSaveKey.salaryDetails);
            formData.append("employeeRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Employee Salary Details"
            })));
        },
    });
    const EditHandler = (event: any) => {
        setEdit(true);
    }
    const { getEmployeeByIdResp, updateStudentResp, affectedSection, academicLanguages, brchCurriculumResp, branchClassResp, brchSectionsResp, taxCategoryListResp, salaryCategoryListResp } = useAppSelector(
        ({ directoryEmployee, directoryStudent, instituteInfo, branchAcademics, masterData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            academicLanguages: instituteInfo.academicLanguages,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            taxCategoryListResp: masterData.taxCategoryListResp,
            salaryCategoryListResp: masterData.salaryCategoryListResp,
        }),
        shallowEqual
    );

    const EmployeeSalaryRef = useRef<IUpdateEmployeeRepRef>({
        prevUpdateEmployeeRep: updateStudentResp
    });
    const getEmployeeDetailsAPI = () => {
        dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
    }
    const UpdateHandler = () => {
        getEmployeeDetailsAPI();
        setEdit(false);
    }

    const CancelHandler = () => {
        salaryDetailsForm.setValues(initialValues(getEmployeeByIdResp.employeeSalaryDetails)).then(() => {
            salaryDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    useEffect(() => {
        const { prevUpdateEmployeeRep } =
            EmployeeSalaryRef.current;

        if (updateStudentResp &&
            prevUpdateEmployeeRep !== updateStudentResp) {
            if (affectedSection === "Employee Salary Details") {
                toast.success("Employee Salary Details Updated successfully.");
                UpdateHandler();
            }
        }
        EmployeeSalaryRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [affectedSection, updateStudentResp]);

    useEffect(() => {
        dispatch(getTaxCategoryAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "TAX-CATEGORY", searchString: "", pageNo: 0, pageSize: 100, sortBy: "taxCategoryType", orderBy: "asc" })));
        dispatch(getSalaryCategoryAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "SALARY-CATEGORY", searchString: "", pageNo: 0, pageSize: 100, orderBy: "asc", sortBy: "salaryCategoryName" })));
    }, [])

    useEffect(() => {

        getEmployeeByIdResp && setInitialData(initialValues(getEmployeeByIdResp.employeeSalaryDetails));

    }, [getEmployeeByIdResp]);

    const { data: TaxCategory } = taxCategoryListResp || {};
    const { data: SalaryCategory } = salaryCategoryListResp || {};


    return (
        <div>
            <AccordionHeader tag="h4" targetId="salary-details">
                Salary Details
            </AccordionHeader>
            <AccordionBody accordionId="salary-details">
                <div id={divId} className="">
                    <div className="card-header tw-items-center tw-hidden">
                        <h4 className="card-title tw-mb-0">Salary Details</h4>
                        {!edit && <div className="tw-ml-auto tw-flex tw-items-center tw-cursor-pointer" onClick={EditHandler}>
                            <EditSvg />
                        </div>}
                    </div>
                    <div className="card-body tw-p-0">
                        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4 tw-mb-2">
                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="taxCategoryTypeId"
                                    labelText="Tax Category"
                                    value={salaryDetailsForm.values.taxCategoryTypeId}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    valueKey="id"
                                    textKey="taxCategoryType"
                                    menuItems={TaxCategory || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none bg-img-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="amountType"
                                    labelText="Amount Type"
                                    value={salaryDetailsForm.values.amountType}
                                    onChange={salaryDetailsForm.handleChange}
                                    valueKey="id"
                                    textKey="name"
                                    menuItems={amountType}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="salaryCategoryId"
                                    labelText="Salary Category"
                                    value={salaryDetailsForm.values.salaryCategoryId}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    valueKey="id"
                                    textKey="salaryCategoryName"
                                    menuItems={SalaryCategory || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none bg-img-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInputWithRegex
                                    name="basicSalary"
                                    labelText="Basic Salary"
                                    value={salaryDetailsForm.values.basicSalary}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    allowedInputRegex="^[0-9]{1,7}(\.[0-9]{1,2})?$"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInputWithRegex
                                    name="grossSalary"
                                    labelText="Gross Salary"
                                    value={salaryDetailsForm.values.grossSalary}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    maxLength={7}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    allowedInputRegex="^[0-9]{1,7}(\.[0-9]{1,2})?$"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInput
                                    name="panCardNo"
                                    labelText="PAN Card No"
                                    value={salaryDetailsForm.values.panCardNo}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    maxLength={10}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                {edit ? <RadioInputContainer
                                    name="isPfEligible"
                                    labelText="PF Status"
                                    inputContainerClassName="tw-mt-2 radio-input-field"
                                    radioOptions={[{ id: "true", name: "Eligible" }, { id: "false", name: "Not Eligible" }]}
                                    value={salaryDetailsForm.values.isPfEligible}
                                    onChange={(event: any) => { salaryDetailsForm.handleChange(event); }}
                                    isDisabled={!edit}
                                    labelClassName="tw-font-semibold tw-text-sm tw-mb-0"
                                    containerClassName="radio-input-container tw-w-full tw-flex tw-items-center"
                                    formgroupClassName="tw-flex tw-items-center input-field"
                                /> : <TextInput
                                    name="isPfEligible"
                                    labelText="PF Status"
                                    value={salaryDetailsForm.values.isPfEligible === "true" ? "Eligible" : "Not Eligible"}
                                    isReadOnly={true}
                                    isDisabled={true}
                                    inputClassName={'!tw-bg-transparent !tw-border-0 !tw-rounded-none'}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />}
                            </div>

                            <div className="tw-col-span-1">
                                <TextInput
                                    name="pfAccountNo"
                                    labelText="PF A/C No"
                                    value={salaryDetailsForm.values.pfAccountNo}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    isDisabled={salaryDetailsForm.values.isPfEligible === "false"}
                                    inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-none !tw-bg-transparent' : `${salaryDetailsForm.values.isPfEligible === "false" ? 'tw-bg-gray-100' : '!tw-bg-transparent'}`}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInput
                                    name="uanNo"
                                    labelText="UAN No"
                                    value={salaryDetailsForm.values.uanNo}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    isDisabled={salaryDetailsForm.values.isPfEligible === "false"}
                                    inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-none !tw-bg-transparent' : `${salaryDetailsForm.values.isPfEligible === "false" ? 'tw-bg-gray-100' : '!tw-bg-transparent'}`}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                {edit ? <RadioInputContainer
                                    name="isEsiEligible"
                                    labelText="ESI Status"
                                    inputContainerClassName="tw-mt-2 radio-input-field"
                                    radioOptions={[{ id: "true", name: "Eligible" }, { id: "false", name: "Not Eligible" }]}
                                    value={salaryDetailsForm.values.isEsiEligible}
                                    onChange={salaryDetailsForm.handleChange}
                                    isDisabled={!edit}
                                    labelClassName="tw-font-semibold tw-text-sm tw-mb-0"
                                    containerClassName="radio-input-container tw-w-full tw-flex tw-items-center"
                                    formgroupClassName="tw-flex tw-items-center input-field"
                                /> : <TextInput
                                    name="isEsiEligible"
                                    labelText="ESI Status"
                                    value={salaryDetailsForm.values.isEsiEligible === "true" ? "Eligible" : "Not Eligible"}
                                    isReadOnly={true}
                                    isDisabled={true}
                                    inputClassName={'!tw-bg-transparent !tw-border-0 !tw-rounded-none'}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />}
                            </div>

                            <div className="tw-col-span-1">
                                <TextInputWithRegex
                                    name="esiAccountNo"
                                    labelText="ESI A/C No"
                                    value={salaryDetailsForm.values.esiAccountNo}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    isDisabled={salaryDetailsForm.values.isEsiEligible === "false"}
                                    isReadOnly={!edit}
                                    inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-none !tw-bg-transparent' : `${salaryDetailsForm.values.isEsiEligible === "false" ? 'tw-bg-gray-100' : '!tw-bg-transparent'}`}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    allowedInputRegex="^[0-9]{1,7}(\.[0-9]{1,2})?$"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInputWithRegex
                                    name="netTaxBenefitsPa"
                                    labelText="Net Tax Benefits (Per Annum)"
                                    value={salaryDetailsForm.values.netTaxBenefitsPa}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    allowedInputRegex="^[0-9]{1,7}(\.[0-9]{1,2})?$"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInput
                                    name="remarks"
                                    labelText="Remarks"
                                    value={salaryDetailsForm.values.remarks}
                                    onChange={salaryDetailsForm.handleChange}
                                    onBlur={salaryDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>
                        </div>

                        {canCreateAndUpdate && <>{!edit && <div className="tw-grid">
                            <div className="tw-ml-auto tw-flex tw-items-center tw-justify-end">
                                <Button variant="hoverInfo" onClick={EditHandler}>
                                    <i className="ri-pencil-line tw-mr-2 tw-text-base"></i>
                                    Edit
                                </Button>
                            </div>
                        </div>}

                        {edit && <div className="tw-grid">
                            <div className="tw-col-auto tw-ml-auto tw-flex tw-pl-4 tw-gap-4">
                                <Button variant="secondary" onClick={CancelHandler}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={(e: any) => salaryDetailsForm.handleSubmit(e)}>
                                    Update
                                </Button>
                            </div>
                        </div>}</>}
                    </div>
                </div>
            </AccordionBody>
        </div>
    )
}