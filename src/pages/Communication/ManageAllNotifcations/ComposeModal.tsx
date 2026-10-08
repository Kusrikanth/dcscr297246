import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { InputCheckbox, MultiSelectCheckbox, QuillEditor, RadioInputContainer, SelectInput, TextArea, TextInput, UploadFileCommunication } from '../../../Components/Common'
import { useFormik } from 'formik';
import {
    userTypeOptions, statusOptionsCheckbox, statusOptionsParent, statusOptionsStaff, studentTypeOptions, CurriculumSelectorProvider,
    renderOptionsStudent, renderValueStudent,
    renderValueStaff,
    renderOptionsEmployee,
    generateValidateStudentsColumns,
    categoryOptions,
    isDraftNotification,
    NOTIFICATION_STATUS,
    ATTACHMENT_ACCEPT,
    validateAttachment
} from './helper';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { getStudentByFilterAct } from '../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';
import TreeComponent from './TreeComponent';
import { composeMessageAct, resetWhatsAppNotificationValidateStudentsAct, updateNotificationAct, uploadWhatsappMediaAct, whatsAppNotifcationValidateStudentsAct } from '../../../store/communication/communicationactions';
import { toast } from 'react-toastify';
import { Employee, Student } from './ManageAllNotifcationsTypes';
import { getEmployeeByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementactions';
import * as Yup from "yup";
import { twMerge } from 'tailwind-merge';
import TableContainer from '../../../Components/Common/TableContainer';
import { default as RejectSvg } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import Button from '../../../Components/Common/Button';

const initialValues: any = {
    title: "",
    description: "",
    // New messages default to Parents via the Mobile App, the most common case.
    recipientType: "PARENT",
    category: "",
    studentType: "all-student",
    employeeIds: [],
    studentIds: [],
    communicationModes: ["mobileApp"],
    employeeCategory: [],
    parentCategory: ["father", "mother"],
    attachmentName: "",
    attachmentId: undefined,
};

const stripHtml = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return (tempDiv.textContent || tempDiv.innerText || '').trim();
};

// Toolbar for the description editor: inline formatting, lists and links only
const descriptionEditorModules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
    ],
};
const descriptionEditorFormats = ['bold', 'italic', 'underline', 'strike', 'list', 'link'];

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string()
        .required('Description is required')
        .test('not-empty-html', 'Description is required', (value) => !!value && stripHtml(value).length > 0),
    recipientType: Yup.string().required('User Type is required'),
    category: Yup.string().required('Category is required'),
});

// A draft only needs a title so it can be identified in the list; everything else is checked on Send.
const draftValidationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
});

type SubmitAction = 'SEND' | 'DRAFT' | 'SAVE';

/** The attachment already saved on a message being edited, if any. */
const getRecordAttachment = (record: any) => {
    const file = Array.isArray(record?.files) ? record.files[0] : undefined;
    const attachmentId = file?.id ?? (Array.isArray(record?.filesIds) ? record.filesIds[0] : undefined);
    if (!attachmentId) return { attachmentId: undefined, attachmentName: '' };
    return { attachmentId, attachmentName: file?.originalFileName || file?.fileName || file?.name || 'Attached file' };
};

const sortedIds = (list: any) => (Array.isArray(list) ? list.map((item: any) => item?.id ?? item).map(String).sort() : []);

/** The editable parts of the form, normalised so two snapshots can be compared for changes. */
const toComparableValues = (values: any) => JSON.stringify({
    title: values.title || '',
    description: values.description || '',
    category: values.category || '',
    recipientType: values.recipientType || '',
    studentType: values.studentType || '',
    studentCodes: values.studentCodes || '',
    communicationModes: sortedIds(values.communicationModes),
    parentCategory: sortedIds(values.parentCategory),
    employeeCategory: sortedIds(values.employeeCategory),
    studentIds: sortedIds(values.studentIds),
    employeeIds: sortedIds(values.employeeIds),
    attachmentId: values.attachmentId ?? '',
});

