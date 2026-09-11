import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
  DateInput,
  SelectInput,

} from "../../../Components/Common";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import {
  FieldArray,
  useFormik,
  ArrayHelpers,
  FormikProvider,
} from "formik";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  addInstAcademicTermAct,
  getInstAcademicYearAct,
  getInstTermAct,
  updateInstAcademicTermAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import {
  getMasterTermTypesAct,
} from "../../../store/masterdata/masterdataactions";

//Interface & Types
import {
  IAddAcademicTermProps,
  IAddEditAcademicTermRespRef,
} from "./academictermstypes";
import Button from "../../../Components/Common/Button";

interface IAddAcademicTermModel {
  termTypeId: string;
  academicYear: string;
  terms: { termId: number | string, termName: string, fromDate: string, endDate: string }[];
}

function getAddEditTermData(editData?: any): IAddAcademicTermModel {

  return {
    academicYear: editData && editData.academicYearId ? editData.academicYearId : "",
    termTypeId: editData && editData.termTypeId ? editData.termTypeId : "",
    terms: editData ? editData.terms ? editData.terms : [{
      termId: editData.instituteAcademicTermId,
      termName: editData.termName,
      fromDate: editData.startDate,
      endDate: editData.endDate
    }] : [],
  };
}

const validationSchema = Yup.object().shape({
  academicYear: Yup.string().required("Academic Year is required"),
  termTypeId: Yup.string().required("Term type is required"),
  terms: Yup.array().of(
    Yup.object().shape({
      fromDate: Yup.string().required("From Date is required."),
      endDate: Yup.string().required("End Date is required."),
    })
  ),
});

