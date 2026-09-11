
import {
    TextArea,
    TextIconInput,
    TextInputGroup,
} from "../../../../Components/Common";
import { toast } from "react-toastify";
//Custom Hooks
import classNames from "classnames";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { default as ApproveSvg } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { remarksExportDataAct, validateExportDataAct } from "../../../../store/masterdata/masterdataactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import Button from "../../../../Components/Common/Button";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";

const validationSchema = Yup.object().shape({
    step: Yup.string(),
    password: Yup.string().test("passwordValidation", "Password is required.",
        (value: any, schema: any) => {
            const { step } = schema.parent;
            if (step === 'VALIDATE_PASSWORD' && !value) {
                return false;
            }
            return true;
        }),
    remarks: Yup.string().test("remarksValidation", "Remarks is required.",
        (value: any, schema: any) => {
            const { step } = schema.parent;
            if (step === 'REMARKS' && !value) {
                return false;
            }
            return true;
        }),
    dueAmount: Yup.string().test("remarksValidation", "Due amount is required.",
        (value: any, schema: any) => {
            const { step } = schema.parent;
            if (step === 'REMARKS' && !value) {
                return false;
            }
            return true;
        }),
});

interface IExportModal {
    isOpen: boolean;
    toggle: any;
    instituteId: string;
    branchId?: string;
    submitHndlr: any;
    feature: string;
    subFeature?: string;
    remarksText?: string;
    hideEnterRemarks?: boolean,
    showEnterRemarks?: boolean
}

const ExportModalHostelFeeUnpaid: React.FC<IExportModal> = (props) => {
    const initialValues = {
        step: "VALIDATE_PASSWORD",
        password: "",
        remarks: "",
        dueAmount: "",
    }
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const { userMeResp, showApiLoader, remarksExportDataResp, validateExportDataResp, masterDataErrorResp } =
        useAppSelector(({ globalData, login, masterData }) => ({
            showApiLoader: globalData.showApiLoader,
            remarksExportDataResp: masterData.remarksExportDataResp,
            validateExportDataResp: masterData.validateExportDataResp,
            userMeResp: login.userMeResp,
            masterDataErrorResp: masterData.masterDataErrorResp
        }), shallowEqual);

    const exportModalRespRef = useRef({
        prevRemarksExportDataResp: remarksExportDataResp,
        prevValidateExportDataResp: validateExportDataResp,
        prevMasterDataErrorResp: masterDataErrorResp
    })

    useEffect(() => {
        const { prevRemarksExportDataResp, prevValidateExportDataResp, prevMasterDataErrorResp } = exportModalRespRef.current;
        if (validateExportDataResp && prevValidateExportDataResp !== validateExportDataResp) {
            const { valid } = validateExportDataResp;
            if (valid) {
                if (props.hideEnterRemarks) {
                    props.submitHndlr();
                    return;
                }
                exportModalForm.setFieldValue('step', "REMARKS", false);
            } else {
                toast.error("Invalid password.");
            }
        } else if (remarksExportDataResp && prevRemarksExportDataResp !== remarksExportDataResp) {

             if (props.showEnterRemarks) {
                 props.submitHndlr(exportModalForm.values.remarks);
                } else {
                    props.submitHndlr(exportModalForm.values.dueAmount);
                }
        } else if (masterDataErrorResp && prevMasterDataErrorResp !== masterDataErrorResp) {
            const { message } = masterDataErrorResp;
            toast.error(message || 'Something went wrong.');
        }
        exportModalRespRef.current.prevRemarksExportDataResp = remarksExportDataResp;
        exportModalRespRef.current.prevValidateExportDataResp = validateExportDataResp;
        exportModalRespRef.current.prevMasterDataErrorResp = masterDataErrorResp;
    }, [remarksExportDataResp, validateExportDataResp, masterDataErrorResp, props.hideEnterRemarks, props.showEnterRemarks]);

    const exportModalForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (values.step === 'VALIDATE_PASSWORD') {
                const payload = {
                    instituteId: props.instituteId,
                    branchId: props.branchId,
                    feature: props.feature,
                    subFeature: props.subFeature,
                    password: values.password
                }
                dispatch(validateExportDataAct(generateActionPayload("validate_export_password", undefined, payload)));
            }
            if (values.step === 'REMARKS') {
                const payload = {
                    instituteId: props.instituteId,
                    branchId: props.branchId,
                    feature: props.feature,
                    subFeature: props.subFeature,
                    remarks: values.remarks,
                    userId: userMeResp?.id,
                }
                dispatch(remarksExportDataAct(generateActionPayload("export_remarks", undefined, payload)));
            }
        },
    });

    function toggleShowPwdHndlr() {
        setShowPassword(prevState => !prevState);
    }

    function onBlurDueamountHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        exportModalForm.setFieldValue(name, getAmountValueWithDecimal(value));
    }

    const { step } = exportModalForm.values;
    return (
        <form onSubmit={exportModalForm.handleSubmit}>
            <div className="tw-p-4">
  {/* VALIDATE PASSWORD */}
  {step === "VALIDATE_PASSWORD" && (
    <TextIconInput
      iconPositionClassName="right"
      inputType={showPassword ? "text" : "password"}
      name="password"
      labelText="Password"
      autoComplete="new-password"
      value={exportModalForm.values.password}
      onChange={exportModalForm.handleChange}
      onBlur={exportModalForm.handleBlur}
      invalid={
        exportModalForm.touched.password &&
        !!exportModalForm.errors.password
      }
      error={
        exportModalForm.touched.password
          ? exportModalForm.errors.password
          : ""
      }
    >
      <i
        data-id="showOldPwdIcon"
        onClick={toggleShowPwdHndlr}
        className={classNames(
          "tw-cursor-pointer tw-text-gray-400",
          {
            "ri-eye-fill": showPassword,
            "ri-eye-off-fill": !showPassword,
          }
        )}
      ></i>
    </TextIconInput>
  )}

  {/* REMARKS */}
  {step === "REMARKS" && (
    <div>
      <div className="tw-text-center tw-mb-4">
        <div className="tw-flex tw-justify-center tw-mb-2">
          <ApproveSvg fill="#0ab39c" width="70px" height="70px" />
        </div>

        <h4 className="tw-text-base tw-font-semibold tw-mb-0">Are you sure?</h4>
        <p className="tw-text-gray-500 tw-mb-0">
          {props.remarksText}
        </p>
      </div>

      <TextArea
        name="remarks"
        formgroupClassName="tw-mb-0"
        placeHolder="Enter Remarks"
        value={exportModalForm.values.remarks}
        onChange={exportModalForm.handleChange}
        onBlur={exportModalForm.handleBlur}
        invalid={
          exportModalForm.touched.remarks &&
          !!exportModalForm.errors.remarks
        }
        error={
          exportModalForm.touched.remarks
            ? exportModalForm.errors.remarks
            : ""
        }
      />
      <TextInputGroup
                              name="dueAmount"
                              labelText="Download report of student for due amount more than ?"
                              allowedInputRegex="^[0-9]+\.?[0-9]*$"
                              inputGroupStart
                              value={exportModalForm.values.dueAmount}
                              onChange={exportModalForm.handleChange}
                              onBlur={onBlurDueamountHndlr}
                              placeHolder="0.00"
        invalid={
          exportModalForm.touched.dueAmount &&
          !!exportModalForm.errors.dueAmount
        }
        error={
          exportModalForm.touched.dueAmount
            ? exportModalForm.errors.dueAmount
            : ""
        }
                          >
                              <RupeeSvg width="11px" height="11px" fill="#495057" />
                          </TextInputGroup>
    </div>
  )}
</div>

{/* FOOTER */}
<div className="tw-px-4 tw-py-3 tw-flex tw-justify-end tw-gap-2 tw-border-t">
  <Button
    type="button"
    variant="secondary"
    onClick={props.toggle}
  >
    Cancel
  </Button>

  <Button
    type="submit"
    variant="primary"
    onClick={(event: any) => exportModalForm.handleSubmit(event)}
    disabled={showApiLoader}
  >
    {step === "VALIDATE_PASSWORD" ? "Validate" : "Submit"}
  </Button>
</div>

        </form>
    );
};

export default ExportModalHostelFeeUnpaid;
