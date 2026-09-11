import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, useFormik, } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import * as Yup from 'yup';
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editHostelBuildingListAct, saveHostelBuildingAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  hostelId: "",
  buildingName: ""
};

const validationSchema = Yup.object().shape({
  hostelId: Yup.string().required("Hostel Name is required."),
  buildingName: Yup.string().required("Hostel Type is required."),
});

const HostelBuildingModel = (props: any) => {

  const dispatch = useDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelDetailsResp,
    getHostelBuildingListByIdResp,
  }: any = useAppSelector(
    ({ globalData, hostelSettings, appData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelBuildingListByIdResp: hostelSettings.getHostelBuildingListByIdResp,
    }),
    shallowEqual
  );
  
  const addHostelBuildingForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        hostelId: values.hostelId,
        buildingName: values.buildingName,
      };
      if(props?.id){
        dispatch(editHostelBuildingListAct(generateActionPayload("edit_hostel_building_list", { id : props?.id} , payload)));
      }else{
        dispatch(saveHostelBuildingAct(generateActionPayload("save_hostel_building", undefined, { branchId ,instituteId,...values }, undefined,)));
      }
     },
  });

  useEffect(() => {
    if(props?.id && getHostelBuildingListByIdResp){
      addHostelBuildingForm.setValues((prev: any) => ({
        ...prev,
        hostelId: getHostelBuildingListByIdResp.hostelId || "",
        buildingName: getHostelBuildingListByIdResp.buildingName || "",
       
      }));
    }
  }, [getHostelBuildingListByIdResp])

  return (
    <>
      <form onSubmit={addHostelBuildingForm.handleSubmit}>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">

            <div />

            <div className="tw-col-span-1 md:tw-col-span-2">
              <SelectInput
                name="hostelId"
                labelText="Hostel Name"
                labelClass="required"
                value={addHostelBuildingForm.values.hostelId}
                onChange={addHostelBuildingForm.handleChange}
                menuItems={(Array.isArray(getHostelDetailsResp?.data) && getHostelDetailsResp?.data) || []}
                valueKey="hostelId"
                textKey="hostelName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.id ? true : false}
                invalid={ addHostelBuildingForm.touched.hostelId && addHostelBuildingForm.errors.hostelId ? true : false }
                error={ addHostelBuildingForm.touched.hostelId && addHostelBuildingForm.errors.hostelId ? addHostelBuildingForm.errors.hostelId : "" }
            />
            </div>

            <div className="tw-col-span-1 md:tw-col-span-2">
              <TextInput
                name="buildingName"
                labelText="Building Name"
                labelClass="required"
                value={addHostelBuildingForm.values.buildingName}
                onChange={addHostelBuildingForm.handleChange}
                invalid={(addHostelBuildingForm.touched.buildingName && addHostelBuildingForm.errors.buildingName) ? true : false}
                error={(addHostelBuildingForm.touched.buildingName && addHostelBuildingForm.errors.buildingName) ? addHostelBuildingForm.errors.buildingName : ""}
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
                addHostelBuildingForm.handleSubmit(event);
              }}
              disabled={showApiLoader}
            >
              {props.id ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default HostelBuildingModel;