import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  ModalContainer,
  TextInput,
} from "../../Components/Common";
import {
  IAssignClassroomProps,
  IUpdateAssignRoomRepRef,
} from "./academicsTypes";
import { Row, Col } from "reactstrap";
import {useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import {
  updateClassroom,
} from "../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import Button from "../../Components/Common/Button";

const initialData= (editData?:any) => {
  return {
    classSection: editData?.sectionName||"",
    roomNo: editData?.roomNo || "",
  }
};
const AssignClassroomModal = (props: IAssignClassroomProps) => {
  const [initialValues,setInitialValues]=useState(initialData())
  const validationSchema = Yup.object().shape({
    roomNo: Yup.string().trim().required("Room No is required"),
  });

  const dispatch = useAppDispatch();

  const { showApiLoader, updateClassroomResp } = useAppSelector(
    ({ classroomManagmentInfo,globalData }) => ({
      classroomListResp: classroomManagmentInfo.classroomListResp,
      updateClassroomResp: classroomManagmentInfo.updateClassroomResp,
      showApiLoader:globalData.showApiLoader,
    }),
    shallowEqual
  );
  const { handleSubmit, values, handleChange, errors,touched } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema:validationSchema,
    onSubmit: (values) => {
      dispatch(
        updateClassroom(
          generateActionPayload(
            "update_classroom",undefined,
            {
              sectionId: props.sectionDetails?.sectionId,
              roomNo: values.roomNo,
            }
          )
        )
      );
    },
  });

  const UpdateClassroomRef = useRef<IUpdateAssignRoomRepRef>({
    prevAssignRoomResp: updateClassroomResp
  });


  useEffect(()=>{
     if(props.isOpen){
      setInitialValues(initialData(props.sectionDetails))
     }
     else{
      setInitialValues(initialData());
     }
  },[props.isOpen])

  useEffect(() => {

    const { prevAssignRoomResp } =
      UpdateClassroomRef.current;

    if (updateClassroomResp &&
      prevAssignRoomResp !== updateClassroomResp) {
      toast.success("Room No is Assigned");
      props.toggle({sectionDetails:props.sectionDetails,apiCall:true});
    }
    UpdateClassroomRef.current.prevAssignRoomResp = updateClassroomResp;
  }, [updateClassroomResp]);

  

  return (
    <>
      <div className="tw-p-5">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
          <div className="tw-col-span-12 md:tw-col-span-9">
            <TextInput
              name="classSection"
              labelText="Class Section"
              value={values.classSection}
              onChange={handleChange}
              inputClassName="tw-bg-gray-100"
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-3">
            <TextInput
              name="roomNo"
              labelText="Room No."
              value={values.roomNo}
              onChange={handleChange}
              maxLength={5}
              invalid={touched.roomNo && errors.roomNo ? true : false}
              error={touched.roomNo && errors.roomNo ? errors.roomNo : ""}
            />
          </div>
        </div>
        <div className="tw-flex tw-justify-end tw-gap-3 tw-my-3">
          <Button type="button" variant="secondary" onClick={props.toggle}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="tw-px-2 tw-py-1"
            onClick={(event: any) => handleSubmit(event)}
            disabled={showApiLoader}
          >
            {props.sectionDetails?.roomNo ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AssignClassroomModal;