const AddEditAcademicTerm: React.FC<IAddAcademicTermProps> = (props) => {
  const [addAcademicTermState, setAcademicTermState] =
    useState<IAddAcademicTermModel>(() => getAddEditTermData());
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();
  const {
    addAcademicTermResp,
    updateAcademicTermResp,
    masterAcademicTermsResp,
    termListResp,
    academicYearListResp,
    masterTermTypesResp,
    showApiLoader,
  } = useAppSelector(
    ({ instAcademics, masterData,globalData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      updateAcademicTermResp: instAcademics.updateAcademicTermResp,
      addAcademicTermResp: instAcademics.addAcademicTermResp,
      termListResp: instAcademics.termListResp,
      masterAcademicTermsResp: masterData.masterAcademicTermsResp,
      masterTermTypesResp: masterData.masterTermTypesResp,
      showApiLoader:globalData.showApiLoader,
    }),
    shallowEqual
  );

  const { data: academicYearList } = academicYearListResp || {};

  useEffect(() => {

    if (props.isOpen && !masterAcademicTermsResp) {
      dispatch(
        getMasterTermTypesAct(generateActionPayload("get_unassigned_term_types", { instituteId: props.instituteId }))
      );
    }
    // if (props.isOpen && !masterAcademicTermsResp) {
    //   dispatch(
    //     getMasterAcademicTermAct(
    //       generateActionPayload("get_master_academic_terms")
    //     )
    //   );
    // } 
    else if (!props.isOpen) {
      // setAddAcademicYearState(getAddEditAcademicData());
      addAcademicTermForm.resetForm();
    }

    if (!academicYearListResp) {
      const payload = { instituteId: props.instituteId,sortBy:"academicYearName",orderBy:"desc",pageNo: 0,pageSize: 100 };
      dispatch(
        getInstAcademicYearAct(
          generateActionPayload(
            "get_inst_academic_year",
            undefined,
            payload
          )
        )
      );
    }
  }, [props.isOpen]);

  const addEditAcademicYearRespRef = useRef<IAddEditAcademicTermRespRef>({
    prevAddAcademicTermResp: addAcademicTermResp,
    prevUpdateAcademicTermResp: updateAcademicTermResp,
  });

  useEffect(() => {
    const { prevAddAcademicTermResp, prevUpdateAcademicTermResp } =
      addEditAcademicYearRespRef.current;
    if (
      addAcademicTermResp &&
      addAcademicTermResp !== prevAddAcademicTermResp
    ) {
      props.toggle({sortBy:"",pageNo:0},true);
      toast.success("Academic term added successfully.");
    } else if (
      updateAcademicTermResp &&
      updateAcademicTermResp !== prevUpdateAcademicTermResp
    ) {
      props.toggle({sortBy:"",pageNo:0},true);
      toast.success("Academic term updated successfully.");
    }
    addEditAcademicYearRespRef.current.prevAddAcademicTermResp =
      addAcademicTermResp;
    addEditAcademicYearRespRef.current.prevUpdateAcademicTermResp =
      updateAcademicTermResp;
  }, [addAcademicTermResp, updateAcademicTermResp]);

  function addNewTermHndlr() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        masterTermId: "",
        shortCode: "",
      });
    }
  }

  function removeTermHandler(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function onChangeTermHndlr(event: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target,
      { values } = addAcademicTermForm,
      { terms } = values || {},
      termIndex = name.substring(name.indexOf(".") + 1, name.lastIndexOf(".")),
      numberKey = Number(termIndex);
    if (!isNaN(numberKey) && numberKey > -1) {
      const termData = terms[numberKey],
        { name: shortCode } =
          masterAcademicTermsResp.find((item: any) => item.id === value) || {};
      Object.assign(termData, { masterTermId: value, shortCode });
      formikArrayHelpers.current?.replace(Number(termIndex), termData);
    }
  }

  const addAcademicTermForm = useFormik({
    enableReinitialize: true,
    initialValues: addAcademicTermState,
    validationSchema,
    onSubmit: (values) => {
      if (props.academicTermId) {
        // const params = { academicYearId: props.academicYearId },
        // { termTypeId, ...payload } = values;
        const payload = {
          instituteAcademicTermId: values.terms[0].termId,
          startDate: values.terms[0].fromDate,
          endDate: values.terms[0].endDate
        }
        dispatch(updateInstAcademicTermAct(generateActionPayload("update_inst_academic_term", undefined, payload)));
      } else {
        const apiParams = { instituteId: props.instituteId, academicYearId: values.academicYear, masterTermTypeId: values.termTypeId };
        const payload = values.terms.map((v) => {
          return v.fromDate && v.endDate && {
            instituteTermId: v.termId,
            startDate: v.fromDate,
            endDate: v.endDate
          }
        })

        dispatch(
          addInstAcademicTermAct(
            generateActionPayload(
              "add_inst_academic_term", apiParams, payload)
          )
        );
      }
    },
  });
  const academicTermTypeHandler = (event: any) => {
    const payload = { instituteId: props.instituteId, masterTermTypeId: event.target.value,orderBy:"asc",sortBy:"termName" };
    dispatch(getInstTermAct(generateActionPayload("get_inst_term", undefined, payload)));
  }
  useEffect(() => {
    let terms = termListResp && termListResp.data.map((term: any) => {
      return {
        termId: term.instituteTermId,
        termName: term.termName,
        fromDate: "",
        endDate: ""
      }
    });

    setAcademicTermState(getAddEditTermData({ academicYearId: addAcademicTermForm.values.academicYear, termTypeId: addAcademicTermForm.values.termTypeId, terms: terms }))
  }, [termListResp])
  useEffect(() => {
    props.isOpen ? setAcademicTermState(getAddEditTermData(props.editModalData)) : setAcademicTermState(getAddEditTermData())
  }, [props.isOpen]);


  return (

    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-5">

      <div className="tw-col-span-12">
        <SelectInput
          name="academicYear"
          labelText="Academic Year"
          value={addAcademicTermForm.values.academicYear}
          onChange={addAcademicTermForm.handleChange}
          invalid={
            addAcademicTermForm.touched.academicYear &&
              addAcademicTermForm.errors.academicYear
              ? true
              : false
          }
          error={
            addAcademicTermForm.touched.academicYear &&
              addAcademicTermForm.errors.academicYear
              ? addAcademicTermForm.errors.academicYear
              : ""
          }
          menuItems={academicYearList || []}
          valueKey="academicYearId"
          textKey="academicYearName"
          isDisabled={!!props.academicTermId}
        />
      </div>
      <div className="tw-col-span-12">
        <SelectInput
          name="termTypeId"
          labelText="Term Type"
          value={addAcademicTermForm.values.termTypeId}
          onChange={(event: any) => {
            academicTermTypeHandler(event);
            addAcademicTermForm.handleChange(event);
          }}
          invalid={
            addAcademicTermForm.touched.termTypeId &&
              addAcademicTermForm.errors.termTypeId
              ? true
              : false
          }
          error={
            addAcademicTermForm.touched.termTypeId &&
              addAcademicTermForm.errors.termTypeId
              ? addAcademicTermForm.errors.termTypeId
              : ""
          }
          menuItems={masterTermTypesResp || []}
          valueKey="masterTermTypeId"
          textKey="masterTermTypeName"
          isDisabled={!!props.academicTermId}
        />
      </div>

      <div className="tw-col-span-12 tw-mb-3">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div className="tw-col-span-3">
            <h6 className="tw-mb-0 tw-font-medium">Term Name</h6>
          </div>

          <div className="tw-col-span-9">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <div className="tw-col-span-6">
                <h6 className="tw-mb-0 tw-font-medium">From Date</h6>
              </div>
              <div className="tw-col-span-6">
                <h6 className="tw-mb-0 tw-font-medium">To Date</h6>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="tw-col-span-12">
        <FormikProvider value={addAcademicTermForm}>
          <FieldArray name="terms">
            {(arrayHelpers: ArrayHelpers) => {
              if (!formikArrayHelpers.current) {
                formikArrayHelpers.current = arrayHelpers;
              }

              return (
                <>
                  {addAcademicTermForm.values.terms.length > 0 &&
                    addAcademicTermForm.values.terms.map((term, index) => {

                      const inputFieldErrors: any =
                        (addAcademicTermForm.errors.terms &&
                          addAcademicTermForm?.errors?.terms[index]) || {};

                      const inputFieldTouched: any =
                        (addAcademicTermForm.touched.terms &&
                          addAcademicTermForm?.touched?.terms[index]) || {};

                      return (
                        <div
                          key={index}
                          className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3"
                        >
                          <div className="tw-col-span-12 md:tw-col-span-3 tw-flex tw-items-center">
                            {term.termName}
                          </div>

                          <div className="tw-col-span-12 md:tw-col-span-9">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                              <div className="tw-col-span-12 md:tw-col-span-6">
                                <DateInput
                                  name={`terms.${index}.fromDate`}
                                  value={term.fromDate}
                                  formgroupClassName="tw-mb-0"
                                  onChange={addAcademicTermForm.handleChange}
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

                              <div className="tw-col-span-12 md:tw-col-span-6">
                                <DateInput
                                  name={`terms.${index}.endDate`}
                                  value={term.endDate}
                                  formgroupClassName="tw-mb-0"
                                  onChange={addAcademicTermForm.handleChange}
                                  invalid={
                                    inputFieldTouched.endDate &&
                                      inputFieldErrors.endDate
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputFieldTouched.endDate &&
                                      inputFieldErrors.endDate
                                      ? inputFieldErrors.endDate
                                      : ""
                                  }
                                />
                              </div>

                            </div>
                          </div>

                        </div>
                      );
                    })}
                </>
              );
            }}
          </FieldArray>
        </FormikProvider>
      </div>
      <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-2 tw-mt-4">
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
          onClick={(event: any) =>
            addAcademicTermForm.handleSubmit(event)
          }
          disabled={showApiLoader}
        >
          {props.academicTermId ? "Update" : "Submit"}
        </Button>
      </div>

    </div>
  );
};

export default AddEditAcademicTerm;


