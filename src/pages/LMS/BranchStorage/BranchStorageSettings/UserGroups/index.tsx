import { useFormik } from 'formik';
import { useEffect, useMemo, useRef } from 'react';
import { generateColumns } from './helper';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, PencilEdit02Icon, UserMultiple02Icon } from '@hugeicons-pro/core-stroke-standard';
import AddUserGroupsModal from './AddUserGroupsModal';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../../../../hooks/modalhook';
import { ConfirmationModal, ModalContainerUpdated, TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getUserGroupsListAct, getUserGroupsByIdAct, deleteUserGroupsAct, getMembersInUserGroupsAct } from '../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { toast } from 'react-toastify';
import AddMembersToUserGroupsModal from './AddMembersToUserGroupsModal';

const initialValues = {
  searchString: '',
};

const UserGroups = () => {

  const dispatch = useAppDispatch();
  const { openModal: addUserGroupsModal, closeModal: closeUserGroupsModal, modalState: UserGroupsModalState } = useModal();
  const { openModal: addMembersToUserGroupsModal, closeModal: closeMembersToUserGroupsModal, modalState: membersToUserGroupsModalState } = useModal();
  const { closeModal: closeDelUserGroupsModal, modalState: delUserGroupsModalState, openModal: openDelUserGroupsModal } = useModal();

  const UserGroupsApiCall = () => {
    dispatch(
      getUserGroupsListAct(
        generateActionPayload(
          "get_user_groups_list",
          undefined,
          {
            instituteId,
            branchId,
            searchString: UserGroupsFormik.values.searchString,
          }
        )
      )
    );
  };

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    getUserGroupsListResp,
    saveUserGroupsResp,
    deleteUserGroupsResp,
    saveMembersInUserGroupsResp,
    branchStorageSettingsErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, branch, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getUserGroupsListResp: branchStorageSettings.getUserGroupsListResp,
      saveUserGroupsResp: branchStorageSettings.saveUserGroupsResp,
      deleteUserGroupsResp: branchStorageSettings.deleteUserGroupsResp,
      saveMembersInUserGroupsResp: branchStorageSettings.saveMembersInUserGroupsResp,
      branchStorageSettingsErrorAct: branchStorageSettings.branchStorageSettingsErrorAct,
    }), shallowEqual);

  const userGroupsRef = useRef({
    prevUserGroupsSettingsErrorAct: branchStorageSettingsErrorAct,
    prevSaveUserGroupsResp: saveUserGroupsResp,
    prevDeleteUserGroupsResp: deleteUserGroupsResp,
    prevSaveMembersInUserGroupsResp: saveMembersInUserGroupsResp,
  });

  useEffect(() => {
    const { prevUserGroupsSettingsErrorAct, prevSaveUserGroupsResp, prevDeleteUserGroupsResp, prevSaveMembersInUserGroupsResp } =
      userGroupsRef.current;
    if (branchStorageSettingsErrorAct && branchStorageSettingsErrorAct !== prevUserGroupsSettingsErrorAct) {
      const { details } = branchStorageSettingsErrorAct || {}
      toast.error(details || "Something went wrong");
    } else if (saveUserGroupsResp && prevSaveUserGroupsResp !== saveUserGroupsResp) {
      toast.success("Groups saved successfully.");
      closeUserGroupsModal();
      UserGroupsApiCall();
    } else if (deleteUserGroupsResp && prevDeleteUserGroupsResp !== deleteUserGroupsResp) {
      toast.success("Groups deleted successfully.");
      closeDelUserGroupsModal();
      UserGroupsApiCall();
    } else if (saveMembersInUserGroupsResp && prevSaveMembersInUserGroupsResp !== saveMembersInUserGroupsResp) {
      toast.success("Members Updated successfully.");
      closeMembersToUserGroupsModal();
      UserGroupsApiCall();
    }
    userGroupsRef.current.prevUserGroupsSettingsErrorAct = branchStorageSettingsErrorAct;
    userGroupsRef.current.prevSaveUserGroupsResp = saveUserGroupsResp;
    userGroupsRef.current.prevDeleteUserGroupsResp = deleteUserGroupsResp;
    userGroupsRef.current.prevSaveMembersInUserGroupsResp = saveMembersInUserGroupsResp;
  }, [branchStorageSettingsErrorAct, saveUserGroupsResp, deleteUserGroupsResp, saveMembersInUserGroupsResp]);

  const UserGroupsFormik = useFormik({
    initialValues,
    onSubmit: (values) => { },
  });

  const menuOptions = useMemo(
    () => [
      {
        id: 'user-groups-edit',
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: 'User Groups Edit',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(
            getUserGroupsByIdAct(
              generateActionPayload('get_user_groups_by_id', {
                id: id
              })
            )
          )
          addUserGroupsModal(id);
        },
      },
      // {
      //   id: 'add-members-user-group',
      //   actionIcon: (
      //     <HugeiconsIcon
      //       icon={UserMultiple02Icon}
      //       className="text-muted"
      //       size={18}
      //     />
      //   ),
      //   actionName: 'Add Members to User Group',
      //   onClickHndlr: (event: any) => {
      //     const id = event.currentTarget.getAttribute("data-id");
      //     dispatch(
      //       getMembersInUserGroupsAct(
      //         generateActionPayload('get_members_in_user_groups', {
      //           id: id
      //         })
      //       )
      //     )
      //     addMembersToUserGroupsModal(id);
      //   },
      // },
      {
        id: 'delete-user-group',
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger tw-me-2" size={18} />,
        actionName: 'Delete User Group',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          openDelUserGroupsModal(id);
        },
      },
    ],
    [getUserGroupsListResp],
  );

  function delModalSubmitHndlr() {

    dispatch(
      deleteUserGroupsAct(
        generateActionPayload(
          "delete_user_groups",
          { id: delUserGroupsModalState.modalData },
        )
      )
    );
  }
  const onAvatarClickHndlr = (id: number) => {
    const selectedGroup = getUserGroupsListResp?.find(
      (item: any) => Number(item.id) === Number(id)
    );
    dispatch(
      getMembersInUserGroupsAct(
        generateActionPayload(
          "get_members_in_user_groups",
          { id }
        )
      )
    );

    addMembersToUserGroupsModal({
      id,
      isFromMembers: true,
      hasMembers:
        selectedGroup?.members?.length > 0
    });
  };
  useEffect(() => {
    if (instituteId && branchId) {
      UserGroupsApiCall();
    }
  }, [instituteId, branchId, UserGroupsFormik.values.searchString]);

  const tableColumns = useMemo(() => generateColumns(menuOptions, onAvatarClickHndlr), [getUserGroupsListResp]);

  return (
    <>
      <div className="tw-card">
        <div className="tw-card-header">

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 lg:tw-grid-cols-12 tw-gap-3">
            <div className="lg:tw-col-span-8 tw-flex tw-items-center">
              <h4 className="tw-card-title tw-flex tw-items-center">User Groups</h4>
            </div>
            <div className="lg:tw-col-span-4 lg:tw-justify-self-end">
              <div className="tw-flex tw-gap-2">
                {/* <Button
                  variant="info"
                  type="button"><i className="ri-add-line" />
                  <span>Export</span></Button> */}
                <Button variant="primary" className="!tw-whitespace-nowrap"
                  type="button" onClick={() => addUserGroupsModal()}>
                  <i className="ri-add-line" /> Add Group
                </Button>
                {/* <Button variant="hoverInfo" className="!tw-whitespace-nowrap"
                  type="button" onClick={() => addMembersToUserGroupsModal()}>
                  <i className="ri-add-line" /> Add Members to Groups
                </Button> */}
              </div>
            </div>
          </div>
        </div>
        <div className="tw-card-body">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3  lg:tw-grid-cols-12 tw-gap-3 tw-mb-4">
            <div className="lg:tw-col-span-5">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  placeHolder="Search..."
                  value={UserGroupsFormik.values.searchString}
                  onChange={UserGroupsFormik.handleChange}
                  formgroupClassName="mb-0"
                  labelText="Search"
                  floatingLabel
                ></TextInput>
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
          <div>
            <TableContainer
              columns={tableColumns}
              data={Array.isArray(getUserGroupsListResp) ? getUserGroupsListResp : []}
              divClass="tw-border tw-rounded-lg tw-shadow tw-overflow-hidden tw-pb-4"
              theadClass="tw-bg-[#F9FAFB]"
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="addUserGroupsModal"
        isOpen={UserGroupsModalState.showModal}
        toggle={closeUserGroupsModal}
        modalTitle={
          UserGroupsModalState.modalData ? 'Edit User Groups' : 'Add User Groups'
        }
        modalSize="md"
      >
        <AddUserGroupsModal
          toggle={() => closeUserGroupsModal()}
          id={UserGroupsModalState.modalData}
          isOpen={false}
          modalTitle="Create Detail" />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="membersToUserGroupsModalState"
        isOpen={membersToUserGroupsModalState.showModal}
        toggle={closeMembersToUserGroupsModal}
        modalTitle={
          membersToUserGroupsModalState.modalData?.hasMembers
            ? "Edit Members to User Group"
            : "Add Members to User Group"
        }
        modalSize="md"
      >
        <AddMembersToUserGroupsModal
          toggle={() => closeMembersToUserGroupsModal()}
          id={membersToUserGroupsModalState.modalData?.id}
          isFromMembers={
            membersToUserGroupsModalState.modalData?.isFromMembers
          }
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-grade-distribution"
        isOpen={delUserGroupsModalState.showModal}
        confirmMessage="Are you sure you want to delete this Group ?"
        cancelHndlr={closeDelUserGroupsModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default UserGroups;
