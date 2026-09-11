import { useEffect, useState } from "react";
import { SelectInput } from "../../../Components/Common";
import { useAppSelector } from "../../../hooks/storehook";
import SchoolStrengthStatistics from "./Statistics";
import StrengthBarView from "./StrengthBarView";
import StrengthTables from "./StrengthTables";
import YearWiseStrength from "./YearWiseStrength";
import { shallowEqual } from "react-redux";

const inititalValues = {
  branchId: "",
  academicYearId: "",
}

const SuperAdminSchoolStrength = () => {

  const [filterState, setFilterState] = useState(inititalValues);

  const {
    currentInstIdResp: instituteId, academicYearListResp,
    branchListResp } =
    useAppSelector(({ appData, branch, instAcademics, branchAcademics }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
    }), shallowEqual)

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
  }, [academicYearListResp]);

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      setFilterState((prevState) => ({ ...prevState, [name]: value, curriculumId: "" }));
    } else if (name === "curriculumId") {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
    } else if (name === "branchId") {
      setFilterState((prevState) => ({ ...prevState, [name]: value, curriculumId: "" }));
    }
  }

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="super-admin-school-strength-container">
        <div className="tw-grid tw-grid-cols-12 tw-gap-1">
          <div className="tw-col-span-12">
            <div className="card !tw-rounded-none !tw-bg-transparent !tw-shadow-none">
              <div className="card-header !tw-rounded-2xl !tw-shadow-sm">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-center">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <h4 className="card-title !tw-mb-0">
                      School Strength
                    </h4>
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-8">
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 lg:tw-w-2/3 lg:tw-ml-auto">
                      <div className="tw-w-full">
                        <SelectInput
                          name="branchId"
                          valueKey="branchId"
                          textKey="branchName"
                          value={filterState.branchId}
                          menuItems={branchListResp?.data}
                          onChange={onChangeFilterHndlr}
                          labelText="Branch Name"
                          floatingLabel
                          formgroupClassName="tw-mb-0"
                        />
                      </div>
                      <div className="tw-w-full">
                        <SelectInput
                          name="academicYearId"
                          value={filterState.academicYearId}
                          onChange={onChangeFilterHndlr}
                          menuItems={academicYearList || []}
                          valueKey="academicYearId"
                          textKey="academicYearName"
                          formgroupClassName="tw-mb-0"
                          labelText="Academic Year"
                          floatingLabel
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-col-span-12">
            <SchoolStrengthStatistics {...filterState} ></SchoolStrengthStatistics>
          </div>

          <div className="tw-col-span-12">
            <StrengthBarView {...filterState}></StrengthBarView>
          </div>

          <div className="tw-col-span-12">
            <StrengthTables></StrengthTables>
          </div>

          {/* <div className="tw-col-span-12">
            <YearWiseStrength {...filterState}></YearWiseStrength>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SuperAdminSchoolStrength;