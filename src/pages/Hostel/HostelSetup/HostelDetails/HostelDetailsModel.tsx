import React, { useState, useEffect, useRef } from "react";
import { useFormik, } from "formik";
import { TextInput } from "../../../../Components/Common";
import * as Yup from 'yup';
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editHostelDetailsListAct, saveHostelDetailsAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  hostelName: "",
  shortName: "",
  hostelType: ""
};

const validationSchema = Yup.object().shape({
  hostelName: Yup.string().required("Hostel Name is required."),
  shortName: Yup.string().required("Short Name Name is required."),
  hostelType: Yup.string().required("Hostel Type is required."),
});

const HostelDetailsModel = (props: any) => {

  const dispatch = useDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelDetailsListByIdResp,
  }: any = useAppSelector(
    ({ globalData, hostelSettings, appData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelDetailsListByIdResp: hostelSettings.getHostelDetailsListByIdResp,
    }),
    shallowEqual
  );
  
  const addHostelDetailsRef = useRef<any>({
    prevGetHostelDetailsListByIdResp : getHostelDetailsListByIdResp,
  })

  useEffect(() => {
    const { prevGetHostelDetailsListByIdResp } = addHostelDetailsRef.current || {};
    if(getHostelDetailsListByIdResp && prevGetHostelDetailsListByIdResp !== getHostelDetailsListByIdResp){
      if(props?.hostelId){
        const { hostelName, shortName, hostelType} = getHostelDetailsListByIdResp || {}
        addHostelDetailsForm.setValues((prev:any)=>({...prev , hostelName, shortName, hostelType}))
  
      }
    }

    addHostelDetailsRef.current.prevGetHostelDetailsListByIdResp = getHostelDetailsListByIdResp;
    
  }, [getHostelDetailsListByIdResp])

  const addHostelDetailsForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if(props?.hostelId){
        dispatch(editHostelDetailsListAct(generateActionPayload("edit_hostel_details_list", { hostelId : props?.hostelId} , { ...values })));
      }else{
        dispatch(saveHostelDetailsAct(generateActionPayload("save_hostel_details", undefined, { branchId , instituteId,...values })));
      }
     },
  });

  return (
    <>
      <form onSubmit={addHostelDetailsForm.handleSubmit}>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">

            <div />

            <div className="tw-col-span-1 md:tw-col-span-2">
              <TextInput
                name="hostelName"
                labelText="Hostel Name"
                labelClass="required"
                value={addHostelDetailsForm.values.hostelName}
                onChange={addHostelDetailsForm.handleChange}
                invalid={(addHostelDetailsForm.touched.hostelName && addHostelDetailsForm.errors.hostelName) ? true : false}
                error={(addHostelDetailsForm.touched.hostelName && addHostelDetailsForm.errors.hostelName) ? addHostelDetailsForm.errors.hostelName : ""}
              
              />
            </div>

            <div className="tw-col-span-1 md:tw-col-span-2">
              <TextInput
                name="shortName"
                labelText="Short Name"
                labelClass="required"
                value={addHostelDetailsForm.values.shortName}
                onChange={addHostelDetailsForm.handleChange}
                onBlur={addHostelDetailsForm.handleBlur}
                invalid={(addHostelDetailsForm.touched.shortName && addHostelDetailsForm.errors.shortName) ? true : false}
                error={(addHostelDetailsForm.touched.shortName && addHostelDetailsForm.errors.shortName) ? addHostelDetailsForm.errors.shortName : ""}
              />
            </div>

            <div className="tw-col-span-1 md:tw-col-span-2">
              <TextInput
                name="hostelType"
                labelText="Hostel Type"
                labelClass="required"
                value={addHostelDetailsForm.values.hostelType}
                onChange={addHostelDetailsForm.handleChange}
                invalid={(addHostelDetailsForm.touched.hostelType && addHostelDetailsForm.errors.hostelType) ? true : false}
                error={(addHostelDetailsForm.touched.hostelType && addHostelDetailsForm.errors.hostelType) ? addHostelDetailsForm.errors.hostelType : ""}
              />
            </div>

          </div>

          <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-mb-1">
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
              onClick={(event: any) => {
                addHostelDetailsForm.handleSubmit(event)}}
              disabled={showApiLoader}
            >
              {props.hostelId ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default HostelDetailsModel;