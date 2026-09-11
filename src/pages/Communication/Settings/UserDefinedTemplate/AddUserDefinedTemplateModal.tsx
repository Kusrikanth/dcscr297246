import React, { Suspense, useEffect, useRef, useState } from 'react'
import { InputCheckbox, MultiSelectCheckbox, QuillEditor, RadioInputContainer, SelectInput, TextInput } from '../../../../Components/Common'
import { useFormik } from 'formik';
import { userTypeOptions, statusOptionsCheckbox, statusOptionsParent, statusOptionsStaff, studentTypeOptions, renderValueStudent, renderOptionsStudent } from './helper';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { getStudentByFilterAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';
import Button from '../../../../Components/Common/Button';
// import ReactQuill from 'react-quill';

const initialValues = {
    tittle: "",
    description: "",
    userType: "",
    studentType: "",
    studentIds: [],
    sendThrough: statusOptionsCheckbox,
    parentInfo: statusOptionsParent,
};

const AddUserDefinedTemplateModal = (props: any) => {

    const [contactInfoStaff, setContactInfoStaff] = useState(statusOptionsStaff);
    // const quillRef = useRef<ReactQuill | null>(null);

    const dispatch = useAppDispatch();

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        getStudentsByFilterResp,
    } =
        useAppSelector(({ appData, directoryEmployee, directoryStudent, instAcademics, globalData, concernsFeedback, complaintDepartment, login }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
        }), shallowEqual);

    const addUserDefinedTemplate = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        onSubmit: (values) => { },
    });

    const onChangeFilterHndlr = (event: any) => {
        const { name, value } = event.target;
        addUserDefinedTemplate.setValues((prev: any) => ({ ...prev, [name]: value }))
        addUserDefinedTemplate.setValues((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    function onSelectClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target

        const newList = addUserDefinedTemplate.values.sendThrough.map((item: any) => {
            if (item?.id === name) {
                return {
                    ...item,
                    selected: checked
                }
            }
            return item
        })
        addUserDefinedTemplate.setFieldValue("sendThrough", newList)

    }
    function onSelectParentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target

        const newList = addUserDefinedTemplate.values.parentInfo.map((item: any) => {
            if (item?.id === name) {
                return {
                    ...item,
                    selected: checked
                }
            }
            return item
        })
        addUserDefinedTemplate.setFieldValue("parentInfo", newList)

    }
    function onSelectStaffHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target

        const newList = contactInfoStaff?.map((item: any) => {
            if (item?.id === name) {
                return {
                    ...item,
                    selected: checked
                }
            }
            return item
        })
        setContactInfoStaff(newList)

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

    return (
        <>
            <form>
                <div className="tw-p-5">
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">

                        {/* LEFT SECTION */}
                        <div className="md:tw-col-span-7">
                            <div className="tw-grid tw-grid-cols-1 tw-gap-3">

                                <div className="tw-flex tw-mb-2">
                                    <span>Send Through :</span>
                                </div>

                                <div className="tw-flex tw-flex-wrap tw-mb-2">
                                    {addUserDefinedTemplate.values.sendThrough &&
                                        addUserDefinedTemplate.values.sendThrough.map((item: any) => (
                                            <div key={item.id} className="tw-mr-3">
                                                <InputCheckbox
                                                    name={`${item.id}`}
                                                    formgroupClassName="tw-mb-0"
                                                    labelName={item.name}
                                                    value={item.selected}
                                                    onChange={onSelectClassHndlr}
                                                    dataId={item.id}
                                                />
                                            </div>
                                        ))}
                                </div>

                                <TextInput
                                    name="tittle"
                                    value={addUserDefinedTemplate.values.tittle}
                                    onChange={onChangeFilterHndlr}
                                    inputClassName="tw-bg-gray-100"
                                    invalid={
                                        addUserDefinedTemplate.touched.tittle &&
                                            addUserDefinedTemplate.errors.tittle
                                            ? true
                                            : false
                                    }
                                    error={
                                        addUserDefinedTemplate.touched.tittle &&
                                            addUserDefinedTemplate.errors.tittle
                                            ? addUserDefinedTemplate.errors.tittle
                                            : ""
                                    }
                                    labelText="Tittle"
                                    maxLength={50}
                                    placeHolder="Enter Tittle"
                                    labelClass="required"
                                />

                                <Suspense fallback={<div>Loading...</div>}>
                                    <QuillEditor
                                        name="description"
                                        value={addUserDefinedTemplate.values.description}
                                        onChange={onChangeQuillHndlr}
                                        invalid={(addUserDefinedTemplate.touched.description && addUserDefinedTemplate.errors.description) ? true : false}
                                        error={(addUserDefinedTemplate.touched.description && addUserDefinedTemplate.errors.description) ? addUserDefinedTemplate.errors.description : ""}
                                        labelText="Description"
                                        labelClass="required"
                                    />
                                </Suspense>
                            </div>
                        </div>

                        {/* RIGHT SECTION */}
                        <div className="md:tw-col-span-5">
                            <div className="tw-grid tw-grid-cols-1 tw-gap-2">

                                <SelectInput
                                    name="userType"
                                    value={addUserDefinedTemplate.values.userType}
                                    onChange={onChangeFilterHndlr}
                                    menuItems={userTypeOptions || []}
                                    valueKey="id"
                                    textKey="name"
                                    labelText="User Type"
                                    formgroupClassName="tw-mb-1"
                                    defaultSelect="Select"
                                    invalid={(addUserDefinedTemplate.touched.userType && addUserDefinedTemplate.errors.userType) ? true : false}
                                    error={(addUserDefinedTemplate.touched.userType && addUserDefinedTemplate.errors.userType) ? addUserDefinedTemplate.errors.userType : ""}
                                />

                                {addUserDefinedTemplate.values.userType === "EMPLOYEE" && (
                                    <>
                                        <div className="tw-border-b tw-py-1">
                                            <h4 className="tw-font-semibold">Staff</h4>
                                        </div>

                                        <div className="tw-flex tw-flex-wrap tw-gap-3 tw-mt-1">
                                            {contactInfoStaff &&contactInfoStaff?.map((item: any) => (
                                                <InputCheckbox
                                                    key={item.id}
                                                    name={`${item.id}`}
                                                    formgroupClassName="tw-mb-0"
                                                    labelName={item.name}
                                                    value={item.selected}
                                                    onChange={onSelectStaffHndlr}
                                                    dataId={item.id}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                {addUserDefinedTemplate.values.userType === "PARENT" && (
                                    <>
                                        <div className="tw-border-b tw-px-3 tw-py-2">
                                            <h4 className="tw-font-semibold">Parent</h4>
                                        </div>

                                        <div className="tw-flex tw-flex-wrap tw-gap-3">
                                            {addUserDefinedTemplate.values.parentInfo?.map((item: any) => (
                                                <InputCheckbox
                                                    key={item.id}
                                                    name={`${item.id}`}
                                                    labelName={item.name}
                                                    value={item.selected}
                                                    onChange={onSelectParentHndlr}
                                                    dataId={item.id}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                {addUserDefinedTemplate.values.userType === "EVERY" && (
                                    <div />
                                )}

                                <div className="tw-mt-2">
                                    <RadioInputContainer
                                        name="studentType"
                                        labelText="Student Type"
                                        inputContainerClassName="tw-mt-1"
                                        radioOptions={studentTypeOptions}
                                        value={addUserDefinedTemplate.values.studentType}
                                        onChange={addUserDefinedTemplate.handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="md:tw-col-span-12">
                            <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mb-1">
                                <Button
                                    type="button"
                                    onClick={props.toggle}
                                    variant='secondary'
                                >
                                    Reset
                                </Button>

                                <Button
                                    type="button"
                                    variant='primary'
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddUserDefinedTemplateModal