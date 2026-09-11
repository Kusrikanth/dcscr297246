import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { BrowseFile, ConfirmationModal, SelectInput, TextInput, TextInputWithRegex } from "../../../Components/Common";
import { generateActionPayload } from "../../../utility/reduxutility";
import { saveSignatureAct, updateSignatureAct } from "../../../store/examination/examinationsettings/examinationsettingsaction";
import { shallowEqual } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon, Tick01Icon } from "@hugeicons-pro/core-stroke-standard";
import { generateUniqueNumber } from "../../../utility/commonutility";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../store/assignlanguages/assignlanguagesaction";
import { useModal } from "../../../hooks/modalhook";

const initialValues = {
    curriculumId: "",
    classId: "",
    signatureLabel: "",
    signatureName: "",
    signatureOrder: "",
    signatureFile: null as File | null,
    signatureImage: "",
    signatureDto: [
        {
            uniqueId: generateUniqueNumber(),
            signatureLabel: "",
            signatureName: "",
            signatureOrder: "",
            signatureFile: null as File | null,
            signatureImage: "",
            signatureImageName: "",
            isDeleted: false,
        }
    ]
};

export const getDefaultSignatureValidation = () =>
    Yup.object().shape({
        curriculumId: Yup.string().required("Curriculum is required.").nullable(),
        classId: Yup.string().required("Class is required.").nullable(),
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
        classId: Yup.string().required("Class is required.").nullable(),
    });

const AddSignatureModel = (props: any) => {
    const dispatch = useAppDispatch();
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const validationSchema = props.id ? getEditSignatureValidation() : getDefaultSignatureValidation();
    const { closeModal: closeDelDocModal, modalState: delDocModalState, openModal: openDelDocModal } = useModal();
const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const isEy = location.pathname.includes("/early-years-settings/signature");

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getSignatureListResp,
        getAssignLanClassListResp,
        getAssignListCurriculumResp,

    } = useAppSelector(
        ({ globalData, appData, examinationSettings, assignLanguages }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getSignatureListResp: examinationSettings.getSignatureListResp,
            getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
            getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,

        }),
        shallowEqual
    );

    useEffect(() => {
        if (props.id) {
            const data = getSignatureListResp?.find((item: any) => +item.id === +props.id);
            if (data) {
                changeSignatureForm.setFieldValue("curriculumId", data.branchCurriculumId || "");
                changeSignatureForm.setFieldValue("classId", data.branchClassId || "");
                if (Array.isArray(data.signatureDto)) {
                    const mappedSignatureDto = data.signatureDto.map((sig: any) => ({
                        uniqueId: sig.id ?? generateUniqueNumber(),
                        signatureLabel: sig.signatureLabel,
                        signatureName: sig.signatureName,
                        signatureImageName: sig.signatureImageName,
                        signatureOrder: sig.signatureOrder,
                        isDeleted: !!sig.isDeleted,
                    }));
                    changeSignatureForm.setFieldValue("signatureDto", mappedSignatureDto);
                }
            }
        } else if (props.modalData) {
            const { curriculumId, classId } = props.modalData;
            changeSignatureForm.setValues((prev: any) => ({ ...prev, curriculumId, classId }));
    
            if (curriculumId) {
                const payload = {
                    branchId: branchId,
                    curriculumId,
                    classFilter: isEy ? "EARLY" : "HIGHER", 
                    sortBy: "classSequence",
                    orderBy: "asc",
                    pageNo: 0,
                    pageSize: 100,
                };
                dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.id, props.modalData, getSignatureListResp]);

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
                    branchClassId: values.classId,
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
                dispatch(saveSignatureAct(generateActionPayload("save_signature", undefined, formData)));
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

        const existingSignatureData = getSignatureListResp?.find(
            (item: any) => +item.id === +props.id
        );
        const existingSignatures = existingSignatureData?.signatureDto || [];
        const existing = existingSignatures[index];
        const signatureRequest = {
            id: existing?.id ?? "",
            instituteId,
            branchId,
            curriculumId: changeSignatureForm.values.curriculumId,
            classId: changeSignatureForm.values.classId,
            signatureLabel: signature.signatureLabel,
            signatureName: signature.signatureName,
            signatureOrder: signature.signatureOrder,
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
            updateSignatureAct(
                generateActionPayload("update_signature", undefined, formData)
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
            classFilter: isEy ? "EARLY" : "HIGHER", 
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

        changeSignatureForm.setValues((prevState) => ({
            ...prevState,
            signatureImage: file ? file.name : '',
            signatureFile: file,
        }));
    }

function onChangeDisplayImgMultInputHndlr(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = event.target.files?.[0] ?? null;

    if (file) {
        const fileURL = URL.createObjectURL(file);
        changeSignatureForm.setFieldValue(`signatureDto[${index}].signatureImage`, fileURL);
        changeSignatureForm.setFieldValue(`signatureDto[${index}].signatureFile`, file);
        changeSignatureForm.setFieldValue(`signatureDto[${index}].signatureImageName`, file.name); // ✅ Save filename
    }
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
                            isDisabled={props?.id || !isEy}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            labelClass="required"
                            labelText="Curriculum"
                            invalid={(changeSignatureForm.touched.curriculumId && changeSignatureForm.errors.curriculumId) ? true : false}
                            error={(changeSignatureForm.touched.curriculumId && changeSignatureForm.errors.curriculumId) ? changeSignatureForm.errors.curriculumId : ""}
                        />
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <SelectInput
                            name="classId"
                            value={changeSignatureForm.values.classId}
                            onChange={filterHandler}
                            menuItems={classTypes}
                            isDisabled={props?.id}
                            valueKey="id"
                            textKey="shortName"
                            labelText="Class"
                            labelClass="required"
                            invalid={(changeSignatureForm.touched.classId && changeSignatureForm.errors.classId) ? true : false}
                            error={(changeSignatureForm.touched.classId && changeSignatureForm.errors.classId) ? changeSignatureForm.errors.classId : ""}
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
                            <div className="col-5 d-flex align-items-center">
                                <h6 className="form-label mb-0 me-2">Image</h6>
                            </div>
                            <div className="col-2 d-flex align-items-center">
                                <h6 className="form-label mb-0">Order</h6>
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
                                                                    <div className="col-5">
                                                                        <div className="d-flex justify-content-between">
                                                                            <BrowseFile
                                                                                hideLabel={true}
                                                                                containerClassName="mb-3 w-80"
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