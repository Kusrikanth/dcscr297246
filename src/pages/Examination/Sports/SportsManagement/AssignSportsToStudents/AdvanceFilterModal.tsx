import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { SelectInput } from "../../../../../Components/Common";
import {
  getBranchClassAct,
  resetBrchClassAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
  getIgseTermNameListAct,
  resetIgseTermNameListAct,
} from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { getSportsNamesAct } from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { reSetSportsNamesAct } from "../../../../../store/examination/examinationSports/examinationSportsSlice";

const initialValues = {
  searchString: "",
  classId: "",
  academicYearId: "",
  curriculumId: "",
  termId: "",
  sportId: "",
  sportClassId: "",
};

const AdvanceFilterModal = (props: any) => {
  const [advanceFilterState, setAdvanceFilterState] = useState<any>(
    props.appliedFilter || initialValues
  );
  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    getIgseTermNameListResp,
    getSportsNamesResp,
    branchClassResp,
  } = useAppSelector(
    ({ appData, branchAcademics, examinationSettings, examinationSports }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getCbseExaminationRequestListResp:
        examinationSettings.getCbseExaminationRequestListResp,

      getSportsNamesResp: examinationSports.getSportsNamesResp,
      branchClassResp: branchAcademics.branchClassResp,
    }),
    shallowEqual
  );

  const fetchClasssList = (otherProps?: any) => {
    const payload = {
      pageNo: 0,
      pageSize: 100,
      sortBy: "classSequence",
      orderBy: "asc",
      branchId,
      curriculumId: props.appliedFilter.curriculumId,
      academicYearId: props.appliedFilter.academicYearId,
      ...otherProps,
    };
    dispatch(
      getBranchClassAct(
        generateActionPayload("get_brch_curriculum_class", undefined, payload)
      )
    );
  };

  function fetchTermList(otherProps?: any) {
    const payload = {
      branchId,
      curriculumId: props.appliedFilter.curriculumId,
      ...otherProps,
    };

    dispatch(
      getIgseTermNameListAct(
        generateActionPayload("get_igse_term_name_list", undefined, payload)
      )
    );
  }

  function fetchExaminationSportsNames(otherProps?: any) {
    const payload = {
      branchId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };

    dispatch(
      getSportsNamesAct(
        generateActionPayload("get_sports_names", undefined, payload)
      )
    );
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setAdvanceFilterState((prev: any) => {
      if (name === "sportId" || name === "sportsId") {
        return {
          ...prev,
          sportId: value,
          sportsId: value,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  }

  useEffect(() => {
    if (advanceFilterState.curriculumId) {
      fetchTermList({ curriculumId: advanceFilterState.curriculumId });
      fetchClasssList({ curriculumId: advanceFilterState.curriculumId });
      fetchExaminationSportsNames();
      fetchClasssList();
    } else {
      dispatch(resetIgseTermNameListAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(reSetSportsNamesAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, [advanceFilterState.curriculumId]);

  const applyFilterHndlr = () => {
    props.applyFilterCallback({ ...advanceFilterState });
    props.toggleAdvanceFilter();
  };

  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="offcanvas-body">
        <div className="mb-4">
          <SelectInput
            name="termId"
            value={advanceFilterState.termId}
            onChange={filterHandler}
            menuItems={
              Array.isArray(getIgseTermNameListResp?.data)
                ? getIgseTermNameListResp?.data
                : []
            }
            valueKey="termId"
            textKey="termName"
            labelText="Term"
            floatingLabel
            formgroupClassName="mb-0"
          />
        </div>
        <div className="mb-4">
          <SelectInput
            name="sportId"
            value={advanceFilterState.sportId}
            onChange={filterHandler}
            menuItems={getSportsNamesResp?.data || []}
            valueKey="id"
            textKey="sportName"
            labelText="Sports"
            floatingLabel
            formgroupClassName="mb-0"
          />
        </div>
        <div className="mb-4">
          <SelectInput
            name="classId"
            value={advanceFilterState.classId}
            onChange={filterHandler}
            menuItems={classTypes}
            valueKey="id"
            textKey="shortName"
            labelText="Class"
            floatingLabel
            formgroupClassName="mb-0"
          />
        </div>
      </div>
      <div className="border-top p-2 text-center">
        <div className="hstack gap-2 justify-content-end">
          <button
            type="submit"
            onClick={applyFilterHndlr}
            className="btn btn-success"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvanceFilterModal;
