import { useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Component
import {
    TextArea
} from "../../../../Components/Common";

//Generate Action
import { generateActionPayload } from "../../../../utility/reduxutility";
//Icons
import { default as CancelIcon } from "../../../../assets/imagesdps/academics/CancelIcon.svg?react";

import { createFeeReversalAct } from "../../../../store/fee/feecollections/feecollectionactions";
import Button from "../../../../Components/Common/Button";


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
            const params = { receiptId: receiptInfo.feeReceiptId }, payload = {
                academicYearId: receiptInfo.academicYearId,
                branchId: receiptInfo.branchId,
                branchCurriculumId: receiptInfo.curriculumId,
                studentDetailId: receiptInfo?.studentId,
                studentName: receiptInfo?.studentName,
                receiptNo: receiptInfo.receiptNo,
                branchClassId: receiptInfo.classId,
                paymentMode: receiptInfo.paymentMode,
                actualPaidAmount: receiptInfo.totalPaidAmount,
                remarks: values.remarks,
            }
            dispatch(createFeeReversalAct(generateActionPayload("create_hostel_fee_revercal", params, payload)));
        },
    });


    useEffect(() => {
        if (!props.isOpen) {
            feeReversalForm.resetForm();
        }
    }, [props.isOpen]);

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

                    <h5 className="tw-mb-2 tw-text-lg tw-font-semibold">
                        Are you sure?
                    </h5>

                    <span className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-600">
                        You want to do the fee reversal.
                    </span>

                   <TextArea
                        name="remarks"
                        value={feeReversalForm.values.remarks}
                        onChange={feeReversalForm.handleChange}
                        // isReadOnly={true}
                        inputClassName="tw-bg-gray-100 tw-w-full"
                        formgroupClassName="tw-w-[70%]"
                        invalid={(feeReversalForm.touched.remarks && feeReversalForm.errors.remarks) ? true : false}
                        error={(feeReversalForm.touched.remarks && feeReversalForm.errors.remarks) ? feeReversalForm.errors.remarks : ""}

                    >
                    </TextArea>
                    <div className="tw-text-center tw-mt-4">
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
                            variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </form>


        </>
    )
}