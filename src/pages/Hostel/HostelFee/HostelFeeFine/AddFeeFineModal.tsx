import React, { useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { Col, Row } from "reactstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { DateInput, SelectInput, TextInput, TextInputGroup } from "../../../../Components/Common";
import { addHostelFeeFinesAct, getHostelFeeNamesAct, updateHostelFeeFineAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import Button from "../../../../Components/Common/Button";


function getAddEditFeeName(editData?: any) {
    return {
        academicYearId: editData?.academicYearId || "",
        feeName: editData?.feeName || "",
        dueDate: editData?.dueDate || "",
        finePerDay: getAmountValueWithDecimal(editData?.finePerDay),
    }
}

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic year required."),
    feeName: Yup.string().required("Fine name required."),
    finePerDay: Yup.string().test("finePerDayValidation", "Fine amount should be greater than zero.",
        (value: any, schema: any) => {
            if (!Number(value)) {
                return false;
            }
            return true;
        }),
});

const initialState = getAddEditFeeName();
const AddFeeFineModal: React.FC<any> = (props) => {
    const dispatch = useAppDispatch();
    const isEditMode = !!props.feeFineId;

    const { academicYearListResp,getHostelFeeNamesResp, showApiLoader,addHostelFeeFinesResp,updateHostelFeeFinesResp , currentBranchIdResp : branchId , currentInstIdResp : instituteId } = useAppSelector(({ instAcademics, globalData,hostelStuLedger,appData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            showApiLoader: globalData.showApiLoader,
            getHostelFeeNamesResp: hostelStuLedger.getHostelFeeNamesResp,
            addHostelFeeFinesResp: hostelStuLedger.addHostelFeeFinesResp,
            updateHostelFeeFinesResp: hostelStuLedger.updateHostelFeeFinesResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp
        }), shallowEqual);

    const feeFineModalRef = useRef({
        prevAddHostelFeeFinesResp: addHostelFeeFinesResp,
        prevUpdateHostelFeeFinesResp: updateHostelFeeFinesResp
    });

    useEffect(() => {
        const { prevAddHostelFeeFinesResp, prevUpdateHostelFeeFinesResp } = feeFineModalRef.current;
        if (addHostelFeeFinesResp && prevAddHostelFeeFinesResp !== addHostelFeeFinesResp) {
            props.toggle(true);
            toast.success("Fee fine added successfully.");
            props.getFeeFinesApiCall();
        } else if (updateHostelFeeFinesResp && prevUpdateHostelFeeFinesResp !== updateHostelFeeFinesResp) {
            props.toggle(true);
            toast.success("Fee fine updated successfully.");
            props.getFeeFinesApiCall();
        }
        feeFineModalRef.current.prevAddHostelFeeFinesResp = addHostelFeeFinesResp;
        feeFineModalRef.current.prevUpdateHostelFeeFinesResp = updateHostelFeeFinesResp;
    }, [addHostelFeeFinesResp, updateHostelFeeFinesResp]);

    useEffect(() => {
        if (isEditMode) return;
        if (academicYearListResp) {
            let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault)?.academicYearId;
            feeFineModalForm.setFieldValue("academicYearId", yearId);            
            getFeenameApiCall(yearId?.toString() || '');
        }
    }, [isEditMode,branchId,instituteId, academicYearListResp]);


    useEffect(() => {
        if (props.editFeeFineDetails && academicYearListResp) {
            const feeFineData = getAddEditFeeName(props.editFeeFineDetails);
            const { academicYearId } = props.editFeeFineDetails;
            getFeenameApiCall(academicYearId);
            feeFineModalForm.resetForm({
                values: feeFineData
            })
        }
    }, [props.editFeeFineDetails, academicYearListResp]);

    const feeFineModalForm = useFormik({
        initialValues: initialState,
        validationSchema,
        onSubmit: (values) => {
            const payload: any = { ...values };
            delete payload.academicYearId;
            delete payload.feeName;
            if (props.feeFineId) {
                const params = { id : props.feeFineId };
                dispatch(updateHostelFeeFineAct(generateActionPayload("update_hostel_fee_fine", params, payload)));
            } else {
                const payload = { ...values, instituteId: props.instituteId, branchId: props.branchId, academicYearId: values.academicYearId }
                dispatch(addHostelFeeFinesAct(generateActionPayload("add_hostel_fee_fine", undefined, payload)));
            }
        },
    });

    function onBlurAmountHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeFineModalForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: getAmountValueWithDecimal(value),
        }));
        feeFineModalForm.handleBlur(event);
    }

    function getFeenameApiCall( academicYearId: string) {
        dispatch(getHostelFeeNamesAct(generateActionPayload("get_hostel_fee_fine_names", undefined, {
            branchId: props.branchId, academicYearId
        })));
    }

    function onChangeAcademicYearHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeFineModalForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value,
            feeName: ''
        }));
        getFeenameApiCall(value);
    }


    return (
        <form onSubmit={feeFineModalForm.handleSubmit}>
            <div className="tw-p-6 tw-pb-0">
                <div className="tw-flex tw-flex-col">
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                        <div>
                            <SelectInput
                                name="academicYearId"
                                labelText="Academic Year"
                                labelClass={isEditMode ? "" : "required"}
                                value={feeFineModalForm.values.academicYearId}
                                onChange={onChangeAcademicYearHndlr}
                                menuItems={academicYearListResp?.data}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                isDisabled={isEditMode}
                                invalid={(feeFineModalForm.touched.academicYearId && feeFineModalForm.errors.academicYearId) ? true : false}
                                error={(feeFineModalForm.touched.academicYearId && feeFineModalForm.errors.academicYearId) ? feeFineModalForm.errors.academicYearId : ""}
                            />
                        </div>
                        <div>
                            <SelectInput
                                name="feeName"
                                labelClass="required"
                                value={feeFineModalForm.values.feeName}
                                onChange={feeFineModalForm.handleChange}
                                menuItems={(getHostelFeeNamesResp?.feeDetails || []).map((feeName: string) => ({value: feeName, name: feeName}))}
                                valueKey="value"
                                textKey="name"
                                labelText="Fee Name"
                                isDisabled={isEditMode}
                                invalid={(feeFineModalForm.touched.feeName && feeFineModalForm.errors.feeName) ? true : false}
                                error={(feeFineModalForm.touched.feeName && feeFineModalForm.errors.feeName) ? feeFineModalForm.errors.feeName : ""}
                            />
                        </div>

                        {/* <div>
                            <TextInput
                                name="gracePeriod"
                                labelText="Days after Due Date"
                                value={feeFineModalForm.values.gracePeriod}
                                onChange={feeFineModalForm.handleChange}
                                labelClass="required"
                                invalid={(feeFineModalForm.touched.gracePeriod && feeFineModalForm.errors.gracePeriod) ? true : false}
                                error={(feeFineModalForm.touched.gracePeriod && feeFineModalForm.errors.gracePeriod) ? feeFineModalForm.errors.gracePeriod : ""}
                            />
                        </div> */}
                        <div>
                            <DateInput
                                name="dueDate"
                                value={feeFineModalForm.values?.dueDate}
                                onChange={feeFineModalForm.handleChange}
                                labelText="Due Date"
                            />
                        </div>
                        <div>
                            <TextInputGroup
                                labelText="Fine Amount"
                                name="finePerDay"
                                allowedInputRegex="^[0-9]+\.?[0-9]*$"
                                inputGroupStart={true}
                                value={feeFineModalForm.values.finePerDay}
                                onChange={feeFineModalForm.handleChange}
                                onBlur={onBlurAmountHndlr}
                                labelClass="required"
                                invalid={(feeFineModalForm.touched.finePerDay && feeFineModalForm.errors.finePerDay) ? true : false}
                                error={(feeFineModalForm.touched.finePerDay && feeFineModalForm.errors.finePerDay) ? feeFineModalForm.errors.finePerDay : ""}
                            >
                                <RupeeSvg width="11px" height="11px" fill="#495057" />
                            </TextInputGroup>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tw-border-t tw-px-6 tw-py-4 tw-shadow-inner">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="button"
                        onClick={props.toggle}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={showApiLoader}
                        variant="primary"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AddFeeFineModal;
