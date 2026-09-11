import React, { useRef, useEffect, useState } from 'react';
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from 'formik';
import * as Yup from 'yup';
import { generateUniqueNumber } from '../../../../../utility/commonutility';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { getAssignCurriculumListAct } from '../../../../../store/assignlanguages/assignlanguagesaction';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';
import {
  CropModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
  UploadFileInput,
} from '../../../../../Components/Common';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard } from '@hugeicons-pro/core-stroke-standard';
import {
  saveGreenReportCardCategoryItemAct,
  updateGreenReportCardCategoryItemAct,
} from '../../../../../store/examination/pvaReports/pvaReportsActions';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import ImgPreview from '../../../../../assets/imagesdps/directory/image_preview.png';
import { useModal } from '../../../../../hooks/modalhook';
import { resetAssignListCurriculumAct } from '../../../../../store/assignlanguages/assignlanguagesslice';

const hasValidId = (value: unknown) =>
  value !== null && value !== undefined && value !== '';

const revokeBlobUrl = (url?: string) => {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

const newSubAttribute = () => ({
  uniqueId: generateUniqueNumber(),
  subCategoryId: null,
  subAttributeName: '',
  isDeleted: null,
  isNew: true,
});

const newCategory = () => ({
  uniqueId: generateUniqueNumber(),
  categoryId: null,
  categoryName: '',
  fileName: '',
  file: null,
  previewUrl: '',
  subAttributes: [newSubAttribute()],
});

const initialValues = {
  academicYearId: '',
  curriculumId: '',
  manageCategory: [newCategory()],
};

const normalizeName = (value?: string | null) =>
  value?.trim().toLowerCase() || '';

interface ISubAttributeFormValue {
  isDeleted?: boolean | null;
  subAttributeName?: string | null;
}

interface ICategoryFormValue {
  categoryName?: string | null;
}

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required('Academic year is required'),
  curriculumId: Yup.string().required('Curriculum is required'),
  manageCategory: Yup.array()
    .of(
      Yup.object().shape({
        categoryName: Yup.string()
          .nullable()
          .required('Category name is required'),
        file: Yup.mixed()
          .nullable()
          .test('file-required', 'Icon is required', function (value) {
            const { previewUrl } = this.parent;
            return value !== null || previewUrl;
          }),
        subAttributes: Yup.array()
          .min(1, 'At least one sub attribute is required')
          .of(
            Yup.object().shape({
              subAttributeName: Yup.string()
                .nullable()
                .test(
                  'sub-attribute-required',
                  'Sub Attribute name is required',
                  function (value) {
                    return this.parent?.isDeleted || !!value?.trim();
                  },
                ),
            }),
          )
          .test(
            'unique-sub-attributes',
            'Duplicate sub attribute not allowed',
            function (subAttributes) {
              const list = (subAttributes || []) as ISubAttributeFormValue[];
              const activeNames =
                list
                  .filter((attr) => !attr?.isDeleted)
                  .map((attr) => normalizeName(attr?.subAttributeName))
                  .filter(Boolean) || [];

              const duplicateName = activeNames.find(
                (name, index) => activeNames.indexOf(name) !== index,
              );

              if (!duplicateName) return true;

              const duplicateIndex =
                list.findIndex(
                  (attr) =>
                    !attr?.isDeleted &&
                    normalizeName(attr?.subAttributeName) === duplicateName,
                ) ?? 0;

              return this.createError({
                path: `${this.path}[${Math.max(
                  duplicateIndex,
                  0,
                )}].subAttributeName`,
                message: 'Duplicate sub attribute not allowed',
              });
            },
          ),
      }),
    )
    .test(
      'unique-categories',
      'Duplicate category not allowed',
      function (categories) {
        const list = (categories || []) as ICategoryFormValue[];
        const categoryNames = list
          .map((category) => normalizeName(category?.categoryName))
          .filter(Boolean);

        const duplicateName = categoryNames.find(
          (name, index) => categoryNames.indexOf(name) !== index,
        );

        if (!duplicateName) return true;

        const duplicateIndex = list.findIndex(
          (category, index) =>
            index !==
              list.findIndex(
                (item) => normalizeName(item?.categoryName) === duplicateName,
              ) && normalizeName(category?.categoryName) === duplicateName,
        );

        return this.createError({
          path: `${this.path}[${Math.max(duplicateIndex, 0)}].categoryName`,
          message: 'Duplicate category not allowed',
        });
      },
    ),
});

