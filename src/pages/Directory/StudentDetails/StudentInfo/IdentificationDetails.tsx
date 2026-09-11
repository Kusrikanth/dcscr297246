import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { BrowseFile, CustomSelect, ModalContainerUpdated, SelectInput, TextInput, TextInputWithRegex } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { classWiseDocumentListAct, getStudentByIdAct, updateStudentAct, uploadStudentDocumentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getCasteListAct, getMotherToungeAct, getNationalityAct, getReligionAct, getSubCasteListAct } from "../../../../store/masterdata/masterdataactions";
import * as Yup from 'yup';
import { generateActionPayload } from "../../../../utility/reduxutility";
import { details, formSectionSaveKey, renderOptionsSubCaste, renderValueSection } from "./helper";
import { IUpdateStudentRepRef } from "./StudentInfoTypes";
import { toast } from "react-toastify";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";
import classNames from "classnames";
import { useModal } from "../../../../hooks/modalhook";
import AddDocumentDetailsModal from "./AddDocumentDetails";

interface IIdentificationDetails {
    studentId: number;
    academicYearId: string;
    divId: string;
    branchId: number;
    instituteId: number;
    canCreateAndUpdate: boolean;
}

export default function IdentificationDetails(props: IIdentificationDetails) {

    const dispatch = useDispatch();
    const validationSchema = Yup.object().shape({
        // nationalityId: Yup.string().required("Nationality required."),
        religionId: Yup.string().required("Religion is required."),
        casteId: Yup.string().required("Caste is required."),
        motherToungeId: Yup.string().required("Mother Tongue is required."),
        identificationMark1: Yup.string().required("Identiﬁcation Mark 1 is required."),
        signatureImage: Yup.string().when("casteId", {
            is: (casteId: any) => {
                const caste = CasteData?.find(
                    (c: any) => c.casteId?.toString() === casteId?.toString()
                );
                return caste?.isDocumentRequired === true;
            },
            then: (schema) => schema.required("Caste Certificate is required."),
            otherwise: (schema) => schema.notRequired(),
        }),
        identificationMark2: Yup.string().test("identificationMark2Check", "Identification mark 2 cannot be same as identification mark 1.",
            (value: any, schema: any) => {
                if (value && value?.toLowerCase() === schema.parent?.identificationMark1?.toLowerCase()) {
                    return false
                }
                return true;
            })
        // Yup.string().notOneOf([Yup.ref('identificationMark1'), null], "Does not match with identificationMark1!").required("Identiﬁcation Mark 2 is required.")
    });

    const initialValues = (data?: any) => {
        return {
            nationalityId: data?.nationalityId || "",
            religionId: data?.religionId || "",
            casteId: data?.casteId || "",
            signatureImage: data?.signatureImage || "",
            subCasteId: data?.subCasteId || "",
            motherToungeId: data?.motherToungeId || "",
            foreignNationalPassportNumber: data?.foreignNationalPassportNumber || "",
            identificationMark1: data?.identificationMark1 || "",
            identificationMark2: data?.identificationMark2 || ""
        }
    }


    const [initialData, setInitialData] = useState(initialValues());
    const [edit, setEdit] = useState(false);

    const { getStudentByIdResp, classWiseDocumentListResp, nationalityResp, casteListResp, subCasteListResp, religionResp, motherToungeResp, updateStudentResp, affectedSection, uploadStudentDocumentResp } = useAppSelector(
        ({ directoryStudent, masterData }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            classWiseDocumentListResp: directoryStudent.classWiseDocumentListResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            nationalityResp: masterData.nationalityResp,
            casteListResp: masterData.casteListResp,
            subCasteListResp: masterData.subCasteListResp,
            religionResp: masterData.religionResp,
            motherToungeResp: masterData.motherToungeResp,
            uploadStudentDocumentResp: directoryStudent.uploadStudentDocumentResp,
        }),
        shallowEqual
    );

    const getStudentDetailsAPI = () => {
        // const params={academicYearId:props.academicYearId}
        dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
    }
    const UpdateHandler = () => {
        getStudentDetailsAPI();
        setEdit(false);
    }

    const IdentificationDetailsRef = useRef({
        preUpdateStudentDetails: updateStudentResp,
        prevUploadStudentDocumentResp: uploadStudentDocumentResp
    });

    useEffect(() => {
        const { preUpdateStudentDetails, prevUploadStudentDocumentResp } =
            IdentificationDetailsRef.current;

        if (updateStudentResp &&
            preUpdateStudentDetails !== updateStudentResp) {
            if (affectedSection === "Identification Details") {
                toast.success("Identification Details Updated successfully.");
                UpdateHandler();
            }
        } else if (uploadStudentDocumentResp &&
              prevUploadStudentDocumentResp !== uploadStudentDocumentResp) {
                toast.success(`Document Added successfully.`);
            }
        IdentificationDetailsRef.current.preUpdateStudentDetails = updateStudentResp;
        IdentificationDetailsRef.current.prevUploadStudentDocumentResp = uploadStudentDocumentResp;
    }, [affectedSection, updateStudentResp, uploadStudentDocumentResp]);

    const IdentificationDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            const data = details(getStudentByIdResp, values, { branchId: props.branchId, instituteId: props.instituteId }, formSectionSaveKey.identification);
            formData.append("studentRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
                affectedSection: "Identification Details"
            })));
        },
    });

    const EditHandler = (event: any) => {
        setEdit(true);
    }
    const CancelHandler = () => {
        IdentificationDetailsForm.setValues(initialValues(getStudentByIdResp.identificationDetail)).then(() => {
            IdentificationDetailsForm.setErrors({})
        });
        setEdit(false);
    }
    useEffect(() => {
        if (getStudentByIdResp !== undefined) {
            setInitialData(initialValues(getStudentByIdResp.identificationDetail));
        }
    }, [getStudentByIdResp]);

    useEffect(() => {
        dispatch(getNationalityAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "nationality", searchString: "", pageNo: 0, pageSize: 100, sortBy: "nationalityName", orderBy: "asc" })));
        dispatch(getReligionAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "religion", searchString: "", pageNo: 0, pageSize: 100, sortBy: "religionName", orderBy: "asc" })));
        dispatch(getCasteListAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "caste", searchString: "", pageNo: 0, pageSize: 200, sortBy: "casteName", orderBy: "asc" })));
        dispatch(getMotherToungeAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "mother-tongue", searchString: "", pageNo: 0, pageSize: 100, sortBy: "motherTongueName", orderBy: "asc" })));
    }, []);

    useEffect(() => {
        const casteId = IdentificationDetailsForm.values.casteId;

        if (casteId) {
            dispatch(getSubCasteListAct(
                generateActionPayload("get_sub_caste", undefined, { casteId, pageNo: 0, pageSize: 100 })
            ));
        }
    }, [IdentificationDetailsForm.values.casteId]);

    useEffect(() => {
        const classId = getStudentByIdResp?.studentAcademicDetails?.classId;

        if (classId) {
            const payload = { classId };

            dispatch(
                classWiseDocumentListAct(
                    generateActionPayload("classwise_document_list", undefined, payload)
                )
            );
        }
    }, [getStudentByIdResp?.studentAcademicDetails?.classId]);

    function handleSubCasteChange(selected: any, config: any) {
        const { name } = config;
        IdentificationDetailsForm.setFieldValue(name, selected);
    }

    const { data: NationalityData } = nationalityResp || {};
    const { data: CasteData } = casteListResp || {};
    const { data: ReligionData } = religionResp || {};
    const { data: MotherToungeData } = motherToungeResp || {};

    const selectedCaste = Array.isArray(CasteData)
        ? CasteData.find(
            (item: any) =>
                item.casteId?.toString() === IdentificationDetailsForm.values.casteId?.toString()
        )
        : null;

    const isDocumentRequired = selectedCaste?.isDocumentRequired;

  
    function onChangeDisplayImgInputHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;
        if (!file) return;
        IdentificationDetailsForm.setValues((prevState) => ({
            ...prevState,
            signatureImage: file.name,
            signatureFile: file,
        }));
        const casteDocument = Array.isArray(classWiseDocumentListResp)
            ? classWiseDocumentListResp.find(
                (item: any) =>
                    item.documentName?.toLowerCase() === "caste certificate"
            )
            : null;
        const formData = new FormData();
        formData.append("studentId", props.studentId.toString());
        formData.append("documentTypeId", casteDocument.id.toString());
        formData.append("file", file);
        dispatch(uploadStudentDocumentAct(generateActionPayload("upload_student_document", undefined, formData)));
    }

    return (
        <>
            <div id={props.divId} className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                <div className="tw-flex tw-items-center tw-border-b tw-px-6 tw-py-4">
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                        Identification
                    </h4>
                    {props.canCreateAndUpdate && !edit && (
                        <div
                            className="tw-ml-auto tw-mr-4 tw-flex tw-items-center tw-cursor-pointer"
                            onClick={EditHandler}
                        >
                            <HugeiconsIcon
                                icon={PencilEdit02Icon}
                                className="tw-text-gray-400"
                                size={18}
                            />
                        </div>
                    )}
                </div>

                <div className="tw-p-6">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        <div className="tw-col-span-12 sm:tw-col-span-6 2xl:tw-col-span-4">
                            <SelectInput
                                name="nationalityId"
                                labelText="Nationality"
                                value={IdentificationDetailsForm.values.nationalityId}
                                onChange={IdentificationDetailsForm.handleChange}
                                onBlur={IdentificationDetailsForm.handleBlur}
                                valueKey="nationalityId"
                                textKey="nationalityName"
                                menuItems={NationalityData || []}
                                isReadOnly
                                isDisabled
                                inputClassName={
                                    !edit
                                        ? "!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none"
                                        : "!tw-bg-gray-100"
                                }
                                invalid={
                                    IdentificationDetailsForm.touched.nationalityId &&
                                        IdentificationDetailsForm.errors.nationalityId
                                        ? true
                                        : false
                                }
                                error={
                                    IdentificationDetailsForm.touched.nationalityId &&
                                        IdentificationDetailsForm.errors.nationalityId
                                        ? IdentificationDetailsForm.errors.nationalityId
                                        : ""
                                }
                                labelClass={`tw-text-gray-500 ${edit ? "required" : ""}`}
                            />
                        </div>

                        <div className="tw-col-span-12 sm:tw-col-span-6 2xl:tw-col-span-4">
                            <SelectInput
                                name="religionId"
                                labelText="Religion"
                                value={IdentificationDetailsForm.values.religionId}
                                onChange={IdentificationDetailsForm.handleChange}
                                onBlur={IdentificationDetailsForm.handleBlur}
                                valueKey="religionId"
                                textKey="religionName"
                                menuItems={ReligionData || []}
                                isReadOnly={!edit}
                                isDisabled={!edit}
                                inputClassName={
                                    !edit
                                        ? "!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none"
                                        : "tw-bg-transparent"
                                }
                                invalid={
                                    IdentificationDetailsForm.touched.religionId &&
                                        IdentificationDetailsForm.errors.religionId
                                        ? true
                                        : false
                                }
                                error={
                                    IdentificationDetailsForm.touched.religionId &&
                                        IdentificationDetailsForm.errors.religionId
                                        ? IdentificationDetailsForm.errors.religionId
                                        : ""
                                }
                                labelClass={`tw-text-gray-500 ${edit ? "required" : ""}`}
                            />
                        </div>

                        <div className="tw-col-span-12 sm:tw-col-span-6 2xl:tw-col-span-4">
                            <SelectInput
                                name="casteId"
                                labelText="Caste"
                                value={IdentificationDetailsForm.values.casteId}
                                onChange={IdentificationDetailsForm.handleChange}
                                onBlur={IdentificationDetailsForm.handleBlur}
                                valueKey="casteId"
                                textKey="casteName"
                                menuItems={CasteData || []}
                                isReadOnly={!edit}
                                isDisabled={!edit}
                                inputClassName={
                                    !edit
                                        ? "!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none"
                                        : "!tw-bg-transparent"
                                }
                                invalid={
                                    IdentificationDetailsForm.touched.casteId &&
                                        IdentificationDetailsForm.errors.casteId
                                        ? true
                                        : false
                                }
                                error={
                                    IdentificationDetailsForm.touched.casteId &&
                                        IdentificationDetailsForm.errors.casteId
                                        ? IdentificationDetailsForm.errors.casteId
                                        : ""
                                }
                                labelClass={`tw-text-gray-500 ${edit ? "required" : ""}`}
                            />
                        </div>

                        {isDocumentRequired && (
                            <div className="tw-col-span-12 sm:tw-col-span-6 2xl:tw-col-span-12 xl:tw-col-span-12">
                                <BrowseFile
                                    containerClassName="mb-3"
                                    labelText="Upload Caste Certificate"
                                    name="signatureImage"
                                    isDisabled={!edit}
                                    fileName={IdentificationDetailsForm.values.signatureImage}
                                    onChangeFileHndlr={onChangeDisplayImgInputHndlr}
                                    labelClass={`tw-text-gray-500 ${isDocumentRequired && edit ? "required" : ""}`}
                                    invalid={
                                        IdentificationDetailsForm.touched.signatureImage &&
                                            IdentificationDetailsForm.errors.signatureImage
                                            ? true
                                            : false
                                    }
                                    error={
                                        IdentificationDetailsForm.touched.signatureImage &&
                                            typeof IdentificationDetailsForm.errors.signatureImage === "string"
                                            ? IdentificationDetailsForm.errors.signatureImage
                                            : ""
                                    }
                                />
                            </div>
                        )}

                        <div className="tw-col-span-12 sm:tw-col-span-6 2xl:tw-col-span-4">
                            <CustomSelect
                                name="subCasteId"
                                labelText="Sub Caste"
                                value={IdentificationDetailsForm.values.subCasteId}
                                options={Array.isArray(subCasteListResp?.content)
                                    ? subCasteListResp?.content
                                    : []}
                                idKey="id"
                                searchKey="categoryName"
                                renderValue={renderValueSection}
                                renderOptions={renderOptionsSubCaste}
                                onChange={handleSubCasteChange}
                                defaultSelect="Select"
                                isReadOnly={!edit}
                                isDisabled={!edit}
                                inputClassName={
                                    !edit
                                        ? "!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none"
                                        : "!tw-bg-transparent"
                                }
                            />
                        </div>

                        <div className="tw-col-span-12 sm:tw-col-span-6 2xl:tw-col-span-4">
                            <SelectInput
                                name="motherToungeId"
                                labelText="Mother Tongue"
                                value={IdentificationDetailsForm.values.motherToungeId}
                                onChange={IdentificationDetailsForm.handleChange}
                                onBlur={IdentificationDetailsForm.handleBlur}
                                valueKey="motherTongueId"
                                textKey="motherTongueName"
                                menuItems={MotherToungeData || []}
                                isReadOnly={!edit}
                                isDisabled={!edit}
                                inputClassName={
                                    !edit
                                        ? "!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none"
                                        : "!tw-bg-transparent"
                                }
                                invalid={
                                    IdentificationDetailsForm.touched.motherToungeId &&
                                        IdentificationDetailsForm.errors.motherToungeId
                                        ? true
                                        : false
                                }
                                error={
                                    IdentificationDetailsForm.touched.motherToungeId &&
                                        IdentificationDetailsForm.errors.motherToungeId
                                        ? IdentificationDetailsForm.errors.motherToungeId
                                        : ""
                                }
                                labelClass={`tw-text-gray-500 ${edit ? "required" : ""}`}
                            />
                        </div>

                        <div className="tw-col-span-12 sm:tw-col-span-6 2xl:tw-col-span-4">
                            <TextInputWithRegex
                                name="foreignNationalPassportNumber"
                                labelText="Foreign National Passport Number"
                                value={IdentificationDetailsForm.values.foreignNationalPassportNumber}
                                onChange={IdentificationDetailsForm.handleChange}
                                onBlur={IdentificationDetailsForm.handleBlur}
                                isReadOnly={!edit}
                                inputClassName={
                                    !edit
                                        ? "!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none"
                                        : "!tw-bg-transparent"
                                }
                                labelClass={`tw-text-gray-500`}
                                allowedInputRegex="^[0-9]+$"
                                maxLength={15}
                            />
                        </div>

                        <div className="tw-col-span-12 sm:tw-col-span-6 2xl:tw-col-span-4">
                            <TextInput
                                name="identificationMark1"
                                labelText="Identification Mark 1"
                                value={IdentificationDetailsForm.values.identificationMark1}
                                onChange={IdentificationDetailsForm.handleChange}
                                onBlur={IdentificationDetailsForm.handleBlur}
                                isReadOnly={!edit}
                                inputClassName={
                                    !edit
                                        ? "!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none"
                                        : "!tw-bg-transparent"
                                }
                                invalid={
                                    IdentificationDetailsForm.touched.identificationMark1 &&
                                        IdentificationDetailsForm.errors.identificationMark1
                                        ? true
                                        : false
                                }
                                error={
                                    IdentificationDetailsForm.touched.identificationMark1 &&
                                        IdentificationDetailsForm.errors.identificationMark1
                                        ? IdentificationDetailsForm.errors.identificationMark1
                                        : ""
                                }
                                labelClass={`tw-text-gray-500 ${edit ? "required" : ""}`}
                            />
                        </div>

                        <div className="tw-col-span-12 sm:tw-col-span-6 2xl:tw-col-span-4">
                            <TextInput
                                name="identificationMark2"
                                labelText="Identification Mark 2"
                                value={IdentificationDetailsForm.values.identificationMark2}
                                onChange={IdentificationDetailsForm.handleChange}
                                onBlur={IdentificationDetailsForm.handleBlur}
                                isReadOnly={!edit}
                                inputClassName={
                                    !edit
                                        ? "!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none"
                                        : "!tw-bg-transparent"
                                }
                                invalid={
                                    IdentificationDetailsForm.touched.identificationMark2 &&
                                        IdentificationDetailsForm.errors.identificationMark2
                                        ? true
                                        : false
                                }
                                error={
                                    IdentificationDetailsForm.touched.identificationMark2 &&
                                        IdentificationDetailsForm.errors.identificationMark2
                                        ? IdentificationDetailsForm.errors.identificationMark2
                                        : ""
                                }
                                labelClass={`tw-text-gray-500 ${edit ? "required" : ""}`}
                            />
                        </div>
                    </div>
                    {edit && (
                        <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={CancelHandler}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                disabled={!IdentificationDetailsForm.isValid}
                                onClick={(e: any) => IdentificationDetailsForm.handleSubmit(e)}
                            >
                                Update
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}