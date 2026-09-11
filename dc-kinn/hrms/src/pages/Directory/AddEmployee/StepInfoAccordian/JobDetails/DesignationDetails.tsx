import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
} from "../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getDesignationsAct, getEmployeeCategoriesAct, } from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getBranchCurriculumAct, getBrchCurriculumClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getHODListAct, getReporterListAct } from "../../../../../store/directory/employeemanagement/employeemanagementactions";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Old Data
// function getInitialState(initialState: any) {
//     return {
//         admissionAcademicYearId: initialState?.admissionAcademicYearId || "1",
//         admissionNo: initialState?.admissionNo || "2432",
//         dateOfAdmission: initialState?.dateOfAdmission || "2023-01-15T09:45:00",
//         studentName: initialState?.studentName || "Student Name",
//         aadharCardNo: initialState?.aadharCardNo || "123456789012",
//         genderId: initialState?.genderId || "1",
//         dob: initialState?.dob || "1980-10-01T09:45:00",
//         emailId: initialState?.emailId || "stesting@gmail.com",
//         contactNo: initialState?.contactNo || "1234567890",
//         birthPlace: initialState?.birthPlace || "Shars",
//         bloodGroupId: initialState?.bloodGroupId || "1",
//     }
// }


const validationSchema = Yup.object().shape({
    designationId: Yup.string().required("Select designation id."),
    employeeCategoryId: Yup.string().required("Select employee category id."),
});

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}


function getInitialState(initialState?: any) {
    return {
        id: initialState?.id || undefined,
        classCoordinatorId: initialState?.classCoordinatorId || "",
        designationId: initialState?.designationId || "",
        employeeCategoryId: initialState?.employeeCategoryId || "",
        hodId: initialState?.hodId || "",
        isClassCoordinator: "false",
        isHod: getTrueFalseOptions(initialState?.isHod),
        isReportingHead: getTrueFalseOptions(initialState?.isReportingHead),
        reportingHeadId: initialState?.reportingHeadId || ""
    }
}

