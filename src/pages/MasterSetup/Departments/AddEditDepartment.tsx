import React, { useRef, useState, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import { TextInput } from "../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import {  FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { addInstDepartmentAct, updateInstDepartmentAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";
// Interface and Types
import { IAddDepartmentsState, IAddDepartmentInfoState, IAddDepartmentResp, IAddEditDepartmentProps } from "./departementtypes";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  departments: Yup.array().of(
    Yup.object().shape({
      departmentName: Yup.string().required("Name is required.")
        .matches(/^[^-\s][a-zA-Z\s-]+$/, 'Only alphabet with space, - character are allowed.'),
      shortName: Yup.string().required("Code is required.")
        .matches(/^[^-\s][a-zA-Z\s-]+$/, 'Only alphabet with space, - character are allowed.')
    })
  ),
});

function getInitialState(editData?: any): IAddDepartmentsState {
  const data: IAddDepartmentInfoState = {
    uniqueId: generateUniqueNumber(),
    departmentName: "",
    shortName: ""
  };
  if (editData) {
    const { departmentName, id, shortName } = editData || {};
    data.uniqueId = id;
    data.departmentName = departmentName;
    data.shortName = shortName;
  }
  return { departments: [data] }
}


const AddEditDepartment: React.FC<IAddEditDepartmentProps> = (props) => {
  const [departmentListState, setDepartmentListState] = useState<IAddDepartmentsState>(getInitialState());
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const dispatch = useAppDispatch();
  const { addInstDepartmentResp, updateInstDepartmentResp,showApiLoader } = useAppSelector(({ instituteInfo,globalData }) => ({
    addInstDepartmentResp: instituteInfo.addInstDepartmentResp,
    updateInstDepartmentResp: instituteInfo.updateInstDepartmentResp,
    showApiLoader:globalData.showApiLoader,
  }), shallowEqual);


  const addDepartmentRespRef = useRef<IAddDepartmentResp>({
    prevAddInstDepartmentResp: addInstDepartmentResp,
    prevUpdateInstDepartmentResp: updateInstDepartmentResp
  });

  useEffect(() => {
    if (!props.isOpen) {
      addDepartmentForm.resetForm();
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (props.editDepartmentDetails) {
      setDepartmentListState(getInitialState(props.editDepartmentDetails));
    } else {
      setDepartmentListState(getInitialState());
    }
  }, [props.editDepartmentDetails]);

  useEffect(() => {
    const { prevAddInstDepartmentResp, prevUpdateInstDepartmentResp } = addDepartmentRespRef.current;
    if (addInstDepartmentResp && prevAddInstDepartmentResp !== addInstDepartmentResp) {
      props.toggle(true);
      toast.success("Department added successfully.");
    } else if (updateInstDepartmentResp && prevUpdateInstDepartmentResp !== updateInstDepartmentResp) {
      props.toggle(true);
      toast.success("Department updated successfully.");
    }
    addDepartmentRespRef.current.prevAddInstDepartmentResp = addInstDepartmentResp;
    addDepartmentRespRef.current.prevUpdateInstDepartmentResp = updateInstDepartmentResp;
  }, [addInstDepartmentResp, updateInstDepartmentResp]);

  function addNewDepartmentHndlr() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), departmentName: "", shortName: "" });
    }
  }

  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  const addDepartmentForm = useFormik({
    enableReinitialize: true,
    initialValues: departmentListState,
    validationSchema,
    onSubmit: (values) => {
      const params = { instituteId: props.instituteId, departmentId: props.departmentId },
        filterUniqueId = values.departments.map((item: any) => ({ departmentName: item.departmentName, shortName: item.shortName }));

      if (props.departmentId) {
        const updateDepartmentPayload: any = filterUniqueId[0];
        dispatch(updateInstDepartmentAct(generateActionPayload("update_inst_department", params, updateDepartmentPayload)));
      } else {
        const addDepartmentPayload: any = filterUniqueId;
        dispatch(addInstDepartmentAct(generateActionPayload("add_inst_departments", params, addDepartmentPayload)));
      }
    },
  });

  function handlFromSubmit(event: any) {
    event?.stopPropagation();
  }

  return (

    <div style={{ padding: "1.25rem" }}>
      <div className="tw-grid tw-grid-cols-12 tw-gap-y-4">

        <div className="tw-col-span-12 tw-mb-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">

            <div className="tw-col-span-12 sm:tw-col-span-6">
              <div className="tw-flex tw-items-center">
                <h6 className="tw-mb-0 tw-mr-2 tw-text-sm tw-font-medium">
                  Department Name
                </h6>

                {!props.departmentId && (
                  <Button
                    variant="hoverInfo"
                    onClick={addNewDepartmentHndlr}
                    className="!tw-p-1"
                  >
                    <i className="ri-add-line tw-text-lg" />
                  </Button>
                )}
              </div>
            </div>

            <div className="tw-col-span-12 sm:tw-col-span-6">
              <h6 className="tw-mb-0 tw-text-sm tw-font-medium">
                Short Code
              </h6>
            </div>

          </div>
        </div>

        <div className="tw-col-span-12">
          <FormikProvider value={addDepartmentForm}>
            <FieldArray name="departments">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }

                return (
                  <>
                    {addDepartmentForm.values.departments.length > 0 &&
                      addDepartmentForm.values.departments.map((department, index) => {
                        const inputFieldErrors: any = addDepartmentForm.errors.departments && addDepartmentForm.errors.departments[index] || {};
                        const inputFieldTouched = addDepartmentForm.touched.departments && addDepartmentForm.touched.departments[index] || {};
                        return (
                            <div
                              key={department.uniqueId}
                              className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3"
                            >
                              <div className="tw-col-span-12 sm:tw-col-span-6">
                                <TextInput
                                  name={`departments[${index}].departmentName`}
                                  value={department.departmentName}
                                  formgroupClassName="tw-mb-0"
                                  onChange={addDepartmentForm.handleChange}
                                  onBlur={addDepartmentForm.handleBlur}
                                  invalid={(inputFieldTouched.departmentName && inputFieldErrors.departmentName) ? true : false}
                                error={(inputFieldTouched.departmentName && inputFieldErrors.departmentName) ? inputFieldErrors.departmentName : ""}
                              />
                              </div>

                              <div className="tw-col-span-12 sm:tw-col-span-6">
                                <div className="tw-flex tw-items-center tw-gap-2">
                                  <TextInput
                                    name={`departments[${index}].shortName`}
                                    inputClassName="tw-w-4/5"
                                    value={department.shortName}
                                    formgroupClassName="tw-mb-0"
                                    onChange={addDepartmentForm.handleChange}
                                    onBlur={addDepartmentForm.handleBlur}
                                    invalid={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? true : false}
                                  error={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? inputFieldErrors.shortName : ""}
                                />

                                  {index !== 0 && (
                                    <Button
                                    variant="wrong"
                                      data-index={index}
                                      onClick={removeDepartmentHndlr}
                                    >
                                      <i className="ri-delete-bin-2-fill" />
                                    </Button>
                                  )}
                                </div>
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

        <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-mb-1">
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
            onClick={(event: any) => addDepartmentForm.handleSubmit(event)}
            disabled={showApiLoader}
          >
            {props.departmentId ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AddEditDepartment);
