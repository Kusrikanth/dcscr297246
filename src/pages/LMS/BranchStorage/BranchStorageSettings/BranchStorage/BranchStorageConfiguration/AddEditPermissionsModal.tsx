import { useFormik } from 'formik';

import {
  accessLevelColorMap,
  roleColorMap,
  userManagementData,
} from './helper';
import { Input, Label } from 'reactstrap';
import {
  StatusLabel,
  Switch,
  TextInput,
  UserDetails,
} from '../../../../../../Components/Common';
import Button from '../../../../../../Components/Common/Button';

const initialValues = {
  role: '',
  canManageDocuments: true,
  canUploadFiles: true,
  canDeleteFiles: true,
  canManageRooms: true,
  canManageUsers: true,
  canViweAnalytics: true,
};

const AddEditPermissionsModal = ({ toggle, editItemId }) => {
  const addEditPermissionsModalFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const selectedItem = userManagementData?.find(
    (item) => item.uniqueId === editItemId,
  );

  const {
    user,
    userId,
    role = '',
    accessLevel,
    roomsAccess,
    lastUpdated,
  } = selectedItem || {};

  return (
    <div className="tw-card tw-border-none tw-shadow-none tw-mb-0">
      {editItemId && (
        <div className="tw-card-header">
          <div className="tw-flex tw-items-start tw-justify-between tw-items-center tw-bg-[#F9FAFB] tw-p-2 tw-rounded">
            <UserDetails displayName={user} displayId={userId} size="xs" />
            <StatusLabel
              labelName={role || ''}
              type={roleColorMap[role?.replace(/\s+/g, '').toLowerCase()]}
            />
          </div>
        </div>
      )}
      <div className="tw-card-body">
        <div className="tw-space-y-3">
          <div>
            <TextInput
              name="role"
              value={addEditPermissionsModalFormik.values.role}
              onChange={addEditPermissionsModalFormik.handleChange}
              onBlur={addEditPermissionsModalFormik.handleBlur}
              labelText="Role"
              helperText="Branch Admins have all permissions enabled by default."
            ></TextInput>
          </div>
          <div>
            <p className="tw-text-sm tw-text-semibold tw-text-gray-500">
              Permissions
            </p>
            <div className="tw-space-y-2">
              <div className="tw-border tw-rounded-lg tw-p-2 tw-flex tw-justify-between tw-gap-2 tw-items-center">
                <div>
                  <label htmlFor="canManageDocuments" className="tw-mb-0">
                    Can Manage Documents
                  </label>
                  <p className="tw-text-sm tw-text-zinc-400 tw-mb-0 tw-font-medium">
                    Create, edit, and organize documents
                  </p>
                </div>
                <Switch
                  attributeId="canManageDocuments"
                  checked={
                    addEditPermissionsModalFormik.values.canManageDocuments
                  }
                  onChangeHndlr={addEditPermissionsModalFormik.handleChange}
                  className="tw-p-0"
                ></Switch>
              </div>
              <div className="tw-border tw-rounded-lg tw-p-2 tw-flex tw-justify-between tw-gap-2 tw-items-center">
                <div>
                  <label htmlFor="canManageDocuments" className="tw-mb-0">
                    Can Upload Files
                  </label>
                  <p className="tw-text-sm tw-text-zinc-400 tw-mb-0 tw-font-medium">
                    Upload new files to branch storage
                  </p>
                </div>
                <Switch
                  attributeId="canManageDocuments"
                  checked={addEditPermissionsModalFormik.values.canUploadFiles}
                  onChangeHndlr={addEditPermissionsModalFormik.handleChange}
                  className="tw-p-0"
                ></Switch>
              </div>
              <div className="tw-border tw-rounded-lg tw-p-2 tw-flex tw-justify-between tw-gap-2 tw-items-center">
                <div>
                  <label htmlFor="canManageDocuments" className="tw-mb-0">
                    Can Delete Files
                  </label>
                  <p className="tw-text-sm tw-text-zinc-400 tw-mb-0 tw-font-medium">
                    Permanently delete files and folders
                  </p>
                </div>
                <Switch
                  attributeId="canManageDocuments"
                  checked={addEditPermissionsModalFormik.values.canDeleteFiles}
                  onChangeHndlr={addEditPermissionsModalFormik.handleChange}
                  className="tw-p-0"
                ></Switch>
              </div>
              <div className="tw-border tw-rounded-lg tw-p-2 tw-flex tw-justify-between tw-gap-2 tw-items-center">
                <div>
                  <label htmlFor="canManageDocuments" className="tw-mb-0">
                    Can Manage Rooms
                  </label>
                  <p className="tw-text-sm tw-text-zinc-400 tw-mb-0 tw-font-medium">
                    Create and manage collaboration rooms
                  </p>
                </div>
                <Switch
                  attributeId="canManageDocuments"
                  checked={addEditPermissionsModalFormik.values.canManageRooms}
                  onChangeHndlr={addEditPermissionsModalFormik.handleChange}
                  className="tw-p-0"
                ></Switch>
              </div>
              <div className="tw-border tw-rounded-lg tw-p-2 tw-flex tw-justify-between tw-gap-2 tw-items-center">
                <div>
                  <label htmlFor="canManageDocuments" className="tw-mb-0">
                    Can Manage Users
                  </label>
                  <p className="tw-text-sm tw-text-zinc-400 tw-mb-0 tw-font-medium">
                    Add or remove user access
                  </p>
                </div>
                <Switch
                  attributeId="canManageDocuments"
                  checked={addEditPermissionsModalFormik.values.canManageUsers}
                  onChangeHndlr={addEditPermissionsModalFormik.handleChange}
                  className="tw-p-0"
                ></Switch>
              </div>
              <div className="tw-border tw-rounded-lg tw-p-2 tw-flex tw-justify-between tw-gap-2 tw-items-center">
                <div>
                  <label htmlFor="canManageDocuments" className="tw-mb-0">
                    Can View Analytics
                  </label>
                  <p className="tw-text-sm tw-text-zinc-400 tw-mb-0 tw-font-medium">
                    View storage and usage analytics
                  </p>
                </div>
                <Switch
                  attributeId="canManageDocuments"
                  checked={
                    addEditPermissionsModalFormik.values.canViweAnalytics
                  }
                  onChangeHndlr={addEditPermissionsModalFormik.handleChange}
                  className="tw-p-0"
                ></Switch>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tw-card-footer tw-flex tw-justify-end tw-gap-2">
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button variant="primary">
          {editItemId ? 'Update Permissions' : 'Submit Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AddEditPermissionsModal;
