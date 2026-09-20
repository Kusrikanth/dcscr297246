import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";

//Common Component
import { TextInput, ConfirmationModal, Button } from "../../../../../Components/Common";

//Helper
import {
  getDisplayName,
  getExistingUsernames,
  validateUsername,
} from "./helper";

interface IRenameUsername {
  isOpen: boolean;
  toggle: (apiCall?: boolean) => void;
  userDetails: any;
  usersList?: Array<any>;
  onUsernameRenamed?: (userId: any, newUsername: string) => void;
}

export default function RenameUsername(props: IRenameUsername) {
  const { userDetails, usersList } = props,
    currentUsername = userDetails?.username || "";
  const [confirmModalState, setConfirmModalState] = useState<boolean>(false);

  const renameUsernameForm = useFormik({
    enableReinitialize: false,
    initialValues: { newUsername: "" },
    validate: (values: any) => {
      const errors: any = {},
        existingUsernames = getExistingUsernames(usersList),
        errorMessage = validateUsername(values.newUsername, {
          currentUsername,
          existingUsernames,
          fieldLabel: "New username",
        });
      if (errorMessage) {
        errors.newUsername = errorMessage;
      }
      return errors;
    },
    onSubmit: () => {
      setConfirmModalState(true);
    },
  });

  useEffect(() => {
    if (props.isOpen) {
      renameUsernameForm.resetForm();
      setConfirmModalState(false);
    }
  }, [props.isOpen]);

  function confirmRenameHndlr() {
    const newUsername = (renameUsernameForm.values.newUsername || "").trim();
    setConfirmModalState(false);
    //TODO: dispatch the rename username action once the API is available.
    if (typeof props.onUsernameRenamed === "function") {
      props.onUsernameRenamed(userDetails?.id, newUsername);
    }
    toast.success(`Username updated from ${currentUsername} to ${newUsername} successfully.`);
    props.toggle(false);
  }

  const { touched, errors, values } = renameUsernameForm,
    newUsernameError = touched.newUsername && errors.newUsername ? errors.newUsername : "";
  return (
    <>
      <form onSubmit={renameUsernameForm.handleSubmit} className="tw-p-5">
        <div className="tw-bg-gray-50 tw-rounded-md tw-p-3 tw-mb-4">
          <div className="tw-flex tw-items-center tw-justify-between">
            <span className="tw-text-sm tw-text-gray-500">User</span>
            <span className="tw-text-sm tw-font-medium">{getDisplayName(userDetails) || "-"}</span>
          </div>
          <div className="tw-flex tw-items-center tw-justify-between tw-mt-2">
            <span className="tw-text-sm tw-text-gray-500">Current Username</span>
            <span className="tw-text-sm tw-font-medium">{currentUsername || "-"}</span>
          </div>
        </div>
        <TextInput
          name="newUsername"
          labelText="New Username"
          labelClass="required"
          placeHolder="Enter new username"
          value={values.newUsername}
          onChange={renameUsernameForm.handleChange}
          onBlur={renameUsernameForm.handleBlur}
          helperText="4-45 characters. Letters, numbers, dot, hyphen and underscore are allowed."
          invalid={newUsernameError ? true : false}
          error={newUsernameError}
          maxLength={45}
        />
        <div className="tw-flex tw-items-center tw-gap-2 tw-justify-end tw-mt-4">
          <Button type="button" variant="secondary" onClick={() => props.toggle(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
      <ConfirmationModal
        id="rename-username-confirm-modal"
        isOpen={confirmModalState}
        iconType="approve"
        confirmTitle="Rename Username?"
        confirmMessage={
          <>
            The username <b>{currentUsername}</b> will be changed to{" "}
            <b>{(values.newUsername || "").trim()}</b>.
          </>
        }
        noteMessage="The user has to login with the new username from the next login."
        cancelHndlr={() => setConfirmModalState(false)}
        confirmHndlr={confirmRenameHndlr}
        confirmBtnText="Rename"
        btnClassName="tw-bg-[#1bb3a6] hover:tw-bg-[#099885]"
      />
    </>
  );
}
