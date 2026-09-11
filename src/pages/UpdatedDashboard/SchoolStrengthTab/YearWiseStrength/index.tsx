import { useEffect, useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import AcademicYearWiseStrength from "./AcademicYearWiseStrength";
import CurrentVsPervious from "./CurrentVsPervious";
import { SelectInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getSchoolStrengthAct } from "../../../../store/academic/academicRequest/academicrequestactions";
import { generateActionPayload } from "../../../../utility/reduxutility";

export function getSortedAcademicYearNames(data: any) {
  const sortedData = [...data].sort((a: any, b: any) => a.academicYearId - b.academicYearId);

  const academicYearNames = sortedData.map((item: any) => item.academicYearName);

  return academicYearNames;
}

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const YearWiseStrength = (props:any) => {
  const [activeId, setActiveId] = useState<any>("academic-year-wise");
  const dispatch = useAppDispatch();
  const { branchId } = props || {}

  const {
    currentInstIdResp: instituteId, currentBranchIdResp, academicYearListResp, brchCurriculumResp,
    branchListResp, getSchoolStrengthResp, } =
    useAppSelector(({ appData, branch, instAcademics, branchAcademics, academicRequest }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getSchoolStrengthResp: academicRequest.getSchoolStrengthResp,
    }), shallowEqual)

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "academic-year-wise",
      labelName: "Academic Year",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    // {
    //   id: "current-vs-previous",
    //   labelName: "Current vs Previous",
    //   customPadding: "0px 5px 5px 5px",
    //   Icon: "",
    // },
  ];

  const genderWiseComparisionApiCall = (otherProps?: any) => {

    const payload = {
      branchId,
      instituteId,
      ...otherProps,
    };
    if (instituteId) {
      dispatch(getSchoolStrengthAct(generateActionPayload('get_school_strength', undefined, payload)))
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "academic-year-wise":
        return AcademicYearWiseStrength;
      case "current-vs-previous":
        return CurrentVsPervious;
    }
  }
  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent></TabComponent>;
  }, [activeId]);

  useEffect(() => {
    if (instituteId && activeId) {
      genderWiseComparisionApiCall()
    }
  }, [instituteId,activeId , branchId]);

  return (
    <>
      <div className="curriculum-wise-strength-container">
        <div className="card">
          <div className="card-header tw-py-2">
            <div className="tw-grid tw-grid-cols-12 tw-items-center tw-gap-3">
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <h4 className="card-title tw-mb-0 tw-flex-grow">
                  Gender wise Comparision
                </h4>
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-8 tw-ms-auto">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="overflow-auto tw-text-nowrap tw-justify-end horizontal-menu-updated-style"
                ></UpdatedHorizontalTab>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {activeComponent}
          </div>
        </div>
      </div>
    </>
  );
};

export default YearWiseStrength;
