import React, { useEffect, useState } from "react";
import { ConfirmationModalProps } from "./PreliminaryScrutinyTypes";

import { shallowEqual, useDispatch } from "react-redux";
import * as Yup from 'yup';
import { useFormik } from "formik";
import {  TextIconInput } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { acceptAdmissionApproval, setPreviewConsolidatedForm } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { useAppSelector } from "../../../../hooks/storehook";
import Button from "../../../../Components/Common/Button";



const initialValue: any = {
  remarks: ""
}

const ConfirmationModalPreliminaryScrutinty = (props: ConfirmationModalProps) => {

const {  isOpen} = props;
const dispatch = useDispatch();
const [initialValues, setInitialValues] = useState<any>(initialValue)
const validationSchema = Yup.object().shape({
  remarks: Yup.string().required('Remarks is required')
})
const CashApprovalForm = useFormik({
  initialValues,
  // validationSchema,
  enableReinitialize: true,
  onSubmit: (values) => {
    
    
  },
});

const submitHandler=(status:any)=>{
  const payload = {
    scrutinyId : props?.scrutinyId,
    remarks : CashApprovalForm?.values?.remarks ||  "",
    approvalStatus : status
  }

  dispatch(acceptAdmissionApproval(generateActionPayload('accept_admission_approve',undefined, payload)));
}
const {
  previewConsolidatedView,
  applicationSaleError,
  currentBranchIdResp: branchId,
  currentInstIdResp: instituteId,
  preliminaryScrutinyById,
}: any = useAppSelector(
  ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, feeConcession, feeCollections, applicationSale }) => ({
      previewConsolidatedView: applicationSale.previewConsolidatedView,
      preliminaryScrutinyById: applicationSale.preliminaryScrutinyById,
      applicationSaleError: applicationSale.applicationSaleError,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
  }),
  shallowEqual
);

useEffect(()=>{
  
  if(props.studentRegId){
    dispatch(setPreviewConsolidatedForm(generateActionPayload('preview_consolidated_view',{studentRegId:props.studentRegId})))
  }

},[props.studentRegId])

useEffect(() => {
if(preliminaryScrutinyById?.headDeptApproveRemarks){
  setInitialValues({remarks : preliminaryScrutinyById?.headDeptApproveRemarks})
}
}, [preliminaryScrutinyById])
    
  useEffect(() => {
    
    if(!isOpen){
      setInitialValues(initialValue)
      CashApprovalForm.resetForm();
    }
  }, [isOpen])
    
  return (
    <>

        <div className="tw-flex tw-flex-col tw-items-center">

          <div dangerouslySetInnerHTML={{ __html: previewConsolidatedView }}>
          </div>

          <div className="tw-mt-4 tw-w-1/2">
            <TextIconInput
              name="remarks"
              value={CashApprovalForm.values.remarks}
              onChange={CashApprovalForm.handleChange}
              invalid={(CashApprovalForm.touched.remarks && CashApprovalForm.errors.remarks) ? true : false}
              error={(CashApprovalForm.touched.remarks && CashApprovalForm.errors.remarks) ? CashApprovalForm.errors.remarks : ""}
              inputClassName="tw-w-full"
              placeHolder="Remarks"
              maxLength={500}
              formgroupClassName="tw-w-full"
            >
              <i className="ri-pencil-line tw-text-gray-400"></i>
            </TextIconInput>
          </div>

          <div className="tw-flex tw-my-3">
            <Button
            variant="primary"
              onClick={() => submitHandler("APPROVED")}
            >
              Approve
            </Button>
            <Button
            variant="warning"
              onClick={() => submitHandler("ON_HOLD")}
            >
              On Hold
            </Button>
            <Button
            variant="reject"
              onClick={() => submitHandler("REJECTED")}
            >
              Reject
            </Button>
          </div>
        </div>

    </>
  );
};

export default ConfirmationModalPreliminaryScrutinty;
