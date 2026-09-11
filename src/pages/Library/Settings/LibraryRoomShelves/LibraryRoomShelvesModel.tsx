import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { numberofShelfs } from "./helper";
import { IChangeLibraryRoomShelvesProps } from "./LibraryRoomShelvesTypes";
import * as Yup from 'yup';
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { editLibraryShelfsListAct, getLibraryDetailsListAct, getLibraryRooms, saveLibraryShelfsListAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { nanoid } from "nanoid";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  numberofShelfs: Yup.string().required("Number of Shelfs is required."),
  libraryId: Yup.string().required("Library Name is required."),
  roomId: Yup.string().required("Room Name is required."),
  shelfNameDtos: Yup.array().of(
    Yup.object().shape({
      shelfName: Yup.string().nullable().required('Shelf Name is required'),
    })
  ),
});

const initialValues = {
  numberofShelfs: "1",
  libraryId: "",
  roomId: "",
  shelfNameDtos: [
    {
      id: "",
      shelfName: "",
    }
  ],
};

const LibraryRoomShelvesModel: React.FC<IChangeLibraryRoomShelvesProps> = (props) => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const dispatch = useDispatch();

  const libraryNameList = () => {
    const payload = {
      branchId,
      pageSize: 100,
    };
    dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
  };

  const libraryRoomsList = () => {
    const payload = {
      branchId,
    };
    dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
  };

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    libraryDetailsRequestListResp,
    libraryRoomsRequestListResp,
    showApiLoader,
    getLibraryShelfsListByIdResp,
  }: any = useAppSelector(
    ({ globalData, librarysettings, appData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
      getLibraryShelfsListByIdResp: librarysettings.getLibraryShelfsListByIdResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const addLibraryRoomShelvesForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { shelfNameDtos, libraryId, roomId } = values;
      let payload: any = {};
      if (props.id && shelfNameDtos?.length > 0) {
        payload = {
          shelfName: shelfNameDtos[0]?.shelfName,
        };
        dispatch(editLibraryShelfsListAct(generateActionPayload("edit_library_shelfs_list", { id: props.id }, payload)));
      } else {
        const tempres = shelfNameDtos
          ?.map((ele: any) => ({
            shelfName: ele.shelfName,
          }));
        dispatch(saveLibraryShelfsListAct(generateActionPayload("save_Library_shelfs", undefined, { branchId, roomId, libraryId, shelfNameDtos: tempres }, undefined)));
      }
    }
  });

  useEffect(() => {
    libraryNameList();
    libraryRoomsList();
  }, [branchId,instituteId,]);

  useEffect(() => {
    const libraryId = addLibraryRoomShelvesForm.values.libraryId;
    if (libraryId && libraryRoomsRequestListResp?.content) {
      libraryRoomsRequestListResp.content.forEach((room: any) => {
      });
      const filtered = libraryRoomsRequestListResp.content.filter(
        (room: { libraryId: any; }) => String(room.libraryId) === String(libraryId)
      );
      setFilteredRooms(filtered);
    }
  }, [addLibraryRoomShelvesForm.values.libraryId, libraryRoomsRequestListResp]);

  const handlenumberofShelfsChange = (value: number) => {
    const existingShelfs = addLibraryRoomShelvesForm.values.shelfNameDtos || [];
    const updatedShelfsList: any[] = Array.from(
      { length: value },
      (_, i) => {
        const existingShelf = existingShelfs[i] || {};
        return {
          id: nanoid(),
          shelfName: existingShelf.shelfName || ``,
        };
      }
    );
    addLibraryRoomShelvesForm.setValues((prev: any) => ({
      ...prev,
      numberofShelfs: value,
      shelfNameDtos: updatedShelfsList,
    }));
  };

  const handleSelectChange = (e: { target: { value: any; }; }) => {
    const selectedRoomId = e.target.value;
    const rooms = filteredRooms || [];
    const selectedRoom = rooms.find((room: { id: any; }) => String(room.id) === String(selectedRoomId));
    const roomName = selectedRoom ? selectedRoom.roomName : '';
    setSelectedRoom(roomName);
    addLibraryRoomShelvesForm.setFieldValue('roomId', selectedRoomId);
    addLibraryRoomShelvesForm.setFieldValue('roomName', roomName);
  };

  useEffect(() => {
    if (props?.id && getLibraryShelfsListByIdResp) {
      addLibraryRoomShelvesForm.setValues((prev) => ({
        ...prev,
        numberofShelfs: "1",
        libraryId: getLibraryShelfsListByIdResp.libraryId || "",
        roomId: getLibraryShelfsListByIdResp?.roomId || "",
        shelfNameDtos: [{
          id: getLibraryShelfsListByIdResp?.id || "",
          shelfName: getLibraryShelfsListByIdResp?.shelfName || "",
        }],
      }));

      const selectedRoom = (filteredRooms || []).find((room) => String(room.id) === String(getLibraryShelfsListByIdResp.roomId));
      const roomName = selectedRoom ? selectedRoom.roomName : '';
      setSelectedRoom(roomName);
    }
  }, [props.id, getLibraryShelfsListByIdResp, filteredRooms]);

  return (
    <>
      <form onSubmit={addLibraryRoomShelvesForm.handleSubmit}>
        <div style={{ padding: "1.25rem" }}>
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12">
              <SelectInput
                name="libraryId"
                labelText="Library Name"
                labelClass="required"
                value={addLibraryRoomShelvesForm.values.libraryId}
                onChange={addLibraryRoomShelvesForm.handleChange}
                menuItems={(Array.isArray(libraryDetailsRequestListResp?.content) && libraryDetailsRequestListResp?.content) || []}
                valueKey="id"
                textKey="libraryName"
                formgroupClassName="tw-mb-0"
                isDisabled={props?.id ? true : false}
                invalid={addLibraryRoomShelvesForm.touched.libraryId && addLibraryRoomShelvesForm.errors.libraryId ? true : false}
                error={addLibraryRoomShelvesForm.touched.libraryId && addLibraryRoomShelvesForm.errors.libraryId ? addLibraryRoomShelvesForm.errors.libraryId : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <SelectInput
                name="roomId"
                labelText="Room Name"
                value={addLibraryRoomShelvesForm.values.roomId}
                onChange={handleSelectChange}
                menuItems={filteredRooms}
                valueKey="id"
                textKey="roomName"
                formgroupClassName="tw-mb-0"
                isDisabled={props?.id ? true : false}
                invalid={addLibraryRoomShelvesForm.touched.roomId && addLibraryRoomShelvesForm.errors.roomId ? true : false}
                error={addLibraryRoomShelvesForm.touched.roomId && addLibraryRoomShelvesForm.errors.roomId ? addLibraryRoomShelvesForm.errors.roomId : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <label
                htmlFor="numberofShelfs"
                className="tw-block tw-text-sm tw-font-medium tw-text-slate-700 tw-mb-1 required"
              >
                Number of Shelfs
              </label>
              <SelectInput
                name="numberofShelfs"
                value={addLibraryRoomShelvesForm.values.numberofShelfs}
                onChange={(event: any) =>
                  handlenumberofShelfsChange(event.target.value)
                }
                menuItems={numberofShelfs}
                valueKey="key"
                textKey="key"
                formgroupClassName="tw-mb-0"
                isDisabled={props?.id ? true : false}
                invalid={(addLibraryRoomShelvesForm.touched.numberofShelfs && addLibraryRoomShelvesForm.errors.numberofShelfs) ? true : false}
                error={(addLibraryRoomShelvesForm.touched.numberofShelfs && addLibraryRoomShelvesForm.errors.numberofShelfs) ? addLibraryRoomShelvesForm.errors.numberofShelfs : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <div className="tw-grid tw-grid-cols-12 tw-py-2 tw-mb-3 tw-bg-slate-100 tw-items-center">
                <div className="tw-col-span-4 tw-text-center">
                  <h6 className="tw-text-sm tw-font-medium required">S No.</h6>
                </div>
                <div className="tw-col-span-4">
                  <h6 className="tw-text-sm tw-font-medium required">Room Name</h6>
                </div>
                <div className="tw-col-span-4">
                  <h6 className="tw-text-sm tw-font-medium required">Shelf Name</h6>
                </div>
              </div>
            </div>
            <div className="tw-col-span-12">
              <FormikProvider value={addLibraryRoomShelvesForm}>
                <FieldArray name="shelfNameDtos">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }

                    return (
                      <>
                        {addLibraryRoomShelvesForm.values.shelfNameDtos?.length > 0 &&
                          addLibraryRoomShelvesForm.values.shelfNameDtos.map(
                            (shelf: any, index: number) => {
                              const inputFieldErrors: any =
                                (addLibraryRoomShelvesForm.errors.shelfNameDtos &&
                                  addLibraryRoomShelvesForm.errors.shelfNameDtos[index]) ||
                                {};
                              const inputFieldTouched =
                                (addLibraryRoomShelvesForm.touched.shelfNameDtos &&
                                  addLibraryRoomShelvesForm.touched.shelfNameDtos[index]) ||
                                {};

                              return (
                                <div
                                  key={shelf.id}
                                  className="tw-grid tw-grid-cols-12 tw-gap-2 tw-mb-3 tw-border-b tw-border-slate-200 tw-pb-2"
                                >
                                  <div className="tw-col-span-4 tw-text-center">
                                    {index + 1}
                                  </div>

                                  <div className="tw-col-span-4">
                                    <div className="tw-w-full tw-min-h-[38px] tw-bg-slate-100 tw-border tw-rounded tw-py-2 tw-px-3">
                                      {selectedRoom || "\u00A0"}
                                    </div>
                                  </div>


                                  <div className="tw-col-span-4">
                                    <TextInput
                                      name={`shelfNameDtos[${index}].shelfName`}
                                      inputClassName="tw-bg-slate-50"
                                      formgroupClassName="tw-mb-3 tw-w-full"
                                      onChange={addLibraryRoomShelvesForm.handleChange}
                                      onBlur={addLibraryRoomShelvesForm.handleBlur}
                                      value={shelf.shelfName}
                                      invalid={(inputFieldTouched.shelfName && inputFieldErrors.shelfName) ? true : false}
                                      error={(inputFieldTouched.shelfName && inputFieldErrors.shelfName) ? inputFieldErrors.shelfName : ""}
                                    />
                                  </div>
                                </div>
                              );
                            }
                          )}
                      </>
                    );
                  }}
                </FieldArray>
              </FormikProvider>
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button type="button" variant="secondary" onClick={props.toggle}>Cancel</Button>
            <Button type="submit" variant="primary" onClick={(event: any) => { addLibraryRoomShelvesForm.handleSubmit(event) }}>{props.id ? "Update" : "Submit"}</Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default LibraryRoomShelvesModel;
