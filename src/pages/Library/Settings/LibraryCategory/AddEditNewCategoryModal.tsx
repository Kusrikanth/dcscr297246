import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { TextInput } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import {
  editLibraryCategoryItemAct,
  saveLibraryCategoriesAct,
} from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  categoriesList: [
    {
      id: generateUniqueNumber(),
      category: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  categoriesList: Yup.array().of(
    Yup.object().shape({
      category: Yup.string()
        .required("Category is required")
        .test("is-unique", "Duplicate category not allowed", function (value) {
          const { path, parent, options } = this;

          const list = options.context?.categoriesList || [];

          if (!value) return true;

          const duplicates = list.filter(
            (item: any) =>
              item.category?.trim().toLowerCase() === value.trim().toLowerCase()
          );

          if (duplicates.length > 1) {
            return this.createError({
              path,
              message: "Duplicate category not allowed",
            });
          }

          return true;
        })
        .nullable(),
    })
  ),
});

const AddEditNewCategoryModal = ({ isOpen, toggle, categoryId }) => {
  const [newCategoryState, setCategoryState] = useState(initialValues);

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryCategoryItemByIdResp,
  }: any = useAppSelector(
    ({ appData, globalData, librarysettings }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,

      libraryCategoryItemByIdResp: librarysettings.libraryCategoryItemByIdResp,
    }),
    shallowEqual
  );

  const categoriesFormik: any = useFormik({
    enableReinitialize: true,
    initialValues: newCategoryState,
    validationSchema,
    onSubmit: (values) => {
      const { categoriesList } = values;
      if (categoryId && categoriesList?.length > 0) {
        const payload = {
          category: categoriesList[0]?.category,
        };

        dispatch(
          editLibraryCategoryItemAct(
            generateActionPayload(
              "edit_library_category_item",
              {
                categoryId: categoryId,
              },
              payload
            )
          )
        );
      } else {
        const tempCategories = categoriesList.map(
          (category) => category.category
        );
        const payload = {
          branchId,
          category: tempCategories,
        };

        dispatch(
          saveLibraryCategoriesAct(
            generateActionPayload("save_library_categories", undefined, payload)
          )
        );
      }
    },
  });

  const dispatch = useDispatch();

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  function addNewCategoryHandler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        category: "",
      });
    }
  }

  function removeCategoryHandler(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  useEffect(() => {
    if (isOpen && categoryId && libraryCategoryItemByIdResp) {
      setCategoryState({
        categoriesList: [
          {
            id: libraryCategoryItemByIdResp?.id,
            category: libraryCategoryItemByIdResp?.category,
          },
        ],
      });
    } else {
      setCategoryState(initialValues);
    }
  }, [isOpen, categoryId, libraryCategoryItemByIdResp]);

  return (
    <div style={{ padding: "1.25rem" }}>
      <div className="tw-mb-4">
        <div>
          <div>
            <div className="tw-flex">
              <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700 tw-relative">
                Category
                <span className="tw-text-red-500 tw-ml-1">*</span>
              </h6>
            </div>
          </div>
        </div>
        <div>
          <FormikProvider value={categoriesFormik}>
            <FieldArray name="categoriesList">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }
                return (
                  <>
                    {categoriesFormik.values.categoriesList?.length > 0 &&
                      categoriesFormik.values.categoriesList?.map(
                        (categoryItem: any, idx: any) => {
                          const inputFieldErrors: any =
                            (categoriesFormik.errors.categoriesList &&
                              categoriesFormik.errors.categoriesList[idx]) ||
                            {};
                          const inputFieldTouched: any =
                            (categoriesFormik.touched.categoriesList &&
                              categoriesFormik.touched.categoriesList[idx]) ||
                            {};

                          return (
                            <div key={categoryItem.id} className="tw-mb-3 tw-flex tw-gap-2">
                              <div className="tw-flex-1">
                                <TextInput
                                  name={`categoriesList[${idx}].category`}
                                  value={categoryItem.category}
                                  formgroupClassName="tw-mb-0"
                                  onChange={categoriesFormik.handleChange}
                                  onBlur={categoriesFormik.handleBlur}
                                  invalid={
                                    inputFieldTouched.category &&
                                      inputFieldErrors.category
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputFieldTouched.category &&
                                      inputFieldErrors.category
                                      ? inputFieldErrors.category
                                      : ""
                                  }
                                />
                              </div>
                              <div className="tw-w-10 tw-flex tw-items-center">
                                {idx !== 0 && (
                                  <Button type="button" data-index={idx}
                                    onClick={removeCategoryHandler} variant="wrong">
                                    <HugeiconsIcon
                                      icon={Delete02StrokeStandard}
                                      className="tw-text-red-600"
                                      size={18}
                                    />
                                  </Button>
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
          {!categoryId && (
            <div>
              <Button type="button" className="!tw-px-2 !tw-py-1 tw-flex tw-items-center tw-justify-center" variant="soft" onClick={addNewCategoryHandler}>
                <i className="ri-add-line tw-mr-2" />
                Add New
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="tw-flex tw-justify-end tw-gap-3">
        <Button type="button" variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={(event: any) => categoriesFormik.handleSubmit(event)}
          disabled={showApiLoader}
        >
          {categoryId ? "Update" : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default AddEditNewCategoryModal;
