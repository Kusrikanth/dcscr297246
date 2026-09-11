import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput, TimeInput } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { saveBreaksAct, updateBreaksAct } from "../../../../store/academic/timetableManagment/timetableManagmentactions";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useEffect, useRef } from "react";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { MultiplicationSignIcon } from "@hugeicons-pro/core-stroke-standard";
import * as Yup from "yup";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

const initialValues: any = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  breakDetailsDtos: [
    {
      uniqueId: generateUniqueNumber(),
      breakType: "",
      breakName: "",
      startTime: "",
      endTime: "",
    }
  ]
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic year is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
  classId: Yup.string().required("Class is required"),
  breakDetailsDtos: Yup.array().of(
    Yup.object().shape({
      breakType: Yup.string().nullable().required('Break Type is required'),
      breakName: Yup.string().nullable().required('Break Name is required'),
      startTime: Yup.string().nullable().required('Start Time is required'),
      endTime: Yup.string().nullable().required('End Time is required'),
    })
  )
})

const AddBreaksModal = (props: any) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getAssignListCurriculumResp,
    branchClassResp,
    getBreaksResp,
    showApiLoader,
    getBreaksTypeResp,
    getAssignLanClassListResp
  } = useAppSelector(
    ({ timeTableManagement, appData, globalData, branchAcademics, instAcademics, assignLanguages }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      branchClassResp: branchAcademics.branchClassResp,
      getBreaksResp: timeTableManagement.getBreaksResp,
      getBreaksTypeResp: timeTableManagement.getBreaksTypeResp,

    }),
    shallowEqual
  );

  const addBreaksTypeForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { breakDetailsDtos } = values
      if (props.modalData) {
        let validDurations = true;

        const tempres = breakDetailsDtos
          ?.map((ele: any) => {            
            const startTime = ele.startTime.split(":").map(Number);
            const endTime = ele.endTime.split(":").map(Number);
            let durationHours = endTime[0] - startTime[0];
            let durationMinutes = endTime[1] - startTime[1];
            
            if (durationMinutes < 0) {
              durationMinutes += 60;
              durationHours -= 1;
            }

            if (durationHours < 0 || (durationHours === 0 && durationMinutes < 0)) {
              validDurations = false;
            }

            const startTimeFormatted = `${startTime[0].toString().padStart(2, '0')}:${startTime[1].toString().padStart(2, '0')}:00`;
            const endTimeFormatted = `${endTime[0].toString().padStart(2, '0')}:${endTime[1].toString().padStart(2, '0')}:00`;
            return {
              id: ele.id,
              breakType: ele.breakType,
              breakName: ele.breakName,
              startTime: startTimeFormatted,
              endTime: endTimeFormatted,
            };
          });

        if (!validDurations) {
          toast.warning("Invalid duration: Start time must be before end time.");
        } else {
          const payload = {
            id: props.modalData,
            branchId,
            curriculumId: values.curriculumId,
            classId: values.classId,
            academicYearId: values.academicYearId,
            breakDetailsDtos: tempres
          }          
          dispatch(updateBreaksAct(generateActionPayload("save_breaks", undefined, payload)));
        }
      }
      else {
        const tempres = breakDetailsDtos
          ?.map((ele: any) => {
            const startTime = ele.startTime.split(":")
            const endTime = ele.endTime.split(":")
            const startTimeFormatted = `${startTime[0].toString().padStart(2, '0')}:${startTime[1].toString().padStart(2, '0')}:00`;
            const endTimeFormatted = `${endTime[0].toString().padStart(2, '0')}:${endTime[1].toString().padStart(2, '0')}:00`;
            const durationHours = parseInt(endTime[0]) - parseInt(startTime[0])
            const durationMinutes = parseInt(endTime[1]) - parseInt(startTime[1])
            const duration = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}`
            return {
              breakType: ele.breakType,
              breakName: ele.breakName,
              startTime: startTimeFormatted,
              endTime: endTimeFormatted,
            };
          });
        const payload = {
          branchId,
          curriculumId: values.curriculumId,
          classId: values.classId,
          academicYearId: values.academicYearId,
          breakDetailsDtos: tempres
        }        
        dispatch(saveBreaksAct(generateActionPayload("save_breaks", undefined, payload)));
      }
    },
  });

  useEffect(() => {
    if (props.modalData && getBreaksResp?.data) {
      const selectedBreakData = getBreaksResp.data.find((item: any) => +item.id === +props.modalData);      

      if (selectedBreakData) {
        addBreaksTypeForm.setFieldValue("academicYearId", selectedBreakData.academicYearId);
        addBreaksTypeForm.setFieldValue("curriculumId", selectedBreakData.curriculumId);
        addBreaksTypeForm.setFieldValue("classId", selectedBreakData.classId);
        addBreaksTypeForm.setFieldValue("breakDetailsDtos", []);
        const breaksCount = selectedBreakData.breaksCount || 1;

        const payload = {
          branchId,
          curriculumId: selectedBreakData.curriculumId,
          academicYearId: selectedBreakData.academicYearId,
          sortBy: "classSequence",
          orderBy: "asc",
          pageNo: 0,
          pageSize: 100,
        };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));

        const breakDetailsList: any = [];

        for (let i = 0; i < breaksCount; i++) {
          const breakDetails = selectedBreakData.detailsResponseDtos && selectedBreakData.detailsResponseDtos[i] ?
            selectedBreakData.detailsResponseDtos[i] :
            { 
              breakType: "",
              breakName: "",
              startTime: "",
              endTime: ""
            };
          
          breakDetailsList.push({
            uniqueId: generateUniqueNumber(),
            breakType: breakDetails.breakType,
            breakName: breakDetails.breakName,
            startTime: breakDetails.startTime,
            endTime: breakDetails.endTime,
            id: breakDetails.id
          });
        }

        addBreaksTypeForm.setFieldValue("breakDetailsDtos", breakDetailsList);
      }
    }
  }, [getBreaksResp, props.modalData]);

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    addBreaksTypeForm.setFieldValue("academicYearId", yearId)
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: addBreaksTypeForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function addTypeofWorkHndler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), breakType: "", breakName: "", startTime: "", endTime: "" });
    }
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      addBreaksTypeForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "" }));
    }
    else if (name === "curriculumId") {
      addBreaksTypeForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "" }));
      const payload = {
        branchId,
        curriculumId: value,
        academicYearId: addBreaksTypeForm.values.academicYearId,
        sortBy: "classSequence",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    else {
      addBreaksTypeForm.setValues((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {};
  const { content: classTypes } = getAssignLanClassListResp || {};

  return (
    <>
      <div className="container-fluid">
        <FormikProvider value={addBreaksTypeForm}>

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-px-6 tw-pt-4 tw-pb-6">

            <SelectInput
              name="academicYearId"
              value={addBreaksTypeForm.values.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList || []}
              isDisabled={props.modalData}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              labelClass="required"
              invalid={
                addBreaksTypeForm.touched.academicYearId &&
                  addBreaksTypeForm.errors.academicYearId
                  ? true
                  : false
              }
              error={
                addBreaksTypeForm.touched.academicYearId &&
                  addBreaksTypeForm.errors.academicYearId
                  ? addBreaksTypeForm.errors.academicYearId
                  : ""
              }
            />

            <SelectInput
              name="curriculumId"
              labelText="Curriculum"
              value={addBreaksTypeForm.values.curriculumId}
              onChange={filterHandler}
              menuItems={curriculumTypes || []}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              isDisabled={props.modalData}
              formgroupClassName="tw-mb-0"
              labelClass="required"
              invalid={
                addBreaksTypeForm.touched.curriculumId &&
                  addBreaksTypeForm.errors.curriculumId
                  ? true
                  : false
              }
              error={
                addBreaksTypeForm.touched.curriculumId &&
                  addBreaksTypeForm.errors.curriculumId
                  ? addBreaksTypeForm.errors.curriculumId
                  : ""
              }
            />

            <SelectInput
              name="classId"
              value={addBreaksTypeForm.values.classId}
              onChange={filterHandler}
              menuItems={classTypes || []}
              isDisabled={props.modalData}
              valueKey="id"
              textKey="shortName"
              formgroupClassName="tw-mb-0"
              labelText="Class"
              labelClass="required"
              invalid={
                addBreaksTypeForm.touched.classId &&
                  addBreaksTypeForm.errors.classId
                  ? true
                  : false
              }
              error={
                addBreaksTypeForm.touched.classId &&
                  addBreaksTypeForm.errors.classId
                  ? addBreaksTypeForm.errors.classId
                  : ""
              }
            />

          </div>

          <div className="tw-flex tw-items-center tw-border-b tw-border-gray-200 tw-px-6 tw-pb-3">
            <h6 className="tw-text-base tw-font-semibold tw-text-gray-700">
              Breaks
            </h6>
          </div>

          <div className="tw-p-6 tw-space-y-6">

            <FieldArray name="breakDetailsDtos">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }

                return (
                  <>
                    {addBreaksTypeForm.values.breakDetailsDtos &&
                    addBreaksTypeForm.values.breakDetailsDtos?.map(
                      (breakDetailsDtos: any, index: number) => {
                        const inputFieldErrors: any =
                          (addBreaksTypeForm.errors.breakDetailsDtos &&
                            addBreaksTypeForm.errors.breakDetailsDtos[index]) ||
                          {};

                        const inputFieldTouched: any =
                          (addBreaksTypeForm.touched.breakDetailsDtos &&
                            addBreaksTypeForm.touched.breakDetailsDtos[index]) ||
                          {};

                        return (
                          <div
                            key={`${index}-${breakDetailsDtos.uniqueId}`}
                            className="tw-relative tw-border tw-border-gray-300 tw-rounded-lg tw-p-6 tw-bg-white"
                          >

                            

                            <p className="tw-text-sm tw-font-medium tw-text-gray-600 tw-mb-4">
                              Break Info
                            </p>

                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-6">

                              <SelectInput
                                name={`breakDetailsDtos[${index}].breakType`}
                                value={breakDetailsDtos.breakType}
                                menuItems={getBreaksTypeResp?.data || []}
                                textKey="breakType"
                                valueKey="breakType"
                                labelText="Break Type"
                                labelClass="required"
                                onChange={addBreaksTypeForm.handleChange}
                                formgroupClassName="tw-mb-0"
                                invalid={
                                  inputFieldTouched.breakType &&
                                    inputFieldErrors.breakType
                                    ? true
                                    : false
                                }
                                error={
                                  inputFieldTouched.breakType &&
                                    inputFieldErrors.breakType
                                    ? inputFieldErrors.breakType
                                    : ""
                                }
                              />

                              <TextInput
                                name={`breakDetailsDtos[${index}].breakName`}
                                value={breakDetailsDtos.breakName}
                                onChange={addBreaksTypeForm.handleChange}
                                onBlur={addBreaksTypeForm.handleBlur}
                                labelText="Break Name"
                                labelClass="required"
                                formgroupClassName="tw-mb-0"
                                invalid={
                                  inputFieldTouched.breakName &&
                                    inputFieldErrors.breakName
                                    ? true
                                    : false
                                }
                                error={
                                  inputFieldTouched.breakName &&
                                    inputFieldErrors.breakName
                                    ? inputFieldErrors.breakName
                                    : ""
                                }
                              />

                              <TimeInput
                                name={`breakDetailsDtos[${index}].startTime`}
                                value={breakDetailsDtos.startTime}
                                onChange={addBreaksTypeForm.handleChange}
                                labelText="Start Time"
                                labelClass="required"
                                formgroupClassName="tw-mb-0"
                                invalid={
                                  inputFieldTouched.startTime &&
                                    inputFieldErrors.startTime
                                    ? true
                                    : false
                                }
                                error={
                                  inputFieldTouched.startTime &&
                                    inputFieldErrors.startTime
                                    ? inputFieldErrors.startTime
                                    : ""
                                }
                              />

                              <TimeInput
                                name={`breakDetailsDtos[${index}].endTime`}
                                value={breakDetailsDtos.endTime}
                                onChange={addBreaksTypeForm.handleChange}
                                labelText="End Time"
                                labelClass="required"
                                formgroupClassName="tw-mb-0"
                                invalid={
                                  inputFieldTouched.endTime &&
                                    inputFieldErrors.endTime
                                    ? true
                                    : false
                                }
                                error={
                                  inputFieldTouched.endTime &&
                                    inputFieldErrors.endTime
                                    ? inputFieldErrors.endTime
                                    : ""
                                }
                              />

                            </div>
                            <div style={{ position: "absolute", top: "5%", right: "-3%", transform: "translateY(-60%)", display: "flex", justifyContent: "end", padding: "0", backgroundColor: "white", borderRadius: "50%" }}>
                                {index !== 0 && (
                              <Button
                                type="button"
                                data-index={index}
                                onClick={removeSlabHndlr}
                                variant="wrong"
                              >
                                <HugeiconsIcon
                                  icon={MultiplicationSignIcon}
                                  className="tw-text-red-600"
                                  size={18}
                                />
                              </Button>
                            )}
                              </div>
                          </div>
                        )
                      }
                    )}
                  </>
                )
              }}
            </FieldArray>

            <div>
              <Button
                onClick={addTypeofWorkHndler}
                type="button"
                variant="soft"
              >
                + Add New
              </Button>
            </div>

          </div>

          <div className="tw-flex tw-justify-end tw-gap-4 tw-px-6 tw-pb-6">

            <Button
              type="button"
              onClick={props.toggle}
              variant="secondary"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={(event: any) => addBreaksTypeForm.handleSubmit(event)}
              disabled={showApiLoader}
              variant="primary"
            >
              {showApiLoader
                ? "Processing..."
                : props.classId
                  ? "Update"
                  : "Submit"}
            </Button>

          </div>

        </FormikProvider>
      </div>
    </>
  );
};

export default AddBreaksModal;
