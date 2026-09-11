import { AutoSearchInputUpdated, CustomSelect, SelectInput, TextInput, TextInputGroup } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { saveBranchStorageAct, updateBranchStorageAct } from '../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { shallowEqual } from 'react-redux';
import * as Yup from "yup";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { generateUniqueNumber } from '../../../../../utility/commonutility';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard } from '@hugeicons-pro/core-stroke-standard';
import { getInstRoleTypeV2Act } from '../../../../../store/mastersettings/instituteinfo/instituteinfoactions';
import { getEmployeeByFilterAct, resetEmployeesByFilterAct } from '../../../../../store/directory/employeemanagement/employeemanagementactions';
import { renderOptionsEmployee, renderValueSection } from './helper';

const initialValues = {
  branchId: '',
  branchShortName: '',
  limit: '',
  addEditOpenModalFormik: [
    {
      id: generateUniqueNumber(),
      employeeId: '',
      userName: '',
    },
  ],
};

const validationSchema = Yup.object().shape({
  branchId: Yup.string().nullable().required('Branch is required'),
  limit: Yup.string().nullable().required('Branch is required'),
  addEditOpenModalFormik: Yup.array().of(
    Yup.object().shape({
      employeeId: Yup.string().nullable().required('Employee is required'),
    })
  )
})
const AddEditOpenModal = (props: any) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    getEmployeesByFilterResp,
    getBranchStorageById,
    userMeResp,
  } =
    useAppSelector(({ appData, directoryEmployee, globalData, login, branch, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      getBranchStorageById: branchStorageSettings.getBranchStorageById,
      userMeResp: login.userMeResp,
    }), shallowEqual);

  const addEditOpenModalFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const selectedBranch = branchListResp?.data?.find(
        (item: any) => item.branchId == values.branchId
      );

      if (props.id) {
        const updatePayload = {
          allocatedBytes: Number(values.limit) * 1024 * 1024 * 1024,
          updatedByName: userMeResp.username,
          users: values.addEditOpenModalFormik.map((item: any) => ({
            ...(item.id ? { id: item.id } : {}),
            employeeId: Number(item.employeeId),
            employeeName: item.userName,
            employeeCode: item.employeeCode,
            userId: item.authUserId,
          })),
        };
        dispatch(
          updateBranchStorageAct(
            generateActionPayload(
              "update_branch_storage",
              { id: props.id },
              updatePayload
            )
          )
        );
      } else {
        const savePayload = {
          instituteId,
          branchId: Number(values.branchId),
          branchName: selectedBranch?.branchName,
          quotaBytes: Number(values.limit) * 1024 * 1024 * 1024,
          createdByName: userMeResp.username,
          adminUsers: values.addEditOpenModalFormik.map((item: any) => ({
            employeeId: Number(item.employeeId),
            employeeName: item.userName,
            employeeCode: item.employeeCode,
            userId: item.authUserId,
          })),
        };
        dispatch(
          saveBranchStorageAct(
            generateActionPayload(
              "save_branch_storage",
              undefined,
              savePayload
            )
          )
        );
      }
    }
  });

  function getRoleTypeApiCall() {
    dispatch(getInstRoleTypeV2Act(generateActionPayload("get_inst_role_type_v2")));
  }

  useEffect(() => {
    if (instituteId) {
      getRoleTypeApiCall();
    }
  }, [instituteId]);

  useEffect(() => {
    if (props.id && getBranchStorageById) {
      const selectedBranch = branchListResp?.data?.find(
        (item: any) => item.branchId === getBranchStorageById.branchId
      );
      addEditOpenModalFormik.setValues({
        branchId: String(getBranchStorageById.branchId),
        branchShortName: selectedBranch?.shortName || "",
        limit: (
          Number(getBranchStorageById.allocatedBytes) /
          (1024 * 1024 * 1024)
        ).toFixed(0),
        addEditOpenModalFormik:
          getBranchStorageById.users?.map((user: any) => ({
            id: user.id,
            employeeId: String(user.employeeId),
            userName: user.employeeName || "",
            employeeCode: user.employeeCode || "",
            authUserId: user.authUserId || "",
          })) || [],
      });
    }
  }, [props.id, getBranchStorageById, branchListResp]);

  useEffect(() => {
    return () => {
      if (props.id) {
        dispatch(resetEmployeesByFilterAct(undefined));
      }
    };
  }, [props.id, dispatch]);

  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function addAdminAssignmentHandler() {
    formikArrayHelpers.current?.push({
      id: generateUniqueNumber(),
      employeeId: '',
      userName: '',
      authUserId: '',
    });
  }

  function onSearchMultiSelectHandleremployee(name: any, value: string) {
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

  const branchChangeHandler = (event: any) => {
    const selectedBranchId = event.target.value;
    addEditOpenModalFormik.setFieldValue("branchId", selectedBranchId);
    const selectedBranch = branchListResp?.data?.find(
      (item: any) => item.branchId == selectedBranchId
    );
    addEditOpenModalFormik.setFieldValue(
      "branchShortName",
      selectedBranch?.shortName || ""
    );
  };

  const employeeOptions = React.useMemo(() => {
    const existingMembers = (getBranchStorageById?.members || [])
      .map((member: any) => ({
        ...member,
        id: member.authUserId || member.userId || null,
        authUserId: member.authUserId || member.userId || "",
        employeeName: member.employeeName || "",
        employeeCode: member.employeeCode || "",
      }))
      .filter((employee: any) => employee.id);

    const searchedEmployees = (getEmployeesByFilterResp || [])
      .map((employee: any) => {
        const id =
          employee.authUserId ||
          employee.userId ||
          null;

        return {
          ...employee,
          id,
          authUserId: employee.authUserId || employee.userId || "",
        };
      })
      .filter((employee: any) => employee.id);

    const selectedEmployees =
      addEditOpenModalFormik.values.addEditOpenModalFormik
        .filter((item: any) => item.employeeId && !item.isDeleted)
        .map((item: any) => ({
          id: item.employeeId,
          authUserId: item.authUserId || item.employeeId,
          employeeName: item.userName,
          employeeCode: item.employeeCode,
        }));

    return Array.from(
      new Map(
        [
          ...existingMembers,
          ...selectedEmployees,
          ...searchedEmployees,
        ].map((employee: any) => [String(employee.id), employee])
      ).values()
    );
  }, [
    getBranchStorageById,
    getEmployeesByFilterResp,
    addEditOpenModalFormik.values.addEditOpenModalFormik,
  ]);

  return (
    <>
      <form onSubmit={addEditOpenModalFormik.handleSubmit}>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="branchId"
                menuItems={branchListResp?.data}
                valueKey="branchId"
                textKey="branchName"
                value={addEditOpenModalFormik.values.branchId}
                onChange={branchChangeHandler}
                formgroupClassName="mb-0"
                labelText="Branch"
                labelClass="required"
                isDisabled={props.id ? true : false}
                invalid={(addEditOpenModalFormik.touched.branchId && addEditOpenModalFormik.errors.branchId) ? true : false}
                error={(addEditOpenModalFormik.touched.branchId && addEditOpenModalFormik.errors.branchId) ? addEditOpenModalFormik.errors.branchId : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="branchShortName"
                value={addEditOpenModalFormik.values.branchShortName}
                onChange={addEditOpenModalFormik.handleChange}
                onBlur={addEditOpenModalFormik.handleBlur}
                labelText="Branch Short Name"
                formgroupClassName="tw-mb-0"
                isDisabled={true}
              />
            </div>
            <div className="tw-col-span-12">
              <TextInputGroup
                name="limit"
                value={addEditOpenModalFormik.values.limit}
                onChange={addEditOpenModalFormik.handleChange}
                onBlur={addEditOpenModalFormik.handleBlur}
                labelText="Storage Limit (GB)"
                formgroupClassName="tw-mb-3"
                allowedInputRegex="^[0-9]+$"
                maxLength={3}
                labelClass="required"
                invalid={(addEditOpenModalFormik.touched.limit && addEditOpenModalFormik.errors.limit) ? true : false}
                error={(addEditOpenModalFormik.touched.limit && addEditOpenModalFormik.errors.limit) ? addEditOpenModalFormik.errors.limit : ""}
              >
                GB
              </TextInputGroup>
            </div>
            <div className="tw-col-span-12 tw-gap-4">
              <div className="tw-card tw-relative tw-overflow-visible tw-shadow-none">
                <div className="tw-card-body">
                  <div className="tw-absolute tw-top-0 tw-left-4 -tw-translate-y-1/2 tw-z-10 tw-bg-white tw-p-1 tw-text-xs tw-rounded tw-text-gray-500">
                    Admin Assignment
                  </div>
                  <div className="tw-w-full">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                      <div className="tw-col-span-5 tw-items-center tw-flex">
                        <h6 className="tw-mb-0">
                          User <span className="tw-text-red-500">*</span>
                        </h6>
                      </div>
                      <div className="tw-col-span-5">
                      </div>
                      <div className="tw-col-span-2">
                        {/* {!props?.routeId && ( */}
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
                        {/* )} */}
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
                                {addEditOpenModalFormik.values.addEditOpenModalFormik?.length > 0 &&
                                  addEditOpenModalFormik.values.addEditOpenModalFormik?.map((route: any, index: any) => {
                                    const inputFieldErrors: any = addEditOpenModalFormik.errors.addEditOpenModalFormik && addEditOpenModalFormik.errors.addEditOpenModalFormik[index] || {};
                                    const inputFieldTouched = addEditOpenModalFormik.touched.addEditOpenModalFormik && addEditOpenModalFormik.touched.addEditOpenModalFormik[index] || {};
                                    return (
                                      <div key={route.uniqueId} className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-center tw-mb-3">
                                        <div className="tw-col-span-10">
                                          <CustomSelect
                                            name={`addEditOpenModalFormik[${index}].employeeId`}
                                            idKey="id"
                                            value={route.employeeId}
                                            defaultSelect="Select Employee"
                                            options={employeeOptions}
                                            renderValue={renderValueSection}
                                            renderOptions={renderOptionsEmployee}
                                            onChange={selectEmployeeHandler}
                                            onSearchHandler={onSearchMultiSelectHandleremployee}
                                            containerClassName="tw-mb-0"
                                            invalid={
                                              inputFieldTouched.employeeId &&
                                                inputFieldErrors.employeeId
                                                ? true
                                                : false
                                            }
                                            error={
                                              inputFieldTouched.employeeId &&
                                                inputFieldErrors.employeeId
                                                ? inputFieldErrors.employeeId
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