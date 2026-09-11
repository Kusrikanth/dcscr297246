import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Common Component
import {
    TextArea
} from "../../../Components/Common";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
//Icons
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";

import { createFeeReversalAct } from "../../../store/fee/feecollections/feecollectionactions";
import Button from "../../../Components/Common/Button";


const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks are required."),
});


const initialValues = { remarks: "" };
export default function FeeReversalModal(props: any) {
    const dispatch = useAppDispatch();

    const {
        showApiLoader,
        createFeeReversalResp } =
        useAppSelector(({ feeCollections, globalData }) => ({
            createFeeReversalResp: feeCollections.createFeeReversalResp,
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    const deactivateAccountRespref = useRef<any>({
        prevCreateFeeReversalResp: createFeeReversalResp
    });
    useEffect(() => {
        const { prevCreateFeeReversalResp } = deactivateAccountRespref.current;
        if (createFeeReversalResp && prevCreateFeeReversalResp !== createFeeReversalResp) {
            toast.success("Fee reversal completed successfully.")
            props.toggle(true);
        }
        deactivateAccountRespref.current.prevCreateFeeReversalResp = createFeeReversalResp;
    }, [createFeeReversalResp]);


    const feeReversalForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { receiptInfo = {} } = props;
            const params = { receiptId: receiptInfo.id }, payload = {
                academicYearId: receiptInfo.academicYearId,
                branchId: receiptInfo.branchId,
                branchCurriculumId: receiptInfo.branchCurriculumId,
                studentDetailId: receiptInfo?.studentDetail?.id,
                studentName: receiptInfo?.studentDetail?.name,
                receiptNo: receiptInfo.receiptNumber,
                branchClassId: receiptInfo.branchClassId,
                paymentMode: receiptInfo.paymentMode,
                actualPaidAmount: receiptInfo.actualPaidAmount,
                remarks: values.remarks,
            }
            dispatch(createFeeReversalAct(generateActionPayload("create_fee_reversal", params, payload)));
        },
    });


    useEffect(() => {
        if (!props.isOpen) {
            feeReversalForm.resetForm();
        }
    }, [props.isOpen]);


    const { isUserActive } = props;
    return (
        <>

            <form
                onSubmit={feeReversalForm.handleSubmit}
                className="tw-p-5"
            >
                <div className="tw-flex tw-flex-col tw-items-center">
                    <div className="tw-flex tw-mb-4">
                        <CancelIcon className="tw-h-[70px] tw-w-[70px]" />
                    </div>

                    <h5 className="tw-mb-2">Are you sure?</h5>

                    <span className="tw-font-normal tw-mb-3 tw-text-center">
                        You want to do the fee reversal.
                    </span>

                    <TextArea
                        name="remarks"
                        value={feeReversalForm.values.remarks}
                        onChange={feeReversalForm.handleChange}
                        inputClassName="tw-bg-gray-100 tw-w-full"
                        formgroupClassName="tw-w-[70%]"
                        invalid={(feeReversalForm.touched.remarks && feeReversalForm.errors.remarks) ? true : false}
                        error={(feeReversalForm.touched.remarks && feeReversalForm.errors.remarks) ? feeReversalForm.errors.remarks : ""}
                    />

                    <div className="tw-flex tw-justify-center tw-mt-4 tw-gap-4">
                        <Button
                            type="button"
                            disabled={showApiLoader}
                            onClick={props.toggle}
                            variant="secondary"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={showApiLoader}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </form>


        </>
    )
}