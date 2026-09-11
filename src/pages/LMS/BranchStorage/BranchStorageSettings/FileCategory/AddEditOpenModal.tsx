import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { TextInput } from "../../../../../Components/Common";
import Button from "../../../../../Components/Common/Button";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { saveFileTypeCategoryAct } from "../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions";

const initialValues = {
  addEditOpenModalFormik: [
    {
      id: generateUniqueNumber(),
      categoryName: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  addEditOpenModalFormik: Yup.array().of(
    Yup.object().shape({
      categoryName: Yup.string()
        .nullable()
        .required("Category is required"),
    })
  ),
});

const AddEditOpenModal = (props: any) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const { instituteId } = useAppSelector(
    ({ appData }) => ({
      instituteId: appData.currentInstIdResp,
    }),
    shallowEqual
  );

  const addEditOpenModalFormik = useFormik({
    initialValues,
    validationSchema,

    onSubmit: (values) => {
      const payload = [
        {
          instituteId,
          categories: values.addEditOpenModalFormik.map((item: any) => ({
            id: props.id ? item.id : "",
            categoryName: item.categoryName,
          })),
        },
      ];
      dispatch(
        saveFileTypeCategoryAct(
          generateActionPayload(
            "save_file_category",
            undefined,
            payload
          )
        )
      );
    },
  });

  useEffect(() => {
    if (props.id && props.getFileCategoryListResp?.length > 0) {
      const selectedCategory = props.getFileCategoryListResp.find(
        (item: any) =>
          Number(item.id) === Number(props.id)
      );
      if (selectedCategory) {
        addEditOpenModalFormik.setValues({
          addEditOpenModalFormik: [
            {
              id: selectedCategory.id,
              categoryName: selectedCategory.categoryName,
            },
          ],
        });
      }
    }
  }, [props.id, props.getFileCategoryListResp]);

  const removeCategoryHandler = (event: React.MouseEvent<HTMLElement>) => {
    const rowIndex = event.currentTarget.getAttribute("data-index");

    if (rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  };

  const addCategoryHandler = () => {
    formikArrayHelpers.current?.push({
      id: generateUniqueNumber(),
      categoryName: "",
    });
  };

  return (
    <form onSubmit={addEditOpenModalFormik.handleSubmit}>
      <div className="tw-p-5">
        <div className="tw-flex tw-items-center tw-justify-between">
          <h6 className="tw-mb-0">
            Category <span className="tw-text-red-500">*</span>
          </h6>
          {!props.id && (
            <Button
              onClick={addCategoryHandler}
              type="button"
              variant="hoverInfo"
              className="!tw-px-2 !tw-py-1 tw-rounded-full"
            >
              <i className="ri-add-line" />
            </Button>
          )}
        </div>
        <div className="tw-mt-3">
          <FormikProvider value={addEditOpenModalFormik}>
            <FieldArray name="addEditOpenModalFormik">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }
                return (
                  <>
                    {addEditOpenModalFormik.values.addEditOpenModalFormik.map(
                      (category: any, index: number) => {
                        const inputFieldErrors: any =
                          addEditOpenModalFormik.errors.addEditOpenModalFormik?.[index] || {};

                        const inputFieldTouched: any =
                          addEditOpenModalFormik.touched.addEditOpenModalFormik?.[index] || {};
                        return (
                          <div
                            key={category.id}
                            className="tw-mb-3"
                          >
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-center">
                              <div className="tw-col-span-11">
                                <TextInput
                                  name={`addEditOpenModalFormik[${index}].categoryName`}
                                  value={category.categoryName}
                                  onChange={
                                    addEditOpenModalFormik.handleChange
                                  }
                                  onBlur={
                                    addEditOpenModalFormik.handleBlur
                                  }
                                  formgroupClassName="tw-mb-0"
                                  invalid={
                                    inputFieldTouched.categoryName &&
                                      inputFieldErrors.categoryName
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputFieldTouched.categoryName &&
                                      inputFieldErrors.categoryName
                                      ? inputFieldErrors.categoryName
                                      : ""
                                  }
                                />
                              </div>
                              <div className="tw-col-span-1">
                                {index !== 0 && (
                                  <Button
                                    variant="wrong"
                                    data-index={index}
                                    type="button"
                                    onClick={removeCategoryHandler}
                                    className="!tw-p-2 tw-rounded-full"
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
                        );
                      }
                    )}
                  </>
                );
              }}
            </FieldArray>
          </FormikProvider>
        </div>
        <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={props.toggle}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddEditOpenModal;