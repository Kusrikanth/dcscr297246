import React, { useEffect, useMemo, useState } from "react";
import { getStudentByFilterAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getEmployeeByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { shallowEqual } from "react-redux";
import {
    renderOptionsStudent, renderValueStaff, renderValueStudent, statusOptionsParent, statusOptionsStaff, studentTypeOptions, userTypeOptions,
    AudienceSelectorProvider, employeeTypeOptions,
    generateValidateStudentsColumns
} from "./helper";
import { useFormik } from "formik";
import { InputCheckbox, MultiSelectCheckbox, RadioInputContainer, TextArea } from "../../../../Components/Common";
import { renderOptionsStaff } from "../../Events/AddEvent/helper";
import { twMerge } from "tailwind-merge";
import TreeComponent from './TreeComponent';
import { getCurriculumClassSectAct, resetWhatsAppNotificationValidateStudentsAct, whatsAppNotifcationValidateStudentsAct } from "../../../../store/communication/communicationactions";
import * as Yup from "yup";
import { FormFeedback } from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import { default as RejectSvg } from "../../../../assets/imagesdps/academics/confirmation-icon.svg?react";

interface AudienceSelectorProps {
    instituteId: string;
    branchId: string;
    toggle: () => void;
    initialAudience: any;
    selectAudienceHandler: (audience: any) => void;
}

const initialValues: any = {
    recipientType: "PARENT",
    studentType: "all-student",
    employeeType: "",
    employeeIds: [],
    studentIds: [],
    studentCodes: "",
    employeeCategory: [],
    parentCategory: ["primaryContact"],
    curriculumState: [],
};

const validationSchema = Yup.object({
    recipientType: Yup.string().required(),
    studentType: Yup.string().nullable(),
    employeeType: Yup.string().nullable(),

    employeeCategory: Yup.array()
        .of(Yup.string())
        .transform(v => (Array.isArray(v) ? v : []))
        .when(["recipientType", "employeeType"], {
            is: (recipientType: string, employeeType: string) =>
                recipientType === "STAFF" && employeeType === "all-employee",
            then: (schema) => schema.min(1, "Select at least one staff category"),
            otherwise: (schema) => schema.notRequired(),
        }),

    parentCategory: Yup.array()
        .of(Yup.string())
        .transform(v => (Array.isArray(v) ? v : []))
        .when("recipientType", {
            is: (val: string) => val === "PARENT",
            then: (schema) => schema.min(1, "Select category."),
            otherwise: (schema) => schema.notRequired(),
        }),

    employeeIds: Yup.array()
        .of(Yup.mixed())
        .transform(v => (Array.isArray(v) ? v : []))
        .when(["recipientType", "employeeType"], {
            is: (recipientType: string, employeeType: string) =>
                recipientType === "STAFF" && employeeType === "selected-employee",
            then: (schema) => schema.min(1, "Select at least one employee."),
            otherwise: (schema) => schema.notRequired(),
        }),

    studentIds: Yup.array()
        .of(Yup.mixed())
        .transform(v => (Array.isArray(v) ? v : []))
        .when(["recipientType", "studentType"], {
            is: (recipientType: string, studentType: string) =>
                recipientType === "PARENT" && studentType === "selected-student",
            then: (schema) => schema.min(1, "Select at least one student."),
            otherwise: (schema) => schema.notRequired(),
        }),

    curriculumState: Yup.array()
        .transform(v => (Array.isArray(v) ? v : []))
        .when(["recipientType", "studentType"], {
            is: (recipientType: string, studentType: string) =>
                recipientType === "PARENT" && studentType === "all-student",
            then: (schema) =>
                schema.test(
                    "at-least-one-curriculum-selected",
                    "Select at least one curriculum/class/section.",
                    (list: any[] | undefined) => {
                        if (!Array.isArray(list) || list.length === 0) return false;
                        return list.some(cur =>
                            cur?.isSelected ||
                            (cur?.classes || []).some((cls: any) =>
                                cls?.isSelected ||
                                (cls?.sections || []).some((sec: any) => !!sec?.isSelected)
                            )
                        );
                    }
                ),
            otherwise: (schema) => schema.notRequired(),
        }),
});

const studentvalidationSchema = Yup.object({
    studentCodes: Yup.string()
        .when("studentType", {
            is: (val: string) => val === "manual-entry",
            then: (schema) =>
                schema
                    .required("Student codes are required")
                    .test(
                        "valid-student-codes",
                        "Enter valid student codes separated by commas",
                        (value) => {
                            if (!value) return false;

                            const codes = value
                                .split(",")
                                .map(v => v.trim())
                                .filter(Boolean);

                            if (codes.length === 0) return false;
                            return codes.every(code => /^\d+$/.test(code));
                        }
                    ),
            otherwise: (schema) => schema.notRequired(),
        }),
});


const AudienceSelector = (props: AudienceSelectorProps) => {
    const { instituteId, branchId, toggle, selectAudienceHandler, initialAudience } = props;
    const dispatch = useAppDispatch();
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [contactInfoStaff, setContactInfoStaff] = useState(statusOptionsStaff);
    const [validatedStudents, setValidatedStudents] = useState<any[]>([]);
    const [isValidated, setIsValidated] = useState(false);

    const {
        academicYearListResp,
        showApiLoader,
        curriculumClassSectResp,
        getStudentsByFilterResp,
        getEmployeesByFilterResp,
        whatsAppNotificationValidateStudentsResp,
    } = useAppSelector(({ appData, directoryStudent, instAcademics, globalData, communication, directoryEmployee }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        showApiLoader: globalData.showApiLoader,
        getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
        curriculumClassSectResp: communication.curriculumClassSectResp,
        whatsAppNotificationValidateStudentsResp: communication.whatsAppNotificationValidateStudentsResp,
        getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
    }), shallowEqual);

    useEffect(() => {
        const { data } = curriculumClassSectResp || {},
            { curriculumState = [] } = initialAudience || {};
        if (Array.isArray(data) && curriculumState?.length === 0) {
            const updateData = data.map(item => ({
                ...item,
                isSelected: false,
                classes: item.classes.map((cls: any) => ({
                    ...cls,
                    isSelected: false,
                    sections: cls.sections.map((section: any) => ({
                        ...section,
                        isSelected: false
                    }))
                }))
            }));
            // setCurriculumState(updateData);
            addUserDefinedTemplate.setFieldValue('curriculumState', updateData);
        }
    }, [curriculumClassSectResp, initialAudience]);

    useEffect(() => {
        if (initialAudience) {
            const { curriculumState } = initialAudience;
            if (Array.isArray(curriculumState) && curriculumState.length > 0) {
                setIsAllSelected(curriculumState?.every((item: any) => item.isSelected));
            }
            addUserDefinedTemplate.resetForm({ values: initialAudience });
        }
    }, [initialAudience]);

    useEffect(() => {
        if (branchId) {
            dispatch(getCurriculumClassSectAct(generateActionPayload("get_curriculum_class_section", undefined, {
                branchId, ...(location.pathname === "/hostel-whatsapp-notifications/compose" && { isHostel: "true" })
            })));
        }
    }, [branchId]);

    const addUserDefinedTemplate = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            selectAudienceHandler(values);
        }
    })


    function onSelectParentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target;
        const { parentCategory } = addUserDefinedTemplate.values;
        if (checked) {
            parentCategory.push(name)
            addUserDefinedTemplate.setFieldValue('parentCategory', parentCategory);
        } else {
            addUserDefinedTemplate.setFieldValue('parentCategory', parentCategory.filter((item: any) => item !== name));
        }
    }

    function onSelectStaffHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target
        const { employeeCategory } = addUserDefinedTemplate.values;
        if (checked) {
            employeeCategory.push(name)
            addUserDefinedTemplate.setFieldValue('employeeCategory', employeeCategory);
        } else {
            addUserDefinedTemplate.setFieldValue('employeeCategory', employeeCategory.filter((item: any) => item !== name));
        }
    }


    function selectStudentHndlr(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addUserDefinedTemplate.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            addUserDefinedTemplate.setValues((prevState: any) => ({ ...prevState, [name]: null }));
        }
    }

    function onSearchMultiSelectHandler(name: any, value: any) {
        if (value) {
            const { academicYearId } = academicYearListResp?.data.find((year: any) => year?.yearStatus?.toLowerCase() === "current") || {};
            dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined, {
                instituteId,
                branchId: branchId, academicYearId: academicYearId,
                studentName: value,
                isActive: true,
                pageNo: 0, pageSize: 50,
                ...(location.pathname === "/hostel-whatsapp-notifications/compose" && { isHostel: "true" })
            })));
        }
    }

    function onSearchMultiSelectHandleremployee(name: any, value: string) {
        if (value) {
            const params = { searchString: value };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
        }
    }

    function selecteAllHndlr() {
        const nextChecked = !isAllSelected;
        const tree: any[] = Array.isArray(addUserDefinedTemplate.values.curriculumState)
            ? addUserDefinedTemplate.values.curriculumState
            : [];

        const updated = tree.map((item: any) => ({
            ...item,
            isSelected: nextChecked,
            classes: (item.classes || []).map((cls: any) => ({
                ...cls,
                isSelected: nextChecked,
                sections: (cls.sections || []).map((sec: any) => ({
                    ...sec,
                    isSelected: nextChecked,
                })),
            })),
        }));
        setIsAllSelected(nextChecked);
        addUserDefinedTemplate.setFieldValue('curriculumState', updated, false);
    }

    function selectTreeRowHndlr(selectedInfo: any) {
        const { rowType, curriculumId, sectionId, classId, checked } = selectedInfo;
        if (!rowType) return;
        const { curriculumState } = addUserDefinedTemplate.values;
        const updatedCurriculumData = [...curriculumState];
        if (rowType === "CURRICULUM") {
            const curriculumRowIndex = curriculumState.findIndex((item: any) => item.curriculumId?.toString() === curriculumId?.toString());
            if (curriculumRowIndex > -1) {
                const rowInfo = curriculumState[curriculumRowIndex];
                const updateRowInfo = { ...rowInfo };
                updateRowInfo.isSelected = checked;
                const classesUpdate = updateRowInfo.classes.map((cls: any) => ({
                    ...cls,
                    isSelected: checked,
                    sections: cls.sections.map((section: any) => ({
                        ...section,
                        isSelected: checked
                    }))
                }))
                updateRowInfo.classes = classesUpdate;
                updatedCurriculumData.splice(curriculumRowIndex, 1, updateRowInfo);
            }
        } else if (rowType === "CLASS") {
            const curriculumRowIndex = curriculumState.findIndex((item: any) => item.curriculumId?.toString() === curriculumId?.toString());
            if (curriculumRowIndex > -1) {
                const curriuculumRowInfo = curriculumState[curriculumRowIndex];
                const updatedCurriculumRowInfo = { ...curriuculumRowInfo };
                const curriculumClasses = [...updatedCurriculumRowInfo.classes];
                const classRowIndex = curriculumClasses.findIndex((item: any) => item.classId?.toString() === classId?.toString());
                if (classRowIndex > -1) {
                    const classRowInfo = curriculumClasses[classRowIndex];
                    const updateClassRowInfo = { ...classRowInfo };
                    updateClassRowInfo.isSelected = checked;
                    const sectionUpdate = updateClassRowInfo.sections.map((sections: any) => ({
                        ...sections,
                        isSelected: checked
                    }))
                    updateClassRowInfo.sections = sectionUpdate;
                    curriculumClasses.splice(classRowIndex, 1, updateClassRowInfo);
                    updatedCurriculumRowInfo.isSelected = curriculumClasses.every((item: any) => item.isSelected);
                    updatedCurriculumRowInfo.classes = curriculumClasses;
                    updatedCurriculumData.splice(curriculumRowIndex, 1, updatedCurriculumRowInfo);
                }
            }
        } else {
            const curriculumRowIndex = curriculumState.findIndex((item: any) => item.curriculumId?.toString() === curriculumId?.toString());
            if (curriculumRowIndex > -1) {
                const curriuculumRowInfo = curriculumState[curriculumRowIndex];
                const updatedCurriculumRowInfo = { ...curriuculumRowInfo };
                const curriculumClasses = [...updatedCurriculumRowInfo.classes];
                const classRowIndex = curriculumClasses.findIndex((item: any) => item.classId?.toString() === classId?.toString());
                if (classRowIndex > -1) {
                    const classRowInfo = curriculumClasses[classRowIndex];
                    const updateClassRowInfo = { ...classRowInfo };
                    const sectionUpdate = updateClassRowInfo.sections.map((sections: any) => {
                        if (sections?.sectionId?.toString() === sectionId?.toString()) {
                            return ({ ...sections, isSelected: checked })
                        }
                        return { ...sections }
                    })
                    updateClassRowInfo.isSelected = sectionUpdate.every((item: any) => item.isSelected);
                    updateClassRowInfo.sections = sectionUpdate;
                    curriculumClasses.splice(classRowIndex, 1, updateClassRowInfo);
                    updatedCurriculumRowInfo.isSelected = curriculumClasses.every((item: any) => item.isSelected);
                    updatedCurriculumRowInfo.classes = curriculumClasses;
                    updatedCurriculumData.splice(curriculumRowIndex, 1, updatedCurriculumRowInfo);
                }
            }
        }
        setIsAllSelected(updatedCurriculumData?.every((item: any) => item.isSelected));
        addUserDefinedTemplate.setFieldValue('curriculumState', updatedCurriculumData);
    }

    const onChangeTypeHandler = (value: string) => {
        const resetCurriculumData = resetCuriculumSelection();
        setIsAllSelected(false);
        if (value === 'PARENT') {
            addUserDefinedTemplate.setValues((prev: any) => ({
                ...prev, "recipientType": value,
                employeeCategory: [],
                employeeIds: [],
                parentCategory: ['primaryContact'],
                studentType: 'all-student',
                studentIds: [],
                curriculumState: resetCurriculumData
            }))
        } else if (value === 'STAFF') {
            addUserDefinedTemplate.setValues((prev: any) => ({
                ...prev, "recipientType": value,
                employeeCategory: ['ADMIN', 'NONTEACHING'],
                employeeType: 'all-employee',
                parentCategory: [],
                studentType: '',
                studentIds: [],
                curriculumState: resetCurriculumData
            }))
        } else {
            addUserDefinedTemplate.setValues((prev: any) => ({
                ...prev, "recipientType": value,
                employeeCategory: [],
                parentCategory: [],
                studentType: '',
                curriculumState: resetCurriculumData
            }))
        }
    }

    function resetCuriculumSelection() {
        const { curriculumState } = addUserDefinedTemplate.values;
        return curriculumState.map((item: any) => ({
            ...item,
            isSelected: false,
            classes: item.classes.map((cls: any) => ({
                ...cls,
                isSelected: false,
                sections: cls.sections.map((section: any) => ({
                    ...section,
                    isSelected: false
                }))
            }))
        }));
    }

    function onChangeStudentTypeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        const resetCurriculumData = resetCuriculumSelection();
        setIsAllSelected(false);
        addUserDefinedTemplate.setValues((prev: any) => ({
            ...prev,
            [name]: value,
            studentIds: [],
            curriculumState: resetCurriculumData
        }))
    }

    function onChagneEmployeeTypeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        addUserDefinedTemplate.setValues((prev: any) => ({
            ...prev,
            [name]: value,
            employeeCategory: value === 'all-employee' ? ['ADMIN', 'NONTEACHING'] : [],
            employeeIds: [],
        }))
    }

    const { employeeCategory, parentCategory, studentType } = addUserDefinedTemplate.values;
    
    useEffect(() => {
        dispatch(resetWhatsAppNotificationValidateStudentsAct(undefined));
    }, [dispatch]);

    const hasStudentCodes =
        addUserDefinedTemplate.values.studentCodes
            ?.split(",")
            .some((code: string) => code.trim().length > 0);

    const studentCodeCount =
        addUserDefinedTemplate.values.studentCodes
            ?.split(",")
            .filter((code: string) => code.trim().length > 0).length ?? 0;

    const validateManualStudents = () => {
        const { studentCodes, studentType } = addUserDefinedTemplate.values;
        if (studentType !== "manual-entry") return;
        addUserDefinedTemplate.setFieldTouched("studentCodes", true, false);
        const codes = studentCodes
            ?.split(",")
            .map((c: string) => c.trim())
            .filter(Boolean);
        if (!codes || codes.length === 0) {
            addUserDefinedTemplate.setErrors({
                studentCodes: "Student codes are required",
            });
            return;
        }
        const hasInvalidCode = codes.some(code => !/^\d+$/.test(code));
        if (hasInvalidCode) {
            addUserDefinedTemplate.setErrors({
                studentCodes: "Enter valid student codes separated by commas",
            });
            return;
        }
        addUserDefinedTemplate.setErrors({});
        const payload = {
            branchId,
            studentCodes: codes.join(","),
                ...(location.pathname === "/hostel-whatsapp-notifications/compose" && { isHostel: "true" })
        };

        dispatch(
            whatsAppNotifcationValidateStudentsAct(
                generateActionPayload(
                    "whatsapp_notifcation_validate_students",
                    undefined,
                    payload
                )
            )
        );
    };

    useEffect(() => {
        if (studentType === "manual-entry") {
            dispatch(resetWhatsAppNotificationValidateStudentsAct(undefined));
            setValidatedStudents([]);
            setIsValidated(false);
        }
    }, [addUserDefinedTemplate.values.studentCodes, studentType, dispatch]);

    useEffect(() => {
        const resp = whatsAppNotificationValidateStudentsResp?.data;
        if (!resp) return;
        if (Array.isArray(resp.data)) {
            setValidatedStudents(resp.data);
        }
        setIsValidated((resp.total ?? 0) - (resp.invalid ?? 0) > 0);

    }, [whatsAppNotificationValidateStudentsResp]);
    
    const totalCount =
        whatsAppNotificationValidateStudentsResp?.data?.total ?? 0;

    const invalidCount =
        whatsAppNotificationValidateStudentsResp?.data?.invalid ?? 0;

    const validCount = totalCount - invalidCount;

    const countPill =
        "tw-ml-2 tw-min-w-[28px] tw-text-center tw-inline-flex tw-items-center tw-justify-center tw-px-2 tw-py-0.5 tw-rounded-full tw-bg-gray-100 tw-text-gray-800 tw-text-xs tw-font-semibold";
        
    const hasValidateResp =
        studentType === "manual-entry" &&
        whatsAppNotificationValidateStudentsResp?.statusCode === 200 &&
        typeof whatsAppNotificationValidateStudentsResp?.data?.total === "number";
        
    const canUseSelection =
        studentType === "manual-entry" &&
        hasValidateResp &&
        validCount > 0;

    const columns = useMemo(() => generateValidateStudentsColumns(), []);

    return (
        <form onSubmit={addUserDefinedTemplate.handleSubmit}>
            <div className="modal-body p-3">
                <div className="tw-flex tw-flex-col tw-mb-3">
                    <label className='required form-label tw-font-medium'>
                        Audience Type
                    </label>
                    <div className="tw-flex tw-items-center tw-gap-2">
                        {userTypeOptions.map((item) => (
                            <button type="button" className={twMerge(`
                            tw-flex tw-items-center
                                tw-justify-center
                               tw-rounded-full tw-self-start
                              tw-px-3 tw-py-1 tw-border
                            `, addUserDefinedTemplate.values.recipientType === item.id ?
                                'tw-bg-[#0AB39C] tw-text-[#ffffff]' : 'tw-bg-[#E5E7EB] tw-text-[#5A5B5D]')}
                                onClick={() => { onChangeTypeHandler(item.id) }}
                            >
                                {item.name}
                            </button>))}
                    </div>
                </div>
                {addUserDefinedTemplate.values.recipientType === "STAFF" &&
                    <>
                        <RadioInputContainer
                            name="employeeType"
                            labelText="Employee Type"
                            labelClassName="required tw-font-medium"
                            radioOptions={employeeTypeOptions}
                            value={addUserDefinedTemplate.values.employeeType}
                            onChange={onChagneEmployeeTypeHandler}
                        />
                        {addUserDefinedTemplate.values.employeeType === 'all-employee' && <div className="tw-flex tw-flex-col mb-3">
                            <label className="required form-label tw-font-medium">
                                Type
                            </label>
                            <div className='tw-flex tw-gap-3'>
                                {contactInfoStaff.map((item: any) => {
                                    return (
                                        <InputCheckbox
                                            name={`${item.id}`}
                                            key={item.id}
                                            formgroupClassName='mb-0'
                                            labelName={item.name}
                                            onChange={onSelectStaffHndlr}
                                            value={Array.isArray(employeeCategory) && employeeCategory.includes(item.id) || false}
                                            dataId={item.id}
                                        />
                                    )
                                })}
                            </div>
                            {(addUserDefinedTemplate.touched.employeeCategory && addUserDefinedTemplate.errors.employeeCategory) && (
                                <FormFeedback type="invalid" className="d-block">{addUserDefinedTemplate.errors.employeeCategory}</FormFeedback>
                            )}

                        </div>}

                        {addUserDefinedTemplate.values.employeeType === 'selected-employee' && <MultiSelectCheckbox
                            name="employeeIds"
                            labelText='Employee'
                            labelClass="tw-font-medium required"
                            containerClassName='mb-3'
                            idKey="id"
                            value={addUserDefinedTemplate.values.employeeIds}
                            renderValue={renderValueStaff}
                            renderOptions={renderOptionsStaff}
                            onChange={selectStudentHndlr}
                            onSearchHandler={onSearchMultiSelectHandleremployee}
                            options={getEmployeesByFilterResp}
                            invalid={(addUserDefinedTemplate.touched.employeeIds && addUserDefinedTemplate.errors.employeeIds) ? true : false}
                            error={(addUserDefinedTemplate.touched.employeeIds && addUserDefinedTemplate.errors.employeeIds) ? String(addUserDefinedTemplate.errors.employeeIds) : ""}
                        />}
                    </>}
                {addUserDefinedTemplate.values.recipientType === "PARENT" &&
                    <>
                        <div className="tw-flex tw-flex-col mb-3">
                            <label className="required form-label tw-font-medium">
                                Type
                            </label>
                            <div className="tw-flex tw-gap-3">
                                {statusOptionsParent.map((item: any) => {
                                    return (
                                        <InputCheckbox
                                            key={item.id}
                                            formgroupClassName='mb-0'
                                            name={`${item.id}`}
                                            labelName={item.name}
                                            value={Array.isArray(parentCategory) && parentCategory.includes(item.id) || false}
                                            onChange={onSelectParentHndlr}
                                            dataId={item.id}
                                        />
                                    )
                                })}
                            </div>
                            {(addUserDefinedTemplate.touched.parentCategory && addUserDefinedTemplate.errors.parentCategory) && (
                                <FormFeedback type="invalid" className="d-block">{addUserDefinedTemplate.errors.parentCategory}</FormFeedback>
                            )}

                        </div>
                        <RadioInputContainer
                            name="studentType"
                            labelText="Student Type"
                            labelClassName="required tw-font-medium"
                            radioOptions={studentTypeOptions}
                            value={addUserDefinedTemplate.values.studentType}
                            onChange={onChangeStudentTypeHandler}
                        />
                        {studentType === 'all-student' && <div className='col-12 mb-3'>
                            <div className="tw-mb-1">
                                <AudienceSelectorProvider.Provider
                                    value={{
                                        selectTreeRowHndlr
                                    }}
                                >
                                    <TreeComponent
                                        isAllSelected={isAllSelected}
                                        selecteAllHndlr={selecteAllHndlr}
                                        curriculumClass={addUserDefinedTemplate.values.curriculumState}
                                    />
                                </AudienceSelectorProvider.Provider>
                            </div>
                            {(addUserDefinedTemplate.touched.curriculumState && addUserDefinedTemplate.errors.curriculumState) && (
                                <FormFeedback type="invalid" className="d-block">{addUserDefinedTemplate.errors.curriculumState}</FormFeedback>
                            )}
                        </div>}
                        {studentType === 'selected-student' &&
                            <MultiSelectCheckbox
                                name="studentIds"
                                labelText='Students'
                                labelClass="required tw-font-medium"
                                containerClassName='mb-3'
                                idKey="id"
                                value={addUserDefinedTemplate.values.studentIds}
                                renderValue={renderValueStudent}
                                renderOptions={renderOptionsStudent}
                                onChange={selectStudentHndlr}
                                onSearchHandler={onSearchMultiSelectHandler}
                                options={getStudentsByFilterResp}
                                invalid={(addUserDefinedTemplate.touched.studentIds && addUserDefinedTemplate.errors.studentIds) ? true : false}
                            error={(addUserDefinedTemplate.touched.studentIds && addUserDefinedTemplate.errors.studentIds) ? String(addUserDefinedTemplate.errors.studentIds) : ""}
                        />}
                    {studentType === "manual-entry" && (
                        <>
                            <div className="row align-items-center mb-2">
                                <div className="col-8 form-label required">
                                    Students
                                </div>
                                <div className="col-4 text-end">
                                    <div className="tw-inline-flex tw-items-center tw-gap-2 tw-text-sm tw-text-gray-700">
                                        <span>Total :</span>
                                        <span className={countPill}>{totalCount}</span>
                                    </div>
                                </div>
                            </div>
                            <TextArea
                                    name="studentCodes"
                                    value={addUserDefinedTemplate.values.studentCodes}
                                    onChange={addUserDefinedTemplate.handleChange}
                                    invalid={
                                        !!(
                                            addUserDefinedTemplate.touched.studentCodes &&
                                            addUserDefinedTemplate.errors.studentCodes
                                        )
                                    }
                                    error={
                                        addUserDefinedTemplate.touched.studentCodes &&
                                            addUserDefinedTemplate.errors.studentCodes
                                            ? String(addUserDefinedTemplate.errors.studentCodes)
                                            : ""
                                    }
                                    maxLength={60000}
                                />
                                {studentCodeCount <= 1 && !(hasValidateResp && validCount === 0) && (
                                    <div className="form-text text-muted tw-mt-1">
                                        <span className="fw-bold">Note:</span> Enter student codes separated by commas.
                                        <br />
                                        <span className="tw-text-gray-500">
                                            Example: <code>1234, 12345, 1234567</code>
                                        </span>
                                    </div>
                                )}
                                {hasValidateResp && (
                                    <>
                                        {validCount > 0 ? (
                                            <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-xl tw-overflow-hidden">
                                                <TableContainer
                                                    columns={columns}
                                                    data={validatedStudents}
                                                    showPagination={false}
                                                    showCheckbox={false}
                                                    tableClass="mb-0"
                                                    divClass="table-responsive max-h-400px"
                                                    theadClass="table-light text-muted align-middle position-sticky top-0"
                                                />
                                            </div>
                                        ) : (
                                            <div className="tw-flex tw-items-center tw-justify-center tw-h-[120px] tw-bg-gray-50 tw-border tw-border-dashed tw-border-gray-300 tw-rounded-xl">
                                                <p className="tw-text-sm tw-text-gray-600 mb-0">
                                                   <span className="ms-2">No records are valid. Please correct the student codes and validate again.</span>  <RejectSvg fill="#f06548" width={"20px"} height="20px" />
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                }
            </div>
            <div className="modal-footer tw-gap-3">
                <button
                    type="button"
                    className="btn btn-light m-0"
                    onClick={toggle}
                >
                    Cancel
                </button>
                {studentType === "manual-entry" && !canUseSelection ? (
                    <button
                        type="button"
                        className="btn btn-primary m-0"
                        onClick={validateManualStudents}
                        disabled={showApiLoader || !hasStudentCodes}
                    >
                        Validate
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="btn btn-success m-0"
                        disabled={showApiLoader}
                    >
                        Use Selection
                    </button>
                )}
            </div>
        </form>
    )
}

export default AudienceSelector;