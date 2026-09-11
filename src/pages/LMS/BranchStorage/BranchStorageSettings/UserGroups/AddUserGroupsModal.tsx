import { TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { saveUserGroupsAct } from '../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { shallowEqual } from 'react-redux';
import * as Yup from "yup";
import { useEffect } from 'react';
import { useFormik } from "formik";

const initialValues = {
  groupName: '',
  groupCode: '',
};

const validationSchema = Yup.object().shape({
  groupName: Yup.string().nullable().required('Group Name is required'),
  groupCode: Yup.string().nullable().required('Group Code is required'),
})
const AddEditOpenModal = (props: any) => {

  const dispatch = useAppDispatch();

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    getUserGroupsByIdResp,
  } =
    useAppSelector(({ appData, globalData, branch, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      getUserGroupsByIdResp: branchStorageSettings.getUserGroupsByIdResp,
    }), shallowEqual);

  const addUserGroupsModalFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const savePayload = {
        ...(props.id && { id: props.id }),
        instituteId,
        branchId,
        ...values
      };

      dispatch(
        saveUserGroupsAct(
          generateActionPayload(
            "save_user_groups",
            undefined,
            savePayload
          )
        )
      );
    }
  });

  useEffect(() => {
    if (props.id && getUserGroupsByIdResp) {
      addUserGroupsModalFormik.setValues({
        groupName: getUserGroupsByIdResp.groupName || '',
        groupCode: getUserGroupsByIdResp.groupCode || '',
      });
    }
  }, [props.id, getUserGroupsByIdResp]);

  return (
    <>
      <form onSubmit={addUserGroupsModalFormik.handleSubmit}>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="groupName"
                value={addUserGroupsModalFormik.values.groupName}
                onChange={addUserGroupsModalFormik.handleChange}
                onBlur={addUserGroupsModalFormik.handleBlur}
                labelText="Group Name"
                labelClass='required'
                formgroupClassName="tw-mb-0"
                invalid={(addUserGroupsModalFormik.touched.groupName && addUserGroupsModalFormik.errors.groupName) ? true : false}
                error={(addUserGroupsModalFormik.touched.groupName && addUserGroupsModalFormik.errors.groupName) ? addUserGroupsModalFormik.errors.groupName : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="groupCode"
                value={addUserGroupsModalFormik.values.groupCode}
                onChange={addUserGroupsModalFormik.handleChange}
                onBlur={addUserGroupsModalFormik.handleBlur}
                labelText="Group Code"
                labelClass='required'
                formgroupClassName="tw-mb-0"
                invalid={(addUserGroupsModalFormik.touched.groupCode && addUserGroupsModalFormik.errors.groupCode) ? true : false}
                error={(addUserGroupsModalFormik.touched.groupCode && addUserGroupsModalFormik.errors.groupCode) ? addUserGroupsModalFormik.errors.groupCode : ""}
              />
            </div>
            <div className="tw-col-span-12 tw-mt-1">
              <div className="tw-flex tw-justify-end tw-gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={props.toggle}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={showApiLoader}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddEditOpenModal;