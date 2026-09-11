import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import {
  MultiSelectCheckbox,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import {
  Delete02StrokeStandard,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import React, { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { assignmentOptions } from "./helper";

const initialValues = {
  assignmentLevelListDto: [
    {
      id: generateUniqueNumber(),
      assignmentClasses: "",
      assignmentTypes: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  assignmentLevelListDto: Yup.array().of(
    Yup.object().shape({
      assignmentClasses: Yup.string().required("Class is required"),
      assignmentTypes: Yup.string().required("Assignment Type is required"),
    })
  ),
});

const AddEditAssignmentLevelModal = ({ id, toggle }) => {
  const assignmentTypeFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {},
  });

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  function addNewAssignmentLevelHandlr(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        assignmentClasses: "",
        assignmentTypes: "",
      });
    }
  }

  function removeAssignmentLevelHandlr(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  return (
    <>
      <div className="modal-body p-3">
        <form>
          <div className="row">
            <div className="col-12">
              <div className="row py-2 mb-3 mx-0 bg-light">
                <div className="col-5">
                  <h6 className="form-label required mb-0">Select Classes</h6>
                </div>
                <div className="col-6">
                  <h6 className="form-label required mb-0">
                    Select Assignment Types
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-12">
              <FormikProvider value={assignmentTypeFormik}>
                <FieldArray name="assignmentLevelListDto">
                  {(arrayHelpers: ArrayHelpers) => {
                    formikArrayHelpers.current = arrayHelpers;

                    return (
                      <>
                        {assignmentTypeFormik.values.assignmentLevelListDto.map(
                          (item: any, idx: any) => {
                            return (
                              <div
                                key={item.id}
                                className="mb-3 row mx-0 border-bottom hstack align-items-center pb-3 gx-3"
                              >
                                <div className="col-5">
                                  <MultiSelectCheckbox
                                    name="assignmentName"
                                    idKey="assignmentId"
                                    value={""}
                                    renderValue={[]}
                                    renderOptions={[]}
                                    onChange={() => {}}
                                    options={[]}
                                  ></MultiSelectCheckbox>
                                </div>
                                <div className="col-6">
                                  <MultiSelectCheckbox
                                    name="assignmentTypes"
                                    idKey=""
                                    value={""}
                                    renderValue={[]}
                                    renderOptions={[]}
                                    onChange={() => {}}
                                    options={[]}
                                  ></MultiSelectCheckbox>
                                </div>
                                <div className="col-1">
                                  {idx !== 0 && (
                                    <button
                                      data-index={idx}
                                      className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white ms-3"
                                      type="button"
                                      onClick={removeAssignmentLevelHandlr}
                                    >
                                      <HugeiconsIcon
                                        icon={Delete02StrokeStandard}
                                        className="text-danger"
                                        size={18}
                                      ></HugeiconsIcon>
                                    </button>
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

            {!id && (
              <div className="row">
                <div className="col-12">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={addNewAssignmentLevelHandlr}
                  >
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      className="me-2"
                      size={18}
                    />
                    Add New
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hstack gap-2 justify-content-end mt-4 mb-1 pt-3 pb-0">
            <button type="button" className="btn btn-light" onClick={toggle}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              type="submit"
              onClick={() => {}}
            >
              {id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEditAssignmentLevelModal;
