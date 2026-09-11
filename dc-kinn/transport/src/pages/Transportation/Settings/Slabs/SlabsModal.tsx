import React, { useEffect, useRef, useState } from "react";
import { SelectInput, TextInput, TextInputGroup } from "../../../../Components/Common";
import { ISlabsModalProps } from "./SlabsTypes";
import * as Yup from "yup";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { numberOfSlabsMenu } from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { createSlabsListAct, editSlabsListAct } from "../../../../store/transportation/transportationaction";
import { nanoid } from "nanoid";
import Button from "../../../../Components/Common/Button";

const validationSchema =  Yup.object().shape({
  numberofSlabs : Yup.string().required("Number Of Slabs is Required").nullable(),
  slabs : Yup.array().of(
    Yup.object().shape({
      from: Yup.string().nullable().required('This is required'),
      to: Yup.string().nullable().required('This is required'),
      slabName: Yup.string().nullable().required('Slab Name is required'),
    })
  ),
})

const initialValues = {
  slabs : [
    {
      slabId :"",
      slabName:"",
      from:"",
      to : "",
    }
  ],
  numberofSlabs:"1",
}

const SlabsModal: React.FC<ISlabsModalProps> = (props) => {

  const dispatch = useAppDispatch()

  const { 
      currentBranchIdResp: branchId,
      currentInstIdResp: instituteId,
      showApiLoader,
      getSlabsListByIdResp,
    } = useAppSelector(({ transportrequest,appData,globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader:globalData.showApiLoader,
      getSlabsListByIdResp:transportrequest.getSlabsListByIdResp,
 }), shallowEqual);


  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const addSlabsForm = useFormik({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const {slabs} = values
      let payload: any = {};
      if (props.slabId && slabs?.length > 0) {
        payload = {
          radius: `${slabs[0]?.from}-${slabs[0]?.to}`,
        }
        dispatch(editSlabsListAct(generateActionPayload("edit_slabs_list",{slabId: props.slabId} , payload)));
      } else {
        const tempres = slabs
          ?.map((ele:any) => ({
            slabName: ele.slabName,
            radius: `${ele.from}-${ele.to}`,
          }));
        dispatch(createSlabsListAct(generateActionPayload("create_slabs_list", undefined, {branchId,instituteId, slabs: tempres }, undefined)));
      }
    }
  });

  const handleNumberOfSlabsChange = (value: number) => {

    const existingSlabs = addSlabsForm.values.slabs || [];
    
    const updatedSlabsList: any[] = Array.from(
      { length: value },
      (_, i) => {
        const existingSlab = existingSlabs[i] || {};
        return {
          slabId: nanoid(),
          slabName: existingSlab.slabName || ``,
          from: existingSlab.from || "",
          to: existingSlab.to || "",
        };
      }
    );
  
    addSlabsForm.setValues((prev: any) => ({
      ...prev,
      numberofSlabs: value,
      slabs: updatedSlabsList,
    }));
  };

  useEffect(() => {
    if(props?.slabId && getSlabsListByIdResp){
      const [min, max] = (getSlabsListByIdResp?.radius || "").split('-').map((part:any) => part);
      addSlabsForm.setValues((prev: any) => ({
        ...prev,
        numberofSlabs: "1",
        slabs: [{
          slabId: getSlabsListByIdResp?.slabId || "",
          slabName: getSlabsListByIdResp?.slabName || "",
          from : min || "",
          to : max || "",
        }],
      }));
    }
  }, [getSlabsListByIdResp])

  return (
   
    <div className="tw-p-5">
      <div className="tw-flex tw-flex-wrap">
        <div className="tw-w-full tw-mb-3">
          <label
            htmlFor="numberOfSlabs"
            className="tw-block tw-text-sm tw-font-medium tw-mb-1"
          >
            Number of Slabs <span className="tw-text-red-500">*</span>
          </label>

          <SelectInput
            name="numberofSlabs"
            value={addSlabsForm.values.numberofSlabs}
            onChange={(event: any) =>
              handleNumberOfSlabsChange(event.target.value)
            }
            formgroupClassName="tw-mb-0"
            isDisabled={props?.slabId ? true : false}
            menuItems={numberOfSlabsMenu}
                invalid={(addSlabsForm.touched.numberofSlabs && addSlabsForm.errors.numberofSlabs) ? true : false}
                error={(addSlabsForm.touched.numberofSlabs && addSlabsForm.errors.numberofSlabs) ? addSlabsForm.errors.numberofSlabs : ""}
            valueKey="key"
            textKey="key"
          />
        </div>
      </div>

      <div className="tw-grid tw-grid-cols-3 tw-mb-3">
        <h6 className="tw-text-sm tw-font-medium">
          Slab Name <span className="tw-text-red-500">*</span>
        </h6>
        <h6 className="tw-text-sm tw-font-medium">
          From <span className="tw-text-red-500">*</span>
        </h6>
        <h6 className="tw-text-sm tw-font-medium">
          To <span className="tw-text-red-500">*</span>
        </h6>
      </div>

      <div className="tw-w-full">
        <FormikProvider value={addSlabsForm}>
          <FieldArray name="slabs">
            {(arrayHelpers: ArrayHelpers) => {
              if (!formikArrayHelpers.current) {
                formikArrayHelpers.current = arrayHelpers;
              }

              return (
                <>
                  {addSlabsForm.values.slabs?.length > 0 &&
                    addSlabsForm.values.slabs.map(
                      (slab: any, index: any) => {
                        const inputFieldErrors: any =
                          (addSlabsForm.errors.slabs &&
                            addSlabsForm.errors.slabs[index]) ||
                          {};
                        const inputFieldTouched =
                          (addSlabsForm.touched.slabs &&
                            addSlabsForm.touched.slabs[index]) ||
                          {};

                        return (
                          <div
                            key={slab.slabId}
                            className="tw-grid tw-grid-cols-3 tw-gap-3 tw-mb-3"
                          >
                            <TextInput
                              name={`slabs[${index}].slabName`}
                              placeHolder="Enter Slab Name .."
                              onChange={addSlabsForm.handleChange}
                              onBlur={addSlabsForm.handleBlur}
                              value={slab.slabName}
                              isDisabled={props?.slabId ? true : false}
                                   invalid={(inputFieldTouched.slabName && inputFieldErrors.slabName) ? true : false}
                                   error={(inputFieldTouched.slabName && inputFieldErrors.slabName) ? inputFieldErrors.slabName : ""}
                                   formgroupClassName="mb-0"
                            />

                            <TextInputGroup
                              name={`slabs[${index}].from`}
                              inputClassName="tw-bg-gray-100"
                              formgroupClassName="tw-mb-0 tw-w-full"
                              value={slab.from}
                              onChange={addSlabsForm.handleChange}
                              onBlur={addSlabsForm.handleBlur}
                                labelClass="fw-bold"
                                invalid={(inputFieldTouched.from && inputFieldErrors.from) ? true : false}
                                error={(inputFieldTouched.from && inputFieldErrors.from) ? inputFieldErrors.from : ""}
                            >
                              Km
                            </TextInputGroup>

                            <TextInputGroup
                              name={`slabs[${index}].to`}
                              inputClassName="tw-bg-gray-100"
                              formgroupClassName="tw-mb-0 tw-w-full"
                              value={slab.to}
                              onChange={addSlabsForm.handleChange}
                              onBlur={addSlabsForm.handleBlur}
                                labelClass="fw-bold"
                                invalid={(inputFieldTouched.to && inputFieldErrors.to) ? true : false}
                                error={(inputFieldTouched.to && inputFieldErrors.to) ? inputFieldErrors.to : ""}
                            >
                              Km
                            </TextInputGroup>
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

      <div className="tw-flex tw-justify-end tw-mt-4">
        <div className="tw-flex tw-gap-3">
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
            onClick={(event: any) => addSlabsForm.handleSubmit(event)}
            disabled={showApiLoader}
          >
            {props.slabId ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </div>

  );
};

export default SlabsModal;