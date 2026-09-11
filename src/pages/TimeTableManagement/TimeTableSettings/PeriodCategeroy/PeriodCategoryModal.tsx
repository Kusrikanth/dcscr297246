import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextInput } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { savePeriodCategoryAct, updatePeriodCategoryAct } from "../../../../store/academic/timetableManagment/timetableManagmentactions";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useEffect, useRef } from "react";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import * as Yup from "yup";
import Button from "../../../../Components/Common/Button";

const initialValues: any = {
  categoriesDtos:[
    {
    uniqueId: generateUniqueNumber(),
    categoryName: "",
    }
  ]
};

const validationSchema =  Yup.object().shape({
  categoriesDtos : Yup.array().of(
    Yup.object().shape({
      categoryName: Yup.string().nullable().required('Category Name is required'),
    })
  )
})

const PeriodCategoryModal = (props:any) => {
  
  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  

  const {
      getPeriodCategoryResp,
      showApiLoader
    } = useAppSelector(
      ({ timeTableManagement, globalData }) => ({
        getPeriodCategoryResp: timeTableManagement.getPeriodCategoryResp,
        showApiLoader: globalData.showApiLoader
      }),
      shallowEqual
    );

  const addPeriodCategoryForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { categoriesDtos } = values
      if(props.modalData){
        const payload = {
          id: props.modalData,
          category: categoriesDtos[0]?.categoryName
        }
        dispatch(updatePeriodCategoryAct(generateActionPayload("update_period_category", undefined, payload)));
      }
      else{
        const tempres = categoriesDtos
          ?.map((ele:any) => ({
            categoryName: ele.categoryName,
          }));
        const payload = {
          categoriesDtos: tempres
        }    
        dispatch(savePeriodCategoryAct(generateActionPayload("save_period_category", undefined, payload)));
      }
    },
  });

  useEffect(() => {
    if (props.modalData) {
      getPeriodCategoryResp && getPeriodCategoryResp?.data?.map((item: any) => {
        if (+item.id === +props.modalData) {
          addPeriodCategoryForm.setValues((prev:any)=>({...prev , categoriesDtos:[
            {
              uniqueId: props.modalData,
              categoryName: item.category,
            }
          ]})) 
        }
      })
    }
  }, [getPeriodCategoryResp, props.modalData]);

  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
          formikArrayHelpers.current?.remove(Number(rowIndex));
        }
      }
    
    
      function addTypeofWorkHndler() {
        if (formikArrayHelpers.current) {
          formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), categoryName :""});
        }
      }
  

  return (
    <>
      <div className="tw-p-5">

        <div className="tw-mb-4">
          <h6 className="tw-text-sm tw-font-medium tw-text-gray-700">
            Category Name
            <span className="tw-text-red-500 tw-mr-1">*</span>
          </h6>
        </div>

        <FormikProvider value={addPeriodCategoryForm}>
          <FieldArray name="categoriesDtos">
            {(arrayHelpers: ArrayHelpers) => {
              if (!formikArrayHelpers.current) {
                formikArrayHelpers.current = arrayHelpers;
              }

              return (
                <>
                  {addPeriodCategoryForm.values.categoriesDtos?.length > 0 &&
                    addPeriodCategoryForm.values.categoriesDtos.map(
                      (categoriesDtos: any, index: number) => {
                        const inputFieldErrors: any =
                          (addPeriodCategoryForm.errors.categoriesDtos &&
                            addPeriodCategoryForm.errors.categoriesDtos[index]) ||
                          {};

                        const inputFieldTouched: any =
                          (addPeriodCategoryForm.touched.categoriesDtos &&
                            addPeriodCategoryForm.touched.categoriesDtos[index]) ||
                          {};

                        return (
                          <div
                            key={categoriesDtos.uniqueId}
                            className="tw-mb-4"
                          >
                            <div className="tw-flex tw-items-start tw-gap-3">

                              <div className="tw-flex-1">
                                <TextInput
                                  name={`categoriesDtos[${index}].categoryName`}
                                  value={categoriesDtos.categoryName}
                                  formgroupClassName="tw-mb-0"
                                  onChange={addPeriodCategoryForm.handleChange}
                                  onBlur={addPeriodCategoryForm.handleBlur}
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

                              {index !== 0 && (
                                <Button
                                  type="button"
                                  data-index={index}
                                  onClick={removeSlabHndlr}
                                  variant="wrong"
                                >
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

        {!props.modalData && (
          <div className="tw-mb-6">
            <Button
              onClick={addTypeofWorkHndler}
              type="button"
              variant="soft"
            >
              + Add New
            </Button>
          </div>
        )}

        <div className="tw-flex tw-justify-end tw-gap-4">

          <Button
            type="button"
            onClick={props.toggle}
            variant="secondary"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={(event: any) => {
              addPeriodCategoryForm.handleSubmit(event);
            }}
            disabled={showApiLoader}
            variant="primary"
          >
            {showApiLoader
              ? "Processing..."
              : props.modalData
                ? "Update"
                : "Submit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default PeriodCategoryModal;
