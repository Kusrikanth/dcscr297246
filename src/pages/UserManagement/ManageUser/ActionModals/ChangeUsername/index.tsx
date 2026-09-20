import React, { useCallback, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit02StrokeStandard,
  GitForkStrokeStandard,
  GitMergeStrokeStandard,
  UserSwitchStrokeStandard,
} from "@hugeicons-pro/core-stroke-standard";

//Common Component
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";

//Change Username Modals
import ChangeUsernameModals, { ChangeUsernameMode } from "./ChangeUsernameModals";

interface IUseChangeUsername {
  /** Rows currently listed in the tab, used for the username lookups. */
  usersList?: Array<any>;
}

/**
 * Wires the "Change Username" action (Rename / Merge with Existing / Split) into a
 * manage user tab: the menu option, the modals and the list updates.
 * No backend yet, so the applied changes are kept on the screen only.
 */
export function useChangeUsername({ usersList }: IUseChangeUsername) {
  const [changeUsernameState, setChangeUsernameState] = useState<any>({
    showModal: false,
    mode: "",
    userDetails: undefined,
  });
  const [renamedUsernamesState, setRenamedUsernamesState] = useState<{ [userId: string]: string }>(
    {}
  );
  const [mergedUserIdsState, setMergedUserIdsState] = useState<Array<string>>([]);

  /** Applies the username changes done on this screen to the listed rows. */
  const applyUsernameChanges = useCallback(
    (rows: Array<any>) => {
      if (!Array.isArray(rows)) {
        return [];
      }
      return rows
        .filter((row: any) => !mergedUserIdsState.includes(String(row?.id)))
        .map((row: any) => {
          const renamedUsername = renamedUsernamesState[String(row?.id)];
          return renamedUsername ? { ...row, username: renamedUsername } : row;
        });
    },
    [renamedUsernamesState, mergedUserIdsState]
  );

  const availableUsersList = useMemo(
    () => applyUsernameChanges(usersList || []),
    [usersList, applyUsernameChanges]
  );

  const openChangeUsernameHndlr = useCallback(
    (event: any, mode: ChangeUsernameMode) => {
      const userId = event.currentTarget.getAttribute("data-id"),
        userDetails = availableUsersList.find(
          (item: any) => String(item?.id) === String(userId)
        );
      if (userDetails) {
        setChangeUsernameState({ showModal: true, mode, userDetails });
      }
    },
    [availableUsersList]
  );

  const toggleChangeUsernameHndlr = useCallback(() => {
    setChangeUsernameState((prevState: any) => ({
      ...prevState,
      showModal: false,
      mode: "",
    }));
  }, []);

  const usernameRenamedHndlr = useCallback((userId: any, newUsername: string) => {
    setRenamedUsernamesState((prevState: any) => ({ ...prevState, [String(userId)]: newUsername }));
  }, []);

  const usernameMergedHndlr = useCallback((userId: any) => {
    setMergedUserIdsState((prevState: Array<string>) => [...prevState, String(userId)]);
  }, []);

  const menuOption: IOptionsHrtl = useMemo(
    () => ({
      id: "change-username",
      actionIcon: (
        <HugeiconsIcon
          icon={UserSwitchStrokeStandard}
          className="tw-mr-2 tw-text-gray-500"
          size={18}
        />
      ),
      actionName: "Change Username",
      subActions: [
        {
          id: "rename-username",
          actionIcon: (
            <HugeiconsIcon
              icon={Edit02StrokeStandard}
              className="tw-mr-2 tw-text-gray-500"
              size={16}
            />
          ),
          actionName: "Rename",
          onClickHndlr: (event: any) => openChangeUsernameHndlr(event, "rename"),
        },
        {
          id: "merge-username",
          actionIcon: (
            <HugeiconsIcon
              icon={GitMergeStrokeStandard}
              className="tw-mr-2 tw-text-gray-500"
              size={16}
            />
          ),
          actionName: "Merge with Existing",
          onClickHndlr: (event: any) => openChangeUsernameHndlr(event, "merge"),
        },
        {
          id: "split-username",
          actionIcon: (
            <HugeiconsIcon
              icon={GitForkStrokeStandard}
              className="tw-mr-2 tw-text-gray-500"
              size={16}
            />
          ),
          actionName: "Split the Username",
          onClickHndlr: (event: any) => openChangeUsernameHndlr(event, "split"),
        },
      ],
    }),
    [openChangeUsernameHndlr]
  );

  const modals = (
    <ChangeUsernameModals
      isOpen={changeUsernameState.showModal}
      mode={changeUsernameState.mode}
      toggle={toggleChangeUsernameHndlr}
      userDetails={changeUsernameState.userDetails}
      usersList={availableUsersList}
      onUsernameRenamed={usernameRenamedHndlr}
      onUsernameMerged={usernameMergedHndlr}
    />
  );

  return { menuOption, modals, applyUsernameChanges };
}
