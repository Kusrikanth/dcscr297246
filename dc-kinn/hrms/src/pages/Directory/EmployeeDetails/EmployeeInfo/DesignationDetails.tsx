import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { RadioInput, RadioInputContainer, SelectInput, TextInput } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { getBranchClassAct, getBranchCurriculumAct, getBrchSectionsAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { updateStudentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getDesignationsAct, getEmployeeCategoriesAct, getHODListAct, getReporterListAct } from "../../../../store/masterdata/masterdataactions";
import { getAcademicLanguagesDataAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { BooleanType } from "../helper";
import { IPropsTypes, IUpdateEmployeeRepRef } from "./EmployeeInfoTypes";
import * as Yup from 'yup';
import { CampusTypeOptions, details, formSectionSaveKey } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/directory/EditSvgIcon.svg?react";
import { AccordionBody, AccordionHeader } from "reactstrap";
import Button from "../../../../Components/Common/Button";


export default function DesignationDetails({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) {
    const dispatch = useDispatch()
    const initialValues = (data?: any) => {
        return {
            desId: data?.id || "",
            designationId: data?.designationId || "",
            reportingHeadId: data?.reportingHeadId || "",
            isReportingHead: data?.isReportingHead ? "true" : "false",
            employeeCategoryId: data?.employeeCategoryId || "",
            reportingClassDivision: data?.reportingClassDivision || "",
            isHod: data?.isHod ? "true" : "false",
            hodId: data?.hodId || "",
            isClassCoordinator: data?.isClassCoordinator ? "true" : "false",
        }
    }
    const [edit, setEdit] = useState(false);
    const [sectionList, setSectionList] = useState([]);
    const [initialData, setInitialData] = useState(initialValues());

    const validationSchema = Yup.object().shape({
        designationId: Yup.string().required("Designation is required."),
        isReportingHead: Yup.string().required("Is Reporting Head is required."),
        employeeCategoryId: Yup.string().required("Employee Category is required."),
        isHod: Yup.string().required("isHod is required."),
        isClassCoordinator: Yup.string().required("isClassCoordinator is required."),
    });

    const designationDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            let formData = new FormData();
            const data = details(getEmployeeByIdResp, values, "Employee Designation Details", { branchId: branchId, instituteId: instituteId }, formSectionSaveKey.designationDetails);
            formData.append("employeeRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Employee Designation Details"
            })));
        },
    });
    const EditHandler = (event: any) => {
        setEdit(true);
    }
    const { getEmployeeByIdResp, updateStudentResp, affectedSection, academicLanguages, brchCurriculumResp, branchClassResp, brchSectionsResp, designationListResp, employeeCategoriesResp, hodListResp, reportingHeadResp } = useAppSelector(
        ({ directoryEmployee, directoryStudent, instituteInfo, branchAcademics, masterData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            academicLanguages: instituteInfo.academicLanguages,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            designationListResp: masterData.designationListResp,
            employeeCategoriesResp: masterData.employeeCategoriesResp,
            hodListResp: masterData.hodListResp,
            reportingHeadResp: masterData.reportingHeadResp,

        }),
        shallowEqual
    );

    const EmployeeJobRef = useRef<IUpdateEmployeeRepRef>({
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
        designationDetailsForm.setValues(initialValues(getEmployeeByIdResp.employeeDesignationDetails)).then(() => {
            designationDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    useEffect(() => {
        dispatch(getDesignationsAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "DESIGNATION", searchString: "", pageNo: 0, pageSize: 5000, sortBy: "designationName", orderBy: "asc" })));
        dispatch(getHODListAct(generateActionPayload('get_hod_employee')));
        // dispatch(getEmployeeCategoriesAct(generateActionPayload("get_global_records_by_search_string", { category:"EMPLOYEE-CATEGORY", search_string: "" })));
        dispatch(getEmployeeCategoriesAct(generateActionPayload("get_employee_categories", undefined, { sortBy: "categoryName", orderBy: "asc" })));
        dispatch(getReporterListAct(generateActionPayload("get_reporting_head")));

    }, [])
    useEffect(() => {
        const { prevUpdateEmployeeRep } =
            EmployeeJobRef.current;

        if (updateStudentResp &&
            prevUpdateEmployeeRep !== updateStudentResp) {
            if (affectedSection === "Employee Designation Details") {
                toast.success("Employee Designation Details Updated successfully.");
                UpdateHandler();
            }
        }
        EmployeeJobRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [affectedSection, updateStudentResp]);

    useEffect(() => {

        getEmployeeByIdResp && setInitialData(initialValues(getEmployeeByIdResp.employeeDesignationDetails));

    }, [getEmployeeByIdResp]);


    const { data: DesignationData } = designationListResp || {};


    return (
        <div>
            <AccordionHeader tag="h4" targetId="designation-details">
                Designation Details
            </AccordionHeader>
            <AccordionBody accordionId="designation-details">
                <div id={divId} className="">
                    <div className="card-header tw-items-center tw-hidden">
                        <h4 className="card-title tw-mb-0">Designation Details</h4>
                        {!edit && <div className="tw-ml-auto tw-flex tw-items-center tw-cursor-pointer" onClick={EditHandler}>
                            <EditSvg />
                        </div>}
                    </div>
                    <div className="card-body tw-p-0">
                        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4 tw-mb-2">
                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="designationId"
                                    labelText="Post / Designation"
                                    value={designationDetailsForm.values.designationId}
                                    onChange={designationDetailsForm.handleChange}
                                    onBlur={designationDetailsForm.handleBlur}
                                    valueKey="id"
                                    textKey="designationName"
                                    menuItems={DesignationData || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none bg-img-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={
                                        designationDetailsForm.touched.designationId &&
                                            designationDetailsForm.errors.designationId
                                            ? true
                                            : false
                                    }
                                    error={
                                        designationDetailsForm.touched.designationId &&
                                            designationDetailsForm.errors.designationId
                                            ? designationDetailsForm.errors.designationId
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-col-span-1">
                                {edit ? <RadioInputContainer
                                    name="isReportingHead"
                                    labelText="Is Reporting Head?"
                                    inputContainerClassName="tw-mt-2 radio-input-field"
                                    radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                                    value={designationDetailsForm.values.isReportingHead}
                                    onChange={designationDetailsForm.handleChange}
                                    isDisabled={!edit}
                                    invalid={
                                        designationDetailsForm.touched.isReportingHead &&
                                            designationDetailsForm.errors.isReportingHead
                                            ? true
                                            : false
                                    }
                                    error={
                                        designationDetailsForm.touched.isReportingHead &&
                                            designationDetailsForm.errors.isReportingHead
                                            ? designationDetailsForm.errors.isReportingHead
                                            : ""
                                    }
                                    labelClassName="tw-font-semibold tw-text-sm tw-mb-0"
                                    containerClassName="radio-input-container tw-w-full tw-flex tw-items-center"
                                    formgroupClassName="tw-flex tw-items-center input-field"
                                /> : <TextInput
                                    name="isReportingHead"
                                    labelText="Is Reporting Head?"
                                    value={designationDetailsForm.values.isReportingHead === "true" ? "Yes" : "No"}
                                    isReadOnly={true}
                                    isDisabled={true}
                                    inputClassName={'!tw-bg-transparent !tw-border-0 !tw-rounded-none'}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />}
                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="reportingHeadId"
                                    labelText="Reporting To"
                                    value={designationDetailsForm.values.reportingHeadId}
                                    onChange={designationDetailsForm.handleChange}
                                    onBlur={designationDetailsForm.handleBlur}
                                    valueKey="employeeId"
                                    textKey="employeeName"
                                    menuItems={reportingHeadResp || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none bg-img-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={
                                        designationDetailsForm.touched.reportingHeadId &&
                                            designationDetailsForm.errors.reportingHeadId
                                            ? true
                                            : false
                                    }
                                    error={
                                        designationDetailsForm.touched.reportingHeadId &&
                                            designationDetailsForm.errors.reportingHeadId
                                            ? designationDetailsForm.errors.reportingHeadId
                                            : ""
                                    }
                                />

                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="employeeCategoryId"
                                    labelText="Employee Category"
                                    value={designationDetailsForm.values.employeeCategoryId}
                                    onChange={designationDetailsForm.handleChange}
                                    onBlur={designationDetailsForm.handleBlur}
                                    valueKey="employeeCategoryId"
                                    textKey="categoryName"
                                    menuItems={employeeCategoriesResp || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none bg-img-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={
                                        designationDetailsForm.touched.employeeCategoryId &&
                                            designationDetailsForm.errors.employeeCategoryId
                                            ? true
                                            : false
                                    }
                                    error={
                                        designationDetailsForm.touched.employeeCategoryId &&
                                            designationDetailsForm.errors.employeeCategoryId
                                            ? designationDetailsForm.errors.employeeCategoryId
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-col-span-1">
                                {edit ? <RadioInputContainer
                                    name="isHod"
                                    labelText="Is HOD?"
                                    inputContainerClassName="tw-mt-2 radio-input-field"
                                    radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                                    value={designationDetailsForm.values.isHod}
                                    onChange={designationDetailsForm.handleChange}
                                    isDisabled={!edit}
                                    invalid={
                                        designationDetailsForm.touched.isHod &&
                                            designationDetailsForm.errors.isHod
                                            ? true
                                            : false
                                    }
                                    error={
                                        designationDetailsForm.touched.isHod &&
                                            designationDetailsForm.errors.isHod
                                            ? designationDetailsForm.errors.isHod
                                            : ""
                                    }
                                    labelClassName="tw-font-semibold tw-text-sm tw-mb-0"
                                    containerClassName="radio-input-container tw-w-full tw-flex tw-items-center"
                                    formgroupClassName="tw-flex tw-items-center input-field"
                                /> : <TextInput
                                    name="isHod"
                                    labelText="Is HOD?"
                                    value={designationDetailsForm.values.isHod === "true" ? "Yes" : "No"}
                                    isReadOnly={true}
                                    isDisabled={true}
                                    inputClassName={'!tw-bg-transparent !tw-border-0 !tw-rounded-none'}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />}
                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="hodId"
                                    labelText="HOD"
                                    value={designationDetailsForm.values.hodId}
                                    onChange={designationDetailsForm.handleChange}
                                    onBlur={designationDetailsForm.handleBlur}
                                    valueKey="employeeId"
                                    textKey="employeeName"
                                    menuItems={hodListResp || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none bg-img-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={
                                        designationDetailsForm.touched.hodId &&
                                            designationDetailsForm.errors.hodId
                                            ? true
                                            : false
                                    }
                                    error={
                                        designationDetailsForm.touched.hodId &&
                                            designationDetailsForm.errors.hodId
                                            ? designationDetailsForm.errors.hodId
                                            : ""
                                    }
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
                            <div className="tw-col-auto tw-ml-auto tw-flex tw-pl-4 tw-pb-3 tw-gap-4">
                                <Button variant="secondary" onClick={CancelHandler}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={(e: any) => designationDetailsForm.handleSubmit(e)}>
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