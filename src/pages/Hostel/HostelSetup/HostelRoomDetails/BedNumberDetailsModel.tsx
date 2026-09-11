import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getHostelRoomDetailsListByIdAct, } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { generateDetailsColumns, } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";


const BedNumberDetailsModel = (props: any) => {
    const dispatch = useDispatch();
    const [roomDetails, setRoomDetails] = useState<any>(null);
  
    const {
      currentBranchIdResp: branchId,
      getHostelRoomDetailsListByIdResp,
    }: any = useAppSelector(
      ({ hostelSettings, appData }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        getHostelRoomDetailsListByIdResp: hostelSettings.getHostelRoomDetailsListByIdResp,
      })
    );
  
    useEffect(() => {
      if (props.id && props.isOpen) {
        dispatch(getHostelRoomDetailsListByIdAct(generateActionPayload("get_Hostel_room_details_list_by_id", { id: props.id })));
      }
    }, [props.isOpen])
 
    const roleColumns = useMemo(() => generateDetailsColumns(), []);
    const tableData = getHostelRoomDetailsListByIdResp ? [getHostelRoomDetailsListByIdResp] : [];

  return (
    <>
      <div className="tw-grid tw-grid-cols-1">
        <div className="tw-col-span-1 tw-mt-4">
          <TableContainer
            columns={roleColumns || []}
            data={tableData}
            divClass="tw-overflow-x-auto tw-mb-1"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          />
        </div>
      </div>
    </>
  );
};

export default BedNumberDetailsModel;