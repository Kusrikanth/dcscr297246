import { useFormik } from 'formik';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InputCheckbox, TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDown02Icon,
  ArrowUp01Icon,
  ArrowUp02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  PencilEdit01Icon,
  PlusSignIcon,
} from '@hugeicons-pro/core-stroke-standard';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { getBranchPoliciesAct, updateBranchPoliciesAct } from '../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';

const initialValues = {
  maxUploadSize: 10,
  strictEnforce: true,
  fileTypesMode: 'allowlist',
  fileTypeLists: {
    allowlist: ['PDF', 'DOCX', 'XLSX', 'PPT', 'JPG', 'MP4'],
    blocklist: ['EXE', 'BAT', 'APK'],
  },
  categories: ['Circulars', 'Syllabus', 'Policies', 'Reports'],
  moduleTags: [
    { name: 'Assignments', enabled: true },
    { name: 'Assessments', enabled: true },
    { name: 'Curriculum', enabled: true },
    { name: 'HR', enabled: false },
    { name: 'Finance', enabled: false },
    { name: 'Admin', enabled: false },
  ],
};

const FilePolicies = () => {

  const dispatch = useAppDispatch();

  const branchPoliciesApiCall = () => {
    dispatch(
      getBranchPoliciesAct(
        generateActionPayload(
          "get_branch_policies",
          undefined,
          {
            // instituteId,
            branchId,
          }
        )
      )
    );
  };

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    getBranchPoliciesList,
    updateBranchPoliciesResp,
    userMeResp,
    branchStorageSettingsErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, login, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      getBranchPoliciesList: branchStorageSettings.getBranchPoliciesList,
      updateBranchPoliciesResp: branchStorageSettings.updateBranchPoliciesResp,
      userMeResp: login.userMeResp,
      branchStorageSettingsErrorAct: branchStorageSettings.branchStorageSettingsErrorAct,
    }), shallowEqual);

  const branchWiseNetPaidByDateRef = useRef({
    prevBranchStorageSettingsErrorAct: branchStorageSettingsErrorAct,
    prevUpdateBranchPoliciesResp: updateBranchPoliciesResp,
  });

  useEffect(() => {
    const { prevBranchStorageSettingsErrorAct, prevUpdateBranchPoliciesResp } =
      branchWiseNetPaidByDateRef.current;
    if (branchStorageSettingsErrorAct && branchStorageSettingsErrorAct !== prevBranchStorageSettingsErrorAct) {
      const { details } = branchStorageSettingsErrorAct || {}
      toast.error(details || "Something went wrong");
    } else if (updateBranchPoliciesResp && prevUpdateBranchPoliciesResp !== updateBranchPoliciesResp) {
      toast.success("Branch Policies updated successfully.");
      branchPoliciesApiCall();
    }
    branchWiseNetPaidByDateRef.current.prevBranchStorageSettingsErrorAct = branchStorageSettingsErrorAct;
    branchWiseNetPaidByDateRef.current.prevUpdateBranchPoliciesResp = updateBranchPoliciesResp;
  }, [branchStorageSettingsErrorAct, , updateBranchPoliciesResp]);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const updatePayload = {
        branchId: Number(getBranchPoliciesList?.branchId),
        updatedByName: userMeResp.username,
        policyJson: {
          maximumUploadSize: {
            sizeMb: Number(values.maxUploadSize),
            sizeConversionBytes:
              Number(values.maxUploadSize) * 1024 * 1024,
            strictEnforce: values.strictEnforce,
          },
          fileTypes: {
            mode: values.fileTypesMode.toUpperCase(),
            extensions:
              values.fileTypeLists[
              values.fileTypesMode as "allowlist" | "blocklist"
              ],
          },
        },
      };

      dispatch(
        updateBranchPoliciesAct(
          generateActionPayload(
            "update_branch_policies",
            undefined,
            updatePayload
          )
        )
      );
    },
  });

  useEffect(() => {
    if (instituteId) {
      branchPoliciesApiCall();
    }
  }, [instituteId, branchId]);

  useEffect(() => {
    if (getBranchPoliciesList?.policyJson) {
      const policyJson = getBranchPoliciesList.policyJson;

      formik.setValues({
        ...formik.values,
        maxUploadSize:
          policyJson.maximumUploadSize?.sizeMb || 0,

        strictEnforce:
          policyJson.maximumUploadSize?.strictEnforce || false,

        fileTypesMode:
          policyJson.fileTypes?.mode?.toLowerCase() || "allowlist",

        fileTypeLists: {
          allowlist:
            policyJson.fileTypes?.mode === "ALLOWLIST"
              ? policyJson.fileTypes?.extensions || []
              : [],

          blocklist:
            policyJson.fileTypes?.mode === "BLOCKLIST"
              ? policyJson.fileTypes?.extensions || []
              : [],
        },
      });
    }
  }, [getBranchPoliciesList]);

  const [fileTypeInput, setFileTypeInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [moduleTagInput, setModuleTagInput] = useState('');

  const progressWidth = useMemo(() => {
    const max = 500;
    return `${Math.min((formik.values.maxUploadSize / max) * 100, 100)}%`;
  }, [formik.values.maxUploadSize]);

  const currentFileTypes =
    formik.values.fileTypeLists[
    formik.values.fileTypesMode as 'allowlist' | 'blocklist'
    ];

  const addFileType = () => {
    const value = fileTypeInput.trim();
    if (!value) return;
    if (!currentFileTypes.includes(value)) {
      const newList = [...currentFileTypes, value];
      formik.setFieldValue(
        `fileTypeLists.${formik.values.fileTypesMode}`,
        newList,
      );
    }
    setFileTypeInput('');
  };

  const removeFileType = (value: string) => {
    const newList = currentFileTypes.filter((item: string) => item !== value);
    formik.setFieldValue(
      `fileTypeLists.${formik.values.fileTypesMode}`,
      newList,
    );
  };

  const clearFileTypes = () => {
    formik.setFieldValue(`fileTypeLists.${formik.values.fileTypesMode}`, []);
  };

  const addCategory = () => {
    const value = categoryInput.trim();
    if (!value) return;
    if (!formik.values.categories.includes(value)) {
      formik.setFieldValue('categories', [...formik.values.categories, value]);
    }
    setCategoryInput('');
  };

  const removeCategory = (value: string) => {
    formik.setFieldValue(
      'categories',
      formik.values.categories.filter((item: string) => item !== value),
    );
  };

  const clearCategories = () => {
    formik.setFieldValue('categories', []);
  };

  const addModuleTag = () => {
    const value = moduleTagInput.trim();
    if (!value) return;
    const exists = formik.values.moduleTags.some(
      (item: any) => item.name.toLowerCase() === value.toLowerCase(),
    );
    if (!exists) {
      formik.setFieldValue('moduleTags', [
        ...formik.values.moduleTags,
        { name: value, enabled: false },
      ]);
    }
    setModuleTagInput('');
  };

  const removeModuleTag = (value: string) => {
    formik.setFieldValue(
      'moduleTags',
      formik.values.moduleTags.filter((item: any) => item.name !== value),
    );
  };

  const toggleModuleTag = (value: string) => {
    formik.setFieldValue(
      'moduleTags',
      formik.values.moduleTags.map((item: any) =>
        item.name === value ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  const onUploadSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (Number.isNaN(num)) {
      formik.setFieldValue('maxUploadSize', 0);
      return;
    }
    formik.setFieldValue('maxUploadSize', Math.max(0, Math.min(num, 500)));
  };

  const handleEnter = (e: React.KeyboardEvent, cb: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      cb();
    }
  };

  return (
    <div className="tw-card">
      <div className="tw-card-header tw-flex tw-justify-between tw-items-center">
        <h4 className="tw-card-title">File Policies</h4>
        <div className="tw-flex tw-gap-2 tw-items-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => formik.resetForm()}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => formik.handleSubmit()}
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
            Save
          </Button>
        </div>
      </div>

      <div className="tw-card-body tw-space-y-6">
        {/* 1. Maximum Upload Size */}
        <div className="tw-border tw-border-slate-200 tw-rounded-2xl tw-p-5 tw-bg-white">
          <div className="tw-flex tw-items-start tw-justify-between tw-gap-4 tw-mb-4">
            <div>
              <h6 className="tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-1">
                1. Maximum Upload Size
              </h6>
              <p className="tw-text-xs tw-text-slate-400">
                Per-file cap (MB). Hard cap: 500MB.
              </p>
            </div>
            <div className="tw-bg-blue-50 tw-text-blue-700 tw-text-xs tw-font-bold tw-px-3 tw-py-1 tw-rounded-full">
              {formik.values.maxUploadSize} MB
            </div>
          </div>

          <div className="tw-flex tw-items-center tw-justify-between tw-gap-4">
            <div className="tw-flex tw-items-center tw-gap-3">
              <TextInput
                name="maxUploadSize"
                value={formik.values.maxUploadSize}
                onChange={onUploadSizeChange}
                formgroupClassName="tw-mb-0"
                inputClassName="!tw-w-24 tw-text-center"
              />
              <span className="tw-text-sm tw-font-medium tw-text-slate-500">
                MB
              </span>
            </div>

            <div className="tw-flex tw-items-center tw-gap-2">
              <InputCheckbox
                name="strictEnforce"
                value={formik.values.strictEnforce}
                onChange={formik.handleChange}
              />
              <span className="tw-text-sm tw-font-medium tw-text-slate-600">
                Strict enforce
              </span>
            </div>
          </div>

          <div className="tw-mt-5 tw-h-2 tw-w-full tw-bg-slate-100 tw-rounded-full tw-overflow-hidden">
            <div
              className="tw-h-full tw-bg-blue-500 tw-rounded-full tw-transition-all tw-duration-500"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        <div className="tw-border tw-border-slate-200 tw-rounded-2xl tw-p-5 tw-bg-white">
          <h6 className="tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-1">
            2. File Types
          </h6>
          <p className="tw-text-xs tw-text-slate-400 tw-mb-4">
            Add, edit, remove extensions. Double-click chip to edit.
          </p>

          <div className="tw-flex tw-items-center tw-gap-2 tw-mb-5">
            <TextInput
              name="fileTypeInput"
              value={fileTypeInput}
              onChange={(e) => setFileTypeInput(e.target.value)}
              // onKeyDown={(e) => handleEnter(e, addFileType)}
              placeholder="e.g., PDF"
              formgroupClassName="tw-mb-0 tw-flex-1"
            />
            <Button variant="primary" size="sm" onClick={addFileType}>
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
            </Button>
            <Button variant="soft" onClick={clearFileTypes} size="sm">
              Clear All
            </Button>
          </div>

          <div className="tw-flex tw-items-center tw-gap-6 tw-mb-4">
            <label className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-slate-600 tw-cursor-pointer">
              <input
                type="radio"
                name="fileTypesMode"
                value="allowlist"
                checked={formik.values.fileTypesMode === 'allowlist'}
                onChange={formik.handleChange}
                className="tw-w-4 tw-h-4 tw-accent-blue-600"
              />
              Allowlist
            </label>

            <label className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-slate-600 tw-cursor-pointer">
              <input
                type="radio"
                name="fileTypesMode"
                value="blocklist"
                checked={formik.values.fileTypesMode === 'blocklist'}
                onChange={formik.handleChange}
                className="tw-w-4 tw-h-4 tw-accent-blue-600"
              />
              Blocklist
            </label>
          </div>

          <div className="tw-flex tw-flex-wrap tw-gap-2">
            {currentFileTypes.map((item: string) => (
              <div
                key={item}
                onDoubleClick={() => setFileTypeInput(item)}
                className="tw-inline-flex tw-items-center tw-gap-2 tw-px-3 tw-py-1.5 tw-rounded-lg tw-bg-slate-50 tw-border tw-border-slate-200 tw-text-slate-700 tw-text-xs tw-transition hover:tw-bg-slate-100 tw-cursor-default"
              >
                <span className="tw-font-medium">{item}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFileType(item);
                  }}
                  className="tw-text-slate-400 hover:tw-text-red-500 tw-transition-colors"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Document Categories
        <div className="tw-border tw-border-slate-200 tw-rounded-2xl tw-p-5 tw-bg-white">
          <h6 className="tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-1">
            3. Document Categories
          </h6>
          <p className="tw-text-xs tw-text-slate-400 tw-mb-4">
            Add categories and set default using *.
          </p>

          <div className="tw-flex tw-items-center tw-gap-2 tw-mb-5">
            <TextInput
              name="categoryInput"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              // onKeyDown={(e) => handleEnter(e, addCategory)}
              placeholder="Add category"
              formgroupClassName="tw-mb-0 tw-flex-1"
            />
            <Button variant="primary" onClick={addCategory} size="sm">
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
            </Button>
            <Button variant="soft" onClick={clearCategories} size="sm">
              Clear All
            </Button>
          </div>

          <div className="tw-flex tw-flex-wrap tw-gap-2">
            {formik.values.categories.map((item: string) => (
              <div
                key={item}
                onDoubleClick={() => setCategoryInput(item)}
                className="tw-inline-flex tw-items-center tw-gap-2 tw-px-3 tw-py-1.5 tw-rounded-lg tw-bg-slate-50 tw-border tw-border-slate-200 tw-text-slate-700 tw-text-xs tw-transition hover:tw-bg-slate-100 tw-cursor-default"
              >
                <span className="tw-font-medium">{item}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(item);
                  }}
                  className="tw-text-slate-400 hover:tw-text-red-500 tw-transition-colors"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        4. Module Tags
        <div className="tw-border tw-border-slate-200 tw-rounded-2xl tw-p-5 tw-bg-white">
          <h6 className="tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-1">
            4. Module Tags
          </h6>
          <p className="tw-text-xs tw-text-slate-400 tw-mb-4">
            Click chip to toggle. Double-click to edit.
          </p>

          <div className="tw-flex tw-items-center tw-gap-2 tw-mb-5">
            <TextInput
              name="moduleTagInput"
              value={moduleTagInput}
              onChange={(e) => setModuleTagInput(e.target.value)}
              // onKeyDown={(e) => handleEnter(e, addModuleTag)}
              placeholder="Add module tag"
              formgroupClassName="tw-mb-0 tw-flex-1"
            />
            <Button variant="primary" size="sm" onClick={addModuleTag}>
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
            </Button>
          </div>

          <p className="tw-text-xs tw-font-medium tw-text-slate-500 tw-mb-3">
            Enabled tags apply policies in module:
          </p>

          <div className="tw-flex tw-flex-wrap tw-gap-3">
            {formik.values.moduleTags.map((item: any) => (
              <div
                key={item.name}
                className={`tw-inline-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-rounded-xl tw-text-xs tw-border tw-transition tw-cursor-pointer ${item.enabled
                    ? 'tw-bg-emerald-50 tw-border-emerald-200 tw-text-emerald-700 tw-shadow-sm'
                    : 'tw-bg-slate-50 tw-border-slate-200 tw-text-slate-500'
                  }`}
                onClick={() => toggleModuleTag(item.name)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setModuleTagInput(item.name);
                }}
              >
                <span className="tw-font-semibold">{item.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeModuleTag(item.name);
                  }}
                  className="tw-opacity-50 hover:tw-opacity-100 hover:tw-text-red-500 tw-transition-all"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <DocumentStatusWorkflow />
        <FilePathLevelsStructure /> */}
      </div>
    </div>
  );
};

export default FilePolicies;

// --- Section 6 Components & Logic ---

type HierarchyLevel = {
  id: string;
  name: string;
};

const FilePathLevelsStructure: React.FC = () => {
  const [rootLevel, setRootLevel] = useState<'Academic' | 'Non-Academic'>(
    'Academic',
  );
  const [autoFolderCreation, setAutoFolderCreation] = useState(true);
  const [levels, setLevels] = useState<HierarchyLevel[]>([
    { id: '1', name: 'Class' },
    { id: '2', name: 'Subject' },
    { id: '3', name: 'Department' },
    { id: '4', name: 'Section' },
    { id: '5', name: 'Academic Year' },
  ]);

  const addLevel = () => {
    const newId = (levels.length + 1).toString();
    setLevels([...levels, { id: newId, name: `New Level ${newId}` }]);
  };

  const removeLevel = (id: string) => {
    setLevels(levels.filter((l) => l.id !== id));
  };

  const updateLevelName = (id: string, name: string) => {
    setLevels(levels.map((l) => (l.id === id ? { ...l, name } : l)));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newLevels = [...levels];
    [newLevels[index - 1], newLevels[index]] = [
      newLevels[index],
      newLevels[index - 1],
    ];
    setLevels(newLevels);
  };

  const moveDown = (index: number) => {
    if (index === levels.length - 1) return;
    const newLevels = [...levels];
    [newLevels[index], newLevels[index + 1]] = [
      newLevels[index + 1],
      newLevels[index],
    ];
    setLevels(newLevels);
  };

  return (
    <div className="tw-border tw-border-slate-200 tw-rounded-2xl tw-p-5 tw-bg-white">
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-5">
        <div>
          <h6 className="tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-1">
            6. File Path Levels Structure
          </h6>
          <p className="tw-text-xs tw-text-slate-400">
            Build folder hierarchy and preview how paths will be created.
          </p>
        </div>
        <div className="tw-bg-blue-50 tw-text-blue-700 tw-text-[10px] tw-font-bold tw-px-3 tw-py-1 tw-rounded-full">
          {rootLevel}
        </div>
      </div>

      <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-4 tw-mb-6">
        <div className="tw-flex tw-items-center tw-gap-6">
          <div className="tw-flex tw-flex-col tw-gap-1">
            <span className="tw-text-[11px] tw-font-bold tw-text-slate-400 tw-uppercase tw-tracking-wider">
              Root Level
            </span>
            <div className="tw-flex tw-items-center tw-gap-4">
              <label className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-slate-600 tw-cursor-pointer">
                <input
                  type="radio"
                  name="rootLevel"
                  checked={rootLevel === 'Academic'}
                  onChange={() => setRootLevel('Academic')}
                  className="tw-w-4 tw-h-4 tw-accent-blue-600"
                />
                Academic
              </label>
              <label className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-slate-600 tw-cursor-pointer">
                <input
                  type="radio"
                  name="rootLevel"
                  checked={rootLevel === 'Non-Academic'}
                  onChange={() => setRootLevel('Non-Academic')}
                  className="tw-w-4 tw-h-4 tw-accent-blue-600"
                />
                Non-Academic
              </label>
            </div>
          </div>
        </div>

        <div className="tw-flex tw-items-center tw-gap-2">
          <InputCheckbox
            name="autoFolderCreation"
            value={autoFolderCreation}
            onChange={(e) => setAutoFolderCreation(e.target.checked)}
            formgroupClassName="tw-mb-0"
          />
          <span className="tw-text-sm tw-font-semibold tw-text-slate-700">
            Enable Auto Folder Creation
          </span>
        </div>
      </div>

      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
        {/* Hierarchy Builder */}
        <div className="tw-border tw-border-slate-100 tw-bg-slate-50/50 tw-rounded-2xl tw-p-4">
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
            <div>
              <h6 className="tw-text-[13px] tw-font-bold tw-text-slate-700">
                Hierarchy Builder
              </h6>
              <p className="tw-text-[10px] tw-text-slate-400">
                Reorder using ↑/↓. Rename inline.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={addLevel}
              className="tw-h-8 tw-px-3 !tw-rounded-lg"
            >
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={14}
                className="tw-mr-1"
              />
              Add Level
            </Button>
          </div>

          <div className="tw-space-y-2">
            {levels.map((level, index) => (
              <div key={level.id} className="tw-flex tw-items-center tw-gap-3">
                <span className="tw-text-[10px] tw-font-bold tw-text-slate-400 tw-w-4">
                  L{index + 1}
                </span>
                <TextInput
                  name={`level-${level.id}`}
                  value={level.name}
                  onChange={(e) => updateLevelName(level.id, e.target.value)}
                  formgroupClassName="tw-mb-0 tw-flex-1"
                  inputClassName="!tw-h-9 !tw-text-xs tw-font-semibold tw-bg-white"
                />
                <div className="tw-flex tw-items-center tw-gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="tw-w-7 tw-h-7 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-bg-white tw-border tw-border-slate-200 tw-text-slate-400 hover:tw-text-blue-500 disabled:tw-opacity-30 tw-transition-all"
                  >
                    <HugeiconsIcon icon={ArrowUp02Icon} size={14} />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === levels.length - 1}
                    className="tw-w-7 tw-h-7 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-bg-white tw-border tw-border-slate-200 tw-text-slate-400 hover:tw-text-blue-500 disabled:tw-opacity-30 tw-transition-all"
                  >
                    <HugeiconsIcon icon={ArrowDown02Icon} size={14} />
                  </button>
                  <button
                    onClick={() => removeLevel(level.id)}
                    className="tw-w-7 tw-h-7 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-bg-white tw-border tw-border-slate-200 tw-text-slate-400 hover:tw-text-red-500 tw-transition-all"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="tw-border tw-border-slate-100 tw-bg-white tw-rounded-2xl tw-p-4">
          <h6 className="tw-text-[13px] tw-font-bold tw-text-slate-700 tw-mb-1">
            Preview Folder Structure
          </h6>
          <p className="tw-text-[10px] tw-text-slate-400 tw-mb-4">
            Example path output for current level order.
          </p>

          <div className="tw-bg-slate-50 tw-border tw-border-slate-100 tw-rounded-xl tw-p-4 tw-min-h-[200px] tw-font-mono tw-text-xs tw-text-slate-600 tw-flex tw-flex-col tw-gap-1">
            <div className="tw-flex tw-items-center tw-gap-1">
              <span className="tw-text-blue-600 tw-font-bold">
                {rootLevel}/
              </span>
            </div>
            {levels.map((level, idx) => {
              const isLast = idx === levels.length - 1;
              const exampleValues: Record<string, string> = {
                Class: 'Class 10',
                Subject: 'Mathematics',
                Department: 'Secondary Dept',
                Section: 'Section A',
                'Academic Year': '2025-26',
              };
              const displayValue = level.name;

              return (
                <div
                  key={level.id}
                  className="tw-flex tw-items-center tw-gap-1"
                >
                  <span className="tw-text-slate-300">
                    {isLast ? '└─' : '├─'}
                  </span>
                  <span className="tw-text-slate-700 tw-font-medium">
                    {displayValue}/
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

type StatusItem = {
  id: number;
  name: string;
  isDefault?: boolean;
};

const initialStatuses: StatusItem[] = [
  { id: 1, name: 'Draft' },
  { id: 2, name: 'Under Review' },
  { id: 3, name: 'Approved' },
  { id: 4, name: 'Rejected' },
  { id: 5, name: 'Archived' },
];

const DocumentStatusWorkflow: React.FC = () => {
  const [statuses, setStatuses] = useState<StatusItem[]>(initialStatuses);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddStatus = () => {
    const value = inputValue.trim();
    if (!value) return;

    const newItem: StatusItem = {
      id: Date.now(),
      name: value,
    };

    setStatuses((prev) => [...prev, newItem]);
    setInputValue('');
  };

  const handleClearAll = () => {
    setStatuses([]);
    setEditingId(null);
    setEditingValue('');
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...statuses];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setStatuses(updated);
  };

  const moveDown = (index: number) => {
    if (index === statuses.length - 1) return;
    const updated = [...statuses];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setStatuses(updated);
  };

  const setDefault = (id: number) => {
    setStatuses((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: item.id === id,
      })),
    );
  };

  const handleDelete = (id: number) => {
    setStatuses((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingValue('');
    }
  };

  const startEditing = (item: StatusItem) => {
    setEditingId(item.id);
    setEditingValue(item.name);
  };

  const saveEdit = (id: number) => {
    const value = editingValue.trim();
    if (!value) return;

    setStatuses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: value } : item)),
    );
    setEditingId(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  return (
    <div className="tw-border tw-border-slate-200 tw-rounded-2xl tw-p-5 tw-bg-white">
      <div className="tw-mb-5">
        <h6 className="tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-1">
          5. Document Status Workflow
        </h6>
        <p className="tw-text-xs tw-text-slate-400">
          Add, edit, set default (★), reorder. Double-click to edit.
        </p>
      </div>

      <div className="tw-flex tw-gap-2 tw-items-center tw-mb-5">
        <TextInput
          name="statusInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add status (e.g., Published)"
          formgroupClassName="tw-mb-0 tw-flex-1"
        />

        <Button variant="primary" size="sm" onClick={handleAddStatus}>
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
        </Button>

        <Button variant="soft" size="sm" onClick={handleClearAll}>
          Clear All
        </Button>
      </div>

      <div className="tw-space-y-2">
        {statuses.map((item, index) => (
          <div
            key={item.id}
            className="tw-flex tw-items-center tw-justify-between tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-px-3 tw-py-2 tw-group"
          >
            <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1">
              <div className="tw-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-rounded-full tw-bg-slate-200 tw-text-slate-600 tw-text-[10px] tw-font-bold">
                {index + 1}
              </div>

              {editingId === item.id ? (
                <TextInput
                  name={`${item.id}`}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => saveEdit(item.id)}
                  formgroupClassName="tw-mb-0 tw-flex-1"
                  inputClassName="!tw-h-8 !tw-py-1 !tw-px-2"
                />
              ) : (
                <div
                  onDoubleClick={() => startEditing(item)}
                  className="tw-flex tw-items-center tw-gap-2 tw-cursor-default"
                >
                  <span className="tw-text-xs tw-font-semibold tw-text-slate-700">
                    {item.name}
                  </span>
                  {item.isDefault && (
                    <span className="tw-text-[10px] tw-font-bold tw-text-amber-500 tw-flex tw-items-center tw-gap-1">
                      ★ Default
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="tw-flex tw-items-center tw-gap-1.5 tw-ml-4">
              <button
                type="button"
                onClick={() => moveUp(index)}
                className="tw-text-slate-400 hover:tw-text-slate-600 tw-transition-colors disabled:tw-opacity-30"
                disabled={index === 0}
                title="Move Up"
              >
                <HugeiconsIcon icon={ArrowUp02Icon} size={14} />
              </button>

              <button
                type="button"
                onClick={() => moveDown(index)}
                className="tw-text-slate-400 hover:tw-text-slate-600 tw-transition-colors disabled:tw-opacity-30"
                disabled={index === statuses.length - 1}
                title="Move Down"
              >
                <HugeiconsIcon icon={ArrowDown02Icon} size={14} />
              </button>

              <button
                type="button"
                onClick={() => setDefault(item.id)}
                className={`${item.isDefault ? 'tw-text-amber-500' : 'tw-text-slate-400'
                  } hover:tw-text-amber-600 tw-transition-colors`}
                title="Set Default"
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
              </button>

              <button
                type="button"
                onClick={() => startEditing(item)}
                className="tw-text-slate-400 hover:tw-text-blue-500 tw-transition-colors"
                title="Edit"
              >
                <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="tw-text-slate-400 hover:tw-text-red-500 tw-transition-colors"
                title="Delete"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
