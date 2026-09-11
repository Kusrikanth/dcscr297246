import { SelectInput } from '../../../../../Components/Common'
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { resetHostelBuildingsListAct, resetHostelFloorListAct, resetHostelRoomDetailsListAct, resetHostelRoomTypeListAct } from '../../../../../store/hostel/hostelsettings/hostelsettingsslice';
import { getHostelBuildingAct, getHostelFloorAct, getHostelRoomDetailsAct, getHostelRoomTypeAct } from '../../../../../store/hostel/hostelsettings/hostelsettingsactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import * as Yup from 'yup';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { computeSubmitButtonError, generateColumnsUserDetails } from './helper';
import { addHostelBedAllocationAct, getNotAllocateBedListAct } from '../../../../../store/hostel/hostelrequest/hostelrequestactions';
import { toast } from 'react-toastify';
import Button from '../../../../../Components/Common/Button';

const initialValues = {
    academicYearId: "",
    hostelId: "",
    buildingId: "",
    floorId: "",
    roomTypeId: "",
    roomId: "",
}

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required('Academic Year is required'),
    hostelId: Yup.string().required('Hostel is required'),
    buildingId: Yup.string().required('Building is required'),
    floorId: Yup.string().required('Floor is required'),
    roomTypeId: Yup.string().required('Room Type is required'),
    roomId: Yup.string().required('Room is required'),
});

