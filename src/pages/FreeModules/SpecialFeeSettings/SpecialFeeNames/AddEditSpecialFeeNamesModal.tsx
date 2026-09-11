import React, { useEffect, useRef, useState } from "react";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import * as Yup from "yup";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  addSpecialFeeNameItemsAct,
  getSpecialFeeCategoryListAct,
  updateSpecialFeeNameItemAct,
} from "../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  specialFeeNameList: [
    {
      id: generateUniqueNumber(),
      feeName: "",
      category: "",
      subCategory: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  specialFeeNameList: Yup.array().of(
    Yup.object().shape({
      feeName: Yup.string().required("Fee Name is required"),
      category: Yup.string().required("Category is required"),
      subCategory: Yup.string().required("Subcategory is required"),
    })
  ),
});

const AddEditSpecialFeeNamesModal = ({ isOpen, toggle,  branchId, feeNameItemId }) => {
  const [newSpecialFeeNamesState, setNewSpecialFeeNamesState] =
    useState(initialValues);

  const dispatch = useAppDispatch();

  const {
    // currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    specialfeeNameByIdResp,
    getSpecialFeeCategoryListResp,
  }: any = useAppSelector(
    ({ appData, globalData, masterFeeSettings }) => ({
      // currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      specialfeeNameByIdResp: masterFeeSettings.specialfeeNameByIdResp,
      getSpecialFeeCategoryListResp:
        masterFeeSettings.getSpecialFeeCategoryListResp,
    }),
    shallowEqual
  );

  const specialFeeNamesFormik: any = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: newSpecialFeeNamesState,
    onSubmit: (values) => {
      const { specialFeeNameList } = values;
      if (feeNameItemId && specialFeeNameList?.length > 0) {
        const payload = {
          feeName: specialFeeNameList[0]?.feeName,
          category: specialFeeNameList[0]?.category,
          subCategory: specialFeeNameList[0]?.subCategory,
        };

        dispatch(
          updateSpecialFeeNameItemAct(
            generateActionPayload(
              "update_special_fee_name_item",
              {
                feeNameId: feeNameItemId,
              },
              payload
            )
          )
        );
      } else {
        const tempFeeNameList = specialFeeNameList.map((item) => ({
          feeName: item.feeName,
          category: item.category,
          subCategory: item.subCategory,
        }));

        const payload = {
          branchId,
          instituteId,
          feeNames: tempFeeNameList,
        };

        dispatch(
          addSpecialFeeNameItemsAct(
            generateActionPayload("add_special_fee_names", undefined, payload)
          )
        );
      }
    },
  });

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const specialFeeCategoryList = () => {
    let payload = {
      branchId,
    };
    dispatch(
      getSpecialFeeCategoryListAct(
        generateActionPayload(
          "get_special_fee_category_list",
          undefined,
          payload
        )
      )
    );
  };

  function addNewFeeNameItemHandler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        feeName: "",
        category: "",
        subCategory: "",
      });
    }
  }

  function removeFeeNameItemHandler(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  useEffect(() => {
    if (isOpen && feeNameItemId && specialfeeNameByIdResp) {
      setNewSpecialFeeNamesState({
        specialFeeNameList: [
          {
            id: specialfeeNameByIdResp?.id,
            feeName: specialfeeNameByIdResp?.feeName,
            category: specialfeeNameByIdResp?.category ?? "",
            subCategory: specialfeeNameByIdResp?.subCategory,
          },
        ],
      });
    } else {
      setNewSpecialFeeNamesState(initialValues);
    }
  }, [
    isOpen,
    feeNameItemId,
    specialfeeNameByIdResp,
    getSpecialFeeCategoryListResp,
  ]);

  useEffect(() => {
    specialFeeCategoryList();
  }, []);

  return (
    <div className="tw-p-5">

      <div className="tw-mb-6">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
          <div className="tw-col-span-5">
            <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
              Fee Name <span className="tw-text-red-500">*</span>
            </h6>
          </div>
          <div className="tw-col-span-3">
            <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
              Category <span className="tw-text-red-500">*</span>
            </h6>
          </div>
          <div className="tw-col-span-3">
            <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
              Sub Category <span className="tw-text-red-500">*</span>
            </h6>
          </div>
          <div className="tw-col-span-1"></div>
        </div>
      </div>

      <FormikProvider value={specialFeeNamesFormik}>
        <FieldArray name="specialFeeNameList">
          {(arrayHelpers) => {
            if (!formikArrayHelpers.current) {
              formikArrayHelpers.current = arrayHelpers;
            }

            return (
              <>
                {specialFeeNamesFormik.values.specialFeeNameList?.length > 0 &&
                  specialFeeNamesFormik.values.specialFeeNameList.map(
                    (feeNameItem, idx) => {
                      const inputFiledErrors =
                        (specialFeeNamesFormik.errors.specialFeeNameList &&
                          specialFeeNamesFormik.errors.specialFeeNameList[idx]) ||
                        {};

                      const inputFiledTouched =
                        (specialFeeNamesFormik.touched.specialFeeNameList &&
                          specialFeeNamesFormik.touched.specialFeeNameList[idx]) ||
                        {};

                      return (
                        <div
                          key={feeNameItem.id || idx}
                          className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4 tw-items-start"
                        >
                          <div className="tw-col-span-5">
                            <TextInput
                              name={`specialFeeNameList[${idx}].feeName`}
                              value={feeNameItem.feeName}
                              formgroupClassName="tw-mb-0"
                              onChange={specialFeeNamesFormik.handleChange}
                              onBlur={specialFeeNamesFormik.handleBlur}
                              invalid={
                                inputFiledTouched.feeName &&
                                  inputFiledErrors.feeName
                                  ? true
                                  : false
                              }
                              error={
                                inputFiledTouched.feeName &&
                                  inputFiledErrors.feeName
                                  ? inputFiledErrors.feeName
                                  : ""
                              }
                              placeHolder="Enter Fee Name"
                            />
                          </div>

                          <div className="tw-col-span-3">
                            <SelectInput
                              name={`specialFeeNameList[${idx}].category`}
                              value={feeNameItem.category}
                              menuItems={
                                Array.isArray(getSpecialFeeCategoryListResp)
                                  ? getSpecialFeeCategoryListResp
                                  : []
                              }
                              valueKey="categoryName"
                              textKey="categoryName"
                              formgroupClassName="tw-mb-0"
                              onChange={specialFeeNamesFormik.handleChange}
                              onBlur={specialFeeNamesFormik.handleBlur}
                              invalid={
                                inputFiledTouched.category &&
                                  inputFiledErrors.category
                                  ? true
                                  : false
                              }
                              error={
                                inputFiledTouched.category &&
                                  inputFiledErrors.category
                                  ? inputFiledErrors.category
                                  : ""
                              }
                            />
                          </div>

                          <div className="tw-col-span-3">
                            <TextInput
                              name={`specialFeeNameList[${idx}].subCategory`}
                              value={feeNameItem.subCategory}
                              formgroupClassName="tw-mb-0"
                              onChange={specialFeeNamesFormik.handleChange}
                              onBlur={specialFeeNamesFormik.handleBlur}
                              invalid={
                                inputFiledTouched.subCategory &&
                                  inputFiledErrors.subCategory
                                  ? true
                                  : false
                              }
                              error={
                                inputFiledTouched.subCategory &&
                                  inputFiledErrors.subCategory
                                  ? inputFiledErrors.subCategory
                                  : ""
                              }
                              placeHolder="Enter Sub Category"
                            />
                          </div>

                          <div className="tw-col-span-1 tw-flex tw-items-center">
                            {idx !== 0 && (
                              <button
                                type="button"
                                data-index={idx}
                                onClick={removeFeeNameItemHandler}
                                className="tw-p-2 tw-rounded-md hover:tw-bg-red-50 tw-transition"
                              >
                                <HugeiconsIcon
                                  icon={Delete02StrokeStandard}
                                  className="tw-text-red-500"
                                  size={18}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
              </>
            );
          }}
        </FieldArray>
      </FormikProvider>

      {!feeNameItemId && (
        <div className="tw-mb-6">
          <Button
            type="button"
            onClick={addNewFeeNameItemHandler}
            variant="soft"
          >
            Add New
          </Button>
        </div>
      )}

      {/* Footer Buttons */}
      <div className="tw-flex tw-justify-end tw-gap-3 tw-border-t tw-pt-4">
        <Button
          type="button"
          onClick={toggle}
          variant="secondary"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          onClick={(event) => specialFeeNamesFormik.handleSubmit(event)}
          disabled={showApiLoader}
          variant="primary"
        >
          {feeNameItemId ? "Update" : "Submit"}
        </Button>
      </div>

    </div>
  );
};

export default AddEditSpecialFeeNamesModal;
