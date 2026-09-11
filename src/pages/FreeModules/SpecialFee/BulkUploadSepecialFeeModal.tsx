import { shallowEqual } from "react-redux";
import {
  AutoSearchInput,
  SelectInput,
  TextArea,
  TextInput,
  UploadFileInput,
} from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  bulkUploadSpecialFeeAct,
  getSpecialFeeNamesListAct,
} from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { downloadStaticHealthFormAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import Button from "../../../Components/Common/Button";

const initialValues = {
  academicYearId: "",
  specialFeeName: "",
  categoryId: "",
  categoryName: "",
  subCategoryName: "",
  remarks: "",
  file: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic year required.").nullable(),
  specialFeeName: Yup.string().required("Fee name required.").nullable(),
  remarks: Yup.string().required("Remarks are required.").nullable(),
  file: Yup.mixed().nullable().required("file is required"),
});

const BulkUploadSepecialFeeModal = ({ toggle }) => {
  const [selectedFeeName, setSelectedFeeName] = useState(null);
  const [bulkUploadState, setbulkUploadState] = useState<any>("");
  const [errorBulkUpload, setErrorBulkUpload] = useState<any>("");
  const [showErrors, setShowErrors] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    feeTypesResp,
    feeTypeByIdResp,
    showApiLoader,
    currentBranchIdResp: branchId,
    getSpecialFeeCategoryListResp,
    addSpecialFeeResp,
    updateSpecialFeeResp,
    brchAcademicErrorResp,
    specialfeeNamesResp,
    currentInstIdResp: instituteId,
    masterFeeSettingsErrorResp,
  } = useAppSelector(
    ({
      instituteInfo,
      directoryStudent,
      branchAcademics,
      instAcademics,
      masterFeeSettings,
      globalData,
      appData,
      userManagement,
    }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      academicYearListResp: instAcademics.academicYearListResp,
      feeTypesResp: masterFeeSettings.feeTypesResp,
      addSpecialFeeResp: masterFeeSettings.addSpecialFeeResp,
      feeTypeByIdResp: masterFeeSettings.feeTypeByIdResp,
      getSpecialFeeCategoryListResp:
        masterFeeSettings.getSpecialFeeCategoryListResp,
      updateSpecialFeeResp: masterFeeSettings.updateSpecialFeeResp,
      specialfeeNamesResp: masterFeeSettings.specialfeeNamesResp,
      studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
      showApiLoader: globalData.showApiLoader,
      masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
    }),
    shallowEqual
  );

  const bulkUploadSpecialFeeFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const queryParams = {
        instituteId: instituteId,
        branchId: branchId,
        academicYearId: values.academicYearId,
        specialFeeName: values.specialFeeName,
        subCategoryName: values.subCategoryName,
        remarks: values.remarks,
        categoryId: values.categoryId,
      };
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("request", JSON.stringify(queryParams));

      dispatch(
        bulkUploadSpecialFeeAct(
          generateActionPayload("bulk_upload_special_fee", undefined, formData)
        )
      );
      setShowErrors(true);
    },
  });

  const fetchSpecialfeeNamesList = (otherProps?: any) => {
    const payload = {
      branchId,
      ...otherProps,
    };
    dispatch(
      getSpecialFeeNamesListAct(
        generateActionPayload("get_special_fee_Names", undefined, payload)
      )
    );
  };

  const downloadHealthForm = () => {
    const payload = {
      formType: "SPECIAL_FEE_BULK_UPLOAD",
    };
    dispatch(
      downloadStaticHealthFormAct(
        generateActionPayload("download_static_health_form", undefined, payload)
      )
    );
  };

  function uploadFileErrorHndlr(
    fileSize: any,
    fileType: string,
    validFileFormaters: Array<string>
  ) {
    if (!validFileFormaters.includes(fileType)) {
      return `Upload file should be of format .xlsx , .xls`;
    }
    if (!isNaN(fileSize) && Math.ceil(fileSize / (1024 * 1024)) > 2) {
      return "Upload file should be less than 2mb.";
    }
    return "";
  }

  function handleFileUploadHnlr(event: any) {
    const { name } = event.target;
    const file = event.target.files[0];
    if (name === "file") {
      let error = uploadFileErrorHndlr(file.size, file.type, [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ]);

      if (error === "") {
        setErrorBulkUpload("");
        setbulkUploadState(file);
        bulkUploadSpecialFeeFormik.setFieldValue("file", file);
      } else {
        setErrorBulkUpload(error);
      }
    }
  }

  function onInputSearchChange(inputString: any) {
    const { specialFeeName } = bulkUploadSpecialFeeFormik.values;
    if (!inputString) {
      bulkUploadSpecialFeeFormik.setFieldValue("categoryName", "");
      bulkUploadSpecialFeeFormik.setFieldValue("subCategoryName", "");
    }
    if (inputString) {
      const params = { searchString: inputString };
      fetchSpecialfeeNamesList(params);
    }
  }

  function selectedFeeNameHandler(selectedFeeName: any) {
    setSelectedFeeName(selectedFeeName);
    const catId = getSpecialFeeCategoryListResp.find(
      (item) => item.categoryName === selectedFeeName.category
    );

    bulkUploadSpecialFeeFormik.setValues((values) => ({
      ...values,
      specialFeeName: selectedFeeName?.feeName || "",
      subCategoryName: selectedFeeName?.subCategory || "",
      categoryId: catId?.id,
      categoryName: catId?.categoryName,
    }));
  }

  useEffect(() => {
    if (academicYearListResp && Array.isArray(academicYearListResp?.data)) {
      const { academicYearId } =
        academicYearListResp.data?.find(
          (year: any) => year.yearStatus === "CURRENT"
        ) || {};
      bulkUploadSpecialFeeFormik.setFieldValue(
        "academicYearId",
        academicYearId
      );
    }
  }, [academicYearListResp]);

  const { data: specialfeeNamesOptions } = specialfeeNamesResp || {};

  return (
    <>
      <div className="tw-p-4">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mb-4">

          <div>
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              value={bulkUploadSpecialFeeFormik.values.academicYearId}
              onChange={bulkUploadSpecialFeeFormik.handleChange}
              onBlur={bulkUploadSpecialFeeFormik.handleBlur}
              valueKey="academicYearId"
              textKey="academicYearName"
              labelClass="required"
              isDisabled={true}
              menuItems={academicYearListResp?.data}
              invalid={ bulkUploadSpecialFeeFormik.touched.academicYearId && bulkUploadSpecialFeeFormik.errors.academicYearId ? true : false } error={ bulkUploadSpecialFeeFormik.touched.academicYearId && bulkUploadSpecialFeeFormik.errors.academicYearId ? bulkUploadSpecialFeeFormik.errors.academicYearId : "" }
            />
          </div>

          <div>
            <AutoSearchInput
              formgroupClassName="search-box tw-mb-3"
              name="specialFeeName"
              labelClass="required"
              placeHolder="Search..."
              onChange={onInputSearchChange}
              onBlur={bulkUploadSpecialFeeFormik.handleBlur}
              valueKey="id"
              labelKey="feeName"
              labelHeader="Fee Name"
              options={specialfeeNamesOptions || []}
              selected={selectedFeeName}
              selectedOptionCallbck={selectedFeeNameHandler}
              labelText="Fee Name"
              invalid={
                bulkUploadSpecialFeeFormik.touched.specialFeeName &&
                bulkUploadSpecialFeeFormik.errors.specialFeeName
              }
              error={
                bulkUploadSpecialFeeFormik.touched.specialFeeName
                  ? bulkUploadSpecialFeeFormik.errors.specialFeeName
                  : ""
              }
            >
              <i className="ri-search-line search-icon"></i>
            </AutoSearchInput>
          </div>

          <div className="md:tw-col-span-1">
            <TextInput
              name="categoryName"
              value={bulkUploadSpecialFeeFormik.values.categoryName}
              onChange={bulkUploadSpecialFeeFormik.handleChange}
              inputType="text"
              labelText="Category"
              isReadOnly
            />
          </div>

          <div className="md:tw-col-span-1">
            <TextInput
              name="subCategoryName"
              value={bulkUploadSpecialFeeFormik.values.subCategoryName}
              onChange={bulkUploadSpecialFeeFormik.handleChange}
              inputType="text"
              labelText="Sub Category"
              isReadOnly
            />
          </div>

          <div className="tw-col-span-full">
            <TextArea
              name="remarks"
              value={bulkUploadSpecialFeeFormik.values.remarks}
              onChange={bulkUploadSpecialFeeFormik.handleChange}
              labelText="Remarks"
              onBlur={bulkUploadSpecialFeeFormik.handleBlur}
              labelClass="required"
              invalid={ bulkUploadSpecialFeeFormik.touched.remarks && bulkUploadSpecialFeeFormik.errors.remarks ? true : false } error={ bulkUploadSpecialFeeFormik.touched.remarks && bulkUploadSpecialFeeFormik.errors.remarks ? bulkUploadSpecialFeeFormik.errors.remarks : "" }
            />
          </div>

          {bulkUploadSpecialFeeFormik.values.academicYearId &&
            selectedFeeName && (
              <div className="tw-col-span-full">
                <div className="tw-flex tw-items-center tw-mb-3">
                  <div>Download Template for Special Fee :</div>
                  <div className="tw-ml-3">
                    <Button
                      variant="info"
                      onClick={downloadHealthForm}
                      disabled={showApiLoader}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            )}
        </div>

        <div className="tw-grid tw-grid-cols-1 tw-gap-4">
          <UploadFileInput
            name="file"
            labelText="Upload Excel"
            value={bulkUploadState?.name || ""}
            onChange={handleFileUploadHnlr}
            hideUploadBtn
            invalid={
              !!(
                (bulkUploadSpecialFeeFormik.touched.file &&
                  bulkUploadSpecialFeeFormik.errors.file) ||
                errorBulkUpload
              )
            }
            error={
              (bulkUploadSpecialFeeFormik.touched.file &&
                bulkUploadSpecialFeeFormik.errors.file) ||
              errorBulkUpload
            }
          />

          {masterFeeSettingsErrorResp &&
            !masterFeeSettingsErrorResp.details &&
            showErrors && (
              <div className="tw-relative tw-mt-3 tw-max-h-[200px] tw-overflow-y-auto tw-rounded tw-border tw-border-red-300 tw-bg-red-50 tw-p-3">
                <strong className="tw-text-red-700">Errors:</strong>

                <div
                  className="tw-absolute tw-top-2 tw-right-2 tw-text-gray-500 hover:tw-text-gray-700 tw-cursor-pointer"
                  onClick={() => setShowErrors(false)}
                >
                  ✕
                </div>

                <ul className="tw-mt-2">
                  {Object.entries(masterFeeSettingsErrorResp)?.map(
                    ([row, messages]: any) => (
                      <li key={row} className="tw-mb-2">
                        <strong>{row}:</strong>
                        <ul className="tw-ml-4 tw-list-disc">
                          {messages?.map((msg: string, index: number) => (
                            <li key={index} className="tw-break-words">
                              {msg}
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
        </div>

        <div className="tw-flex tw-justify-end tw-mt-4 tw-gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={toggle}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            onClick={(event: any) =>
              bulkUploadSpecialFeeFormik.handleSubmit(event)
            }
            disabled={showApiLoader}
          >
            Upload
          </Button>
        </div>
      </div>

    </>
  );
};

export default BulkUploadSepecialFeeModal;
