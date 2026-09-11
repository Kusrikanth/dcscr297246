import React, { useEffect } from 'react'
import { DateInput } from '../../../../Components/Common'
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useFormik } from 'formik';
import { editConcernsFeedbackListAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import { useAppSelector } from '../../../../hooks/storehook';
import { getComplaintDepartmentListAct } from '../../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction';
import { getYyyyMmDdFormat } from '../../../../utility/dateutility';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    targetDate: '',
}

const UpdateTargetDateModal = (props: any) => {

    const dispatch = useDispatch()

    const { currentBranchIdResp: branchId, showApiLoader } =
        useAppSelector(({ appData, globalData }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    useEffect(() => {
        if (props.modalData) {
            const { targetDate } = props.modalData || {};
            updatePriorityForm.setValues((prevState: any) => ({
                ...prevState,
                targetDate: targetDate ? getYyyyMmDdFormat(targetDate) : null,
            }));
            getComplaintDeptApiCall();
        }
    }, []);

    const updatePriorityForm = useFormik({
        initialValues,
        onSubmit: (values) => {
            const { targetDate } = values || {};
            const getFormattedDateTime = (dateStr: string) => {
                if (!dateStr) return null;

                const now = new Date();
                const timePart = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

                return `${dateStr}T${timePart}`;
            };
            const formattedTargetDate = getFormattedDateTime(targetDate);
            const payload = { targetDate: formattedTargetDate };

            dispatch(editConcernsFeedbackListAct(generateActionPayload("edit_concern_feedback_list", { id: props.modalData.complaintId }, { ...payload })));
        },
    });

    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, category: "ACADEMIC", pageNo: 0, pageSize: 500, ...otherProps };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }

    const onChangeFilterHndlr = (event: any) => {
        const { name, value } = event.target;
        if (name === "targetDate") {
            updatePriorityForm.setValues((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    return (
        <>
            <div className="tw-p-6">
                <div className="tw-mb-4">
                    <div className="tw-w-full">
                        <DateInput
                            name="targetDate"
                            formgroupClassName="tw-mb-0"
                            labelText="Target Date"
                            value={updatePriorityForm.values.targetDate}
                            onChange={onChangeFilterHndlr}
                        />
                    </div>
                </div>

                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="button"
                        variant='secondary'
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant='primary'
                        onClick={(event: any) => updatePriorityForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default UpdateTargetDateModal