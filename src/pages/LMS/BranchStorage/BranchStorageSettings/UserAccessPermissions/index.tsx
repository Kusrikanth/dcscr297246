import { useFormik } from 'formik';
import { useEffect, useMemo, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';
import { useModal } from '../../../../../hooks/modalhook';
import { ConfirmationModal, ModalContainerUpdated, TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getUserAccessProfilePremissionsAct, getUserAccessProfilePremissionsByIdAct, deleteUserAccessProfileAct } from '../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { toast } from 'react-toastify';
import { generateColumns } from './helper';
import AddUserAccessProfilePermissionsModal from './AddUserAccessProfilePermissionsModal';

const initialValues = {
  searchString: '',
};

const UserAccessPermissions = () => {

  const dispatch = useAppDispatch();
  const { openModal: addUserAccessProfilePermissionsModal, closeModal: closeUserAccessProfilePermissionsModal, modalState: userAccessProfilePermissionsModalState } = useModal();
  const { closeModal: closeUserAccessProfileModal, modalState: delUserAccessProfilePermissionModalState, openModal: openDelUserAccessProfilePermissionModal } = useModal();


  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    getUserAccessProfilePermissionsResp,
    saveUserGroupsResp,
    deleteUserAccessProfileResp,
    saveUserAccessProfilePermissionsResp,
    branchStorageSettingsErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, branch, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getUserAccessProfilePermissionsResp: branchStorageSettings.getUserAccessProfilePermissionsResp,
      saveUserGroupsResp: branchStorageSettings.saveUserGroupsResp,
      deleteUserAccessProfileResp: branchStorageSettings.deleteUserAccessProfileResp,
      saveUserAccessProfilePermissionsResp: branchStorageSettings.saveUserAccessProfilePermissionsResp,
      branchStorageSettingsErrorAct: branchStorageSettings.branchStorageSettingsErrorAct,
    }), shallowEqual);

  const userAccessPermissionApiCall = () => {
    dispatch(
      getUserAccessProfilePremissionsAct(
        generateActionPayload(
          "get_user_access_profile_permissions_list",
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

  const userGroupsRef = useRef({
    prevUserGroupsSettingsErrorAct: branchStorageSettingsErrorAct,
    prevSaveUserGroupsResp: saveUserGroupsResp,
    prevDeleteUserAccessProfileResp: deleteUserAccessProfileResp,
    prevSaveUserAccessProfilePermissionsResp: saveUserAccessProfilePermissionsResp,
  });

  useEffect(() => {
    const { prevUserGroupsSettingsErrorAct, prevSaveUserGroupsResp, prevDeleteUserAccessProfileResp, prevSaveUserAccessProfilePermissionsResp } =
      userGroupsRef.current;
    if (branchStorageSettingsErrorAct && branchStorageSettingsErrorAct !== prevUserGroupsSettingsErrorAct) {
      const { details } = branchStorageSettingsErrorAct || {}
      toast.error(details || "Something went wrong");
    } else if (deleteUserAccessProfileResp && prevDeleteUserAccessProfileResp !== deleteUserAccessProfileResp) {
      toast.success("Groups deleted successfully.");
      closeUserAccessProfileModal();
      userAccessPermissionApiCall();
    } else if (saveUserAccessProfilePermissionsResp && prevSaveUserAccessProfilePermissionsResp !== saveUserAccessProfilePermissionsResp) {
      toast.success("Permissions Updated successfully.");
      closeUserAccessProfilePermissionsModal();
      userAccessPermissionApiCall();
    }
    userGroupsRef.current.prevUserGroupsSettingsErrorAct = branchStorageSettingsErrorAct;
    userGroupsRef.current.prevSaveUserGroupsResp = saveUserGroupsResp;
    userGroupsRef.current.prevDeleteUserAccessProfileResp = deleteUserAccessProfileResp;
    userGroupsRef.current.prevSaveUserAccessProfilePermissionsResp = saveUserAccessProfilePermissionsResp;
  }, [branchStorageSettingsErrorAct, saveUserGroupsResp, saveUserAccessProfilePermissionsResp]);

  const UserGroupsFormik = useFormik({
    initialValues,
    onSubmit: (values) => { },
  });

  const menuOptions = useMemo(
    () => [
      {
        id: 'add-members-user-group',
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: 'Add Members to User Group',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(
            getUserAccessProfilePremissionsByIdAct(
              generateActionPayload('get_user_access_profile_permissions_by_id', {
                id: id
              })
            )
          )
          addUserAccessProfilePermissionsModal(id);
        },
      },
      {
        id: 'delete-user-group',
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger tw-me-2" size={18} />,
        actionName: 'Delete User Group',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          openDelUserAccessProfilePermissionModal(id);
        },
      },
    ],
    [getUserAccessProfilePermissionsResp],
  );

  function delModalSubmitHndlr() {

    dispatch(
      deleteUserAccessProfileAct(
        generateActionPayload(
          "delete_user_access_profile",
          undefined,
          {
            ids: [Number(delUserAccessProfilePermissionModalState.modalData)]
          }
        )
      )
    );
  }

  useEffect(() => {
    if (instituteId && branchId) {
      userAccessPermissionApiCall();
    }
  }, [instituteId, branchId, UserGroupsFormik.values.searchString]);

  const tableColumns = useMemo(() => generateColumns(menuOptions), [getUserAccessProfilePermissionsResp]);

  return (
    <>
      <div className="tw-card">
        <div className="tw-card-header">

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 lg:tw-grid-cols-12 tw-gap-3">
            <div className="lg:tw-col-span-8 tw-flex tw-items-center">
              <h4 className="tw-card-title tw-flex tw-items-center">User Access Permissions</h4>
            </div>
            <div className="lg:tw-col-span-4 lg:tw-justify-self-end">
              <div className="tw-flex tw-gap-2">
                {/* <Button variant="primary" className="!tw-whitespace-nowrap"
                  type="button" onClick={() => addUserAccessProfilePermissionsModal()}>
                  <i className="ri-add-line" /> Add Permissions
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
              data={Array.isArray(getUserAccessProfilePermissionsResp) ? getUserAccessProfilePermissionsResp : []}
              divClass="table-responsive tw-border tw-rounded-lg tw-shadow tw-overflow-hidden tw-pb-4"
              theadClass="tw-bg-[#F9FAFB]"
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="userAccess-profile-permissions"
        isOpen={userAccessProfilePermissionsModalState.showModal}
        toggle={closeUserAccessProfilePermissionsModal}
        modalTitle={
          userAccessProfilePermissionsModalState.modalData ? 'Edit Permission Access' : 'Add Permission Access'
        }
        modalSize="md"
      >
        <AddUserAccessProfilePermissionsModal
          toggle={() => closeUserAccessProfilePermissionsModal()}
          id={userAccessProfilePermissionsModalState.modalData}
          isOpen={false}
          modalTitle={
            userAccessProfilePermissionsModalState.modalData ? 'Edit Permission Access' : 'Add Permission Access'
          } />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-grade-distribution"
        isOpen={delUserAccessProfilePermissionModalState.showModal}
        confirmMessage="Are you sure you want to delete this Group ?"
        cancelHndlr={closeUserAccessProfileModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default UserAccessPermissions;
