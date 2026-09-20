import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

//Common Component
import {
  CustomSelect,
  ConfirmationModal,
  TextInput,
  Button,
} from "../../../../../Components/Common";

//Helper
import {
  buildSplitUsernameSuggestion,
  getExistingUsernames,
  getLinkedAccounts,
  getSharedUsernameOptions,
  ILinkedAccount,
  renderUsernameOption,
  renderUsernameValue,
  validateUsername,
} from "./helper";

interface ISplitUsername {
  isOpen: boolean;
  toggle: (apiCall?: boolean) => void;
  userDetails: any;
  usersList?: Array<any>;
  onUsernameSplit?: (sharedUsername: string, accounts: Array<ILinkedAccount>) => void;
}

export default function SplitUsername(props: ISplitUsername) {
  const { userDetails, usersList } = props;
  const [sharedUsernameState, setSharedUsernameState] = useState<string>("");
  const [accountsState, setAccountsState] = useState<Array<ILinkedAccount>>([]);
  const [errorsState, setErrorsState] = useState<{ [accountId: string]: string }>({});
  const [confirmModalState, setConfirmModalState] = useState<boolean>(false);

  const usernameOptions = useMemo(() => getSharedUsernameOptions(usersList), [usersList]);

  /** Existing usernames, minus the one being split - it is released by the split. */
  const existingUsernames = useMemo(() => {
    return getExistingUsernames(usersList).filter(
      (username: string) =>
        username.trim().toLowerCase() !== sharedUsernameState.trim().toLowerCase()
    );
  }, [usersList, sharedUsernameState]);

  useEffect(() => {
    if (props.isOpen) {
      const selectedUsername = userDetails?.username || "";
      setConfirmModalState(false);
      setErrorsState({});
      setSharedUsernameState(selectedUsername);
      setAccountsState(buildAccountsForUsername(selectedUsername));
    }
  }, [props.isOpen, userDetails]);

  function buildAccountsForUsername(username: string) {
    const linkedAccounts = getLinkedAccounts(username, userDetails),
      reservedUsernames = getExistingUsernames(usersList).filter(
        (item: string) => item.trim().toLowerCase() !== (username || "").trim().toLowerCase()
      ),
      suggestedUsernames: Array<string> = [];
    return linkedAccounts.map((account: ILinkedAccount, index: number) => {
      const suggestion = buildSplitUsernameSuggestion(
        username,
        index,
        reservedUsernames,
        suggestedUsernames
      );
      suggestedUsernames.push(suggestion);
      return { ...account, newUsername: suggestion };
    });
  }

  function selectSharedUsernameHndlr(selectedValue: any) {
    const username = selectedValue || "";
    setSharedUsernameState(username);
    setAccountsState(buildAccountsForUsername(username));
    setErrorsState({});
  }

  function usernameChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      accountId = name.replace("newUsername-", "");
    setAccountsState((prevState: Array<ILinkedAccount>) =>
      prevState.map((account: ILinkedAccount) =>
        account.id === accountId ? { ...account, newUsername: value } : account
      )
    );
    setErrorsState((prevState: any) => ({ ...prevState, [accountId]: "" }));
  }

  function validateAccounts() {
    const errors: { [accountId: string]: string } = {},
      enteredUsernames: Array<string> = [];
    accountsState.forEach((account: ILinkedAccount) => {
      const errorMessage = validateUsername(account.newUsername || "", {
        existingUsernames,
        takenUsernames: enteredUsernames,
        fieldLabel: "Username",
      });
      if (errorMessage) {
        errors[account.id] = errorMessage;
      }
      enteredUsernames.push((account.newUsername || "").trim());
    });
    setErrorsState(errors);
    return Object.keys(errors).length === 0;
  }

  function splitHndlr() {
    if (!sharedUsernameState) {
      toast.error("Search and select the username to split.");
      return;
    }
    if (accountsState.length < 2) {
      toast.error(`${sharedUsernameState} is not shared by multiple accounts. Nothing to split.`);
      return;
    }
    if (validateAccounts()) {
      setConfirmModalState(true);
    }
  }

  function confirmSplitHndlr() {
    setConfirmModalState(false);
    //TODO: dispatch the split username action once the API is available.
    if (typeof props.onUsernameSplit === "function") {
      props.onUsernameSplit(sharedUsernameState, accountsState);
    }
    toast.success(
      `${sharedUsernameState} split into ${accountsState.length} separate user accounts successfully.`
    );
    props.toggle(false);
  }

  const isSplitAllowed = sharedUsernameState ? accountsState.length > 1 : false;
  return (
    <>
      <div className="tw-p-5">
        <CustomSelect
          name="sharedUsername"
          idKey="id"
          searchKey="username"
          labelText="Search Username"
          labelClass="required"
          containerClassName="tw-mb-3"
          defaultSelect="Search and select the username"
          value={sharedUsernameState}
          options={usernameOptions}
          renderValue={renderUsernameValue}
          renderOptions={renderUsernameOption}
          onChange={selectSharedUsernameHndlr}
        />
        {sharedUsernameState && (
          <div className="tw-bg-gray-50 tw-rounded-md tw-p-3 tw-mb-3">
            <span className="tw-text-sm tw-text-gray-500">
              Accounts associated with <b className="tw-text-gray-700">{sharedUsernameState}</b>:
            </span>
            <span className="tw-text-sm tw-font-medium tw-ml-1">{accountsState.length}</span>
          </div>
        )}
        {sharedUsernameState && !isSplitAllowed && (
          <p className="tw-text-[#f06548] tw-text-sm">
            This username is mapped to a single account. Only usernames shared by multiple
            siblings/accounts can be split.
          </p>
        )}
        {isSplitAllowed && (
          <>
            <p className="tw-text-sm tw-mb-2">
              Each account listed below gets its own username after the split. Existing data of
              every account stays mapped to its new username.
            </p>
            <div className="tw-overflow-x-auto tw-mb-3">
              <table className="tw-w-full tw-text-sm tw-border tw-border-gray-200">
                <thead className="tw-bg-gray-100 tw-text-gray-600">
                  <tr>
                    <th className="tw-px-3 tw-py-2 tw-text-left">Account</th>
                    <th className="tw-px-3 tw-py-2 tw-text-left">Admission No</th>
                    <th className="tw-px-3 tw-py-2 tw-text-left">Class</th>
                    <th className="tw-px-3 tw-py-2 tw-text-left">New Username</th>
                  </tr>
                </thead>
                <tbody>
                  {accountsState.map((account: ILinkedAccount) => (
                    <tr key={account.id} className="tw-border-t tw-border-gray-200">
                      <td className="tw-px-3 tw-py-2 tw-align-top">
                        <p className="tw-mb-0 tw-font-medium">{account.name}</p>
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">{account.relation}</p>
                      </td>
                      <td className="tw-px-3 tw-py-2 tw-align-top">{account.admissionNumber}</td>
                      <td className="tw-px-3 tw-py-2 tw-align-top">{account.className}</td>
                      <td className="tw-px-3 tw-py-2 tw-align-top" style={{ minWidth: "220px" }}>
                        <TextInput
                          name={`newUsername-${account.id}`}
                          value={account.newUsername}
                          onChange={usernameChangeHndlr}
                          formgroupClassName="tw-mb-0"
                          placeHolder="Enter username"
                          maxLength={45}
                          invalid={errorsState[account.id] ? true : false}
                          error={errorsState[account.id] || ""}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <div className="tw-flex tw-items-center tw-gap-2 tw-justify-end tw-mt-4">
          <Button type="button" variant="secondary" onClick={() => props.toggle(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={splitHndlr}
            disabled={!isSplitAllowed}
          >
            Split
          </Button>
        </div>
      </div>
      <ConfirmationModal
        id="split-username-confirm-modal"
        isOpen={confirmModalState}
        iconType="reject"
        confirmTitle="Split Username?"
        confirmMessage={
          <>
            <b>{sharedUsernameState}</b> will be split into {accountsState.length} separate user
            accounts: <b>{accountsState.map((item) => (item.newUsername || "").trim()).join(", ")}</b>.
          </>
        }
        noteMessage="Existing data of every account stays mapped to its new username."
        cancelHndlr={() => setConfirmModalState(false)}
        confirmHndlr={confirmSplitHndlr}
        confirmBtnText="Split"
      />
    </>
  );
}
