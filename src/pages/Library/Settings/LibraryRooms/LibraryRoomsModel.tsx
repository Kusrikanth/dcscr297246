import React, { useState, useEffect, useMemo, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput, } from "../../../../Components/Common";
import { ILibraryRoomsModalProps } from "./LibraryRoomsTypes";
import { addStuAttData, addStuAttGenerateColumns, numberofRooms, } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import * as Yup from 'yup';
import { editLibraryRoomsListAct, saveLibraryRoomsListAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { nanoid } from "nanoid";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  numberofRooms: Yup.string().required("Number of Rooms is required."),
  libraryId: Yup.string().required("Library Name is required."),
  rooms : Yup.array().of(
    Yup.object().shape({
      roomName: Yup.string().nullable().required('Room Name is required'),
      roomNo: Yup.string().nullable().required('Room No is required'),
    })
  ),
});

const initialValues = {
  numberofRooms: "1",
  libraryId: "",
  roomName: "",
          roomNo: "",
  rooms: [
    {
      id: "",
      roomNo: "",
      roomName: "",
    }
  ],
};

const LibraryRoomsModel: React.FC<ILibraryRoomsModalProps> = (props) => {
  const dispatch = useDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    libraryDetailsRequestListResp,
    showApiLoader,
    getLibraryRoomsListByIdResp,
  }: any = useAppSelector(
    ({ globalData, librarysettings, appData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      getLibraryRoomsListByIdResp: librarysettings.getLibraryRoomsListByIdResp,
    }),
    shallowEqual
  );
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const addLibraryRoomsForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { rooms, libraryId, } = values;
      let payload: any = {};
      if (props.id && rooms?.length > 0) {
        payload = {
          roomName:rooms[0].roomName ,
          roomNo:rooms[0].roomNo,
        };
        dispatch(editLibraryRoomsListAct(generateActionPayload("edit_library_rooms_list", { id: props.id }, payload)));
      } else {
        const tempres = rooms
          ?.map((ele:any) => ({
            roomName: ele.roomName,
            roomNo: ele.roomNo,
          }));
        dispatch(saveLibraryRoomsListAct(generateActionPayload("save_Library_rooms", undefined, {branchId, libraryId, rooms: tempres }, undefined)));
      }
    }
  });

  const handleNumberOfRoomsChange = (value: number) => {

    const existingRooms = addLibraryRoomsForm.values.rooms || [];
    
    const updatedRoomsList: any[] = Array.from(
      { length: value },
      (_, i) => {
        const existingRoom = existingRooms[i] || {};
        return {
          id: nanoid(),
          roomNo: existingRoom.roomNo || ``,
          roomName: existingRoom.roomName || "",
        };
      }
    );
  
    addLibraryRoomsForm.setValues((prev: any) => ({
      ...prev,
      numberofRooms: value,
      rooms: updatedRoomsList,
    }));
  };

  useEffect(() => {
    if(props?.id && getLibraryRoomsListByIdResp){
      addLibraryRoomsForm.setValues((prev: any) => ({
        ...prev,
        numberofRooms: "1",
        libraryId: getLibraryRoomsListByIdResp.libraryId || "",
        rooms: [{
          id: getLibraryRoomsListByIdResp?.id || "",
          roomName: getLibraryRoomsListByIdResp?.roomName || "",
          roomNo: getLibraryRoomsListByIdResp?.roomNo || "",
        }],
      }));
    }
  }, [getLibraryRoomsListByIdResp])



  return (
    <>
      <form onSubmit={addLibraryRoomsForm.handleSubmit}>
        <div style={{ padding: "1.25rem" }}>
          <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-justify-center">
            <div className="tw-col-span-12">
              <SelectInput
                name="libraryId"
                labelText="Library Name"
                labelClass="required"
                value={addLibraryRoomsForm.values.libraryId}
                onChange={addLibraryRoomsForm.handleChange}
                menuItems={(Array.isArray(libraryDetailsRequestListResp?.content) && libraryDetailsRequestListResp?.content) || []}
                valueKey="id"
                textKey="libraryName"
                formgroupClassName="tw-mb-0"
                isDisabled={props?.id ? true : false}
                invalid={addLibraryRoomsForm.touched.libraryId && addLibraryRoomsForm.errors.libraryId ? true : false}
                error={addLibraryRoomsForm.touched.libraryId && addLibraryRoomsForm.errors.libraryId ? addLibraryRoomsForm.errors.libraryId : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <label
                htmlFor="numberofRooms"
                className="tw-block tw-text-sm tw-font-medium tw-text-slate-700 tw-mb-1 required"
              >
                Number of Rooms
              </label>
              <SelectInput
                name="numberofRooms"
                value={addLibraryRoomsForm.values.numberofRooms}
                onChange={(event: any) => handleNumberOfRoomsChange(event.target.value)}
                menuItems={numberofRooms}
                valueKey="key"
                textKey="key"
                formgroupClassName="tw-mb-0"
                isDisabled={props?.id ? true : false}
                invalid={(addLibraryRoomsForm.touched.numberofRooms && addLibraryRoomsForm.errors.numberofRooms) ? true : false}
                error={(addLibraryRoomsForm.touched.numberofRooms && addLibraryRoomsForm.errors.numberofRooms) ? addLibraryRoomsForm.errors.numberofRooms : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <div className="tw-grid tw-grid-cols-12 tw-py-2 tw-mb-3 tw-bg-slate-100 tw-items-center">
                <div className="tw-col-span-4 tw-text-center">
                  <h6 className="tw-text-sm tw-font-medium required">S No.</h6>
                </div>
                <div className="tw-col-span-4">
                  <h6 className="tw-text-sm tw-font-medium required">Room No.</h6>
                </div>
                <div className="tw-col-span-4">
                  <h6 className="tw-text-sm tw-font-medium required">Room Name</h6>
                </div>
              </div>
            </div>
            <div className="tw-col-span-12">
              <FormikProvider value={addLibraryRoomsForm}>
                <FieldArray name="rooms">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }
                    return (
                      <>
                        {addLibraryRoomsForm.values.rooms?.length > 0 &&
                          addLibraryRoomsForm.values.rooms.map((room: any, index: number) => {
                            const inputFieldErrors: any =
                              (addLibraryRoomsForm.errors.rooms &&
                                addLibraryRoomsForm.errors.rooms[index]) ||
                              {};
                            const inputFieldTouched =
                              (addLibraryRoomsForm.touched.rooms &&
                                addLibraryRoomsForm.touched.rooms[index]) ||
                              {};
                            return (
                              <div
                                key={room.id}
                                className="tw-grid tw-grid-cols-12 tw-gap-2 tw-mb-3 tw-border-b tw-border-slate-200 tw-pb-2"
                              >
                                <div className="tw-col-span-4 tw-text-center">
                                  {index + 1}
                                </div>
                                <div className="tw-col-span-4">
                                  <TextInput
                                    name={`rooms[${index}].roomNo`}
                                    onChange={addLibraryRoomsForm.handleChange}
                                    onBlur={addLibraryRoomsForm.handleBlur}
                                    value={room.roomNo}
                                    invalid={(inputFieldTouched.roomNo && inputFieldErrors.roomNo) ? true : false}
                                    error={(inputFieldTouched.roomNo && inputFieldErrors.roomNo) ? inputFieldErrors.roomNo : ""}
                                    formgroupClassName="tw-mb-3"
                                  />
                                </div>
                                <div className="tw-col-span-4">
                                  <TextInput
                                    name={`rooms[${index}].roomName`}
                                    inputClassName="tw-bg-slate-50"
                                    formgroupClassName="tw-mb-0 tw-w-full"
                                    value={room.roomName}
                                    onChange={addLibraryRoomsForm.handleChange}
                                    onBlur={addLibraryRoomsForm.handleBlur}
                                    invalid={(inputFieldTouched.roomName && inputFieldErrors.roomName) ? true : false}
                                    error={(inputFieldTouched.roomName && inputFieldErrors.roomName) ? inputFieldErrors.roomName : ""}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </>
                    );
                  }}
                </FieldArray>
              </FormikProvider>
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button type="button" variant="secondary" onClick={props.toggle}>Cancel</Button>
            <Button type="submit" variant="primary" onClick={(event: any) => { addLibraryRoomsForm.handleSubmit(event) }}>{props.id ? "Update" : "Submit"}</Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default LibraryRoomsModel;
