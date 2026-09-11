import  { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
import { default as CancelIcon } from "../../../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { TextInput } from "../../../../../Components/Common";
import { saveIPRestrictionAct } from "../../../../../store/usermanagement/usermanagementactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { userManagement } from "../../../../../api/apiurl/usermanagement";
import Button from "../../../../../Components/Common/Button";


const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks are required."),
});

const initialValues = { remarks: "" };
export default function BlockIpModal(props: any) {
    
    const dispatch = useAppDispatch();

    const {
        showApiLoader, getLoginHistoryResp } =
        useAppSelector(({  globalData, userManagement }) => ({
            showApiLoader: globalData.showApiLoader,
            getLoginHistoryResp: userManagement.getLoginHistoryResp
        }), shallowEqual);

    const feeReversalForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const  blockId  = props.modalData
      const modalData = getLoginHistoryResp?.data?.find(
        (item: any) => +item.id == +blockId
      );
             const payload = {
                  userName: modalData?.userName,
                  ipAddress:modalData?.ipAddress,
                  loginSource: modalData?.source,
                  remarks: values.remarks
                }
                
                  dispatch(
                    saveIPRestrictionAct(
                          generateActionPayload("save_ip_restriction",undefined,payload)
                      )
                  );
        },
    });

    useEffect(() => {
        if (!props.isOpen) {
            feeReversalForm.resetForm();
        }
    }, [props.isOpen]);

    return (
        <>
            <form onSubmit={feeReversalForm.handleSubmit} className="p-3">
                <div className="tw-flex tw-flex-col tw-items-center tw-text-center">
                    <div className="tw-flex tw-mb-4">
                        <CancelIcon style={{ height: "70px", width: "70px" }} />
                    </div>
                    <h5 className="tw-mb-2 tw-font-semibold">
                        Are you sure?
                    </h5>
                    <span className="tw-mb-3 tw-text-gray-600">
                        You want to block this IP
                    </span>
                    <TextInput
                        name="remarks"
                        value={feeReversalForm.values.remarks}
                        onChange={feeReversalForm.handleChange}
                        inputClassName="tw-bg-gray-100 tw-w-full"
                        formgroupClassName="tw-w-[70%]"
                        invalid={(feeReversalForm.touched.remarks && feeReversalForm.errors.remarks) ? true : false}
                        error={(feeReversalForm.touched.remarks && feeReversalForm.errors.remarks) ? feeReversalForm.errors.remarks : ""}
                    />
                    <div className="tw-flex tw-justify-end tw-mt-2 tw-gap-3">
                        <Button type="button" variant="secondary" onClick={props.toggle}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="tw-px-2 tw-py-1"
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