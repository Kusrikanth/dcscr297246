import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextInput, TextInputWithRegex } from "../../../../../Components/Common";
import { Input, FormGroup, Label } from "reactstrap";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import * as Yup from "yup";
import React, { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { saveQuestionTypesAct, updateQuestionTypesAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";

const initialValues = {
  questionsListDto: [
    {
      id: generateUniqueNumber(),
      questionType: "",
      shortName: "",
      typicalMarks: "",
      formatStyle: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  questionsListDto: Yup.array().of(
    Yup.object().shape({
      questionType: Yup.string().required("Type Name is required"),
      shortName: Yup.string().required("Short Name is required"),
      typicalMarks: Yup.string().required("Typical Marks are required"),
      formatStyle: Yup.string().required("Question Format is required"),
    })
  ),
});

const AddEditQuestionTypeModal = (props: any) => {
  const dispatch = useAppDispatch();
  const questionTypeFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      const payloadArray = questionTypeFormik.values.questionsListDto.map(q => ({
        questionType: q.questionType,
        shortName: q.shortName,
        typicalMarks: q.typicalMarks,
        formatStyle: q.formatStyle,
      }));

      if (props?.id) {
        const payload = payloadArray[0];
        dispatch(
          updateQuestionTypesAct(
            generateActionPayload(
              "update_question_types",
              { id: props.id },
              payload
            )
          )
        );
      } else {
        dispatch(
          saveQuestionTypesAct(
            generateActionPayload(
              "save_question_types",
              undefined,
              payloadArray
            )
          )
        );
      }
    },
  });
  const {
    currentBranchIdResp: branchId,
    getQuestionTypesByIdResp,
  } = useAppSelector(
    ({ appData, lmsSettings }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getQuestionTypesByIdResp: lmsSettings.getQuestionTypesByIdResp,
    }),
    shallowEqual
  );
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  useEffect(() => {
    if (props.id && getQuestionTypesByIdResp) {
      questionTypeFormik.setValues({
        questionsListDto: [
          {
            id: getQuestionTypesByIdResp.id || generateUniqueNumber(),
            questionType: getQuestionTypesByIdResp.questionType || "",
            shortName: getQuestionTypesByIdResp.shortName || "",
            typicalMarks: getQuestionTypesByIdResp.typicalMarks || "",
            formatStyle: getQuestionTypesByIdResp.formatStyle || "",
          },
        ],
      });
    }
  }, [props.id, getQuestionTypesByIdResp]);
  function addNewTagHandlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        questionType: "",
        shortName: "",
        typicalMarks: "",
        questionFormat: "",
      });
    }
  }

  function removeTagHandlr(event: React.MouseEvent<HTMLButtonElement>) {
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
                <div className="col-3">
                  <h6 className="form-label required mb-0">Type Name</h6>
                </div>
                <div className="col-2">
                  <h6 className="form-label required mb-0">Short Name</h6>
                </div>
                <div className="col-2">
                  <h6 className="form-label required mb-0">Typical Marks</h6>
                </div>
                <div className="col-4">
                  <h6 className="form-label required mb-0">Format / Style</h6>
                </div>
              </div>
            </div>
            <div className="col-12">
              <FormikProvider value={questionTypeFormik}>
                <FieldArray name="questionsListDto">
                  {(arrayHelpers: ArrayHelpers) => {
                    formikArrayHelpers.current = arrayHelpers;
                    return (
                      <>
                        {questionTypeFormik.values.questionsListDto.map(
                          (question: any, idx: any) => {
                            const inputFieldErrors: any =
                              (questionTypeFormik.errors.questionsListDto &&
                                questionTypeFormik.errors.questionsListDto[
                                idx
                                ]) ||
                              {};
                            const inputFieldTouched: any =
                              (questionTypeFormik.touched.questionsListDto &&
                                questionTypeFormik.touched.questionsListDto[
                                idx
                                ]) ||
                              {};

                            return (
                              <div
                                key={question.id}
                                className="mb-3 row mx-0 border-bottom hstack align-items-center pb-3 gx-3"
                              >
                                <div className="col-3">
                                  <TextInput
                                    name={`questionsListDto[${idx}].questionType`}
                                    labelClass="required"
                                    formgroupClassName="mb-0 w-80 me-2"
                                    value={question.questionType}
                                    onChange={questionTypeFormik.handleChange}
                                    invalid={inputFieldTouched.questionType && inputFieldErrors.questionType ? true : false}
                                    error={inputFieldTouched.questionType && inputFieldErrors.questionType ? inputFieldErrors.questionType : ""}
                                  />
                                </div>
                                <div className="col-2 ">
                                  <TextInput
                                    name={`questionsListDto[${idx}].shortName`}
                                    labelClass="required"
                                    formgroupClassName="mb-0 w-80 me-2"
                                    value={question.shortName}
                                    onChange={questionTypeFormik.handleChange}
                                    invalid={inputFieldTouched.shortName && inputFieldErrors.shortName ? true : false}
                                    error={inputFieldTouched.shortName && inputFieldErrors.shortName ? inputFieldErrors.shortName : ""}
                                  />
                                </div>
                                <div className="col-2 ">
                                  <TextInputWithRegex
                                    name={`questionsListDto[${idx}].typicalMarks`}
                                    labelClass="required"
                                    formgroupClassName="mb-0 w-80 me-2"
                                    value={question.typicalMarks}
                                    onChange={questionTypeFormik.handleChange}
                                    allowedInputRegex="^[0-9]+$"
                                    maxLength={3}
                                    invalid={inputFieldTouched.typicalMarks && inputFieldErrors.typicalMarks ? true : false}
                                    error={inputFieldTouched.typicalMarks && inputFieldErrors.typicalMarks ? inputFieldErrors.typicalMarks : ""}
                                  />
                                </div>
                                <div className="col-4 ">
                                  <TextInput
                                    name={`questionsListDto[${idx}].formatStyle`}
                                    labelClass="required"
                                    formgroupClassName="mb-0 w-80 me-2"
                                    value={question.formatStyle}
                                    onChange={questionTypeFormik.handleChange}
                                    invalid={inputFieldTouched.formatStyle && inputFieldErrors.formatStyle ? true : false}
                                    error={inputFieldTouched.formatStyle && inputFieldErrors.formatStyle ? inputFieldErrors.formatStyle : ""}
                                  />
                                </div>
                                <div className="col-1">
                                  {idx !== 0 && (
                                    <button
                                      data-index={idx}
                                      onClick={removeTagHandlr}
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
                    onClick={addNewTagHandlr}
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

          <div className="hstack gap-2 justify-content-end mb-1 pt-3 pb-0">
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
              onClick={(event: any) =>
                questionTypeFormik.handleSubmit(event)
              }
            >
              {props.id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEditQuestionTypeModal;
