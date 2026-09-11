import React, { useState, useEffect, useRef } from "react";
import { useFormik, } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import * as Yup from 'yup';
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {  editHostelFloorListAct, getHostelBuildingAct, getHostelDetailsAct, saveHostelFloorAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { resetHostelBuildingsListAct } from "../../../../store/hostel/hostelsettings/hostelsettingsslice";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  hostelId: "",
  floorName: "",
  buildingId: ""
};

const validationSchema = Yup.object().shape({
  hostelId: Yup.string().required("Hostel Name is required."),
  floorName: Yup.string().required("Floor Name Name is required."),
  buildingId: Yup.string().required("Building Name is required."),
});

const HostelDetailsModel = (props: any) => {
  const [selectedBuilding, setSelectedBuilding] = useState('');

  const dispatch = useDispatch();

  const hostelDetailsList = () => {
    const payload = {
      branchId,
    };
    dispatch(getHostelDetailsAct(generateActionPayload("get_hostel_details", undefined, payload)));
  };
  
  const hostelBuildingList = () => {
    const payload = {
      branchId,
    };
    dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, payload)));
  };
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelDetailsResp,
    getHostelBuildingResp,
    getHostelFloorListByIdResp,
  }: any = useAppSelector(
    ({ globalData, hostelSettings, appData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelBuildingResp: hostelSettings.getHostelBuildingResp,
      getHostelFloorListByIdResp: hostelSettings.getHostelFloorListByIdResp,
    }),
    shallowEqual
  );

  const addFloorDetails = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        hostelId: values.hostelId,
        buildingId: values.buildingId,
        floorName: values.floorName,
      };
      if(props?.floorId){
        dispatch(editHostelFloorListAct(generateActionPayload("edit_hostel_floor_list", { floorId : props?.floorId} , payload)));
      }else{
        dispatch(saveHostelFloorAct(generateActionPayload("save_hostel_floor", undefined, { branchId ,instituteId,...values }, undefined,)));
      }
     },
  });
  useEffect(() => {
    hostelDetailsList();
    hostelBuildingList();
  }, [branchId,instituteId]);


  const handleSelectChange = (event: { target: { name: string; value: any; }; }) => {
    const { name, value } = event.target;
    
    if (name === 'hostelId') {
      setSelectedBuilding((prev: any) => ({ ...prev, [name]: value }));
      const payload = { branchId: branchId, hostelId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      if (!value) {
        dispatch(resetHostelBuildingsListAct(undefined));
      } else {
        dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, payload)));
      }
    } else if (name === 'buildingId') {
      setSelectedBuilding('');
      if (!value) {
        dispatch(resetHostelBuildingsListAct(undefined));
      }
    }
    addFloorDetails.setFieldValue(name, value);
  };

  useEffect(() => {
    if(props?.floorId && getHostelFloorListByIdResp){
      addFloorDetails.setValues((prev: any) => ({
        ...prev,
        hostelId: getHostelFloorListByIdResp.hostelId || "",
        buildingId: getHostelFloorListByIdResp.buildingId || "",
        floorName: getHostelFloorListByIdResp.floorName || "",
       
      }));
       }
  }, [getHostelFloorListByIdResp])


  return (
    <>
      <form onSubmit={addFloorDetails.handleSubmit}>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-1 tw-gap-4">

            <div>
              <SelectInput
                name="hostelId"
                labelText="Hostel Name"
                labelClass="required"
                value={addFloorDetails.values.hostelId}
                onChange={handleSelectChange}
                menuItems={(Array.isArray(getHostelDetailsResp?.data) && getHostelDetailsResp?.data) || []}
                valueKey="hostelId"
                textKey="hostelName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.floorId ? true : false}
                invalid={ addFloorDetails.touched.hostelId && addFloorDetails.errors.hostelId ? true : false }
                error={ addFloorDetails.touched.hostelId && addFloorDetails.errors.hostelId ? addFloorDetails.errors.hostelId : "" }
            />
            </div>

            <div>
              <SelectInput
                name="buildingId"
                labelText="Building Name"
                labelClass="required"
                value={addFloorDetails.values.buildingId}
                onChange={handleSelectChange}
                menuItems={(Array.isArray(getHostelBuildingResp?.data) && addFloorDetails.values.hostelId && getHostelBuildingResp?.data) || []}
                valueKey="id"
                textKey="buildingName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.floorId ? true : false}
                invalid={ addFloorDetails.touched.buildingId && addFloorDetails.errors.buildingId ? true : false }
                error={ addFloorDetails.touched.buildingId && addFloorDetails.errors.buildingId ? addFloorDetails.errors.buildingId : "" }
            />
            </div>

            <div>
              <TextInput
                name="floorName"
                labelText="Floor Name"
                labelClass="required"
                value={addFloorDetails.values.floorName}
                onChange={addFloorDetails.handleChange}
                invalid={(addFloorDetails.touched.floorName && addFloorDetails.errors.floorName) ? true : false}
                error={(addFloorDetails.touched.floorName && addFloorDetails.errors.floorName) ? addFloorDetails.errors.floorName : ""}
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
                addFloorDetails.handleSubmit(event);
              }}
            >
              {props.floorId ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default HostelDetailsModel;