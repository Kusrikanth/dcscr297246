import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { DateInput, SelectInput } from '../../../Components/Common'
import { useAppSelector } from '../../../hooks/storehook';
import { addAcademicDatesAct, getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct, updateAcademicDatesAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { getInstAcademicYearAct } from '../../../store/mastersettings/instacademics/instacademicactions';
import { generateUniqueNumber } from '../../../utility/commonutility';
import { generateActionPayload } from '../../../utility/reduxutility';
import { addAcademicYearDateModalProps, IAddDepartmentInfoState, IAddDepartmentsState, IInstDepartmentInfo } from './ClassWiseAcademicYearTypes'
import * as Yup from 'yup';
import Button from '../../../Components/Common/Button';

interface intialValues{
  academicYear:string,
  curriculumType:string,
  departments:any
}
const intialValues = (modalData?: any) => {

  return {
    academicYear: modalData ? modalData.academicYearId : "",
    curriculumType: modalData ? modalData.curriculumId : "",
    // classType:modalData?modalData.classId:"",
    // terms:modalData?modalData.terms:[{
    //     termId:"",
    //     termName:"",
    //     startDate:"",
    //     endDate:""
    // }]
    departments: modalData ? modalData.departments ? modalData.departments : [{
      classData: modalData.classId,
      // className:modalData.termName,
      startDate: modalData.startDate,
      endDate: modalData.endDate
    }] : [{
      classData: "",
      // className:modalData.termName,
      startDate: "",
      endDate: ""
    }],
  }
}
function getInitialState(editData?: IInstDepartmentInfo): IAddDepartmentsState {
  const data: IAddDepartmentInfoState = {
    uniqueId: generateUniqueNumber(),
    classData: "",
    startDate: "",
    endDate: "",
  };
  if (editData) {


    const { classData, id, endDate, startDate } = editData || {};

    data.uniqueId = id;
    data.classData = classData;
    data.startDate = startDate;
    data.endDate = endDate;
  }
  return {
    academicYear: "2022-23",
    curriculum: "", departments: [data]
  }
}

const AddAcademicYearDateModal = (props: addAcademicYearDateModalProps) => {  

  const dispatch = useDispatch();

  const [departmentListState, setDepartmentListState] = useState<any>(intialValues());
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);


  useEffect(() => {
    const payload = props.modalData ? { branchId: props.branchId,academicYearId: props.modalData.academicYearId, curriculumId: props.modalData.curriculumId, pageNo: 0, pageSize: 100 } : {};
    props.modalData && dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    setDepartmentListState(intialValues(props.modalData));
    !props.isOpen && dispatch(resetBrchClassAct(undefined));
  }, [props.modalData, props.isOpen]);

  const validationSchema = Yup.object().shape({
    academicYear: Yup.string().required("Academic Year required."),
    curriculumType: Yup.string().required("Curriculum Type required."),
    departments: Yup.array().of(
      Yup.object().shape({
        classData: Yup.string().required("Class is required."),
        startDate: Yup.string().required("Start Date is required."),
        endDate: Yup.string().required("End Date is required.")
      })
    ),
    // endDate: Yup.string().required("End date required."),
    // startYear: Yup.string().required("Start Year required."),
    // endYear: Yup.string().required("End Year required."),
    // isChallanDisplay: Yup.string().required("Challan Display required."),
  });

  // NEW
  const addDepartmentForm:any = useFormik({
    enableReinitialize: true,
    initialValues: departmentListState,
    validationSchema,
    onSubmit: (values) => {

      // academicYearId: values?.academicYear,
      //     curriculumId: values?.curriculumId
      if (props.modalData) {

        const data = { id: +values.departments[0].classData, branchId: props.branchId, endDate: values.departments[0].endDate, startDate: values.departments[0].startDate }

        dispatch(
          updateAcademicDatesAct(
            generateActionPayload(
              "update_save_branch_academic_class_date",
              undefined,
              data
            )
          )
        );
      } else {
        const newValues = values?.departments?.map((v: any) => {
          return {
            classId: +v?.classData,
            startDate: v?.startDate,
            endDate: v?.endDate,
          };
        });
        const data = { id: "", branchId: props.branchId, academicYearId: +values?.academicYear, curriculumId: +values?.curriculumType, branchAcademicClassStartDTOS: [...newValues] }
        dispatch(
          addAcademicDatesAct(
            generateActionPayload(
              "add_save_branch_academic_class_date",
              undefined,
              data
            )
          )
        );
      }


    },
  });

  // NEW
  function addNewDepartmentHndlr() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), classData: "", startDate: "", endDate: "" });
    }
  }

  // NEW
  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  const curriculumHandler = (event: any) => {
    if (event.target.value !== "") {
      const payload = { branchId: props.branchId, academicYearId: addDepartmentForm.values.academicYear, curriculumId: event.target.value, pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    else {
      dispatch(resetBrchClassAct(undefined));
    }
    // getClassWiseTermsDateApiCall({academicYearId:ClassTermsFilterForm.values.academicYear,curriculumId:event.target.value});
  }
  const { academicYearListResp, brchCurriculumResp, branchClassResp, classBranchWiseTermsIdResp,showApiLoader } = useAppSelector(
    ({ instAcademics, branchAcademics,globalData }: any) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      classBranchWiseTermsIdResp: branchAcademics.classBranchWiseTermsIdResp,
      showApiLoader:globalData.showApiLoader,
    }),
    shallowEqual
  );

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: addDepartmentForm.values.academicYear, branchId: props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}

  useEffect(() => {
    if (props?.instituteId && !academicYearListResp) {
      const payload = {instituteId:props?.instituteId,pageNo:0,pageSize:100,sortBy:"academicYearName",orderBy:"desc"};
      dispatch(
        getInstAcademicYearAct(
          generateActionPayload("get_inst_academic_year", undefined, payload)
        )
      );
    }
  }, [props?.instituteId, academicYearListResp]);
  // useEffect(() => {

  //   if (props?.instituteId && !brchCurriculumResp) {
  //     const payload = { branchId: props.branchId, pageNo: 0, pageSize: 100 };
  //     dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
  //   }
  // }, [props?.instituteId, brchCurriculumResp]);

  function onchangeAcademicYear(event: React.ChangeEvent<HTMLInputElement>) {
    addDepartmentForm.handleChange(event);
    const { name, value } = event.target;
    if(name === "academicYear"){
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      setDepartmentListState((prevState: any) => ({ ...prevState, [name]: value,curriculumId: "" }));
    }
    else{
      setDepartmentListState((prevState: any) => ({ ...prevState, [name]: value }));
    }
  }

  useEffect(() => {
    !props.isOpen && setDepartmentListState(intialValues({ academicYear: "", curriculumType: "", departments: [] }))
  }, [props.isOpen])

  const { data: academiYear } = academicYearListResp || {}
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
     
      <div>
        <FormikProvider value={addDepartmentForm}>

          <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-6">

            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="academicYear"
                labelText="Academic Year"
                value={addDepartmentForm.values.academicYear}
                onChange={onchangeAcademicYear}
                menuItems={academiYear}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="tw-mb-0"
                isDisabled={props.modalData}
                invalid={(addDepartmentForm.touched.academicYear && addDepartmentForm.errors.academicYear) ? true : false}
                error={(addDepartmentForm.touched.academicYear && addDepartmentForm.errors.academicYear) ? addDepartmentForm.errors.academicYear : ""}
              />
            </div>

            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="curriculumType"
                labelText="Curriculum"
                value={addDepartmentForm.values.curriculumType}
                onChange={(event: any) => {
                  addDepartmentForm.handleChange(event);
                  curriculumHandler(event);
                }}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                formgroupClassName="tw-mb-0"
                isDisabled={props.modalData}
                invalid={(addDepartmentForm.touched.curriculumType && addDepartmentForm.errors.curriculumType) ? true : false}
                error={(addDepartmentForm.touched.curriculumType && addDepartmentForm.errors.curriculumType) ? addDepartmentForm.errors.curriculumType : ""}
              />
            </div>
          </div>

          <div className="tw-flex tw-items-baseline tw-w-full tw-border-b tw-border-gray-200 tw-px-6 tw-pb-3">
            <h6 className="tw-text-sm tw-font-semibold tw-mb-0 tw-mr-3">
              Classes
            </h6>

            {!props.modalData && (
              <button
                type="button"
                onClick={addNewDepartmentHndlr}
                className="tw-flex tw-items-center tw-justify-center tw-h-6 tw-w-6 tw-border tw-border-blue-600 tw-text-blue-600 tw-rounded-md tw-bg-transparent hover:tw-bg-blue-50 tw-transition"
              >
                <i className="ri-add-line tw-text-base" />
              </button>
            )}
          </div>

          <div className="tw-w-full tw-p-6">

            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
              <div className="tw-col-span-4">
                <h6 className="tw-text-sm tw-font-medium">Class</h6>
              </div>
              <div className="tw-col-span-4">
                <h6 className="tw-text-sm tw-font-medium">Start Date</h6>
              </div>
              <div className="tw-col-span-4">
                <h6 className="tw-text-sm tw-font-medium">End Date</h6>
              </div>
            </div>

            <FieldArray name="departments">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }

                return (
                  <>
                    {addDepartmentForm.values.departments &&
                      addDepartmentForm.values.departments.map(
                        (department: any, index: number) => {
                          const inputFieldErrors: any =
                            (addDepartmentForm.errors.departments &&
                              addDepartmentForm.errors.departments[index]) ||
                            {};

                          const inputFieldTouched: any =
                            (addDepartmentForm.touched.departments &&
                              addDepartmentForm.touched.departments[index]) ||
                            {};

                          return (
                            <div
                              key={department.uniqueId}
                              className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4 tw-items-start"
                            >
                              <div className="tw-col-span-4">
                                <SelectInput
                                  name={`departments[${index}].classData`}
                                  value={department.classData}
                                  onChange={addDepartmentForm.handleChange}
                                  menuItems={classTypes}
                                  valueKey="id"
                                  textKey="shortName"
                                  formgroupClassName="tw-mb-0"
                                  invalid={
                                    inputFieldTouched.classData &&
                                      inputFieldErrors.classData
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputFieldTouched.classData &&
                                      inputFieldErrors.classData
                                      ? inputFieldErrors.classData
                                      : ""
                                  }
                                />
                              </div>

                              <div className="tw-col-span-4">
                                <DateInput
                                  name={`departments[${index}].startDate`}
                                  value={department.startDate}
                                  onChange={addDepartmentForm.handleChange}
                                  formgroupClassName="tw-mb-0"
                                  invalid={
                                    inputFieldTouched.startDate &&
                                      inputFieldErrors.startDate
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputFieldTouched.startDate &&
                                      inputFieldErrors.startDate
                                      ? inputFieldErrors.startDate
                                      : ""
                                  }
                                />
                              </div>

                              <div className="tw-col-span-4 tw-flex tw-gap-3">
                                <div className="tw-flex-1">
                                  <DateInput
                                    name={`departments[${index}].endDate`}
                                    value={department.endDate}
                                    onChange={addDepartmentForm.handleChange}
                                    formgroupClassName="tw-mb-0"
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

                                {index !== 0 && (
                                  <button
                                    type="button"
                                    data-index={index}
                                    onClick={removeDepartmentHndlr}
                                    className="tw-flex tw-items-center tw-justify-center tw-h-10 tw-w-10 tw-rounded-lg tw-bg-transparent hover:tw-bg-gray-100 tw-transition"
                                  >
                                    <i className="ri-delete-bin-2-fill tw-text-gray-500 tw-text-lg" />
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
          </div>

        </FormikProvider>

        <div className="tw-flex tw-justify-end tw-gap-3 tw-px-6 tw-pb-6">
          <Button
            type="button"
            onClick={props.toggle}
            variant='secondary'
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={(event: any) => addDepartmentForm.handleSubmit(event)}
            disabled={showApiLoader}
            variant='primary'
          >
            Save
          </Button>
        </div>
      </div>

    </>
  )
}

export default AddAcademicYearDateModal