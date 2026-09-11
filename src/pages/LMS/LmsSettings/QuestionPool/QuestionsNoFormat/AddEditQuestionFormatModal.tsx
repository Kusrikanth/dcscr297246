import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextInput } from "../../../../../Components/Common";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import * as Yup from "yup";
import React, { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { saveQuestionNoFormatAct, updateQuestionNoFormatAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";

const initialValues = {
  questionsNoListDto: [
    {
      id: generateUniqueNumber(),
      formatType: "",
      example: "",
      notes: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  questionsNoListDto: Yup.array().of(
    Yup.object().shape({
      formatType: Yup.string().required("Format type is required"),
      example: Yup.string().required("Looks like is required"),
      notes: Yup.string().required("Notes filed is required"),
    })
  ),
});

const AddEditQuestionFormatModal = (props: any) => {
    
  const dispatch = useAppDispatch();
  const questionNoFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: any) => {
      if(!props.id){
        const payload = values.questionsNoListDto.map((question: any) => ({
          formatType: question.formatType,
          example: question.example,
          notes: question.notes,
        }));
        
        dispatch(saveQuestionNoFormatAct(generateActionPayload("save_question_no_format", undefined, payload)));
      }
      else {
        const payload = {
          formatType: values.questionsNoListDto[0].formatType,
          example: values.questionsNoListDto[0].example,
          notes: values.questionsNoListDto[0].notes,
        };
        
        dispatch(updateQuestionNoFormatAct(generateActionPayload("update_question_no_format", {id:props.id}, payload)));
      }

    }
  });

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  function addNewQuestionNoHandlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        formatType: "",
        example: "",
        notes: "",
      });
    }
  }
  const {
        getQuestionNoFormatResp,
        saveQuestionNoFormatResp,
        lmsSettingsErrorAct
      } = useAppSelector(
        ({ lmsSettings }) => ({
         getQuestionNoFormatResp: lmsSettings.getQuestionNoFormatResp,
         saveQuestionNoFormatResp: lmsSettings.saveQuestionNoFormatResp,
         lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct
        }),
        shallowEqual
      );
  

  useEffect(() => {
    if (props.id) {
      const data = getQuestionNoFormatResp?.data?.find((item: any) => +item.id === +props.id);
      if (data) {
        questionNoFormik.setValues({
          questionsNoListDto: data ? [data] : [
            {
              id: generateUniqueNumber(),
              formatType: "",
              example: "",
              notes: "",
            },
          ],
        })
      }
      
    }
  },[props.id]);
  function removeQuestionNoHandlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  return (
    <>
      <div className="modal-body p-3">
        <form onSubmit={questionNoFormik.handleSubmit}>
          <div className="row">
            <div className="col-12">
              <div className="row py-2 mb-3 mx-0 bg-light">
                <div className="col-3">
                  <h6 className="form-label required mb-0">Format Type</h6>
                </div>
                <div className="col-3">
                  <h6 className="form-label required mb-0">Looks Like</h6>
                </div>
                <div className="col-5">
                  <h6 className="form-label required mb-0">Notes</h6>
                </div>
              </div>
            </div>
            <div className="col-12">
              <FormikProvider value={questionNoFormik}>
                <FieldArray name="questionsNoListDto">
                  {(arrayHelpers: ArrayHelpers) => {
                    formikArrayHelpers.current = arrayHelpers;
                    return (
                      <>
                        {questionNoFormik.values?.questionsNoListDto.map(
                          (question: any, idx: any) => {
                            return (
                              <div
                                key={question.id}
                                className="mb-3 row mx-0 border-bottom hstack align-items-center pb-3 gx-3"
                              >
                                <div className="col-3">
                                  <TextInput
                                    name={`questionsNoListDto[${idx}].formatType`}
                                    onChange={questionNoFormik.handleChange}
                                    // onBlur={() => {}}
                                    value={question.formatType}
                                    formgroupClassName="mb-0"
                                    invalid={
                                      questionNoFormik.touched.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto[idx]
                                        ? true
                                        : false
                                    }
                                    error={
                                      questionNoFormik.touched.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto[idx]
                                        ? questionNoFormik.errors.questionsNoListDto[idx].formatType
                                        : ""
                                    }
                                  ></TextInput>
                                </div>
                                <div className="col-3">
                                  <TextInput
                                    name={`questionsNoListDto[${idx}].example`}
                                    onChange={questionNoFormik.handleChange}
                                    // onBlur={() => {}}
                                    value={question.example}
                                    formgroupClassName="mb-0"
                                    invalid={
                                      questionNoFormik.touched.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto[idx]
                                        ? true
                                        : false
                                    }
                                    error={
                                      questionNoFormik.touched.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto[idx]
                                        ? questionNoFormik.errors.questionsNoListDto[idx].example
                                        : ""
                                    }
                                  ></TextInput>
                                </div>
                                <div className="col-5">
                                  <TextInput
                                    name={`questionsNoListDto[${idx}].notes`}
                                    onChange={questionNoFormik.handleChange}
                                    // onBlur={() => {}}
                                    value={question.notes}
                                    formgroupClassName="mb-0"
                                    invalid={
                                      questionNoFormik.touched.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto[idx]
                                        ? true
                                        : false
                                    }
                                    error={
                                      questionNoFormik.touched.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto &&
                                      questionNoFormik.errors.questionsNoListDto[idx]
                                        ? questionNoFormik.errors.questionsNoListDto[idx].notes
                                        : ""
                                    }
                                  ></TextInput>
                                </div>
                                <div className="col-1">
                                  {idx !== 0 && (
                                    <button
                                      data-index={idx}
                                      onClick={removeQuestionNoHandlr}
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
                    onClick={addNewQuestionNoHandlr}
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
            >
              {props.id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEditQuestionFormatModal;
