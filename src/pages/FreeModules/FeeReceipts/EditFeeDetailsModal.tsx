import React, { useState, useEffect, useRef } from 'react';
import { shallowEqual } from "react-redux";
import { DateInput, TextArea, TextInput } from '../../../Components/Common'
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { updateFeeReceiptAct } from "../../../store/fee/feecollections/feecollectionactions";

//Utility
import { getYyyyMmDdFormat } from "../../../utility/dateutility";
import Button from '../../../Components/Common/Button';

const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks is required."),
    receiptDate: Yup.string().required("Receipt date is required."),
});

function getEditFeeDetailsForms(editData?: any) {
    return (
        {
            receiptNumber: editData?.receiptNumber || "",
            studentName: editData?.studentDetail?.name || "",
            remarks: editData?.remarks || "",
            receiptDate: getYyyyMmDdFormat(editData?.receiptDate),
        }
    )
}

const initialValues = getEditFeeDetailsForms();
const EditFeeDetailsModal = (props: any) => {

    const dispatch = useAppDispatch();
    const { updateFeeReceiptResp } =
        useAppSelector(({ feeCollections }) => ({
            updateFeeReceiptResp: feeCollections.updateFeeReceiptResp
        }), shallowEqual);

    const editFeeDetailsRespRef = useRef<any>({
        prevUpdateFeeReceiptResp: updateFeeReceiptResp,
    });
    useEffect(() => {
        const { prevUpdateFeeReceiptResp } = editFeeDetailsRespRef.current;
        if (updateFeeReceiptResp && prevUpdateFeeReceiptResp !== updateFeeReceiptResp) {
            props.toggle(true);
            toast.success("Fee receipt updated successfully.");
        }
        editFeeDetailsRespRef.current.prevUpdateFeeReceiptResp = updateFeeReceiptResp;
    }, [updateFeeReceiptResp]);


    useEffect(() => {
        const { editFeeDetails } = props;
        if (editFeeDetails) {
            const editFormData = getEditFeeDetailsForms(editFeeDetails);
            editFeeDetailForm.setValues((prevState: any) => ({ ...prevState, ...editFormData }));
        }
    }, [props.editFeeDetails])

    const editFeeDetailForm: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const params = { receiptId: props.feeReceiptId },
                { remarks, receiptDate } = values,
                payload = {
                    remarks,
                    receiptDate
                };
            dispatch(updateFeeReceiptAct(generateActionPayload("update_fee_receipt", params, payload)));
        },
    });

    return (
        <form onSubmit={editFeeDetailForm.handleSubmit}>
            <div className="tw-p-4">
                <div className="tw-flex tw-flex-wrap">
                    <div className="tw-w-full tw-mb-3">
                        <TextInput
                            name="receiptNumber"
                            value={editFeeDetailForm.values.receiptNumber}
                            formgroupClassName="tw-mb-0"
                            onChange={undefined}
                            isDisabled={true}
                            labelText="Fee Receipt No."
                        />
                    </div>

                    <div className="tw-w-full tw-mb-3">
                        <TextInput
                            name="studentName"
                            value={editFeeDetailForm.values.studentName}
                            formgroupClassName="tw-mb-0"
                            onChange={undefined}
                            isDisabled={true}
                            labelText="Student"
                        />
                    </div>

                    <div className="tw-w-full tw-mb-3">
                        <TextArea
                            name="remarks"
                            labelText="Description"
                            value={editFeeDetailForm.values.remarks}
                            onChange={editFeeDetailForm.handleChange}
                            onBlur={editFeeDetailForm.handleBlur}
                            formgroupClassName='mb-0'
                            invalid={(editFeeDetailForm.touched.remarks && editFeeDetailForm.errors.remarks) ? true : false}
                            error={(editFeeDetailForm.touched.remarks && editFeeDetailForm.errors.remarks) ? editFeeDetailForm.errors.remarks : ""}
                        />
                    </div>

                    <div className="tw-w-full">
                        <DateInput
                            name="receiptDate"
                            value={editFeeDetailForm.values.receiptDate}
                            onChange={editFeeDetailForm.handleChange}
                            onBlur={editFeeDetailForm.handleBlur}
                            labelText="Date & Time"
                            invalid={(editFeeDetailForm.touched.receiptDate && editFeeDetailForm.errors.receiptDate) ? true : false}
                            error={(editFeeDetailForm.touched.receiptDate && editFeeDetailForm.errors.receiptDate) ? editFeeDetailForm.errors.receiptDate : ""}
                        />
                    </div>
                </div>
            </div>

            <div className="tw-border-t tw-border-gray-200 tw-p-4 tw-shadow-inner">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="button"
                        variant='secondary'
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default EditFeeDetailsModal
