import React, { Suspense, useEffect, useRef, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { BrowseFile, CustomSelect, DateInput, InputCheckbox, ModalContainerUpdated, MultipleFileUpload, MultiSelectCheckbox, QuillEditor, RadioInputContainer, SelectInput, TextArea, TextInput, TextInputGroup } from '../../../../Components/Common'
import { useFormik } from 'formik';
import { createEventPayload, eventStatus, renderOptionsEmployee, renderOptionsStudent, renderValueSection, renderValueStaff, renderValueStudent, statusOptionsParent, statusOptionsStaff, studentTypeOptions, userTypeOptions } from './helper';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { useHistory, useLocation } from 'react-router-dom';
import { useModal } from '../../../../hooks/modalhook';
import { getLocalStorage } from '../../../../utility/storageUtility';
import { getCurriculumClassSectAct, getEventByIdAct, saveEventAct, setEventByIdAct, updateEventAct } from '../../../../store/communication/communicationactions';
import { convertToFullTime } from '../../../../utility/dateutility';
import { Class, CurriculumItem, Employee, FileDto, Location, Section, Student } from './addEventTypes';
import LocationSelectorModal from '../LocationSelectorModal';
import TreeComponent from '../../ManageAllNotifcations/TreeComponent';
import { CurriculumSelectorProvider } from '../../ManageAllNotifcations/helper';
import { getStudentByFilterAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { getEmployeeByFilterAct, setEmployeesByFilterAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';
import Button from '../../../../Components/Common/Button';


const initialValues = {
    title: "",
    academicYearId: "",
    description: "",
    eventType: "",
    iconImage: "",
    displayImage: "",
    file1: null as File | null,
    file2: null as File | null,
    startDate: "",
    endDate: "",
    tags: "",
    contactPerson: "",
    contactPhone: "",
    document: [],
    routeId: "",
    location: "",
    latitude: "",
    longitude: "",
    eventStatus: "",
    organizedBy: "",
    recipientType: "",
    studentType: "",
    employeeIds: [],
    studentIds: [] ,
    employeeCategory: [] as string[],
    parentCategory: [] as string[],
    isPublished: false,
    isAllowedComments: false
};
const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    eventType: Yup.string().max(50, 'Event Type must be at most 50 characters').required('Event Type is required'),
    eventStatus: Yup.string().required('Event Status is required'),
    displayImage: Yup.mixed().required('Display Image is required'),
    startDate: Yup.date().required('Start Date is required'),
    endDate: Yup.date().min(Yup.ref('startDate'), 'End Date cannot be before Start Date').required('End Date is required'),
    tags: Yup.string().max(50, 'Tags must be at most 50 characters').required('Tags are required'),
    location: Yup.string().required('Location is required'),
    recipientType: Yup.string().required('Recipient Type is required'),
});
const AddEvent = () => {

    const [document, setDocument] = useState([]);
    const { modalState: mapModalState, closeModal: closeMapModalHndlr,
        openModal: openMapModalHndlr
    } = useModal();
    const selectedLocation = useRef<Location | null>(null);
    const [contactInfoStaff, setContactInfoStaff] = useState(statusOptionsStaff);
    const [curriculumState, setCurriculumState] = useState<Array<CurriculumItem>>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const dispatch = useDispatch()
    const history = useHistory();
    const location:any = useLocation();

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        getEmployeesByFilterResp,
        saveEventResp,
        communicationErrorResp,
        getEventByIdResp,
        updateEventResp,
        getStudentsByFilterResp,
        curriculumClassSectResp,

    } =
        useAppSelector(({ appData, directoryEmployee, instAcademics, globalData, communication, directoryStudent }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            saveEventResp: communication.saveEventResp,
            communicationErrorResp: communication.communicationErrorResp,
            getEventByIdResp: communication.getEventByIdResp,
            updateEventResp: communication.updateEventResp,
            getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
            curriculumClassSectResp: communication.curriculumClassSectResp,
        }), shallowEqual);

    const addConcernFeedbackRef = useRef({
        prevCommunicationErrorResp: communicationErrorResp,
        prevSaveEventResp: saveEventResp,
        prevGetEventByIdResp: getEventByIdResp,
        prevUpdateEventResp: updateEventResp
    });

    useEffect(() => {
        const { prevCommunicationErrorResp, prevSaveEventResp, prevUpdateEventResp } = addConcernFeedbackRef.current;
        if (saveEventResp && saveEventResp !== prevSaveEventResp) {
            toast.success("Event Created Successfully");
            history.push("/events");
        }
        else if (communicationErrorResp && communicationErrorResp !== prevCommunicationErrorResp) {
            const { details }: any = communicationErrorResp;
            toast.error(details || "Something went wrong.");
        }
        else if(updateEventResp && updateEventResp !== prevUpdateEventResp){
            toast.success("Event Updated Successfully");
            history.push("/events");
        }
        addConcernFeedbackRef.current.prevSaveEventResp = saveEventResp;
        addConcernFeedbackRef.current.prevCommunicationErrorResp = communicationErrorResp;
        addConcernFeedbackRef.current.prevUpdateEventResp = updateEventResp
    }, [communicationErrorResp, saveEventResp, updateEventResp]);

    useEffect(() => {
        if (getEventByIdResp && academicYearListResp) {
            const { title, description, eventType, eventStatus, iconImage, displayImage, startDate, endDate, tags, location, longitude, latitude, contactPhone, contactPerson, filesDto, published ,allowedComments,recipientType,parentDetails,staffDetails,employeeDTO } = getEventByIdResp;
            let file = filesDto?.map((i: FileDto) => ({ ...i, name: i?.originalFileName }))
            let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            setDocument(file);
            let iconURL = iconImage?.originalFileName
            let imageURL = displayImage?.originalFileName
            addEventForm.setValues((prev) => ({ ...prev, title: title, eventType, eventStatus, startDate, endDate, tags, location, longitude, latitude, contactPhone, contactPerson, academicYearId: yearId ?? "", iconImage: iconURL, displayImage: imageURL, description: description, document: file, isPublished:published,isAllowedComments:allowedComments,recipientType:recipientType,parentCategory:parentDetails,employeeCategory:staffDetails?.categories, studentType: studentType,employeeIds: employeeDTO || [] }));
        } else if (academicYearListResp && !getEventByIdResp) {
            let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            addEventForm.setValues((prev) => ({ ...prev, academicYearId: yearId ?? "" }));
        }
    }, [academicYearListResp, getEventByIdResp]);

    useEffect(() => {
        return () => { dispatch(setEventByIdAct(undefined)) }
    }, [])

    useEffect(() => {
        if (location.state?.id && location.state?.fromComponent === 'Communication Event') {
            dispatch(getEventByIdAct(generateActionPayload('get_event_by_id', { id: location.state?.id })))
        }
    }, [location.state])

    useEffect(() => {
        if (branchId) {
            dispatch(getCurriculumClassSectAct(generateActionPayload("get_curriculum_class_section", undefined, {
                branchId
            })));
        }
    }, [branchId]);

    useEffect(() => {
        const { data } = curriculumClassSectResp || {};
        if (Array.isArray(data)) {
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
            setCurriculumState(updateData);
        }
    }, [curriculumClassSectResp]);

    const addEventForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {                   
            // Parent Details
            const selectedSectionIds: any = [];
            const studentIds: any = [];
            const employeeIds: any = [];
            curriculumState.forEach((curriculum: CurriculumItem) => {
                curriculum.classes.forEach((cls: Class) => {
                    cls.sections.forEach((section: Section) => {
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
            
            //Employees Details
            if(values.employeeIds.length > 0){
                const employeeId = values.employeeIds.map((employee: Employee) => employee.id);
                employeeIds.push(...employeeId);
            }

            const startDate = convertToFullTime(values.startDate)
            const endDate = convertToFullTime(values.endDate)
            const tags = values.tags.split(",").map(tag => tag.trim());
            let formData = new FormData();
            const payload = {
                ...createEventPayload(values, instituteId, branchId, tags, startDate, endDate,selectedSectionIds,studentIds,employeeIds)
            };            
            if (values.file2) {
                formData.append("displayImage", values.file2);
            }
            if (values.file1) {
                formData.append("iconImage", values.file1);
            }          
            if (location.state?.id && location.state?.fromComponent === 'Communication Event') {
                formData.append("requestValue", JSON.stringify(payload));
                dispatch(updateEventAct(generateActionPayload("update_event", { id: location.state?.id }, formData)));
            }
            else {
                formData.append("requestValue", JSON.stringify(payload));
                if (values.document.length > 0) {
                    document.map((file) => {
                        formData.append("fileList", file);
                    })
                }

                dispatch(saveEventAct(generateActionPayload("save_event", undefined, formData)));
            }
        },
    });

    function onChangeIconInputHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name } = event.target;
        const file1 = event.target.files && event.target.files[0];
        addEventForm.setValues((prevState) => ({
            ...prevState, iconImage: file1 ? file1.name : '',
            file1
        }))
    }

    function onChangeDisplayImgInputHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name } = event.target;
        const file2 = event.target.files && event.target.files[0];
        addEventForm.setValues((prevState) => ({
            ...prevState, displayImage: file2 ? file2.name : '',
            file2
        }))
    }
    function selectSectionHndlr(selectedOptions: number | number[], config?: any) {
        const { name } = config;
        const selectedContactPerson = getEmployeesByFilterResp.find((item: { userId: number }) => +item.userId === +selectedOptions);
        if (selectedContactPerson) {
            addEventForm.setValues((prevState) => ({
                ...prevState, contactPerson: selectedContactPerson.employeeName, contactPhone: selectedContactPerson.workPhoneNo, [name]: selectedOptions
            }))
        }
        else {
            addEventForm.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }))
        }
    }

    function onSelectStaffHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target
        const { employeeCategory } = addEventForm.values;
        if (checked) {
            employeeCategory.push(name)
            addEventForm.setFieldValue('employeeCategory', employeeCategory);
        } else {
            addEventForm.setFieldValue('employeeCategory', employeeCategory.filter((item) => item !== name));
        }
    }

    function onSelectParentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target;
        const { parentCategory } = addEventForm.values;
        if (checked) {
            parentCategory.push(name)
            addEventForm.setFieldValue('parentCategory', parentCategory);
        } else {
            addEventForm.setFieldValue('parentCategory', parentCategory.filter((item) => item !== name));
        }
    }

    function selectStudentHndlr(selectedOptions: number | number[], config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addEventForm.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            addEventForm.setValues((prevState) => ({ ...prevState, [name]: null }));
        }
    }

    function selecteAllHndlr() {
        setIsAllSelected(prevState => !prevState);
        if (isAllSelected) {
            const updateData = curriculumState.map((item) => ({
                ...item,
                isSelected: false,  // Add isSelected
                classes: item.classes.map((cls) => ({
                    ...cls,
                    isSelected: false,  // Add isSelected for classes
                    sections: cls.sections.map((section) => ({
                        ...section,
                        isSelected: false  // Add isSelected for sections
                    }))
                }))
            }));
            setCurriculumState(updateData);
        } else {
            const updateData = curriculumState.map((item) => ({
                ...item,
                isSelected: true,  // Add isSelected
                classes: item.classes.map((cls) => ({
                    ...cls,
                    isSelected: true,  // Add isSelected for classes
                    sections: cls.sections.map((section) => ({
                        ...section,
                        isSelected: true  // Add isSelected for sections
                    }))
                }))
            }));
            setCurriculumState(updateData);
        }
    }
    function onSearchMultiSelectHandler(name:any,value: string) {
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

    const toggleMapModal = (address?:string, lat?: number, long?: number) => {
        if (getLocalStorage("accesstoken") && address && lat && long) {
            selectedLocation.current = {
                address, lat, long
            }
            addEventForm.setFieldValue('location', address);
            addEventForm.setFieldValue('longitude', long);
            addEventForm.setFieldValue('latitude', lat);
        }
        closeMapModalHndlr();
    }
    const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'recipientType') {
            if (value === 'PARENT') {
                addEventForm.setValues((prev) => ({
                    ...prev, [name]: value,
                    employeeCategory: [],
                    parentCategory: ['father', 'mother'],
                    studentType: 'all-student'
                }))
            } else if (value === 'STAFF') {
                addEventForm.setValues((prev) => ({
                    ...prev, [name]: value,
                    employeeCategory: ['Admin', 'Non-Teaching'],
                    parentCategory: [],
                    studentType: ''
                }))
                dispatch(setEmployeesByFilterAct(undefined))
            } else {
                addEventForm.setValues((prev) => ({
                    ...prev, [name]: value,
                    employeeCategory: [],
                    parentCategory: [],
                    studentType: ''
                }))
            }

        } else {
            addEventForm.setValues((prev) => ({ ...prev, [name]: value }))
        }
    }

    function selectTreeRowHndlr(selectedInfo: {rowType: string, curriculumId: string, sectionId: string, classId: string, checked: boolean}) {
        const { rowType, curriculumId, sectionId, classId, checked } = selectedInfo;
        if (!rowType) return;
        const updatedCurriculumData = [...curriculumState];
        if (rowType === "CURRICULUM") {
            const curriculumRowIndex = curriculumState.findIndex((item) => item.curriculumId?.toString() === curriculumId?.toString());
            if (curriculumRowIndex > -1) {
                const rowInfo = curriculumState[curriculumRowIndex];
                const updateRowInfo = { ...rowInfo };
                updateRowInfo.isSelected = checked;
                const classesUpdate = updateRowInfo.classes.map((cls) => ({
                    ...cls,
                    isSelected: checked,  // Add isSelected for classes
                    sections: cls.sections.map((section) => ({
                        ...section,
                        isSelected: checked  // Add isSelected for sections
                    }))
                }))
                updateRowInfo.classes = classesUpdate;
                updatedCurriculumData.splice(curriculumRowIndex, 1, updateRowInfo);
            }
        } else if (rowType === "CLASS") {
            const curriculumRowIndex = curriculumState.findIndex((item) => item.curriculumId?.toString() === curriculumId?.toString());
            if (curriculumRowIndex > -1) {
                const curriuculumRowInfo = curriculumState[curriculumRowIndex];
                const updatedCurriculumRowInfo = { ...curriuculumRowInfo };
                const curriculumClasses = [...updatedCurriculumRowInfo.classes];
                const classRowIndex = curriculumClasses.findIndex((item) => item.classId?.toString() === classId?.toString());
                if (classRowIndex > -1) {
                    const classRowInfo = curriculumClasses[classRowIndex];
                    const updateClassRowInfo = { ...classRowInfo };
                    updateClassRowInfo.isSelected = checked;
                    const sectionUpdate = updateClassRowInfo.sections.map((sections) => ({
                        ...sections,
                        isSelected: checked
                    }))
                    updateClassRowInfo.sections = sectionUpdate;
                    curriculumClasses.splice(classRowIndex, 1, updateClassRowInfo);
                    updatedCurriculumRowInfo.isSelected = curriculumClasses.every((item) => item.isSelected);
                    updatedCurriculumRowInfo.classes = curriculumClasses;
                    updatedCurriculumData.splice(curriculumRowIndex, 1, updatedCurriculumRowInfo);
                }

            }
        } else {
            const curriculumRowIndex = curriculumState.findIndex((item) => item.curriculumId?.toString() === curriculumId?.toString());
            if (curriculumRowIndex > -1) {
                const curriuculumRowInfo = curriculumState[curriculumRowIndex];
                const updatedCurriculumRowInfo = { ...curriuculumRowInfo };
                const curriculumClasses = [...updatedCurriculumRowInfo.classes];
                const classRowIndex = curriculumClasses.findIndex((item) => item.classId?.toString() === classId?.toString());
                if (classRowIndex > -1) {
                    const classRowInfo = curriculumClasses[classRowIndex];
                    const updateClassRowInfo = { ...classRowInfo };
                    const sectionUpdate = updateClassRowInfo.sections.map((sections) => {
                        if (sections?.sectionId?.toString() === sectionId?.toString()) {
                            return ({ ...sections, isSelected: checked })
                        }
                        return { ...sections }
                    })
                    updateClassRowInfo.isSelected = sectionUpdate.every((item) => item.isSelected);
                    updateClassRowInfo.sections = sectionUpdate;
                    curriculumClasses.splice(classRowIndex, 1, updateClassRowInfo);
                    updatedCurriculumRowInfo.isSelected = curriculumClasses.every((item) => item.isSelected);
                    updatedCurriculumRowInfo.classes = curriculumClasses;
                    updatedCurriculumData.splice(curriculumRowIndex, 1, updatedCurriculumRowInfo);
                }

            }
        }
        setIsAllSelected(updatedCurriculumData?.every((item) => item.isSelected));
        setCurriculumState(updatedCurriculumData);
    }

    const handleFileChange = (files: any) => {
        setDocument(files);
        addEventForm.setFieldValue('document', files);
    }

    const { employeeCategory, parentCategory, studentType } = addEventForm.values;
    return (
        <>
            <form onSubmit={addEventForm.handleSubmit}>
                <div className="page-content">
                    <div className="container-fluid">
                        <BreadCrumb title="Communication" pageTitle="Communication" />
                        <div className="tw-grid tw-grid-cols-12 gap-3">
                            <div className="tw-col-span-12 md:tw-col-span-8 tw-gap-3">
                                <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                    <div className="tw-p-4">
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                            {/* Title */}
                                            <div className="tw-col-span-12">
                                                <TextInput
                                                    name="title"
                                                    value={addEventForm.values.title}
                                                    onChange={onChangeFilterHndlr}
                                                    inputClassName="bg-soft-light"
                                                    invalid={!!(addEventForm.touched.title && addEventForm.errors.title)}
                                                    error={addEventForm.touched.title && addEventForm.errors.title ? addEventForm.errors.title : ""}
                                                    labelText="Title"
                                                    maxLength={50}
                                                    placeHolder="Enter Title"
                                                    labelClass="required"
                                                />
                                            </div>

                                            {/* Description */}
                                            <div className="tw-col-span-12">
                                                <TextArea
                                                    name="description"
                                                    value={addEventForm.values.description}
                                                    onChange={onChangeFilterHndlr}
                                                    invalid={!!(addEventForm.touched.description && addEventForm.errors.description)}
                                                    error={addEventForm.touched.description && addEventForm.errors.description ? addEventForm.errors.description : ""}
                                                    labelText="Description"
                                                    labelClass="required"
                                                    height="250px"
                                                />
                                            </div>

                                            {/* Event Type */}
                                            <div className="tw-col-span-12 md:tw-col-span-4">
                                                <TextInput
                                                    name="eventType"
                                                    value={addEventForm.values.eventType}
                                                    onChange={onChangeFilterHndlr}
                                                    inputClassName="bg-soft-light"
                                                    invalid={!!(addEventForm.touched.eventType && addEventForm.errors.eventType)}
                                                    error={addEventForm.touched.eventType && addEventForm.errors.eventType ? addEventForm.errors.eventType : ""}
                                                    labelText="Event Type"
                                                    maxLength={50}
                                                    placeHolder="Enter Event Type"
                                                    labelClass="required"
                                                />
                                            </div>

                                            {/* Event Status */}
                                            <div className="tw-col-span-12 md:tw-col-span-4">
                                                <SelectInput
                                                    name="eventStatus"
                                                    value={addEventForm.values.eventStatus}
                                                    onChange={onChangeFilterHndlr}
                                                    menuItems={eventStatus}
                                                    labelText="Event Status"
                                                    labelClass="required"
                                                    formgroupClassName="mb-0"
                                                    valueKey="id"
                                                    textKey="name"
                                                    invalid={!!(addEventForm.touched.eventStatus && addEventForm.errors.eventStatus)}
                                                    error={addEventForm.touched.eventStatus && addEventForm.errors.eventStatus ? addEventForm.errors.eventStatus : ""}
                                                />
                                            </div>

                                            {/* Tags */}
                                            <div className="tw-col-span-12 md:tw-col-span-4">
                                                <TextInput
                                                    name="tags"
                                                    value={addEventForm.values.tags}
                                                    onChange={onChangeFilterHndlr}
                                                    inputClassName="bg-soft-light"
                                                    invalid={!!(addEventForm.touched.tags && addEventForm.errors.tags)}
                                                    error={addEventForm.touched.tags && addEventForm.errors.tags ? addEventForm.errors.tags : ""}
                                                    labelText="Tags"
                                                    maxLength={50}
                                                    placeHolder="Tags"
                                                    labelClass="required"
                                                />
                                            </div>

                                            {/* Icon Image */}
                                            <div className="tw-col-span-12 lg:tw-col-span-6">
                                                <BrowseFile
                                                    containerClassName="mb-3"
                                                    labelText="Icon Image"
                                                    name="iconImage"
                                                    fileName={addEventForm.values.iconImage}
                                                    onChangeFileHndlr={onChangeIconInputHndlr}
                                                    invalid={!!(addEventForm.touched.iconImage && addEventForm.errors.iconImage)}
                                                    error={addEventForm.touched.iconImage && addEventForm.errors.iconImage ? addEventForm.errors.iconImage : ""}
                                                />
                                            </div>

                                            {/* Display Image */}
                                            <div className="tw-col-span-12 lg:tw-col-span-6">
                                                <BrowseFile
                                                    containerClassName="mb-3"
                                                    labelText="Display Image"
                                                    labelClass="required"
                                                    name="displayImage"
                                                    fileName={addEventForm.values.displayImage}
                                                    onChangeFileHndlr={onChangeDisplayImgInputHndlr}
                                                    invalid={!!(addEventForm.touched.displayImage && addEventForm.errors.displayImage)}
                                                    error={addEventForm.touched.displayImage && addEventForm.errors.displayImage ? addEventForm.errors.displayImage : ""}
                                                />
                                            </div>

                                            {/* Checkboxes */}
                                            <div className="tw-col-span-12 tw-flex tw-mb-3">
                                                <InputCheckbox
                                                    formgroupClassName="tw-me-3"
                                                    name="isPublished"
                                                    labelName="Published"
                                                    value={addEventForm.values.isPublished}
                                                    onChange={addEventForm.handleChange}
                                                />
                                                <InputCheckbox
                                                    formgroupClassName="tw-me-3"
                                                    name="isAllowedComments"
                                                    labelName="Allow Comments"
                                                    value={addEventForm.values.isAllowedComments}
                                                    onChange={addEventForm.handleChange}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="tw-col-span-12 md:tw-col-span-4 tw-gap-3">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                    {/* Event Date */}
                                    <div className="tw-col-span-12">
                                        <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                            <div className="tw-px-4 tw-py-3 tw-border-b">
                                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                                    Event Date
                                                </h4>
                                            </div>

                                            <div className="tw-p-4">
                                                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                                    <div className="tw-col-span-12 sm:tw-col-span-6">
                                                        <DateInput
                                                            name="startDate"
                                                            labelText="Start Date"
                                                            labelClass="required"
                                                            inputType="datetime-local"
                                                            value={addEventForm.values.startDate}
                                                            onChange={addEventForm.handleChange}
                                                            onBlur={addEventForm.handleBlur}
                                                            invalid={!!(addEventForm.touched.startDate && addEventForm.errors.startDate)}
                                                            error={addEventForm.touched.startDate && addEventForm.errors.startDate ? addEventForm.errors.startDate : ""}
                                                        />
                                                    </div>

                                                    <div className="tw-col-span-12 sm:tw-col-span-6">
                                                        <DateInput
                                                            name="endDate"
                                                            labelText="End Date"
                                                            labelClass="required"
                                                            inputType="datetime-local"
                                                            value={addEventForm.values.endDate}
                                                            onChange={addEventForm.handleChange}
                                                            onBlur={addEventForm.handleBlur}
                                                            invalid={!!(addEventForm.touched.endDate && addEventForm.errors.endDate)}
                                                            error={addEventForm.touched.endDate && addEventForm.errors.endDate ? addEventForm.errors.endDate : ""}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other Details */}
                                    <div className="tw-col-span-12">
                                        <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                            <div className="tw-px-4 tw-py-3 tw-border-b">
                                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                                    Other Details
                                                </h4>
                                            </div>

                                            <div className="tw-p-4">
                                                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                                    <div className="tw-col-span-12">
                                                        <CustomSelect
                                                            name="organizedBy"
                                                            idKey="userId"
                                                            defaultSelect="Select"
                                                            value={addEventForm.values.organizedBy}
                                                            renderValue={renderValueSection}
                                                            renderOptions={renderOptionsEmployee}
                                                            onChange={selectSectionHndlr}
                                                            onSearchHandler={onSearchMultiSelectHandleremployee}
                                                            labelText="Organized By"
                                                            containerClassName="mb-3"
                                                            options={getEmployeesByFilterResp}
                                                        />
                                                    </div>

                                                    <div className="tw-col-span-12 sm:tw-col-span-6">
                                                        <TextInput
                                                            name="contactPerson"
                                                            value={addEventForm.values.contactPerson}
                                                            onChange={addEventForm.handleChange}
                                                            labelText="Contact Person"
                                                            maxLength={50}
                                                            placeHolder="Contact Person"
                                                            isDisabled={getEmployeesByFilterResp?.length > 0}
                                                            isReadOnly={getEmployeesByFilterResp?.length > 0}
                                                        />
                                                    </div>

                                                    <div className="tw-col-span-12 sm:tw-col-span-6">
                                                        <TextInput
                                                            name="contactPhone"
                                                            value={addEventForm.values.contactPhone}
                                                            onChange={onChangeFilterHndlr}
                                                            labelText="Contact Phone"
                                                            maxLength={50}
                                                            placeHolder="Contact Phone"
                                                            isDisabled={getEmployeesByFilterResp?.length > 0}
                                                            isReadOnly={getEmployeesByFilterResp?.length > 0}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="tw-col-span-12">
                                        <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                            <div className="tw-px-4 tw-py-3 tw-border-b">
                                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                                    Location
                                                </h4>
                                            </div>

                                            <div className="tw-p-4">
                                                <TextInputGroup
                                                    name="location"
                                                    inputgroupClassName="input-group-md"
                                                    inputClassName="form-control-md bg-white"
                                                    formgroupClassName="mb-2"
                                                    value={addEventForm.values.location}
                                                    onChange={addEventForm.handleChange}
                                                    placeHolder="Add Location"
                                                    isReadOnly
                                                    isDisabled
                                                    labelText="Add Location"
                                                    labelClass="required"
                                                    invalid={!!(addEventForm.touched.location && addEventForm.errors.location)}
                                                    error={addEventForm.touched.location && addEventForm.errors.location ? addEventForm.errors.location : ""}
                                                >
                                                    <i
                                                        onClick={openMapModalHndlr}
                                                        className="tw-text-xl ri-map-pin-fill tw-text-emerald-500 tw-cursor-pointer"
                                                    />
                                                </TextInputGroup>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-4">

                            {/* Attached Files */}
                            <div className="tw-col-span-12 md:tw-col-span-8">
                                <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                    <div className="tw-px-4 tw-py-3 tw-border-b">
                                        <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                            Attached Files
                                        </h4>
                                    </div>

                                    <div className="tw-p-4">
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                                            <div className="tw-col-span-12 tw-text-sm tw-text-gray-500">
                                                Add attached files here.
                                            </div>

                                            <div className="tw-col-span-12 tw-mt-2">
                                                <MultipleFileUpload
                                                    name="document"
                                                    prevFiles={document}
                                                    onChange={handleFileChange}
                                                    containerClass="col-12"
                                                    maxSizeInMb={2}
                                                    helperText="Note : Max File Size is 2MB"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recipient Section */}
                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                    <div className="tw-p-4">
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                            <div className="tw-col-span-12">
                                                <SelectInput
                                                    name="recipientType"
                                                    value={addEventForm.values.recipientType}
                                                    onChange={onChangeFilterHndlr}
                                                    menuItems={userTypeOptions}
                                                    valueKey="id"
                                                    textKey="name"
                                                    labelText="Recipient Type"
                                                    defaultSelect="Select"
                                                    invalid={!!(addEventForm.touched.recipientType && addEventForm.errors.recipientType)}
                                                    error={addEventForm.touched.recipientType && addEventForm.errors.recipientType ? addEventForm.errors.recipientType : ""}
                                                />
                                            </div>

                                            {/* STAFF */}
                                            {addEventForm.values.recipientType === "STAFF" && (
                                                <>
                                                    <div className="tw-col-span-12 tw-border-b tw-py-2">
                                                        <h4 className="tw-text-sm tw-font-semibold tw-mb-0">
                                                            Staff
                                                        </h4>
                                                    </div>

                                                    <div className="tw-col-span-12 tw-flex tw-flex-wrap tw-gap-3 tw-mb-3">
                                                        {contactInfoStaff.map((item: any) => (
                                                            <InputCheckbox
                                                                key={item.id}
                                                                name={`${item.id}`}
                                                                labelName={item.name}
                                                                onChange={onSelectStaffHndlr}
                                                                value={Array.isArray(employeeCategory) && employeeCategory.includes(item.id) || false}
                                                                dataId={item.id}
                                                            />
                                                        ))}
                                                    </div>

                                                    <div className="tw-col-span-12">
                                                        <MultiSelectCheckbox
                                                            name="employeeIds"
                                                            labelText="Employee"
                                                            containerClassName="mb-3"
                                                            idKey="id"
                                                            value={addEventForm.values.employeeIds}
                                                            renderValue={renderValueStaff}
                                                            renderOptions={renderOptionsEmployee}
                                                            onChange={selectStudentHndlr}
                                                            onSearchHandler={onSearchMultiSelectHandleremployee}
                                                            options={getEmployeesByFilterResp}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* PARENT */}
                                            {addEventForm.values.recipientType === "PARENT" && (
                                                <>
                                                    <div className="tw-col-span-12 tw-border-b tw-py-2">
                                                        <h4 className="tw-text-sm tw-font-semibold tw-mb-0">
                                                            Parent
                                                        </h4>
                                                    </div>

                                                    <div className="tw-col-span-12 tw-flex tw-flex-wrap">
                                                        <RadioInputContainer
                                                            name="studentType"
                                                            labelText="Student Type"
                                                            inputContainerClassName="mt-1"
                                                            radioOptions={studentTypeOptions}
                                                            value={addEventForm.values.studentType}
                                                            onChange={addEventForm.handleChange}
                                                        />
                                                    </div>

                                                    {studentType === "all-student" && (
                                                        <div className="tw-col-span-12 tw-mb-3">
                                                            <CurriculumSelectorProvider.Provider value={{ selectTreeRowHndlr }}>
                                                                <TreeComponent
                                                                    isAllSelected={isAllSelected}
                                                                    selecteAllHndlr={selecteAllHndlr}
                                                                    curriculumClass={curriculumState}
                                                                />
                                                            </CurriculumSelectorProvider.Provider>
                                                        </div>
                                                    )}

                                                    {studentType === "selected-student" && (
                                                        <div className="tw-col-span-12">
                                                            <MultiSelectCheckbox
                                                                name="studentIds"
                                                                labelText="Students"
                                                                containerClassName="mb-3"
                                                                idKey="id"
                                                                value={addEventForm.values.studentIds}
                                                                renderValue={renderValueStudent}
                                                                renderOptions={renderOptionsStudent}
                                                                onChange={selectStudentHndlr}
                                                                onSearchHandler={onSearchMultiSelectHandler}
                                                                options={getStudentsByFilterResp}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {/* ALL */}
                                            {addEventForm.values.recipientType === "ALL" && (
                                                <div className="tw-col-span-12" />
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="tw-col-span-12 md:tw-col-span-8">
                                <div className="tw-flex tw-justify-end tw-mb-4">
                                    <Button
                                        variant='primary'
                                        type="submit"
                                        disabled={showApiLoader}
                                    >
                                        {getEventByIdResp ? "Update" : "Create"}
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
            <ModalContainerUpdated
                id="map-modal"
                isOpen={mapModalState.showModal}
                toggle={toggleMapModal}
                modalTitle="Add Location"
                modalSize="lg"
            >
                <LocationSelectorModal
                    isOpen={mapModalState.showModal}
                    selectedLocation={selectedLocation.current}
                    toggle={toggleMapModal}
                />
            </ModalContainerUpdated>
        </>
    )
}

export default AddEvent