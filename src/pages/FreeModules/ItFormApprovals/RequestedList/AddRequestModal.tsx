import React, { useEffect, useState } from 'react'
import { AutoSearchInput, DateInput, InputCheckbox, SelectInput, TextInput } from '../../../../Components/Common'
import { ItFromApprovalModalsProps } from '../ItFormApprovalsTypes'
import { useFormik } from 'formik';
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { addNewRequesrItFormAct, getStudentFeeItFormAct, getStudentsItFromAct, resetStudentFeeItFormAct } from '../../../../store/fee/feeapprovals/feeapprovalactions';
import { getYyyyMmDdFormat } from '../../../../utility/dateutility';
import * as Yup from 'yup';
import { getAmountValueWithDecimal } from '../../../../utility/commonutility';
import { setItFormErrorAct } from '../../../../store/fee/feeapprovals/feeapprovalsslice';
import Button from '../../../../Components/Common/Button';


const initialValues = {
    academicYearId: "",
    curriculumId: "",
    curriculumName: "",
    classId: "",
    className: "",
    sectionId: "",
    sectionName: "",
    studentId: "",
    date: "",
    claimedBy: "",
    requestDescription: ""
}
const AddRequestModal = (props: ItFromApprovalModalsProps) => {

    const dispatch = useDispatch();
    const [studentFeeError, setStudentFeeError] = useState<string>('');
    const [error, setError] = useState('');
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [isCheck, setIsCheck] = useState<Array<number>>([]);
    
    const validationSchema = Yup.object().shape({
        academicYearId: Yup.string().required('Academic Year is required'),
        studentId: Yup.string().required('Student is required'),
        claimedBy: Yup.string().required('Claimed By is required'),
        requestDescription: Yup.string().required('Request Description is required'),
    })

    const AddRequestedListForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            let total = studentFeeItFormResp && studentFeeItFormResp.filter((fee: any) => isCheck.includes(fee.studentLedgerId)).reduce((a: any, b: any) => a + b.amountPaid, 0);
            let payload: any = { ...values, branchId: branchId, source: "WEB", instituteId: instituteId, studentId: searchStudentState.studentId, studentFeeLedgerIds: isCheck.toString(), totalPaidAmount: total }
            delete payload.className;
            delete payload.sectionName;
            delete payload.curriculumName;
            if (isCheck.length > 0) {
                dispatch(addNewRequesrItFormAct(generateActionPayload('get_itform', undefined, payload)))
            }
            else {
                setError('*Please Select At least one Term Payment');
            }
        },
    });

    const {
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        academicYearListResp,
        studentFeeItFormResp, getStudentsItFormResp, showApiLoader, itFormErrorResp } =
        useAppSelector(({ appData, branchAcademics, feeApprovals,
            instAcademics, globalData }) => ({
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                academicYearListResp: instAcademics.academicYearListResp,
                studentFeeItFormResp: feeApprovals.studentFeeItFormResp,
                getStudentsItFormResp: feeApprovals.getStudentsItFormResp,
                itFormErrorResp: feeApprovals.itFormErrorResp,
                showApiLoader: globalData.showApiLoader,
            }), shallowEqual);


    const handleClick = (e: any) => {
        setError("")
        const { id, checked } = e.target;
        let arr = [...isCheck];
        if (id === "selecteAll") {
            setIsCheckAll(checked);
            if (checked) {
                arr = studentFeeItFormResp ? studentFeeItFormResp.map((fee: any) => fee.studentLedgerId) : arr
            }
            else {
                arr = [];
            }
        }
        else {
            if (!checked) {
                arr = arr.filter((item) => item !== +id);

            } else {
                arr = [...arr, +id];
            }
            if (arr.length === studentFeeItFormResp.length) {
                setIsCheckAll(true)
            }
            else {
                setIsCheckAll(false);
            }
        }
        setIsCheck(arr);
    };

    function onInputSearchChange(inputString: any) {
        const { academicYearId } = AddRequestedListForm.values;

        setStudentFeeError('');
        if (inputString && academicYearId) {
            dispatch(getStudentsItFromAct(generateActionPayload("get_students_it_form", undefined, {
                academicYearId: academicYearId,
                branchId,
                searchString: inputString
            })));
        }
        else {
            AddRequestedListForm.setValues((prev: any) => ({ ...prev, studentId: "", curriculumId: "", classId: "", sectionId: "", className: "", curriculumName: "", sectionName: "" }));
            setIsCheckAll(false)
            dispatch(resetStudentFeeItFormAct(undefined))
        }
    }
    const selectedStudent = (student: any) => {

        const { academicYearId, classId, curriculumId, sectionId, studentId, className, curriculumName, sectionName } = student || {};
        AddRequestedListForm.setValues((prev: any) => ({ ...prev, studentId, curriculumId, classId, sectionId, className, curriculumName, sectionName }));

        setSearchStudentState(student);
        let params = {
            academicYearId: AddRequestedListForm.values.academicYearId,
            studentId: student.studentId
        }
        dispatch(getStudentFeeItFormAct(generateActionPayload('get_student_fees_list', undefined, params)))
    }

    useEffect(() => {
        if (itFormErrorResp && itFormErrorResp.status === 406) {            
            setStudentFeeError(itFormErrorResp.error.details);
        } else {
            setStudentFeeError('');
        }
    }, [itFormErrorResp]);

    useEffect(()=>{
        return () => {
            setStudentFeeError('');
            dispatch(setItFormErrorAct(undefined));
        }
    },[])


    useEffect(() => {
        if (props.isOpen) {
            if (props.currentStudent) {

                AddRequestedListForm.setValues((prev: any) => ({
                    ...prev,
                    academicYearId: props.currentStudent.academicYearId,
                    curriculumId: props.currentStudent.curriculumId,
                    curriculumName: props.currentStudent.curriculumName,
                    className: props.currentStudent.className,
                    sectionId: props.currentStudent.sectionId,
                    sectionName: props.currentStudent.sectionName,
                    classId: props.currentStudent.classId,
                    studentId: props.currentStudent.childId,
                }))

                setSearchStudentState({ ...props.currentStudent, studentCode: props.currentStudent.childCode, studentName: props.currentStudent.childName, studentId: props.currentStudent.childId, });

                getStudentFeeApiCallForParent({ academicYearId: props.currentStudent.academicYearId, studentId: props.currentStudent.childId });
            } else {
                const { academicYearId } = academicYearListResp && academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
                AddRequestedListForm.setFieldValue('academicYearId', academicYearId || "");
            }
        }
        else {
            AddRequestedListForm.resetForm();
            setSearchStudentState({});
            dispatch(resetStudentFeeItFormAct(undefined));
            setIsCheckAll(false);
        }
    }, [props.isOpen])

    const getStudentFeeApiCallForParent = (otherProps?:any)=>{
        const params = {
            academicYearId: AddRequestedListForm.values.academicYearId || props.currentStudent.academicYearId,
            studentId: props.currentStudent.childId , ...otherProps
        }
        dispatch(getStudentFeeItFormAct(generateActionPayload('get_student_fees_list', undefined, params)))
    }

    const handleChange = (event :React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = event.target;
        AddRequestedListForm.setFieldValue(name, value);
        if(props.currentStudent && name === "academicYearId"){
            getStudentFeeApiCallForParent({ academicYearId: value });
        }
    }    
    return (

        <div className="tw-p-5">
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                <div>
                    <SelectInput
                        name="academicYearId"
                        value={AddRequestedListForm.values.academicYearId}
                        onChange={handleChange}
                        menuItems={academicYearListResp?.data || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        labelClass={!!props.currentStudent ? '' : 'required'}
                        // inputClassName="bg-light border-0"
                        // formgroupClassName="mb-0"
                        // isDisabled={props.currentStudent ? true : false}
                        labelText='Academic Year'
                        invalid={(AddRequestedListForm.touched.academicYearId && AddRequestedListForm.errors.academicYearId) ? true : false}
                        error={(AddRequestedListForm.touched.academicYearId && AddRequestedListForm.errors.academicYearId) ? AddRequestedListForm.errors.academicYearId : ""}
                    />
                </div>

                <div>
                    <AutoSearchInput
                        formgroupClassName="tw-mb-3"
                        name="studentId"
                        placeHolder="Search..."
                        onChange={onInputSearchChange}
                        onBlur={AddRequestedListForm.handleBlur}
                        valueKey="studentId"
                        labelKey="studentName"
                        subLabelKey="studentCode"
                        isDisabled={!!props.currentStudent}
                        labelHeader="Student Code"
                        subLabelHeader="Student Name"
                        options={getStudentsItFormResp || []}
                        selected={searchStudentState}
                        selectedOptionCallbck={selectedStudent}
                        labelText="Student"
                        labelClass={!!props.currentStudent ? "" : "required"}
                        invalid={(AddRequestedListForm.touched.studentId && AddRequestedListForm.errors.studentId) ? true : false}
                        error={(AddRequestedListForm.touched.studentId && AddRequestedListForm.errors.studentId) ? AddRequestedListForm.errors.studentId : ""}
                    >
                        <i className="ri-search-line search-icon" />
                    </AutoSearchInput>

                    {studentFeeError && (
                        <div className="tw-text-red-600 tw-text-xs">
                            Note:- {studentFeeError}
                        </div>
                    )}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mt-4">
                <TextInput
                    name="curriculumName"
                    value={AddRequestedListForm.values.curriculumName}
                    isDisabled
                    labelText="Curriculum"
                />

                <TextInput
                    name="className"
                    value={AddRequestedListForm.values.className}
                    isDisabled
                    labelText="Class"
                />
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mt-4">
                <TextInput
                    name="sectionName"
                    value={AddRequestedListForm.values.sectionName}
                    isDisabled
                    labelText="Section"
                />

                <DateInput
                    name="date"
                    value={getYyyyMmDdFormat(new Date())}
                    labelText="Date"
                    inputClassName="tw-bg-gray-100"
                    isReadOnly
                />
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mt-4">
                <div>
                    <SelectInput
                        name="claimedBy"
                        value={AddRequestedListForm.values.claimedBy}
                        onChange={AddRequestedListForm.handleChange}
                        menuItems={[{ claimType: "FATHER" }, { claimType: "MOTHER" }]}
                        valueKey="claimType"
                        textKey="claimType"
                        labelText="Claim By"
                        labelClass="required"
                        invalid={(AddRequestedListForm.touched.claimedBy && AddRequestedListForm.errors.claimedBy) ? true : false}
                        error={(AddRequestedListForm.touched.claimedBy && AddRequestedListForm.errors.claimedBy) ? AddRequestedListForm.errors.claimedBy : ""}
                    />

                    <TextInput
                        name="requestDescription"
                        value={AddRequestedListForm.values.requestDescription}
                        onChange={AddRequestedListForm.handleChange}
                        labelText="Request Description"
                        labelClass="required"
                        formgroupClassName="tw-mb-0"
                        invalid={(AddRequestedListForm.touched.requestDescription && AddRequestedListForm.errors.requestDescription) ? true : false}
                        error={(AddRequestedListForm.touched.requestDescription && AddRequestedListForm.errors.requestDescription) ? AddRequestedListForm.errors.requestDescription : ""}
                    />
                </div>

                <div>
                    <span className="required tw-block tw-text-sm tw-font-medium tw-mb-1">
                        Term Payments
                    </span>

                    <div className="tw-border tw-border-gray-300 tw-rounded tw-p-3">
                        <div className="tw-flex tw-items-center tw-mb-2">
                            <InputCheckbox
                                name="selecteAll"
                                value={isCheckAll}
                                onChange={handleClick}
                                formgroupClassName="tw-mb-0 tw-mr-3"
                                labelName=""
                            />
                            <label htmlFor="selecteAll">Select All</label>
                        </div>

                        {Array.isArray(studentFeeItFormResp) &&
                            studentFeeItFormResp.map((fee: any) => (
                                <div
                                    key={fee.studentLedgerId}
                                    className="tw-grid tw-grid-cols-12 tw-gap-2 tw-mb-2"
                                >
                                    <div className="tw-col-span-1">
                                        <InputCheckbox
                                            name={fee.studentLedgerId.toString()}
                                            value={isCheck.includes(fee.studentLedgerId)}
                                            onChange={handleClick}
                                            formgroupClassName="tw-mb-0 tw-mr-3"
                                            labelName=""
                                            dataId={fee.studentLedgerId}
                                        />
                                    </div>

                                    <div className="tw-col-span-7">
                                        <p>{fee.feeDetails}</p>
                                    </div>

                                    <div className="tw-col-span-4 tw-flex tw-items-center">
                                        <RupeeSvg
                                            width="9px"
                                            height="11px"
                                            fill="#212529"
                                        />
                                        <span className="tw-ml-1">
                                            {getAmountValueWithDecimal(fee.amountPaid)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {error && (
                        <span className="tw-text-red-600 tw-text-sm tw-mt-2 tw-block">
                            {error}
                        </span>
                    )}
                </div>
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={(e: any) => AddRequestedListForm.handleSubmit(e)}
                    disabled={showApiLoader}
                >
                    Submit
                </Button>
            </div>
        </div>


    )
}

export default AddRequestModal
