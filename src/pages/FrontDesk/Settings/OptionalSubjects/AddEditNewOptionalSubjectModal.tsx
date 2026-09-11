import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import {
  RadioInputContainer,
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  resetBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useEffect, useRef } from "react";
import { yesNoRadioOptions } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { editOptionalSubjectItemAct, saveOptionalSubjectItemsAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { getAssignCurriculumListAct, getAssignLanBrchStreamGroupsAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { getClassSubjectsList } from "../../../../store/academic/classSubjects/classsubjectsactions";
import { setClassSubjectsListAct } from "../../../../store/academic/classSubjects/classsubjectsslice";
import { resetAssignLanClassListAct, setAssignLanBrchStreamGroupsAct } from "../../../../store/assignlanguages/assignlanguagesslice";
import { setOptionalSubjectItemByIdAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityslice";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  branchClassId: "",
  branchStreamGroupId: "",
  optionalSubjects: [
    {
      id: generateUniqueNumber(),
      optionNumber: "",
      subjectId: "",
      order: "",
      isOptional: "YES",
    },
  ],
};

const validationSchema = Yup.object().shape({
  curriculumId: Yup.string().required("Curriculum is required.").nullable(),
  branchClassId: Yup.string().required("Class is required.").nullable(),
  branchStreamGroupId: Yup.string().required("Stream is required.").nullable(),
  optionalSubjects: Yup.array().of(
    Yup.object().shape({
      subjectId: Yup.string().required("Subject is required").nullable(),
      order: Yup.string().required("Order is required"),
      isOptional: Yup.string().required("IsOptional is required"),
      optionNumber: Yup.string().required("Filed is required"),
    })
  ),
});

const AddEditNewOptionalSubjectModal = ({ toggle, editId }) => {
  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getAssignListCurriculumResp,
    getAssignLanClassListResp,
    academicYearListResp,
    getAssignLanBrchStreamGroupsResp,
    showApiLoader,
    getOptionalSubjectItemByIdResp,
    academicSubjectsListResp,
  } = useAppSelector(
    ({
      appData,
      instAcademics,
      admissionAvailabilityRequest,
      applicationSale,
      globalData,
      assignLanguages,
      classSubjectsInfo,
    }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      academicSubjectsListResp: classSubjectsInfo.academicSubjectsListResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      getAssignLanBrchStreamGroupsResp: assignLanguages.getAssignLanBrchStreamGroupsResp,
      getOptionalSubjectsListResp:
        admissionAvailabilityRequest.getOptionalSubjectsListResp,
      subjectListForCBSEResp: applicationSale.subjectListForCBSEResp,
      showApiLoader: globalData.showApiLoader,
      getOptionalSubjectItemByIdResp:
        admissionAvailabilityRequest.getOptionalSubjectItemByIdResp,
    }),
    shallowEqual
  );

  const addEditNewOptionalSubjectFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values: any) => {
      const { branchClassId, branchStreamGroupId, optionalSubjects } = values;
      const optionalSubjectsModified = optionalSubjects.map(
        ({ id, ...rest }) => rest
      );
      const editPayload: any = {
        optionNumber: values.optionalSubjects[0]?.optionNumber,
        order: values.optionalSubjects[0]?.order,
        isOptional: values.optionalSubjects[0]?.isOptional,
      }
      if(getOptionalSubjectItemByIdResp && getOptionalSubjectItemByIdResp?.subjectId){
        editPayload.subjectId = values.optionalSubjects[0]?.subjectId
      }

      if (editId) {

        dispatch(editOptionalSubjectItemAct(generateActionPayload("edit_optional_subject_item", { id: editId }, editPayload)));

      } else {
        const payload = {
          instituteId,
          branchClassId,
          branchStreamGroupId,
          optionalSubjects: optionalSubjectsModified,
        };

        dispatch(
          saveOptionalSubjectItemsAct(
            generateActionPayload(
              "save_optional_subject_item",
              undefined,
              payload
            )
          )
        );
      }
    },
  });

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: addEditNewOptionalSubjectFormik.values.academicYearId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };
    dispatch(
      getAssignCurriculumListAct(
        generateActionPayload("get_brch_curriculum", undefined, payload)
      )
    );
  }

  function fetchClassList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: addEditNewOptionalSubjectFormik.values.academicYearId,
      curriculumId: addEditNewOptionalSubjectFormik.values.curriculumId,
      sortBy: "classSequence",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    dispatch(
      getAssignLanClassListAct(
        generateActionPayload("get_brch_curriculum_class", undefined, payload)
      )
    );
  }

  function fetchStreamGroupList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: addEditNewOptionalSubjectFormik.values.academicYearId,
      curriculumId: addEditNewOptionalSubjectFormik.values.curriculumId,
      classId: addEditNewOptionalSubjectFormik.values.branchClassId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    dispatch(
      getAssignLanBrchStreamGroupsAct(
        generateActionPayload("get_stream_groups", undefined, payload)
      )
    );
  }

  const getSubjectListApiCall = (otherProps?: any) => {
    let payload = { branchId: branchId, curriculumId: addEditNewOptionalSubjectFormik.values.curriculumId, pageNo: 0, pageSize: 100, sortBy: "subjectName", ...otherProps }
    dispatch(
      getClassSubjectsList(
        generateActionPayload("get_class_subject_list", undefined, payload)
      )
    );
  }

  function addNewOptionalSubjectHndlr() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        optionNumber: "",
        subjectId: "",
        order: "",
        isOptional: "YES",
      });
    }
  }

  function removeOptionalSubjectHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "curriculumId") {
      addEditNewOptionalSubjectFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        branchClassId: "",
        branchStreamGroupId: "",
      }));
      if (value) {
        fetchClassList({ curriculumId: value });
        getSubjectListApiCall({ curriculumId: value });
      } else {
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "branchClassId") {
      addEditNewOptionalSubjectFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        branchStreamGroupId: "",
      }));
      if (value) {
        fetchStreamGroupList({ classId: value });
      } else {
      }
    } else if (name === "branchStreamGroupId") {
      addEditNewOptionalSubjectFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));

    } else {
      addEditNewOptionalSubjectFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  useEffect(() => {
    if (academicYearListResp) {
      let yearId =
        academicYearListResp &&
        academicYearListResp.data.find(
          (year: any) => year.yearStatus.toLowerCase() === "current"
        )?.academicYearId;
      addEditNewOptionalSubjectFormik.setFieldValue("academicYearId", yearId);
      fetchCurriculumList({ academicYearId: yearId });
    }
  }, [academicYearListResp]);


  useEffect(() => {
    if (editId && getOptionalSubjectItemByIdResp) {
      const { isOptional, optionNumber, order, curriculumId, branchClassId, branchStreamGroupId, subjectId, subject } = getOptionalSubjectItemByIdResp || {};
      addEditNewOptionalSubjectFormik.setFieldValue("curriculumId", curriculumId ?? "");
      fetchClassList({ curriculumId });
      getSubjectListApiCall({ curriculumId });
      addEditNewOptionalSubjectFormik.setFieldValue("branchClassId", branchClassId ?? "");
      fetchStreamGroupList({ curriculumId, branchClassId });
      addEditNewOptionalSubjectFormik.setFieldValue("branchStreamGroupId", branchStreamGroupId ?? "");
      addEditNewOptionalSubjectFormik.setFieldValue("optionalSubjects", [
        {
          optionNumber: optionNumber,
          subjectId : subjectId ? subjectId : subject,
          order: order,
          isOptional,
        },
      ]);
    }
  }, [editId, getOptionalSubjectItemByIdResp]);

  useEffect(() => {
    return () => {
      dispatch(setClassSubjectsListAct(undefined));
      dispatch(setAssignLanBrchStreamGroupsAct(undefined));
      dispatch(resetAssignLanClassListAct(undefined));
      dispatch(setOptionalSubjectItemByIdAct(undefined));
    }
  }, []);

  const { data: curriculumTypes } = getAssignListCurriculumResp || {};
  const { content: streamGroup } = getAssignLanBrchStreamGroupsResp || {};


  return (
    <div className="tw-p-4">
      <div className="tw-grid tw-grid-cols-12 tw-gap-3">
        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
          <SelectInput
            name="curriculumId"
            value={addEditNewOptionalSubjectFormik.values.curriculumId}
            onChange={filterHandler}
            menuItems={curriculumTypes?.filter((item: any) => item.branchCurriculumId !== 18) || []}
            valueKey="branchCurriculumId"
            textKey="curriculumName"
            formgroupClassName="tw-mb-0"
            labelText="Curriculum"
            floatingLabel
            isDisabled={editId}
            invalid={
              !!(
                addEditNewOptionalSubjectFormik.touched.curriculumId &&
                addEditNewOptionalSubjectFormik.errors.curriculumId
              )
            }
            error={
              addEditNewOptionalSubjectFormik.touched.curriculumId &&
                addEditNewOptionalSubjectFormik.errors.curriculumId
                ? addEditNewOptionalSubjectFormik.errors.curriculumId
                : ""
            }
          ></SelectInput>
        </div>
        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
          <SelectInput
            name="branchClassId"
            value={addEditNewOptionalSubjectFormik.values.branchClassId}
            onChange={filterHandler}
            menuItems={getAssignLanClassListResp?.content?.filter((item: any) => item?.classSequence >= 14) || []}
            valueKey="id"
            textKey="shortName"
            formgroupClassName="tw-mb-0"
            labelText="Class"
            floatingLabel
            isDisabled={editId}
            invalid={
              !!(
                addEditNewOptionalSubjectFormik.touched.branchClassId &&
                addEditNewOptionalSubjectFormik.errors.branchClassId
              )
            }
            error={
              addEditNewOptionalSubjectFormik.touched.branchClassId &&
                addEditNewOptionalSubjectFormik.errors.branchClassId
                ? addEditNewOptionalSubjectFormik.errors.branchClassId
                : ""
            }
          ></SelectInput>
        </div>
        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
          <SelectInput
            name="branchStreamGroupId"
            value={addEditNewOptionalSubjectFormik.values.branchStreamGroupId}
            onChange={filterHandler}
            menuItems={streamGroup || []}
            valueKey="id"
            textKey="shortName"
            formgroupClassName="tw-mb-0"
            labelText="Group"
            floatingLabel
            isDisabled={editId}
            invalid={
              !!(
                addEditNewOptionalSubjectFormik.touched.branchStreamGroupId &&
                addEditNewOptionalSubjectFormik.errors.branchStreamGroupId
              )
            }
            error={
              addEditNewOptionalSubjectFormik.touched.branchStreamGroupId &&
                addEditNewOptionalSubjectFormik.errors.branchStreamGroupId
                ? addEditNewOptionalSubjectFormik.errors.branchStreamGroupId
                : ""
            }
          ></SelectInput>
        </div>
        <div className="tw-col-span-12">
          <div className="tw-grid tw-grid-cols-12 tw-bg-gray-100 tw-w-full tw-mx-auto">
            <div className="tw-col-span-3">
              <h6 className="tw-m-0 tw-p-2 tw-text-sm tw-font-medium tw-text-gray-700 after:tw-content-['*'] after:tw-text-red-500 after:tw-ml-0.5">Option Number</h6>
            </div>
            <div className="tw-col-span-3">
              <h6 className="tw-m-0 tw-p-2 tw-text-sm tw-font-medium tw-text-gray-700 after:tw-content-['*'] after:tw-text-red-500 after:tw-ml-0.5">Subject</h6>
            </div>
            <div className="tw-col-span-3">
              <h6 className="tw-m-0 tw-p-2 tw-text-sm tw-font-medium tw-text-gray-700 after:tw-content-['*'] after:tw-text-red-500 after:tw-ml-0.5">Order</h6>
            </div>
            <div className="tw-col-span-2">
              <h6 className="tw-m-0 tw-p-2 tw-text-sm tw-font-medium tw-text-gray-700 after:tw-content-['*'] after:tw-text-red-500 after:tw-ml-0.5">Is Optional</h6>
            </div>
          </div>
        </div>
        <div className="tw-col-span-12">
          <FormikProvider value={addEditNewOptionalSubjectFormik}>
            <FieldArray name="optionalSubjects">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }

                return (
                  <>
                    {addEditNewOptionalSubjectFormik.values.optionalSubjects?.map(
                      (item, idx) => {
                        const inputFieldErrors: any =
                          (addEditNewOptionalSubjectFormik.errors
                            .optionalSubjects &&
                            addEditNewOptionalSubjectFormik.errors
                              .optionalSubjects[idx]) ||
                          {};
                        const inputFieldTouched: any =
                          (addEditNewOptionalSubjectFormik.touched
                            .optionalSubjects &&
                            addEditNewOptionalSubjectFormik.touched
                              .optionalSubjects[idx]) ||
                          {};

                        return (
                          <div key={item.id} className="tw-mb-3 tw-grid tw-grid-cols-12 tw-gap-x-3">
                            <div className="tw-col-span-3">
                              <TextInput
                                name={`optionalSubjects[${idx}].optionNumber`}
                                value={item.optionNumber}
                                onChange={
                                  addEditNewOptionalSubjectFormik.handleChange
                                }
                                onBlur={
                                  addEditNewOptionalSubjectFormik.handleBlur
                                }
                                invalid={
                                  inputFieldTouched.optionNumber &&
                                    inputFieldErrors.optionNumber
                                    ? true
                                    : false
                                }
                                error={
                                  inputFieldTouched.optionNumber &&
                                    inputFieldErrors.optionNumber
                                    ? inputFieldErrors.optionNumber
                                    : ""
                                }
                                inputType="number"
                                placeHolder="Please enter Option Number"
                              />
                            </div>

                            {getOptionalSubjectItemByIdResp && !getOptionalSubjectItemByIdResp?.subjectId && (
                              <div className="tw-col-span-3">
                                <TextInput
                                  name={`optionalSubjects[${idx}].subjectId`}
                                  value={item.subjectId}
                                  onChange={
                                    addEditNewOptionalSubjectFormik.handleChange
                                  }
                                  onBlur={
                                    addEditNewOptionalSubjectFormik.handleBlur
                                  }
                                  invalid={
                                    inputFieldTouched.subjectId &&
                                      inputFieldErrors.subjectId
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputFieldTouched.subjectId &&
                                      inputFieldErrors.subjectId
                                      ? inputFieldErrors.subjectId
                                      : ""
                                  }
                                  isDisabled
                                />
                              </div>
                            )}
                            {getOptionalSubjectItemByIdResp && getOptionalSubjectItemByIdResp?.subjectId && (
                              <div className="tw-col-span-3">
                                <SelectInput
                                  name={`optionalSubjects[${idx}].subjectId`}
                                  value={item.subjectId}
                                  onChange={
                                    addEditNewOptionalSubjectFormik.handleChange
                                  }
                                  menuItems={academicSubjectsListResp}
                                  valueKey="id"
                                  textKey="subjectName"
                                  onBlur={
                                    addEditNewOptionalSubjectFormik.handleBlur
                                  }
                                  invalid={
                                    inputFieldTouched.subjectId &&
                                      inputFieldErrors.subjectId
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputFieldTouched.subjectId &&
                                      inputFieldErrors.subjectId
                                      ? inputFieldErrors.subjectId
                                      : ""
                                  }
                                />
                              </div>
                            )}
                            {!getOptionalSubjectItemByIdResp && (
                              <div className="tw-col-span-3">
                                <SelectInput
                                  name={`optionalSubjects[${idx}].subjectId`}
                                  value={item.subjectId}
                                  onChange={
                                    addEditNewOptionalSubjectFormik.handleChange
                                  }
                                  menuItems={academicSubjectsListResp}
                                  valueKey="id"
                                  textKey="subjectName"
                                  onBlur={
                                    addEditNewOptionalSubjectFormik.handleBlur
                                  }
                                  invalid={
                                    inputFieldTouched.subjectId &&
                                      inputFieldErrors.subjectId
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputFieldTouched.subjectId &&
                                      inputFieldErrors.subjectId
                                      ? inputFieldErrors.subjectId
                                      : ""
                                  }
                                />
                              </div>
                            )}

                            <div className="tw-col-span-3">
                              <TextInput
                                name={`optionalSubjects[${idx}].order`}
                                value={item.order}
                                onChange={
                                  addEditNewOptionalSubjectFormik.handleChange
                                }
                                onBlur={
                                  addEditNewOptionalSubjectFormik.handleBlur
                                }
                                placeHolder="Please enter Order"
                                inputType="number"
                                invalid={
                                  inputFieldTouched.order &&
                                    inputFieldErrors.order
                                    ? true
                                    : false
                                }
                                error={
                                  inputFieldTouched.order &&
                                    inputFieldErrors.order
                                    ? inputFieldErrors.order
                                    : ""
                                }
                              />
                            </div>

                            <div className="tw-col-span-2">
                              <RadioInputContainer
                                name={`optionalSubjects[${idx}].isOptional`}
                                formgroupClassName="tw-mb-2"
                                inputContainerClassName="tw-mt-2"
                                radioOptions={yesNoRadioOptions}
                                value={item.isOptional}
                                onChange={
                                  addEditNewOptionalSubjectFormik.handleChange
                                }
                              ></RadioInputContainer>
                            </div>
                            <div className="tw-col-span-1">
                              {idx !== 0 && (
                                <button
                                  data-index={idx}
                                  onClick={removeOptionalSubjectHndlr}
                                  className="tw-p-1 tw-rounded tw-bg-white tw-border tw-border-gray-200 hover:tw-bg-red-50 tw-transition-colors tw-duration-150"
                                >
                                  <HugeiconsIcon
                                    icon={Delete02StrokeStandard}
                                    className="tw-text-red-500"
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
        {!editId && (
          <div className="tw-col-span-12">
            <Button
              type="button"
              variant="soft"
              onClick={addNewOptionalSubjectHndlr}
            >
              Add New
            </Button>
          </div>
        )}
      </div>
      <div className="tw-grid tw-grid-cols-12">
        <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-3">
          <Button
          variant="secondary"
            onClick={toggle}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={(event: any) =>
              addEditNewOptionalSubjectFormik.handleSubmit(event)
            }
            disabled={showApiLoader}
          >
            {editId ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNewOptionalSubjectModal;
