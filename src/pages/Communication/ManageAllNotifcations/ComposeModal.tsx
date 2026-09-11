import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { InputCheckbox, MultiSelectCheckbox, QuillEditor, RadioInputContainer, SelectInput, TextArea, TextInput } from '../../../Components/Common'
import { useFormik } from 'formik';
import {
    userTypeOptions, statusOptionsCheckbox, statusOptionsParent, statusOptionsStaff, studentTypeOptions, CurriculumSelectorProvider,
    renderOptionsStudent, renderValueStudent,
    renderValueStaff,
    renderOptionsEmployee,
    generateValidateStudentsColumns,
    categoryOptions
} from './helper';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { getStudentByFilterAct } from '../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';
import TreeComponent from './TreeComponent';
import { composeMessageAct, resetWhatsAppNotificationValidateStudentsAct, whatsAppNotifcationValidateStudentsAct } from '../../../store/communication/communicationactions';
import { toast } from 'react-toastify';
import { Employee, Student } from './ManageAllNotifcationsTypes';
import { getEmployeeByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementactions';
import * as Yup from "yup";
import { twMerge } from 'tailwind-merge';
import TableContainer from '../../../Components/Common/TableContainer';
// import ReactQuill from 'react-quill';
import { default as RejectSvg } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import Button from '../../../Components/Common/Button';

const initialValues: any = {
    title: "",
    description: "",
    recipientType: "",
    category: "",
    studentType: "",
    employeeIds: [],
    studentIds: [],
    communicationModes: [],
    employeeCategory: [],
    parentCategory: [],
};

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    recipientType: Yup.string().required('User Type is required'),
    category: Yup.string().required('Category is required'),
});

