import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect } from "react";
import {
  TextInput,
} from "../../../Components/Common";
import React, { useRef } from "react";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { generateUniqueNumber } from "../../../utility/commonutility";
import { addWorkTypesListAct, updateWorkTypeAct } from "../../../store/academic/academicRequest/academicrequestactions";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  workTypes: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().nullable().required('Work Type Name is required'),
    })
  )
})

const initialValues: any = {
  workTypes: [
    {
      uniqueId: generateUniqueNumber(),
      name: "",
    }
  ]
};

const AddTypeofWorkModal = (props: any) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getWorkTypeByIdResp,
  } = useAppSelector(({ transportrequest, appData, globalData, academicRequest }) => ({
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    showApiLoader: globalData.showApiLoader,
    getWorkTypeByIdResp: academicRequest.getWorkTypeByIdResp,
  }), shallowEqual);

  const workTypesAddForm = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { workTypes } = values || {};
      const currentId = props?.id;
      const workTypeNames = workTypes?.map((i: any) => i?.name).filter(Boolean);
      if (currentId) {
        const singleWorkType = workTypeNames?.join(",");
        dispatch(
          updateWorkTypeAct(
            generateActionPayload("update_work_type", { id: currentId }, { workTypes: singleWorkType })
          )
        );
      } else {
        dispatch(
          addWorkTypesListAct(
            generateActionPayload("add_work_types_list", undefined, { branchId, workTypes: workTypeNames })
          )
        );
      }
    },
  });

  useEffect(() => {
    if (props.id && getWorkTypeByIdResp) {
      const { workTypeName } = getWorkTypeByIdResp;
      workTypesAddForm.setValues({
        workTypes: [
          {
            uniqueId: generateUniqueNumber(),
            name: workTypeName || "",
          },
        ],
      });
    }
  }, [props.id, getWorkTypeByIdResp]);

  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function addTypeofWorkHndler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), name: "" });
    }
  }

  return (
    <>
      <div className="tw-p-5">
        <div className="tw-mb-4">
          <h6 className="tw-text-sm tw-font-medium tw-mb-2">
            Work Type Name <span className="tw-text-red-500">*</span>
          </h6>
        </div>
        <FormikProvider value={workTypesAddForm}>
          <FieldArray name="workTypes">
            {(arrayHelpers: ArrayHelpers) => {
              if (!formikArrayHelpers.current) {
                formikArrayHelpers.current = arrayHelpers;
              }

              return (
                <>
                  {workTypesAddForm.values.workTypes?.length > 0 &&
                    workTypesAddForm.values.workTypes.map(
                      (workTypes: any, index: number) => {
                        const inputFieldErrors: any =
                          workTypesAddForm.errors.workTypes &&
                          workTypesAddForm.errors.workTypes[index] || {};

                        const inputFieldTouched =
                          workTypesAddForm.touched.workTypes &&
                          workTypesAddForm.touched.workTypes[index] || {};

                        return (
                          <div key={workTypes.uniqueId} className="tw-mb-3">
                            <div className="tw-flex tw-items-center tw-gap-3">
                              <TextInput
                                name={`workTypes[${index}].name`}
                                value={workTypes.name}
                                formgroupClassName="tw-mb-0 tw-w-[90%]"
                                onChange={workTypesAddForm.handleChange}
                                onBlur={workTypesAddForm.handleBlur}
                                invalid={
                                  inputFieldTouched.name && inputFieldErrors.name
                                }
                                error={
                                  inputFieldTouched.name && inputFieldErrors.name
                                    ? inputFieldErrors.name
                                    : ""
                                }
                              />
                              {!props.id && index !== 0 && (
                                <Button
                                  type="button"
                                  variant="wrong"
                                  data-index={index}
                                  onClick={removeSlabHndlr}
                                  className="!tw-px-2 !tw-py-1"
                                >
                                  <i className="ri-delete-bin-2-fill" />
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
        {!props.id && (
          <div className="tw-mt-2">
            <Button
              type="button"
              variant="hoverInfo"
              onClick={addTypeofWorkHndler}
              className="!tw-px-3 !tw-py-1"
            >
              Add New
            </Button>
          </div>
        )}
        <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">
          <Button type="button" variant="secondary" onClick={props.toggle}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={(event: any) =>
              workTypesAddForm.handleSubmit(event)
            }
            disabled={showApiLoader}
          >
            {props.id ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default React.memo(AddTypeofWorkModal);
