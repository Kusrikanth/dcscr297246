import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextInput } from "../../../../../Components/Common";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import {
  Delete02StrokeStandard,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import React, { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";

const initialValues = {
  assignmentListDto: [
    {
      id: generateUniqueNumber(),
      assignmentType: "",
      description: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  assignmentListDto: Yup.array().of(
    Yup.object().shape({
      assignmentType: Yup.string().required("Assignment Type is required"),
      description: Yup.string().required("Description is required"),
    })
  ),
});

const AddEditAssignmentTypeModal = ({ id, toggle }) => {
  const assignmentTypeFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {},
  });

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  function addNewAssignmentTypeHandlr(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        assignmentType: "",
        description: "",
      });
    }
  }

  function removeAssignmentTypeHandlr(
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
                  <h6 className="form-label required mb-0">Assignment Type</h6>
                </div>
                <div className="col-6">
                  <h6 className="form-label required mb-0">Description</h6>
                </div>
              </div>
            </div>
            <div className="col-12">
              <FormikProvider value={assignmentTypeFormik}>
                <FieldArray name="assignmentListDto">
                  {(arrayHelpers: ArrayHelpers) => {
                    formikArrayHelpers.current = arrayHelpers;

                    return (
                      <>
                        {assignmentTypeFormik.values.assignmentListDto.map(
                          (item: any, idx: any) => {
                            return (
                              <div
                                key={item.id}
                                className="mb-3 row mx-0 border-bottom hstack align-items-center pb-3 gx-3"
                              >
                                <div className="col-5">
                                  <TextInput
                                    name="assignmentName"
                                    value={""}
                                    onChange={() => {}}
                                    formgroupClassName="mb-0"
                                    placeHolder="Assignment Name"
                                  ></TextInput>
                                </div>
                                <div className="col-6">
                                  <TextInput
                                    name="description"
                                    value={""}
                                    onChange={() => {}}
                                    formgroupClassName="mb-0"
                                    placeHolder="Description"
                                  ></TextInput>
                                </div>
                                <div className="col-1">
                                  {idx !== 0 && (
                                    <button
                                      data-index={idx}
                                      className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white ms-3"
                                      type="button"
                                      onClick={removeAssignmentTypeHandlr}
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
                    onClick={addNewAssignmentTypeHandlr}
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

export default AddEditAssignmentTypeModal;
