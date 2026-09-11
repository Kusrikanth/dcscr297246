import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Button, NewPhoneInput } from "../../../Components/Common";
import * as Yup from "yup";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { updateWhatsappnoAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
    whatsappNo: Yup.string().required("Whatsapp no. is required.").matches(/^[0-9]{10,10}$/, 'Whatsapp No. with 10 digit is valid.'),
    fatherWhatsappNo: Yup.string().matches(/^[0-9]{10,10}$/, 'Whatsapp No. with 10 digit is valid.'),
    motherWhatsappNo: Yup.string().matches(/^[0-9]{10,10}$/, 'Whatsapp No. with 10 digit is valid.'),
    guardianWhatsappNo: Yup.string().matches(/^[0-9]{10,10}$/, 'Whatsapp No. with 10 digit is valid.'),
});


const initialValues = {
    whatsappNo: "",
    fatherWhatsappNo: "",
    motherWhatsappNo: "",
    guardianWhatsappNo: ""
}
export default function UpdateWhatsappNumber({ studentId, closeModal }: any) {

    const dispatch = useAppDispatch();

    const { showApiLoader, updateWhatsappnoResp, studentManagementErrorResp } =
        useAppSelector(({ globalData, directoryStudent }) => ({
            showApiLoader: globalData.showApiLoader,
            updateWhatsappnoResp: directoryStudent.updateWhatsappnoResp,
            studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
        }), shallowEqual);

    const updateWhatsappRespRef = useRef({
        prevUpdateWhatsappnoResp: updateWhatsappnoResp,
        prevStudentManagementErrorResp: studentManagementErrorResp,
    });

    useEffect(() => {
        const { prevUpdateWhatsappnoResp, prevStudentManagementErrorResp } = updateWhatsappRespRef.current;
        if (updateWhatsappnoResp && prevUpdateWhatsappnoResp !== updateWhatsappnoResp) {
            toast.success('Whatsapp number updated successfully.');
            closeModal(true);
        } else if (studentManagementErrorResp && prevStudentManagementErrorResp !== studentManagementErrorResp) {
            const { message, details } = studentManagementErrorResp;
            toast.error(message || 'Something went wrong.');
        }
        updateWhatsappRespRef.current.prevUpdateWhatsappnoResp = updateWhatsappnoResp;
        updateWhatsappRespRef.current.prevStudentManagementErrorResp = studentManagementErrorResp;
    }, [updateWhatsappnoResp, studentManagementErrorResp]);

    const updateNumberForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { studentId, ...values };
            dispatch(updateWhatsappnoAct(generateActionPayload("update_whatsappnumber", undefined, payload)));
        },
    });

    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        updateNumberForm.setFieldValue(name, updateDate);
    }


    return (
        <form onSubmit={updateNumberForm.handleSubmit}>
            <div className="modal-body tw-pb-1">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-3">
                    <div>
                        <NewPhoneInput
                            name="whatsappNo"
                            labelText="Whatsapp Number"
                            labelClass="required"
                            value={updateNumberForm.values.whatsappNo}
                            onChange={onChangePhoneInput}
                            onBlur={updateNumberForm.handleBlur}
                            invalid={(updateNumberForm.touched.whatsappNo && updateNumberForm.errors.whatsappNo) ? true : false}
                            error={(updateNumberForm.touched.whatsappNo && updateNumberForm.errors.whatsappNo) ? updateNumberForm.errors.whatsappNo : ""}
                        />
                    </div>
                    <div>
                        <NewPhoneInput
                            name="fatherWhatsappNo"
                            labelText="Father Whatsapp Number"
                            value={updateNumberForm.values.fatherWhatsappNo}
                            onChange={onChangePhoneInput}
                            onBlur={updateNumberForm.handleBlur}
                            invalid={(updateNumberForm.touched.fatherWhatsappNo && updateNumberForm.errors.fatherWhatsappNo) ? true : false}
                            error={(updateNumberForm.touched.fatherWhatsappNo && updateNumberForm.errors.fatherWhatsappNo) ? updateNumberForm.errors.fatherWhatsappNo : ""}
                        />
                    </div>
                    <div>
                        <NewPhoneInput
                            name="motherWhatsappNo"
                            labelText="Mother Whatsapp Number"
                            value={updateNumberForm.values.motherWhatsappNo}
                            onChange={onChangePhoneInput}
                            onBlur={updateNumberForm.handleBlur}
                            invalid={(updateNumberForm.touched.motherWhatsappNo && updateNumberForm.errors.motherWhatsappNo) ? true : false}
                            error={(updateNumberForm.touched.motherWhatsappNo && updateNumberForm.errors.motherWhatsappNo) ? updateNumberForm.errors.motherWhatsappNo : ""}
                        />
                    </div>
                    <div>
                        <NewPhoneInput
                            name="guardianWhatsappNo"
                            labelText="Guardian Whatsapp Number"
                            value={updateNumberForm.values.guardianWhatsappNo}
                            onChange={onChangePhoneInput}
                            onBlur={updateNumberForm.handleBlur}
                            invalid={(updateNumberForm.touched.guardianWhatsappNo && updateNumberForm.errors.guardianWhatsappNo) ? true : false}
                            error={(updateNumberForm.touched.guardianWhatsappNo && updateNumberForm.errors.guardianWhatsappNo) ? updateNumberForm.errors.guardianWhatsappNo : ""}
                        />
                    </div>
                </div>
            </div>
            <div className="modal-footer modal-footer-shadow">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={closeModal}
                        disabled={showApiLoader}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    )
}