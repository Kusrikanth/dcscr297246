import { setNestedObjectValues, useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { InputCheckbox, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateModalColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editHostelFeeStructureAct, getHostelFeeNameAct, getHostelFeeStructureByIdAct, getHostelFeeTermsAct, getHostelRoomTypesAct, resetHostelFeeStructureByIdAct, saveHostelFeeStructureAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { getBranchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import * as Yup from "yup";
import { touchTableFieldOnBlur, validateOnChange, validateOnSubmit, validateSingleTableField } from "../../../../utility/validationutility";
import { getYyyyMmDdFormat } from "../../../../utility/dateutility";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";


const initialValues = {
  academicYearId: "",
  curriculumId: "",
  hostelId: "",
  feeNameId: "",
  roomTypeId: "",
  feeType: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic year is required.").nullable(),
  curriculumId: Yup.string().required("Curriculum is required.").nullable(),
  hostelId: Yup.string().required("Hostel is required.").nullable(),
  feeNameId: Yup.string().required("Fee is required.").nullable(),
  roomTypeId: Yup.string().required("Room Type is required.").nullable(),
  feeType: Yup.string().required("Fee Type is required.").nullable(),
});

const termsValidationSchema = Yup.array().of(
  Yup.object().shape({
    fromDate: Yup.date().typeError("Enter a valid date").required("From date cannot be empty"),
    toDate: Yup.date().typeError("Enter a valid date").required("To date cannot be empty"),
    feeAmount: Yup.number().typeError("Not a valid number").moreThan(0, "Fee amount should be greater than 0.")
      .required("Fee amount is required."),
  })
);

const HostelFeeStructureModel: React.FC<any> = (props) => {

  const dispatch = useAppDispatch();
  const [termsState, setTermsState] = useState<any>([]);
  const [classListState, setClassListState] = useState<any>([]);
  const [selectAllClassState, setSelectAllClassState] = useState(false);
  const [classErrorState, setClassErrorState] = useState("");

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelDetailsResp,
    getHostelFeeNameResp,
    getHostelRoomTypesResp,
    getHostelFeeTermsResp,
    getHostelFeeStructureByIdResp,
  }: any = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, hostelSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelFeeNameResp: hostelSettings.getHostelFeeNameResp,
      getHostelRoomTypesResp: hostelSettings.getHostelRoomTypesResp,
      getHostelFeeTermsResp: hostelSettings.getHostelFeeTermsResp,
      getHostelFeeStructureByIdResp: hostelSettings.getHostelFeeStructureByIdResp,
    }),
    shallowEqual
  );

  const addHostelFeeStructureRef = useRef<any>({
    prevBranchClassResp: branchClassResp,
    prevGetHostelFeeTermsResp: getHostelFeeTermsResp,
    prevGetHostelFeeStructureByIdResp: getHostelFeeStructureByIdResp,
  });

  useEffect(() => {
    const { prevBranchClassResp, prevGetHostelFeeTermsResp, prevGetHostelFeeStructureByIdResp } = addHostelFeeStructureRef.current;

    if (branchClassResp && branchClassResp !== prevBranchClassResp) {
      const { content } = branchClassResp || {};
      const { classes } = getHostelFeeStructureByIdResp || {};
      if (Array.isArray(content)) {
        if (Array.isArray(classes) && classes.length > 0) {
          updateSelectedClass(content, classes);
        } else {
          const updateClassList = content?.map(item => ({ ...item }));
          setClassListState(updateClassList);
        }
      }
    }
    else if (getHostelFeeTermsResp && prevGetHostelFeeTermsResp !== getHostelFeeTermsResp) {
      if (Array.isArray(getHostelFeeTermsResp)) {
        const termsList: any = [];
        for (let i = 0; i < getHostelFeeTermsResp.length; i++) {
          termsList.push({
            termId: getHostelFeeTermsResp[i].instituteTermId, termName: getHostelFeeTermsResp[i].instituteTermName, fromDate: "",
            feeAmount: "", toDate: "",
          });
        }
        setTermsState(termsList);
      }
    }
    else if (getHostelFeeStructureByIdResp && prevGetHostelFeeStructureByIdResp !== getHostelFeeStructureByIdResp) {
      const { academicYearId, curriculumId, feeNameId, hostelDetailId, roomTypeId, feeType, classIds, structureTermsVos } = getHostelFeeStructureByIdResp || {}

      addHostelFeeStructureForm.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, hostelId: hostelDetailId, feeNameId, feeType, roomTypeId }))

      getBranchClassApiCall(curriculumId)
      getHostelFeeNames({ curriculumId, hostelId: hostelDetailId })
      getHostelRoomTypes({ hostelId: hostelDetailId })

      if (Array.isArray(structureTermsVos)) {
        const updatedTerms = structureTermsVos.map((item: any) => (
          {
            termId: item["termId"],
            termName: item["termName"],
            toDate: item["toDate"],
            fromDate: item["fromDate"],
            feeAmount: item["feeAmount"],
            // fromDate: getYyyyMmDdFormat(item["fromDate"]),
            // feeAmount: getAmountValueWithDecimal(item["feeAmount"]),
          }
        ));
        setTermsState(updatedTerms);
      }
    }

    addHostelFeeStructureRef.current.prevBranchClassResp = branchClassResp;
    addHostelFeeStructureRef.current.prevGetHostelFeeTermsResp = getHostelFeeTermsResp;
    addHostelFeeStructureRef.current.prevGetHostelFeeStructureByIdResp = getHostelFeeStructureByIdResp;
  }, [branchClassResp, getHostelFeeTermsResp, getHostelFeeStructureByIdResp]);

  useEffect(() => {
    if (!props.isOpen) {
      addHostelFeeStructureForm.resetForm();
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (academicYearListResp && !props.feeStructureId && Array.isArray(academicYearListResp?.data)) {
      const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      addHostelFeeStructureForm.setFieldValue("academicYearId", academicYearId);
    }
  }, [academicYearListResp, props.feeStructureId]);

  useEffect(() => {
    const { feeStructureId } = props;
    if (feeStructureId) {
      const params = { id: feeStructureId };
      dispatch(getHostelFeeStructureByIdAct(generateActionPayload("get_hostel_fee_structure_by_id", params)));
    }
  }, [props.feeStructureId,branchId,instituteId]);
  
  useEffect(() => {
    return () => { dispatch(resetHostelFeeStructureByIdAct(undefined)) }
  }, [])

  useEffect(() => {
    if (brchCurriculumResp && !props.feeStructureId && Array.isArray(brchCurriculumResp?.data) && props?.isOpen) {
      const { branchCurriculumId } = brchCurriculumResp?.data[0] || {};
      getBranchClassApiCall(branchCurriculumId);
      getHostelFeeNames({ curriculumId: branchCurriculumId })
      addHostelFeeStructureForm.setFieldValue("curriculumId", branchCurriculumId);
    }
  }, [brchCurriculumResp,branchId,instituteId, props.feeStructureId]);

  const addHostelFeeStructureForm = useFormik({
    // enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { academicYearId, curriculumId, feeNameId, feeType, hostelId, roomTypeId } = values || {}

      const classIds = classListState.filter((item: any) => item.selected).map((item: any) => item.id);
      const structureTermsDtos = termsState.map((item: any) => (
        {
          termId: item["termId"],
          feeAmount: item["feeAmount"],
          fromDate: item["fromDate"],
          toDate: item["toDate"]
        }
      ));

      if (props?.feeStructureId) {
        const payload = {
          classIds,
          structureTermsDtos,
        }

        dispatch(editHostelFeeStructureAct(generateActionPayload("edit_hostel_fee_structure", { id: props?.feeStructureId }, payload)));
      } else {
        const payload = {
          academicYearId, branchId, curriculumId, feeNameId, feeType, roomTypeId,
          hostelDetailId: hostelId,
          classIds,
          structureTermsDtos,
        }

        dispatch(saveHostelFeeStructureAct(generateActionPayload("save_hostel_fee_structure", undefined, payload)));
      }
    }
  });

  const getHostelFeeNames = (otherProps?: any) => {
    const payload = {
      curriculumId: addHostelFeeStructureForm.values?.curriculumId,
      branchId, hostelId: addHostelFeeStructureForm.values?.hostelId, ...otherProps
    }
    if (payload.curriculumId) {
      dispatch(getHostelFeeNameAct(generateActionPayload("get_hostel_fee_names", undefined, payload)));
    }
  }

  const getHostelRoomTypes = (otherProps?: any) => {
    const payload = {
      branchId,
      hostelId: addHostelFeeStructureForm.values?.hostelId, ...otherProps
    }
    dispatch(getHostelRoomTypesAct(generateActionPayload("get_hostel_room_type", undefined, payload)));
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target || {};

    if (name === "curriculumId") {
      addHostelFeeStructureForm.setValues((prevState: any) => ({ ...prevState, [name]: value, feeNameId: "", feeType: "", roomTypeId: "" }));
      getHostelFeeNames({ [name]: value })
      getBranchClassApiCall(value)
    }
    else if (name === "hostelId") {

      getHostelRoomTypes({ [name]: value })
      getHostelFeeNames({ [name]: value })
      addHostelFeeStructureForm.setValues((prevState: any) => ({ ...prevState, [name]: value, feeNameId: "", roomTypeId: "", feeType: "" }));

    } else if (name === "feeNameId") {

      const data = getHostelFeeNameResp?.find((item: any) => item.id == value);
      let payload: any = { instituteId };
      if (data?.feeType?.toLowerCase() === "term wise fee") {
        payload.termTypeName = "HOSTEL TERM"
      }
      addHostelFeeStructureForm.setValues((prevState: any) => ({ ...prevState, [name]: value, feeType: data?.feeType }));
      dispatch(getHostelFeeTermsAct(generateActionPayload("get_hostel_fee_terms", undefined, payload)));

    } else {
      addHostelFeeStructureForm.setValues((prevState: any) => ({ ...prevState, [name]: value }));
    }
  }

  async function onChangeTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      [indexKey, nameKey] = name.split(".");
    if (indexKey && nameKey) {
      var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
        index = Number(Number(indexMatch[1]));
      if (!isNaN(index)) {
        const updatedTermState = [...termsState],
          termsInfo = { ...termsState[index], [nameKey]: value };
        updatedTermState.splice(index, 1, termsInfo);
        // if (termsInfo?.touched && termsInfo?.touched[nameKey]) {
        const { items } = await validateOnChange(termsValidationSchema, name, updatedTermState);
        setTermsState(items);
        // return;
        // }
        // setTermsState(updatedTermState);
      }
    }
  }

  function updateSelectedClass(branchClass: any, selectClasses: any) {
    const selectedClassIds = selectClasses?.reduce((data: any, item: any) => {
      data[item.name] = true;
      return data;
    }, {});
    const updateClassList = branchClass?.map((item: any) => {
      if (Object.prototype.hasOwnProperty.call(selectedClassIds, item.className)) {
        return Object.assign({}, item, { selected: true });
      }
      return Object.assign({}, item, { selected: false });
    })
    updateSelectedAllHndlr(updateClassList);
    setClassListState(updateClassList);
  }

  async function onBlurTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      [indexKey, nameKey] = name.split(".");
    if (indexKey && nameKey) {
      var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
        index = Number(Number(indexMatch[1]));
      if (!isNaN(index)) {
        if (index === 0) {
          const updatedTermState = [...termsState];

          if ((nameKey === "fromDate") || (nameKey === "toDate")) {
            const indexTermInfo = { ...updatedTermState[index], [nameKey]: value },
              monthGap = Math.round(12 / updatedTermState.length),
              selectedDate = new Date(value);
            updatedTermState.splice(index, 1, indexTermInfo);
            for (let i = 1; i < updatedTermState.length; i++) {
              if (i !== index && !updatedTermState[i][nameKey]) {
                const updateDate = new Date(selectedDate.setMonth(selectedDate.getMonth() + (i * monthGap)));
                updatedTermState[i][nameKey] = getYyyyMmDdFormat(updateDate);
              }
            }
            const termsStateTouched = await touchTableFieldOnBlur(index, nameKey, updatedTermState),
              itemsAfterColumnValidation = await validateSingleTableField(termsValidationSchema, termsStateTouched, nameKey);
            setTermsState(itemsAfterColumnValidation);
          } else {
            const amountValue = getAmountValueWithDecimal(value),
              indexTermInfo = { ...updatedTermState[index], [nameKey]: amountValue };
            updatedTermState.splice(index, 1, indexTermInfo);
            //We need to update else than zero index
            for (let i = 1; i < updatedTermState.length; i++) {
              if (i !== index && !updatedTermState[i][nameKey]) {
                updatedTermState[i][nameKey] = amountValue;
              }
            }
            const termsStateTouched = await touchTableFieldOnBlur(index, nameKey, updatedTermState),
              itemsAfterColumnValidation = await validateSingleTableField(termsValidationSchema, termsStateTouched, nameKey);
            setTermsState(itemsAfterColumnValidation);
          }
        } else if ((nameKey === "fromDate") || (nameKey === "toDate")) {
          const updatedTermState = [...termsState],
            indexTermInfo = { ...updatedTermState[index], [nameKey]: getAmountValueWithDecimal(value) };
          updatedTermState.splice(index, 1, indexTermInfo);
          const termsStateTouched = await touchTableFieldOnBlur(index, nameKey, updatedTermState);
          setTermsState(termsStateTouched);
        } else {
          const updatedTermState = [...termsState],
            indexTermInfo = { ...updatedTermState[index], [nameKey]: value };
          updatedTermState.splice(index, 1, indexTermInfo);
          const termsStateTouched = await touchTableFieldOnBlur(index, nameKey, updatedTermState);
          setTermsState(termsStateTouched);
        }
      }
    }
  }

  function getBranchClassApiCall(curriculumId: any) {
    const payload = {
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId,
      branchId,
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function selectAllClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    if (classListState.length === 0) {
      return;
    }
    const { checked } = event.target;
    setSelectAllClassState(checked);
    const updateClassList = [...classListState];
    if (checked) {
      updateClassList.forEach((item) => {
        item.selected = true;
      });
      setClassListState(updateClassList);
      setClassErrorState("");
    } else {
      updateClassList.forEach((item) => {
        item.selected = false;
      });
      setClassListState(updateClassList);
    }
  }

  function updateSelectedAllHndlr(classList: any) {
    const isAllSelected = classList.every((item: any) => item.selected);
    if (isAllSelected) {
      setSelectAllClassState(true);
    } else {
      setSelectAllClassState(false);
    }
  }

  function selectClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target,
      classId = Number(event.target.getAttribute("data-id")),
      classIndex = classListState.findIndex((item: any) => item.id === classId);
    if (classErrorState && checked) {
      setClassErrorState("");
    }
    if (classIndex > -1) {
      const classDetails = classListState[classIndex],
        updateClassList = [...classListState];
      updateClassList.splice(classIndex, 1, { ...classDetails, selected: checked });
      setClassListState(updateClassList);
      updateSelectedAllHndlr(updateClassList)
    }
  }

  async function submitHndlr() {
    const updatedTermState = [...termsState];
    const { items, isValid: isTermStateValid } = await validateOnSubmit(termsValidationSchema, updatedTermState);
    const classIdSelected = classListState.some((item: any) => item.selected);
    const formKeys = await addHostelFeeStructureForm.validateForm();
    if (!isTermStateValid || !classIdSelected || Object.keys(formKeys).length !== 0) {
      if (!classIdSelected) {
        setClassErrorState("Select atleast once class for the fee structure after selecting curriculum.");
      } else {
        setClassErrorState("");
      }
      if (!isTermStateValid) {
        setTermsState(items);
      }
      if (Object.keys(formKeys).length !== 0) {
        addHostelFeeStructureForm.setTouched(setNestedObjectValues<any>(formKeys, true));
      }
      return;
    }
    setClassErrorState("");
    addHostelFeeStructureForm.handleSubmit();
  }

  const roleColumns = useMemo(() => generateModalColumns(onChangeTableHndlr), [termsState]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}

  return (
    <>
      <form>
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-px-3 tw-py-3">
          <div className="tw-col-span-1">
            <SelectInput
              name="academicYearId"
              value={addHostelFeeStructureForm.values.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              labelClass="required"
              isDisabled={props?.feeStructureId && true}
              labelText="Academic Year"
              formgroupClassName="tw-mb-0"
              defaultSelect="Select"
              invalid={(addHostelFeeStructureForm.touched.academicYearId && addHostelFeeStructureForm.errors.academicYearId) ? true : false}
              error={(addHostelFeeStructureForm.touched.academicYearId && addHostelFeeStructureForm.errors.academicYearId) ? addHostelFeeStructureForm.errors.academicYearId : ""}
            />
          </div>

          <div className="tw-col-span-1">
            <SelectInput
              name="curriculumId"
              value={addHostelFeeStructureForm.values.curriculumId}
              onChange={filterHandler}
              menuItems={curriculumTypes || []}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              labelClass="required"
              isDisabled={props?.feeStructureId && true}
              formgroupClassName="tw-mb-0"
              labelText="Curriculum"
              invalid={(addHostelFeeStructureForm.touched.curriculumId && addHostelFeeStructureForm.errors.curriculumId) ? true : false}
              error={(addHostelFeeStructureForm.touched.curriculumId && addHostelFeeStructureForm.errors.curriculumId) ? addHostelFeeStructureForm.errors.curriculumId : ""}
            />
          </div>

          <div className="tw-col-span-1">
            <SelectInput
              name="hostelId"
              labelText="Hostel"
              labelClass="required"
              value={addHostelFeeStructureForm.values.hostelId}
              onChange={filterHandler}
              menuItems={getHostelDetailsResp?.data}
              isDisabled={props?.feeStructureId && true}
              valueKey="hostelId"
              textKey="hostelName"
              formgroupClassName="tw-mb-0"
              invalid={(addHostelFeeStructureForm.touched.hostelId && addHostelFeeStructureForm.errors.hostelId) ? true : false}
              error={(addHostelFeeStructureForm.touched.hostelId && addHostelFeeStructureForm.errors.hostelId) ? addHostelFeeStructureForm.errors.hostelId : ""}
            />
          </div>

          <div className="tw-col-span-1">
            <SelectInput
              name="feeNameId"
              labelText="Fee Name"
              labelClass="required"
              value={addHostelFeeStructureForm.values.feeNameId}
              onChange={filterHandler}
              menuItems={getHostelFeeNameResp || []}
              isDisabled={props?.feeStructureId && true}
              valueKey="id"
              textKey="feeName"
              formgroupClassName="tw-mb-0"
              invalid={(addHostelFeeStructureForm.touched.feeNameId && addHostelFeeStructureForm.errors.feeNameId) ? true : false}
              error={(addHostelFeeStructureForm.touched.feeNameId && addHostelFeeStructureForm.errors.feeNameId) ? addHostelFeeStructureForm.errors.feeNameId : ""}
            />
          </div>

          <div className="tw-col-span-1">
            <TextInput
              name="feeType"
              labelText="Fee Type"
              value={addHostelFeeStructureForm.values.feeType}
              isDisabled={true}
              isReadOnly={true}
              onChange={undefined}
              formgroupClassName="tw-mb-0"
            />
          </div>

          <div className="tw-col-span-1">
            <SelectInput
              name="roomTypeId"
              labelText="Room Type"
              labelClass="required"
              value={addHostelFeeStructureForm.values.roomTypeId}
              onChange={filterHandler}
              menuItems={getHostelRoomTypesResp?.data}
              isDisabled={!!props?.feeStructureId}
              valueKey="roomTypeId"
              textKey="roomType"
              formgroupClassName="tw-mb-0"
              invalid={(addHostelFeeStructureForm.touched.roomTypeId && addHostelFeeStructureForm.errors.roomTypeId) ? true : false}
              error={(addHostelFeeStructureForm.touched.roomTypeId && addHostelFeeStructureForm.errors.roomTypeId) ? addHostelFeeStructureForm.errors.roomTypeId : ""}
            />
          </div>
        </div>

        {addHostelFeeStructureForm.values.feeNameId && (
          <div className="tw-mb-3">
            <div className="tw-overflow-x-auto">
              <TableContainer
                columns={roleColumns}
                data={termsState}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                onChangeInputHndlr={onChangeTableHndlr}
                onBlurInputHndlr={onBlurTableHndlr}
              />
            </div>
          </div>
        )}

        {addHostelFeeStructureForm.values.curriculumId && (
          <div className="tw-mb-3 tw-px-3">
            <div className="tw-mb-2">
              <h6 className="tw-text-sm tw-font-semibold tw-mb-1">
                Select Classes
              </h6>
              {classErrorState && (
                <span className="tw-text-red-500 tw-text-sm tw-block">
                  {classErrorState}
                </span>
              )}
            </div>

            <div className="tw-mb-2">
              <InputCheckbox
                name="selectAllClass"
                labelName="Select All"
                value={selectAllClassState}
                onChange={selectAllClassHndlr}
              />
            </div>

            <div className="tw-grid tw-grid-cols-3 tw-gap-2">
              {Array.isArray(classListState) &&
                classListState.map((item, index) => (
                  <InputCheckbox
                    key={item.id}
                    name={`class-${index}`}
                    labelName={item.shortName}
                    value={item.selected}
                    onChange={selectClassHndlr}
                    dataId={item.id}
                  />
                ))}
            </div>
          </div>
        )}

        <div className="tw-flex tw-justify-end tw-mx-4 tw-my-3">
          <div className="tw-flex tw-gap-2">
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
              onClick={submitHndlr}
              disabled={showApiLoader}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default HostelFeeStructureModel;
