import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { InputCheckbox, MultiSelectCheckbox, QuillEditor, RadioInputContainer, SelectInput, TextArea, TextInput } from '../../../Components/Common'
import { useFormik } from 'formik';
import {
    userTypeOptions, statusOptionsCheckbox, statusOptionsParent, statusOptionsStaff, studentTypeOptions, CurriculumSelectorProvider,
    renderOptionsStudent, renderValueStudent,
    renderValueStaff,
    renderOptionsEmployee
} from './helper';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { getStudentByFilterAct } from '../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';
import TreeComponent from './ComposeMessage/TreeComponent';
import { composeMessageAct, getWhatsappTemplatesAct, sendWhatsappMessageAct } from '../../../store/communication/communicationactions';
import { toast } from 'react-toastify';
import { getEmployeeByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementactions';
import * as Yup from "yup";
import { twMerge } from 'tailwind-merge';
import { getInstBranchesAct } from '../../../store/mastersettings/branch/branchactions';
import { toPascalCase } from '../../../utility/commonutility';
// import ReactQuill from 'react-quill';

const initialValues: any = {
    templateId: "",
    templateName: "",
    templateMessage: "",
    msgBody: "",
    recipientType: "PARENT",
    studentType: "all-student",
    employeeIds: [],
    studentIds: [],
    communicationModes: ["WhatsApp"],
    employeeCategory: [],
    parentCategory: ["primaryContact"],
};

const validationSchema = Yup.object({
    templateName: Yup.string().required('Title is required'),
    msgBody: Yup.string().required('Description is required'),
    recipientType: Yup.string().required('User Type is required'),
});

const ComposeModal = (props: any) => {
    const [curriculumState, setCurriculumState] = useState<any>([]);
    const [contactInfoStaff, setContactInfoStaff] = useState(statusOptionsStaff);
    // const quillRef = useRef<ReactQuill | null>(null);

    const dispatch = useAppDispatch();

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        branchListResp,
        curriculumClassSectResp,
        getStudentsByFilterResp,
        whatsappTemplatesResp,
        sendWhatsappMessageResp,
        getEmployeesByFilterResp
    } = useAppSelector(({ appData, branch, directoryStudent, instAcademics, globalData, communication, directoryEmployee }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        showApiLoader: globalData.showApiLoader,
        branchListResp: branch.branchListResp,
        getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
        curriculumClassSectResp: communication.curriculumClassSectResp,
        whatsappTemplatesResp: communication.whatsappTemplatesResp,
        sendWhatsappMessageResp: communication.sendWhatsappMessageResp,
        getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
    }), shallowEqual);

    const composeModalRespRef = useRef({ prevSendWhatsappMessageResp: sendWhatsappMessageResp })
    useEffect(() => {
        const { prevSendWhatsappMessageResp } = composeModalRespRef.current;
        if (sendWhatsappMessageResp && prevSendWhatsappMessageResp !== sendWhatsappMessageResp) {
            toast.success('Message Sent Successfully.');
            props.toggleModal(true);
        }
        composeModalRespRef.current.prevSendWhatsappMessageResp = sendWhatsappMessageResp;
    }, [sendWhatsappMessageResp]);

    useEffect(() => {
        if (branchId) {
            dispatch(getWhatsappTemplatesAct(generateActionPayload("whatsapp_templates", { branchId })));
        }
    }, [branchId]);
    useEffect(() => {
        if (instituteId) {
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, {
                pageSize: 100, pageNo: 0, instituteId,
            })));
        }

    }, [instituteId]);


    const branchInfo = useMemo(() => {
        const { data = [] } = branchListResp || {};
        return data.find((branch: any) => branch.branchId === +branchId);
    }, [branchListResp, instituteId, branchId]);

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
            if (values.studentIds.length > 0) {
                const studentId = values.studentIds.map((student: any) => student.id);
                studentIds.push(...studentId);
            }

            if (values.employeeIds.length > 0) {
                const employeeId = values.employeeIds.map((employee: any) => employee.id);
                employeeIds.push(...employeeId);
            }
            const payload: any = {
                instituteId: props.instituteId,
                branchId: props.branchId,
                module: 'FEE',
                templateName: values.templateName,
                msgBody: values.msgBody.replace(/[\r\n]+/g, " "), // Replace multiple newlines with a single space
                communicationModes: values.communicationModes,
                recipientType: values.recipientType,
                pageNo: 0,
                pageSize: 50000
            }

            if (values.recipientType === 'PARENT') {
                if (studentType === 'all-student') {
                    payload.parentDetails = {
                        sections: selectedSectionIds,
                        studentIds: [],
                    };
                }
                else {
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
            dispatch(sendWhatsappMessageAct(generateActionPayload("send_whatsapp_message", undefined, payload)));
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
                    parentCategory: ['primaryContact'],
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
        } else if (name == 'templateId') {
            const { templateMsg = '', templateName = '' } = whatsappTemplatesResp?.find((item: any) => item.templateId === value.toString()) || {};
            addUserDefinedTemplate.setValues((prev: any) => ({
                ...prev, templateMessage: templateMsg,
                templateName,
                [name]: value
            }));
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
        addUserDefinedTemplate.setValues((prevState: any) => ({ ...prevState, msgBody: content }));
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
                pageNo: 0, pageSize: 50
            })));
        }

    }

    function onSearchMultiSelectHandleremployee(name: any, value: string) {
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

    const formattedTemplateMessage = React.useMemo(() => {
        let message = addUserDefinedTemplate.values.templateMessage || "";
        message = message.replace(/{{\s*1\s*}}/g, toPascalCase(addUserDefinedTemplate.values.recipientType));
        message = message.replace(/{{\s*2\s*}}/g, toPascalCase(branchInfo?.branchName));
        message = message.replace(/{{\s*3\s*}}/g, addUserDefinedTemplate.values.msgBody || "");
        return message;
    }, [
        addUserDefinedTemplate.values.templateMessage,
        addUserDefinedTemplate.values.recipientType,
        branchInfo?.branchName,
        addUserDefinedTemplate.values.msgBody
    ]);

    return (
        <>
            <form onSubmit={addUserDefinedTemplate.handleSubmit}>
                <div className="tw-p-5">

                    {/* Main Grid */}
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">

                        {/* LEFT SIDE */}
                        <div className="tw-space-y-4">

                            {/* Send Through */}
                            <div>
                                <div className="tw-mb-2 tw-font-medium">
                                    Send Through :
                                </div>

                                <div className="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
                                    {Array.isArray(statusOptionsCheckbox) &&
                                        statusOptionsCheckbox.map((item: any) => (
                                            <InputCheckbox
                                                key={item.id}
                                                name={`${item.id}`}
                                                formgroupClassName="tw-mb-0"
                                                labelName={item.name}
                                                isDisabled={item.isDisabled}
                                                value={
                                                    (Array.isArray(communicationModes) &&
                                                        communicationModes.includes(item.id)) ||
                                                    false
                                                }
                                                onChange={onChangeSendThroughHndlr}
                                                dataId={item.id}
                                            />
                                        ))}
                                </div>
                            </div>

                            {/* Template */}
                            <SelectInput
                                name="templateId"
                                value={addUserDefinedTemplate.values.templateId}
                                onChange={onChangeFilterHndlr}
                                inputClassName="tw-bg-gray-100"
                                invalid={
                                    addUserDefinedTemplate.touched.templateId &&
                                        addUserDefinedTemplate.errors.templateId
                                        ? true
                                        : false
                                }
                                error={
                                    addUserDefinedTemplate.touched.templateId &&
                                        addUserDefinedTemplate.errors.templateId
                                        ? addUserDefinedTemplate.errors.templateId
                                        : ""
                                }
                                menuItems={whatsappTemplatesResp}
                                labelText="Template"
                                labelClass="required"
                                valueKey="templateId"
                                textKey="templateName"
                            />

                            {/* Description */}
                            <TextArea
                                name="msgBody"
                                labelClass="required"
                                labelText="Description"
                                placeHolder="Enter Description"
                                height="160px"
                                maxLength={1024}
                                showRemainingChars
                                value={addUserDefinedTemplate.values.msgBody}
                                onChange={addUserDefinedTemplate.handleChange}
                                invalid={
                                    addUserDefinedTemplate.touched.msgBody &&
                                        addUserDefinedTemplate.errors.msgBody
                                        ? true
                                        : false
                                }
                                error={
                                    addUserDefinedTemplate.touched.msgBody &&
                                        addUserDefinedTemplate.errors.msgBody
                                        ? addUserDefinedTemplate.errors.msgBody
                                        : ""
                                }
                            />

                            {/* Preview */}
                            {addUserDefinedTemplate.values.templateMessage && (
                                <div>
                                    <label className="tw-font-semibold tw-mb-1 tw-block">
                                        Preview:
                                    </label>
                                    <pre className="tw-whitespace-pre-wrap tw-break-words tw-bg-gray-100 tw-p-3 tw-rounded-lg tw-text-sm">
                                        {formattedTemplateMessage}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="tw-space-y-4">

                            {/* User Type */}
                            <SelectInput
                                name="recipientType"
                                value={addUserDefinedTemplate.values.recipientType}
                                onChange={onChangeFilterHndlr}
                                menuItems={userTypeOptions}
                                valueKey="id"
                                textKey="name"
                                labelText="User Type"
                                labelClass="required"
                                defaultSelect="Select"
                                invalid={
                                    addUserDefinedTemplate.touched.recipientType &&
                                        addUserDefinedTemplate.errors.recipientType
                                        ? true
                                        : false
                                }
                                error={
                                    addUserDefinedTemplate.touched.recipientType &&
                                        addUserDefinedTemplate.errors.recipientType
                                        ? addUserDefinedTemplate.errors.recipientType
                                        : ""
                                }
                            />

                            {/* STAFF */}
                            {addUserDefinedTemplate.values.recipientType === "STAFF" && (
                                <>
                                    <div className="tw-bg-gray-50 tw-px-4 tw-py-2 tw-rounded-lg tw-font-semibold">
                                        Staff
                                    </div>

                                    <div className="tw-flex tw-flex-wrap tw-gap-4">
                                        {contactInfoStaff.map((item: any) => (
                                            <InputCheckbox
                                                key={item.id}
                                                name={`${item.id}`}
                                                labelName={item.name}
                                                formgroupClassName="tw-mb-0"
                                                onChange={onSelectStaffHndlr}
                                                value={
                                                    (Array.isArray(employeeCategory) &&
                                                        employeeCategory.includes(item.id)) ||
                                                    false
                                                }
                                                dataId={item.id}
                                            />
                                        ))}
                                    </div>

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
                                </>
                            )}

                            {/* PARENT */}
                            {addUserDefinedTemplate.values.recipientType === "PARENT" && (
                                <>
                                    <div className="tw-bg-gray-50 tw-px-4 tw-py-2 tw-rounded-lg tw-font-semibold">
                                        Parent
                                    </div>

                                    <div className="tw-flex tw-flex-wrap tw-gap-4">
                                        {statusOptionsParent.map((item: any) => (
                                            <InputCheckbox
                                                key={item.id}
                                                name={`${item.id}`}
                                                labelName={item.name}
                                                formgroupClassName="tw-mb-0"
                                                value={
                                                    (Array.isArray(parentCategory) &&
                                                        parentCategory.includes(item.id)) ||
                                                    false
                                                }
                                                onChange={onSelectParentHndlr}
                                                dataId={item.id}
                                            />
                                        ))}
                                    </div>

                                    <RadioInputContainer
                                        name="studentType"
                                        labelText="Student Type"
                                        inputContainerClassName="tw-mt-2"
                                        radioOptions={studentTypeOptions}
                                        value={addUserDefinedTemplate.values.studentType}
                                        onChange={addUserDefinedTemplate.handleChange}
                                    />

                                    {studentType === "all-student" && (
                                        <div className="tw-mt-3">
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
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-8">
                        <button
                            type="button"
                            className="tw-bg-gray-100 tw-text-gray-700 tw-px-5 tw-py-2 tw-rounded-lg hover:tw-bg-gray-200"
                            onClick={props.toggle}
                        >
                            Close
                        </button>

                        <button
                            type="submit"
                            className="tw-bg-green-600 tw-text-white tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-green-700 tw-transition-all"
                            disabled={showApiLoader}
                        >
                            Save
                        </button>
                    </div>

                </div>
            </form>
        </>
    )
}

export default ComposeModal