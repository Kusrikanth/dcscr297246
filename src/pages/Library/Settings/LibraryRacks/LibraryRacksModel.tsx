import React, { useState, useEffect, useMemo, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik, } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { addStuAttData, addStuAttGenerateColumns, numberofRacks, selectData1, selectData3, selectData4 } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { IChangeLibraryRacksProps } from "./LibraryRacksTypes";
import * as Yup from 'yup';
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { editLibraryRacksListAct, getLibraryDetailsListAct, getLibraryRooms, getLibraryshelf, saveLibraryRacksListAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { nanoid } from "nanoid";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  numberofRacks: Yup.string().required("Number of Racks is required."),
  libraryId: Yup.string().required("Library Name is required."),
  shelfId: Yup.string().required("Shelf Name is required."),
  roomId: Yup.string().required("Room Name is required."),
  racks: Yup.array().of(
    Yup.object().shape({
      rackName: Yup.string().required('Rack Name is required'),
    })
  ),
});

const initialValues = {
  numberofRacks: "1",
  libraryId: "",
  shelfId: "",
  roomId: "",
  racks: [
    {
      id: "",
      rackName: "",
    }
  ],
};

const LibraryRacksModel: React.FC<IChangeLibraryRacksProps> = (props) => {
  const dispatch = useDispatch();
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [filteredShelves, setFilteredShelves] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");

  const libraryNameList = () => {
    const payload = {
      branchId,
      pageSize: 100,
    };
    dispatch(
      getLibraryDetailsListAct(
        generateActionPayload("get_library_details", undefined, payload)
      )
    );
  };

  const libraryRoomsList = () => {
    const payload = {
      branchId,
    };
    dispatch(
      getLibraryRooms(
        generateActionPayload("get_library_rooms", undefined, payload)
      )
    );
  };

  const libraryShelfList = (roomId: any) => {
    const payload = {
      branchId,
      roomId,
      pageSize: 100,
    };
    dispatch(
      getLibraryshelf(generateActionPayload("get_library_shelf", undefined, payload))
    );
  };

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    libraryDetailsRequestListResp,
    libraryShelfRequestListResp,
    libraryRoomsRequestListResp,
    showApiLoader,
    getLibraryRacksListByIdResp,
  }: any = useAppSelector(
    ({ globalData, librarysettings, appData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      libraryShelfRequestListResp: librarysettings.libraryShelfRequestListResp,
      libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
      getLibraryRacksListByIdResp: librarysettings.getLibraryRacksListByIdResp,
    }),
    shallowEqual
  );
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const addLibraryRacksForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { racks, libraryId, shelfId, roomId } = values;
      let payload: any = {};
      if (props.id && racks?.length > 0) {
        payload = {
          rackName: racks[0].rackName,
        };
        dispatch(
          editLibraryRacksListAct(
            generateActionPayload("edit_library_racks_list", { id: props.id }, payload)
          )
        );
      } else {
        const tempres = racks?.map((ele: any) => ({
          rackName: ele.rackName,
        }));
        dispatch(
          saveLibraryRacksListAct(
            generateActionPayload(
              "save_Library_racks",
              undefined,
              { branchId, libraryId, shelfId, roomId, racks: tempres },
              undefined
            )
          )
        );
      }
    },
  });

  useEffect(() => {
    libraryNameList();
    libraryRoomsList();
  }, [branchId,instituteId,]);

  const handleNumberOfRacksChange = (value: number) => {
    const existingRacks = addLibraryRacksForm.values.racks || [];
    const updatedRacksList: any[] = Array.from({ length: value }, (_, i) => {
      const existingRack = existingRacks[i] || {};
      return {
        id: nanoid(),
        rackName: existingRack.rackName || "",
      };
    });

    addLibraryRacksForm.setValues((prev: any) => ({
      ...prev,
      numberofRacks: value,
      racks: updatedRacksList,
    }));
  };

  useEffect(() => {
    const libraryId = addLibraryRacksForm.values.libraryId;
    if (libraryId && libraryRoomsRequestListResp?.content) {
      libraryRoomsRequestListResp.content.forEach((room: any) => {});
      const filtered = libraryRoomsRequestListResp.content.filter(
        (room: { libraryId: any }) => String(room.libraryId) === String(libraryId)
      );
      setFilteredRooms(filtered);
    }
  }, [addLibraryRacksForm.values.libraryId, libraryRoomsRequestListResp]);

  const handleSelectChange = (e: { target: { value: any } }) => {
    const selectedRoomId = e.target.value;
    const rooms = filteredRooms || [];
    const selectedRoom = rooms.find((room: { id: any }) => String(room.id) === String(selectedRoomId));
    const roomName = selectedRoom ? selectedRoom.roomName : "";
    setSelectedRoom(roomName);
    addLibraryRacksForm.setFieldValue("roomId", selectedRoomId);
    addLibraryRacksForm.setFieldValue("roomName", roomName);
    if (selectedRoomId) {
      libraryShelfList(selectedRoomId);
    }
  };

  useEffect(() => {
    if (props?.id && getLibraryRacksListByIdResp) {
      addLibraryRacksForm.setValues((prev: any) => ({
        ...prev,
        numberofRacks: "1",
        libraryId: getLibraryRacksListByIdResp.libraryId || "",
        shelfId: getLibraryRacksListByIdResp.shelfId || "",
        roomId: getLibraryRacksListByIdResp.roomId || "",
        racks: [
          {
            id: getLibraryRacksListByIdResp?.id || "",
            rackName: getLibraryRacksListByIdResp?.rackName || "",
          },
        ],
      }));
      const selectedRoom = (filteredRooms || []).find(
        (room) => String(room.id) === String(getLibraryRacksListByIdResp.roomId)
      );
      const roomName = selectedRoom ? selectedRoom.roomName : "";
      setSelectedRoom(roomName);
    }
  }, [props.id, getLibraryRacksListByIdResp, filteredRooms]);

  useEffect(() => {
    if (addLibraryRacksForm.values.roomId) {
      setFilteredShelves(
        libraryShelfRequestListResp?.data.filter(
          (shelf: { roomId: string; }) => shelf.roomId === addLibraryRacksForm.values.roomId
        ) || []
      );
    }
  }, [libraryShelfRequestListResp, addLibraryRacksForm.values.roomId]);

  return (
    <>
      <form>
        <div style={{ padding: "1.25rem" }}>
          <div className="tw-grid tw-grid-cols-12 tw-gap-3">
            <div className="tw-col-span-12 lg:tw-col-span-6">
              <SelectInput
                name="libraryId"
                labelText="Library Name"
                value={addLibraryRacksForm.values.libraryId}
                onChange={addLibraryRacksForm.handleChange}
                menuItems={(Array.isArray(libraryDetailsRequestListResp?.content) && libraryDetailsRequestListResp?.content) || []}
                valueKey="id"
                textKey="libraryName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.id ? true : false}
                invalid={addLibraryRacksForm.touched.libraryId && addLibraryRacksForm.errors.libraryId ? true : false}
                error={addLibraryRacksForm.touched.libraryId && addLibraryRacksForm.errors.libraryId ? addLibraryRacksForm.errors.libraryId : ""}
              />
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-6">
              <SelectInput
                name="roomId"
                labelText="Room Name"
                value={addLibraryRacksForm.values.roomId}
                onChange={handleSelectChange}
                menuItems={filteredRooms}
                valueKey="id"
                textKey="roomName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.id ? true : false}
                invalid={addLibraryRacksForm.touched.roomId && addLibraryRacksForm.errors.roomId ? true : false}
                error={addLibraryRacksForm.touched.roomId && addLibraryRacksForm.errors.roomId ? addLibraryRacksForm.errors.roomId : ""}
              />
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-6">
              <SelectInput
                name="shelfId"
                labelText="Shelf Name"
                value={addLibraryRacksForm.values.shelfId}
                onChange={addLibraryRacksForm.handleChange}
                menuItems={(Array.isArray(libraryShelfRequestListResp?.data) && libraryShelfRequestListResp?.data) || []}
                valueKey="id"
                textKey="shelfName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.id ? true : false}
                invalid={addLibraryRacksForm.touched.shelfId && addLibraryRacksForm.errors.shelfId ? true : false}
                error={addLibraryRacksForm.touched.shelfId && addLibraryRacksForm.errors.shelfId ? addLibraryRacksForm.errors.shelfId : ""}
              />
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-6">
              <SelectInput
                name="numberofRacks"
                labelText="Number of Racks"
                value={addLibraryRacksForm.values.numberofRacks}
                onChange={(event: any) => handleNumberOfRacksChange(event.target.value)}
                menuItems={numberofRacks}
                valueKey="key"
                textKey="key"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.id ? true : false}
                invalid={(addLibraryRacksForm.touched.numberofRacks && addLibraryRacksForm.errors.numberofRacks) ? true : false}
                error={(addLibraryRacksForm.touched.numberofRacks && addLibraryRacksForm.errors.numberofRacks) ? addLibraryRacksForm.errors.numberofRacks : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <div className="tw-grid tw-grid-cols-12 tw-py-2 tw-mb-3 tw-bg-slate-100 tw-items-center">
                <div className="tw-col-span-4 tw-text-center">
                  <h6 className="tw-text-sm tw-font-medium required">S No.</h6>
                </div>
                <div className="tw-col-span-8">
                  <h6 className="tw-text-sm tw-font-medium required">Rack Name</h6>
                </div>
              </div>
            </div>
            <div className="tw-col-span-12">
              <FormikProvider value={addLibraryRacksForm}>
                <FieldArray name="racks">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }

                    return (
                      <>
                        {addLibraryRacksForm.values.racks?.length > 0 &&
                          addLibraryRacksForm.values.racks.map((room: any, index: number) => {
                            const inputFieldErrors: any =
                              (addLibraryRacksForm.errors.racks &&
                                addLibraryRacksForm.errors.racks[index]) ||
                              {};
                            const inputFieldTouched =
                              (addLibraryRacksForm.touched.racks &&
                                addLibraryRacksForm.touched.racks[index]) ||
                              {};

                            return (
                              <div
                                key={room.id}
                                className="tw-grid tw-grid-cols-12 tw-gap-2 tw-mb-3 tw-border-b tw-border-slate-200 tw-pb-2"
                              >
                                <div className="tw-col-span-4 tw-text-center">
                                  {index + 1}
                                </div>

                                <div className="tw-col-span-8">
                                  <TextInput
                                    name={`racks[${index}].rackName`}
                                    onChange={addLibraryRacksForm.handleChange}
                                    onBlur={addLibraryRacksForm.handleBlur}
                                    value={room.rackName}
                                    invalid={(inputFieldTouched.rackName && inputFieldErrors.rackName) ? true : false}
                                    error={(inputFieldTouched.rackName && inputFieldErrors.rackName) ? inputFieldErrors.rackName : ""}
                                    formgroupClassName="tw-mb-3"
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
            <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>
            <Button type="submit"
              variant="primary"
              onClick={(event: any) => {
                addLibraryRacksForm.handleSubmit(event);
              }}
            >
              {props.id ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default LibraryRacksModel;
