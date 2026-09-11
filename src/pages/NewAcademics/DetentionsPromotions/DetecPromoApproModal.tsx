import React, { useEffect, useState } from "react";
import {
  TextInput,
  UserDetails,
} from "../../../Components/Common";
import {
  DetecPromoApproModalFilterhProps,
  DetectionPromotionModalProps,
} from "./DetectionPromotionTypes";
import { useFormik } from "formik";
import { shallowEqual, useDispatch } from "react-redux";
import { setApproveRejectPromotionDetentionReq } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import Button from "../../../Components/Common/Button";

const initialValues: DetecPromoApproModalFilterhProps = {
  remarks: "",
};

const DetecPromoApproModal = (props: DetectionPromotionModalProps) => {
  const dispatch = useDispatch();
  const [detecPromoApproModalFilterState, setDetecPromoApproModalFilterState] =
    useState<DetecPromoApproModalFilterhProps>(initialValues);
  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, showApiLoader }: any =
    useAppSelector(
      ({ appData, instAcademics, globalData, classroomManagmentInfo }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        showApiLoader: globalData.showApiLoader,
      }),
      shallowEqual
    );

  const DetecPromoApproModalFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: detecPromoApproModalFilterState,
    onSubmit: (values) => {
      const payload = {
        id: props.studentDetails?.id,
        studentId: props.studentDetails.studentId,
        eligibilityStatusDetentionAndPromotion: props.studentDetails.eligibilityStatusDetentionAndPromotion,
        approvedStatus: props.submitText === "Approve" ? "APPROVED" : "REJECTED",
        remarks: values.remarks,
        branchId: branchId,
        curriculumId: props.studentDetails.curriculumId
      }
      dispatch(setApproveRejectPromotionDetentionReq(generateActionPayload('approve_reject_promotion_detention_req', undefined, payload)))
    },
  });

  useEffect(() => {
    if (!props.isOpen) {
      DetecPromoApproModalFilterForm.resetForm();
    }
  }, [props.isOpen])

  return (
    <>

      <div className="tw-p-5">

        <div className="tw-flex tw-flex-col">

          <div className="tw-flex tw-mb-4">
            <UserDetails
              imageUrl={props.studentDetails?.thumbnailImage}
              displayName={props.studentDetails?.studentName}
              displayId={props.studentDetails?.studentCode}
              defaultImgType="student"
            />
          </div>

          <div className="tw-grid tw-grid-cols-2 tw-gap-y-3">

            <h6 className="tw-font-medium">From Class:</h6>
            <p className="tw-text-base">
              {props.studentDetails?.fromClass}
            </p>

            <h6 className="tw-font-medium">Detained/Promoted:</h6>
            <p className="tw-text-base">
              {props.studentDetails?.eligibilityStatusDetentionAndPromotion}
            </p>

            <h6 className="tw-font-medium">Detained To / Promoted To:</h6>
            <p className="tw-text-base">
              {props.studentDetails?.toClass}
            </p>

          </div>

          <div className="tw-mt-4">
            <TextInput
              name="remarks"
              labelText="Remarks"
              value={DetecPromoApproModalFilterForm.values.remarks}
              onChange={DetecPromoApproModalFilterForm.handleChange}
            />
          </div>

        </div>

        <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4">

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
            onClick={(event: any) =>
              DetecPromoApproModalFilterForm.handleSubmit(event)
            }
            disabled={showApiLoader}
          >
            {props.submitText}
          </Button>

        </div>
      </div>

    </>
  );
};

export default DetecPromoApproModal;
