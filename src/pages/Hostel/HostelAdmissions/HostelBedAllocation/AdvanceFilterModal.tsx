import { useEffect, useState } from 'react'
import { SelectInput } from '../../../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { resetHostelBuildingsListAct, resetHostelFloorListAct, resetHostelRoomTypeListAct } from '../../../../store/hostel/hostelsettings/hostelsettingsslice';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getHostelBuildingAct, getHostelDetailsAct, getHostelFloorAct, getHostelRoomDetailsAct, getHostelRoomTypeAct, resetHostelRoomDetailsListAct } from '../../../../store/hostel/hostelsettings/hostelsettingsactions';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    searchString: "",
    academicYearId: "",
    hostelId: "",
    buildingId: "",
    floorId: "",
    roomTypeId: "",
    roomId: "",
    bedStatus: "",
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] =
        useState(props.appliedFilter || initialValues);

    const dispatch = useAppDispatch();

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, showApiLoader, getHostelBuildingResp,
        getHostelFloorResp,
        getHostelRoomTypeResp, getHostelDetailsResp, getHostelRoomDetailsResp } =
        useAppSelector(
            ({ appData, classroomManagmentInfo, globalData, librarysettings, hostelSettings }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                libraryRecordRequestListResp: librarysettings.libraryRecordRequestListResp,
                getHostelBuildingResp: hostelSettings.getHostelBuildingResp,
                getHostelFloorResp: hostelSettings.getHostelFloorResp,
                getHostelRoomTypeResp: hostelSettings.getHostelRoomTypeResp,
                getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
                getHostelRoomDetailsResp: hostelSettings.getHostelRoomDetailsResp,

            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;

        if (name === 'hostelId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, buildingId: "", roomTypeId: "", roomId: "", floorId: "" }));
            const payload = { branchId: branchId, hostelId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };

            dispatch(resetHostelBuildingsListAct(undefined));
            dispatch(resetHostelFloorListAct(undefined));
            dispatch(resetHostelRoomTypeListAct(undefined));
            dispatch(resetHostelRoomDetailsListAct(undefined));

            dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, payload)));

        } else if (name === 'buildingId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, roomTypeId: "", roomId: "", floorId: "" }));
            const payload = { branchId: branchId, hostelId: advanceFilterState.hostelId, buildingId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };

            dispatch(resetHostelFloorListAct(undefined));
            dispatch(resetHostelRoomTypeListAct(undefined));
            dispatch(resetHostelRoomDetailsListAct(undefined));

            dispatch(getHostelFloorAct(generateActionPayload("get_hostel_floor", undefined, payload)));

        }
        else if (name === 'floorId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, roomTypeId: "", roomId: "" }));
            const floorPayload = { branchId: branchId, buildingId: advanceFilterState.buildingId, floorId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };


            dispatch(resetHostelRoomTypeListAct(undefined));
            dispatch(resetHostelRoomDetailsListAct(undefined));

            dispatch(getHostelRoomTypeAct(generateActionPayload("get_hostel_room_type", undefined, floorPayload)));

        }
        else if (name === 'roomTypeId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, roomId: "" }));
            hostelRoomDetailsList({ [name]: value });

            dispatch(resetHostelRoomDetailsListAct(undefined));

        }
        else if (name === 'roomId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, }));
        }
    }

    const hostelRoomDetailsList = (otherProps?: any) => {
        const { hostelId, buildingId, roomTypeId, floorId } = advanceFilterState;
        const payload = {
            branchId,
            hostelId,
            buildingId,
            roomTypeId,
            floorId,
            sortBy: "createdAt",
            orderBy: "asc",
            ...otherProps,
        };
        dispatch(getHostelRoomDetailsAct(generateActionPayload("get_hostel_room_details", undefined, payload)));
    };
    

    function applyFilterHndlr() {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter()
    }

    const { data: hostelDetailsResp } = getHostelDetailsResp || {};
    const { data: hostelBuildingResp } = getHostelBuildingResp || {};
    const { data: hostelFloorResp } = getHostelFloorResp || {};
    const { data: hostelRoomTypeResp } = getHostelRoomTypeResp || {};
    const { data: hostelRoomNoResp } = getHostelRoomDetailsResp || {};

    return (
        <>
            <div className="tw-p-4 tw-overflow-y-auto offcanvas-body">
                <div className="tw-mb-3">
                    <SelectInput
                        name="hostelId"
                        value={advanceFilterState.hostelId}
                        onChange={filterHandler}
                        menuItems={hostelDetailsResp || []}
                        valueKey="hostelId"
                        textKey="hostelName"
                        formgroupClassName="tw-mb-0"
                        labelText="Hostel Name"
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="buildingId"
                        value={advanceFilterState.buildingId}
                        onChange={filterHandler}
                        menuItems={hostelBuildingResp || []}
                        valueKey="id"
                        textKey="buildingName"
                        formgroupClassName="tw-mb-0"
                        labelText="Building Name"
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="floorId"
                        value={advanceFilterState.floorId}
                        onChange={filterHandler}
                        menuItems={hostelFloorResp || []}
                        valueKey="floorId"
                        textKey="floorName"
                        formgroupClassName="tw-mb-0"
                        labelText="Floor Name"
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="roomTypeId"
                        value={advanceFilterState.roomTypeId}
                        onChange={filterHandler}
                        menuItems={hostelRoomTypeResp || []}
                        valueKey="roomTypeId"
                        textKey="roomType"
                        formgroupClassName="tw-mb-0"
                        labelText="Room Type"
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="roomId"
                        value={advanceFilterState.roomId}
                        onChange={filterHandler}
                        menuItems={hostelRoomNoResp || []}
                        valueKey="id"
                        textKey="roomNo"
                        formgroupClassName="tw-mb-0"
                        labelText="Room No"
                    />
                </div>
            </div>
            <div className="tw-border-t tw-p-3 tw-text-center">
                <div className="hstack gap-2 justify-content-end">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
