import React, { useEffect, useState, useMemo, useRef } from 'react'
import { AutoSearchInputSingle, AutoSearchInputUpdated, Button, CustomSelect, MultiSelectCheckbox, SelectInput, TextInput, TimeInput } from '../../../Components/Common'
import { shallowEqual, useDispatch } from 'react-redux'
import { generateActionPayload } from '../../../utility/reduxutility'
import { useAppSelector } from '../../../hooks/storehook'
import * as Yup from "yup";
import { useFormik } from 'formik'
import { getVehicleDetailesListAct } from '../../../store/transportation/settings/vehicledetails/vehicledetaileaction'
import { editTransportManageAct, getEmployeesBasedOnCategoryAct, getVehicleTransManageAct } from '../../../store/transportation/transportationaction'
import { convertTo12HourFormat, convertTo24HourFormat } from '../../../utility/dateutility'
import { renderOptionsEmployee, renderOptionsVehicle, renderValueEmployee, renderValueVehicle } from './helper'
import { getTransportEmployeesAct, setTransportEmployeesAct } from '../../../store/transportation/TransportationEmployee/transportationemployeeactions'

const initialValues: any = {
    vehicleId: "",
    driverId: "",
    attenderId: "",
    inchargeIds: null,
    tripStartTime: "",
    routeName: "",
    tripEndTime: "",
};


