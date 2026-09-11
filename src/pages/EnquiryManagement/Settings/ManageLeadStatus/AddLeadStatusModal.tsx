import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect } from "react";

import React, { useRef } from "react";
import * as Yup from "yup";

import { shallowEqual } from "react-redux";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { TextInput } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";


const validationSchema =  Yup.object().shape({
    workTypes : Yup.array().of(
    Yup.object().shape({
      name: Yup.string().nullable().required('Lead Status is required'),
    })
  )
})

const initialValues: any = {
    workTypes:[
    {
    uniqueId: generateUniqueNumber(),
    name: "",
    }
  ]
};

const AddLeadStatusModal: React.FC<any> = (props) => {
 
  const dispatch = useAppDispatch();

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
     showApiLoader,
     currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
     } = useAppSelector(({ transportrequest,appData,globalData }) => ({
    currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader:globalData.showApiLoader,
  }), shallowEqual);

  const LeadStausAddForm:any = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {


    },
  });

  
  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function addTypeofWorkHndler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), name :""});
    }
  }

  return (
    <>
   
        <div className="tw-p-5">
          <div className="tw-flex tw-flex-wrap">
            <div className="tw-flex-1 tw-mb-3">
              <div className="tw-flex tw-flex-wrap">
                <div className="tw-w-full">
                  <div className="tw-flex tw-items-center">
                    <h6 className="form-label tw-mb-0 tw-mr-2 required">Lead Status</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-w-full">
            <FormikProvider value={LeadStausAddForm}>
            <FieldArray name="workTypes">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }
                return (
                  <>
                    {LeadStausAddForm.values.workTypes?.length > 0 &&
                      LeadStausAddForm.values.workTypes?.map((workTypes:any, index:any) => {
                        const inputFieldErrors: any = LeadStausAddForm.errors.workTypes && LeadStausAddForm.errors.workTypes[index] || {};
                        const inputFieldTouched = LeadStausAddForm.touched.workTypes && LeadStausAddForm.touched.workTypes[index] || {};
                        return (
                          <div key={workTypes.uniqueId} className="tw-mb-3 tw-flex tw-flex-wrap">
                            <div className="tw-w-full tw-flex">
                              <TextInput
                                name={`workTypes[${index}].name`}
                                value={workTypes.name}
                                formgroupClassName="tw-mb-0 tw-w-[90%]"
                                onChange={LeadStausAddForm.handleChange}
                                onBlur={LeadStausAddForm.handleBlur}
                                invalid={(inputFieldTouched.name && inputFieldErrors.name) ? true : false}
                                error={(inputFieldTouched.name && inputFieldErrors.name) ? inputFieldErrors.name : ""}
                              />
                               {(index !== 0) && <button data-index={index} onClick={removeSlabHndlr} className="tw-ml-3 tw-p-1 tw-rounded-full hover:tw-bg-red-50 tw-flex tw-items-center tw-justify-center">
                               <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />
                                </button>}
                            </div>
                          </div>
                        )
                      })}
                  </>
                )
              }}
            </FieldArray>

          </FormikProvider>
                <div className="tw-flex tw-flex-wrap">
                    <div className="tw-w-full">
                        <Button onClick={addTypeofWorkHndler} type="button" variant="primary" >
                            Add New
                        </Button>
                    </div>
                </div>
           
            </div>
          </div>

          <div className="tw-flex tw-flex-wrap tw-mt-4">
                <div className='tw-flex tw-w-auto tw-ml-auto'>
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
                        onClick={(event:any) => { LeadStausAddForm.handleSubmit(event)}}
                        disabled={showApiLoader}
                    >
                        {props.routeId ? "Update" : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
     
    </>
  );
};

export default React.memo(AddLeadStatusModal);
