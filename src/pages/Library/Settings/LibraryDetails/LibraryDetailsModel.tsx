import React, { useState, useEffect, useRef } from "react";
import { useFormik, } from "formik";
import { TextInput } from "../../../../Components/Common";
import { IChangeLibraryDetailsProps } from "./LibraryDetailsTypes";
import * as Yup from 'yup';
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { editLibraryDetailsListAct, saveLibraryDetailsListAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  shortName: "",
  libraryName: "",
  location: ""
};

const validationSchema = Yup.object().shape({
  shortName: Yup.string().required("Short Name is required."),
  libraryName: Yup.string().required("Library Name is required."),
  location: Yup.string().required("Location is required."),
});

const LibraryDetailsModel = (props: any) => {

  const dispatch = useDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getLibraryDetailsListByIdResp,
  }: any = useAppSelector(
    ({ globalData, librarysettings, appData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getLibraryDetailsListByIdResp: librarysettings.getLibraryDetailsListByIdResp,
    }),
    shallowEqual
  );

  const addLibraryDetailsRef = useRef<any>({
    prevGetLibraryDetailsListByIdResp : getLibraryDetailsListByIdResp,
  })

  useEffect(() => {
    const { prevGetLibraryDetailsListByIdResp } = addLibraryDetailsRef.current || {};
    if(getLibraryDetailsListByIdResp && prevGetLibraryDetailsListByIdResp !== getLibraryDetailsListByIdResp){
      if(props?.id){
        const { shortName, libraryName, location } = getLibraryDetailsListByIdResp || {}
        addLibraryDetailsForm.setValues((prev:any)=>({...prev , shortName, libraryName, location}))
  
      }
    }

    addLibraryDetailsRef.current.prevGetLibraryDetailsListByIdResp = getLibraryDetailsListByIdResp;
    
  }, [getLibraryDetailsListByIdResp])

  const addLibraryDetailsForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if(props?.id){
        dispatch(editLibraryDetailsListAct(generateActionPayload("edit_library_details_list", { id : props?.id} , { ...values })));
      }else{
        dispatch(saveLibraryDetailsListAct(generateActionPayload("save_Library_details", undefined, { branchId , ...values })));
      }
     },
  });
  function renderOptionsTerms(item: any) {
    return item?.id;
  }

  return (
    <>
      <form onSubmit={addLibraryDetailsForm.handleSubmit}>
        <div style={{ padding: "1.25rem" }}>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <div className="md:tw-col-span-2">
              <TextInput
                name="libraryName"
                labelText="Library Name"
                labelClass="required"
                formgroupClassName="tw-mb-0"
                value={addLibraryDetailsForm.values.libraryName}
                onChange={addLibraryDetailsForm.handleChange}
                onBlur={addLibraryDetailsForm.handleBlur}
                invalid={(addLibraryDetailsForm.touched.libraryName && addLibraryDetailsForm.errors.libraryName) ? true : false}
                error={(addLibraryDetailsForm.touched.libraryName && addLibraryDetailsForm.errors.libraryName) ? addLibraryDetailsForm.errors.libraryName : ""}
              />
            </div>
            <div className="md:tw-col-span-2">
              <TextInput
                name="shortName"
                labelText="Short Name"
                labelClass="required"
                formgroupClassName="tw-mb-0"
                value={addLibraryDetailsForm.values.shortName}
                onChange={addLibraryDetailsForm.handleChange}
                invalid={(addLibraryDetailsForm.touched.shortName && addLibraryDetailsForm.errors.shortName) ? true : false}
                error={(addLibraryDetailsForm.touched.shortName && addLibraryDetailsForm.errors.shortName) ? addLibraryDetailsForm.errors.shortName : ""}
              
              />
            </div>
            <div className="md:tw-col-span-2">
              <TextInput
                name="location"
                labelText="Location"
                labelClass="required"
                formgroupClassName="tw-mb-0"
                value={addLibraryDetailsForm.values.location}
                onChange={addLibraryDetailsForm.handleChange}
                invalid={(addLibraryDetailsForm.touched.location && addLibraryDetailsForm.errors.location) ? true : false}
                error={(addLibraryDetailsForm.touched.location && addLibraryDetailsForm.errors.location) ? addLibraryDetailsForm.errors.location : ""}
              />
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-pt-3">
            <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={(event: any) => addLibraryDetailsForm.handleSubmit(event)}
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

export default LibraryDetailsModel;