
import React, { useEffect, useMemo, useRef } from "react";
import { TextArea } from "../../../Components/Common";
import { default as ApproveSvg } from '../../../assets/imagesdps/academics/ApproveSvg.svg?react'
import { shallowEqual, useDispatch } from "react-redux";
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { generateActionPayload } from "../../../utility/reduxutility";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { apprRejChangeCampusAct } from "../../../store/academic/academicRequest/academicrequestactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { toast } from "react-toastify";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  remarks: Yup.string().required("Remarks are required."),
});
const initialValues = { remarks: "" };

const ChangeCampusConfirmModal = (props: any) => {
  const { isCurrentCampus, modalData } = props || {},
    { changeCampusId, modalType } = modalData || {};
  const dispatch = useAppDispatch();
  const { showApiLoader, apprRejChangeCampusResp } =
    useAppSelector(({ globalData, academicRequest }) => ({
      showApiLoader: globalData.showApiLoader,
      apprRejChangeCampusResp: academicRequest.apprRejChangeCampusResp,
    }), shallowEqual);

  const respRef = useRef({ prevApprRejChangeCampusResp: apprRejChangeCampusResp });

  useEffect(() => {
    const { prevApprRejChangeCampusResp } = respRef.current;
    if (apprRejChangeCampusResp && apprRejChangeCampusResp !== prevApprRejChangeCampusResp) {
      if (modalType === "APPROVED") {
        toast.success("Campus transfter approved successfully");
        props.toggle(true, modalData, apprRejChangeCampusResp);
      } else if (modalType === "REJECTED") {
        toast.success("Campus transfter rejected successfully");
        props.toggle(true);
      }
    }
    respRef.current.prevApprRejChangeCampusResp = apprRejChangeCampusResp;
  }, [apprRejChangeCampusResp, modalData]);

  const confirmRequestFrom = useFormik({
    enableReinitialize: false,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      let payload = {
        approvedStatus: modalType,
        remarks: values.remarks
      }
      dispatch(apprRejChangeCampusAct(generateActionPayload("appr_rej_campus", {
        changeCampusId, isCurrentCampus
      }, payload)))
    },
  });
  return (
    <form onSubmit={confirmRequestFrom.handleSubmit}>
      <div className="tw-flex tw-flex-col tw-items-center tw-p-6">

        <div className="tw-flex tw-mb-4">
          {modalType === "APPROVED" && (
            <ApproveSvg
              style={{ height: "70px", width: "70px" }}
              fill="#16A99A"
            />
          )}
          {modalType === "REJECTED" && (
            <CancelIcon style={{ height: "70px", width: "70px" }} />
          )}
        </div>

        <h5 className="tw-mb-2 tw-text-lg tw-font-semibold">
          Are you sure?
        </h5>

        <span className="tw-mb-4 tw-text-sm tw-text-gray-600">
          {modalType === "APPROVED" &&
            "You want to Approve Change Campus Request !"}
          {modalType === "REJECTED" &&
            "You want to Reject Change Campus Request !"}
        </span>

        <TextArea
          name="remarks"
          value={confirmRequestFrom.values.remarks}
          onChange={confirmRequestFrom.handleChange}
          inputClassName="tw-bg-gray-100 tw-w-full tw-rounded-md tw-border tw-border-gray-300 tw-p-2"
          formgroupClassName="tw-w-[70%]"
          invalid={(confirmRequestFrom.touched.remarks && confirmRequestFrom.errors.remarks) ? true : false}
          error={(confirmRequestFrom.touched.remarks && confirmRequestFrom.errors.remarks) ? confirmRequestFrom.errors.remarks : ""}

        />

        <div className="tw-mt-6 tw-flex tw-justify-center tw-gap-3">

          <Button
            type="button"
            variant="secondary"
            disabled={showApiLoader}
            onClick={props.toggle}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={showApiLoader}
            variant={modalType === "APPROVED" ? "primary" : "reject"}
            
          >
            {modalType === "APPROVED"
              ? "Yes Approve it !"
              : "Yes Reject it !"}
          </Button>

        </div>
      </div>
    </form>
  );
};

export default ChangeCampusConfirmModal;