const AddTransportManagement = ({ toggle, academicYearId, isOpen }: any) => {

    const dispatch = useDispatch()
    const [driverState, setDriverState] = useState<any>(null);
    const [attenderState, setAttenderState] = useState<any>(null);

    const validationSchema = Yup.object().shape({
        // vehicleId: Yup.string().nullable().required("Vehicle Number is required."),
        // driverId: Yup.string().nullable().required("Driver Name is required."),
        // attenderId: Yup.string().nullable().required("Attender Name is required."),
        // tripStartTime: Yup.string().nullable().required("Start Time is required."),
        // tripEndTime: Yup.string().nullable().required("End Time is required."),
        // inchargeIds: Yup.array().min(1,"Minimum 1 Incharge is required.").nullable().required("Incharge is required."),

    });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getByIdTransportManageResp,
        vehicleDetaileListResp,
        getEmployeesBasedOnCategoryResp,
        getVehicleTransManageResp,
        transportEmployeesResp,
    }: any = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, transportrequest, transportEmployee, vehicleDetailRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getByIdTransportManageResp: transportrequest.getByIdTransportManageResp,
            getEmployeesBasedOnCategoryResp: transportrequest.getEmployeesBasedOnCategoryResp,
            getVehicleTransManageResp: transportrequest.getVehicleTransManageResp,
            vehicleDetaileListResp: vehicleDetailRequest.vehicleDetaileListResp,
            transportEmployeesResp: transportEmployee.transportEmployeesResp
        }),
        shallowEqual
    );

    const addTransManageRef = useRef<any>({
        prevGetByIdTransportManageResp: getByIdTransportManageResp,
    });

    useEffect(() => {
        const { prevGetByIdTransportManageResp } = addTransManageRef.current;

        if (getByIdTransportManageResp && prevGetByIdTransportManageResp !== getByIdTransportManageResp) {
            if (getByIdTransportManageResp) {
                const { driverId, driverName, routeId, routeName, tripEndTime, tripStartTime, vehicleId, vehicleName, inchargeDtos, attenderId, attenderCode, attenderName, driverCode } = getByIdTransportManageResp || {};

                setDriverState({ employeeName: driverName, employeeCode: driverCode, id: driverId })
                setAttenderState({ employeeName: attenderName, employeeCode: attenderCode, id: attenderId })
                getVehicleDetailsList()

                const inchargeIdsArr = (inchargeDtos || []).map((employee: any) => ({ employeeName: employee.inchargeName, employeeCode: employee.inchargeCode, id: employee.inchargeId }))

                addTransManageForm.setValues((prev: any) => ({
                    ...prev,
                    routeName, vehicleId: "", driverId, attenderId, inchargeIds: inchargeIdsArr, tripStartTime: convertTo24HourFormat(tripStartTime), tripEndTime: convertTo24HourFormat(tripEndTime),
                }))
            }
        }

        addTransManageRef.current.prevGetByIdTransportManageResp = getByIdTransportManageResp;

    }, [getByIdTransportManageResp]);

    const addTransManageForm = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const { inchargeIds, attenderId, driverId, tripEndTime, tripStartTime, vehicleId } = values || {}
            const payload = {
                attenderId: attenderId,
                driverId: driverId,
                vehicleId: vehicleId,
                branchId,
                instituteId,
                inchargeIds: inchargeIds?.map((i: any) => i?.id),
                tripStartTime: convertTo12HourFormat(tripStartTime),
                tripEndTime: convertTo12HourFormat(tripEndTime),
            }
            dispatch(editTransportManageAct(generateActionPayload("edit_transport_manage", { routeId: getByIdTransportManageResp?.routeId }, payload)));
        },
    });

    const getVehicleDetailsList = (value?: any) => {
        dispatch(getVehicleTransManageAct(generateActionPayload("get_vehicle_trans_manage", undefined, { branchId, searchString: value || null })))
        // dispatch(getVehicleDetailesListAct(generateActionPayload("get_vehicle_details",undefined,{instituteId,branchId,sortBy:"id",orderBy:"ASC",pageNo : 0,pageSize : 300})))
    }

    const getEmployeesList = (otherProps?: any) => {
        dispatch(getEmployeesBasedOnCategoryAct(generateActionPayload("get_employee_based_on_category", { branchId }, { ...otherProps })))
    }

    function getTransportEmployeeApicall(searchString: string, employeeType: string) {
        const payload = {
            branchId,
            employeeType,
            searchString,
            activeStatus: "ACTIVE",
            pageNo: 0,
            pageSize: 20
        }
        dispatch(getTransportEmployeesAct(generateActionPayload("get_transport_employee", undefined, payload)));
    }

    const selectedDriver = (employee: any) => {
        addTransManageForm.setFieldValue('driverId', employee.employeeId)
        setDriverState(employee);
        dispatch(setTransportEmployeesAct(undefined));
    }

    const selectedAttender = (employee: any) => {
        addTransManageForm.setFieldValue('attenderId', employee.employeeId)
        setAttenderState(employee);
        dispatch(setTransportEmployeesAct(undefined));
    }

    function selectEmployeeHndlr(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addTransManageForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            addTransManageForm.setValues((prevState: any) => ({ ...prevState, [name]: null }));
        }

    }
    function selectVehicleHndlr(selectedOptions: any, config?: any) {
        const { name } = config;
        addTransManageForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));

    }

    function onSearchMultiSelectHandler(name: any, value: any) {
        if (value) {
            getEmployeesList({ categoryNames: "TEACHERS,ADMIN", searchString: value })
        }
    }


    const { data: academicYearList } = academicYearListResp || {};
    const { content: transportEmployees } = transportEmployeesResp || {};
    return (
        <div>
            <div className="tw-px-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-6">
                        <TextInput
                            name='routeName'
                            labelText='Route Name'
                            value={addTransManageForm.values.routeName}
                            onChange={undefined}
                            isDisabled={true}
                            isReadOnly={true}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>
                    <div className="tw-col-span-6">
                        <CustomSelect
                            name="vehicleId"
                            labelText="Vehicle Number"
                            containerClassName="tw-mb-3"
                            idKey="id"
                            value={addTransManageForm.values.vehicleId}
                            renderValue={renderValueVehicle}
                            renderOptions={renderOptionsVehicle}
                            onChange={selectVehicleHndlr}
                            searchKey='vehicleNo'
                            options={getVehicleTransManageResp || []}
                            invalid={addTransManageForm.touched.vehicleId && addTransManageForm.errors.vehicleId ? true : false}
                            error={addTransManageForm.touched.vehicleId && addTransManageForm.errors.vehicleId ? String(addTransManageForm.errors.vehicleId) : ""}
                        />
                    </div>
                    <div className="tw-col-span-12">
                        <AutoSearchInputSingle
                            formgroupClassName="search-box"
                            name="driverId"
                            placeHolder="Search..."
                            // onChange={(e: any) => setSearchInputState(e.target.value)}
                            onChange={(string: any) => {
                                if (!string) addTransManageForm.setFieldValue('driverId', "");
                                getEmployeesList({ categoryNames: "DRIVERS", searchString: string })
                                getTransportEmployeeApicall(string, "DRIVER");
                            }}
                            alignRight={true}
                            valueKey="employeeId"
                            labelText="Driver Name"
                            labelHeader="Employee Name"
                            labelKey="employeeName"
                            options={(Array.isArray(transportEmployees) && transportEmployees) || []}
                            selected={driverState}
                            selectedOptionCallbck={selectedDriver}
                            onBlur={addTransManageForm.handleBlur}
                            invalid={addTransManageForm.touched.driverId && addTransManageForm.errors.driverId ? true : false}
                            error={addTransManageForm.touched.driverId && addTransManageForm.errors.driverId ? addTransManageForm.errors.driverId : ""}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInputSingle>
                    </div>

                    <div className="tw-col-span-12">
                        <AutoSearchInputSingle
                            formgroupClassName="search-box"
                            name="attenderId"
                            placeHolder="Search..."
                            // onChange={(e: any) => setSearchInputState(e.target.value)}
                            onChange={(string: any) => {
                                if (!string) addTransManageForm.setFieldValue('attenderId', "");
                                getEmployeesList({ categoryNames: "ATTENDERS", searchString: string });
                                getTransportEmployeeApicall(string, "ATTENDER");
                            }}
                            alignRight={true}
                            valueKey="employeeId"
                            labelText="Attender Name"
                            labelHeader="Employee Name"
                            labelKey="employeeName"
                            options={(Array.isArray(transportEmployees) && transportEmployees) || []}
                            selected={attenderState}
                            selectedOptionCallbck={selectedAttender}
                            onBlur={addTransManageForm.handleBlur}
                            invalid={addTransManageForm.touched.attenderId && addTransManageForm.errors.attenderId ? true : false}
                            error={addTransManageForm.touched.attenderId && addTransManageForm.errors.attenderId ? addTransManageForm.errors.attenderId : ""}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInputSingle>
                    </div>

                    <div className="tw-col-span-12">
                        <MultiSelectCheckbox
                            name="inchargeIds"
                            labelText="Inchargers Name"
                            containerClassName="tw-mb-3"
                            idKey="id"
                            value={addTransManageForm.values.inchargeIds}
                            renderValue={renderValueEmployee}
                            renderOptions={renderOptionsEmployee}
                            onChange={selectEmployeeHndlr}
                            onSearchHandler={onSearchMultiSelectHandler}
                            options={getEmployeesBasedOnCategoryResp || []}
                            invalid={addTransManageForm.touched.inchargeIds && addTransManageForm.errors.inchargeIds ? true : false}
                            error={addTransManageForm.touched.inchargeIds && addTransManageForm.errors.inchargeIds ? String(addTransManageForm.errors.inchargeIds) : ""}
                        />
                    </div>

                    <div className="tw-col-span-6">
                        <TimeInput
                            name="tripStartTime"
                            labelText="Trip Start Time"
                            value={addTransManageForm.values.tripStartTime}
                            onChange={addTransManageForm.handleChange}
                            invalid={addTransManageForm.touched.tripStartTime && addTransManageForm.errors.tripStartTime ? true : false}
                            error={addTransManageForm.touched.tripStartTime && addTransManageForm.errors.tripStartTime ? addTransManageForm.errors.tripStartTime : ""}
                            onBlur={addTransManageForm.handleBlur}
                        />
                    </div>
                    <div className="tw-col-span-6">
                        <TimeInput
                            name="tripEndTime"
                            labelText="Trip End Time"
                            value={addTransManageForm.values.tripEndTime}
                            onChange={addTransManageForm.handleChange}
                            onBlur={addTransManageForm.handleBlur}
                            invalid={addTransManageForm.touched.tripEndTime && addTransManageForm.errors.tripEndTime ? true : false}
                            error={addTransManageForm.touched.tripEndTime && addTransManageForm.errors.tripEndTime ? addTransManageForm.errors.tripEndTime : ""}
                        />
                    </div>

                </div>
            </div>


            <hr className="tw-border-gray-200 tw-m-0" />

            <div className="tw-flex tw-justify-end tw-items-center tw-p-4 tw-gap-3">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => toggle()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    onClick={() => {
                        addTransManageForm.handleSubmit();
                    }}
                    disabled={showApiLoader}
                >
                    Submit
                </Button>
            </div>
        </div >
    )
}

export default AddTransportManagement
