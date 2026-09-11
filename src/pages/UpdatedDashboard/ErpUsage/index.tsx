import { useEffect, useState } from "react";
import { SelectInput } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
// import SchoolStrengthStatistics from "./Statistics";
// import StrengthBarView from "./StrengthBarView";
// import StrengthTables from "./StrengthTables";
// import YearWiseStrength from "./YearWiseStrength";
import { shallowEqual } from "react-redux";
import ErpUsageStatistics from "./Statistics";
import UsageBarView from "./UsageBarView";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import UsersByDevices from "./UsersByDevices/UsersByDevices";
import { roleTypeOptions } from "./helper";
import BranchWiseUsage from "./BranchWiseUsage";
import ClassWiseLoginCount from "./ClassWiseLoginCount";
import BranchWiseLoginCount from "./BranchWiseLoginCount";

const inititalValues = {
    branchId: "",
    academicYearId: "",
    startDate: "",
    endDate: "",
    roleType: "PARENT"
}

const SuperAdminErpUsage = () => {

    const dispatch = useAppDispatch();
    const [filterState, setFilterState] = useState(inititalValues);

    const {
        currentInstIdResp: instituteId, currentBranchIdResp, academicYearListResp, brchCurriculumResp,
        branchListResp } =
        useAppSelector(({ appData, branch, instAcademics, branchAcademics }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            branchListResp: branch.branchListResp,
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
        }), shallowEqual)

    useEffect(() => {
        const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    }, [academicYearListResp]);

    const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFilterState((prevState) => ({ ...prevState, [name]: value }));
    }

    const handleDateChange = ({ startDate, endDate }: any) => {
        if (startDate && endDate) {
            setFilterState((prev:any) => ({ ...prev, startDate, endDate }));
        }
    }

    const { data: academicYearList } = academicYearListResp || {};

    return (
        <>
            <div className="super-admin-school-strength-container">
                <div className="tw-grid tw-grid-cols-12 tw-gap-1">
                    <div className="tw-col-span-12">
                        <div className="card !tw-bg-transparent !tw-shadow-none">
                            <div className="card-header !tw-rounded-2xl">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-center">
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <h4 className="card-title !tw-mb-0">
                                            ERP Usage
                                        </h4>
                                    </div>
                                    <div className="tw-col-span-12 lg:tw-col-span-8">
                                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-3">
                                            <div>
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
                                            <div>
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
                                            <div>
                                                <CustomDatePicker
                                                    name="dateRange"
                                                    startDate={filterState.startDate}
                                                    endDate={filterState.endDate}
                                                    onChange={handleDateChange}
                                                    placeholder="Select a Date Range"
                                                    monthsShown={2}
                                                    formgroupClassName="tw-mb-0"
                                                    labelText="Date Range"
                                                    portalId={""}
                                                    floatingLabel
                                                    placement="bottom-start"
                                                ></CustomDatePicker>
                                            </div>
                                            <div>
                                                <SelectInput
                                                    name="roleType"
                                                    value={filterState.roleType}
                                                    onChange={onChangeFilterHndlr}
                                                    menuItems={roleTypeOptions}
                                                    valueKey="id"
                                                    textKey="name"
                                                    formgroupClassName="tw-mb-0"
                                                    labelText="Role Type"
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
                        <ErpUsageStatistics {...filterState} ></ErpUsageStatistics>
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-8 !tw-grid" >
                        <UsageBarView {...filterState}></UsageBarView>
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4 !tw-grid">
                        <UsersByDevices {...filterState} instituteId={instituteId}></UsersByDevices>
                    </div>

                    <div className="tw-col-span-12">
                        <BranchWiseLoginCount {...filterState} ></BranchWiseLoginCount>
                    </div>

                    <div className="tw-col-span-12">
                        <ClassWiseLoginCount {...filterState} ></ClassWiseLoginCount>
                    </div>

                    {/* <div className="tw-col-span-12">
                        <BranchWiseUsage {...filterState}></BranchWiseUsage>
                    </div> */}

                    {/* <div className="tw-col-span-12">
                        <StrengthTables></StrengthTables>
                    </div>

                    <div className="tw-col-span-12">
                        <YearWiseStrength {...filterState}></YearWiseStrength>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default SuperAdminErpUsage;
