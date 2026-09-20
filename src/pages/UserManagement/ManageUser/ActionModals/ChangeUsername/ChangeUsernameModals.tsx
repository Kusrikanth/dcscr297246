import React from "react";

//Common Component
import { ModalContainerUpdated } from "../../../../../Components/Common";

//Change Username Modals
import RenameUsername from "./RenameUsername";
import MergeUsername from "./MergeUsername";
import SplitUsername from "./SplitUsername";

//Helper
import { getDisplayName, ILinkedAccount } from "./helper";

export type ChangeUsernameMode = "rename" | "merge" | "split" | "";

const modalTitles: { [mode: string]: string } = {
  rename: "Rename Username",
  merge: "Merge With Existing Username",
  split: "Split The Username",
};

interface IChangeUsernameModals {
  isOpen: boolean;
  mode: ChangeUsernameMode;
  toggle: (apiCall?: boolean) => void;
  userDetails: any;
  usersList?: Array<any>;
  onUsernameRenamed?: (userId: any, newUsername: string) => void;
  onUsernameMerged?: (userId: any, targetUsername: string) => void;
  onUsernameSplit?: (sharedUsername: string, accounts: Array<ILinkedAccount>) => void;
}

export default function ChangeUsernameModals(props: IChangeUsernameModals) {
  const { isOpen, mode, toggle, userDetails, usersList } = props,
    displayName = getDisplayName(userDetails);
  return (
    <ModalContainerUpdated
      id={`change-username-${mode || "modal"}`}
      isOpen={isOpen && !!mode}
      toggle={toggle}
      modalTitle={modalTitles[mode] || "Change Username"}
      modalSubtitle={
        displayName ? (
          <span className="tw-block tw-text-xs tw-text-gray-500 tw-font-normal">{displayName}</span>
        ) : undefined
      }
      modalSize={mode === "split" ? "lg" : "md"}
    >
      {mode === "rename" && (
        <RenameUsername
          isOpen={isOpen}
          toggle={toggle}
          userDetails={userDetails}
          usersList={usersList}
          onUsernameRenamed={props.onUsernameRenamed}
        />
      )}
      {mode === "merge" && (
        <MergeUsername
          isOpen={isOpen}
          toggle={toggle}
          userDetails={userDetails}
          usersList={usersList}
          onUsernameMerged={props.onUsernameMerged}
        />
      )}
      {mode === "split" && (
        <SplitUsername
          isOpen={isOpen}
          toggle={toggle}
          userDetails={userDetails}
          usersList={usersList}
          onUsernameSplit={props.onUsernameSplit}
        />
      )}
    </ModalContainerUpdated>
  );
}
