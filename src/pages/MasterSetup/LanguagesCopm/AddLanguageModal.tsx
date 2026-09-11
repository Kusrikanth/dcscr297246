import React, { useRef, useState, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import { TextInput } from "../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import {  FieldArray, useFormik,  ArrayHelpers, FormikProvider } from "formik";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";

import { IAddLanguagesState, ILanguageResp, newLanguageType } from "./languageTypes";
import { addAcademicLanguagesAct, updateAcademicLanguagesAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  fields: Yup.array().of(
    Yup.object().shape({
      languageName: Yup.string().required("Language name is required."),
    })
  ),
});

const AddLanguageModal: React.FC<any> = (props) => {
  const initialValues = (prop?: any): IAddLanguagesState => {
    return {
      fields: prop
        ? prop
        : [
          {
            languageName: "",
            // shortName: "",
          },
        ],
    };
  };
  const [intialValues, setIntialValues] = useState(() => initialValues());
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const dispatch = useAppDispatch();
  const {
    updateAcademicLanguagesRep,
    addAcademicLanguagesRep,
    instInfoError,
    showApiLoader,
  } = useAppSelector(
    ({ instituteInfo,globalData }: any) => ({
      updateAcademicLanguagesRep: instituteInfo.updateAcademicLanguagesRep,
      addAcademicLanguagesRep: instituteInfo.addAcademicLanguagesRep,
      instInfoError: instituteInfo.instInfoError,
      showApiLoader:globalData.showApiLoader,
    }),
    shallowEqual
  );
  const languageRespRef = useRef<ILanguageResp>({
    prevAddLanguageResp: addAcademicLanguagesRep,
    prevUpdateLanguageResp: updateAcademicLanguagesRep,
    prevLanguageErrorResp: instInfoError,
  });

  useEffect(() => {
    if (!props.isOpen) {
      addLanguageForm.resetForm();
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (props.modalData && props.isOpen) {
      setIntialValues(initialValues(props.modalData && props.modalData.data));
    } else if (!props.isOpen) {
      setIntialValues({
        fields: [
          {
            languageName: "",
            // shortName: "",
          },
        ],
      });
    }
  }, [props.modalData, props.isOpen]);

  useEffect(() => {
    const { prevAddLanguageResp, prevUpdateLanguageResp, prevLanguageErrorResp } =
      languageRespRef.current;

    if (addAcademicLanguagesRep &&
      prevAddLanguageResp !== addAcademicLanguagesRep) {
      toast.success("Language Added successfully.");
      props.toggle(true);
    }
    else if (updateAcademicLanguagesRep &&
      prevUpdateLanguageResp !== updateAcademicLanguagesRep) {
      toast.success("Language Updated successfully.");
      props.toggle(true);
    }
    else if (instInfoError && instInfoError !== prevLanguageErrorResp) {
      const { message }: any = instInfoError;
      toast.error(message);
    }
    languageRespRef.current.prevAddLanguageResp = addAcademicLanguagesRep;
    languageRespRef.current.prevUpdateLanguageResp = updateAcademicLanguagesRep;
    languageRespRef.current.prevLanguageErrorResp = instInfoError;
  }, [addAcademicLanguagesRep, updateAcademicLanguagesRep, instInfoError]);

  function addNewDepartmentHndlr() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ languageName: "" });
    }
  }

  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  const addLanguageForm = useFormik({
    enableReinitialize: true,
    initialValues: intialValues,
    validationSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      let newValues = values.fields.map((v: newLanguageType) => {
        return {
          languageName: v.languageName,
        };
      });
      if (props.modalData) {
        dispatch(updateAcademicLanguagesAct(generateActionPayload("update_academic_language", { intituteId: props.instituteId, languageId: props.modalData.id, }, newValues[0])))
      } else {
        dispatch(addAcademicLanguagesAct(generateActionPayload("add_academic_language", { intituteId: props.instituteId }, newValues)));
      }
    }
  })

  return (
   
    <div className="tw-p-5">

      <div className="tw-mb-3">
        <div className="tw-flex tw-items-center tw-justify-between">

          <h6 className="tw-text-sm tw-font-medium tw-mb-0">
            Language Name
          </h6>

          {!props.departmentId && (
            <Button
              onClick={addNewDepartmentHndlr}
              type="button"
              variant="hoverInfo"
              className="!tw-p-0"
            >
              <i className="ri-add-line tw-text-lg" />
            </Button>
          )}

        </div>
      </div>

      <div className="tw-w-full">
        <FormikProvider value={addLanguageForm}>
          <FieldArray name="fields">
            {(arrayHelpers: ArrayHelpers) => {
              if (!formikArrayHelpers.current) {
                formikArrayHelpers.current = arrayHelpers;
              }

              return (
                <>
                  {addLanguageForm.values.fields.length > 0 &&
                    addLanguageForm.values.fields.map(
                      (item: any, index: number) => {

                        const inputFieldErrors: any =
                          (addLanguageForm.errors.fields &&
                            addLanguageForm.errors.fields[index]) || {};

                        const inputFieldTouched =
                          (addLanguageForm.touched.fields &&
                            addLanguageForm.touched.fields[index]) || {};

                        return (
                          <div
                            key={`language-${index}`}
                            className="tw-flex tw-items-start tw-gap-2 tw-mb-3"
                          >

                            <div className="tw-flex-1">
                              <TextInput
                                name={`fields[${index}].languageName`}
                                value={
                                  addLanguageForm.values.fields[index].languageName
                                }
                                onChange={addLanguageForm.handleChange}
                                onBlur={addLanguageForm.handleBlur}
                                invalid={
                                  inputFieldTouched.languageName &&
                                    inputFieldErrors.languageName
                                    ? true
                                    : false
                                }
                                error={
                                  inputFieldTouched.languageName &&
                                    inputFieldErrors.languageName
                                    ? inputFieldErrors.languageName
                                    : ""
                                }
                              />
                            </div>

                            {index !== 0 && (
                              <Button
                                type="button"
                                data-id={item.id}
                                data-index={index}
                                onClick={removeDepartmentHndlr}
                                variant="wrong"
                              >
                                <i className="ri-delete-bin-2-fill" />
                              </Button>
                            )}

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
          onClick={(event: any) => addLanguageForm.handleSubmit(event)}
          disabled={showApiLoader}
        >
          Submit
        </Button>

      </div>
    </div>

 
  )
}

export default React.memo(AddLanguageModal);
