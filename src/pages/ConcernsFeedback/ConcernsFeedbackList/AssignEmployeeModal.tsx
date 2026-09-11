import {  MultiSelectCheckbox } from '../../../Components/Common'
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getEmployeeByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementactions';
import { useFormik } from 'formik';
import { renderOptionsEmployee, renderValueEmployee } from './helper';
import * as Yup from "yup";
import { editConcernsFeedbackListAct } from '../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import { useEffect } from 'react';
import Button from '../../../Components/Common/Button';

const initialValues = {
    assigneesIds: [],
}

const validationSchema = Yup.object().shape({
    assigneesIds: Yup.array().test('is-assignee-required', 'At least one assingee is required', function (value) {
        if (!value || value.length === 0) {
            return false;
        }
        return true;
    }).nullable(),
})

const AssignEmployeeModal = (props: any) => {

    const dispatch = useDispatch()

    const {
        getEmployeesByFilterResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,instituteListResp,
        showApiLoader } =
        useAppSelector(({ directoryEmployee, appData, instituteInfo, globalData }) => ({
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            instituteListResp: instituteInfo.instituteListResp,
        }), shallowEqual);

    const assignEmployeeForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values:any) => {
            const payload = {
                assigneesIds : values?.assigneesIds?.map((i:any)=>i?.id),
            }
            dispatch(editConcernsFeedbackListAct(generateActionPayload("edit_concern_feedback_list", {id : props.modalData.complaintId}, { ...payload })));
        },
    });

    useEffect(() => {
     if(props.modalData?.assignee){
        assignEmployeeForm.setValues((prevState: any) => ({ ...prevState, assigneesIds: props.modalData?.assignee?.map((i:any)=>({...i , id : i?.assigneeIds})) }));
     }
    }, [])
    
    function selectEmployeeHndlr(selectedOptions: any, config?: any) {
      
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            assignEmployeeForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            assignEmployeeForm.setValues((prevState: any) => ({ ...prevState, [name]: null }));
        }

    }

    function onSearchMultiSelectHandler(name: any, value: any) {
        if (value) {
            const params = { searchString: value};
            const payload = { instituteGroupId : ""}
            if(Array.isArray(instituteListResp?.data) && instituteListResp?.data.length > 0){
                payload.instituteGroupId = instituteListResp?.data.find((item: any) => +item?.id === +instituteId)?.instituteGroupId
            }
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { ...payload })));
        }
    }

    return (
        <>
            <div className="tw-p-6">

                <div className="tw-mb-4">
                    <div className="tw-w-full">
                        <MultiSelectCheckbox
                            name="assigneesIds"
                            labelText="Search Employee"
                            containerClassName="tw-mb-3"
                            idKey="id"
                            labelClass="required"
                            value={assignEmployeeForm.values.assigneesIds}
                            renderValue={renderValueEmployee}
                            renderOptions={renderOptionsEmployee}
                            onChange={selectEmployeeHndlr}
                            onSearchHandler={onSearchMultiSelectHandler}
                            options={getEmployeesByFilterResp}
                            invalid={(assignEmployeeForm.touched.assigneesIds && assignEmployeeForm.errors.assigneesIds) ? true : false}
                            error={(assignEmployeeForm.touched.assigneesIds && assignEmployeeForm.errors.assigneesIds) ? assignEmployeeForm.errors.assigneesIds : ""}
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
                        onClick={(event: any) => assignEmployeeForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>

            </div>
        </>
    )
}

export default AssignEmployeeModal