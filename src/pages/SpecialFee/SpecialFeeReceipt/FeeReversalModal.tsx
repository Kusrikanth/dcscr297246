import  { useEffect } from "react";
import { shallowEqual } from "react-redux";
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
        showApiLoader } =
        useAppSelector(({  globalData }) => ({
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    const feeReversalForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { receiptId } = props;
            const params = { receiptId }, payload = {
                remarks: values.remarks,
            }
            dispatch(createFeeReversalAct(generateActionPayload("create_special_fee_reversal", params, payload)));
        },
    });

    useEffect(() => {
        if (!props.isOpen) {
            feeReversalForm.resetForm();
        }
    }, [props.isOpen]);

    return (
        <>
            <form onSubmit={feeReversalForm.handleSubmit} className="tw-p-4">
                <div className="tw-flex tw-flex-col tw-items-center">
                    <div className="tw-flex tw-mb-6">
                        <CancelIcon style={{ height: "70px", width: "70px" }} />
                    </div>

                    <h5 className="tw-font-medium tw-mb-2">
                        Are you sure?
                    </h5>

                    <span className="tw-text-gray-600 tw-mb-4">
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

                    <div className="tw-gap-2 tw-flex tw-text-center tw-mt-6">
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
                            disabled={showApiLoader}
                            variant="reject"
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </form>
        </>
    )
}