const ComposeModal = (props: any) => {
    // When a record is passed in, the modal edits that message instead of composing a new one.
    const editRecord = props.modalData;
    const isEditMode = Boolean(editRecord?.id);
    // Drafts keep the Send / Save as Draft choice; already-sent messages can only be saved.
    const isDraft = isEditMode && isDraftNotification(editRecord);
    const isSentEdit = isEditMode && !isDraft;
    // A sent message's attachment can't be added or changed; an existing one is only shown.
    const sentAttachmentName = isSentEdit ? getRecordAttachment(editRecord).attachmentName : '';
    const submitActionRef = useRef<SubmitAction>(isSentEdit ? 'SAVE' : 'SEND');
    // Form values right after prefilling a sent message; Save stays disabled until they differ.
    const [baselineValues, setBaselineValues] = useState<any>(null);
    const [curriculumState, setCurriculumState] = useState<any>([]);
    const [contactInfoStaff, setContactInfoStaff] = useState(statusOptionsStaff);
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
        updateNotificationResp,
        getEmployeesByFilterResp,
        whatsAppNotificationValidateStudentsResp,
        uploadWhatsappMediaResp,
        communicationErrorResp
    } = useAppSelector(({ appData, directoryStudent, instAcademics, globalData, communication, directoryEmployee }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        showApiLoader: globalData.showApiLoader,
        getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
        curriculumClassSectResp: communication.curriculumClassSectResp,
        composeMessageResp: communication.composeMessageResp,
        updateNotificationResp: communication.updateNotificationResp,
        getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
    whatsAppNotificationValidateStudentsResp: communication.whatsAppNotificationValidateStudentsResp,
        uploadWhatsappMediaResp: communication.uploadWhatsappMediaResp,
        communicationErrorResp: communication.communicationErrorResp,
  }), shallowEqual);

    // True between picking an attachment and the upload call settling.
    const isUploadingRef = useRef(false);

    // Surface failed send / draft / update calls; otherwise the modal just stays open with no feedback.
    const errorRespRef = useRef({ prevCommunicationErrorResp: communicationErrorResp });
    useEffect(() => {
        if (communicationErrorResp && errorRespRef.current.prevCommunicationErrorResp !== communicationErrorResp) {
            const { details, message, error }: any = communicationErrorResp;
            if (isUploadingRef.current) {
                // The attachment never reached the server, so don't leave its name showing as if it had.
                isUploadingRef.current = false;
                removeAttachmentHndlr();
                toast.error(details || message || error || 'Unable to upload the attachment.');
            } else {
                const fallback = submitActionRef.current === 'DRAFT' ? 'Unable to save the draft.' : 'Something went wrong.';
                toast.error(details || message || error || fallback);
            }
        }
        errorRespRef.current.prevCommunicationErrorResp = communicationErrorResp;
    }, [communicationErrorResp]);

    const composeModalRespRef = useRef({ prevComposeMessageResp: composeMessageResp })
    useEffect(() => {
        const { prevComposeMessageResp } = composeModalRespRef.current;
        if (composeMessageResp && prevComposeMessageResp !== composeMessageResp) {
            toast.success(submitActionRef.current === 'DRAFT' ? 'Message saved as draft.' : 'Message sent successfully.');
            props.toggleModal(true);
        }
        composeModalRespRef.current.prevComposeMessageResp = composeMessageResp;
    }, [composeMessageResp]);

      const manualStudentIds = useMemo(() => {
        return whatsAppNotificationValidateStudentsResp?.data?.data?.map((item: any) => item?.studentId) || [];
      }, [whatsAppNotificationValidateStudentsResp]);
    
    const addUserDefinedTemplate = useFormik({
        initialValues: initialValues,
        validationSchema: () => (submitActionRef.current === 'DRAFT' ? draftValidationSchema : validationSchema),
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
                status:submitActionRef.current === 'DRAFT' ? NOTIFICATION_STATUS.DRAFT : NOTIFICATION_STATUS.SENT,
            }

            // Sent messages keep whatever attachment they went out with, so only new messages and drafts carry one.
            if (!isSentEdit) {
                payload.filesIds = values.attachmentId ? [values.attachmentId] : [];
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
            if (isEditMode) {
                // Keep the original recipients unless new ones were picked in this session.
                const hasNewStudentSelection = selectedSectionIds.length > 0 || studentIds.length > 0 || manualStudentIds.length > 0;
                if (values.recipientType === 'PARENT' && !hasNewStudentSelection && editRecord.parentDetails) {
                    payload.parentDetails = editRecord.parentDetails;
                } else if (values.recipientType === 'STAFF' && employeeIds.length === 0 && editRecord.staffDetails) {
                    payload.staffDetails = { ...editRecord.staffDetails, categories: values.employeeCategory };
                }
                dispatch(updateNotificationAct(generateActionPayload("update_notification", { id: editRecord.id }, { ...payload, id: editRecord.id })));
            } else {
                dispatch(composeMessageAct(generateActionPayload("compose_message", undefined, payload)));
            }
        },
    });

    const updateRespRef = useRef({ prevUpdateNotificationResp: updateNotificationResp });
    useEffect(() => {
        if (updateNotificationResp && updateRespRef.current.prevUpdateNotificationResp !== updateNotificationResp) {
            const successMessages: Record<SubmitAction, string> = {
                DRAFT: 'Draft updated successfully.',
                SEND: 'Message sent successfully.',
                SAVE: 'Notification updated successfully.',
            };
            toast.success(successMessages[submitActionRef.current]);
            props.toggleModal(true);
        }
        updateRespRef.current.prevUpdateNotificationResp = updateNotificationResp;
    }, [updateNotificationResp]);

    const uploadRespRef = useRef({ prevUploadWhatsappMediaResp: uploadWhatsappMediaResp });
    useEffect(() => {
        if (uploadWhatsappMediaResp && uploadRespRef.current.prevUploadWhatsappMediaResp !== uploadWhatsappMediaResp && isUploadingRef.current) {
            isUploadingRef.current = false;
            addUserDefinedTemplate.setFieldValue('attachmentId', uploadWhatsappMediaResp?.id);
        }
        uploadRespRef.current.prevUploadWhatsappMediaResp = uploadWhatsappMediaResp;
    }, [uploadWhatsappMediaResp]);

    // Prefill the form from the record being edited.
    useEffect(() => {
        if (!editRecord) return;
        const modeIds = statusOptionsCheckbox.map((option: any) => option.id);
        const communicationModes = (Array.isArray(editRecord.communicationModes) ? editRecord.communicationModes : [])
            .map((mode: string) => modeIds.find((id: string) => id.toLowerCase() === String(mode).toLowerCase()) || mode);
        const recipientType = editRecord.recipientType || (editRecord.parentDetails ? 'PARENT' : editRecord.staffDetails ? 'STAFF' : '');
        const prefilledValues = {
            ...addUserDefinedTemplate.values,
            title: editRecord.title || '',
            description: editRecord.description || '',
            category: editRecord.category || '',
            communicationModes,
            recipientType,
            parentCategory: Array.isArray(editRecord.parentDetails?.categories)
                ? editRecord.parentDetails.categories
                : (recipientType === 'PARENT' ? ['father', 'mother'] : []),
            employeeCategory: Array.isArray(editRecord.staffDetails?.categories)
                ? editRecord.staffDetails.categories
                : (recipientType === 'STAFF' ? ['admin', 'nonTeaching'] : []),
            studentType: recipientType === 'PARENT' ? 'all-student' : '',
            ...getRecordAttachment(editRecord),
        };
        addUserDefinedTemplate.setValues(prefilledValues);
        setBaselineValues(prefilledValues);
    }, [editRecord]);

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
            addUserDefinedTemplate.setFieldValue('communicationModes', [...communicationModes, name]);
        } else {
            addUserDefinedTemplate.setFieldValue('communicationModes', communicationModes.filter((item: any) => item !== name));
        }
    }

    function onSelectParentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target;
        const { parentCategory } = addUserDefinedTemplate.values;
        if (checked) {
            addUserDefinedTemplate.setFieldValue('parentCategory', [...parentCategory, name]);
        } else {
            addUserDefinedTemplate.setFieldValue('parentCategory', parentCategory.filter((item: any) => item !== name));
        }
    }

    function onSelectStaffHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target
        const { employeeCategory } = addUserDefinedTemplate.values;
        if (checked) {
            addUserDefinedTemplate.setFieldValue('employeeCategory', [...employeeCategory, name]);
        } else {
            addUserDefinedTemplate.setFieldValue('employeeCategory', employeeCategory.filter((item: any) => item !== name));
        }
    }

    const onChangeQuillHndlr = (content: any, _delta?: any, source?: string) => {
        addUserDefinedTemplate.setValues((prevState: any) => ({ ...prevState, description: content }));
        // Quill re-serialises the prefilled HTML on load; that is not a user edit, so move the baseline with it.
        if (source !== 'user') {
            setBaselineValues((prevBaseline: any) => (prevBaseline ? { ...prevBaseline, description: content } : prevBaseline));
        }
    }

    // Uploads the picked file straight away so Send only has to pass its id along.
    function onChangeAttachmentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.currentTarget.files?.[0];
        if (!file) return;
        const result = validateAttachment(file);
        if (!result.valid) {
            event.currentTarget.value = '';
            toast.error(result.message);
            return;
        }
        addUserDefinedTemplate.setValues((prev: any) => ({ ...prev, attachmentName: file.name, attachmentId: undefined }));
        const formData = new FormData();
        formData.append('file', file);
        isUploadingRef.current = true;
        dispatch(uploadWhatsappMediaAct(generateActionPayload('upload_whatsapp_media', { branchId: props.branchId, mediaType: result.mediaType }, formData)));
    }

    function removeAttachmentHndlr() {
        addUserDefinedTemplate.setValues((prev: any) => ({ ...prev, attachmentName: '', attachmentId: undefined }));
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

    // A sent message can only be saved once something differs from what was loaded, including a new recipient selection.
    const hasSectionSelection = curriculumState.some((curriculum: any) =>
        curriculum.classes?.some((cls: any) => cls.sections?.some((section: any) => section.isSelected)));
    const hasEdits = !baselineValues
        || toComparableValues(addUserDefinedTemplate.values) !== toComparableValues(baselineValues)
        || hasSectionSelection
        || manualStudentIds.length > 0;

    function submitWithAction(action: SubmitAction) {
        if (isUploadingRef.current) {
            toast.info('Please wait for the attachment to finish uploading.');
            return;
        }
        submitActionRef.current = action;
        addUserDefinedTemplate.submitForm();
    }

        return (
        <>
            {/* Submission only happens through the footer buttons, so Enter in a field never sends a message. */}
            <form onSubmit={(event) => event.preventDefault()}>
                <div style={{ padding: "1.25rem" }}>
                    <div className="tw-flex tw-flex-wrap">
                        {/* First row: how, to whom and what kind of message */}
                        <div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-x-6 tw-px-3">
                            <div className="tw-mb-3">
                                <div className="tw-mb-2">Send Through :</div>
                                <div className="tw-flex tw-items-center tw-min-h-[38px]">
                                    {Array.isArray(statusOptionsCheckbox) &&
                                        // Channels that can't be picked are hidden, unless an existing message already uses one.
                                        statusOptionsCheckbox
                                        .filter((item: any) => !item.isDisabled || (Array.isArray(communicationModes) && communicationModes.includes(item.id)))
                                        .map((item: any) => {
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
                            </div>
                            <div>
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
                            <div>
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
                        </div>

                        <div className="tw-w-7/12 tw-px-3">
                            <div className="tw-flex tw-flex-wrap">
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
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <QuillEditor
                                            name="description"
                                            value={addUserDefinedTemplate.values.description}
                                            onChange={onChangeQuillHndlr}
                                            onBlur={() => addUserDefinedTemplate.setFieldTouched('description', true)}
                                            modules={descriptionEditorModules}
                                            formats={descriptionEditorFormats}
                                            placeHolder="Enter Description"
                                            invalid={(addUserDefinedTemplate.touched.description && addUserDefinedTemplate.errors.description) ? true : false}
                                            error={(addUserDefinedTemplate.touched.description && addUserDefinedTemplate.errors.description) ? addUserDefinedTemplate.errors.description : ""}
                                            labelText="Description"
                                            labelClass='required'
                                        />
                                    </Suspense>
                                </div>

                                {isSentEdit ? (
                                    sentAttachmentName && (
                                        <div className="tw-w-full tw-mb-3">
                                            <div className="tw-font-medium tw-text-[15px] tw-mb-2">Attachment</div>
                                            <h6 className="tw-text-gray-500 tw-mb-0 tw-font-medium">{sentAttachmentName}</h6>
                                        </div>
                                    )
                                ) : (
                                    <div className="tw-w-full">
                                        <UploadFileCommunication
                                            name="attachment"
                                            labelText="Attachment"
                                            value={addUserDefinedTemplate.values.attachmentName}
                                            onChange={onChangeAttachmentHndlr}
                                            removeFileHandler={removeAttachmentHndlr}
                                            acceptFileFormat={ATTACHMENT_ACCEPT}
                                            isDisabled={showApiLoader}
                                            hideUploadBtn
                                            canRemove
                                            helperText="PDF (max 10MB) or JPG / PNG image (max 5MB)."
                                        />
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="tw-w-5/12 tw-px-3">
                            <div className="tw-flex tw-flex-wrap">

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
                                {isEditMode && (
                                    <span className="tw-self-center tw-mr-auto tw-text-xs tw-text-gray-500">
                                        Recipients of the original message are kept unless you make a new selection.
                                    </span>
                                )}
                                <Button
                                    type="button"
                                    variant='secondary'
                                    onClick={props.toggle}
                                >
                                    Close
                                </Button>

                                {!isSentEdit && (
                                    <Button
                                        type="button"
                                        variant='secondary'
                                        onClick={() => submitWithAction('DRAFT')}
                                        disabled={showApiLoader}
                                    >
                                        Save as Draft
                                    </Button>
                                )}

                                {studentType === "manual-entry" && !canUseSelection ? (
                                        <Button
                                            type="button"
                                            variant='info'
                                            onClick={validateManualStudents}
                                            disabled={showApiLoader || !hasStudentCodes}
                                        >
                                            Validate
                                        </Button>
                                    ) : isSentEdit ? (
                                        <Button
                                            variant="primary"
                                            type="button"
                                            onClick={() => submitWithAction('SAVE')}
                                            disabled={showApiLoader || !hasEdits}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            type="button"
                                            onClick={() => submitWithAction('SEND')}
                                            disabled={showApiLoader}
                                        >
                                            Send
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