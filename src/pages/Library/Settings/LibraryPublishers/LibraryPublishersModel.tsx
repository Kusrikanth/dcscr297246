import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextInput } from "../../../../Components/Common";
import { IChangeLibraryPublishersProps } from "./LibraryPublishersTypes";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { editLibraryPublisherListAct, saveLibraryPublisherListAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  publisherDTOS: [
    {
      uniqueId: generateUniqueNumber(),
      publisherName: "",
      shortName: "",  
    },
  ],
};

const validationSchema =  Yup.object().shape({
  publisherDTOS : Yup.array().of(
    Yup.object().shape({
      publisherName: Yup.string().nullable().required('Publisher Name is required'),
      shortName: Yup.string().nullable().required('Short Name is required'),
    })
  )
})

const LibraryPublishersModel = (props: any) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const [changeLibraryPublishers, setChangeLibraryPublishers] =
    useState(initialValues);
    const dispatch = useAppDispatch();

    const {
      currentBranchIdResp: branchId,
      currentInstIdResp: instituteId,
      showApiLoader,
      getLibraryPublisherListByIdResp,
    }: any = useAppSelector(
      ({ globalData, librarysettings, appData, }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        showApiLoader: globalData.showApiLoader,
        getLibraryPublisherListByIdResp: librarysettings.getLibraryPublisherListByIdResp,
      }),
      shallowEqual
    );

    const addLibraryPublisherRef = useRef<any>({
      prevGetLibraryPublisherListByIdResp : getLibraryPublisherListByIdResp,
    })
  
    useEffect(() => {
      const { prevGetLibraryPublisherListByIdResp } = addLibraryPublisherRef.current || {};
      if(getLibraryPublisherListByIdResp && prevGetLibraryPublisherListByIdResp !== getLibraryPublisherListByIdResp){
        if(props?.publisherId){
          const { publisherName, shortName,publisherId } = getLibraryPublisherListByIdResp || {}
          ChangeLibraryPublishersFormik.setValues((prev:any)=>({...prev , publisherDTOS:[
            {
              uniqueId: publisherId,
      publisherName,
      shortName, 
            }
          ]}))
    
        }
      }
  
      addLibraryPublisherRef.current.prevGetLibraryPublisherListByIdResp = getLibraryPublisherListByIdResp;
      
    }, [getLibraryPublisherListByIdResp])

  const ChangeLibraryPublishersFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const {publisherDTOS} = values
      let payload: any = {};
      if (props.publisherId && publisherDTOS?.length > 0) {
        payload = {
              publisherName: publisherDTOS[0]?.publisherName,
              shortName: publisherDTOS[0]?.shortName,
        }
        dispatch(editLibraryPublisherListAct(generateActionPayload("edit_library_Publishers_list", { publisherId : props?.publisherId} , payload)));
      } else {
        const tempres = publisherDTOS
          ?.map((ele:any) => ({
            publisherName: ele.publisherName,
            shortName: ele.shortName
          }));
          dispatch(saveLibraryPublisherListAct(generateActionPayload("save_Library_Publishers", undefined, { branchId , ...values, publisherDTOS: tempres })));
      }
     },
  });

  useEffect(() => {
    if (!props.isOpen) {
      ChangeLibraryPublishersFormik.resetForm();
    }
  }, [props.isOpen]);

  function addNewPublisherHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        publisherName: "",
        shortName: "",
      });
    }
  }
  
  function removePublisherHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  return (
    <>
      <form>
        <div style={{ padding: "1.25rem" }}>
          <div className="tw-grid tw-grid-cols-12 tw-gap-3">
            <div className="tw-col-span-12">
              <FormikProvider value={ChangeLibraryPublishersFormik}>
                <FieldArray name="publisherDTOS">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }

                    return (
                      <>
                        {ChangeLibraryPublishersFormik.values.publisherDTOS?.length > 0 &&
                          ChangeLibraryPublishersFormik.values.publisherDTOS.map(
                            (publisher: any, index: number) => {
                              const inputFieldErrors: any =
                                (ChangeLibraryPublishersFormik.errors.publisherDTOS &&
                                  ChangeLibraryPublishersFormik.errors.publisherDTOS[index]) ||
                                {};
                              const inputFieldTouched =
                                (ChangeLibraryPublishersFormik.touched.publisherDTOS &&
                                  ChangeLibraryPublishersFormik.touched.publisherDTOS[index]) ||
                                {};

                              return (
                                <div
                                  key={publisher.uniqueId}
                                  className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-3"
                                >
                                  <div className="tw-col-span-12 lg:tw-col-span-6">
                                    <TextInput
                                      name={`publisherDTOS[${index}].publisherName`}
                                      formgroupClassName="tw-mb-0"
                                      labelText="Publisher Name"
                                      labelClass="required"
                                      value={publisher.publisherName}
                                      onChange={ChangeLibraryPublishersFormik.handleChange}
                                      onBlur={ChangeLibraryPublishersFormik.handleBlur}
                                      invalid={(inputFieldTouched.publisherName && inputFieldErrors.publisherName) ? true : false}
                                      error={(inputFieldTouched.publisherName && inputFieldErrors.publisherName) ? inputFieldErrors.publisherName : ""}
                                    />
                                  </div>
                                  <div className="tw-col-span-12 lg:tw-col-span-6 tw-flex tw-items-end tw-gap-2">
                                    <TextInput
                                      name={`publisherDTOS[${index}].shortName`}
                                      formgroupClassName="tw-mb-0"
                                      labelText="Short Name"
                                      labelClass="required"
                                      value={publisher.shortName}
                                      onChange={ChangeLibraryPublishersFormik.handleChange}
                                      invalid={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? true : false}
                                      error={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? inputFieldErrors.shortName : ""}
                                    />
                                    {index !== 0 && (
                                      <Button type="button" data-index={index}
                                        onClick={removePublisherHndlr} variant="wrong">
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
            </div>
            {!props?.publisherId && (
              <div className="tw-col-span-12">
                <Button type="button" variant="soft" onClick={addNewPublisherHndlr}>
                  <i className="ri-add-line tw-mr-2" />
                  Add New
                </Button>
              </div>
            )}
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>
            <Button
            type="submit"
              variant="primary"
              onClick={(event: any) =>
                ChangeLibraryPublishersFormik.handleSubmit(event)
              }
            >
              {props.publisherId ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default LibraryPublishersModel;