const AddHostelBedAllocation = (props: any) => {

    const dispatch = useAppDispatch();
    const [notAllocatedBedList, setNotAllocatedBedList] = useState<Array<any>>([])
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getHostelBuildingResp,
        getHostelFloorResp,
        getHostelRoomTypeResp, getHostelDetailsResp, getHostelRoomDetailsResp,
        getNotAllocateBedListResp, getStuListForAllocateBedResp,
    } = useAppSelector(
        ({ hostelSettings, instAcademics, appData, globalData, hostelRequest, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getHostelBuildingResp: hostelSettings.getHostelBuildingResp,
            getHostelFloorResp: hostelSettings.getHostelFloorResp,
            getHostelRoomTypeResp: hostelSettings.getHostelRoomTypeResp,
            getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
            getHostelRoomDetailsResp: hostelSettings.getHostelRoomDetailsResp,
            getNotAllocateBedListResp: hostelRequest.getNotAllocateBedListResp,
            getStuListForAllocateBedResp: hostelRequest.getStuListForAllocateBedResp,
        }),
        shallowEqual
    );

    const hostelBedAllocationRef = useRef({
        prevGetNotAllocateBedListResp: getNotAllocateBedListResp,
    })

    useEffect(() => {
        const { prevGetNotAllocateBedListResp } = hostelBedAllocationRef.current;

        if (getNotAllocateBedListResp && getNotAllocateBedListResp !== prevGetNotAllocateBedListResp) {
            setNotAllocatedBedList(Array.isArray(getNotAllocateBedListResp) ? getNotAllocateBedListResp.map((item: any) => ({ ...item, isSelected: false })) : []);
        }

        hostelBedAllocationRef.current.prevGetNotAllocateBedListResp = getNotAllocateBedListResp;

    }, [getNotAllocateBedListResp])

    useEffect(() => {
        if (academicYearListResp) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            addBedAllocationForm.setFieldValue('academicYearId', yearId)
        }
    }, [academicYearListResp])

    const addBedAllocationForm = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            dispatch(getNotAllocateBedListAct(generateActionPayload("get_not_allocated_bed_list", undefined, { ...values, branchId })));
        },
    });

    const hostelRoomDetailsList = (otherProps?: any) => {
        const { hostelId, buildingId, roomTypeId, floorId } = addBedAllocationForm.values;
        const payload = {
            branchId,
            hostelId,
            buildingId,
            roomTypeId,
            pageSize: 100,
            floorId,
            sortBy: "createdAt",
            orderBy: "asc",
            ...otherProps,
        };
        dispatch(getHostelRoomDetailsAct(generateActionPayload("get_hostel_room_details", undefined, payload)));
    };

    const filterHandler = (event: any) => {
        const { name, value } = event.target;

        if (name === 'hostelId') {
            addBedAllocationForm.setValues((prev: any) => ({ ...prev, [name]: value, buildingId: "", roomTypeId: "", roomId: "", floorId: "" }));
            const payload = { branchId: branchId, hostelId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };

            dispatch(resetHostelBuildingsListAct(undefined));
            dispatch(resetHostelFloorListAct(undefined));
            dispatch(resetHostelRoomTypeListAct(undefined));
            dispatch(resetHostelRoomDetailsListAct(undefined));

            dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, payload)));

        } else if (name === 'buildingId') {
            addBedAllocationForm.setValues((prev: any) => ({ ...prev, [name]: value, roomTypeId: "", roomId: "", floorId: "" }));
            const payload = { branchId: branchId, hostelId: addBedAllocationForm.values.hostelId, buildingId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };

            dispatch(resetHostelFloorListAct(undefined));
            dispatch(resetHostelRoomTypeListAct(undefined));
            dispatch(resetHostelRoomDetailsListAct(undefined));

            dispatch(getHostelFloorAct(generateActionPayload("get_hostel_floor", undefined, payload)));

        }
        else if (name === 'floorId') {
            addBedAllocationForm.setValues((prev: any) => ({ ...prev, [name]: value, roomTypeId: "", roomId: "" }));
            const floorPayload = { branchId: branchId, hostelId: addBedAllocationForm.values.hostelId, buildingId: addBedAllocationForm.values.buildingId, floorId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };


            dispatch(resetHostelRoomTypeListAct(undefined));
            dispatch(resetHostelRoomDetailsListAct(undefined));

            dispatch(getHostelRoomTypeAct(generateActionPayload("get_hostel_room_type", undefined, floorPayload)));

        }
        else if (name === 'roomTypeId') {
            addBedAllocationForm.setValues((prev: any) => ({ ...prev, [name]: value, roomId: "" }));
            hostelRoomDetailsList({ [name]: value });

            dispatch(resetHostelRoomDetailsListAct(undefined));

        }
        else {
            addBedAllocationForm.setValues((prev: any) => ({ ...prev, [name]: value, }));
        }

        if (notAllocatedBedList.length > 0) {
            setNotAllocatedBedList([])
        }
    }

    const onChangeInputHndlr = (name: string, selectedStudent?: any, bedId?: any,) => {
        let newList: any = [];
        if (name === "student") {
            newList = notAllocatedBedList?.map((item: any) => {
                if (+item.bedId === +bedId) {
                    const { studentId, studentCode, studentName, curriculumName, sectionName, className } = selectedStudent || {}
                    return selectedStudent
                        ? { ...item, studentId, studentCode, studentName, curriculumName, sectionName, className }
                        : { ...item, studentId: "", studentCode: "", studentName: "", curriculumName: "", sectionName: "", className: "" };
                } else {
                    return item;
                }
            });
        }
        setNotAllocatedBedList(newList)
    }

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...notAllocatedBedList];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
        });
        setNotAllocatedBedList(updateStudentState);
    }, [notAllocatedBedList]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            bedId = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = notAllocatedBedList.findIndex((item: any) => +item.bedId === +bedId);
        if (studentRowIndex > -1) {
            const studentDetails: any = notAllocatedBedList[studentRowIndex];
            let updateStudentState: any = [...notAllocatedBedList];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setNotAllocatedBedList(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [notAllocatedBedList]);

    const submitHndler = () => {

        const submitButtonError = computeSubmitButtonError(notAllocatedBedList)
        if (submitButtonError === undefined || submitButtonError || !addBedAllocationForm.isValid) {
            toast.warning("Please add all the required fields");
        } else {
            const { academicYearId, buildingId, floorId, hostelId, roomTypeId, roomId } = addBedAllocationForm.values || {};
            const payload = {
                branchId, academicYearId, buildingId, floorId, hostelId, roomTypeId, roomId,
                bedsDtos: notAllocatedBedList.filter((f: any) => f?.isSelected).map((item: any) => ({
                    bedId: item.bedId,
                    studentId: item.studentId,
                }))
            }

            dispatch(addHostelBedAllocationAct(generateActionPayload("add_hostel_bed_allocation", undefined, payload)));
        }

    }

    const columns = useMemo(() => {
        return generateColumnsUserDetails(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState);
    }, [notAllocatedBedList, allStudentSelectedState, addBedAllocationForm.values, getStuListForAllocateBedResp]);

    const { data: academicYearList } = academicYearListResp || {};
    const { data: hostelDetailsResp } = getHostelDetailsResp || {};
    const { data: hostelBuildingResp } = getHostelBuildingResp || {};
    const { data: hostelFloorResp } = getHostelFloorResp || {};
    const { data: hostelRoomTypeResp } = getHostelRoomTypeResp || {};
    const { data: hostelRoomNoResp } = getHostelRoomDetailsResp || {};

    return (
        <>
            <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-7 tw-gap-3 tw-p-4">
                <div>
                    <SelectInput
                        name="academicYearId"
                        value={addBedAllocationForm.values.academicYearId}
                        onChange={filterHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelClass="required"
                        labelText="Academic Year"
                        onBlur={addBedAllocationForm.handleBlur}
                        invalid={(addBedAllocationForm.touched.academicYearId && addBedAllocationForm.errors.academicYearId) ? true : false}
                        error={(addBedAllocationForm.touched.academicYearId && addBedAllocationForm.errors.academicYearId) ? addBedAllocationForm.errors.academicYearId : ""}
                    />
                </div>

                <div>
                    <SelectInput
                        name="hostelId"
                        value={addBedAllocationForm.values.hostelId}
                        onChange={filterHandler}
                        menuItems={hostelDetailsResp || []}
                        valueKey="hostelId"
                        textKey="hostelName"
                        formgroupClassName="tw-mb-0"
                        labelText="Hostel Name"
                        labelClass="required"
                        invalid={(addBedAllocationForm.touched.hostelId && addBedAllocationForm.errors.hostelId) ? true : false}
                        error={(addBedAllocationForm.touched.hostelId && addBedAllocationForm.errors.hostelId) ? addBedAllocationForm.errors.hostelId : ""}
                    />
                </div>

                <div>
                    <SelectInput
                        name="buildingId"
                        value={addBedAllocationForm.values.buildingId}
                        onChange={filterHandler}
                        menuItems={hostelBuildingResp || []}
                        valueKey="id"
                        textKey="buildingName"
                        formgroupClassName="tw-mb-0"
                        labelText="Building Name"
                        labelClass="required"
                        invalid={(addBedAllocationForm.touched.buildingId && addBedAllocationForm.errors.buildingId) ? true : false}
                        error={(addBedAllocationForm.touched.buildingId && addBedAllocationForm.errors.buildingId) ? addBedAllocationForm.errors.buildingId : ""}
                    />
                </div>

                <div>
                    <SelectInput
                        name="floorId"
                        value={addBedAllocationForm.values.floorId}
                        onChange={filterHandler}
                        menuItems={hostelFloorResp || []}
                        valueKey="floorId"
                        textKey="floorName"
                        formgroupClassName="tw-mb-0"
                        labelText="Floor Name"
                        labelClass="required"
                        invalid={(addBedAllocationForm.touched.floorId && addBedAllocationForm.errors.floorId) ? true : false}
                        error={(addBedAllocationForm.touched.floorId && addBedAllocationForm.errors.floorId) ? addBedAllocationForm.errors.floorId : ""}
                    />
                </div>

                <div>
                    <SelectInput
                        name="roomTypeId"
                        value={addBedAllocationForm.values.roomTypeId}
                        onChange={filterHandler}
                        menuItems={hostelRoomTypeResp || []}
                        valueKey="roomTypeId"
                        textKey="roomType"
                        formgroupClassName="tw-mb-0"
                        labelText="Room Type"
                        labelClass="required"
                        invalid={(addBedAllocationForm.touched.roomTypeId && addBedAllocationForm.errors.roomTypeId) ? true : false}
                        error={(addBedAllocationForm.touched.roomTypeId && addBedAllocationForm.errors.roomTypeId) ? addBedAllocationForm.errors.roomTypeId : ""}
                    />
                </div>

                <div>
                    <SelectInput
                        name="roomId"
                        value={addBedAllocationForm.values.roomId}
                        onChange={filterHandler}
                        menuItems={hostelRoomNoResp || []}
                        valueKey="id"
                        textKey="roomNo"
                        formgroupClassName="tw-mb-0"
                        labelText="Room No"
                        labelClass="required"
                        invalid={(addBedAllocationForm.touched.roomId && addBedAllocationForm.errors.roomId) ? true : false}
                        error={(addBedAllocationForm.touched.roomId && addBedAllocationForm.errors.roomId) ? addBedAllocationForm.errors.roomId : ""}
                    />
                </div>

                <div className="tw-flex tw-items-end tw-justify-end">
                    <Button
                        variant="primary"
                        onClick={(event: any) => addBedAllocationForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Search
                    </Button>
                </div>
            </div>
            <div className="tw-grid tw-grid-cols-1 tw-gap-3">
                <div>
                    <TableContainer
                        columns={columns || []}
                        data={Array.isArray(notAllocatedBedList) ? notAllocatedBedList : []}
                        tableClass="tw-mt-3"
                        divClass="tw-overflow-x-auto tw-mb-3"
                        theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                        showPagination={false}
                        onChangeInputHndlr={onChangeInputHndlr}
                        rowDataInfo={{ branchId, studentList: Array.isArray(getStuListForAllocateBedResp?.data) ? getStuListForAllocateBedResp?.data : [], academicYearId: addBedAllocationForm.values.academicYearId }}
                    />
                </div>
            </div>
            <div className="tw-flex tw-justify-end tw-gap-3 tw-px-4 tw-pb-4">
                <Button
                    variant='secondary'
                    type="button"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    variant='primary'
                    type="submit"
                    onClick={submitHndler}
                    disabled={showApiLoader}
                >
                    Submit
                </Button>
            </div>
        </>
    )
}

export default AddHostelBedAllocation