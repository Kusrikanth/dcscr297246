import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, useFormik, } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import * as Yup from 'yup';
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editHostelBuildingListAct, editHostelRoomTypeListAct, saveHostelBuildingAct, saveHostelRoomTypeAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  hostelId: "",
  roomType: "",
  remarks: ""
};

const validationSchema = Yup.object().shape({
  hostelId: Yup.string().required("Hostel Name is required."),
  roomType: Yup.string().required("Room Type is required."),
  remarks: Yup.string().required("Remarks is required."),
});

const HostelRoomModel = (props: any) => {

  const dispatch = useDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelDetailsResp,
    getHostelRoomTypeListByIdResp,
  }: any = useAppSelector(
    ({ globalData, hostelSettings, appData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelRoomTypeListByIdResp: hostelSettings.getHostelRoomTypeListByIdResp,
    }),
    shallowEqual
  );
  
  const addHostelRoomType = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        hostelId: values.hostelId,
        roomType: values.roomType,
        remarks: values.remarks,
      };
      if(props?.roomTypeId){
        dispatch(editHostelRoomTypeListAct(generateActionPayload("edit_hostel_room_type_list", { roomTypeId : props?.roomTypeId} , payload)));
      }else{
        dispatch(saveHostelRoomTypeAct(generateActionPayload("save_hostel_room_type", undefined, { branchId ,instituteId,...values }, undefined,)));
      }
     },
  });

  useEffect(() => {
    if(props?.roomTypeId && getHostelRoomTypeListByIdResp){
      addHostelRoomType.setValues((prev: any) => ({
        ...prev,
        hostelId: getHostelRoomTypeListByIdResp.hostelId || "",
        roomType: getHostelRoomTypeListByIdResp.roomType || "",
        remarks: getHostelRoomTypeListByIdResp.remarks || "",
       
      }));
    }
  }, [getHostelRoomTypeListByIdResp])

  return (
    <>
      <form onSubmit={addHostelRoomType.handleSubmit}>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">

            <div />

            <div className="tw-col-span-1 md:tw-col-span-2">
              <SelectInput
                name="hostelId"
                labelText="Hostel Name"
                labelClass="required"
                value={addHostelRoomType.values.hostelId}
                onChange={addHostelRoomType.handleChange}
                menuItems={(Array.isArray(getHostelDetailsResp?.data) && getHostelDetailsResp?.data) || []}
                valueKey="hostelId"
                textKey="hostelName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.roomTypeId ? true : false}
                invalid={ addHostelRoomType.touched.hostelId && addHostelRoomType.errors.hostelId ? true : false }
                error={ addHostelRoomType.touched.hostelId && addHostelRoomType.errors.hostelId ? addHostelRoomType.errors.hostelId : "" }
            />
            </div>

            <div className="tw-col-span-1 md:tw-col-span-2">
              <TextInput
                name="roomType"
                labelText="Room Type"
                labelClass="required"
                value={addHostelRoomType.values.roomType}
                onChange={addHostelRoomType.handleChange}
                invalid={(addHostelRoomType.touched.roomType && addHostelRoomType.errors.roomType) ? true : false}
                error={(addHostelRoomType.touched.roomType && addHostelRoomType.errors.roomType) ? addHostelRoomType.errors.roomType : ""}
              />
            </div>

            <div className="tw-col-span-1 md:tw-col-span-2">
              <TextInput
                name="remarks"
                labelText="Remarks"
                labelClass="required"
                value={addHostelRoomType.values.remarks}
                onChange={addHostelRoomType.handleChange}
                invalid={(addHostelRoomType.touched.remarks && addHostelRoomType.errors.remarks) ? true : false}
                error={(addHostelRoomType.touched.remarks && addHostelRoomType.errors.remarks) ? addHostelRoomType.errors.remarks : ""}
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
                addHostelRoomType.handleSubmit(event);
              }}
            >
              {props.roomTypeId ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default HostelRoomModel;