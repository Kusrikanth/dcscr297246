import React, { useMemo, useState } from "react";
import {
  ModalContainer,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import { useFormik } from "formik";
import { addNewFineModalProps, fineModalFilterProps } from "./FinesType";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

const initialValues: fineModalFilterProps = {
  applicableFor: "",
  gracePeriod: "",
  fineSystem: "",
  finePerDay: "",
};

const FineModal = (props: addNewFineModalProps) => {
  const [fineModalFilterState, setFineModalFilterState] =
    useState<fineModalFilterProps>(initialValues);

  const FineModalFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: fineModalFilterState,
    onSubmit: (values) => {},
  });

  return (
    <>
      <ModalContainer
        id="class-subject-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={FineModalFilterForm.handleSubmit}
        cancelHndlr={props.toggle}
        cancelTitle={"Reset"}
        submitTitle={"Save"}
        modalSize={"md"}
        modalBodyClass="p-0"
        cancelBtnClass="btn-light text-success"
      >
        <div className="tw-grid tw-grid-cols-1">
          <div className="md:tw-col-span-11 tw-flex tw-flex-col tw-mb-0 finemodal-wapper">

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 tw-my-1 tw-px-4 tw-mb-2">
              <div>
                <SelectInput
                  name="applicableFor"
                  labelText="Applicable For"
                  value={FineModalFilterForm.values.applicableFor}
                  onChange={FineModalFilterForm.handleChange}
                  formgroupClassName="tw-mb-0"
                  menuItems={[]}
                  valueKey="applicableFor"
                  textKey="applicableFor"
                />
              </div>

              <div className="tw-flex">
                <div className="tw-w-full tw-inline-block">
                  <SelectInput
                    name="gracePeriod"
                    labelText="Grace Period"
                    value={FineModalFilterForm.values.gracePeriod}
                    onChange={FineModalFilterForm.handleChange}
                    formgroupClassName="tw-mb-0"
                    menuItems={[]}
                    valueKey="gracePeriod"
                    textKey="gracePeriod"
                  />
                </div>

                <span className="tw-flex tw-items-center tw-pl-2 tw-pt-6">
                  Days
                </span>
              </div>
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 tw-my-1 tw-px-4 tw-mb-5">
              <div>
                <SelectInput
                  name="fineSystem"
                  labelText="Fine System"
                  value={FineModalFilterForm.values.fineSystem}
                  onChange={FineModalFilterForm.handleChange}
                  formgroupClassName="tw-mb-0"
                  menuItems={[]}
                  valueKey="fineSystem"
                  textKey="fineSystem"
                />
              </div>

              <div className="fineday-box tw-relative">
                <span className="tw-absolute tw-left-2 tw-top-1/2 -tw-translate-y-1/2 tw-flex tw-items-center tw-bg-white tw-border-0 icon-class">
                  <RupeeSvg width="15px" height="15px" fill="#495057" />
                </span>

                <TextInput
                  name="finePerDay"
                  labelText="Fine Per Day"
                  value={FineModalFilterForm.values.finePerDay}
                  onChange={FineModalFilterForm.handleChange}
                  formgroupClassName="tw-mb-0"
                />
              </div>
            </div>
          </div>
        </div>
      </ModalContainer>
    </>
  );
};

export default FineModal;
