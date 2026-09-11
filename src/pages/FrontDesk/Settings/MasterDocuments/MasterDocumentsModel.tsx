import React, { useState, useEffect, useRef } from "react";
import { useFormik, } from "formik";
import { MultiSelectCheckbox, SelectInput, TextInput } from "../../../../Components/Common";
import * as Yup from 'yup';
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editMasterDocumentsListAct, saveMasterDocumentsListAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { documentTypes, paymentModeOptions } from "./helper";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  shortName: "",
  documentName: "",
  displayName: "",
  documentType: "",
  acceptedExtensions: "",
};

const validationSchema = Yup.object().shape({
  shortName: Yup.string().required("Short Name is required.").nullable(),
  documentName: Yup.string().required("Document Name is required.").nullable(),
  displayName: Yup.string().required("Display Name is required.").nullable(),
  documentType: Yup.string().required("Document Type is required.").nullable(),
  acceptedExtensions: Yup.array().of(Yup.object().shape({id: Yup.string().required("ID is required."),name: Yup.string().required("Name is required."),})).min(1, "Accepted Extensions is required.").required("Accepted Extensions is required.").nullable(),
});

const MasterDocumentsModel = (props: any) => {

  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getMasterDocumentsByIdResp,
  } = useAppSelector(
    ({ globalData, admissionAvailabilityRequest, appData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getMasterDocumentsByIdResp: admissionAvailabilityRequest.getMasterDocumentsByIdResp,
    }),
    shallowEqual
  );

  const addMasterDocumentsRef = useRef<any>({
    prevGetMasterDocumentsListByIdResp: getMasterDocumentsByIdResp,
  })

  useEffect(() => {
    const { prevGetMasterDocumentsListByIdResp } = addMasterDocumentsRef.current || {};
    if (getMasterDocumentsByIdResp && prevGetMasterDocumentsListByIdResp !== getMasterDocumentsByIdResp) {
      if (props?.id) {
        const { shortName, documentName, displayName, documentType, acceptedExtensions } = getMasterDocumentsByIdResp || {};
        const acceptedExtensionsArray = typeof acceptedExtensions === 'string'
          ? acceptedExtensions.split(",").map((ext: string) => {
              const option = paymentModeOptions.find(opt => opt.id.toLowerCase() === ext.trim().toLowerCase());
              return option || null;
            }).filter(Boolean)
          : [];
        addMasterDocumentsForm.setValues((prev: any) => ({
          ...prev,
          shortName,
          documentName,
          displayName,
          documentType,
          acceptedExtensions: acceptedExtensionsArray,
        }));
      }
    }
    addMasterDocumentsRef.current.prevGetMasterDocumentsListByIdResp = getMasterDocumentsByIdResp;
  }, [getMasterDocumentsByIdResp]);

  const addMasterDocumentsForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const acceptedExtensions = Array.isArray(values.acceptedExtensions)
        ? values.acceptedExtensions.map((item) => item.id.trim()).join(",")
        : values.acceptedExtensions;
      const updatedValues = { ...values, acceptedExtensions };
      if (props?.id) {
        dispatch(editMasterDocumentsListAct(generateActionPayload("edit_master_document_by_id", { id: props?.id }, updatedValues)));
      } else {
        dispatch(saveMasterDocumentsListAct(generateActionPayload("save_master_document_list", undefined, updatedValues)));
      }
    },
  });

  function renderValue(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
      return (
        <div className="text-truncate">
          {selectedItems
            .map((item: any, index: number) => item?.name + (index !== (selectedItems.length - 1) ? ', ' : '')) // Use item?.name
          }
        </div>
      );
    }
    return null;
  }

  function renderOptions(item: any) {
    return item?.name;
  }

  function onSelectOptionHandler(selectedOptions: any, config?: any) {
    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      addMasterDocumentsForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
    } else {
      addMasterDocumentsForm.setValues((prevState: any) => ({ ...prevState, [name]: null }));
    }
  }

  return (
    <>
      <form onSubmit={addMasterDocumentsForm.handleSubmit}>
        <div className="tw-p-5"> 
          <div className="tw-grid tw-gap-4 tw-grid-cols-1 lg:tw-grid-cols-2">

            {/* Document Name */}
            <div>
              <TextInput
                name="documentName"
                labelText="Document Name"
                labelClass="required"
                value={addMasterDocumentsForm.values.documentName}
                onChange={addMasterDocumentsForm.handleChange}
                onBlur={addMasterDocumentsForm.handleBlur}
                invalid={(addMasterDocumentsForm.touched.documentName && addMasterDocumentsForm.errors.documentName) ? true : false}
                error={(addMasterDocumentsForm.touched.documentName && addMasterDocumentsForm.errors.documentName) ? addMasterDocumentsForm.errors.documentName : ""}
              />
            </div>

            {/* Short Name */}
            <div>
              <TextInput
                name="shortName"
                labelText="Short Name"
                labelClass="required"
                value={addMasterDocumentsForm.values.shortName}
                onChange={addMasterDocumentsForm.handleChange}
                invalid={(addMasterDocumentsForm.touched.shortName && addMasterDocumentsForm.errors.shortName) ? true : false}
                error={(addMasterDocumentsForm.touched.shortName && addMasterDocumentsForm.errors.shortName) ? addMasterDocumentsForm.errors.shortName : ""}
              />
            </div>

            {/* Display Name */}
            <div>
              <TextInput
                name="displayName"
                labelText="Display Name"
                labelClass="required"
                value={addMasterDocumentsForm.values.displayName}
                onChange={addMasterDocumentsForm.handleChange}
                invalid={(addMasterDocumentsForm.touched.displayName && addMasterDocumentsForm.errors.displayName) ? true : false}
                error={(addMasterDocumentsForm.touched.displayName && addMasterDocumentsForm.errors.displayName) ? addMasterDocumentsForm.errors.displayName : ""}
              />
            </div>

            {/* Document Type */}
            <div>
              <SelectInput
                name="documentType"
                value={addMasterDocumentsForm.values.documentType}
                onChange={addMasterDocumentsForm.handleChange}
                menuItems={documentTypes}
                valueKey="documentType"
                textKey="documentName"
                labelClass="required"
                formgroupClassName="tw-mb-3"
                defaultSelect="Select"
                labelText="Document Type"
                invalid={(addMasterDocumentsForm.touched.documentType && addMasterDocumentsForm.errors.documentType) ? true : false}
                error={(addMasterDocumentsForm.touched.documentType && addMasterDocumentsForm.errors.documentType) ? addMasterDocumentsForm.errors.documentType : ""}
              />
            </div>

            {/* Accepted Extensions */}
            <div className="tw-col-span-1 lg:tw-col-span-2">
              <MultiSelectCheckbox
                name="acceptedExtensions"
                labelClass="required"
                idKey="id"
                labelText="Accepted Extensions"
                value={addMasterDocumentsForm.values.acceptedExtensions}
                renderValue={renderValue}
                renderOptions={renderOptions}
                onChange={onSelectOptionHandler}
                searchKey="name"
                options={paymentModeOptions || []}
                invalid={(addMasterDocumentsForm.touched.acceptedExtensions && addMasterDocumentsForm.errors.acceptedExtensions) ? true : false}
                error={(addMasterDocumentsForm.touched.acceptedExtensions && addMasterDocumentsForm.errors.acceptedExtensions) ? addMasterDocumentsForm.errors.acceptedExtensions : ""}
              />
            </div>
          </div>

          {/* Buttons */}
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
              onClick={(event: any) => { addMasterDocumentsForm.handleSubmit(event) }}
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

export default MasterDocumentsModel;