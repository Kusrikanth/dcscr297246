import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextInput } from "../../../../Components/Common";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editSubAlingmentsListAct } from "../../../../store/healthrecords/healthrecordsaction";
import { shallowEqual } from "react-redux";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  alignId: "",
  alignName: "",
  subAlimentIds: [
    {
      uniqueId: generateUniqueNumber(),
      subAlimentId: "",
      alignName: "",
      isDeleted: 0,
    },
  ],
};

const validationSchema = Yup.object().shape({
  alignName: Yup.string().nullable().required('Ailment Name is required'),
  subAlimentIds: Yup.array().of(
    Yup.object().shape({
      alignName: Yup.string().nullable().required('Sub Ailment is required'),
    })
  )
})

const SubAlingmentsModel = (props: any) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();
  const [isEditable, setIsEditable] = useState(false);

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getSubAlingmentsListResp,
  } = useAppSelector(
    ({ healthRecords, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getSubAlingmentsListResp: healthRecords.getSubAlingmentsListResp,
    }),
    shallowEqual
  );

  const addCommanAlimentsFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { alignId, alignName, subAlimentIds } = values;
      let payload;
      const subAliments = subAlimentIds.map((ele: any) => ({
        subAlignId: ele.subAlimentId || null,
        subAlignName: ele.alignName,
        isDeleted: ele.isDeleted,
      }));
      payload = { alignId, alignName, subAliments };
        dispatch(editSubAlingmentsListAct(generateActionPayload("edit_sub_alingments_list", { id: alignId }, payload)));
    },
  });

  useEffect(() => {
    if (props?.id && props.editModalData) {
      const { data: subAlignment } = { 'data': props.editModalData };
      if (subAlignment) {
        const { id, alimentName, subAlimentName } = subAlignment;
        if (id && alimentName && subAlimentName) {
          addCommanAlimentsFormik.setFieldValue('alignId', id);
          addCommanAlimentsFormik.setFieldValue('alignName', alimentName);
          const newSubAlimentIds = subAlimentName.map((item: { ailmentName: string; id: any; alimentName: any; subAlimentName: any; }, j: any) => ({
            uniqueId: `subAlignment-${id}-${j}`,
            alimentId: id || "",
            alimentName: alimentName || "",
            subAlimentId: item.id,
            alignName: item.ailmentName || "",
            isDeleted: 0,
          }));
          addCommanAlimentsFormik.setFieldValue('subAlimentIds', newSubAlimentIds);
        }
      }
    }
  }, [props.id, props.editModalData, getSubAlingmentsListResp]);

  function addNewCommanAlimentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        alignName: "",
        isDeleted: 0,
      });
    }
  }

  function removeCommanAlinmentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined && rowIndex !== null) {
      addCommanAlimentsFormik.setFieldValue(`subAlimentIds[${rowIndex}].isDeleted`, 1);
    }
  }

  function editCommanAlinmentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsEditable(!isEditable);
  }
  return (
    <>
      <form>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-1 tw-gap-4">

            {/* Common Ailment */}
            <div className="tw-flex tw-items-center">
              <TextInput
                name="alignName"
                labelText="Common Ailment"
                labelClass="required tw-font-bold"
                formgroupClassName="tw-mb-3 tw-flex-1 tw-pr-2"
                value={addCommanAlimentsFormik.values.alignName}
                onChange={addCommanAlimentsFormik.handleChange}
                onBlur={addCommanAlimentsFormik.handleBlur}
                isDisabled={props?.id && !isEditable}
                invalid={(addCommanAlimentsFormik.touched.alignName && addCommanAlimentsFormik.errors.alignName) ? true : false}
                  error={(addCommanAlimentsFormik.touched.alignName && addCommanAlimentsFormik.errors.alignName) ? addCommanAlimentsFormik.errors.alignName : ""}
              />

              <Button
                onClick={editCommanAlinmentsHndlr}
                variant="soft"
                className="!tw-p-2"
              >
                <i className="tw-text-blue-600 ri-pencil-fill tw-text-base" />
              </Button>
            </div>

            {/* Sub Ailment Label */}
            <div className="tw-flex">
              <h6 className="tw-text-sm tw-font-medium required tw-mr-2">
                Sub Ailment
              </h6>
            </div>

            {/* Sub Ailment List */}
            <div>
              <FormikProvider value={addCommanAlimentsFormik}>
                <FieldArray name="subAlimentIds">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }

                    return (
                      <>
                        {addCommanAlimentsFormik.values.subAlimentIds?.length > 0 &&
                          addCommanAlimentsFormik.values.subAlimentIds?.map((alignName: any, index: any) => {
                            const inputFieldErrors: any = addCommanAlimentsFormik.errors.subAlimentIds && addCommanAlimentsFormik.errors.subAlimentIds[index] || {};
                            const inputFieldTouched = addCommanAlimentsFormik.touched.subAlimentIds && addCommanAlimentsFormik.touched.subAlimentIds[index] || {};

                              return (
                                alignName.isDeleted === 0 && (
                                  <div
                                    key={alignName.uniqueId}
                                    className="tw-mb-3"
                                  >
                                    <div className="tw-flex tw-items-center">
                                      <TextInput
                                        name={`subAlimentIds[${index}].alignName`}
                                        formgroupClassName="tw-mb-0 tw-flex-1"
                                        value={alignName.alignName}
                                        inputClassName="tw-w-[90%]"
                                        onChange={addCommanAlimentsFormik.handleChange}
                                        onBlur={addCommanAlimentsFormik.handleBlur}
                                        invalid={(inputFieldTouched.alignName && inputFieldErrors.alignName) ? true : false}
                                        error={(inputFieldTouched.alignName && inputFieldErrors.alignName) ? inputFieldErrors.alignName : ""}
                                      />

                                      {index !== 0 && (
                                        <Button
                                          data-index={index}
                                          onClick={removeCommanAlinmentsHndlr}
                                          variant="wrong"
                                          className="!tw-rounded-full !tw-p-2"
                                        >
                                          <i className="ri-delete-bin-2-fill tw-text-red-300" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )
                              );
                            }
                          )}
                      </>
                    );
                  }}
                </FieldArray>
              </FormikProvider>
            </div>

            {/* Add New Sub Ailment */}
            {!props?.alignId && (
              <div>
                <Button
                variant="soft"
                  onClick={addNewCommanAlimentsHndlr}
                 
                >
                  <i className="ri-add-line tw-mr-2" />
                  Add New
                </Button>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mb-1">
              <Button
                type="button"
                variant="secondary"
                onClick={props.toggle}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={(event: any) =>
                  addCommanAlimentsFormik.handleSubmit(event)
                }
              >
                {props.alignId ? "Update" : "Submit"}
              </Button>
            </div>

          </div>
        </div>
      </form>
    </>
  );
};

export default SubAlingmentsModel;
