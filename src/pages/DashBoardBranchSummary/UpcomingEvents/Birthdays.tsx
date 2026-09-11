import balloons from "../../../assets/imagesdps/updatedDashboard/balloons.png";
import classnames from "classnames";
import { SelectInput, UserDetails } from "../../../Components/Common";
import {  formatStudentBirthdays, selectData1, transformEmployeeData } from "./helper";
import {  useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const Birthdays = ({ filterState, setFilterState }:any) => {
  const {
    getBirthdayAnniversaryResp,
    getStudentBirthdayResp,
} = useAppSelector(
    ({ academicRequest }) => ({
        getBirthdayAnniversaryResp: academicRequest.getBirthdayAnniversaryResp,
        getStudentBirthdayResp: academicRequest.getStudentBirthdayResp,
    }),
    shallowEqual
);
  const handleChange = (e: any) => {
    const { name, value } = e.target;    
    setFilterState({ [name]: value });
  };
const staffBirthDays = transformEmployeeData(getBirthdayAnniversaryResp?.employeeBirthday?.content)
const studentBirthdays = formatStudentBirthdays(getStudentBirthdayResp?.studentBirthday?.content);
  
const activeUserType = filterState.user;

  return (
    <div className="custom_card_wrap">

      <div className="tw-pt-0 tw-p-4">

        <div className="tw-flex tw-flex-wrap tw-items-center tw-mb-4">

          <div className="tw-w-1/2">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
              {`${activeUserType} Birthdays List`}
            </h4>
          </div>

          <div className="tw-w-1/2 tw-ml-auto">
            <SelectInput
              name="user"
              value={filterState.user}
              onChange={handleChange}
              menuItems={selectData1}
              valueKey="userType"
              textKey="userType"
              formgroupClassName="tw-mb-0"
              labelText="User Type"
              floatingLabel
            />
          </div>
        </div>

        <div className="tw-flex tw-flex-col tw-gap-3 employee-upcoming-birthday-container">

          {activeUserType === "Student"
            ? studentBirthdays?.map((employee: any) => (
              <div
                key={`${employee.employeeName}-${employee.studentCode}`}
                className="tw-shadow tw-rounded-md tw-py-2 tw-px-2"
                style={{ borderLeft: `4px solid ${employee.borderColor}` }}
              >
                <div className="tw-flex tw-items-center tw-justify-between">

                  <div className="tw-w-2/3 tw-flex tw-items-center">
                    <UserDetails
                      showAvatar
                      imageUrl={employee.imageUrl}
                      displayName={employee.employeeName}
                      displayId={employee.schoolDetails.section}
                      size="xs"
                      displayNameClass="tw-font-bold tw-truncate"
                      mainDivClass="tw-overflow-hidden"
                    />
                  </div>

                  <div className="tw-w-1/3 tw-flex tw-items-center tw-justify-center">

                    <div className="tw-mr-3">
                      <img
                        src={balloons}
                        alt="img"
                        className="tw-w-7 tw-h-7"
                      />
                    </div>
                    <p className="tw-text-gray-500 tw-mb-0">
                      {employee.date && employee.status === "Today"
                        ? `${employee.date} Today`
                        : `${employee.date} in ${employee.days} days`}
                    </p>
                  </div>

                </div>
              </div>
            ))
            : staffBirthDays?.map((employee: any) => (
              <div
                key={`${employee.employeeName}-${employee.schoolDetails.staffId}`}
                className="tw-shadow tw-rounded-md tw-py-2 tw-px-2 "
                style={{ borderLeft: `4px solid ${employee.borderColor}` }}
              >
                <div className="tw-flex tw-items-center tw-justify-between">

                  <div className="tw-w-2/3 tw-flex tw-items-center">
                    <UserDetails
                      showAvatar
                      imageUrl={employee.imageUrl}
                      displayName={employee.employeeName}
                      displayId={employee.schoolDetails.staffId}
                      size="xs"
                      displayNameClass="tw-font-bold"
                      mainDivClass="tw-overflow-hidden"
                    />
                  </div>

                  <div className="tw-w-1/3 tw-flex tw-items-center tw-justify-center">

                    <div className="tw-mr-3">
                      <img
                        src={balloons}
                        alt="img"
                        className="tw-w-7 tw-h-7"
                      />
                    </div>

                    <p className="tw-text-gray-500 tw-mb-0">
                      {employee.date && employee.status === "Today"
                        ? `${employee.date} Today`
                        : `${employee.date} in ${employee.days} days`}
                    </p>

                  </div>

                </div>
              </div>
            ))}

        </div>
      </div>
    </div>
  );
};

export default Birthdays;
