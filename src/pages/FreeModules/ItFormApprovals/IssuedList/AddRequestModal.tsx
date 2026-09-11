import React, { useEffect } from 'react'
import { DateInput, SelectInput, TextInput } from '../../../../Components/Common'
import { useFormik } from 'formik';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { updateItFormAct } from '../../../../store/fee/feeapprovals/feeapprovalactions';
import { getYyyyMmDdFormat } from '../../../../utility/dateutility';
import { setUpdateItFormAct } from '../../../../store/fee/feeapprovals/feeapprovalsslice';
import Button from '../../../../Components/Common/Button';


const initialValues = {
    academicYearId: "",
    curriculumId: "",
    curriculumName: "",
    classId: "",
    className: "",
    sectionId: "",
    sectionName: "",
    date: "",
    claimedBy: "",
    requestDescription: "",
    studentName: "",
}
const AddRequestModal = (props: any) => {

    const dispatch = useDispatch();

    const AddRequestedListForm = useFormik({
        initialValues: initialValues,
        onSubmit: (values) => {
            const payload = {
                claimedBy: values.claimedBy,
                requestDescription: values.requestDescription,
            }
            if (props.id) {
                dispatch(updateItFormAct(generateActionPayload('update_itform', { itFormId: props.id }, payload)))
            }
        },
    });

    const {
        academicYearListResp, showApiLoader, issuedITFormListResp } =
        useAppSelector(({ feeApprovals,
            instAcademics, globalData }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                showApiLoader: globalData.showApiLoader,
                issuedITFormListResp: feeApprovals.issuedITFormListResp,
            }), shallowEqual);


    useEffect(()=>{
        if(issuedITFormListResp && props.id){
            const data = issuedITFormListResp.content.find((itForm: any) => +itForm.id === +props.id);
            AddRequestedListForm.setFieldValue("academicYearId", data.academicYearId);
            AddRequestedListForm.setFieldValue("studentName", data.studentName);
            AddRequestedListForm.setFieldValue("curriculumName", data.curriculumName);
            AddRequestedListForm.setFieldValue("className", data.className);
            AddRequestedListForm.setFieldValue("sectionName", data.sectionName);
            AddRequestedListForm.setFieldValue("date", data.modifiedDate ? getYyyyMmDdFormat(data.modifiedDate) : getYyyyMmDdFormat(data.requestDate));
            AddRequestedListForm.setFieldValue("claimedBy", data.claimedBy);
            AddRequestedListForm.setFieldValue("requestDescription", data.requestDescription);
            
        }
    },[issuedITFormListResp, props.id])

    useEffect(() => {
            return () => {
                dispatch(setUpdateItFormAct(undefined))
            }
        }, [])


    return (

        <div className="tw-p-5">
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                <div>
                    <SelectInput
                        name="academicYearId"
                        value={AddRequestedListForm.values.academicYearId}
                        onChange={undefined}
                        menuItems={academicYearListResp?.data || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        labelClass="required"
                        labelText="Academic Year"
                        isDisabled
                    />
                </div>

                <div>
                    <TextInput
                        name="studentName"
                        value={AddRequestedListForm.values.studentName}
                        onChange={undefined}
                        isDisabled
                        labelText="Student"
                        labelClass="required"
                    />
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mt-4">
                <TextInput
                    name="curriculumName"
                    value={AddRequestedListForm.values.curriculumName}
                    onChange={undefined}
                    isDisabled
                    labelText="Curriculum"
                    labelClass="required"
                />

                <TextInput
                    name="className"
                    value={AddRequestedListForm.values.className}
                    onChange={undefined}
                    isDisabled
                    labelText="Class"
                    labelClass="required"
                />
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mt-4">
                <TextInput
                    name="sectionName"
                    value={AddRequestedListForm.values.sectionName}
                    onChange={undefined}
                    isDisabled
                    labelText="Section"
                    labelClass="required"
                />

                <DateInput
                    name="date"
                    value={AddRequestedListForm.values.date}
                    labelText="Date"
                    labelClass="required"
                    inputClassName="tw-bg-gray-100"
                    isReadOnly
                />
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mt-4">
                <SelectInput
                    name="claimedBy"
                    value={AddRequestedListForm.values.claimedBy}
                    onChange={AddRequestedListForm.handleChange}
                    menuItems={[{ claimType: "FATHER" }, { claimType: "MOTHER" }]}
                    valueKey="claimType"
                    textKey="claimType"
                    labelText="Claim By"
                    labelClass="required"
                />

                <TextInput
                    name="requestDescription"
                    value={AddRequestedListForm.values.requestDescription}
                    onChange={AddRequestedListForm.handleChange}
                    labelText="Request Description"
                    labelClass="required"
                    formgroupClassName="tw-mb-0"
                />
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
                    variant='primary'
                    onClick={(event: any) => AddRequestedListForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    Submit
                </Button>
            </div>
        </div>


    )
}

export default AddRequestModal
