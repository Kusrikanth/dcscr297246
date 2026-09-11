import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { MultiSelectCheckbox, SelectInput, TextArea, TextInput } from "../../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getExaminationTermListAct, getHolisticActivityAct, getHolisticDomainModelAct, saveDomainActivityAct, saveIgseTermNameAct, updateIgseTermNameAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getAssignCurriculumListAct } from "../../../../../store/assignlanguages/assignlanguagesaction";
import { generateColumnsI, renderOptionsStatus, renderValueStaff } from "./helper";
import TableContainer from "../../../../../Components/Common/TableContainer";

const initialValues = {
  domain: "",
  activityIds: [],
};
const validationSchema = Yup.object().shape({
  domain: Yup.string().required("Domain is required"),
})

const AddEditNewSportsModal = (props: any) => {
  const [studentData, setStudentData] = useState<any>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);


  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const getHolisticActivityApiCall = (otherProps?: any) => {
    const payload = { ...otherProps, instituteId };
    dispatch(getHolisticActivityAct(generateActionPayload("get_holistic_activity", undefined, payload)));
  };

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getIgseTermNameByIdResp,
    getHolisticDomainActivityResp,
    getHolisticDomainModelResp,
    getHolisticActivityResp
  } = useAppSelector(({ examinationSettings, appData, assignLanguages, globalData }) => ({
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    getIgseTermNameByIdResp: examinationSettings.getIgseTermNameByIdResp,
    getHolisticDomainModelResp: examinationSettings.getHolisticDomainModelResp,
    getHolisticDomainActivityResp: examinationSettings.getHolisticDomainActivityResp,
    getHolisticActivityResp: examinationSettings.getHolisticActivityResp,

    showApiLoader: globalData.showApiLoader,
  }), shallowEqual);

  const termNameFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const selectedIds = studentData?.filter(item => item.isSelected)?.map(item => item.id);
      const payload = {
        domainId: values.domain,
        activityIds: selectedIds,
      };
      dispatch(
        saveDomainActivityAct(
          generateActionPayload("save_holistic_domain_activity", undefined, payload)
        )
      );
    },
  });

  const getHolisticDomainApiCall = (otherProps?: any) => {
    dispatch(getHolisticDomainModelAct(generateActionPayload("get_holistic_domain", undefined, {})));
  };

  useEffect(() => {
    getHolisticDomainApiCall();
    getHolisticActivityApiCall();
  }, []);


  useEffect(() => {
    if (getHolisticActivityResp) {

      let selectedIds: number[] = [];
      if (props.id && getHolisticDomainActivityResp?.length > 0) {
        const data = getHolisticDomainActivityResp?.find((item: any) => +item.domainId === +props.id);
        if (data) {
          termNameFormik.setFieldValue('domain', data.domainId);
        }
        selectedIds = data?.activities?.map((act: any) => act.activityId) || [];
      }

      const tableData = getHolisticActivityResp?.data?.map((item: any) => ({
        ...item,
        isSelected: selectedIds.includes(item.id),
      }));

      setStudentData(tableData);

      const isAllSelected = tableData.length > 0 && tableData?.every((item: any) => item.isSelected);
      setAllStudentSelectedState(isAllSelected);
    }
  }, [getHolisticActivityResp, props.id, getHolisticDomainActivityResp]);


  function selectStudentHndlr(selectedOptions: number | number[], config?: any) {

    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      termNameFormik.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }));
    } else {
      termNameFormik.setValues((prevState) => ({ ...prevState, [name]: null }));
    }
  }

  function onSearchMultiSelectHandleremployee(name: any, value: string) {
    if (value) {
      getHolisticActivityApiCall({ searchString: value });
    }
  }


  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [...studentData];
    updateStudentState.forEach((item: any) => {
      item.isSelected = checked;
      if (!checked) {
        item.errors = {};
      }
    });
    setStudentData(updateStudentState);
  }, [studentData]);

  const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget
    const studentIdNumber = event.currentTarget.getAttribute("data-id")
    const studentRowIndex = studentData.findIndex((item: any) => +item.id === Number(studentIdNumber));
    if (studentRowIndex > -1) {
      const studentDetails: any = studentData[studentRowIndex];
      let updateStudentState: any = [...studentData];
      updateStudentState.splice(studentRowIndex, 1, {
        ...studentDetails, isSelected: checked, ...(checked ? {} : { errors: {} }),
      });

      setStudentData(updateStudentState);
      const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
      setAllStudentSelectedState(isAllSelected);
    }
  }, [studentData]);

  const roleColumns = useMemo(() => generateColumnsI(allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr), [studentData, allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr]);


  return (
    <>
      <form onSubmit={termNameFormik.handleSubmit}>
        <div className="">
          <div className="row px-4 pt-3">
            <div className="col-8">
              <SelectInput
                name="domain"
                value={termNameFormik.values.domain}
                onChange={termNameFormik.handleChange}
                menuItems={getHolisticDomainModelResp || []}
                valueKey="id"
                textKey="name"
                labelText="Domain"
                isDisabled={props.id}
                invalid={(termNameFormik.touched.domain && termNameFormik.errors.domain) ? true : false}
                error={termNameFormik.touched.domain && termNameFormik.errors.domain ? termNameFormik.errors.domain : ""}
              />
            </div>
            {/* <div>
              <MultiSelectCheckbox
                name="activityIds"
                idKey="id"
                labelText='Activities'
                value={termNameFormik.values.activityIds}
                renderValue={renderValueStaff}
                renderOptions={renderOptionsStatus}
                onChange={selectStudentHndlr}
                searchKey="name"
                onSearchHandler={onSearchMultiSelectHandleremployee}
                options={getHolisticActivityResp?.data || []}
              />
            </div> */}

            <TableContainer
              columns={roleColumns || []}
              data={studentData || []}
              tableClass="mb-0"
              divClass="table-responsive mb-3"
              theadClass="table-light text-muted align-middle"
              showPagination={false}
            />
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

export default AddEditNewSportsModal;