const ComposeModal = (props: any) => {
    const [curriculumState, setCurriculumState] = useState<any>([]);
    const [contactInfoStaff, setContactInfoStaff] = useState(statusOptionsStaff);
    // const quillRef = useRef<ReactQuill | null>(null);
    const [validatedStudents, setValidatedStudents] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const [isValidated, setIsValidated] = useState(false);
    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        curriculumClassSectResp,
        getStudentsByFilterResp,
        composeMessageResp,
        getEmployeesByFilterResp,
        whatsAppNotificationValidateStudentsResp
    } = useAppSelector(({ appData, directoryStudent, instAcademics, globalData, communication, directoryEmployee }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        showApiLoader: globalData.showApiLoader,
        getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
        curriculumClassSectResp: communication.curriculumClassSectResp,
        composeMessageResp: communication.composeMessageResp,
        getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
    whatsAppNotificationValidateStudentsResp: communication.whatsAppNotificationValidateStudentsResp,
  }), shallowEqual);

    const composeModalRespRef = useRef({ prevComposeMessageResp: composeMessageResp })
    useEffect(() => {
        const { prevComposeMessageResp } = composeModalRespRef.current;
        if (composeMessageResp && prevComposeMessageResp !== composeMessageResp) {
            toast.success('Notification sended successfully.');
            props.toggleModal(true);
        }
        composeModalRespRef.current.prevComposeMessageResp = composeMessageResp;
    }, [composeMessageResp]);

      const manualStudentIds = useMemo(() => {
        return whatsAppNotificationValidateStudentsResp?.data?.data?.map((item: any) => item?.studentId) || [];
      }, [whatsAppNotificationValidateStudentsResp]);
    
    const addUserDefinedTemplate = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const selectedSectionIds: any = [];
            const studentIds: any = [];
            const employeeIds: any = [];
            curriculumState.forEach((curriculum: any) => {
                curriculum.classes.forEach((cls: any) => {
                    cls.sections.forEach((section: any) => {
                        if (section.isSelected) {
                            selectedSectionIds.push(section.sectionId);
                        }
                    });
                });
            });
            if(values.studentIds.length > 0){
                const studentId = values.studentIds.map((student: Student) => student.id);
                studentIds.push(...studentId);
            }

            if(values.employeeIds.length > 0){
                const employeeId = values.employeeIds.map((employee: Employee) => employee.id);
                employeeIds.push(...employeeId);
            }
            let messageText = '';
            if (values.description) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = values.description;
                messageText = tempDiv.textContent || tempDiv.innerText || "";
                tempDiv.remove();
            }
            const payload: any = {
                instituteId: props.instituteId,
                branchId: props.branchId,
                module: 'FEE',
                title: values.title,
                description:  values.description,
                communicationModes: values.communicationModes,
                recipientType: values.recipientType,
                category: values.category,
            }

            if (values.recipientType === 'PARENT') {
                if (studentType === 'all-student') {
                    payload.parentDetails = {
                        sections: selectedSectionIds,
                        studentIds: [],
                    };
                }
                else if (studentType === 'manual-entry') {
                    payload.parentDetails = {
                        section: [],
                        studentIds: manualStudentIds,
                    }
                }
                else{
                    payload.parentDetails = {
                        section: [],
                        studentIds: studentIds,
                    }
                }
            } else if (values.recipientType === 'STAFF') {
                payload.staffDetails = {
                    categories: values.employeeCategory,
                    employeeIds: employeeIds,
                };
            }            
            dispatch(composeMessageAct(generateActionPayload("compose_message", undefined, payload)));
        },
    });

    useEffect(() => {
        const { data } = curriculumClassSectResp || {};
        if (Array.isArray(data)) {
            const updateData = data.map(item => ({
                ...item,
                isSelected: false,  // Add isSelected
                classes: item.classes.map((cls: any) => ({
                    ...cls,
                    isSelected: false,  // Add isSelected for classes
                    sections: cls.sections.map((section: any) => ({
                        ...section,
                        isSelected: false  // Add isSelected for sections
                    }))
                }))
            }));
            setCurriculumState(updateData);
        }
    }, [curriculumClassSectResp]);
    const onChangeFilterHndlr = (event: any) => {
        const { name, value } = event.target;
        if (name === 'recipientType') {
            if (value === 'PARENT') {
                addUserDefinedTemplate.setValues((prev: any) => ({
                    ...prev, [name]: value,
                    employeeCategory: [],
                    parentCategory: ['father', 'mother'],
                    studentType: 'all-student'
                }))
            } else if (value === 'STAFF') {
                addUserDefinedTemplate.setValues((prev: any) => ({
                    ...prev, [name]: value,
                    employeeCategory: ['admin', 'nonTeaching'],
                    parentCategory: [],
                    studentType: ''
                }))
            } else {
                addUserDefinedTemplate.setValues((prev: any) => ({
                    ...prev, [name]: value,
                    employeeCategory: [],
                    parentCategory: [],
                    studentType: ''
                }))
            }

        } else {
            addUserDefinedTemplate.setValues((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    function onChangeSendThroughHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target;
        const { communicationModes } = addUserDefinedTemplate.values;
        if (checked) {
            communicationModes.push(name)
            addUserDefinedTemplate.setFieldValue('communicationModes', communicationModes);
        } else {
            addUserDefinedTemplate.setFieldValue('communicationModes', communicationModes.filter((item: any) => item !== name));
        }
    }

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

    const onChangeQuillHndlr = (content: any) => {
        addUserDefinedTemplate.setValues((prevState: any) => ({ ...prevState, description: content }));
    }

    // const insertKeyword = () => {
    //     if (quillRef.current) {
    //       const quillEditor = quillRef.current.getEditor(); 
    //       const cursorPosition = quillEditor.getSelection()?.index ?? 0; 
    //       quillEditor.insertText(cursorPosition, '{{student}}'); 
    //       quillEditor.setSelection({ index: cursorPosition + 11, length: 0 }); 
    //     }
    //   };

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
                pageNo: 0, pageSize: 50
            })));
        }

    }

    function onSearchMultiSelectHandleremployee(name:any , value: string) {
        if (value) {
            const params = { searchString: value };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
        }
    }

    const [isAllSelected, setIsAllSelected] = useState(false);
    function selecteAllHndlr() {
        setIsAllSelected(prevState => !prevState);
        if (isAllSelected) {
            const updateData = curriculumState.map((item: any) => ({
                ...item,
                isSelected: false,  // Add isSelected
                classes: item.classes.map((cls: any) => ({
                    ...cls,
                    isSelected: false,  // Add isSelected for classes
                    sections: cls.sections.map((section: any) => ({
                        ...section,
                        isSelected: false  // Add isSelected for sections
                    }))
                }))
            }));
            setCurriculumState(updateData);
        } else {
            const updateData = curriculumState.map((item: any) => ({
                ...item,
                isSelected: true,  // Add isSelected
                classes: item.classes.map((cls: any) => ({
                    ...cls,
                    isSelected: true,  // Add isSelected for classes
                    sections: cls.sections.map((section: any) => ({
                        ...section,
                        isSelected: true  // Add isSelected for sections
                    }))
                }))
            }));
            setCurriculumState(updateData);
        }
    }

    function selectTreeRowHndlr(selectedInfo: any) {
        const { rowType, curriculumId, sectionId, classId, checked } = selectedInfo;
        if (!rowType) return;
        const updatedCurriculumData = [...curriculumState];
        if (rowType === "CURRICULUM") {
            const curriculumRowIndex = curriculumState.findIndex((item: any) => item.curriculumId?.toString() === curriculumId?.toString());
            if (curriculumRowIndex > -1) {
                const rowInfo = curriculumState[curriculumRowIndex];
                const updateRowInfo = { ...rowInfo };
                updateRowInfo.isSelected = checked;
                const classesUpdate = updateRowInfo.classes.map((cls: any) => ({
                    ...cls,
                    isSelected: checked,  // Add isSelected for classes
                    sections: cls.sections.map((section: any) => ({
                        ...section,
                        isSelected: checked  // Add isSelected for sections
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
        setCurriculumState(updatedCurriculumData);
    }

    const { communicationModes, employeeCategory, parentCategory, studentType } = addUserDefinedTemplate.values;
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
    const columns = useMemo(() => generateValidateStudentsColumns(), []);

        return (
        <>
            <form onSubmit={addUserDefinedTemplate.handleSubmit}>
                <div style={{ padding: "1.25rem" }}>
                    <div className="tw-flex tw-flex-wrap">
                        <div className="tw-w-7/12 tw-px-3">
                            <div className="tw-flex tw-flex-wrap">
                                <div className="tw-w-full tw-flex tw-mb-2">
                                    <span>Send Through :</span>
                                </div>

                                <div className="tw-w-full tw-flex tw-mb-4">
                                    {Array.isArray(statusOptionsCheckbox) &&
                                        statusOptionsCheckbox.map((item: any) => {
                                            return (
                                                <div key={item.id} className="tw-me-3">
                                                    <InputCheckbox
                                                    name={`${item.id}`}
                                                    formgroupClassName={twMerge("mb-0")}
                                                    labelName={item.name}
                                                    isDisabled={item.isDisabled}
                                                    value={Array.isArray(communicationModes) && communicationModes.includes(item.id) || false}
                                                    onChange={onChangeSendThroughHndlr}
                                                    dataId={item.id}
                                                />
                                                </div>
                                            );
                                        })}
                                </div>

                                <div className="tw-w-full">
                                    <TextInput
                                        name="title"
                                        value={addUserDefinedTemplate.values.title}
                                        onChange={onChangeFilterHndlr}
                                        inputClassName="tw-bg-gray-100"
                                        invalid={(addUserDefinedTemplate.touched.title && addUserDefinedTemplate.errors.title) ? true : false}
                                        error={(addUserDefinedTemplate.touched.title && addUserDefinedTemplate.errors.title) ? addUserDefinedTemplate.errors.title : ""}
                                        labelText='Title'
                                        maxLength={50}
                                        placeHolder='Enter Title'
                                        labelClass='required'
                                    />
                                </div>
                                    <div className="tw-w-full">
                                        <SelectInput
                                            name="category"
                                            value={addUserDefinedTemplate.values.category}
                                            onChange={onChangeFilterHndlr}
                                            menuItems={categoryOptions}
                                            valueKey="id"
                                            textKey="name"
                                            labelText='Category'
                                            labelClass=' required'
                                            defaultSelect='Select'
                                            invalid={(addUserDefinedTemplate.touched.category && addUserDefinedTemplate.errors.category) ? true : false}
                                            error={(addUserDefinedTemplate.touched.category && addUserDefinedTemplate.errors.category) ? addUserDefinedTemplate.errors.category : ""}
                                        />
                                    </div>

                                <div className="tw-w-full">
                                    {/* <Suspense fallback={<div>Loading...</div>} >
                                        <QuillEditor

                                            name="description"
                                            value={addUserDefinedTemplate.values.description}
                                            onChange={onChangeQuillHndlr}
                                            invalid={(addUserDefinedTemplate.touched.description && addUserDefinedTemplate.errors.description) ? true : false}
                                            error={(addUserDefinedTemplate.touched.description && addUserDefinedTemplate.errors.description) ? addUserDefinedTemplate.errors.description : ""}
                                            labelText="Description"
                                            labelClass='required'
                                        /> */}
                                        {/* <ReactQuill
                                            value={addUserDefinedTemplate.values.description}
                                            onChange={onChangeQuillHndlr}
                                            id={"description"}
                                            ref={quillRef}
                                        /> */}
                                    {/* </Suspense>                            */}
                                    <TextArea
                                        name='description'
                                        value={addUserDefinedTemplate.values.description}
                                        onChange={onChangeFilterHndlr}
                                        invalid={(addUserDefinedTemplate.touched.description && addUserDefinedTemplate.errors.description) ? true : false}
                                        error={(addUserDefinedTemplate.touched.description && addUserDefinedTemplate.errors.description) ? addUserDefinedTemplate.errors.description : ""}
                                        labelText='Description'
                                        labelClass='required'
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="tw-w-5/12 tw-px-3">
                            <div className="tw-flex tw-flex-wrap">
                                <div className="tw-w-full">
                                    <SelectInput
                                                name="recipientType"
                                                value={addUserDefinedTemplate.values.recipientType}
                                                onChange={onChangeFilterHndlr}
                                                menuItems={userTypeOptions}
                                                valueKey="id"
                                                textKey="name"
                                                labelText='User Type'
                                                labelClass=' required'
                                                defaultSelect='Select'
                                                invalid={(addUserDefinedTemplate.touched.recipientType && addUserDefinedTemplate.errors.recipientType) ? true : false}
                                                error={(addUserDefinedTemplate.touched.recipientType && addUserDefinedTemplate.errors.recipientType) ? addUserDefinedTemplate.errors.recipientType : ""}
                                            />
                                </div>

                                {addUserDefinedTemplate.values.recipientType === "STAFF" && (
                                    <>
                                        <div className="tw-w-full tw-mb-2 tw-px-3 tw-py-2 tw-border tw-border-gray-200">
                                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                                Staff
                                            </h4>
                                        </div>

                                        <div className="tw-w-full tw-flex tw-mb-3">
                                            {contactInfoStaff.map((item: any) => {
                                                return (
                                                    <InputCheckbox
                                                        name={`${item.id}`}
                                                        key={item.id}
                                                        formgroupClassName="tw-me-3"
                                                        labelName={item.name}
                                                        onChange={onSelectStaffHndlr}
                                                        value={
                                                            (Array.isArray(employeeCategory) &&
                                                                employeeCategory.includes(item.id)) ||
                                                            false
                                                        }
                                                        dataId={item.id}
                                                    />
                                                );
                                            })}
                                        </div>

                                        <div className="tw-w-full">
                                            <MultiSelectCheckbox
                                                name="employeeIds"
                                                labelText="Employee"
                                                containerClassName="tw-mb-3"
                                                idKey="id"
                                                value={addUserDefinedTemplate.values.employeeIds}
                                                renderValue={renderValueStaff}
                                                renderOptions={renderOptionsEmployee}
                                                onChange={selectStudentHndlr}
                                                onSearchHandler={onSearchMultiSelectHandleremployee}
                                                options={getEmployeesByFilterResp}
                                            />
                                        </div>
                                    </>
                                )}

                                {addUserDefinedTemplate.values.recipientType === "PARENT" && (
                                    <>
                                        <div className="tw-w-full tw-mb-2 tw-px-3 tw-py-2 tw-border tw-border-gray-200">
                                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                                Parent
                                            </h4>
                                        </div>

                                        <div className="tw-w-full tw-flex tw-mb-3">
                                            {statusOptionsParent.map((item: any) => {
                                                return (
                                                    <InputCheckbox
                                                                key={item.id}
                                                                formgroupClassName='tw-me-3'
                                                                name={`${item.id}`}
                                                                labelName={item.name}
                                                                value={Array.isArray(parentCategory) && parentCategory.includes(item.id) || false}
                                                                onChange={onSelectParentHndlr}
                                                                dataId={item.id}
                                                            />
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {addUserDefinedTemplate.values.recipientType === "PARENT" && (
                                    <>
                                        <div className="tw-w-full">
                                            <RadioInputContainer
                                                name="studentType"
                                                labelText="Student Type"
                                                inputContainerClassName="tw-mt-1"
                                                radioOptions={studentTypeOptions}
                                                value={addUserDefinedTemplate.values.studentType}
                                                onChange={addUserDefinedTemplate.handleChange}
                                            />
                                        </div>

                                        {studentType === "all-student" && (
                                            <div className="tw-w-full tw-mb-3">
                                                <CurriculumSelectorProvider.Provider
                                                    value={{ selectTreeRowHndlr }}
                                                >
                                                    <TreeComponent
                                                        isAllSelected={isAllSelected}
                                                        selecteAllHndlr={selecteAllHndlr}
                                                        curriculumClass={curriculumState}
                                                    />
                                                </CurriculumSelectorProvider.Provider>
                                            </div>
                                        )}

                                        {studentType === "selected-student" && (
                                            <div className="tw-w-full">
                                                <MultiSelectCheckbox
                                                    name="studentIds"
                                                    labelText="Students"
                                                    containerClassName="tw-mb-3"
                                                    idKey="id"
                                                    value={addUserDefinedTemplate.values.studentIds}
                                                    renderValue={renderValueStudent}
                                                    renderOptions={renderOptionsStudent}
                                                    onChange={selectStudentHndlr}
                                                    onSearchHandler={onSearchMultiSelectHandler}
                                                    options={getStudentsByFilterResp}
                                                />
                                            </div>
                                        )}
                                            {studentType === "manual-entry" && (
                                                <>
                                                    <div className="tw-w-full">

                                                    <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                                                        <div className=" tw-form-label required">
                                                            Students
                                                        </div>
                                                        <div className=" tw-text-right">
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
                                                    </div>

                                                    {studentCodeCount <= 1 && !(hasValidateResp && validCount === 0) && (
                                                        <div className="tw-text-sm tw-text-gray-500 tw-mt-1">
                                                            <span className="tw-font-semibold">Note:</span> Enter student codes separated by commas.
                                                            <br />
                                                            <span className="tw-text-gray-500">
                                                                Example: <code>1234, 12345, 1234567</code>
                                                            </span>
                                                        </div>
                                                    )}

                                                    {hasValidateResp && (
                                                        <>
                                                            {validCount > 0 ? (
                                                                <div className="tw-bg-white tw-overflow-hidden tw-mt-2">
                                                                    <TableContainer
                                                                        columns={columns}
                                                                        data={validatedStudents}
                                                                        showPagination={false}
                                                                        showCheckbox={false}
                                                                        tableClass="tw-mb-0"
                                                                        divClass="tw-border tw-border-gray-200 tw-rounded-xl tw-max-h-[400px] tw-overflow-auto"
                                                                        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle tw-sticky tw-top-0"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="tw-flex tw-items-center tw-justify-center tw-h-[120px] tw-bg-gray-50 tw-border tw-border-dashed tw-border-gray-300 tw-rounded-xl">
                                                                    <p className="tw-text-sm tw-text-gray-600 tw-mb-0 tw-flex tw-items-center tw-gap-2">
                                                                        <span>
                                                                            No records are valid. Please correct the student codes and validate again.
                                                                        </span>
                                                                        <RejectSvg fill="#f06548" width={"20px"} height="20px" />
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="tw-w-full">
                            <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mb-1">
                                <Button
                                    type="button"
                                    variant='secondary'
                                    onClick={props.toggle}
                                >
                                    Close
                                </Button>

                                {studentType === "manual-entry" && !canUseSelection ? (
                                        <Button
                                            type="button"
                                            variant='info'
                                            onClick={validateManualStudents}
                                            disabled={showApiLoader || !hasStudentCodes}
                                        >
                                            Validate
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={showApiLoader}
                                        >
                                            Save
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default ComposeModal