import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../../Components/Common";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import * as Yup from "yup";
import React, { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { FormGroup, Label, Input } from "reactstrap";
import { saveDifficultyLevelsAct, updateDifficultyLevelsAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const initialValues = {
  difficultyLevelDto: [
    {
      id: generateUniqueNumber(),
      difficultyLevel: "",
      code: "",
      colorCode: "",
      status: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  difficultyLevelDto: Yup.array().of(
    Yup.object().shape({
      difficultyLevel: Yup.string().required("Difficulty Level is required"),
      code: Yup.string().required("Code is required"),
      colorCode: Yup.string().required("Color Tag is required"),
      // status: Yup.string().required("Status is required"),
    })
  ),
});

const AddEditDiffcultyModal = (props: any) => {
  const dispatch = useAppDispatch();
  const difficultyLevelFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (props?.id) {
  const payloadObject = {
    difficultyLevel: values.difficultyLevelDto[0]?.difficultyLevel,
    shortName: values.difficultyLevelDto[0]?.code,
    colorCode: values.difficultyLevelDto[0]?.colorCode, // 🔑 send hex here
  };
  dispatch(updateDifficultyLevelsAct(
    generateActionPayload("update_difficulty_levels", { id: props.id }, payloadObject)
  ));
} else {
  const payloadArray = values.difficultyLevelDto.map((item) => ({
    difficultyLevel: item.difficultyLevel,
    shortName: item.code,
    colorCode: item.colorCode, // 🔑 send hex here
  }));
  dispatch(saveDifficultyLevelsAct(
    generateActionPayload("save_difficulty_levels", undefined, payloadArray)
  ));
}

    },
  });

  const {
    currentBranchIdResp: branchId,
    getDifficultyLevelsByIdResp,
  } = useAppSelector(
    ({ examinationSettings, appData, lmsSettings }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getDifficultyLevelsByIdResp: lmsSettings.getDifficultyLevelsByIdResp,
    }),
    shallowEqual
  );
useEffect(() => {
  if (props.id && getDifficultyLevelsByIdResp) {
    difficultyLevelFormik.setValues({
      difficultyLevelDto: [
        {
          id: getDifficultyLevelsByIdResp.id ?? generateUniqueNumber(),
          difficultyLevel: getDifficultyLevelsByIdResp.difficultyLevel ?? "",
          code: getDifficultyLevelsByIdResp.shortName ?? "",
          colorCode: getDifficultyLevelsByIdResp.colorCode ?? "",
          status: getDifficultyLevelsByIdResp.status ?? "",
        },
      ],
    });
  }
}, [props.id, getDifficultyLevelsByIdResp]);


  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  function addDifficultyLevelHandlr(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        difficultyLevel: "",
        code: "",
        colorCode: "",
      });
    }
  }

  function removeDifficultyLevelHandlr(
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
                <div className="col-4">
                  <h6 className="form-label required mb-0">Difficulty Level</h6>
                </div>
                <div className="col-4">
                  <h6 className="form-label required mb-0">Code</h6>
                </div>
                <div className="col-4">
                  <h6 className="form-label required mb-0">Color tag</h6>
                </div>
              </div>
            </div>
            <div className="col-12">
              <FormikProvider value={difficultyLevelFormik}>
                <FieldArray name="difficultyLevelDto">
                  {(arrayHelpers: ArrayHelpers) => {
                    formikArrayHelpers.current = arrayHelpers;
                    return (
                      <>
                        {difficultyLevelFormik.values.difficultyLevelDto.map(
                          (question: any, idx: any) => {
                            const inputFieldErrors: any =
                              (difficultyLevelFormik.errors.difficultyLevelDto &&
                                difficultyLevelFormik.errors.difficultyLevelDto[
                                idx
                                ]) ||
                              {};
                            const inputFieldTouched: any =
                              (difficultyLevelFormik.touched.difficultyLevelDto &&
                                difficultyLevelFormik.touched.difficultyLevelDto[
                                idx
                                ]) ||
                              {};
                            return (
                              <div
                                key={question.id}
                                className="mb-3 row mx-0 border-bottom hstack align-items-center gx-3"
                              >
                                <div className="col-4">
                                  <TextInput
                                    name={`difficultyLevelDto[${idx}].difficultyLevel`}
                                    labelClass="required"
                                    formgroupClassName="mb-0 w-80 me-2"
                                    value={question.difficultyLevel}
                                    onChange={difficultyLevelFormik.handleChange}
                                    invalid={inputFieldTouched.difficultyLevel && inputFieldErrors.difficultyLevel ? true : false}
                                    error={inputFieldTouched.difficultyLevel && inputFieldErrors.difficultyLevel ? inputFieldErrors.difficultyLevel : ""}
                                  ></TextInput>
                                </div>
                                <div className="col-4">
                                  <TextInput
                                    name={`difficultyLevelDto[${idx}].code`}
                                    labelClass="required"
                                    formgroupClassName="mb-0 w-80 me-2"
                                    value={question.code}
                                    onChange={difficultyLevelFormik.handleChange}
                                    invalid={inputFieldTouched.code && inputFieldErrors.code ? true : false}
                                    error={inputFieldTouched.code && inputFieldErrors.code ? inputFieldErrors.code : ""}
                                  ></TextInput>
                                </div>
                                <div className="col-4">
                                  <FormGroup>
                                    <Input
                                      name={`difficultyLevelDto[${idx}].colorCode`}
                                      type="color"
                                      className="form-control form-control-color w-100"
                                      id={`difficultyLevelDto[${idx}].colorCode`}
                                      value={question.colorCode || "#364574"}   // bind to formik state
                                      onChange={difficultyLevelFormik.handleChange} // update formik
                                      invalid={inputFieldTouched.colorCode && inputFieldErrors.colorCode ? true : false}
                                      error={inputFieldTouched.colorCode && inputFieldErrors.colorCode ? inputFieldErrors.colorCode : ""}
                                    />

                                  </FormGroup>
                                </div>
                                <div className="col-1">
                                  {idx !== 0 && (
                                    <button
                                      data-index={idx}
                                      onClick={removeDifficultyLevelHandlr}
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
                    onClick={addDifficultyLevelHandlr}
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
                difficultyLevelFormik.handleSubmit(event)
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

export default AddEditDiffcultyModal;
