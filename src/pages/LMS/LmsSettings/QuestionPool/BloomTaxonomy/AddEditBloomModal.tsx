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
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { saveBloomTaxonomyAct, updateBloomTaxonomyAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";

const initialValues = {
  bloomLevelDto: [
    {
      id: generateUniqueNumber(),
      bloomLevel: "",
      shortName: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  bloomLevelDto: Yup.array().of(
    Yup.object().shape({
      bloomLevel: Yup.string().required("Bloom Level is required"),
      shortName: Yup.string().required("Short Name is required"),
    })
  ),
});

const AddEditBloomModal = (props: any) => {
  const dispatch = useAppDispatch();
  const bloomLevelFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: any) => {
      if(!props.id){
        const payload = values.bloomLevelDto?.map((question: any) => ({
            bloomLevel: question.bloomLevel,
            shortName: question.shortName,
          }));
        dispatch(saveBloomTaxonomyAct(generateActionPayload("save_bloom_taxonomy", undefined, payload)));
      }
      else {
       const payload = {
          bloomLevel: values.bloomLevelDto[0].bloomLevel,
          shortName: values.bloomLevelDto[0].shortName,
        };
        dispatch(updateBloomTaxonomyAct(generateActionPayload("update_bloom_taxonomy", {id:props.id}, payload)));
      }
      
    },
  });

    const {
      getBloomTaxonomyResp,
    } = useAppSelector(
      ({ lmsSettings }) => ({
        getBloomTaxonomyResp: lmsSettings.getBloomTaxonomyResp,
      }),
      shallowEqual
    );
  

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  function addBloomLevelHandlr(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        bloomLevel: "",
        shortName: "",
      });
    }
  }

  useEffect(() => {
      if (props.id) {
        const data = getBloomTaxonomyResp?.data?.find((item: any) => +item.id === +props.id);
        if (data) {
          bloomLevelFormik.setValues({
            bloomLevelDto: data ? [data] : [
              {
                id: generateUniqueNumber(),
                bloomLevel: "",
                shortName: "",
              },
            ],
          })
        }
        
      }
    },[props.id]);

  function removeBloomLevelHandlr(
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
        <form onSubmit={bloomLevelFormik.handleSubmit}>
          <div className="row">
            <div className="col-12">
              <div className="row py-2 mb-3 mx-0 bg-light">
                <div className="col-5">
                  <h6 className="form-label required mb-0">Bloom Level</h6>
                </div>
                <div className="col-5">
                  <h6 className="form-label required mb-0">Short Name</h6>
                </div>

              </div>
            </div>
            <div className="col-12">
              <FormikProvider value={bloomLevelFormik}>
                <FieldArray name="bloomLevelDto">
                  {(arrayHelpers: ArrayHelpers) => {
                    formikArrayHelpers.current = arrayHelpers;
                    return (
                      <>
                        {bloomLevelFormik.values.bloomLevelDto?.map(
                          (question: any, idx: any) => {
                            return (
                              <div
                                key={question.id}
                                className="mb-3 row mx-0 border-bottom hstack align-items-center gx-3 pb-3"
                              >
                                <div className="col-5">
                                  <TextInput
                                    name={`bloomLevelDto[${idx}].bloomLevel`}
                                    onChange={bloomLevelFormik.handleChange}
                                    // onBlur={() => {}}
                                    value={question.bloomLevel}
                                    formgroupClassName="mb-0"
                                     invalid={
                                      bloomLevelFormik.touched.bloomLevelDto &&
                                      bloomLevelFormik.errors.bloomLevelDto &&
                                      bloomLevelFormik.errors.bloomLevelDto[idx]
                                        ? true
                                        : false
                                    }
                                    error={
                                      bloomLevelFormik.touched.bloomLevelDto &&
                                      bloomLevelFormik.errors.bloomLevelDto &&
                                      bloomLevelFormik.errors.bloomLevelDto[idx]
                                        ? bloomLevelFormik.errors.bloomLevelDto[idx].bloomLevel
                                        : ""
                                    }
                                  ></TextInput>
                                </div>
                                <div className="col-5">
                                  <TextInput
                                    name={`bloomLevelDto[${idx}].shortName`}
                                    onChange={bloomLevelFormik.handleChange}
                                    // onBlur={() => {}}
                                    value={question.shortName}
                                    formgroupClassName="mb-0"
                                     invalid={
                                      bloomLevelFormik.touched.bloomLevelDto &&
                                      bloomLevelFormik.errors.bloomLevelDto &&
                                      bloomLevelFormik.errors.bloomLevelDto[idx]
                                        ? true
                                        : false
                                    }
                                    error={
                                      bloomLevelFormik.touched.bloomLevelDto &&
                                      bloomLevelFormik.errors.bloomLevelDto &&
                                      bloomLevelFormik.errors.bloomLevelDto[idx]
                                        ? bloomLevelFormik.errors.bloomLevelDto[idx].shortName
                                        : ""
                                    }
                                  ></TextInput>
                                </div>
                                <div className="col-1">
                                  {idx !== 0 && (
                                    <button
                                      data-index={idx}
                                      onClick={removeBloomLevelHandlr}
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
                    onClick={addBloomLevelHandlr}
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

export default AddEditBloomModal;
