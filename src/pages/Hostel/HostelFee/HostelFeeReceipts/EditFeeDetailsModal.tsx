import  { useEffect, useRef } from 'react';
import { shallowEqual } from "react-redux";
import { DateInput, TextArea, TextInput } from '../../../../Components/Common'
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { updateFeeReceiptAct } from "../../../../store/fee/feecollections/feecollectionactions";

//Utility
import { getYyyyMmDdFormat } from "../../../../utility/dateutility";
import Button from '../../../../Components/Common/Button';

const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Description is required."),
    receiptDate: Yup.string().required("Receipt date is required."),
});

function getEditHostelFeeDetailsForms(editData?: any) {
    return (
        {
            receiptNumber: editData?.receiptNo || "",
            studentName: editData?.studentName || "",
            remarks: editData?.remarks || "",
            receiptDate: getYyyyMmDdFormat(editData?.receiptDate),
        }
    )
}

const initialValues = getEditHostelFeeDetailsForms();
const EditFeeDetailsModal = (props: any) => {

    const dispatch = useAppDispatch();
    const { updateFeeReceiptResp , showApiLoader } =
        useAppSelector(({ feeCollections,globalData }) => ({
            updateFeeReceiptResp: feeCollections.updateFeeReceiptResp,
            showApiLoader : globalData.showApiLoader,
        }), shallowEqual);

    const editHostelFeeDetailsRespRef = useRef<any>({
        prevUpdateFeeReceiptResp: updateFeeReceiptResp,
    });
    useEffect(() => {
        const { prevUpdateFeeReceiptResp } = editHostelFeeDetailsRespRef.current;
        if (updateFeeReceiptResp && prevUpdateFeeReceiptResp !== updateFeeReceiptResp) {
            props.toggle(true);
            toast.success("Fee receipt updated successfully.");
        }
        editHostelFeeDetailsRespRef.current.prevUpdateFeeReceiptResp = updateFeeReceiptResp;
    }, [updateFeeReceiptResp]);


    useEffect(() => {
        const { editFeeDetails } = props;
        if (editFeeDetails) {
            const editFormData = getEditHostelFeeDetailsForms(editFeeDetails);
            editHostelFeeDetailForm.setValues((prevState: any) => ({ ...prevState, ...editFormData }));
        }
    }, [props.editFeeDetails])

    const editHostelFeeDetailForm: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
              const  { remarks, receiptDate } = values,
                payload = {
                    description:remarks,
                    receiptDate,
                    receiptId : props.feeReceiptId,
                };
            dispatch(updateFeeReceiptAct(generateActionPayload("update_hostel_fee_receipt", undefined, payload)));
        },
    });

    return (
        <form onSubmit={editHostelFeeDetailForm.handleSubmit}>
            <div className="tw-p-4">
                <div className='tw-grid tw-grid-cols-1'>
                    <div className='tw-col-span-1 tw-mb-3'>
                        <TextInput
                            name="receiptNumber"
                            value={editHostelFeeDetailForm.values.receiptNumber}
                            formgroupClassName="tw-mb-0"
                            onChange={undefined}
                            isDisabled={true}
                            labelText='Fee Receipt No.'
                            // labelClass='tw-font-bold'
                        />
                    </div>
                    <div className='tw-col-span-1 tw-mb-3'>
                        <TextInput
                            name="studentName"
                            value={editHostelFeeDetailForm.values.studentName}
                            formgroupClassName="tw-mb-0"
                            onChange={undefined}
                            isDisabled={true}
                            labelText='Student'
                            // labelClass='tw-font-bold'
                        />
                    </div>
                    <div className='tw-col-span-1 tw-mb-3'>
                        <TextArea
                            name="remarks"
                            labelText='Description'
                            value={editHostelFeeDetailForm.values.remarks}
                            onChange={editHostelFeeDetailForm.handleChange}
                            onBlur={editHostelFeeDetailForm.handleBlur}
                            formgroupClassName='tw-mb-0'
                            invalid={(editHostelFeeDetailForm.touched.remarks && editHostelFeeDetailForm.errors.remarks) ? true : false}
                            error={(editHostelFeeDetailForm.touched.remarks && editHostelFeeDetailForm.errors.remarks) ? editHostelFeeDetailForm.errors.remarks : ""}
                        />
                    </div>
                    <div className='tw-col-span-1'>
                        <DateInput
                            name="receiptDate"
                            value={editHostelFeeDetailForm.values.receiptDate}
                            onChange={editHostelFeeDetailForm.handleChange}
                            onBlur={editHostelFeeDetailForm.handleBlur}
                            labelText="Date & Time"
                            invalid={(editHostelFeeDetailForm.touched.receiptDate && editHostelFeeDetailForm.errors.receiptDate) ? true : false}
                            error={(editHostelFeeDetailForm.touched.receiptDate && editHostelFeeDetailForm.errors.receiptDate) ? editHostelFeeDetailForm.errors.receiptDate : ""}
                        />
                    </div>

                </div>
            </div>

            <div className="modal-footer modal-footer-shadow">
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
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default EditFeeDetailsModal
