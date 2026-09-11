import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { shallowEqual } from "react-redux";

import {  savePreparatoryDomainAct, updatePreparatoryDomainAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateUniqueNumber } from "../../../../../../utility/commonutility";
import { TextInput } from "../../../../../../Components/Common";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";


const getInitialValues = (dataLength: number) => ({
  term: [
    {
      uniqueId: generateUniqueNumber(),
      name: "",
      domainIndex: String(dataLength + 1),
    },
  ],
});

const validationSchema = Yup.object().shape({
  term: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().nullable().required('Domain Name is required'),

    })
  )
})

const AddEditNewPreparatoryModal = (props: any) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
    showApiLoader,
    getPreparatoryDomainResp,
  } = useAppSelector(({ examinationSettings, globalData }) => ({
    showApiLoader: globalData.showApiLoader,
    getPreparatoryDomainResp: examinationSettings.getPreparatoryDomainResp,

  }), shallowEqual);

  const termNameFormik = useFormik({
    initialValues: getInitialValues(props.dataLength || 0),
    validationSchema,
    onSubmit: (values) => {
      if (props.id) {
        const payload = {
          name: values.term[0]?.name || "",
          domainIndex: values.term[0]?.domainIndex || "",
        };
        dispatch(
          updatePreparatoryDomainAct(
            generateActionPayload("update_preparatory_domain", { id: props.id }, payload)
          )
        );
      } else {
        const termDetailsDTOS = values.term
          .filter((ele) => ele.name)
          .map((ele) => ({
            name: ele.name,
            domainIndex: ele.domainIndex,

          }));
        const payload = termDetailsDTOS

        dispatch(
          savePreparatoryDomainAct(
            generateActionPayload("save_preparatory_domain", undefined, payload)
          )
        );
      }
    },
  });


  useEffect(() => {
    if (props.id) {
      const data = getPreparatoryDomainResp?.find((item: any) => +item.id === +props.id);
      termNameFormik.setValues({
        term: [{
          uniqueId: data?.id || generateUniqueNumber(),
          name: data?.name || "",
          domainIndex: data?.domainIndex || "",
        }]
      });
    }
  }, [props.id, getPreparatoryDomainResp]);

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      const nextIndex = (termNameFormik.values.term.length || 0) + (props.dataLength || 0);
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        name: "",
        domainIndex: String(nextIndex + 1),
      });
    }
  }


  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  return (
    <>
      <form onSubmit={termNameFormik.handleSubmit}>
        <div className="">
          <div className="row bg-light px-3 py-3 mb-2 mx-0">
            <div className="col-6 d-flex align-items-center">
              <h6 className="mb-0 form-label required">Domain Name</h6>
            </div>
            <div className="col-4 d-flex align-items-center">
              <h6 className="mb-0 form-label required">Domain Index</h6>
            </div>

            <div className="col-1 d-grid mt-0">
              <div className="hstack">
                {!props?.id && <button
                  onClick={addNewDepartmentHndlr}
                  className="btn-sm ms-3 btn-icon btn btn-outline-primary"
                >
                  <i className="ri-add-line fs-18" />
                </button>}
              </div>
            </div>
          </div>
          <div className="row px-4">
            <div className="col-12 mt-2">
              <FormikProvider value={termNameFormik}>
                <FieldArray name="term">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }
                    return (
                      <>
                        {termNameFormik.values.term.length >
                          0 &&
                          termNameFormik.values.term.map(
                            (term: any, index: any) => {
                              const inputFieldErrors: any = termNameFormik.errors.term && termNameFormik.errors.term[index] || {};
                              const inputFieldTouched = termNameFormik.touched.term && termNameFormik.touched.term[index] || {};
                              return (
                                <div
                                  key={term.uniqueId}
                                  className="row g-3 mb-3"
                                >
                                  <div className="col-6">
                                    <TextInput
                                      name={`term[${index}].name`}
                                      formgroupClassName="mb-0"
                                      value={term.name}
                                      onChange={termNameFormik.handleChange}
                                      invalid={(inputFieldTouched.name && inputFieldErrors.name) ? true : false}
                                      error={(inputFieldTouched.name && inputFieldErrors.name) ? inputFieldErrors.name : ""}
                                      maxLength={500}

                                    />
                                  </div>
                                  <div className="col-4">
                                    <TextInput
                                      name={`term[${index}].domainIndex`}
                                      formgroupClassName="mb-0"
                                      value={term.domainIndex}
                                      onChange={termNameFormik.handleChange}
                                      maxLength={500}


                                    />
                                  </div>
                                  <div className="col d-flex">
                                    <div className="hstack">
                                      {index !== 0 && (
                                        <button
                                          data-index={index}
                                          onClick={removeDepartmentHndlr}
                                          className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                        >
                                          <i className="ri-delete-bin-2-fill" />
                                        </button>
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
          </div>
          <div className="px-4 pb-3 hstack gap-2 justify-content-end mt-2 mb-1">
            <button
              type="button"
              className={"btn btn-light"}
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success px-4" disabled={showApiLoader}>
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddEditNewPreparatoryModal;
