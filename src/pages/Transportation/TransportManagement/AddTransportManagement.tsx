import React, { useEffect, useState, useRef, Fragment } from 'react'
import { AutoSearchInputUpdated, CustomSelect, MultiSelectCheckbox, SelectInput, TextInput, TimeInput } from '../../../Components/Common'
import { shallowEqual } from 'react-redux'
import { generateActionPayload } from '../../../utility/reduxutility'
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook'
import * as Yup from "yup";
import { useFormik } from 'formik'
import { editTransportManageAct, getEmployeesBasedOnCategoryAct, getVehicleTransManageAct } from '../../../store/transportation/transportationaction'
import { convertTimeTrips, renderOptionsEmployee, renderOptionsVehicle, renderValueEmployee, renderValueVehicle, tripDetailsMenu } from './helper'
import { getTransportEmployeesAct, setTransportEmployeesAct } from '../../../store/transportation/TransportationEmployee/transportationemployeeactions'
import Button from '../../../Components/Common/Button'

const initialValues: any = {
    vehicleId: "",
    driverId: "",
    attenderId: "",
    inchargeIds: [],
    routeName: "",
    trip1PickupStartTime: "",
    trip1PickupEndTime: "",
    trip1DropStartTime: "",
    trip1DropEndTime: "",
    trip2PickupStartTime: "",
    trip2PickupEndTime: "",
    trip2DropStartTime: "",
    trip2DropEndTime: "",
    trip3PickupStartTime: "",
    trip3PickupEndTime: "",
    trip3DropStartTime: "",
    trip3DropEndTime: ""
};


const AddTransportManagement = ({ toggle , academicYearId}: any) => {

    const dispatch = useAppDispatch()
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
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getByIdTransportManageResp,
        vehicleDetaileListResp,
        getEmployeesBasedOnCategoryResp,
        getVehicleTransManageResp,
        transportEmployeesResp,
        academicYearListResp,
    } = useAppSelector(
        ({ globalData, appData, transportrequest, vehicleDetailRequest, transportEmployee , instAcademics
        }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getByIdTransportManageResp: transportrequest.getByIdTransportManageResp,
            getEmployeesBasedOnCategoryResp: transportrequest.getEmployeesBasedOnCategoryResp,
            getVehicleTransManageResp: transportrequest.getVehicleTransManageResp,
            vehicleDetaileListResp: vehicleDetailRequest.vehicleDetaileListResp,
            transportEmployeesResp: transportEmployee.transportEmployeesResp,
            academicYearListResp: instAcademics.academicYearListResp,
        }),
        shallowEqual
    );

    const addTransManageRef = useRef({
        prevGetByIdTransportManageResp: getByIdTransportManageResp,
    });

    useEffect(() => {
        const { prevGetByIdTransportManageResp } = addTransManageRef.current;

        if (getByIdTransportManageResp && prevGetByIdTransportManageResp !== getByIdTransportManageResp) {
            if (getByIdTransportManageResp) {
                const { driverId, driverName, routeId, routeName, vehicleId, vehicleName, inchargeDtos, attenderId, attenderCode, attenderName, driverCode} = getByIdTransportManageResp || {};

                setDriverState({ employeeName: driverName, employeeCode: driverCode, id: driverId })
                setAttenderState({ employeeName: attenderName, employeeCode: attenderCode, id: attenderId })
                getVehicleDetailsList()

                const inchargeIdsArr = (inchargeDtos || []).map((employee: any) => ({ employeeName: employee.inchargeName, employeeCode: employee.inchargeCode, id: employee.inchargeId }))
                addTransManageForm.setValues((prev: any) => ({
                    ...prev,
                    routeName, vehicleId: "", driverId, attenderId, inchargeIds: inchargeIdsArr,
                    ...convertTimeTrips("24Hours", getByIdTransportManageResp),
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
            const { inchargeIds, attenderId, driverId, vehicleId, } = values || {}
            const payload = {
                academicYearId,
                attenderId: attenderId,
                driverId: driverId,
                vehicleId: vehicleId,
                branchId,
                instituteId,
                inchargeIds: inchargeIds?.map((i: any) => i?.id),
                ...convertTimeTrips("12Hours", values),

            }
            dispatch(editTransportManageAct(generateActionPayload("edit_transport_manage_new", { routeId: getByIdTransportManageResp?.routeId }, payload)));
        },
    });

    const getVehicleDetailsList = (value?: any) => {
        dispatch(getVehicleTransManageAct(generateActionPayload("get_vehicle_trans_manage", undefined, { branchId, searchString: value || null , academicYearId })))
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

    const changeHandler = (e: any) => {
        const { name, value } = e.target;
        addTransManageForm.handleChange(e)

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
            <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-1 tw-gap-4">
                    <div>
                        <SelectInput
                            name="academicYearId"
                            value={academicYearId}
                            onChange={undefined}
                            menuItems={academicYearList || []}
                            isDisabled={true}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            labelText="Academic Year"
                        />
                    </div>

                    <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                        <TextInput
                            name="routeName"
                            labelText="Route Name"
                            value={addTransManageForm.values.routeName}
                            onChange={undefined}
                            isDisabled={true}
                            isReadOnly={true}
                            formgroupClassName="tw-mb-0"
                        />

                        <CustomSelect
                            name="vehicleId"
                            labelText="Vehicle Number"
                            containerClassName="tw-mb-0"
                            idKey="id"
                            value={addTransManageForm.values.vehicleId}
                            renderValue={renderValueVehicle}
                            renderOptions={renderOptionsVehicle}
                            onChange={selectVehicleHndlr}
                            searchKey="vehicleNo"
                            options={getVehicleTransManageResp || []}
                            invalid={addTransManageForm.touched.vehicleId && addTransManageForm.errors.vehicleId ? true : false}
                            error={addTransManageForm.touched.vehicleId && addTransManageForm.errors.vehicleId ? String(addTransManageForm.errors.vehicleId) : ""}
                        />
                    </div>

                    <div>
                        <AutoSearchInputUpdated
                            formgroupClassName="search-box"
                            name="driverId"
                            placeHolder="Search..."
                            onChange={(string: any) => {
                                if (!string)
                                    addTransManageForm.setFieldValue("driverId", "");
                                getTransportEmployeeApicall(string, "DRIVER");
                            }}
                            alignRight={true}
                            valueKey="employeeId"
                            labelText="Driver Name"
                            labelHeader="Employee Code"
                            labelKey="employeeCode"
                            subLabelHeader="Employee Name"
                            subLabelKey="employeeName"
                            options={
                                (Array.isArray(transportEmployees) &&
                                    transportEmployees) ||
                                []
                            }
                            selected={driverState}
                            selectedOptionCallbck={selectedDriver}
                            onBlur={addTransManageForm.handleBlur}
                            invalid={addTransManageForm.touched.driverId && addTransManageForm.errors.driverId ? true : false}
                            error={addTransManageForm.touched.driverId && addTransManageForm.errors.driverId ? addTransManageForm.errors.driverId : ""}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                    </div>

                    <div>
                        <AutoSearchInputUpdated
                            formgroupClassName="search-box"
                            name="attenderId"
                            placeHolder="Search..."
                            onChange={(string: any) => {
                                if (!string)
                                    addTransManageForm.setFieldValue("attenderId", "");
                                getTransportEmployeeApicall(string, "ATTENDER");
                            }}
                            alignRight={true}
                            valueKey="employeeId"
                            labelText="Attender Name"
                            labelHeader="Employee Code"
                            labelKey="employeeCode"
                            subLabelHeader="Employee Name"
                            subLabelKey="employeeName"
                            options={
                                (Array.isArray(transportEmployees) &&
                                    transportEmployees) ||
                                []
                            }
                            selected={attenderState}
                            selectedOptionCallbck={selectedAttender}
                            onBlur={addTransManageForm.handleBlur}
                            invalid={addTransManageForm.touched.attenderId && addTransManageForm.errors.attenderId ? true : false}
                            error={addTransManageForm.touched.attenderId && addTransManageForm.errors.attenderId ? addTransManageForm.errors.attenderId : ""}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                    </div>

                    <div>
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

                    {tripDetailsMenu.map((item: any, index: number) => {
                        const {
                            name,
                            pickUpStartTime,
                            pickUpEndTime,
                            dropStartTime,
                            dropEndTime,
                        } = item;

                        return (
                            <Fragment key={index}>
                                <div className="tw-font-semibold">{name}</div>

                                <div className="tw-grid tw-grid-cols-4 tw-gap-4">
                                    <TimeInput
                                        name={pickUpStartTime}
                                        labelText="Pick Up Start Time"
                                        formgroupClassName="tw-w-full"
                                        value={addTransManageForm.values[pickUpStartTime]}
                                        onChange={addTransManageForm.handleChange}
                                        onBlur={addTransManageForm.handleBlur}
                                        invalid={addTransManageForm.touched[pickUpStartTime] && addTransManageForm.errors[pickUpStartTime] ? true : false}
                                        error={addTransManageForm.touched[pickUpStartTime] && addTransManageForm.errors[pickUpStartTime] ? addTransManageForm.errors[pickUpStartTime] : ""}
                                    />

                                    <TimeInput
                                        name={pickUpEndTime}
                                        labelText="Pick Up End Time"
                                        formgroupClassName="tw-w-full"
                                        value={addTransManageForm.values[pickUpEndTime]}
                                        onChange={addTransManageForm.handleChange}
                                        onBlur={addTransManageForm.handleBlur}
                                         invalid={addTransManageForm.touched[pickUpEndTime] && addTransManageForm.errors[pickUpEndTime] ? true : false}
                                            error={addTransManageForm.touched[pickUpEndTime] && addTransManageForm.errors[pickUpEndTime] ? addTransManageForm.errors[pickUpEndTime] : ""}
                                    />

                                    <TimeInput
                                        name={dropStartTime}
                                        labelText="Drop Start Time"
                                        formgroupClassName="tw-w-full"
                                        value={addTransManageForm.values[dropStartTime]}
                                        onChange={addTransManageForm.handleChange}
                                        invalid={addTransManageForm.touched[dropStartTime] && addTransManageForm.errors[dropStartTime] ? true : false}
                                            error={addTransManageForm.touched[dropStartTime] && addTransManageForm.errors[dropStartTime] ? addTransManageForm.errors[dropStartTime] : ""}
                                        onBlur={addTransManageForm.handleBlur}
                                    />

                                    <TimeInput
                                        name={dropEndTime}
                                        labelText="Drop End Time"
                                        formgroupClassName="tw-w-full"
                                        value={addTransManageForm.values[dropEndTime]}
                                        onChange={addTransManageForm.handleChange}
                                        onBlur={addTransManageForm.handleBlur}
                                        invalid={addTransManageForm.touched[dropEndTime] && addTransManageForm.errors[dropEndTime] ? true : false}
                                        error={addTransManageForm.touched[dropEndTime] && addTransManageForm.errors[dropEndTime] ? addTransManageForm.errors[dropEndTime] : ""}
                                    />
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>

            <hr className="tw-my-0 tw-border-gray-200" />

            <div className="tw-flex tw-justify-end tw-gap-4 tw-mx-4 tw-my-3">
                <Button
                    type="submit"
                    variant='secondary'
                    onClick={() => toggle()}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant='primary'
                    onClick={() => addTransManageForm.handleSubmit()}
                    disabled={showApiLoader}
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default AddTransportManagement
