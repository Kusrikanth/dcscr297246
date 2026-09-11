import React, { Suspense, useEffect, useState } from 'react'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import { CustomSelect, MultipleFileUpload, QuillEditor, TextArea, TextInput } from '../../../Components/Common'
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { renderOptionsEmployee, renderValueSection } from './helper';
import { getEmployeeByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import * as Yup from "yup";
import { saveFeedsAct, setFeedsByIdAct, updateFeedsAct } from '../../../store/communication/communicationactions';
import Button from '../../../Components/Common/Button';

interface FileDto {
    originalFileName: string;
}
const initialValues = {
    title: "",
    academicYearId: "",
    description: "",
    createdName: "",
    contactNo: "",
    document: [],
    createdBy: "",
};

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    createdName: Yup.string().required('Created name is required'),
    contactNo: Yup.string().required('Contact number is required'),
});

const AddEditFeeds = (props: any) => {
    
    const [document, setDocument] = useState([]);
    const dispatch = useAppDispatch();

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        getEmployeesByFilterResp,
        getFeedsByIdResp
    } =
        useAppSelector(({ appData, directoryEmployee, instAcademics, globalData, communication }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            getFeedsByIdResp: communication.getFeedsByIdResp
        }), shallowEqual);

    const addFeedForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                instituteId,
                branchId,
                title: values.title,
                description: values.description,
                createdName: values.createdName,
                contactNo: values.contactNo,
                createdBy: values.createdBy,
            }
            if(props.data) {
                dispatch(updateFeedsAct(generateActionPayload("update_feeds", {id : props?.data?.id}, payload)));
            } 
            else {
                let formData = new FormData()
                formData.append("requestValue", JSON.stringify({ ...payload, academicYearId: values.academicYearId }));
                if (values.document.length > 0) {
                    document.map((file: any) => {
                        formData.append("fileList", file);
                    })                
                }
                dispatch(saveFeedsAct(generateActionPayload("save_feeds", undefined, formData)));
            }
         }
    })

    const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        addFeedForm.setValues((prev) => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        if (academicYearListResp && getFeedsByIdResp) {
            const {contactNo,createdName,description,files,title,createdBy} = getFeedsByIdResp;
            let file = files?.map((i:FileDto)=>({...i,name:i?.originalFileName}))
            let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            setDocument(file);
            addFeedForm.setValues((prev) => ({ ...prev, title:title,academicYearId:yearId || "",description:description,document: file,createdName:createdName,contactNo:contactNo, createdBy:createdBy }));
        }
        else if(academicYearListResp && !getFeedsByIdResp){
            let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            addFeedForm.setValues((prev) => ({ ...prev, academicYearId:yearId || "" }));
        }
    }, [academicYearListResp,getFeedsByIdResp]);

    useEffect(() => {
        return () =>{ dispatch(setFeedsByIdAct(undefined))}
    },[])

    function selectSectionHndlr(selectedOptions: number | number[], config?: any) {
        const { name } = config;
        const selectedContactPerson = getEmployeesByFilterResp?.find((item: { userId: number }) => +item.userId === +selectedOptions);
        if (selectedContactPerson) {
            addFeedForm.setValues((prevState) => ({
                ...prevState, createdName: selectedContactPerson.employeeName, contactNo: selectedContactPerson.workPhoneNo, [name]: selectedOptions
            }))
        }
        else {
            addFeedForm.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }))
        }
    }

    const employeeData = () => {
        const params = { searchString:  getFeedsByIdResp?.createdName};        
        dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
    }

    useEffect(() => {
        if(getFeedsByIdResp){
            employeeData();
        }
    },[getFeedsByIdResp])
    function onSearchMultiSelectHandler(name: any, value: string) {
        if (value) {
            const params = { searchString: value };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
        }
    }
    const handleFileChange = (files: any) => {
        setDocument(files);
        addFeedForm.setFieldValue('document', files);
    }

    const onChangeQuillHndlr = (content: any) => {
        addFeedForm.setFieldValue("description", content);
    }
    return (
        <>
       <form onSubmit={addFeedForm.handleSubmit}>
                <div className="tw-pb-3 tw-px-4">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                        {/* Title */}
                        <div className="tw-col-span-12">
                            <TextInput
                                name="title"
                                value={addFeedForm.values.title}
                                onChange={onChangeFilterHndlr}
                                inputClassName="bg-soft-light"
                                invalid={(addFeedForm.touched.title && addFeedForm.errors.title) ? true : false}
                                error={(addFeedForm.touched.title && addFeedForm.errors.title) ? addFeedForm.errors.title : ""}
                                labelText="Title"
                                maxLength={50}
                                placeHolder="Enter Title"
                                labelClass="required"
                            />
                        </div>

                        {/* Description */}
                        <div className="tw-col-span-12">
                            <TextArea
                                name='description'
                                value={addFeedForm.values.description}
                                onChange={onChangeFilterHndlr}
                                invalid={(addFeedForm.touched.description && addFeedForm.errors.description) ? true : false}
                                error={(addFeedForm.touched.description && addFeedForm.errors.description) ? addFeedForm.errors.description : ""}
                                labelText='Description'
                                labelClass='required'
                            />
                        </div>

                        {/* Created By */}
                        <div className="tw-col-span-12">
                            <CustomSelect
                                name="createdBy"
                                idKey="userId"
                                defaultSelect="Select"
                                value={addFeedForm.values.createdBy}
                                renderValue={renderValueSection}
                                renderOptions={renderOptionsEmployee}
                                onChange={selectSectionHndlr}
                                onSearchHandler={onSearchMultiSelectHandler}
                                labelText="Created By"
                                containerClassName="tw-mb-3"
                                options={getEmployeesByFilterResp}
                                invalid={(addFeedForm.touched.createdBy && addFeedForm.errors.createdBy) ? true : false}
                                error={(addFeedForm.touched.createdBy && addFeedForm.errors.createdBy) ? addFeedForm.errors.createdBy : ""}
                            />
                        </div>

                        {/* Created Name */}
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInput
                                name="createdName"
                                value={addFeedForm.values.createdName}
                                onChange={addFeedForm.handleChange}
                                invalid={(addFeedForm.touched.createdName && addFeedForm.errors.createdName) ? true : false}
                                error={(addFeedForm.touched.createdName && addFeedForm.errors.createdName) ? addFeedForm.errors.createdName : ""}
                                labelText="Created Name"
                                maxLength={50}
                                placeHolder="Created Name"
                                isDisabled={ true }
                                isReadOnly={ true }
                            />
                        </div>

                        {/* Contact No */}
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInput
                                name="contactNo"
                                value={addFeedForm.values.contactNo}
                                onChange={onChangeFilterHndlr}
                                invalid={(addFeedForm.touched.contactNo && addFeedForm.errors.contactNo) ? true : false}
                                error={(addFeedForm.touched.contactNo && addFeedForm.errors.contactNo) ? addFeedForm.errors.contactNo : ""}
                                labelText="Contact No"
                                maxLength={50}
                                placeHolder="Contact No"
                                isDisabled={ true }
                                isReadOnly={true }
                            />
                        </div>

                        {/* File Upload (only when props.data is false) */}
                        {!props.data && (
                            <>
                                <div className="tw-col-span-12 tw-text-sm tw-text-gray-500">
                                    Add Attached files here.
                                </div>

                                <div className="tw-col-span-12 tw-mt-2">
                                    <MultipleFileUpload
                                        name="document"
                                        prevFiles={document}
                                        onChange={handleFileChange}
                                        containerClass="tw-col-span-12"
                                        maxSizeInMb={2}
                                        helperText="Note : Max File Size is 2MB"
                                        invalid={(addFeedForm.touched.document && addFeedForm.errors.document) ? true : false}
                                        error={(addFeedForm.touched.document && addFeedForm.errors.document) ? addFeedForm.errors.document : ""}
                                    />
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <div className="tw-col-span-12 tw-flex tw-justify-end">
                            <Button
                                type="submit"
                                disabled={showApiLoader}
                            >
                                Create
                            </Button>
                        </div>

                    </div>
                </div>
            </form>


        </>
    )
}

export default AddEditFeeds