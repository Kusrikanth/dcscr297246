import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../../Components/Common";
import { Input, FormGroup, Label } from "reactstrap";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import * as Yup from "yup";
import React, { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  questionsCodeListDto: [
    {
      id: generateUniqueNumber(),
      classId: "",
      subjectId: "",
      codeFormat: "",
      totalDigitsId: "",
      exampleCode: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  questionsCodeListDto: Yup.array().of(
    Yup.object().shape({
      classId: Yup.string().required("Class name is required"),
      subjectId: Yup.string().required("Subject Name is required"),
      codeFormat: Yup.string().required("Code Format is required"),
      totalDigitsId: Yup.string().required("Total Digits Id is required"),
    })
  ),
});

const AddEditQuestionCodeFormatModal = (props: any) => {
  const questionCodeFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {},
  });

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  function addNewQuestionCodeHandlr(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        classId: "",
        subjectId: "",
        codeFormat: "",
        totalDigitsId: "",
      });
    }
  }

  function removeQuestionCodeHandlr(
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
                <div className="col-2">
                  <h6 className="form-label required mb-0">Class</h6>
                </div>
                <div className="col-2">
                  <h6 className="form-label required mb-0">Subject</h6>
                </div>
                <div className="col-3">
                  <h6 className="form-label required mb-0">Code Format</h6>
                </div>
                <div className="col-2">
                  <h6 className="form-label required mb-0">Total Digits</h6>
                </div>
                <div className="col-3">
                  <h6 className="form-label required mb-0">Example Code</h6>
                </div>
              </div>
            </div>
            <div className="col-12">
              <FormikProvider value={questionCodeFormik}>
                <FieldArray name="questionsCodeListDto">
                  {(arrayHelpers: ArrayHelpers) => {
                    formikArrayHelpers.current = arrayHelpers;
                    return (
                      <>
                        {questionCodeFormik.values.questionsCodeListDto.map(
                          (question: any, idx: any) => {
                            const inputFieldErrors: any =
                              (questionCodeFormik.errors.questionsCodeListDto &&
                                questionCodeFormik.errors.questionsCodeListDto[
                                  idx
                                ]) ||
                              {};
                            const inputFieldTouched: any =
                              (questionCodeFormik.touched
                                .questionsCodeListDto &&
                                questionCodeFormik.touched.questionsCodeListDto[
                                  idx
                                ]) ||
                              {};

                            return (
                              <div
                                key={question.id}
                                className="mb-3 row mx-0 border-bottom hstack align-items-center pb-3 gx-3"
                              >
                                <div className="col-2">
                                  <SelectInput
                                    name={`questionsCodeListDto[${idx}].classId`}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    value={""}
                                    formgroupClassName="mb-0"
                                    menuItems={[]}
                                    valueKey=""
                                    textKey=""
                                  ></SelectInput>
                                </div>
                                <div className="col-2">
                                  <SelectInput
                                    name={`questionsCodeListDto[${idx}].subjectId`}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    value={""}
                                    formgroupClassName="mb-0"
                                    menuItems={[]}
                                    valueKey=""
                                    textKey=""
                                  ></SelectInput>
                                </div>
                                <div className="col-3">
                                  <TextInput
                                    name={`questionsCodeListDto[${idx}].codeFormat`}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    value={""}
                                    formgroupClassName="mb-0"
                                  ></TextInput>
                                </div>
                                <div className="col-2">
                                  <SelectInput
                                    name={`questionsCodeListDto[${idx}].totalDigitsId`}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    value={""}
                                    formgroupClassName="mb-0"
                                    menuItems={[]}
                                    valueKey=""
                                    textKey=""
                                  ></SelectInput>
                                </div>
                                <div className="col-2">
                                  <TextInput
                                    name={`questionsCodeListDto[${idx}].exampleCode`}
                                    onChange={() => {}}
                                    onBlur={() => {}}
                                    value={""}
                                    formgroupClassName="mb-0"
                                    isDisabled={true}
                                  ></TextInput>
                                </div>
                                <div className="col-1">
                                  {idx !== 0 && (
                                    <button
                                      data-index={idx}
                                      onClick={removeQuestionCodeHandlr}
                                      className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white ms-3"
                                      type="button"
                                    >
                                      <HugeiconsIcon
                                        icon={Delete02StrokeStandard}
                                        className="text-danger"
                                        size={18}
                                      />
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

            {!props?.id && (
              <div className="row">
                <div className="col-12">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={addNewQuestionCodeHandlr}
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
            <button
              type="button"
              className="btn btn-light"
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              type="submit"
              onClick={() => {}}
            >
              {props.id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEditQuestionCodeFormatModal;
