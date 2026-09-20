import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { toast } from "react-toastify";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { TextIconInput, Switch } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";

//Interface & Types
import { IEmailIntegration, IUpdateEmailPasswordPayload } from "./emailintegrationtypes";

/** Saved passwords are pre-filled so they can be reviewed and corrected, not re-typed blind. */
function getInitialValues(editData?: IEmailIntegration) {
    return {
        password: editData?.password || "",
        actualPassword: editData?.actualPassword || "",
        admissionPassword: editData?.admissionPassword || "",
        isActive: editData ? editData.rs === "A" : true,
    }
}

const validationSchema = Yup.object().shape({
    password: Yup.string().trim(),
    actualPassword: Yup.string().trim(),
    admissionPassword: Yup.string().trim(),
});

interface IUpdateEmailPasswordModalProps {
    isOpen: boolean,
    toggle: (refresh?: boolean) => void,
    editModalData?: IEmailIntegration,
    onSubmitHndlr: (payload: IUpdateEmailPasswordPayload) => void,
}

const UpdateEmailPasswordModal: React.FC<IUpdateEmailPasswordModalProps> = (props) => {
    const { editModalData } = props;
    const [showPasswordState, setShowPasswordState] = useState<Record<string, boolean>>({});

    const updatePasswordForm = useFormik({
        enableReinitialize: true,
        initialValues: getInitialValues(editModalData),
        validationSchema,
        onSubmit: (values) => {
            const password = values.password.trim(),
                actualPassword = values.actualPassword.trim(),
                admissionPassword = values.admissionPassword.trim(),
                nothingChanged = editModalData
                    && password === (editModalData.password || "")
                    && actualPassword === (editModalData.actualPassword || "")
                    && admissionPassword === (editModalData.admissionPassword || "")
                    && (editModalData.rs === "A") === values.isActive;

            if (nothingChanged) {
                toast.error("Change a password or the status to update.");
                return;
            }

            props.onSubmitHndlr({
                id: editModalData?.id as number,
                password,
                actualPassword,
                admissionPassword,
                rs: values.isActive ? "A" : "I",
            });
        },
    });

    useEffect(() => {
        if (!props.isOpen) {
            setShowPasswordState({});
            updatePasswordForm.resetForm();
        }
    }, [props.isOpen]);

    function toggleShowPasswordHndlr(event: React.MouseEvent<HTMLElement>) {
        const fieldName = event.currentTarget.getAttribute("data-id") as string;
        setShowPasswordState(prevState => ({ ...prevState, [fieldName]: !prevState[fieldName] }));
    }

    function errorFor(field: keyof typeof updatePasswordForm.values) {
        return (updatePasswordForm.touched[field] && updatePasswordForm.errors[field])
            ? updatePasswordForm.errors[field] as string
            : "";
    }

    function renderPasswordInput(name: keyof typeof updatePasswordForm.values, labelText: string, placeHolder: string) {
        const error = errorFor(name);
        return (
            <TextIconInput
                iconPositionClassName="right"
                inputType={showPasswordState[name] ? "text" : "password"}
                name={name}
                labelText={labelText}
                placeHolder={placeHolder}
                autoComplete="new-password"
                value={updatePasswordForm.values[name] as string}
                onChange={updatePasswordForm.handleChange}
                onBlur={updatePasswordForm.handleBlur}
                invalid={!!error}
                error={error}
            >
                <i
                    data-id={name}
                    onClick={toggleShowPasswordHndlr}
                    className={classnames("tw-cursor-pointer tw-text-gray-400", {
                        "ri-eye-fill": showPasswordState[name],
                        "ri-eye-off-fill": !showPasswordState[name],
                    })}
                ></i>
            </TextIconInput>
        )
    }

    return (
        <div className="tw-p-5">

            {/* Read-only mail server details, so it is clear which account is being changed. */}
            <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4 tw-bg-gray-50 tw-rounded-md tw-p-3 tw-mb-4">
                <div>
                    <div className="tw-text-xs tw-text-gray-500">Department</div>
                    <div className="tw-text-sm tw-font-medium">{editModalData?.department || "--"}</div>
                </div>
                <div>
                    <div className="tw-text-xs tw-text-gray-500">SMTP Host</div>
                    <div className="tw-text-sm tw-font-medium">{editModalData?.host || "--"}</div>
                </div>
                <div>
                    <div className="tw-text-xs tw-text-gray-500">Port</div>
                    <div className="tw-text-sm tw-font-medium">{editModalData?.port || "--"}</div>
                </div>
                <div>
                    <div className="tw-text-xs tw-text-gray-500">Status</div>
                    <div className="tw-text-sm tw-font-medium">{editModalData?.rs === "A" ? "Active" : "Inactive"}</div>
                </div>
            </div>

            <div className="tw-mb-4">
                <h6 className="tw-text-sm tw-font-semibold tw-mb-1">Mail Account</h6>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-3 tw-break-all">
                    {editModalData?.fromAddress || "--"}
                </p>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div>{renderPasswordInput("password", "Encrypted Password", "Enter encrypted password")}</div>
                    <div>{renderPasswordInput("actualPassword", "Actual Password", "Enter actual password")}</div>
                </div>
            </div>

            <div className="tw-mb-4">
                <h6 className="tw-text-sm tw-font-semibold tw-mb-1">Admission Mail Account</h6>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-3 tw-break-all">
                    {editModalData?.admissionFromAddress || "--"}
                </p>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div>{renderPasswordInput("admissionPassword", "Admission Password", "Enter admission password")}</div>
                </div>
            </div>

            <div className="tw-mb-2">
                <label htmlFor="isActive" className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                    Integration Status
                </label>
                <Switch
                    attributeId="isActive"
                    labelName={updatePasswordForm.values.isActive ? "Active" : "Inactive"}
                    checked={updatePasswordForm.values.isActive}
                    onChangeHndlr={updatePasswordForm.handleChange}
                    className="tw-mb-0 tw-py-2"
                />
            </div>

            <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                Saved passwords are shown above - use the eye icon to reveal one. For Gmail accounts the
                encrypted password is the 16 character app password.
            </p>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-6 tw-mb-1">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => props.toggle()}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => updatePasswordForm.handleSubmit(event)}
                >
                    Update
                </Button>
            </div>

        </div>
    )
}

export default UpdateEmailPasswordModal;
