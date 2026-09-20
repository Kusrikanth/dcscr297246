import { useState } from "react";
import classNames from "classnames";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowTurnBackwardIcon,
  Delete02Icon,
  LockPasswordIcon,
  Task01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { TextArea, TextIconInput } from "../../../Components/Common";
import Button from "../../../Components/Common/Button";
import { SAMPLE_TC_REVERT_PASSWORD, USE_SAMPLE_TC_REVERT_AUTH } from "./helper";

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password is required."),
  remarks: Yup.string().required("Remarks is required."),
});

export interface ITcRevertSubmitValues {
  remarks: string;
}

interface ITcRevertAuthModal {
  studentName?: string;
  studentCode?: string;
  academicYearName: string;
  previousAcademicYearName?: string;
  ledgerCount: number;
  isDisabled?: boolean;
  submitHndlr: (values: ITcRevertSubmitValues) => void;
  closeHndlr: () => void;
}

const TcRevertAuthModal: React.FC<ITcRevertAuthModal> = (props) => {
  const {
    academicYearName,
    previousAcademicYearName,
    ledgerCount,
    submitHndlr,
    closeHndlr,
  } = props;
  const [showPassword, setShowPassword] = useState(false);

  const revertAuthForm = useFormik({
    initialValues: {
      password: "",
      remarks: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // TODO: replace with the password validation API once the revert TC endpoint is available.
      if (USE_SAMPLE_TC_REVERT_AUTH && values.password !== SAMPLE_TC_REVERT_PASSWORD) {
        toast.error("Invalid password.");
        return;
      }
      submitHndlr({ remarks: values.remarks });
    },
  });

  function toggleShowPwdHndlr() {
    setShowPassword((prevState) => !prevState);
  }

  const revertActions = [
    {
      id: "deleteLedgers",
      icon: Delete02Icon,
      iconClassName: "tw-text-[#f06548]",
      text: `Delete the student's ${academicYearName} ledgers${ledgerCount ? ` (${ledgerCount})` : ""}.`,
    },
    {
      id: "revertTc",
      icon: ArrowTurnBackwardIcon,
      iconClassName: "tw-text-[#405189]",
      text: `Revert the TC record to ${previousAcademicYearName || "the previous academic year"}.`,
    },
    {
      id: "feeApprovals",
      icon: Task01Icon,
      iconClassName: "tw-text-[#0ab39c]",
      text: `Show the reverted TC record in Fee Approvals under ${previousAcademicYearName || "the previous academic year"}.`,
    },
  ];

  return (
    <form onSubmit={revertAuthForm.handleSubmit}>
      <div className="tw-p-4">
        <div className="tw-text-center tw-mb-3">
          <div className="tw-flex tw-justify-center tw-mb-3">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              className="tw-text-[#f06548]"
              size={56}
            />
          </div>
          <h4 className="tw-text-base tw-font-semibold tw-mb-1">
            Password authentication required
          </h4>
          <p className="tw-text-gray-500 tw-mb-0">
            {props.studentName || "The student"}
            {props.studentCode ? ` (${props.studentCode})` : ""} did not attend
            the school in {academicYearName}.
          </p>
        </div>

        <div className="tw-bg-[#F4F7FA] tw-rounded tw-p-3 tw-mb-3">
          <span className="tw-text-xs tw-text-gray-500 tw-block tw-mb-2">
            On successful authentication
          </span>
          <ul className="tw-list-none tw-p-0 tw-m-0 tw-flex tw-flex-col tw-gap-2">
            {revertActions.map((action) => (
              <li key={action.id} className="tw-flex tw-items-start tw-gap-2">
                <HugeiconsIcon
                  icon={action.icon}
                  className={classNames("tw-shrink-0 tw-mt-0.5", action.iconClassName)}
                  size={16}
                />
                <span className="tw-text-sm">{action.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <TextIconInput
          iconPositionClassName="right"
          inputType={showPassword ? "text" : "password"}
          name="password"
          labelText="Password"
          autoComplete="new-password"
          value={revertAuthForm.values.password}
          onChange={revertAuthForm.handleChange}
          onBlur={revertAuthForm.handleBlur}
          invalid={
            revertAuthForm.touched.password && !!revertAuthForm.errors.password
          }
          error={
            revertAuthForm.touched.password ? revertAuthForm.errors.password : ""
          }
        >
          <i
            data-id="showRevertPwdIcon"
            onClick={toggleShowPwdHndlr}
            className={classNames("tw-cursor-pointer tw-text-gray-400", {
              "ri-eye-fill": showPassword,
              "ri-eye-off-fill": !showPassword,
            })}
          ></i>
        </TextIconInput>

        <TextArea
          name="remarks"
          formgroupClassName="tw-mb-0"
          labelText="Remarks"
          placeHolder="Enter the reason for reverting this TC request"
          value={revertAuthForm.values.remarks}
          onChange={revertAuthForm.handleChange}
          onBlur={revertAuthForm.handleBlur}
          invalid={
            revertAuthForm.touched.remarks && !!revertAuthForm.errors.remarks
          }
          error={
            revertAuthForm.touched.remarks ? revertAuthForm.errors.remarks : ""
          }
        />
      </div>

      <div className="tw-px-4 tw-py-3 tw-flex tw-justify-end tw-gap-2 tw-border-t">
        <Button type="button" variant="secondary" onClick={closeHndlr}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="reject"
          onClick={(event: any) => revertAuthForm.handleSubmit(event)}
          disabled={props.isDisabled}
        >
          Authenticate &amp; Revert
        </Button>
      </div>
    </form>
  );
};

export default TcRevertAuthModal;
