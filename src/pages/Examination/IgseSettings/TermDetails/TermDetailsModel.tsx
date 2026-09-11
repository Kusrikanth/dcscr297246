import React, { useRef, useState, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { DateInput, SelectInput, TextInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { saveIgseTermDetailsAct, updateIgseTermDetailsAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getYyyyMmDdFormat } from "../../../../utility/dateutility";

const initialValues = {
  term: [
    {
      uniqueId: generateUniqueNumber(),
      termId: "",
      fromDate: "",
      toDate: "",
      dated: "",
      termReviewName: "",
      termReviewDate: "",
    },
  ],
};


const TermDetailsModel = (props: any) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();
  const igcse = props.modalData.curriculumShortName === "IGCSE"

  const validationSchema = Yup.object().shape({
    term: Yup.array().of(
      Yup.object().shape({
        termId: Yup.string().nullable().required("Term Name is required"),
        fromDate: Yup.string().nullable().required("From Date is required"),
        toDate: Yup.string().nullable().required("To Date is required"),
        ...(igcse
          ? {
            dated: Yup.string().nullable().required("Date is required"),
            termReviewName: Yup.string()
              .nullable()
              .required("Reviewer Name is required"),
            termReviewDate: Yup.string().nullable().required("Date is required"),
          }
          : {}),
      })
    ),
  });


  const {
    currentBranchIdResp: branchId,
    getIgseTermNameListResp,
    getIgseTermDetailsByIdResp,
  } = useAppSelector(
    ({ examinationSettings, appData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getIgseTermDetailsByIdResp: examinationSettings.getIgseTermDetailsByIdResp,
    }),
    shallowEqual
  );
  const formatDate = (date: string) => `${date.split('T')[0]}T09:00:00`;

  const igseTermDetailsModalFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (props.id) {
        const firstTerm = values.term[0];
        const payload: any = {
          branchId: props.modalData.branchId,
          academicYearId: props.modalData.academicYearId,
          curriculumId: props.modalData.curriculumId,
          classId: props.modalData.classId,
          termId: firstTerm.termId,
          fromDate: formatDate(firstTerm.fromDate),
          toDate: formatDate(firstTerm.toDate),
        };
        if (igcse) {
          payload.dated = firstTerm.dated;
          payload.termReviewName = firstTerm.termReviewName;
          payload.termReviewDate = firstTerm.termReviewDate;
        }

        dispatch(
          updateIgseTermDetailsAct(
            generateActionPayload(
              "update_igse_term_details_by_id",
              { id: props.id },
              payload
            )
          )
        );
      } else {
        const termDetailsDataList = values.term.map((item) => {
          const termData: any = {
            termId: item.termId,
            fromDate: formatDate(item.fromDate),
            toDate: formatDate(item.toDate),
          };
          if (igcse) {
            termData.dated = item.dated;
            termData.termReviewName = item.termReviewName;
            termData.termReviewDate = item.termReviewDate;
          }

          return termData;
        });

        const payload = {
          branchId: props.modalData.branchId,
          academicYearId: props.modalData.academicYearId,
          curriculumId: props.modalData.curriculumId,
          classId: props.modalData.classId,
          termDetailsDataList,
        };

        dispatch(
          saveIgseTermDetailsAct(
            generateActionPayload("save_igse_term_details", undefined, payload)
          )
        );
      }
    },
  });

  const mapTermDates = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    const trimmedDate = dateString.trim();
    if (!trimmedDate) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) return trimmedDate;
    const parts = trimmedDate.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  useEffect(() => {
    if (props.id && getIgseTermDetailsByIdResp) {
      const {
        termId,
        fromDate,
        toDate,
        dated,
        termReviewName,
        termReviewDate,
      } = getIgseTermDetailsByIdResp;

      igseTermDetailsModalFormik.setValues({
        term: [
          {
            uniqueId: generateUniqueNumber(),
            termId: termId || "",
            fromDate: getYyyyMmDdFormat(fromDate),
            toDate: getYyyyMmDdFormat(toDate),
            dated: mapTermDates(dated),
            termReviewName: (termReviewName || "").trim(),
            termReviewDate: mapTermDates(termReviewDate),
          },
        ],
      });
    }
  }, [props.id, getIgseTermDetailsByIdResp]);

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        termId: "",
        fromDate: "",
        toDate: "",
        dated: "",
        termReviewName: "",
        termReviewDate: "",
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
      <form onSubmit={igseTermDetailsModalFormik.handleSubmit}>
        <div className="row p-4 g-3">
          <div className="col-12 mb-2">
            <div className="row pt-3 g-3">
              <div className={`col-${igcse ? 2 : 4} mt-0`}>
                <h6 className="mb-0 me-2">Term Details</h6>
              </div>
              <div className={`col-${igcse ? 2 : 4} mt-0`}>
                <h6 className="mb-0 me-2">From Date</h6>
              </div>
              {igcse && (
                <>
                  <div className={`col-${igcse ? 2 : 4} mt-0`}>
                    <h6 className="mb-0 me-2">To Date</h6>
                  </div>
                </>
              )}
              {!igcse && (
                <>
                  <div className={`col-${igcse ? 2 : 4} mt-0`}>
                    <div className="hstack align-items-start justify-content-between">
                      <h6 className="mb-0 me-2 form-label required">To Date</h6>
                      {!props?.id && <button
                        onClick={addNewDepartmentHndlr}
                        className="btn-sm btn-icon btn btn-outline-primary"
                      >
                        <i className="ri-add-line fs-18" />
                      </button>}
                    </div>
                  </div>
                </>
              )}
              {igcse && (
                <>
                  <div className={`col-${igcse ? 2 : 4} mt-0`}>
                    <h6 className="mb-0 me-2">Dated</h6>
                  </div>
                  <div className={`col-${igcse ? 2 : 4} mt-0`}>
                    <h6 className="mb-0 me-2">Term Review Name</h6>
                  </div>
                  <div className={`col-${igcse ? 2 : 4} mt-0`}>
                    <div className="hstack align-items-start justify-content-between">
                      <h6 className="mb-0 me-2 form-label required">Term Review Date</h6>
                      {!props?.id && <button
                        onClick={addNewDepartmentHndlr}
                        className="btn-sm btn-icon btn btn-outline-primary"
                      >
                        <i className="ri-add-line fs-18" />
                      </button>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-12 mt-0">
            <FormikProvider value={igseTermDetailsModalFormik}>
              <FieldArray name="term">
                {(arrayHelpers: ArrayHelpers) => {
                  if (!formikArrayHelpers.current) {
                    formikArrayHelpers.current = arrayHelpers;
                  }
                  return (
                    <>
                      {igseTermDetailsModalFormik.values.term.length > 0 &&
                        igseTermDetailsModalFormik.values.term.map(
                          (term: any, index: any) => {
                            const inputFieldErrors: any =
                              (igseTermDetailsModalFormik.errors.term &&
                                igseTermDetailsModalFormik.errors.term[index]) || {};
                            const inputFieldTouched: any =
                              (igseTermDetailsModalFormik.touched.term &&
                                igseTermDetailsModalFormik.touched.term[index]) || {};

                            return (
                              <div key={term.uniqueId} className="mb-3 row">
                                <div className={`col-${igcse ? 2 : 4}`}>
                                  <SelectInput
                                    name={`term[${index}].termId`}
                                    value={term.termId}
                                    onChange={
                                      igseTermDetailsModalFormik.handleChange
                                    }
                                    onBlur={igseTermDetailsModalFormik.handleBlur}
                                    isDisabled={props.id}
                                    menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                                    valueKey="termId"
                                    textKey="termName"
                                    formgroupClassName="mb-0"
                                    invalid={
                                      inputFieldTouched.termId &&
                                        inputFieldErrors.termId
                                        ? true
                                        : false
                                    }
                                    error={
                                      inputFieldTouched.termId &&
                                        inputFieldErrors.termId
                                        ? inputFieldErrors.termId
                                        : ""
                                    }
                                  />
                                </div>
                                <div className={`col-${igcse ? 2 : 4}`}>
                                  <DateInput
                                    name={`term[${index}].fromDate`}
                                    formgroupClassName="mb-0 w-80 me-4"
                                    value={term.fromDate}
                                    onChange={
                                      igseTermDetailsModalFormik.handleChange
                                    }
                                    onBlur={igseTermDetailsModalFormik.handleBlur}
                                    invalid={
                                      inputFieldTouched.fromDate &&
                                        inputFieldErrors.fromDate
                                        ? true
                                        : false
                                    }
                                    error={
                                      inputFieldTouched.fromDate &&
                                        inputFieldErrors.fromDate
                                        ? inputFieldErrors.fromDate
                                        : ""
                                    }
                                  />
                                </div>
                                {igcse && (
                                  <><div className={`col-${igcse ? 2 : 4}`}>
                                    <DateInput
                                      name={`term[${index}].toDate`}
                                      formgroupClassName="mb-0 w-80 me-4"
                                      value={term.toDate}
                                      onChange={
                                        igseTermDetailsModalFormik.handleChange
                                      }
                                      onBlur={igseTermDetailsModalFormik.handleBlur}
                                      invalid={
                                        inputFieldTouched.toDate &&
                                          inputFieldErrors.toDate
                                          ? true
                                          : false
                                      }
                                      error={
                                        inputFieldTouched.toDate &&
                                          inputFieldErrors.toDate
                                          ? inputFieldErrors.toDate
                                          : ""
                                      }
                                    />
                                  </div> </>
                                )}
                                {!igcse && (
                                  <> <div className={`col-${igcse ? 2 : 4}`}>
                                    <div className="hstack">
                                      <DateInput
                                        name={`term[${index}].toDate`}
                                        formgroupClassName="mb-0 w-70 me-4"
                                        value={term.toDate}
                                        onChange={
                                          igseTermDetailsModalFormik.handleChange
                                        }
                                        onBlur={igseTermDetailsModalFormik.handleBlur}
                                        invalid={
                                          inputFieldTouched.toDate &&
                                            inputFieldErrors.toDate
                                            ? true
                                            : false
                                        }
                                        error={
                                          inputFieldTouched.toDate &&
                                            inputFieldErrors.toDate
                                            ? inputFieldErrors.toDate
                                            : ""
                                        }
                                      />
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
                                  </div>  </>
                                )}
                                {igcse && (
                                  <>
                                    <div className={`col-${igcse ? 2 : 4}`}>
                                      <DateInput
                                        name={`term[${index}].dated`}
                                        formgroupClassName="mb-0 w-80 me-4"
                                        value={term.dated}
                                        onChange={
                                          igseTermDetailsModalFormik.handleChange
                                        }
                                        onBlur={igseTermDetailsModalFormik.handleBlur}
                                        invalid={
                                          inputFieldTouched.dated &&
                                            inputFieldErrors.dated
                                            ? true
                                            : false
                                        }
                                        error={
                                          inputFieldTouched.dated &&
                                            inputFieldErrors.dated
                                            ? inputFieldErrors.dated
                                            : ""
                                        }
                                      />
                                    </div>
                                    <div className={`col-${igcse ? 2 : 4}`}>
                                      <TextInput
                                        name={`term[${index}].termReviewName`}
                                        formgroupClassName="mb-0 w-80 me-4"
                                        value={term.termReviewName}
                                        onChange={
                                          igseTermDetailsModalFormik.handleChange
                                        }
                                        onBlur={igseTermDetailsModalFormik.handleBlur}
                                        invalid={
                                          inputFieldTouched.termReviewName &&
                                            inputFieldErrors.termReviewName
                                            ? true
                                            : false
                                        }
                                        error={
                                          inputFieldTouched.termReviewName &&
                                            inputFieldErrors.termReviewName
                                            ? inputFieldErrors.termReviewName
                                            : ""
                                        }
                                      />
                                    </div>
                                    <div className={`col-${igcse ? 2 : 4}`}>
                                      <div className="hstack">
                                        <DateInput
                                          name={`term.${index}.termReviewDate`}
                                          value={term.termReviewDate}
                                          onChange={igseTermDetailsModalFormik.handleChange}
                                          formgroupClassName="mb-0 w-70 me-4"
                                          invalid={
                                            inputFieldTouched.termReviewDate &&
                                              inputFieldErrors.termReviewDate
                                              ? true
                                              : false
                                          }
                                          error={
                                            inputFieldTouched.termReviewDate &&
                                              inputFieldErrors.termReviewDate
                                              ? inputFieldErrors.termReviewDate
                                              : ""
                                          }
                                        />
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

                                  </>
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
        </div>
        <div className="hstack gap-2 justify-content-end px-4 mb-3">
          <button
            type="button"
            className={"btn btn-light"}
            onClick={props.toggle}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={`btn btn-success
                `}
          // onClick={(event: any) =>
          //   igseTermDetailsModalFormik.handleSubmit(event)
          // }
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default TermDetailsModel;
