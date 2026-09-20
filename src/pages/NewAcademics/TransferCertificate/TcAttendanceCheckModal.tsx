import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
import { UserDetails } from "../../../Components/Common";

interface ITcAttendanceCheckModal {
  academicYearName: string;
  studentName?: string;
  studentCode?: string;
  className?: string;
  sectionName?: string;
  previousAcademicYearName?: string;
  attendedHndlr: () => void;
  notAttendedHndlr: () => void;
  closeHndlr: () => void;
}

const TcAttendanceCheckModal: React.FC<ITcAttendanceCheckModal> = (props) => {
  const {
    academicYearName,
    previousAcademicYearName,
    attendedHndlr,
    notAttendedHndlr,
    closeHndlr,
  } = props;

  return (
    <>
      <div className="tw-p-4">
        <div className="tw-text-center tw-mb-3">
          <div className="tw-flex tw-justify-center tw-mb-3">
            <HugeiconsIcon
              icon={HelpCircleIcon}
              className="tw-text-[#405189]"
              size={64}
            />
          </div>
          <h4 className="tw-text-base tw-font-semibold tw-mb-1">
            Has the student attended the school in {academicYearName}?
          </h4>
          <p className="tw-text-gray-500 tw-mb-0">
            Confirm the attendance before the Transfer Certificate is prepared.
          </p>
        </div>

        <div className="tw-bg-[#F4F7FA] tw-rounded tw-p-3 tw-mb-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <span className="tw-text-xs tw-text-gray-500 tw-block tw-mb-1">
                Student
              </span>
              <UserDetails
                displayName={props.studentName || "-"}
                displayId={props.studentCode || "-"}
                showAvatar={false}
              />
            </div>
            <div className="tw-col-span-6 md:tw-col-span-3">
              <span className="tw-text-xs tw-text-gray-500 tw-block tw-mb-1">
                Class
              </span>
              <span className="tw-text-sm">{props.className || "-"}</span>
            </div>
            <div className="tw-col-span-6 md:tw-col-span-3">
              <span className="tw-text-xs tw-text-gray-500 tw-block tw-mb-1">
                Section
              </span>
              <span className="tw-text-sm">{props.sectionName || "-"}</span>
            </div>
          </div>
        </div>

        <p className="tw-text-[#f06548] tw-text-sm tw-mb-0 tw-text-center">
          Choosing <b>No</b> needs password authentication. The {academicYearName}{" "}
          ledgers will be deleted and the TC request will be reverted to
          {" "}{previousAcademicYearName || "the previous academic year"}.
        </p>
      </div>

      <div className="tw-px-4 tw-py-3 tw-flex tw-justify-center tw-gap-2 tw-border-t">
        <Button type="button" variant="secondary" onClick={closeHndlr}>
          Cancel
        </Button>
        <Button type="button" variant="reject" onClick={notAttendedHndlr}>
          No
        </Button>
        <Button type="button" variant="primary" onClick={attendedHndlr}>
          Yes
        </Button>
      </div>
    </>
  );
};

export default TcAttendanceCheckModal;
