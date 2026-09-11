import { SelectInput, TextArea, TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { saveMembersInUserGroupsAct, saveUserAccessProfilePremissionsAct } from '../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { shallowEqual } from 'react-redux';
import * as Yup from "yup";
import { useEffect, useRef } from 'react';
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { generateUniqueNumber } from '../../../../../utility/commonutility';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard } from '@hugeicons-pro/core-stroke-standard';
import { getEmployeeByFilterAct } from '../../../../../store/directory/employeemanagement/employeemanagementactions';
import { permissionOptions } from './helper';

const initialValues = {
  profileName: "",
  profileCode: "",
  description: "",
  addUserAccessPermissionsFormik: [
    {
      id: generateUniqueNumber(),
      permissionCode: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  profileName: Yup.string().nullable().required('Name is required'),
  profileCode: Yup.string().nullable().required('Code is required'),
  description: Yup.string().nullable().required('Description is required'),
  addUserAccessPermissionsFormik: Yup.array().of(
    Yup.object().shape({
      permissionCode: Yup.string().nullable().required('Access is required'),
    })
  )
})

const AddUserAccessProfilePermissionsModal = (props: any) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    getEmployeesByFilterResp,
    getUserGroupsListResp,
    getUserAccessProfilePermissionsByIdResp,
  } =
    useAppSelector(({ appData, directoryEmployee, globalData, login, branch, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      getUserGroupsListResp: branchStorageSettings.getUserGroupsListResp,
      getUserAccessProfilePermissionsByIdResp: branchStorageSettings.getUserAccessProfilePermissionsByIdResp,
    }), shallowEqual);

  const addUserAccessPermissionsFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {

      const savePayload = {
        id: props.id || "",
        instituteId,
        profileCode: values.profileCode,
        profileName: values.profileName,
        description: values.description,
        permissions: values.addUserAccessPermissionsFormik
          .filter((item: any) => !item.isDeleted)
          .map((item: any) => ({
            id:
              props.id &&
                getUserAccessProfilePermissionsByIdResp?.permissions?.some(
                  (permission: any) => permission.id === item.id
                )
                ? item.id
                : null,
            permissionCode: item.permissionCode,
          })),
      };
      dispatch(
        saveUserAccessProfilePremissionsAct(
          generateActionPayload(
            "save_user_access_profile_permissions",
            undefined,
            savePayload
          )
        )
      );
    }
  });

  useEffect(() => {
    if (
      props.id &&
      getUserAccessProfilePermissionsByIdResp
    ) {
      addUserAccessPermissionsFormik.setValues({
        profileName:
          getUserAccessProfilePermissionsByIdResp.profileName || "",

        profileCode:
          getUserAccessProfilePermissionsByIdResp.profileCode || "",

        description:
          getUserAccessProfilePermissionsByIdResp.description || "",

        addUserAccessPermissionsFormik:
          getUserAccessProfilePermissionsByIdResp.permissions?.length > 0
            ? getUserAccessProfilePermissionsByIdResp.permissions.map(
              (item: any) => ({
                id: item.id,
                permissionCode: item.permissionCode,
                isDeleted: false,
              })
            )
            : [
              {
                id: generateUniqueNumber(),
                permissionCode: "",
                isDeleted: false,
              },
            ],
      });
    }
  }, [props.id, getUserAccessProfilePermissionsByIdResp]);

  function addAdminAssignmentHandler() {
    formikArrayHelpers.current?.push({
      id: generateUniqueNumber(),
      permissionCode: "",
      employeeId: '',
      userName: '',
      isDeleted: false,
    });
  }

  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = Number(
      event.currentTarget.getAttribute("data-index")
    );
    const currentRow =
      addUserAccessPermissionsFormik.values.addUserAccessPermissionsFormik[rowIndex];
    if (currentRow?.permissionCode) {
      addUserAccessPermissionsFormik.setFieldValue(
        `addUserAccessPermissionsFormik[${rowIndex}].isDeleted`,
        true
      );
    } else {
      formikArrayHelpers.current?.remove(rowIndex);
    }
  }

  return (
    <>
      <form onSubmit={addUserAccessPermissionsFormik.handleSubmit}>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="profileName"
                value={addUserAccessPermissionsFormik.values.profileName}
                onChange={addUserAccessPermissionsFormik.handleChange}
                onBlur={addUserAccessPermissionsFormik.handleBlur}
                labelText="Profile Name"
                labelClass='required'
                formgroupClassName="tw-mb-0"
                invalid={(addUserAccessPermissionsFormik.touched.profileName && addUserAccessPermissionsFormik.errors.profileName) ? true : false}
                error={(addUserAccessPermissionsFormik.touched.profileName && addUserAccessPermissionsFormik.errors.profileName) ? addUserAccessPermissionsFormik.errors.profileName : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="profileCode"
                value={addUserAccessPermissionsFormik.values.profileCode}
                onChange={addUserAccessPermissionsFormik.handleChange}
                onBlur={addUserAccessPermissionsFormik.handleBlur}
                labelText="Profile Code"
                labelClass='required'
                formgroupClassName="tw-mb-0"
                invalid={(addUserAccessPermissionsFormik.touched.profileCode && addUserAccessPermissionsFormik.errors.profileCode) ? true : false}
                error={(addUserAccessPermissionsFormik.touched.profileCode && addUserAccessPermissionsFormik.errors.profileCode) ? addUserAccessPermissionsFormik.errors.profileCode : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <TextArea
                name="description"
                value={addUserAccessPermissionsFormik.values.description}
                onChange={addUserAccessPermissionsFormik.handleChange}
                onBlur={addUserAccessPermissionsFormik.handleBlur}
                labelText="Description"
                labelClass='required'
                formgroupClassName="tw-mb-0"
                invalid={(addUserAccessPermissionsFormik.touched.description && addUserAccessPermissionsFormik.errors.description) ? true : false}
                error={(addUserAccessPermissionsFormik.touched.description && addUserAccessPermissionsFormik.errors.description) ? addUserAccessPermissionsFormik.errors.description : ""}
              />
            </div>
            <div className="tw-col-span-12 tw-gap-4">
              <div className="tw-relative tw-overflow-visible tw-shadow-none">
                <div className="">
                  <div className="tw-w-full">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                      <div className="tw-col-span-10 tw-items-center tw-flex">
                        <h6 className="tw-mb-0">
                          Access
                        </h6>
                      </div>
                      <div className="tw-col-span-2">
                        <div className="tw-flex tw-justify-end">
                          <Button
                            onClick={addAdminAssignmentHandler}
                            type="button"
                            variant="hoverInfo"
                            className="!tw-px-2 !tw-py-1 tw-rounded-full"
                          >
                            <i className="ri-add-line" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tw-mt-2 tw-grid tw-grid-cols-1 lg:tw-grid-cols-1 tw-gap-3">
                    <div className="tw-w-full">
                      <FormikProvider value={addUserAccessPermissionsFormik}>
                        <FieldArray name="addUserAccessPermissionsFormik">
                          {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                              formikArrayHelpers.current = arrayHelpers;
                            }
                            return (
                              <>
                                {addUserAccessPermissionsFormik.values.addUserAccessPermissionsFormik?.length > 0 &&
                                  addUserAccessPermissionsFormik.values.addUserAccessPermissionsFormik
                                    ?.filter((item: any) => !item.isDeleted)
                                    .map((route: any, index: any) => {
                                      const inputFieldErrors: any = addUserAccessPermissionsFormik.errors.addUserAccessPermissionsFormik && addUserAccessPermissionsFormik.errors.addUserAccessPermissionsFormik[index] || {};
                                      const inputFieldTouched = addUserAccessPermissionsFormik.touched.addUserAccessPermissionsFormik && addUserAccessPermissionsFormik.touched.addUserAccessPermissionsFormik[index] || {};
                                      return (
                                        <div key={route.uniqueId} className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-center tw-mb-3">
                                          <div className="tw-col-span-10">
                                            <SelectInput
                                              name={`addUserAccessPermissionsFormik[${index}].permissionCode`}
                                              value={route.permissionCode}
                                              onChange={addUserAccessPermissionsFormik.handleChange}
                                              onBlur={addUserAccessPermissionsFormik.handleBlur}
                                              menuItems={permissionOptions || []}
                                              valueKey="id"
                                              textKey="name"
                                              formgroupClassName="tw-mb-0"
                                              invalid={
                                                inputFieldTouched?.permissionCode &&
                                                  inputFieldErrors?.permissionCode
                                                  ? true
                                                  : false
                                              }
                                              error={
                                                inputFieldTouched?.permissionCode &&
                                                  inputFieldErrors?.permissionCode
                                                  ? inputFieldErrors.permissionCode
                                                  : ""
                                              }
                                            />
                                          </div>
                                          <div className="tw-col-span-2">
                                            <div className="tw-flex tw-items-start">
                                              {(props.id || index !== 0) && (
                                                <Button
                                                  variant="wrong"
                                                  data-index={index}
                                                  type="button"
                                                  onClick={removeSlabHndlr}
                                                  className="!tw-p-2 tw-rounded-full tw-ml-5"
                                                >
                                                  <HugeiconsIcon
                                                    icon={Delete02StrokeStandard}
                                                    className="tw-text-red-500"
                                                    size={18}
                                                  />
                                                </Button>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                              </>
                            )
                          }}
                        </FieldArray>
                      </FormikProvider>
                    </div>
                  </div>
                </div>
              </div>
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

export default AddUserAccessProfilePermissionsModal;