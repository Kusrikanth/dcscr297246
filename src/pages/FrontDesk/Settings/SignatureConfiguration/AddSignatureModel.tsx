import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { BrowseFile, ConfirmationModal, InputCheckbox, MultiSelectCheckbox, SelectInput, TextInput, TextInputWithRegex } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { saveSignatureAct, updateSignatureAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { shallowEqual } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon, Tick01Icon } from "@hugeicons-pro/core-stroke-standard";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { useModal } from "../../../../hooks/modalhook";
import { saveAdmissionSignatureAct, updateAdmissionSignatureAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";

const initialValues = {
    curriculumId: "",
    branchClassIds: [] as { classId: string; shortName: string }[],
    signatureLabel: "",
    signatureName: "",
    signatureOrder: "",
    signatureFile: null as File | null,
    signatureImage: "",
    isDisplayTc: false,
    isDisplayBonafide: false,
    signatureDto: [
        {
            uniqueId: generateUniqueNumber(),
            signatureLabel: "",
            signatureName: "",
            signatureOrder: "",
            signatureFile: null as File | null,
            signatureImage: "",
            signatureImageName: "",
    isDisplayTc: false,
    isDisplayBonafide: false,
            isDeleted: false,
        }
    ]
};

export const getDefaultSignatureValidation = () =>
    Yup.object().shape({
        curriculumId: Yup.string().required("Curriculum is required.").nullable(),
        branchClassIds: Yup.array()
            .of(
                Yup.object().shape({
                    classId: Yup.string().required(),
                    shortName: Yup.string().nullable(),
                })
            )
            .min(1, "At least one Class must be selected"),
        signatureOrder: Yup.string().required("Order is required.").nullable(),
        signatureLabel: Yup.string()
            .nullable()
            .test(
                "at-least-one-filled",
                "Label or Name is required.",
                function (value) {
                    const { signatureName } = this.parent;
                    return !!(value || signatureName);
                }
            ),
        signatureName: Yup.string()
            .nullable()
            .test(
                "at-least-one-filled",
                "Label or Name is required.",
                function (value) {
                    const { signatureLabel } = this.parent;
                    return !!(value || signatureLabel);
                }
            ),
    });

export const getEditSignatureValidation = () =>
    Yup.object().shape({
        curriculumId: Yup.string().required("Curriculum is required.").nullable(),
        branchClassIds: Yup.array()
            .of(
                Yup.object().shape({
                    classId: Yup.string().required(),
                    shortName: Yup.string().nullable(),
                })
            )
            .min(1, "At least one Class must be selected"),
    });

const AddSignatureModel = (props: any) => {

    const dispatch = useAppDispatch();
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const validationSchema = props.id ? getEditSignatureValidation() : getDefaultSignatureValidation();
    const { closeModal: closeDelDocModal, modalState: delDocModalState, openModal: openDelDocModal } = useModal();
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getAdmissionSignatureListResp,
        getAssignLanClassListResp,
        getAssignListCurriculumResp,

    } = useAppSelector(
        ({ globalData, appData, assignLanguages, admissionAvailabilityRequest }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getAdmissionSignatureListResp: admissionAvailabilityRequest.getAdmissionSignatureListResp,
            getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
            getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,

        }),
        shallowEqual
    );

    useEffect(() => {
        if (props.id) {
            const data = getAdmissionSignatureListResp?.find((item: any) => +item.id === +props.id);
            if (data) {
                changeSignatureForm.setFieldValue("curriculumId", data.branchCurriculumId || "");
                changeSignatureForm.setFieldValue(
                    "branchClassIds",
                    [
                        {
                            classId: String(data.branchClassId),
                            shortName: data.classShortName,
                        },
                    ]
                );
                if (Array.isArray(data.signatureDto)) {
                    const mappedSignatureDto = data.signatureDto.map((sig: any) => ({
                        uniqueId: sig.id ?? generateUniqueNumber(),
                        signatureLabel: sig.signatureLabel,
                        signatureName: sig.signatureName,
                        signatureImageName: sig.signatureImageName,
                        signatureOrder: sig.signatureOrder,
                        isDisplayTc: !!sig.isDisplayTc,
                        isDisplayBonafide: !!sig.isDisplayBonafide,
                        isDeleted: !!sig.isDeleted,
                    }));
                    changeSignatureForm.setFieldValue("signatureDto", mappedSignatureDto);
                }
            }
        } else if (props.modalData) {
            const { curriculumId, classId } = props.modalData;
            changeSignatureForm.setValues((prev: any) => ({
                ...prev,
                curriculumId,
                branchClassIds: classId
                    ? [{
                        classId: String(classId),
                        shortName: "",
                    }]
                    : [],
            }));

            if (curriculumId) {
                const payload = {
                    branchId: branchId,
                    curriculumId,
                    sortBy: "classSequence",
                    orderBy: "asc",
                    pageNo: 0,
                    pageSize: 100,
                };
                dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.id, props.modalData, getAdmissionSignatureListResp]);

    const changeSignatureForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const { signatureLabel, signatureName, signatureOrder } = values;
            const formData = new FormData();
            const dto = {
                instituteId,
                branchId,
                branchCurriculumId: values.curriculumId,
                isDisplayTc: values.isDisplayTc,
                isDisplayBonafide: values.isDisplayBonafide,
                branchClassIds: values.branchClassIds.map((item: any) => Number(item.id)),
                signatureDto: [
                    {
                        signatureLabel,
                        signatureName,
                        signatureOrder,
                    }
                ]
            };
            formData.append("dto", JSON.stringify(dto));
            if (changeSignatureForm.values.signatureFile) {
                formData.append("signatureImage", changeSignatureForm.values.signatureFile);
            }
            dispatch(saveAdmissionSignatureAct(generateActionPayload("save_admission_signature", undefined, formData)));
        }
    });
    function removeSlabHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined && rowIndex !== null) {
            changeSignatureForm.setFieldValue(`signatureDto[${rowIndex}].isDeleted`, true);
        }
    }

    const fetchImageAsBlob = async (url: string): Promise<Blob> => {
        const response = await fetch(url);
        return await response.blob();
    };

    const handleRowSubmit = async (index: number) => {
        const signature = changeSignatureForm.values.signatureDto[index];

        const existingSignatureData = getAdmissionSignatureListResp?.find(
            (item: any) => +item.id === +props.id
        );
        const existingSignatures = existingSignatureData?.signatureDto || [];
        const existing = existingSignatures[index];
        const signatureRequest = {
            id: existing?.id ?? "",
            instituteId,
            branchId,
            curriculumId: changeSignatureForm.values.curriculumId,
            classId: changeSignatureForm.values.branchClassIds?.[0]?.classId || "",
            signatureLabel: signature.signatureLabel,
            signatureName: signature.signatureName,
            signatureOrder: signature.signatureOrder,
            isDisplayTc: signature.isDisplayTc,
            isDisplayBonafide: signature.isDisplayBonafide,
            isDeleted: signature.isDeleted || false,
        };
        const formData = new FormData();
        formData.append("signatureRequest", JSON.stringify(signatureRequest));
        if (signature.signatureFile) {
            formData.append("signatureImage", signature.signatureFile);
        } else if (signature.signatureImage && signature.signatureImageName) {
            try {
                const blob = await fetchImageAsBlob(signature.signatureImage);
                formData.append("signatureImage", blob, signature.signatureImageName);
            } catch (error) {
                console.error("Error fetching existing image as blob:", error);
            }
        }
        dispatch(
            updateAdmissionSignatureAct(
                generateActionPayload("update_admission_signature", undefined, formData)
            )
        );
    };

    function addSlabHandler(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                signatureLabel: "",
                signatureName: "",
                signatureFile: "",
                signatureImage: "",
                signatureOrder: "",
  isDisplayTc: false,
  isDisplayBonafide: false,
                isDeleted: false,
            });
        }
    }

    useEffect(() => {
        if (changeSignatureForm.values.curriculumId) {
            getClassApiCall(changeSignatureForm.values.curriculumId);
        }
    }, [changeSignatureForm.values.curriculumId]);

    useEffect(() => {
        getCurriculumApiCall();
    }, []);

    function getClassApiCall(selectedCurriculumId: string) {
        const payload = {
            curriculumId: selectedCurriculumId,
            branchId,
            pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
        };

        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));

    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        changeSignatureForm.setFieldValue(name, value);
        if (value) {
            if (name === "curriculumId") {
                changeSignatureForm.setFieldValue("classId", "");
            }
        }
    }

    function onChangeDisplayImgInputHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, JPEG and PNG files are allowed");
            event.target.value = "";
            return;
        }

        changeSignatureForm.setValues((prevState) => ({
            ...prevState,
            signatureImage: file.name,
            signatureFile: file,
        }));
    }
    function onSelectClassHndlr(selectedOptions: { classId: string; shortName: string }[], config?: { name: string }) {
        const { name } = config || {};
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            changeSignatureForm.setFieldValue(name!, selectedOptions);
        } else {
            changeSignatureForm.setFieldValue(name!, null);
        }
    }
    function onChangeDisplayImgMultInputHndlr(
        event: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) {
        const file = event.target.files?.[0] ?? null;

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, JPEG and PNG files are allowed");
            event.target.value = "";
            return;
        }

        const fileURL = URL.createObjectURL(file);

        changeSignatureForm.setFieldValue(
            `signatureDto[${index}].signatureImage`,
            fileURL
        );
        changeSignatureForm.setFieldValue(
            `signatureDto[${index}].signatureFile`,
            file
        );
        changeSignatureForm.setFieldValue(
            `signatureDto[${index}].signatureImageName`,
            file.name
        );
    }

    function renderSelectedClass(selectedItems: Array<{ classId: string, shortName: string }>): JSX.Element | null {
        if (Array.isArray(selectedItems)) {
            return (<div className="text-truncate">
                {
                    selectedItems.map((item, index) => {
                        return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
                    })
                }
            </div>)
        }
        return null;
    }

    function renderOptionClass(item: { shortName: string }): string {
        return item.shortName;
    }
    const { data: curriculumTypes } = getAssignListCurriculumResp || {}
    const { content: classTypes } = getAssignLanClassListResp || {};
    const { signatureLabel, signatureName, signatureOrder } = changeSignatureForm.values;
    const showLabelAsterisk = !signatureLabel && !signatureName || !!signatureLabel;
    const showNameAsterisk = !signatureLabel && !signatureName || !!signatureName;
    const showOrderAsterisk = !signatureLabel && !signatureOrder || !!signatureOrder;

    return (
        <>
            <form className="" onSubmit={changeSignatureForm.handleSubmit}>
                <div className="row px-3 mx-0 mt-3">
                    <div className="col-xs-12 col-md-6">
                        <SelectInput
                            name="curriculumId"
                            value={changeSignatureForm.values.curriculumId}
                            menuItems={curriculumTypes}
                            onChange={filterHandler}
                            isDisabled={props?.id}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            labelClass="required"
                            labelText="Curriculum"
                            invalid={(changeSignatureForm.touched.curriculumId && changeSignatureForm.errors.curriculumId) ? true : false}
                            error={(changeSignatureForm.touched.curriculumId && changeSignatureForm.errors.curriculumId) ? changeSignatureForm.errors.curriculumId : ""}
                        />
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <MultiSelectCheckbox
                            name="branchClassIds"
                            idKey="id"
                            labelText="Classes"
                            labelClass="required"
                            value={changeSignatureForm.values.branchClassIds}
                            renderValue={renderSelectedClass}
                            renderOptions={renderOptionClass}
                            onChange={onSelectClassHndlr}
                            searchKey="shortName"
                            options={classTypes || []}
                            isDisabled={props?.id}
                            invalid={(changeSignatureForm.touched.branchClassIds && changeSignatureForm.errors.branchClassIds) ? true : false}
                            error={(changeSignatureForm.touched.branchClassIds && changeSignatureForm.errors.branchClassIds) ? changeSignatureForm.errors.branchClassIds : ""}
                        />
                    </div>
                </div>
                {props?.id ? (
                    <>
                        <div className="row bg-light px-3 py-2 mx-0">
                            <div className="col-2 d-flex align-items-center">
                                <h6 className="form-label mb-0 me-2">Label</h6>

                            </div>
                            <div className="col-2 d-flex align-items-center">
                                <h6 className="form-label mb-0 me-2">Name</h6>
                            </div>
                            <div className="col-3 d-flex align-items-center">
                                <h6 className="form-label mb-0 me-2">Image</h6>
                            </div>
                            <div className="col-2 d-flex align-items-center">
                                <h6 className="form-label mb-0">Order</h6>
                            </div>
                            <div className="col-2">
  <div className="d-flex gap-4">
    <h6 className="form-label mb-0">Display in</h6>
  </div>
</div>
                            <div className="col-1 d-flex align-items-center justify-content-end">
                                {changeSignatureForm.values.signatureDto?.length < 3 && (
                                    <button
                                        type="button"
                                        className="px-2 py-1 btn btn-outline-primary float-end d-flex align-items-center"
                                        onClick={addSlabHandler}
                                    >
                                        <i className="ri-add-line" />
                                    </button>
                                )}

                            </div>
                        </div>
                        <div className="row p-3 pb-0 mx-0">
                            <div className="col-12">
                                <FormikProvider value={changeSignatureForm}>
                                    <FieldArray name="signatureDto">
                                        {(arrayHelpers: ArrayHelpers) => {
                                            if (!formikArrayHelpers.current) formikArrayHelpers.current = arrayHelpers;
                                            return (
                                                <>
                                                    {changeSignatureForm.values.signatureDto?.length > 0 && changeSignatureForm.values.signatureDto?.map((signature: any, index: number) => {
                                                        const inputFieldErrors: any = changeSignatureForm.errors.signatureDto?.[index] || {};
                                                        const inputFieldTouched = changeSignatureForm.touched.signatureDto?.[index] || {};
                                                        return (
                                                            !signature.isDeleted && (
                                                                <div key={signature.uniqueId} className="mb-3 row">
                                                                    <div className="col-2">
                                                                        <TextInput
                                                                            name={`signatureDto[${index}].signatureLabel`}
                                                                            value={signature.signatureLabel}
                                                                            formgroupClassName="mb-0"
                                                                            onChange={changeSignatureForm.handleChange}
                                                                            onBlur={changeSignatureForm.handleBlur}
                                                                        />
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <TextInput
                                                                            name={`signatureDto[${index}].signatureName`}
                                                                            value={signature.signatureName}
                                                                            formgroupClassName="mb-0"
                                                                            onChange={changeSignatureForm.handleChange}
                                                                            onBlur={changeSignatureForm.handleBlur}
                                                                        />
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="d-flex justify-content-between">
                                                                            <BrowseFile
                                                                                hideLabel={true}
                                                                                containerClassName="mb-3"
                                                                                name={`signatureDto[${index}].signatureImage`}
                                                                                fileName={signature.signatureImageName || "Preview Available"}
                                                                                onChangeFileHndlr={(e: any) => onChangeDisplayImgMultInputHndlr(e, index)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <TextInputWithRegex
                                                                            name={`signatureDto[${index}].signatureOrder`}
                                                                            inputClassName="w-80"
                                                                            value={signature.signatureOrder !== undefined ? String(signature.signatureOrder) : ''}
                                                                            formgroupClassName="mb-0"
                                                                            onChange={changeSignatureForm.handleChange}
                                                                            onBlur={changeSignatureForm.handleBlur}
                                                                            allowedInputRegex="^[0-9]+\.?[0-9]*$"
                                                                        />
                                                                    </div>
                                                                    <div className="col-2 d-flex gap-3">
                                                                        <InputCheckbox
                                                                            name={`signatureDto[${index}].isDisplayTc`}
                                                                            labelName="TC"
                                                                            value={signature.isDisplayTc}
                                                                            onChange={changeSignatureForm.handleChange}
                                                                        />
                                                                        <InputCheckbox
                                                                            name={`signatureDto[${index}].isDisplayBonafide`}
                                                                            labelName="Bonafide"
                                                                            value={signature.isDisplayBonafide}
                                                                            onChange={changeSignatureForm.handleChange}
                                                                        />
                                                                    </div>
                                                                    <div className="col-1 d-flex align-items-start px-0">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRowSubmit(index)}
                                                                            className="btn-sm btn-icon btn-rounded btn btn-white"
                                                                        >
                                                                            <HugeiconsIcon icon={Tick01Icon} size={20} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            data-index={index}
                                                                            onClick={() => {
                                                                                changeSignatureForm.setFieldValue(`signatureDto[${index}].isDeleted`, true);
                                                                                setDeleteIndex(index);
                                                                                openDelDocModal();
                                                                            }}
                                                                            className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white ms-2"
                                                                        >
                                                                            <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        );
                                                    })}
                                                </>
                                            );
                                        }}
                                    </FieldArray>
                                </FormikProvider>
                            </div>
                            <div className="hstack gap-2 justify-content-end mb-3 px-0">
                                <button type="button" className="btn btn-danger px-4" onClick={props.toggle}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="row px-4">
                            <div className="col-12">
                                <TextInput
                                    name="signatureLabel"
                                    labelText="Signature Label"
                                    labelClass={showLabelAsterisk ? "required" : ""}
                                    value={changeSignatureForm.values.signatureLabel}
                                    onChange={changeSignatureForm.handleChange}
                                    invalid={!!(changeSignatureForm.touched.signatureLabel && changeSignatureForm.errors.signatureLabel)}
                                    error={changeSignatureForm.touched.signatureLabel && changeSignatureForm.errors.signatureLabel}
                                />
                            </div>
                            <div className="col-12">
                                <TextInput
                                    name="signatureName"
                                    labelText="Signature Name"
                                    labelClass={showNameAsterisk ? "required" : ""}
                                    value={changeSignatureForm.values.signatureName}
                                    onChange={changeSignatureForm.handleChange}
                                    invalid={!!(changeSignatureForm.touched.signatureName && changeSignatureForm.errors.signatureName)}
                                    error={changeSignatureForm.touched.signatureName && changeSignatureForm.errors.signatureName}
                                />
                            </div>
                            <div className="col-12">
                                <TextInput
                                    name="signatureOrder"
                                    labelText="Signature Order"
                                    labelClass={showOrderAsterisk ? "required" : ""}
                                    value={changeSignatureForm.values.signatureOrder}
                                    onChange={changeSignatureForm.handleChange}
                                    invalid={!!(changeSignatureForm.touched.signatureOrder && changeSignatureForm.errors.signatureOrder)}
                                    error={changeSignatureForm.touched.signatureOrder && changeSignatureForm.errors.signatureOrder}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <InputCheckbox
                                    formgroupClassName="tw-me-3"
                                    name="isDisplayTc"
                                    labelName="Display in TC"
                                    value={changeSignatureForm.values.isDisplayTc}
                                    onChange={changeSignatureForm.handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <InputCheckbox
                                    formgroupClassName="tw-me-3"
                                    name="isDisplayBonafide"
                                    labelName="Display in Bonafied"
                                    value={changeSignatureForm.values.isDisplayBonafide}
                                    onChange={changeSignatureForm.handleChange}
                                />
                            </div>
                            <div className="row px-3 mx-0 mb-3">
                                <div className='col-12 mt-2 px-0'>
                                    <BrowseFile
                                        containerClassName="mb-3"
                                        labelText="Upload File"
                                        labelClass="required"
                                        name="signatureImage"
                                        fileName={changeSignatureForm.values.signatureImage}
                                        onChangeFileHndlr={onChangeDisplayImgInputHndlr}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="hstack gap-2 justify-content-end mb-3 px-4">
                            <button
                                type="button"
                                className={"btn btn-light"}
                                onClick={props.toggle}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`btn btn-success`}
                                onClick={(event: any) => changeSignatureForm.handleSubmit(event)}
                            >
                                Save
                            </button>
                        </div>
                    </>
                )}
            </form>
            <ConfirmationModal
                id="un-assign-document-modal"
                isOpen={delDocModalState.showModal}
                confirmMessage="Are you sure you want to Delete Signature ?"
                cancelHndlr={closeDelDocModal}
                confirmHndlr={async () => {
                    if (deleteIndex !== null) {
                        await handleRowSubmit(deleteIndex);
                        closeDelDocModal(); // Ensure modal closes after API call
                    }
                }}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default AddSignatureModel;