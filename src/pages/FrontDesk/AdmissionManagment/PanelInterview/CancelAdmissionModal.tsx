import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import classnames from "classnames";
import { SelectInput, TextInput, ModalContainerUpdated, TextArea } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import TableContainer from "../../../../Components/Common/TableContainer";
import { default as Export2Svg } from "../../../../assets/imagesdps/academics/Exports2.svg?react";

import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { default as ApproveSvg } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { default as CrossSvg } from "../../../../assets/imagesdps/academics/CrossSvg.svg?react";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getChequeHistoryAct, approveRejectChequeAct
} from "../../../../store/fee/feeapprovals/feeapprovalactions";
//Common Utility
import { getSortingKeys } from "../../../../utility/commonutility";
//Icons
import { default as CancelIcon } from "../../../../assets/imagesdps/academics/CancelIcon.svg?react";

import { default as ApproveIcon } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks are required."),
});

const initialValues = { remarks: "" };
const CancelAdmissionModal = (props: any) => {
    const cancelAdmissionModalForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            props.confirmHndlr(values);
        },
    });

    const { isApprovedAction } = props;
    return (
        <>
            <form onSubmit={cancelAdmissionModalForm.handleSubmit}>
                <div className="tw-p-4">
                    <div className="tw-flex tw-flex-col tw-items-center">
                        <div className="tw-flex tw-mb-2">
                            <CancelIcon className="tw-h-[70px] tw-w-[70px]" />
                        </div>
                        <h5 className="tw-flex-grow-1 tw-mb-2 tw-text-lg tw-font-semibold">Are you sure?</h5>
                        <span className="tw-flex-grow-1 tw-font-normal tw-mb-3">
                            You want to Cancel this Admission?
                        </span>
                        <TextArea
                            name="remarks"
                            value={cancelAdmissionModalForm.values.remarks}
                            onChange={cancelAdmissionModalForm.handleChange}
                            inputClassName="tw-bg-gray-100 tw-w-full"
                            formgroupClassName="tw-w-7/10"
                            invalid={cancelAdmissionModalForm.touched.remarks && cancelAdmissionModalForm.errors.remarks ? true : false}
                            error={cancelAdmissionModalForm.touched.remarks && cancelAdmissionModalForm.errors.remarks ? cancelAdmissionModalForm.errors.remarks : ""}
                        />
                    </div>
                </div>

                <div className="tw-border-t tw-shadow-inner tw-py-3 tw-flex tw-justify-center">
                    <div className="tw-flex tw-gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </form>

        </>
    );
};

export default CancelAdmissionModal;
