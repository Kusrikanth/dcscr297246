import { useMemo } from "react";
import fireworks from "../../../assets/imagesdps/updatedDashboard/fireworks.png";
import { UserDetails } from "../../../Components/Common";
import { transformAnniversaryData } from "./helper";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const UpcomingAnniversaries = () => {

  const {
    getBirthdayAnniversaryResp,
  } = useAppSelector(
    ({ academicRequest }) => ({
      getBirthdayAnniversaryResp: academicRequest.getBirthdayAnniversaryResp,
    }),
    shallowEqual
  );

  const staffAnniversaries = useMemo(() => {return transformAnniversaryData(getBirthdayAnniversaryResp?.employeeAnniversary?.content)}, [getBirthdayAnniversaryResp]);
  
  return (
    <div className="custom_card_wrap">

      <div className="tw-pt-0 tw-p-4">

        <div className="tw-flex tw-flex-col tw-gap-3">

          {staffAnniversaries.map((employee: any) => (

            <div
              key={employee.employeeName}
              className="tw-flex tw-items-center tw-justify-between tw-py-2 tw-px-2 md:tw-px-3 tw-shadow tw-rounded-md "
              style={{ borderLeft: "4px solid #d1f7c4" }}
            >

              <div className="tw-flex tw-items-center">
                <UserDetails
                  showAvatar
                  imageUrl={employee.imageUrl}
                  displayName={employee.employeeName}
                  displayId={employee.schoolDetails.role}
                  size="xs"
                  displayNameClass="tw-font-bold"
                  mainDivClass="tw-overflow-hidden"
                />
              </div>

              <div className="tw-flex tw-items-end tw-w-[30%]">

                <div className="tw-mr-3">
                  <img
                    src={fireworks}
                    alt="img"
                    className="tw-w-7 tw-h-7"
                  />
                </div>

                <p className="tw-mb-0 tw-text-gray-500">
                  {employee.period && employee.period}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
};

export default UpcomingAnniversaries;