const AddEditNewCategory = (props: any) => {
  const dispatch = useAppDispatch();
  const categoryArrayHelpersRef = useRef<ArrayHelpers | null>(null);
  const subAttrArrayHelpersRefMap = useRef<Record<number, ArrayHelpers>>({});
  const {
    closeModal: closeCropModalState,
    modalState: cropModalState,
    openModal: openCropModalState,
  } = useModal();
  const [fileTooLargeMap, setFileTooLargeMap] = useState<
    Record<number, boolean>
  >({});

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    academicYearListResp,
    getGreenReportCardCategoryByIdResp,
    getAssignListCurriculumResp,
  } = useAppSelector(
    ({ appData, globalData, instAcademics, pvaReports, assignLanguages }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      academicYearListResp: instAcademics.academicYearListResp,
      getGreenReportCardCategoryByIdResp:
        pvaReports.getGreenReportCardCategoryByIdResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
    }),
    shallowEqual,
  );

  const addEditNewCategoryFormik = useFormik<any>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      const { academicYearId, manageCategory,curriculumId } = values;

      const isFile = (file: any): file is File => file instanceof File;

      const buildSubCategories = (subAttributes: any[]) =>
        subAttributes
          .filter((attr) => attr.isDeleted || attr.subAttributeName?.trim())
          .map((attr) => ({
            ...(hasValidId(attr.subCategoryId)
              ? { subCategoryId: attr.subCategoryId }
              : {}),
            subCategoryName: attr.subAttributeName?.trim() || '',
            ...(props.editId ? { isDeleted: attr.isDeleted ?? null } : {}),
          }));

      if (props.editId) {
        const category = manageCategory[0];

        const request = {
          branchId,
          academicYearId,
          curriculumId,
          ...(hasValidId(category.categoryId)
            ? { categoryId: category.categoryId }
            : {}),
          categoryName: category.categoryName.trim(),
          subCategories: buildSubCategories(category.subAttributes),
        };

        formData.append('request', JSON.stringify(request));

        if (category.file instanceof File) {
          formData.append('icon', category.file, category.file.name);
        }

        for (const [k, v] of formData.entries()) {
          console.log(k, v instanceof File ? v.name : v);
        }

        dispatch(
          updateGreenReportCardCategoryItemAct(
            generateActionPayload(
              'update_green_report_card_category_item',
              undefined,
              formData,
            ),
          ),
        );
      } else {
        const categoriesPayload = manageCategory.map(
          (category: any, index: number) => {
            const fileKey = `categoryIcon_${index + 1}`;

            return {
              ...(isFile(category.file) ? { categoryIcon: fileKey } : {}),
              categoryName: category.categoryName.trim(),
              subCategories: buildSubCategories(category.subAttributes),
            };
          },
        );

        const request = {
          branchId,
          academicYearId,
          curriculumId,
          categories: categoriesPayload,
        };

        formData.append('request', JSON.stringify(request));

        manageCategory.forEach((category: any, index: number) => {
          if (isFile(category.file)) {
            const fileKey = `categoryIcon_${index + 1}`;
            formData.append(fileKey, category.file, category.file.name);
          }
        });

        for (const [k, v] of formData.entries()) {
          console.log(k, v instanceof File ? v.name : v);
        }

        dispatch(
          saveGreenReportCardCategoryItemAct(
            generateActionPayload(
              'save_green_report_card_category_item',
              undefined,
              formData,
            ),
          ),
        );
      }
    },
  });

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      academicYearId: addEditNewCategoryFormik.values?.academicYearId,
      branchId: branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'curriculumName',
      orderBy: 'asc',
      ...otherProps,
    };
    dispatch(
      getAssignCurriculumListAct(
        generateActionPayload('get_brch_curriculum', undefined, payload1),
      ),
    );
  };

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'academicYearId') {
      addEditNewCategoryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: '',
      }));

      if (value) {
        getCurriculumApiCall({ academicYearId: value });
      } else {
        dispatch(resetAssignListCurriculumAct(undefined));
      }
    }
  }

  function addNewCategoryHandler() {
    categoryArrayHelpersRef.current?.push(newCategory());
  }

  function removeCategoryHandler(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute('data-index');
    if (rowIndex !== null && rowIndex !== undefined) {
      const idx = Number(rowIndex);
      const categories = addEditNewCategoryFormik.values.manageCategory;
      if (categories.length <= 1) return;

      const url = categories?.[idx]?.previewUrl;
      revokeBlobUrl(url);

      categoryArrayHelpersRef.current?.remove(idx);
    }
  }

  const acceptedImageFile = ['image/jpeg', 'image/jpg', 'image/png'];

  function uploadFileErrorHndlr(fileSize?: number, fileType?: string) {
    if (!acceptedImageFile.includes(fileType || '')) {
      return `Upload file should be of format ${acceptedImageFile.join(', ')}`;
    }
    if (!isNaN(Number(fileSize)) && Number(fileSize) > 5 * 1024 * 1024) {
      return 'Upload file should be less than 5MB.';
    }
    return '';
  }

  const browseFileHandler =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = event.target;
      const file = event.target.files?.[0];
      event.currentTarget.value = '';

      if (!file) return;

      setFileTooLargeMap((prev) => ({ ...prev, [index]: false }));
      const errorMessage = uploadFileErrorHndlr(file.size, file.type);

      if (errorMessage) {
        if (file.size > 5 * 1024 * 1024) {
          setFileTooLargeMap((prev) => ({ ...prev, [index]: true }));
        }

        const oldUrl =
          addEditNewCategoryFormik.values.manageCategory?.[index]?.previewUrl;
        revokeBlobUrl(oldUrl);

        addEditNewCategoryFormik.setFieldTouched(name, true, false);
        addEditNewCategoryFormik.setFieldValue(name, null, false);
        addEditNewCategoryFormik.setFieldValue(
          `manageCategory[${index}].fileName`,
          '',
          false,
        );
        addEditNewCategoryFormik.setFieldValue(
          `manageCategory[${index}].previewUrl`,
          '',
          false,
        );
        addEditNewCategoryFormik.setFieldError(name, errorMessage);
        toast.error(errorMessage);
        return;
      }

      addEditNewCategoryFormik.setFieldError(name, '');
      addEditNewCategoryFormik.setFieldTouched(name, false, false);
      const previewUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = previewUrl;
      image.onload = () => {
        openCropModalState({
          categoryIndex: index,
          imageName: file.name,
          imageType: file.type,
          imageSrc: previewUrl || '',
        });
      };
    };

  function uploadCroppedImgHndlr(blobFile: Blob) {
    const { categoryIndex, imageName, imageType } = cropModalState.modalData;
    const newImage = new File([blobFile], imageName, { type: imageType });
    const imgUrl = URL.createObjectURL(newImage);
    const oldUrl =
      addEditNewCategoryFormik.values.manageCategory?.[categoryIndex]
        ?.previewUrl;

    revokeBlobUrl(oldUrl);
    addEditNewCategoryFormik.setFieldValue(
      `manageCategory[${categoryIndex}].file`,
      newImage,
      false,
    );
    addEditNewCategoryFormik.setFieldValue(
      `manageCategory[${categoryIndex}].fileName`,
      imageName,
      false,
    );
    addEditNewCategoryFormik.setFieldValue(
      `manageCategory[${categoryIndex}].previewUrl`,
      imgUrl,
      false,
    );
    setFileTooLargeMap((prev) => ({ ...prev, [categoryIndex]: false }));

    closeCropModalState();
  }

  function addSubAttributeHandler(categoryIndex: number) {
    const helpers = subAttrArrayHelpersRefMap.current[categoryIndex];
    helpers?.push(newSubAttribute());
  }

  function removeSubAttributeHandler(event: React.MouseEvent<HTMLElement>) {
    const cIdx = event.currentTarget.getAttribute('data-category-index');
    const sIdx = event.currentTarget.getAttribute('data-sub-index');
    if (cIdx === null || sIdx === null) return;

    const categoryIndex = Number(cIdx);
    const subIndex = Number(sIdx);

    const subAttributes =
      addEditNewCategoryFormik.values.manageCategory?.[categoryIndex]
        ?.subAttributes || [];
    const visibleSubAttributes = subAttributes.filter(
      (subAttr: any) => !subAttr?.isDeleted,
    );

    if (visibleSubAttributes.length <= 1) return;

    const currentSubAttribute = subAttributes[subIndex];

    if (props.editId && hasValidId(currentSubAttribute?.subCategoryId)) {
      addEditNewCategoryFormik.setFieldValue(
        `manageCategory[${categoryIndex}].subAttributes[${subIndex}].isDeleted`,
        true,
      );
      return;
    }

    const helpers = subAttrArrayHelpersRefMap.current[categoryIndex];
    helpers?.remove(subIndex);
  }

  useEffect(() => {
    const yearId = academicYearListResp?.data.find(
      (year: any) => year.yearStatus.toLowerCase() === 'current',
    )?.academicYearId;

    if (yearId && !props.editId) {
      addEditNewCategoryFormik.setFieldValue('academicYearId', yearId);
      getCurriculumApiCall({ academicYearId: yearId });
    }
  }, [academicYearListResp, props.editId]);

  useEffect(() => {
    if (props.editId && getGreenReportCardCategoryByIdResp) {
      const {
        categoryId,
        categoryName,
        categoryIcon,
        subCategories,
        academicYearId,
        curriculumId,
      } = getGreenReportCardCategoryByIdResp || {};

      const mappedSubAttributes =
        Array.isArray(subCategories) && subCategories.length > 0
          ? subCategories.map((subCat: any) => ({
              uniqueId: subCat?.subCategoryId ?? generateUniqueNumber(),
              subCategoryId: subCat?.subCategoryId ?? null,
              subAttributeName: subCat?.subCategoryName || '',
              isDeleted: subCat?.isDeleted ?? null,
              isNew: !hasValidId(subCat?.subCategoryId),
            }))
          : [newSubAttribute()];

      const updatedValues = {
        academicYearId: academicYearId,
        curriculumId: curriculumId,
        manageCategory: [
          {
            uniqueId: categoryId ?? props.editId ?? generateUniqueNumber(),
            categoryId: categoryId ?? props.editId ?? null,
            categoryName: categoryName || '',

            fileName: categoryIcon?.originalName || '',

            file: null,

            previewUrl: categoryIcon?.s3Url || '',

            subAttributes: mappedSubAttributes,
          },
        ],
      };

      addEditNewCategoryFormik.resetForm({
        values: updatedValues,
      });

      if (academicYearId) {
        getCurriculumApiCall({ academicYearId });
      }
    }
  }, [props.editId, getGreenReportCardCategoryByIdResp]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {};

  return (
    <>
      <div style={{ padding: '1.25rem' }}>
        <FormikProvider value={addEditNewCategoryFormik}>
          <form onSubmit={addEditNewCategoryFormik.handleSubmit}>
            <div className="row mb-3">
              <div className="col-12 col-lg-6">
                <SelectInput
                  name="academicYearId"
                  labelText="Academic Year"
                  value={addEditNewCategoryFormik.values.academicYearId}
                  onChange={filterHandler}
                  onBlur={addEditNewCategoryFormik.handleBlur}
                  menuItems={
                    Array.isArray(academicYearList) ? academicYearList : []
                  }
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  labelClass="required"
                  floatingLabel
                  invalid={
                    !!(
                      addEditNewCategoryFormik.touched.academicYearId &&
                      addEditNewCategoryFormik.errors.academicYearId
                    )
                  }
                  error={
                    addEditNewCategoryFormik.touched.academicYearId &&
                    addEditNewCategoryFormik.errors.academicYearId
                      ? addEditNewCategoryFormik.errors.academicYearId
                      : ''
                  }
                />
              </div>
              <div className="col-12 col-lg-6">
                <SelectInput
                  name="curriculumId"
                  value={addEditNewCategoryFormik.values.curriculumId}
                  onChange={addEditNewCategoryFormik.handleChange}
                  onBlur={addEditNewCategoryFormik.handleBlur}
                  menuItems={curriculumTypes || []}
                  valueKey="branchCurriculumId"
                  textKey="shortName"
                  labelText="Curriculum"
                  floatingLabel
                  formgroupClassName="tw-mb-0"
                  invalid={
                    !!(
                      addEditNewCategoryFormik.touched.curriculumId &&
                      addEditNewCategoryFormik.errors.curriculumId
                    )
                  }
                  error={
                    addEditNewCategoryFormik.touched.curriculumId &&
                    addEditNewCategoryFormik.errors.curriculumId
                      ? addEditNewCategoryFormik.errors.curriculumId
                      : ''
                  }
                />
              </div>
            </div>

            <FormikProvider value={addEditNewCategoryFormik}>
              <FieldArray name="manageCategory">
                {(categoryHelpers: ArrayHelpers) => {
                  if (!categoryArrayHelpersRef.current) {
                    categoryArrayHelpersRef.current = categoryHelpers;
                  }

                  return (
                    <>
                      {addEditNewCategoryFormik.values.manageCategory.map(
                        (categoryRow: any, cIdx: number) => {
                          const categoryErr: any =
                            (addEditNewCategoryFormik.errors.manageCategory &&
                              (
                                addEditNewCategoryFormik.errors
                                  .manageCategory as any
                              )[cIdx]) ||
                            {};
                          const categoryTouch: any =
                            (addEditNewCategoryFormik.touched.manageCategory &&
                              (
                                addEditNewCategoryFormik.touched
                                  .manageCategory as any
                              )[cIdx]) ||
                            {};

                          return (
                            <div
                              key={categoryRow.uniqueId}
                              className="border rounded p-3 mb-3"
                            >
                              <div className="row mb-3 align-items-center g-3">
                                <div className="col-md-11">
                                  <TextInput
                                    name={`manageCategory[${cIdx}].categoryName`}
                                    value={categoryRow.categoryName}
                                    placeHolder="Enter Category"
                                    labelText="Category Name"
                                    labelClass="required"
                                    onChange={
                                      addEditNewCategoryFormik.handleChange
                                    }
                                    onBlur={addEditNewCategoryFormik.handleBlur}
                                    invalid={
                                      !!(
                                        categoryTouch.categoryName &&
                                        categoryErr.categoryName
                                      )
                                    }
                                    error={
                                      categoryTouch.categoryName &&
                                      categoryErr.categoryName
                                        ? categoryErr.categoryName
                                        : ''
                                    }
                                  />
                                </div>
                                <div className="col-md-1 d-flex align-items-start">
                                  {cIdx !== 0 && (
                                    <button
                                      type="button"
                                      data-index={cIdx}
                                      onClick={removeCategoryHandler}
                                      className="btn btn-outline-danger btn-sm btn-icon btn-hover-danger"
                                    >
                                      <HugeiconsIcon
                                        icon={Delete02StrokeStandard}
                                        className="text-danger"
                                        size={18}
                                      />
                                    </button>
                                  )}
                                </div>

                                <div className="col-md-12">
                                  <div className="tw-flex tw-gap-2">
                                    <div className="tw-flex-grow">
                                      <UploadFileInput
                                        name={`manageCategory[${cIdx}].file`}
                                        labelText="Upload File"
                                        formgroupClassName="tw-mb-0"
                                        value={categoryRow.fileName || ''}
                                        onChange={browseFileHandler(cIdx)}
                                        hideUploadBtn={true}
                                        canRemove={false}
                                        invalid={
                                          !!(
                                            categoryTouch.file &&
                                            categoryErr.file
                                          )
                                        }
                                        error={
                                          categoryTouch.file && categoryErr.file
                                            ? categoryErr.file
                                            : ''
                                        }
                                        labelClass="required"
                                      />
                                    </div>

                                    <div className="tw-flex-shrink-0">
                                      <div
                                        className={classNames(
                                          'tw-flex-shrink-0 tw-ml-2 tw-relative tw-overflow-hidden tw-rounded',
                                          {
                                            'tw-border tw-rounded':
                                              !!categoryRow.previewUrl,
                                          },
                                        )}
                                      >
                                        <img
                                          src={
                                            categoryRow.previewUrl || ImgPreview
                                          }
                                          style={{
                                            height: '100px',
                                            width: '100px',
                                          }}
                                          className="tw-object-cover tw-w-full tw-h-full"
                                          alt="Preview"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {fileTooLargeMap[cIdx] && (
                                    <span className="tw-text-red-600 tw-font-bold">
                                      *File size should not exceed 5 MB
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Sub Attributes Section */}
                              <div className="tw-w-full tw-border tw-rounded tw-px-4 tw-py-3 tw-grid tw-gap-y-3 tw-relative">
                                <div className="">
                                  <p className="m-0 tw-absolute tw-px-2 tw-py-1 tw-rounded tw-bg-white tw-top-0 tw--translate-y-1/2 form-label required">
                                    Sub Attributes
                                  </p>
                                </div>

                                <div>
                                  <FieldArray
                                    name={`manageCategory[${cIdx}].subAttributes`}
                                  >
                                    {(subAttrHelpers: ArrayHelpers) => {
                                      subAttrArrayHelpersRefMap.current[cIdx] =
                                        subAttrHelpers;
                                      const visibleSubAttributesCount =
                                        categoryRow.subAttributes?.filter(
                                          (subAttr: any) => !subAttr?.isDeleted,
                                        )?.length || 0;

                                      return (
                                        <>
                                          {categoryRow.subAttributes?.map(
                                            (subAttr: any, sIdx: number) => {
                                              if (subAttr?.isDeleted)
                                                return null;

                                              const subErr: any =
                                                (categoryErr.subAttributes &&
                                                  (
                                                    categoryErr.subAttributes as any
                                                  )[sIdx]) ||
                                                {};
                                              const subTouch: any =
                                                (categoryTouch.subAttributes &&
                                                  (
                                                    categoryTouch.subAttributes as any
                                                  )[sIdx]) ||
                                                {};

                                              return (
                                                <div
                                                  key={subAttr.uniqueId}
                                                  className="row mb-2 align-items-center"
                                                >
                                                  <div className="col-10">
                                                    <TextInput
                                                      name={`manageCategory[${cIdx}].subAttributes[${sIdx}].subAttributeName`}
                                                      value={
                                                        subAttr.subAttributeName
                                                      }
                                                      placeHolder="Enter Sub Attribute"
                                                      formgroupClassName="mb-0"
                                                      onChange={
                                                        addEditNewCategoryFormik.handleChange
                                                      }
                                                      onBlur={
                                                        addEditNewCategoryFormik.handleBlur
                                                      }
                                                      invalid={
                                                        !!(
                                                          subTouch.subAttributeName &&
                                                          subErr.subAttributeName
                                                        )
                                                      }
                                                      error={
                                                        subTouch.subAttributeName &&
                                                        subErr.subAttributeName
                                                          ? subErr.subAttributeName
                                                          : ''
                                                      }
                                                    />
                                                  </div>
                                                  <div className="col-2 d-flex align-items-start">
                                                    {visibleSubAttributesCount >
                                                      1 && (
                                                      <button
                                                        type="button"
                                                        data-category-index={
                                                          cIdx
                                                        }
                                                        data-sub-index={sIdx}
                                                        onClick={
                                                          removeSubAttributeHandler
                                                        }
                                                        className="btn btn-outline-danger btn-sm btn-icon btn-hover-danger"
                                                      >
                                                        <HugeiconsIcon
                                                          icon={
                                                            Delete02StrokeStandard
                                                          }
                                                          className="text-danger"
                                                          size={18}
                                                        />
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            },
                                          )}
                                        </>
                                      );
                                    }}
                                  </FieldArray>
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <button
                                    type="button"
                                    className="btn-sm btn btn-outline-secondary"
                                    onClick={() => addSubAttributeHandler(cIdx)}
                                  >
                                    + Add Sub Attribute
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}
                      {!props.editId && (
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => addNewCategoryHandler()}
                          >
                            + Add New Category
                          </button>
                        </div>
                      )}
                    </>
                  );
                }}
              </FieldArray>
            </FormikProvider>

            <div className="row mt-3">
              <div className="d-flex ms-auto w-auto gap-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={props.toggle}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success px-4"
                  disabled={showApiLoader}
                >
                  {props.editId ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </FormikProvider>
      </div>
      <ModalContainerUpdated
        id="upload-new-category-image-modal"
        isOpen={cropModalState.showModal}
        toggle={closeCropModalState}
        modalTitle="Upload Image"
        modalSize="md"
      >
        <CropModal
          closeModalHndler={closeCropModalState}
          modalData={cropModalState.modalData}
          uploadCroppedImgHndlr={uploadCroppedImgHndlr}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default AddEditNewCategory;
