import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextInput } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { saveBreaksTypeAct, updateBreaksTypeAct } from "../../../../store/academic/timetableManagment/timetableManagmentactions";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useEffect, useRef } from "react";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import * as Yup from "yup";
import Button from "../../../../Components/Common/Button";



const initialValues: any = {
  breakTypeDtos:[
    {
    uniqueId: generateUniqueNumber(),
    breakType: "",
    }
  ]
};

const validationSchema =  Yup.object().shape({
  breakTypeDtos : Yup.array().of(
    Yup.object().shape({
      breakType: Yup.string().nullable().required('Break Type is required'),
    })
  )
})

const BreaksTypeModal = (props: any) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
    getBreaksTypeResp,
    showApiLoader
  } = useAppSelector(
    ({ timeTableManagement, globalData }) => ({
      getBreaksTypeResp: timeTableManagement.getBreaksTypeResp,
      showApiLoader: globalData.showApiLoader
    }),
    shallowEqual
  );

  const addBreaksTypeForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { breakTypeDtos } = values
      if (props.modalData) {
        const payload = {
          id: props.modalData,
          breakType: breakTypeDtos[0]?.breakType,
        }
        dispatch(updateBreaksTypeAct(generateActionPayload("update_breaks_type", undefined, payload)));
      }
      else {
        const tempres = breakTypeDtos
          ?.map((ele:any) => ({
            breakType: ele.breakType,
          }));
        const payload = {
          breakTypeDtos: tempres
        }
        dispatch(saveBreaksTypeAct(generateActionPayload("save_breaks_type", undefined, payload)));
      }
    },
  });

  useEffect(() => {
    if (props.modalData) {
      getBreaksTypeResp && getBreaksTypeResp?.data?.map((item: any) => {
        if (+item.id === +props.modalData) {
          addBreaksTypeForm.setValues((prev:any)=>({...prev , breakTypeDtos:[
            {
              uniqueId: props.modalData,
              breakType: item.breakType,
            }
          ]}))        
        }
      })
    }
  }, [getBreaksTypeResp, props.modalData]);
  
   function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
      const rowIndex = event.currentTarget.getAttribute("data-index");
      if (rowIndex !== undefined || rowIndex !== null) {
        formikArrayHelpers.current?.remove(Number(rowIndex));
      }
    }
  
  
    function addTypeofWorkHndler() {
      if (formikArrayHelpers.current) {
        formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), breakType :""});
      }
    }


  return (
    <>
      <div className="tw-p-5">

        <div className="tw-mb-4">
          <h6 className="tw-text-sm tw-font-medium tw-text-gray-700">
            <span className="tw-text-red-500 tw-mr-1">*</span>
            Break Type
          </h6>
        </div>

        <FormikProvider value={addBreaksTypeForm}>
          <FieldArray name="breakTypeDtos">
            {(arrayHelpers: ArrayHelpers) => {
              if (!formikArrayHelpers.current) {
                formikArrayHelpers.current = arrayHelpers;
              }

              return (
                <>
                  {addBreaksTypeForm.values.breakTypeDtos?.length > 0 &&
                    addBreaksTypeForm.values.breakTypeDtos.map(
                      (breakTypeDtos: any, index: number) => {
                        const inputFieldErrors: any =
                          (addBreaksTypeForm.errors.breakTypeDtos &&
                            addBreaksTypeForm.errors.breakTypeDtos[index]) ||
                          {};

                        const inputFieldTouched: any =
                          (addBreaksTypeForm.touched.breakTypeDtos &&
                            addBreaksTypeForm.touched.breakTypeDtos[index]) ||
                          {};

                        return (
                          <div
                            key={breakTypeDtos.uniqueId}
                            className="tw-mb-4"
                          >
                            <div className="tw-flex tw-items-start tw-gap-3">

                              <div className="tw-flex-1">
                                <TextInput
                                  name={`breakTypeDtos[${index}].breakType`}
                                  value={breakTypeDtos.breakType}
                                  formgroupClassName="tw-mb-0"
                                  onChange={addBreaksTypeForm.handleChange}
                                  onBlur={addBreaksTypeForm.handleBlur}
                                  invalid={
                                    inputFieldTouched.breakType &&
                                      inputFieldErrors.breakType
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputFieldTouched.breakType &&
                                      inputFieldErrors.breakType
                                      ? inputFieldErrors.breakType
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
                        )
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
            onClick={(event: any) =>
              addBreaksTypeForm.handleSubmit(event)
            }
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

export default BreaksTypeModal;
