import { useFormik } from "formik";
import Button from "../../../../Components/Common/Button";
import { TextInput, TextInputWithRegex } from "../../../../Components/Common";
import { BreadCrumbUpdated } from "../../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { createBranchStorageFolderAct } from "../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";

const initialValues = {
  folderName: "",
};
const validationSchema = Yup.object().shape({
  folderName: Yup.string().nullable().required('Folder Name is required')
})
const CreateNewFolderModal = (props: any) => {
  const { folderBreadCrumbOptions = [] } = props;
  const dispatch = useAppDispatch();

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    userMeResp,
  } =
    useAppSelector(({ appData, directoryEmployee, globalData, login, branch, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      userMeResp: login.userMeResp,
    }), shallowEqual);

  const createNewFloderFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {

      const payload = {
        branchId,
        instituteId,
        createdByName: userMeResp.username,
        parentFolderId:
          props.activeFolderId === "all"
            ? null
            : Number(props.activeFolderId),
        folderName: values.folderName,
      };
      dispatch(
        createBranchStorageFolderAct(
          generateActionPayload(
            "create_branch_storage_folder",
            undefined,
            payload
          )
        )
      );
    },
  });

  return (
    <>
      <form onSubmit={createNewFloderFormik.handleSubmit}>
        <div className="tw-py-3 tw-px-5">
          {folderBreadCrumbOptions?.length > 0 && (
            <div className="tw-mb-2">
              <BreadCrumbUpdated
                breadCrumbOptions={folderBreadCrumbOptions as any}
                extraClass="!tw-pt-0 !tw-px-0 !tw-mb-0 !tw-border-0 !tw-border-none !tw-shadow-none !tw-font-semibold !tw-m-0"
              />
            </div>
          )}
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-hidden lg:tw-block lg:tw-col-span-12 create-admin-assessment">
              <TextInputWithRegex
                name="folderName"
                labelText="Folder Name"
                labelClass="required"
                allowedInputRegex={'^[^\\\\/:*?"<>|]*$'}
                value={createNewFloderFormik.values.folderName}
                onChange={createNewFloderFormik.handleChange}
                placeHolder="e.g. Term_1_Reports"
                invalid={(createNewFloderFormik.touched.folderName && createNewFloderFormik.errors.folderName) ? true : false}
                error={(createNewFloderFormik.touched.folderName && createNewFloderFormik.errors.folderName) ? createNewFloderFormik.errors.folderName : ""}
              />
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2 tw-my-2">
            <Button variant="secondary" type="button" onClick={props.toggle}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateNewFolderModal;