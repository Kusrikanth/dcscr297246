import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik, } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import * as Yup from 'yup';
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editHostelRoomDetailsListAct, getHostelBuildingAct, getHostelDetailsAct, getHostelFloorAct, getHostelRoomTypeAct, saveHostelBuildingAct, saveHostelRoomDetailsAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { resetHostelBuildingsListAct, resetHostelFloorListAct, resetHostelRoomTypeListAct, setHostelRoomDetailsListByIdAct } from "../../../../store/hostel/hostelsettings/hostelsettingsslice";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  hostelId: "",
  buildingId: "",
  floorId: "",
  roomTypeId: "",
  roomNo: "",
  bedRequestDtos: [
    {
      id: generateUniqueNumber(),
      bedId: "",
      bedName: "",
    }
  ],
};

const validationSchema = Yup.object().shape({
  hostelId: Yup.string().required("Hostel Name is required."),
  buildingId: Yup.string().required("Building Name is required."),
  floorId: Yup.string().required("Floor Name is required."),
  roomTypeId: Yup.string().required("Room Name is required."),
  roomNo: Yup.string().required("Room Number is required."),
  bedRequestDtos: Yup.array().of(Yup.object().shape({
    bedName: Yup.string().required("Bed Name is required."),
  })),
});

const HostelRoomModel = (props: any) => {
  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const hostelDetailsList = () => {
    const payload = {
      branchId,
    };
    dispatch(getHostelDetailsAct(generateActionPayload("get_hostel_details", undefined, payload)));
  };

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelDetailsResp,
    getHostelBuildingResp,
    getHostelFloorResp,
    getHostelRoomTypeResp,
    getHostelRoomDetailsListByIdResp,
  } = useAppSelector(
    ({ globalData, hostelSettings, appData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelBuildingResp: hostelSettings.getHostelBuildingResp,
      getHostelFloorResp: hostelSettings.getHostelFloorResp,
      getHostelRoomTypeResp: hostelSettings.getHostelRoomTypeResp,
      getHostelRoomDetailsListByIdResp: hostelSettings.getHostelRoomDetailsListByIdResp,
    }),
    shallowEqual
  );

  const addHostelRoomDetailsRef = useRef({
    prevGetHostelRoomDetailsListByIdResp: getHostelRoomDetailsListByIdResp,
  });

  useEffect(() => {
    const { prevGetHostelRoomDetailsListByIdResp } = addHostelRoomDetailsRef.current;
    if (getHostelRoomDetailsListByIdResp && prevGetHostelRoomDetailsListByIdResp !== getHostelRoomDetailsListByIdResp) {
      if (props?.id) {
        const { bedDtos = [], hostelId, buildingId, floorId, roomTypeId, roomNo } = getHostelRoomDetailsListByIdResp || {}
        const updatedBedDtos = bedDtos.map((bed:any) => ({
          id: generateUniqueNumber(),
          bedId: bed.bedId || null,
          bedName: bed.bedName || "",
        }));

        addHostelRoomDetails.setValues({
          hostelId: hostelId || "",
          buildingId: buildingId || "",
          floorId: floorId || "",
          roomTypeId: roomTypeId || "",
          roomNo: roomNo || "",
          bedRequestDtos: updatedBedDtos,
        });

        // Hostel Bulding API
        const buldingPayload = { branchId: branchId, hostelId, orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, buldingPayload)));

        // Hostel Floor API
        const floorPayload = { branchId: branchId, hostelId, buildingId, orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getHostelFloorAct(generateActionPayload("get_hostel_floor", undefined, floorPayload)));

        // Hostel Room Type API
        const roomPayload = { branchId: branchId, hostelId, buildingId, floorId, orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getHostelRoomTypeAct(generateActionPayload("get_hostel_room_type", undefined, roomPayload)));
      }
    }

    addHostelRoomDetailsRef.current.prevGetHostelRoomDetailsListByIdResp = getHostelRoomDetailsListByIdResp;

  }, [getHostelRoomDetailsListByIdResp]);

  useEffect(() => {
    return () => {
      dispatch(setHostelRoomDetailsListByIdAct(undefined))
    }
  }, []);
  
  useEffect(() => {
    hostelDetailsList();
  }, [branchId,instituteId])

  const addHostelRoomDetails = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { bedRequestDtos } = values;

      const payload = {
        hostelId: values.hostelId,
        buildingId: values.buildingId,
        floorId: values.floorId,
        roomTypeId: values.roomTypeId,
        roomNo: values.roomNo,
        noOfBeds: bedRequestDtos.length,
      }

      if (props?.id) {

        const selectedIds = bedRequestDtos?.map((i: any) => +i?.bedId)?.filter((f => f))
        const missingData = getHostelRoomDetailsListByIdResp?.bedDtos?.filter(
          (bed: any) => !selectedIds?.includes(bed?.bedId)
        )?.map((i: any) => ({ ...i, isDeleted: true }));

        const updatedBedList = bedRequestDtos?.map((i: any) => ({ bedId: i?.bedId || null, bedName: i?.bedName, isDeleted: false }));

        const editPayload = {
          ...payload,
          bedRequestDtos: [...updatedBedList, ...missingData],
        }

        dispatch(editHostelRoomDetailsListAct(generateActionPayload("edit_hostel_room_details_list", { id: props?.id }, editPayload)));

      } else {

        const savePayload = {
          ...payload,
          bedRequestDtos: bedRequestDtos.map((bed: any) => ({
            bedName: bed.bedName,
            bedId: null,
          })),
          branchId,
          instituteId,
        }
        dispatch(saveHostelRoomDetailsAct(generateActionPayload("save_hostel_room_details", undefined, savePayload)));
      }
    },
  });

 

  const handleSelectChange = (event: { target: { name: string; value: any; }; }) => {
    const { name, value } = event.target;

    if (name === 'hostelId') {
      const payload = { branchId: branchId, hostelId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      if (!value) {
        dispatch(resetHostelBuildingsListAct(undefined));
        addHostelRoomDetails.setFieldValue('buildingId', '');
        addHostelRoomDetails.setFieldValue('floorId', '');
        addHostelRoomDetails.setFieldValue('roomTypeId', '');
      } else {
        dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, payload)));
      }
    } else if (name === 'buildingId') {
      const payload = { branchId: branchId, hostelId: addHostelRoomDetails.values.hostelId, buildingId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };

      if (!value) {
        dispatch(resetHostelFloorListAct(undefined));
        addHostelRoomDetails.setFieldValue('floorId', '');
        addHostelRoomDetails.setFieldValue('roomTypeId', '');
      } else {
        dispatch(getHostelFloorAct(generateActionPayload("get_hostel_floor", undefined, payload)));
      }
    } else if (name === 'floorId') {
      const payload = { branchId: branchId, hostelId: addHostelRoomDetails.values.hostelId, buildingId: addHostelRoomDetails.values.buildingId, floorId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };

      if (!value) {
        dispatch(resetHostelRoomTypeListAct(undefined));
        addHostelRoomDetails.setFieldValue('roomTypeId', '');
      } else {
        dispatch(getHostelRoomTypeAct(generateActionPayload("get_hostel_room_type", undefined, payload)));
      }
    } else if (name === 'roomTypeId') {

      if (!value) {
        dispatch(resetHostelRoomTypeListAct(undefined));
      }
    }
    addHostelRoomDetails.setFieldValue(name, value);
  };

  function addNewHostelRoomDetailsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        bedId: "",
        bedName: "",
      });
    }
  }

  function removeCommanAlinmentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  return (
    <>
      <form onSubmit={addHostelRoomDetails.handleSubmit}>
        <div>
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4 tw-p-3">

            <div>
              <SelectInput
                name="hostelId"
                labelText="Hostel Name"
                labelClass="required"
                value={addHostelRoomDetails.values.hostelId}
                onChange={handleSelectChange}
                menuItems={(Array.isArray(getHostelDetailsResp?.data) && getHostelDetailsResp?.data) || []}
                valueKey="hostelId"
                textKey="hostelName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.id ? true : false}
                invalid={addHostelRoomDetails.touched.hostelId && addHostelRoomDetails.errors.hostelId ? true : false}
                error={addHostelRoomDetails.touched.hostelId && addHostelRoomDetails.errors.hostelId ? addHostelRoomDetails.errors.hostelId : ""}
              />
            </div>

            <div>
              <SelectInput
                name="buildingId"
                labelText="Building Name"
                labelClass="required"
                value={addHostelRoomDetails.values.buildingId}
                onChange={handleSelectChange}
                menuItems={(Array.isArray(getHostelBuildingResp?.data) && addHostelRoomDetails.values.hostelId && getHostelBuildingResp?.data) || []}
                valueKey="id"
                textKey="buildingName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.id ? true : false}
                invalid={addHostelRoomDetails.touched.buildingId && addHostelRoomDetails.errors.buildingId ? true : false}
                error={addHostelRoomDetails.touched.buildingId && addHostelRoomDetails.errors.buildingId ? addHostelRoomDetails.errors.buildingId : ""}
              />
            </div>

            <div>
              <SelectInput
                name="floorId"
                labelText="Floor Name"
                labelClass="required"
                value={addHostelRoomDetails.values.floorId}
                onChange={handleSelectChange}
                menuItems={(Array.isArray(getHostelFloorResp?.data) && addHostelRoomDetails.values.buildingId && getHostelFloorResp?.data) || []}
                valueKey="floorId"
                textKey="floorName"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.id ? true : false}
                invalid={addHostelRoomDetails.touched.floorId && addHostelRoomDetails.errors.floorId ? true : false}
                error={addHostelRoomDetails.touched.floorId && addHostelRoomDetails.errors.floorId ? addHostelRoomDetails.errors.floorId : ""}
              />
            </div>

            <div>
              <SelectInput
                name="roomTypeId"
                labelText="Room Type"
                labelClass="required"
                value={addHostelRoomDetails.values.roomTypeId}
                onChange={handleSelectChange}
                menuItems={(Array.isArray(getHostelRoomTypeResp?.data) && addHostelRoomDetails.values.hostelId && getHostelRoomTypeResp?.data) || []}
                valueKey="roomTypeId"
                textKey="roomType"
                formgroupClassName="tw-mb-3"
                isDisabled={props?.id ? true : false}
                invalid={addHostelRoomDetails.touched.roomTypeId && addHostelRoomDetails.errors.roomTypeId ? true : false}
                error={addHostelRoomDetails.touched.roomTypeId && addHostelRoomDetails.errors.roomTypeId ? addHostelRoomDetails.errors.roomTypeId : ""}
              />
            </div>

            <div>
              <TextInput
                name="roomNo"
                labelText="Room No"
                labelClass="required"
                isDisabled={props?.id ? true : false}
                value={addHostelRoomDetails.values.roomNo}
                onChange={addHostelRoomDetails.handleChange}
                invalid={(addHostelRoomDetails.touched.roomNo && addHostelRoomDetails.errors.roomNo) ? true : false}
                error={(addHostelRoomDetails.touched.roomNo && addHostelRoomDetails.errors.roomNo) ? addHostelRoomDetails.errors.roomNo : ""}
              />
            </div>
            <div className="lg:tw-col-span-2">
              <div className="tw-grid tw-grid-cols-12 tw-items-center tw-bg-gray-100 tw-py-2 tw-mb-3">
                <div className="tw-col-span-4 tw-text-center">
                  <h6 className="tw-text-sm tw-font-semibold">S No.</h6>
                </div>
                <div className="tw-col-span-8">
                  <h6 className="tw-text-sm tw-font-semibold">Beds</h6>
                </div>
              </div>
            </div>

            <div className="lg:tw-col-span-2">
              <FormikProvider value={addHostelRoomDetails}>
                <FieldArray name="bedRequestDtos">
                  {(arrayHelpers) => {
                    formikArrayHelpers.current = arrayHelpers;
                    return (
                      <>
                        {addHostelRoomDetails.values.bedRequestDtos.map(
                          (bedName, index) => {
                            const inputFieldErrors: any =
                              (addHostelRoomDetails.errors.bedRequestDtos &&
                                addHostelRoomDetails.errors.bedRequestDtos[index]) ||
                              {};
                            const inputFieldTouched =
                              (addHostelRoomDetails.touched.bedRequestDtos &&
                                addHostelRoomDetails.touched.bedRequestDtos[index]) ||
                              {};

                            return (
                              <div
                                key={bedName.id}
                                className="tw-grid tw-grid-cols-12 tw-border-b tw-mb-3"
                              >
                                <div className="tw-col-span-4 tw-text-center tw-pb-3">
                                  {index + 1}
                                </div>

                                <div className="tw-col-span-8 tw-flex tw-items-start">
                                  <TextInput
                                    name={`bedRequestDtos[${index}].bedName`}
                                    onChange={addHostelRoomDetails.handleChange}
                                    onBlur={addHostelRoomDetails.handleBlur}
                                    value={bedName.bedName}
                                    invalid={(inputFieldTouched.bedName && inputFieldErrors.bedName) ? true : false}
                                    error={(inputFieldTouched.bedName && inputFieldErrors.bedName) ? inputFieldErrors.bedName : ""}
                                    formgroupClassName="tw-mb-3"
                                  />

                                  {index !== 0 && (
                                    <Button
                                      data-index={index}
                                      onClick={removeCommanAlinmentsHndlr}
                                      type="button"
                                      variant="wrong"
                                      className="tw-ml-2 !tw-rounded-full"

                                    >
                                      <HugeiconsIcon
                                        icon={Delete02StrokeStandard}
                                        className=""
                                        size={18}
                                      />
                                    </Button>
                                  )}
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

            {!props?.alignId && (
              <div className="lg:tw-col-span-2">
                <Button
                  onClick={addNewHostelRoomDetailsHndlr}
                  type="button"
                  variant="soft"
                >
                  Add New
                </Button>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="tw-flex tw-justify-end tw-gap-2 tw-p-3 tw-mt-4 tw-mb-1">
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
                addHostelRoomDetails.handleSubmit(event);
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

export default HostelRoomModel;