export default function DesignationDetails({ instituteId, branchId }: any) {
    const [designationState, setDesignationState] = useState<any>(getInitialState());
    const [classListState, setClassListState] = useState([]);
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { designationListResp, employeeCategoriesResp, brchCurriculumResp,
        getHodListResp, getReporterListResp, brchCurriculumClassResp } =
        useAppSelector(({ masterData, branchAcademics, directoryEmployee }) => ({
            designationListResp: masterData.designationListResp,
            brchCurriculumClassResp: branchAcademics.brchCurriculumClassResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            employeeCategoriesResp: masterData.employeeCategoriesResp,
            getHodListResp: directoryEmployee.getHodListResp,
            getReporterListResp: directoryEmployee.getReporterListResp
        }), shallowEqual);

    useEffect(() => {
        const brchCurriculumparams = { branchId, sortBy: "curriculumName", orderBy: "asc", pageNo: 0, pageSize: 200 },
            currciulumClassResp = { branchId };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
        dispatch(getBrchCurriculumClassAct(generateActionPayload("get_brnch_curriclum_class_mapping", currciulumClassResp)));
        dispatch(getEmployeeCategoriesAct(generateActionPayload("get_employee_categories")));
        dispatch(getDesignationsAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "DESIGNATION", sortBy: "designationName", orderBy: "asc", pageNo: 0, pageSize: 5000 })));
        dispatch(getHODListAct(generateActionPayload("get_hod_employee")));
        dispatch(getReporterListAct(generateActionPayload("get_reporting_head")));
    }, [branchId]);

    const designationForm = useFormik({
        enableReinitialize: true,
        initialValues: designationState,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormData("employeeDesignationDetails", true, values);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeDesignationDetails"))
            designationForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (editEmployeeData) {
            const { employeeDesignationDetails } = editEmployeeData,
                { formData } = employeeDesignationDetails || {};
            if (formData)
                setDesignationState(getInitialState(formData));
        }
    }, [editEmployeeData]);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value) {
            const { classDTOS } = brchCurriculumClassResp?.find((item: any) => (item.branchCurriculumId === +value)) || {};
            setClassListState(classDTOS);
        } else {
            setClassListState([]);
        }
        designationForm.setValues((prevState: any) => ({
            ...prevState, [name]: value, reportingClassDivision: ""
        }))
    }
    return (
        <form onSubmit={designationForm.handleSubmit}>
            <AccordionHeader
                tag="span"
                className="tw-text-base tw-font-medium"
                targetId="designation-details"
            >
                Designation Details
            </AccordionHeader>
            <AccordionBody accordionId="designation-details">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="designationId"
                            labelText="Post / Designation"
                            value={designationForm.values.designationId}
                            onChange={designationForm.handleChange}
                            onBlur={designationForm.handleBlur}
                            invalid={(designationForm.touched.designationId && designationForm.errors.designationId) ? true : false}
                            error={(designationForm.touched.designationId && designationForm.errors.designationId) ? designationForm.errors.designationId : ""}
                            menuItems={designationListResp?.data}
                            valueKey="id"
                            textKey="designationName"
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="reportingHeadId"
                            labelText="Reporting To"
                            value={designationForm.values.reportingHeadId}
                            onChange={designationForm.handleChange}
                            invalid={(designationForm.touched.reportingHeadId && designationForm.errors.reportingHeadId) ? true : false}
                            error={(designationForm.touched.reportingHeadId && designationForm.errors.reportingHeadId) ? designationForm.errors.reportingHeadId : ""}
                            menuItems={getReporterListResp}
                            valueKey="employeeId"
                            textKey="employeeName"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <RadioInputContainer
                            name="isReportingHead"
                            labelText="Is Reporting Head?"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={[
                                { id: "true", name: "Yes" },
                                { id: "false", name: "No" },
                            ]}
                            value={designationForm.values.isReportingHead}
                            onChange={designationForm.handleChange}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="employeeCategoryId"
                            labelText="Employee Category"
                            value={designationForm.values.employeeCategoryId}
                            onChange={designationForm.handleChange}
                            onBlur={designationForm.handleBlur}
                            invalid={(designationForm.touched.employeeCategoryId && designationForm.errors.employeeCategoryId) ? true : false}
                            error={(designationForm.touched.employeeCategoryId && designationForm.errors.employeeCategoryId) ? designationForm.errors.employeeCategoryId : ""}
                            menuItems={employeeCategoriesResp}
                            valueKey="employeeCategoryId"
                            textKey="categoryName"
                            labelClass="required"
                        />
                    </div>
               {/* <div className="col-4">
                        <SelectInput
                            name="reportingCurriculum"
                            labelText="Curriculum"
                            value={designationForm.values.reportingCurriculum}
                            onChange={onChangeHandler}
                            invalid={(designationForm.touched.reportingCurriculum && designationForm.errors.reportingCurriculum) ? true : false}
                            error={(designationForm.touched.reportingCurriculum && designationForm.errors.reportingCurriculum) ? designationForm.errors.reportingCurriculum : ""}
                            menuItems={brchCurriculumResp?.data}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="reportingClassDivision"
                            labelText="Reporting Class Division"
                            value={designationForm.values.reportingClassDivision}
                            onChange={designationForm.handleChange}
                            invalid={(designationForm.touched.reportingClassDivision && designationForm.errors.reportingClassDivision) ? true : false}
                            error={(designationForm.touched.reportingClassDivision && designationForm.errors.reportingClassDivision) ? designationForm.errors.reportingClassDivision : ""}
                            menuItems={classListState}
                            valueKey="branchClassId"
                            textKey="shortName"
                        />
                    </div> */}
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="hodId"
                            labelText="HOD"
                            value={designationForm.values.hodId}
                            onChange={designationForm.handleChange}
                            invalid={(designationForm.touched.hodId && designationForm.errors.hodId) ? true : false}
                            error={(designationForm.touched.hodId && designationForm.errors.hodId) ? designationForm.errors.hodId : ""}
                            menuItems={getHodListResp}
                            valueKey="employeeId"
                            textKey="employeeName"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <RadioInputContainer
                            name="isHod"
                            labelText="Is HOD?"
                            inputContainerClassName="mt-2"
                            radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                            value={designationForm.values.isHod}
                            onChange={designationForm.handleChange}
                        />
                    </div>
                    {/* <div className="col-12">
                        <input type="submit" />
                    </div> */}
                    {/* <div className="col-4">
                        <RadioInputContainer
                            name="isClassCoordinator"
                            labelText="Is Class Coordinator?"
                            inputContainerClassName="mt-2"
                            radioOptions={[{ id: "yes", name: "Yes" }, { id: "no", name: "No" }]}
                            value={designationForm.values.isClassCoordinator}
                            onChange={designationForm.handleChange}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="classCoordinator"
                            labelText="Class Coordinator"
                            value={designationForm.values.classCoordinator}
                            onChange={designationForm.handleChange}
                            invalid={(designationForm.touched.classCoordinator && designationForm.errors.classCoordinator) ? true : false}
                            error={(designationForm.touched.classCoordinator && designationForm.errors.classCoordinator) ? designationForm.errors.classCoordinator : ""}
                            menuItems={[]}
                            valueKey="id"
                            textKey="name"
                        />
                    </div> */}

                </div>
            </AccordionBody>
        </form>
    )
}