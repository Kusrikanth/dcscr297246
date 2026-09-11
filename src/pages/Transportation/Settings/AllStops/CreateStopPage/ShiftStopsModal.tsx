import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ModalContainer,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import { ModalDataTypeProps, ShiftStopsDataType } from "./CreateStopPageTypes";
import { selectData3, selectData4 } from "./helper";

const initialValues: ShiftStopsDataType = {
  routeName: "Route 24",
  stopName: "",
  shiftToRoute: "",
};

const ShiftStopsModal = (props: ModalDataTypeProps) => {
  const [allStopsFilterState, setAllStopsFilterState] =
    useState<ShiftStopsDataType>(initialValues);

  const AllStopsFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: allStopsFilterState,
    onSubmit: (values) => {},
  });

  return (
    <>
      <ModalContainer
        id="change-stream-confirm-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={""}
        cancelHndlr={props.toggle}
        cancelTitle={"Cancel"}
        submitTitle={"Submit"}
        modalSize={"md"}
        // footerClass={"mb-4"}
        // hideHeader={true}
        // modalBodyClass={"pt-5"}
      >
        <div className="tw-w-full">
            <TextInput
              name="routeName"
              labelText="Route Name"
              value={AllStopsFilterForm.values.routeName}
              onChange={AllStopsFilterForm.handleChange}
              isReadOnly={true}
              inputClassName="bg-light"
            />
        </div>

        <div className="tw-w-full">
            <SelectInput
              name="stopName"
              labelText="Route Name"
              value={AllStopsFilterForm.values.stopName}
              onChange={AllStopsFilterForm.handleChange}
              menuItems={selectData3}
              valueKey="stopNameOption"
              textKey="stopNameOption"
            />
        </div>

        <div className="tw-w-full">
            <SelectInput
              name="shiftToRoute"
              labelText="Route Name"
              value={AllStopsFilterForm.values.shiftToRoute}
              onChange={AllStopsFilterForm.handleChange}
              menuItems={selectData4}
              valueKey="shiftToRouteOption"
              textKey="shiftToRouteOption"
            />
        </div>
      </ModalContainer>
    </>
  );
};

export default ShiftStopsModal;
