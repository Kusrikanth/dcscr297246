import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";

//Common Component
import {
  CustomSelect,
  ConfirmationModal,
  InputCheckbox,
  Button,
} from "../../../../../Components/Common";

//Helper
import {
  getDisplayName,
  getExistingUsernames,
  getLinkedAccounts,
  getUsernameRecordSummary,
  renderUsernameOption,
  renderUsernameValue,
} from "./helper";

interface IMergeUsername {
  isOpen: boolean;
  toggle: (apiCall?: boolean) => void;
  userDetails: any;
  usersList?: Array<any>;
  onUsernameMerged?: (userId: any, targetUsername: string) => void;
}

export default function MergeUsername(props: IMergeUsername) {
  const { userDetails, usersList } = props,
    currentUsername = userDetails?.username || "";
  const [confirmModalState, setConfirmModalState] = useState<boolean>(false);

  const usernameOptions = useMemo(() => {
    return getExistingUsernames(usersList)
      .filter(
        (username: string) =>
          username.trim().toLowerCase() !== currentUsername.trim().toLowerCase()
      )
      .map((username: string) => {
        const linkedAccounts = getLinkedAccounts(username);
        return {
          id: username,
          username,
          accountsLabel: `${username} (${linkedAccounts.length} ${
            linkedAccounts.length === 1 ? "account" : "accounts"
          })`,
        };
      });
  }, [usersList, currentUsername]);

  const mergeUsernameForm = useFormik<any>({
    enableReinitialize: false,
    initialValues: { targetUsername: "", acknowledged: false },
    validate: (values: any) => {
      const errors: any = {};
      if (!values.targetUsername) {
        errors.targetUsername = "Select the existing username to merge with.";
      } else if (
        values.targetUsername.trim().toLowerCase() === currentUsername.trim().toLowerCase()
      ) {
        errors.targetUsername = "Current username and the selected username cannot be same.";
      }
      if (!values.acknowledged) {
        errors.acknowledged = "Confirm that the records can be moved to the selected username.";
      }
      return errors;
    },
    onSubmit: () => {
      setConfirmModalState(true);
    },
  });

  useEffect(() => {
    if (props.isOpen) {
      mergeUsernameForm.resetForm();
      setConfirmModalState(false);
    }
  }, [props.isOpen]);

  function selectUsernameHndlr(selectedValue: any, config: any) {
    const { name } = config || {};
    mergeUsernameForm.setFieldValue(name, selectedValue || "");
  }

  function confirmMergeHndlr() {
    const { targetUsername } = mergeUsernameForm.values;
    setConfirmModalState(false);
    //TODO: dispatch the merge username action once the API is available.
    if (typeof props.onUsernameMerged === "function") {
      props.onUsernameMerged(userDetails?.id, targetUsername);
    }
    toast.success(`${currentUsername} merged with ${targetUsername} successfully.`);
    props.toggle(false);
  }

  const { values, touched, errors } = mergeUsernameForm,
    targetUsernameError =
      touched.targetUsername && errors.targetUsername ? String(errors.targetUsername) : "",
    acknowledgedError =
      touched.acknowledged && errors.acknowledged ? String(errors.acknowledged) : "",
    recordSummary = getUsernameRecordSummary(currentUsername);
  return (
    <>
      <form onSubmit={mergeUsernameForm.handleSubmit} className="tw-p-5">
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
        <CustomSelect
          name="targetUsername"
          idKey="id"
          searchKey="username"
          labelText="Merge With Existing Username"
          labelClass="required"
          containerClassName="tw-mb-3"
          defaultSelect="Select existing username"
          value={values.targetUsername}
          options={usernameOptions}
          renderValue={renderUsernameValue}
          renderOptions={renderUsernameOption}
          onChange={selectUsernameHndlr}
          invalid={targetUsernameError ? true : false}
          error={targetUsernameError}
        />
        {values.targetUsername && (
          <div className="tw-border tw-border-dashed tw-rounded-md tw-p-3 tw-mb-3">
            <p className="tw-text-sm tw-font-medium tw-mb-2">
              Records moving from {currentUsername} to {values.targetUsername}
            </p>
            <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-3">
              <div>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-0">Fee Records</p>
                <p className="tw-text-sm tw-font-medium tw-mb-0">{recordSummary.feeRecords}</p>
              </div>
              <div>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-0">Attendance</p>
                <p className="tw-text-sm tw-font-medium tw-mb-0">
                  {recordSummary.attendanceRecords}
                </p>
              </div>
              <div>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-0">Documents</p>
                <p className="tw-text-sm tw-font-medium tw-mb-0">{recordSummary.documents}</p>
              </div>
              <div>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-0">Communications</p>
                <p className="tw-text-sm tw-font-medium tw-mb-0">
                  {recordSummary.communications}
                </p>
              </div>
            </div>
          </div>
        )}
        <InputCheckbox
          name="acknowledged"
          value={values.acknowledged}
          onChange={mergeUsernameForm.handleChange}
          labelName={`Move all the records of ${currentUsername || "this username"} to the selected username. ${currentUsername || "This username"} will no longer be available for login.`}
        />
        {acknowledgedError && (
          <p className="tw-text-[#f06548] tw-text-xs tw-mt-1 tw-mb-0">{acknowledgedError}</p>
        )}
        <div className="tw-flex tw-items-center tw-gap-2 tw-justify-end tw-mt-4">
          <Button type="button" variant="secondary" onClick={() => props.toggle(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Merge
          </Button>
        </div>
      </form>
      <ConfirmationModal
        id="merge-username-confirm-modal"
        isOpen={confirmModalState}
        iconType="reject"
        confirmTitle="Merge Username?"
        confirmMessage={
          <>
            All the records of <b>{currentUsername}</b> will be merged with{" "}
            <b>{values.targetUsername}</b>.
          </>
        }
        noteMessage="This action cannot be reverted from the UI."
        cancelHndlr={() => setConfirmModalState(false)}
        confirmHndlr={confirmMergeHndlr}
        confirmBtnText="Merge"
      />
    </>
  );
}
