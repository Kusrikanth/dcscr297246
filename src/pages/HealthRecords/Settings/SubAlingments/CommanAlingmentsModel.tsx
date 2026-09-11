import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextInput } from "../../../../Components/Common";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { saveSubAlingmentsListAct } from "../../../../store/healthrecords/healthrecordsaction";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  alignNames: [
    {
      uniqueId: generateUniqueNumber(),
      alignmentName: "",
    },
  ],
  subAliments: []
  
};

const validationSchema = Yup.object().shape({
  alignNames: Yup.array().of(
    Yup.object().shape({
      alignmentName: Yup.string().nullable().required('Ailment Name is required'),
    })
  )
})

const CommanAlingmentsModel = (props: any) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();


  const addCommanAlimentsFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { alignNames } = values;
      const tempres = alignNames?.map((ele: any) => ele.alignmentName);
      const payload = { alignNames: tempres };
      dispatch(saveSubAlingmentsListAct(generateActionPayload("save_alingments_list", undefined, payload)));
    },
  });

  useEffect(() => {
    if (!props.isOpen) {
      addCommanAlimentsFormik.resetForm();
    }
  }, [props.isOpen]);

  function addNewCommanAlimentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        alignmentName: "",
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
      <form>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-1 tw-gap-4">

            {/* Label */}
            <div className="tw-col-span-1">
              <div className="tw-flex tw-items-center">
                <h6 className="tw-text-sm tw-font-medium tw-mr-2 required">
                  Common Ailment
                </h6>
              </div>
            </div>

            {/* Dynamic Fields */}
            <div className="tw-col-span-1">
              <FormikProvider value={addCommanAlimentsFormik}>
                <FieldArray name="alignNames">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }
                    return (
                      <>
                        {addCommanAlimentsFormik.values.alignNames?.length > 0 &&
                          addCommanAlimentsFormik.values.alignNames?.map((alignmentName: any, index: any) => {
                            const inputFieldErrors: any = addCommanAlimentsFormik.errors.alignNames && addCommanAlimentsFormik.errors.alignNames[index] || {};
                            const inputFieldTouched = addCommanAlimentsFormik.touched.alignNames && addCommanAlimentsFormik.touched.alignNames[index] || {};

                              return (
                                <div
                                  key={alignmentName.uniqueId}
                                  className="tw-mb-3"
                                >
                                  <div className="tw-flex tw-items-center">
                                    <TextInput
                                      name={`alignNames[${index}].alignmentName`}
                                      formgroupClassName="tw-mb-0 tw-flex-1"
                                      value={alignmentName.alignmentName}
                                      inputClassName="tw-w-4/5"
                                      onChange={addCommanAlimentsFormik.handleChange}
                                      onBlur={addCommanAlimentsFormik.handleBlur}
                                      invalid={(inputFieldTouched.alignmentName && inputFieldErrors.alignmentName) ? true : false}
                                      error={(inputFieldTouched.alignmentName && inputFieldErrors.alignmentName) ? inputFieldErrors.alignmentName : ""}
                                    />
                                    {index !== 0 && (
                                      <Button
                                        data-index={index}
                                        variant="wrong"
                                        onClick={removeCommanAlinmentsHndlr}
                                        className="!tw-rounded-full tw-p-2"
                                      >
                                        <HugeiconsIcon
                                          icon={Delete02StrokeStandard}
                                          className="tw-text-red-600"
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

            {/* Add New */}
            {!props?.alignId && (
              <div className="tw-col-span-1">
                <Button
                  onClick={addNewCommanAlimentsHndlr}
                  variant="soft"
                >
                  <i className="ri-add-line tw-mr-2" />
                  Add New
                </Button>
              </div>
            )}

            {/* Footer Actions */}
            <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mb-1">
              <Button
                type="button"
                variant="secondary"
                onClick={props.toggle}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={(event: any) =>
                  addCommanAlimentsFormik.handleSubmit(event)
                }
              >
                {props.alignId ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CommanAlingmentsModel;
