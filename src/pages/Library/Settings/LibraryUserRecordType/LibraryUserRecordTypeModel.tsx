import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { editLibraryUserUserRecordTypeListAct, getLibraryUserRecordTypeListAct, getLibraryUserTypeListAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    userTypeId: "",
    recordTypeDTOS: [
        {
            uniqueId: generateUniqueNumber(),
            recordTypeId: "",
            recordType: "",
        },
    ]
};

const LibraryUserRecordTypeModel = (props: any) => {
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const dispatch = useAppDispatch();  

    const {
        currentBranchIdResp: branchId,
        libraryUserTypeRequestListResp,
        libraryRecordRequestListResp,
        showApiLoader,
    } = useAppSelector(
        ({ globalData, librarysettings, appData }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            libraryUserTypeRequestListResp: librarysettings.libraryUserTypeRequestListResp,
            libraryRecordRequestListResp: librarysettings.libraryRecordRequestListResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const addLibraryUserRecordTypeForm = useFormik({
        initialValues,
        onSubmit: (values) => {
            const recordTypeIds = values.recordTypeDTOS.map((item) => item.recordTypeId);
            const payload = {
                branchId,
                recordTypeIds,
            };
            dispatch(editLibraryUserUserRecordTypeListAct(generateActionPayload("edit_library_user_record_type", { userTypeId: props?.userTypeId }, payload)));
        },
    });

    useEffect(() => {
        if (props?.userTypeId && props.modalData) {
            const { branchId, userTypeId, userTypeName, recordTypeDTOS } = props.modalData;
    
            if (branchId && userTypeId && userTypeName && Array.isArray(recordTypeDTOS)) {
                addLibraryUserRecordTypeForm.setFieldValue("userTypeId", userTypeId);
                addLibraryUserRecordTypeForm.setFieldValue("userTypeName", userTypeName);
                
                const mappedRecordTypes = recordTypeDTOS.map((item, index) => ({
                    uniqueId: `recordTypeDTOS-${userTypeId}-${index}`,
                    recordTypeId: item.recordTypeId,
                    recordType: item.recordType || "",
                }));
                addLibraryUserRecordTypeForm.setFieldValue("recordTypeDTOS", mappedRecordTypes);
            }
        }
    }, [props?.userTypeId, props.modalData, libraryRecordRequestListResp]);
    

    function removeCommanAlinmentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    function addSlabHandler() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), routeName: "", routeCode: "" });
        }
    }

    const availableRecordTypes = Array.isArray(libraryRecordRequestListResp?.content) ? libraryRecordRequestListResp?.content : [];
    const selectedRecordTypes = addLibraryUserRecordTypeForm.values.recordTypeDTOS;
    const canAddMore = availableRecordTypes.length > selectedRecordTypes.length;


    return (
        <>
            <form onSubmit={addLibraryUserRecordTypeForm.handleSubmit}>
                <div style={{ padding: "1.25rem" }}>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        <div className="tw-col-span-12">
                            <SelectInput
                                name="userTypeId"
                                labelText="User Type"
                                labelClass="required"
                                value={addLibraryUserRecordTypeForm.values.userTypeId}
                                onChange={addLibraryUserRecordTypeForm.handleChange}
                                menuItems={(Array.isArray(libraryUserTypeRequestListResp?.content) && libraryUserTypeRequestListResp?.content) || []}
                                valueKey="id"
                                textKey="userType"
                                formgroupClassName="tw-mb-0"
                                isDisabled
                            />
                        </div>
                        <div className="tw-col-span-12">
                            <div className="tw-flex tw-items-center">
                                <h6 className="tw-text-sm tw-font-medium tw-text-slate-700 tw-mr-2 required tw-mb-0">
                                    Record Type
                                </h6>
                            </div>
                        </div>
                        <div className="tw-col-span-12">
                            <FormikProvider value={addLibraryUserRecordTypeForm}>
                                <FieldArray name="recordTypeDTOS">
                                    {(arrayHelpers: ArrayHelpers) => {
                                        if (!formikArrayHelpers.current) {
                                            formikArrayHelpers.current = arrayHelpers;
                                        }
                                        return (
                                            <>
                                                {addLibraryUserRecordTypeForm.values.recordTypeDTOS?.length > 0 &&
                                                    addLibraryUserRecordTypeForm.values.recordTypeDTOS.map(
                                                        (recordType: any, index: any) => {
                                                            const inputFieldErrors: any =
                                                                (addLibraryUserRecordTypeForm.errors.recordTypeDTOS &&
                                                                    addLibraryUserRecordTypeForm.errors.recordTypeDTOS[index]) ||
                                                                {};
                                                            const inputFieldTouched =
                                                                (addLibraryUserRecordTypeForm.touched.recordTypeDTOS &&
                                                                    addLibraryUserRecordTypeForm.touched.recordTypeDTOS[index]) ||
                                                                {};

                                                            return (
                                                                <div key={recordType.uniqueId} className="tw-mb-3">
                                                                    <div className="tw-flex tw-items-center">
                                                                        <SelectInput
                                                                            name={`recordTypeDTOS[${index}].recordTypeId`}
                                                                            labelClass="required"
                                                                            value={recordType.recordTypeId}
                                                                            onChange={addLibraryUserRecordTypeForm.handleChange}
                                                                            menuItems={availableRecordTypes}
                                                                            valueKey="id"
                                                                            textKey="recordType"
                                                                            formgroupClassName="tw-mb-0 tw-w-[380px]"
                                                                            invalid={(inputFieldTouched.recordTypeId && inputFieldErrors.recordTypeId) ? true : false}
                                                                                error={(inputFieldTouched.recordTypeId && inputFieldErrors.recordTypeId) ? inputFieldErrors.recordTypeId : ""}
                                                                            />
                                                                        {index !== 0 && (
                                                                            <button
                                                                                data-index={index}
                                                                                onClick={removeCommanAlinmentsHndlr}
                                                                                className="
                                                                                            tw-w-9 tw-h-9 tw-ml-3
                                                                                            tw-flex tw-items-center tw-justify-center 
                                                                                            tw-rounded-full tw-bg-white tw-border 
                                                                                            tw-border-slate-200 tw-shadow tw-text-slate-600 
                                                                                            hover:tw-bg-red-50 hover:tw-text-red-600
                                                                                          "
                                                                            >
                                                                                <i className="ri-delete-bin-2-fill" />
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
                            {canAddMore && (
                                <div className="tw-col-span-12">
                                    <Button type="button" variant="soft" onClick={addSlabHandler}>Add New</Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-pt-3">
                        <Button type="button" variant="secondary" onClick={props.toggle}>Cancel</Button>
                        <Button type="submit" variant="primary">{props.id ? "Update" : "Submit"}</Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default LibraryUserRecordTypeModel;
