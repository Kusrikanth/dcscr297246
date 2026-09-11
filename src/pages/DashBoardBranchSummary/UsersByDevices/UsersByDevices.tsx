import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import UpdatedHorizontalTab from '../../../Components/Common/UpdatedHorizontalTab';
import LoginCounts from './LoginCounts';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getAppUsageStatsAct } from '../../../store/academic/academicRequest/academicrequestactions';
import { Current_Date_YYYYMMDD } from '../../../utility/dateutility';
import { CustomDatePicker } from '../CustomDatePicker';
import { SelectInput } from '../../../Components/Common';
import Button from '../../../Components/Common/Button';

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const initialValues = {
  startDate: "",
  endDate: "",
  academicYearId: "",
  staff: "Teaching",
};

const UsersByDevices = () => {

  const [activeId, setActiveId] = useState<string | null>("parentUsers");
  const dispatch = useAppDispatch();
  const appUsageStatsApiCall = (otherProps?: any) => {
    let payload = {
      startDate: upcomingEvents.values.startDate,
      endDate: upcomingEvents.values.endDate,
      branchId,
      academicYearId: upcomingEvents.values.academicYearId,
      roleType: activeId == "parentUsers" ? "PARENT" : "EMPLOYEE",
      ...otherProps,
    };
    dispatch(getAppUsageStatsAct(generateActionPayload('get_app_usage_stats', undefined, payload)))
  }

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
  } = useAppSelector(
    ({ instAcademics, appData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp
    }),
    shallowEqual
  );

  useEffect(() => {
    if(Array.isArray(academicYearListResp?.data) && academicYearListResp.data.length > 0){
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      upcomingEvents.setValues((prev:any) => ({ ...prev, academicYearId }))
      appUsageStatsApiCall({ academicYearId })
    }
  }, [academicYearListResp, branchId, instituteId]);

  const MenuOptions: Array<IMenuOptions> = [

    {
      id: "parentUsers",
      labelName: "Parent",
      customPadding: "5px 5px 5px 5px",
    },
    {
      id: "staffUsers",
      labelName: "Staff",
      customPadding: "5px 5px 5px 5px",
    }

  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
    appUsageStatsApiCall({ roleType: menuId == "parentUsers" ? "PARENT" : "EMPLOYEE" });
  }

  const upcomingEvents = useFormik({
    initialValues,
    onSubmit: (values) => { },
  })

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      upcomingEvents.setValues((prev) => ({ ...prev, startDate, endDate }));
      appUsageStatsApiCall({ startDate, endDate });
    }
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    upcomingEvents.setValues((prev) => ({ ...prev, academicYearId: value }));
    appUsageStatsApiCall({ [name]: value });
  }

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">

      <div className="tw-py-2 tw-px-4 tw-border-b">
        <div className="tw-flex tw-items-center tw-justify-between">

          <div className="tw-pr-0">
            <h4 className="tw-text-[15px] tw-font-semibold tw-mb-0">
              App Usage Stats
            </h4>
          </div>

          <div className="tw-ml-auto tw-invisible">
            <Button
              id="export-btn"
              variant='info'
            >
              export
            </Button>
          </div>

        </div>
      </div>

      <div className="tw-pt-1 tw-pb-1 tw-px-0">

        <div className="tw-flex tw-flex-wrap tw-border-b tw-p-2 tw-w-full tw-mx-auto">

          <div className="tw-w-full md:tw-w-1/2 tw-pr-2">
            <SelectInput
              name="academicYearId"
              value={upcomingEvents.values.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              floatingLabel
            />
          </div>

          <div className="tw-w-full md:tw-w-1/2 tw-pl-2">
            <CustomDatePicker
              name="dateRange"
              startDate={upcomingEvents.values.startDate}
              endDate={upcomingEvents.values.endDate}
              onChange={handleDateChange}
              placeholder="Select a date range"
              monthsShown={2}
              formgroupClassName="tw-mb-0"
              labelText="Date Range"
              floatingLabel
            />
          </div>

        </div>

        <div className="tw-p-4">

          <div className="tw-flex tw-justify-center horizontal_tab">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="tw-pl-0"
            />
          </div>

          <LoginCounts />

        </div>

      </div>
    </div>

  );
}

export default UsersByDevices;
