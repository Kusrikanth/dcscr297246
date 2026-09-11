import { useFormik } from "formik";
import { AutoSearchInputUpdated, Button, SelectInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getUserAccessProfilePremissionsAct, getUserGroupsListAct } from "../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { generateColumnsManageAccess, principalOptions } from "./helper";
import { getEmployeeByFilterAct, resetEmployeesByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { resetManageAccessSummaryAct, saveUserStorageManageAccessAct } from "../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { getInstBranchesAct } from "../../../../store/mastersettings/branch/branchactions";
import TableContainer from "../../../../Components/Common/TableContainer";

const initialValues = {
  fromInstituteId: "",
  fromBranchId: "",
  instituteId: "",
  branchId: "",
  isForCurrentBranch: false,
  grantId: "",
  principalType: "GROUP",
  principalId: "",
  principalName: "",
  principalCode: "",
  selectedGroup: null,
  selectedEmployee: null,
  permissionProfileId: "",
};

const ManageFileAccess = (props: any) => {
  const dispatch = useAppDispatch();
  const isPrefilled = useRef(false);
  const isFromLocationPrefilled = useRef(false);
  const originalRoutesRef = useRef<any[]>([]);
  const [manageAccessRows, setManageAccessRows] = useState<any[]>([]);
  const [fromInstituteOptions, setFromInstituteOptions] = useState<any[]>([]);
  const [fromBranchOptions, setFromBranchOptions] = useState<any[]>([]);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [
    editingPermissionRowKey,
    setEditingPermissionRowKey,
  ] = useState<string | null>(null);

  const UserGroupsApiCall = () => {
    dispatch(
      getUserGroupsListAct(
        generateActionPayload(
          "get_user_groups_list",
          undefined,
          {
            instituteId: addUserAccessPermissionsFormik.values.instituteId,
            branchId: addUserAccessPermissionsFormik.values.branchId,
          }
        )
      )
    );
  };

  const userAccessPermissionApiCall = () => {
    dispatch(
      getUserAccessProfilePremissionsAct(
        generateActionPayload(
          "get_user_access_profile_permissions_list",
          undefined,
          {
            instituteId: addUserAccessPermissionsFormik.values.instituteId,
            branchId: addUserAccessPermissionsFormik.values.branchId
          }
        )
      )
    );
  };

  const {
    currentInstIdResp: currentInstituteId,
    currentBranchIdResp: currentBranchId,
    showApiLoader,
    instituteListResp,
    branchListResp,
    getUserGroupsListResp,
    getUserAccessProfilePermissionsResp,
    getManageAccessSummaryResp,
    getEmployeesByFilterResp
  } =
    useAppSelector(({ appData, globalData, directoryEmployee, instituteInfo, branch, branchStorageSettings, branchStorageManagement }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      instituteListResp: instituteInfo.instituteListResp,
      branchListResp: branch.branchListResp,
      getUserGroupsListResp: branchStorageSettings.getUserGroupsListResp,
      getUserAccessProfilePermissionsResp: branchStorageSettings.getUserAccessProfilePermissionsResp,
      getManageAccessSummaryResp: branchStorageManagement.getManageAccessSummaryResp,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
    }), shallowEqual);

  const branchOptions = useMemo(() => {
    return (branchListResp?.data || []).map((item: any) => ({
      ...item,
      id: item.id ?? item.campusNumber ?? item.branchId,
    }));
  }, [branchListResp?.data]);

  const getBranchByValue = (value: any, currentInstituteId?: any) => {
    return branchOptions.find((item: any) => {
      const isSameBranch = [item.id, item.branchId, item.campusNumber].some(
        (key) => String(key) === String(value)
      );
      const isSameInstitute = currentInstituteId
        ? String(item.instituteId) === String(currentInstituteId)
        : true;

      return isSameBranch && isSameInstitute;
    });
  };

  const addUserAccessPermissionsFormik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const resources = props.selectedResources || [];

      const grants = manageAccessRows.map((item) => ({
        id: item.id || "",

        resourceType: item.resourceType,
        resourceId: item.resourceId,
        resourceName: item.resourceName,
        fromInstituteId: item.fromInstituteId,
        fromInstituteName: item.fromInstituteName,
        fromInstituteShortName: item.fromInstituteShortName,
        fromBranchId: item.fromBranchId,
        fromBranchName: item.fromBranchName,
        toInstituteId: item.isForCurrentBranch ? null : item.toInstituteId,
        toInstituteName: item.isForCurrentBranch ? null : item.toInstituteName,
        toBranchId: item.isForCurrentBranch ? null : item.toBranchId,
        toInstituteShortName: item.toInstituteShortName,
        toBranchName: item.isForCurrentBranch ? null : item.toBranchName,
        principalType: item.principalType,
        principalId:
          item.principalType === "GROUP"
            ? Number(item.principalId)
            : item.principalId,
        principalName: item.principalName,
        principalCode: item.principalCode,
        assignmentMode: item.assignmentMode || "PROFILE",
        permissionProfileId: Number(item.permissionProfileId),
        propagateToChildren: item.propagateToChildren ?? true,
        customActions: item.customActions || [],
        isDeleted: item.isDeleted,
      }));

      const payload = {
        // instituteId: values.fromInstituteId,
        // branchId: values.fromBranchId,
        grants,
      };
      dispatch(
        saveUserStorageManageAccessAct(
          generateActionPayload(
            "save_user_storage_manage_access",
            undefined,
            payload
          )
        )
      );
    }
  });

  function getBranchApiCall(otherProps?: any) {
    const payload = { instituteId: addUserAccessPermissionsFormik.values.instituteId, ...otherProps };
    dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
  }

  useEffect(() => {
    if (addUserAccessPermissionsFormik.values.instituteId) {
      getBranchApiCall({
        instituteId: addUserAccessPermissionsFormik.values.instituteId,
      });
    }
  }, [addUserAccessPermissionsFormik.values.instituteId]);

  const instituteChangeHandler = (e: any) => {
    addUserAccessPermissionsFormik.handleChange(e);
    addUserAccessPermissionsFormik.setFieldValue("branchId", "");
  };

  useEffect(() => {
    if (addUserAccessPermissionsFormik.values.instituteId && addUserAccessPermissionsFormik.values.branchId) {
      UserGroupsApiCall();
      userAccessPermissionApiCall();
    }
  }, [addUserAccessPermissionsFormik.values.instituteId, addUserAccessPermissionsFormik.values.branchId]);

  useEffect(() => {
    if (!props.isOpen || isPrefilled.current) return;
    if (!getManageAccessSummaryResp?.success || !getManageAccessSummaryResp?.data) {
      return;
    }

    const homeBranchGrants =
      getManageAccessSummaryResp.data.homeBranchGrants || [];

    const otherBranchGrants =
      getManageAccessSummaryResp.data.otherBranchGrants || [];
    const grants = [
      ...homeBranchGrants.map((item: any) => ({
        ...item,
        grantCategory: "HOME_BRANCH",
      })),
      ...otherBranchGrants.map((item: any) => ({
        ...item,
        grantCategory: "OTHER_BRANCH",
      })),
    ];
    const getInstituteName = (instituteId: any) => {
      return (
        instituteListResp?.data?.find(
          (item: any) => String(item.id) === String(instituteId)
        )?.instituteName || ""
      );
    };
    const getBranchName = (branchId: any, instituteId: any) => {
      return getBranchByValue(branchId, instituteId)?.branchName || "";
    };
    const mappedRows = grants.map((grant: any, index: number) => {
      const isForCurrentBranch =
        !grant.toInstituteId && !grant.toBranchId;
      const fromInstituteId = grant.fromInstituteId || currentInstituteId || "";
      const fromBranchId = grant.fromBranchId || currentBranchId || "";
      return {
        id: grant.id || "",
        rowKey: grant.id
          ? `existing_${grant.id}`
          : `existing_${grant.principalType}_${grant.principalId}_${grant.permissionProfileId}_${index}`,
        isDeleted: false,
        isForCurrentBranch,
        resourceType: grant.resourceType,
        resourceId: grant.resourceId,
        resourceName: grant.resourceName,
        fromInstituteId,
        fromInstituteName:
          grant.fromInstituteName || getInstituteName(fromInstituteId),
        fromBranchId,
        fromBranchName:
          grant.fromBranchName || getBranchName(fromBranchId, fromInstituteId),
        toInstituteId: isForCurrentBranch ? "" : grant.toInstituteId || "",
        toInstituteName: isForCurrentBranch
          ? ""
          : grant.toInstituteName || getInstituteName(grant.toInstituteId),
        toBranchId: isForCurrentBranch ? "" : grant.toBranchId || "",
        toBranchName: isForCurrentBranch
          ? ""
          : grant.toBranchName || getBranchName(grant.toBranchId, grant.toInstituteId),
        principalType: grant.principalType,
        principalId: grant.principalId || "",
        principalName: grant.principalName || "",
        principalCode: grant.principalCode || "",
        assignmentMode: grant.assignmentMode || "PROFILE",
        permissionProfileId: String(grant.permissionProfileId || ""),
        permission: grant.permissionProfileName || "",
        propagateToChildren: grant.propagateToChildren ?? true,
        status: grant.status,
        grantedAt: grant.grantedAt,
        grantedByName: grant.grantedByName,
        revokedByName: grant.revokedByName,
        revokedAt: grant.revokedAt,
        customActions: grant.customActions || [],
      };
    });
    setManageAccessRows(mappedRows);
    originalRoutesRef.current = JSON.parse(JSON.stringify(mappedRows));
    isPrefilled.current = true;
    dispatch(resetManageAccessSummaryAct(undefined));
  }, [props.isOpen, getManageAccessSummaryResp, currentInstituteId, currentBranchId, instituteListResp?.data, branchOptions]);

  useEffect(() => {
    if (props.isOpen && !isFromLocationPrefilled.current && currentInstituteId && currentBranchId) {
      const fromInstitute = instituteListResp?.data?.find(
        (item: any) => String(item.id) === String(currentInstituteId)
      );
      const fromBranch = getBranchByValue(currentBranchId, currentInstituteId);
      setFromInstituteOptions([
        fromInstitute || {
          id: currentInstituteId,
          instituteName: String(currentInstituteId),
        },
      ]);
      setFromBranchOptions([
        fromBranch
          ? {
            ...fromBranch,
            id: currentBranchId,
            branchName: fromBranch.branchName,
          }
          : {
            id: currentBranchId,
            branchName: String(currentBranchId),
          },
      ]);
      addUserAccessPermissionsFormik.setValues((prev) => ({
        ...prev,
        isForCurrentBranch: false,
        fromInstituteId: currentInstituteId,
        fromBranchId: currentBranchId,
        instituteId: currentInstituteId,
        branchId: currentBranchId,
      }));
      isFromLocationPrefilled.current = true;
    }
  }, [props.isOpen, currentInstituteId, currentBranchId, instituteListResp?.data, branchOptions]);

  useEffect(() => {
    if (!props.isOpen) {
      addUserAccessPermissionsFormik.resetForm({
        values: initialValues,
      });

      isPrefilled.current = false;
      isFromLocationPrefilled.current = false;
      originalRoutesRef.current = [];

      setManageAccessRows([]);
      setFromInstituteOptions([]);
      setFromBranchOptions([]);
      setIsSaveEnabled(false);
      setEditingPermissionRowKey(null);

      dispatch(resetManageAccessSummaryAct(undefined));
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (currentInstituteId && currentBranchId && !addUserAccessPermissionsFormik.values.instituteId && !addUserAccessPermissionsFormik.values.branchId) {
      addUserAccessPermissionsFormik.setFieldValue(
        "instituteId",
        currentInstituteId
      );
      addUserAccessPermissionsFormik.setFieldValue(
        "branchId",
        currentBranchId
      );
    }
  }, [currentInstituteId, currentBranchId]);

  useEffect(() => {
    if (!props.isOpen) return;
    const fromInstituteId =
      addUserAccessPermissionsFormik.values.fromInstituteId;
    if (!fromInstituteId) return;
    const fromInstitute = instituteListResp?.data?.find(
      (item: any) => String(item.id) === String(fromInstituteId)
    );
    if (fromInstitute) {
      setFromInstituteOptions([fromInstitute]);
    }
  }, [props.isOpen, instituteListResp?.data, addUserAccessPermissionsFormik.values.fromInstituteId]);

  useEffect(() => {
    if (!props.isOpen) return;
    const fromBranchId = addUserAccessPermissionsFormik.values.fromBranchId;
    const fromInstituteId = addUserAccessPermissionsFormik.values.fromInstituteId;
    if (!fromBranchId || !fromInstituteId) return;
    const fromBranch = getBranchByValue(fromBranchId, fromInstituteId);
    if (fromBranch) {
      setFromBranchOptions([
        {
          ...fromBranch,
          id: fromBranchId,
          branchName: fromBranch.branchName,
        },
      ]);
    }
  }, [props.isOpen, branchOptions, addUserAccessPermissionsFormik.values.fromBranchId, addUserAccessPermissionsFormik.values.fromInstituteId]);

  function selectGroupHndlr(selectedGroup: any) {
    if (!selectedGroup) return;
    addUserAccessPermissionsFormik.setFieldValue("principalId", selectedGroup.id);
    addUserAccessPermissionsFormik.setFieldValue("principalName", selectedGroup.groupName);
    addUserAccessPermissionsFormik.setFieldValue("selectedGroup", selectedGroup);
    addUserAccessPermissionsFormik.setFieldValue("selectedEmployee", null);
  }

  function selectEmployeeHndlr(selectedEmployee: any) {
    if (!selectedEmployee) return;
    addUserAccessPermissionsFormik.setFieldValue("principalId", selectedEmployee.authUserId);
    addUserAccessPermissionsFormik.setFieldValue("principalName", selectedEmployee.employeeName);
    addUserAccessPermissionsFormik.setFieldValue("principalCode", selectedEmployee.employeeCode);
    addUserAccessPermissionsFormik.setFieldValue("selectedEmployee", selectedEmployee);
    addUserAccessPermissionsFormik.setFieldValue("selectedGroup", null);
  }

  function onInputSearchGroupChange(inputString: any) {
    if (inputString) {
      const params = { searchString: inputString };
      dispatch(
        getUserGroupsListAct(
          generateActionPayload(
            "get_user_groups_list",
            undefined,
            {
              instituteId: addUserAccessPermissionsFormik.values.instituteId,
              branchId: addUserAccessPermissionsFormik.values.branchId,
              searchString: inputString
            }
          )
        )
      );
    }
  }

  function onInputSearchChange(inputString: string) {
    const searchString = inputString?.trim();
    dispatch(resetEmployeesByFilterAct(undefined));

    if (!searchString) {
      addUserAccessPermissionsFormik.setFieldValue("principalId", "");
      addUserAccessPermissionsFormik.setFieldValue("principalName", "");
      addUserAccessPermissionsFormik.setFieldValue("principalCode", "");
      addUserAccessPermissionsFormik.setFieldValue("selectedEmployee", null);
      return;
    }

    dispatch(
      getEmployeeByFilterAct(
        generateActionPayload(
          "get_employee_by_name",
          { searchString },
          {
            branchId: addUserAccessPermissionsFormik.values.branchId,
            instituteId: addUserAccessPermissionsFormik.values.instituteId,
          }
        )
      )
    );
  }

  function addPermissionHandler() {
    const values = addUserAccessPermissionsFormik.values;
    const fromInstitute = fromInstituteOptions[0];
    const fromBranch = fromBranchOptions[0];

    const toInstitute = instituteListResp?.data?.find(
      (item: any) => String(item.id) === String(values.instituteId)
    );
    const toBranch = branchOptions.find(
      (item: any) => String(item.branchId) === String(values.branchId)
    );
    const permission = getUserAccessProfilePermissionsResp?.find(
      (item: any) => String(item.id) === String(values.permissionProfileId)
    );

    const selectedResources = props.selectedResources || [];
    const selectedNames = props.selectedNames || [];

    setManageAccessRows((prev) => [
      ...prev,
      ...selectedResources.map((resource: any, index: number) => ({
        id: "",
        rowKey: `new_${generateUniqueNumber()}_${index}`,
        isDeleted: false,
        resourceType: resource.resourceType,
        resourceId: resource.resourceId,
        resourceName: selectedNames[index]?.name,
        isForCurrentBranch: values.isForCurrentBranch,
        fromInstituteId: values.fromInstituteId,
        fromInstituteName: fromInstitute?.instituteName,
        fromInstituteShortName: fromInstitute?.shortName || "",
        fromBranchId: values.fromBranchId,
        fromBranchName: fromBranch?.branchName,
        toInstituteId: values.isForCurrentBranch ? "" : values.instituteId,
        toInstituteName: values.isForCurrentBranch ? "" : toInstitute?.instituteName,
        toInstituteShortName: toInstitute?.shortName || "",
        toBranchId: values.isForCurrentBranch ? "" : values.branchId,
        toBranchName: values.isForCurrentBranch ? "" : toBranch?.branchName,
        principalType: values.principalType,
        principalId: values.principalId,
        principalName: values.principalName,
        principalCode: values.principalCode,
        assignmentMode: "PROFILE",
        permissionProfileId: values.permissionProfileId,
        permission: permission?.profileName,
        propagateToChildren: true,
        customActions: [],
      })),
    ]);
    setIsSaveEnabled(true);
    addUserAccessPermissionsFormik.setValues((prev) => ({
      ...prev,
      instituteId: currentInstituteId,
      branchId: currentBranchId,
      principalType: "GROUP",
      principalId: "",
      principalName: "",
      principalCode: "",
      selectedGroup: null,
      selectedEmployee: null,
      permissionProfileId: "",
    }));
  }
  const removePermissionHandler = (rowKey: string) => {
    setManageAccessRows((prev) =>
      prev.map((item) =>
        item.rowKey === rowKey
          ? { ...item, isDeleted: true }
          : item
      )
    );

    if (editingPermissionRowKey === rowKey) {
      setEditingPermissionRowKey(null);
    }

    setIsSaveEnabled(true);
  };

  const isDifferentInstituteOrBranch = useMemo(() => {
    const fromInstituteId = addUserAccessPermissionsFormik.values.fromInstituteId;
    const toInstituteId = addUserAccessPermissionsFormik.values.instituteId;
    const fromBranchId = addUserAccessPermissionsFormik.values.fromBranchId;
    const toBranchId = addUserAccessPermissionsFormik.values.branchId;
    const isDifferentInstitute =
      !!fromInstituteId &&
      !!toInstituteId &&
      String(fromInstituteId) !== String(toInstituteId);
    const isDifferentBranch =
      !!fromBranchId &&
      !!toBranchId &&
      String(fromBranchId) !== String(toBranchId);
    return isDifferentInstitute || isDifferentBranch;
  }, [
    addUserAccessPermissionsFormik.values.fromInstituteId,
    addUserAccessPermissionsFormik.values.instituteId,
    addUserAccessPermissionsFormik.values.fromBranchId,
    addUserAccessPermissionsFormik.values.branchId,
  ]);

  const principalOptionsList = useMemo(() => {
    if (isDifferentInstituteOrBranch) {
      return principalOptions.filter((item) => item.id === "USER");
    }
    return principalOptions;
  }, [isDifferentInstituteOrBranch]);

  useEffect(() => {
    if (!isDifferentInstituteOrBranch) return;
    if (addUserAccessPermissionsFormik.values.principalType !== "USER") {
      addUserAccessPermissionsFormik.setFieldValue("principalType", "USER");
      addUserAccessPermissionsFormik.setFieldValue("principalId", "");
      addUserAccessPermissionsFormik.setFieldValue("principalName", "");
      addUserAccessPermissionsFormik.setFieldValue("principalCode", "");
      addUserAccessPermissionsFormik.setFieldValue("selectedGroup", null);
      addUserAccessPermissionsFormik.setFieldValue("selectedEmployee", null);
    }
  }, [isDifferentInstituteOrBranch, addUserAccessPermissionsFormik.values.principalType]);

  const canAddPermission = useMemo(() => {
    const values = addUserAccessPermissionsFormik.values;

    return (
      !!values.instituteId &&
      !!values.branchId &&
      !!values.permissionProfileId &&
      !!values.principalType &&
      !!values.principalId
    );
  }, [addUserAccessPermissionsFormik.values]);

  const resetHandler = () => {
    if (originalRoutesRef.current.length > 0) {
      setManageAccessRows(
        JSON.parse(JSON.stringify(originalRoutesRef.current))
      );
    } else {
      setManageAccessRows([]);
    }

    setEditingPermissionRowKey(null);
    setIsSaveEnabled(false);

    addUserAccessPermissionsFormik.setValues((prev) => ({
      ...prev,
      instituteId: currentInstituteId,
      branchId: currentBranchId,
      principalType: "GROUP",
      principalId: "",
      principalName: "",
      principalCode: "",
      selectedGroup: null,
      selectedEmployee: null,
      permissionProfileId: "",
    }));
  };

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    addUserAccessPermissionsFormik.setFieldValue(name, value);
    if (name === "instituteId") {
      addUserAccessPermissionsFormik.setFieldValue("branchId", "");
      addUserAccessPermissionsFormik.setFieldValue("principalId", "");
      addUserAccessPermissionsFormik.setFieldValue("principalName", "");
      addUserAccessPermissionsFormik.setFieldValue("principalCode", "");
      addUserAccessPermissionsFormik.setFieldValue("selectedEmployee", null);
      addUserAccessPermissionsFormik.setFieldValue("selectedGroup", null);
    } else if (name === "branchId") {
      addUserAccessPermissionsFormik.setFieldValue("principalId", "");
      addUserAccessPermissionsFormik.setFieldValue("principalName", "");
      addUserAccessPermissionsFormik.setFieldValue("principalCode", "");
      addUserAccessPermissionsFormik.setFieldValue("selectedEmployee", null);
      addUserAccessPermissionsFormik.setFieldValue("selectedGroup", null);
    } else if (name === "principalType") {
      addUserAccessPermissionsFormik.setFieldValue("principalId", "");
      addUserAccessPermissionsFormik.setFieldValue("principalName", "");
      addUserAccessPermissionsFormik.setFieldValue("principalCode", "");
      addUserAccessPermissionsFormik.setFieldValue("selectedEmployee", null);
      addUserAccessPermissionsFormik.setFieldValue("selectedGroup", null);
    }
  };
  const editPermissionHandler = (rowKey: string) => {
    setEditingPermissionRowKey(rowKey);
  };

  const permissionChangeHandler = (
    rowKey: string,
    permissionProfileId: string
  ) => {
    const permissionOptions = Array.isArray(
      getUserAccessProfilePermissionsResp
    )
      ? getUserAccessProfilePermissionsResp
      : [];

    const selectedPermission = permissionOptions.find(
      (item: any) =>
        String(item.id) === String(permissionProfileId)
    );

    if (!selectedPermission) return;

    setManageAccessRows((previousRows) =>
      previousRows.map((item) =>
        item.rowKey === rowKey
          ? {
            ...item,
            permissionProfileId: String(selectedPermission.id),
            permission: selectedPermission.profileName,
          }
          : item
      )
    );

    setEditingPermissionRowKey(null);
    setIsSaveEnabled(true);
  };
  const activeManageAccessRows = useMemo(() => manageAccessRows.filter((item) => !item.isDeleted), [manageAccessRows]);
  const tableColumns = useMemo(
    () =>
      generateColumnsManageAccess({
        removePermissionHandler,
        editPermissionHandler,
        permissionChangeHandler,
        editingPermissionRowKey,
        permissionOptions: Array.isArray(
          getUserAccessProfilePermissionsResp
        )
          ? getUserAccessProfilePermissionsResp
          : [],
      }),
    [
      editingPermissionRowKey,
      getUserAccessProfilePermissionsResp,
    ]
  );
  return (
    <>
      <form onSubmit={addUserAccessPermissionsFormik.handleSubmit}>
        <div className="tw-flex tw-flex-col">
          <div className="tw-shrink-0 tw-px-6 tw-pt-5">
            {props.selectedNames?.length > 0 && (
              <div className="tw-mb-5 tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-4">
                <div className="tw-flex tw-items-center tw-justify-between tw-gap-3">
                  <div>
                    <h6 className="tw-mb-1 tw-text-sm tw-font-semibold tw-text-slate-800">
                      Selected Resources
                    </h6>
                    <p className="tw-mb-0 tw-text-xs tw-text-slate-500">
                      {props.selectedNames.length} resources selected
                    </p>
                  </div>
                  <div className="tw-flex tw-flex-wrap tw-justify-end tw-gap-2">
                    {props.selectedNames.slice(0, 4).map((item: any, index: number) => (
                      <span
                        key={index}
                        className="tw-rounded-full tw-bg-indigo-50 tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-text-indigo-700"
                      >
                        {item.type}: {item.name}
                      </span>
                    ))}
                    {props.selectedNames.length > 4 && (
                      <span className="tw-rounded-full tw-bg-slate-200 tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-text-slate-700">
                        +{props.selectedNames.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
              <div className="tw-col-span-3">
                <SelectInput
                  labelText="Institute"
                  name="instituteId"
                  value={addUserAccessPermissionsFormik.values.instituteId}
                  onChange={filterHandler}
                  menuItems={instituteListResp?.data || []}
                  valueKey="id"
                  textKey="instituteName"
                  formgroupClassName="tw-mb-0 required"
                  labelClass="required"
                  isDisabled={addUserAccessPermissionsFormik.values.isForCurrentBranch}
                />
              </div>
              <div className="tw-col-span-3">
                <SelectInput
                  labelText="Branch"
                  name="branchId"
                  value={addUserAccessPermissionsFormik.values.branchId}
                  onChange={filterHandler}
                  menuItems={branchOptions}
                  valueKey="branchId"
                  textKey="branchName"
                  formgroupClassName="tw-mb-0"
                  labelClass="required"
                  isDisabled={addUserAccessPermissionsFormik.values.isForCurrentBranch}
                />
              </div>
            </div>
            <div className="tw-mt-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12 md:tw-col-span-3">
                  <SelectInput
                    name="principalType"
                    value={addUserAccessPermissionsFormik.values.principalType}
                    onChange={filterHandler}
                    menuItems={principalOptionsList || []}
                    valueKey="id"
                    textKey="name"
                    labelText="Access Type"
                    formgroupClassName="tw-mb-3"
                    labelClass="required"
                    isDisabled={!!addUserAccessPermissionsFormik.values.grantId}
                  />
                </div>
                {addUserAccessPermissionsFormik.values.principalType === "GROUP" && (
                  <div className="tw-col-span-12 md:tw-col-span-4">
                    <AutoSearchInputUpdated
                      formgroupClassName="search-box"
                      name="principalId"
                      placeHolder="Search Group"
                      onChange={onInputSearchGroupChange}
                      valueKey="id"
                      labelHeader="Group Name"
                      labelKey="groupName"
                      labelText="Group"
                      labelClass="required"
                      options={
                        Array.isArray(getUserGroupsListResp)
                          ? getUserGroupsListResp
                          : []
                      }
                      selected={addUserAccessPermissionsFormik.values.selectedGroup}
                      selectedOptionCallbck={selectGroupHndlr}
                      isDisabled={!!addUserAccessPermissionsFormik.values.grantId}
                    >
                      <i className="ri-search-line search-icon"></i>
                    </AutoSearchInputUpdated>
                  </div>
                )}
                {addUserAccessPermissionsFormik.values.principalType === "USER" && (
                  <div className="tw-col-span-12 md:tw-col-span-4">
                    <div className="search-box">
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box"
                        name="principalId"
                        placeHolder="Search Employee"
                        onChange={onInputSearchChange}
                        valueKey="authUserId"
                        labelKey="employeeCode"
                        subLabelKey="employeeName"
                        labelHeader="Employee Code"
                        subLabelHeader="Employee Name"
                        labelText="User"
                        labelClass="required"
                        options={
                          Array.isArray(getEmployeesByFilterResp)
                            ? getEmployeesByFilterResp
                            : []
                        }
                        selected={addUserAccessPermissionsFormik.values.selectedEmployee}
                        selectedOptionCallbck={selectEmployeeHndlr}
                        isDisabled={!!addUserAccessPermissionsFormik.values.grantId}
                      >
                        <i className="ri-search-line search-icon"></i>
                      </AutoSearchInputUpdated>
                    </div>
                  </div>
                )}
                <div className="tw-col-span-12 md:tw-col-span-3">
                  <SelectInput
                    name="permissionProfileId"
                    value={addUserAccessPermissionsFormik.values.permissionProfileId}
                    onChange={filterHandler}
                    menuItems={
                      Array.isArray(getUserAccessProfilePermissionsResp)
                        ? getUserAccessProfilePermissionsResp
                        : []
                    }
                    labelClass="required"
                    valueKey="id"
                    textKey="profileName"
                    labelText="Permission"
                    formgroupClassName="tw-mb-3"
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2  tw-justify-center tw-flex tw-items-center">
                  <Button
                    type="button"
                    variant="hoverInfo"
                    onClick={addPermissionHandler}
                    disabled={!canAddPermission}
                  >
                    <i className="ri-add-line" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-mt-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12">
                  <TableContainer
                    columns={tableColumns}
                    data={activeManageAccessRows}
                    divClass="table-responsive tw-border tw-rounded-lg tw-shadow tw-max-h-[320px] tw-overflow-y-auto tw-pb-0"
                    theadClass="tw-bg-[#F9FAFB]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-3 tw-border-t tw-border-slate-200 tw-bg-white tw-px-6 tw-py-4 tw-mt-4">
            <Button
              type="button"
              variant="linkBtn"
              disabled={!isSaveEnabled}
              onClick={resetHandler}
              className="!tw-px-0 tw-self-end !tw-border-0 tw-bg-transparent !tw-text-[14px] tw-font-semibold"
            >
              Reset
            </Button>
            <Button variant="secondary" type="button" onClick={props.toggle}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!isSaveEnabled}
            >
              Save Access
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ManageFileAccess;