import { AutoSearchInputUpdated, CustomSelect, TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { saveMembersInUserGroupsAct } from '../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { shallowEqual } from 'react-redux';
import * as Yup from "yup";
import React, { useEffect, useRef, useState } from 'react';
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { generateUniqueNumber } from '../../../../../utility/commonutility';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard } from '@hugeicons-pro/core-stroke-standard';
import { getEmployeeByFilterAct, resetEmployeesByFilterAct } from '../../../../../store/directory/employeemanagement/employeemanagementactions';
import { renderGroupOptions, renderGroupValue, renderOptionsEmployee, renderValueSection } from './helper';

const initialValues = {
  groudId: "",
  addEditOpenModalFormik: [
    {
      id: generateUniqueNumber(),
      memberId: "",
      employeeId: '',
      userName: '',
      employeeCode: "",
      authUserId: '',
      isDeleted: false,
    },
  ],
};

const validationSchema = Yup.object().shape({
  addEditOpenModalFormik: Yup.array().of(
    Yup.object().shape({
      employeeId: Yup.string().nullable().required('Employee is required'),
    })
  )
})

const AddMembersToUserGroupsModal = (props: any) => {

  const dispatch = useAppDispatch();
  const [employeeSearch, setEmployeeSearch] = useState("");
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    getEmployeesByFilterResp,
    getUserGroupsListResp,
    membersInUserGroupsResp,
  } =
    useAppSelector(({ appData, directoryEmployee, globalData, login, branch, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      getUserGroupsListResp: branchStorageSettings.getUserGroupsListResp,
      membersInUserGroupsResp: branchStorageSettings.membersInUserGroupsResp,
    }), shallowEqual);

  const addEditOpenModalFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const savePayload = {
        userDetails: values.addEditOpenModalFormik.map((item: any) => ({
          memberId: item.memberId || "",
          authUserId: item.authUserId || "",
          employeeName: item.userName,
          employeeCode: item.employeeCode,
          // authUserId: item.authUserId
          //   ? Number(item.authUserId)
          //   : null,
          isDeleted: item.isDeleted || false,
        })),
      };
      dispatch(
        saveMembersInUserGroupsAct(
          generateActionPayload(
            "save_members_to_user_groups",
            {
              id: props.id || addEditOpenModalFormik.values.groudId
            },
            savePayload
          )
        )
      );
    }
  });

  useEffect(() => {
    if (!props.id) return;

    const mappedRows =
      membersInUserGroupsResp?.members?.length
        ? membersInUserGroupsResp.members.map((member: any) => ({
          id: member.memberId,
          memberId: member.memberId,
          employeeId:
            member.userId ||
            member.authUserId ||
            "",
          userName: member.employeeName || "",
          employeeCode: member.employeeCode || "",
          authUserId: member.authUserId || "",
          isDeleted: false,
        }))
        : [
          {
            id: generateUniqueNumber(),
            memberId: "",
            employeeId: "",
            userName: "",
            employeeCode: "",
            authUserId: "",
            isDeleted: false,
          },
        ];
    addEditOpenModalFormik.resetForm({
      values: {
        groudId: String(props.id),
        addEditOpenModalFormik: mappedRows,
      },
    });
  }, [props.id, membersInUserGroupsResp]);

  function addAdminAssignmentHandler() {
    formikArrayHelpers.current?.push({
      id: generateUniqueNumber(),
      memberId: "",
      employeeId: '',
      userName: '',
      authUserId: "",
      isDeleted: false,
    });
  }

  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = Number(
      event.currentTarget.getAttribute("data-index")
    );
    const currentRow =
      addEditOpenModalFormik.values.addEditOpenModalFormik[rowIndex];
    if (currentRow?.memberId) {
      addEditOpenModalFormik.setFieldValue(
        `addEditOpenModalFormik[${rowIndex}].isDeleted`,
        true
      );
    } else {
      formikArrayHelpers.current?.remove(rowIndex);
    }
  }

  function onSearchMultiSelectHandleremployee(name: any, value: string) {
    setEmployeeSearch(value);

    if (!value?.trim()) {
      dispatch(resetEmployeesByFilterAct(undefined));
      return;
    }

    const params = {
      searchString: value.trim(),
    };

    dispatch(
      getEmployeeByFilterAct(
        generateActionPayload(
          "get_employee_by_name",
          params,
          { branchId }
        )
      )
    );
  }

  const selectEmployeeHandler = (selectedId: string, config?: any) => {
    const index = Number(config?.name?.match(/\[(\d+)\]/)?.[1]);

    if (Number.isNaN(index)) return;

    const employee = employeeOptions.find(
      (item: any) => String(item.id) === String(selectedId)
    );

    if (!employee) return;

    addEditOpenModalFormik.setFieldValue(
      `addEditOpenModalFormik[${index}]`,
      {
        ...addEditOpenModalFormik.values.addEditOpenModalFormik[index],
        employeeId: employee.id,
        authUserId: employee.authUserId || "",
        userName: employee.employeeName || "",
        employeeCode: employee.employeeCode || "",
      }
    );
  };

  function selectGroupHandler(selectedOptions: number | number[], config?: any) {
    const { name } = config || {};
    addEditOpenModalFormik.setFieldValue(
      name || "groudId",
      selectedOptions
    );
  }
  useEffect(() => {
    dispatch(resetEmployeesByFilterAct(undefined));

    return () => {
      dispatch(resetEmployeesByFilterAct(undefined));
    };
  }, [dispatch]);

  const employeeOptions = React.useMemo(() => {
    return (getEmployeesByFilterResp || [])
      .map((employee: any) => {
        const id = employee.authUserId || employee.userId || null;

        return {
          ...employee,
          id,
          authUserId: employee.authUserId || employee.userId || "",
        };
      })
      .filter((employee: any) => employee.id);
  }, [getEmployeesByFilterResp]);

  const employeeRows =
    addEditOpenModalFormik.values.addEditOpenModalFormik.filter(
      (item: any) => !item.isDeleted
    );

  const employeeContainerClass =
    employeeRows.length > 7
      ? "tw-h-[350px] tw-overflow-y-auto tw-overflow-x-hidden tw-pr-2"
      : "";
  return (
    <>
      <form onSubmit={addEditOpenModalFormik.handleSubmit}>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12">
              <CustomSelect
                name="groudId"
                idKey="id"
                defaultSelect="Select Group"
                value={addEditOpenModalFormik.values.groudId}
                renderValue={renderGroupValue}
                renderOptions={renderGroupOptions}
                labelText="Group"
                labelClass="required"
                containerClassName="mb-0"
                options={getUserGroupsListResp || []}
                isDisabled={true}
                onChange={selectGroupHandler}
              />
            </div>
            <div className="tw-col-span-12 tw-gap-4">
              <div className="tw-relative tw-overflow-visible tw-shadow-none">
                <div className="">
                  <div className="tw-w-full">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                      <div className="tw-col-span-10 tw-items-center tw-flex">
                        <h6 className="tw-mb-0">
                          Employee <span className="tw-text-red-500">*</span>
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
                      <FormikProvider value={addEditOpenModalFormik}>
                        <FieldArray name="addEditOpenModalFormik">
                          {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                              formikArrayHelpers.current = arrayHelpers;
                            }

                            return (
                              <>
                              <div className={employeeContainerClass}>
                                {addEditOpenModalFormik.values.addEditOpenModalFormik?.length > 0 &&
                                  addEditOpenModalFormik.values.addEditOpenModalFormik
                                    .map((route, originalIndex) => ({ route, originalIndex, }))
                                    .filter((item: any) => !item.route.isDeleted)
                                    .map(({ route, originalIndex }) => {
                                      const inputFieldErrors: any = addEditOpenModalFormik.errors.addEditOpenModalFormik?.[originalIndex] || {};
                                      const inputFieldTouched: any = addEditOpenModalFormik.touched.addEditOpenModalFormik?.[originalIndex] || {};
                                      return (
                                        <div key={route.id} className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-center tw-mb-3">
                                          <div className="tw-col-span-10">
                                            <CustomSelect
                                              name={`addEditOpenModalFormik[${originalIndex}].employeeId`}
                                              value={route.employeeId}
                                              idKey="id"
                                              options={
                                                [
                                                  ...(route.employeeId
                                                    ? [{
                                                      id: route.employeeId,
                                                      authUserId: route.authUserId || route.employeeId,
                                                      employeeName: route.userName,
                                                      employeeCode: route.employeeCode,
                                                    }]
                                                    : []),
                                                  ...(employeeSearch.trim() ? employeeOptions : []),
                                                ].filter(
                                                  (employee: any, index: number, self: any[]) =>
                                                    index === self.findIndex(
                                                      (item: any) => String(item.id) === String(employee.id)
                                                    )
                                                )
                                              }
                                              renderValue={renderValueSection}
                                              renderOptions={renderOptionsEmployee}
                                              onChange={selectEmployeeHandler}
                                              onSearchHandler={onSearchMultiSelectHandleremployee}
                                              containerClassName="tw-mb-0"
                                              labelClass=" required"
                                              isDisabled={!!route.memberId}
                                              invalid={
                                                inputFieldTouched.employeeId && inputFieldErrors.employeeId
                                                  ? true
                                                  : false
                                              }
                                              error={
                                                inputFieldTouched.employeeId && inputFieldErrors.employeeId
                                                  ? inputFieldErrors.employeeId
                                                  : ""
                                              }
                                            />
                                          </div>
                                          <div className="tw-col-span-2">
                                            <div className="tw-flex tw-items-start">
                                              {(route.memberId ||
                                                addEditOpenModalFormik.values.addEditOpenModalFormik.length > 1 ||
                                                originalIndex !== 0
                                              ) && (
                                                  <Button
                                                    variant="wrong"
                                                    type="button"
                                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                      event.preventDefault();
                                                      event.stopPropagation();
                                                      const currentRow =
                                                        addEditOpenModalFormik.values.addEditOpenModalFormik[
                                                        originalIndex
                                                        ];
                                                      if (currentRow?.memberId) {
                                                        addEditOpenModalFormik.setFieldValue(
                                                          `addEditOpenModalFormik[${originalIndex}].isDeleted`,
                                                          true
                                                        );
                                                      } else {
                                                        arrayHelpers.remove(originalIndex);
                                                      }
                                                    }}
                                                    className="!tw-p-2 !tw-m-0 tw-rounded-full"
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
                                    </div>
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

export default AddMembersToUserGroupsModal;