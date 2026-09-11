import React, { useEffect, useMemo, useState } from 'react'
import ParentGuardianContainer, { ParentGuardianCard } from './ParentGuardianCard'
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getInstBranchesWithAdminAct } from '../../../../store/mastersettings/branch/branchactions';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import classnames from "classnames";

import { IBranchState, IOptionsHrtl } from './ParentGuardianTypes';


const ParentGuardian = () => {

    const dispatch = useDispatch()
    const [branchState, setBranchState] = useState<IBranchState>({
        isListMode: true
      });

    const { branchesWithAdminResp, deleteBranchResp, setMainBranchResp, branchErrorResp,getStudentByIdResp } = useAppSelector(({ branch,directoryStudent }) => ({
        branchesWithAdminResp: branch.branchesWithAdminResp,
        deleteBranchResp: branch.deleteBranchResp,
        setMainBranchResp: branch.setMainBranchResp,
        branchErrorResp: branch.branchErrorResp,
        getStudentByIdResp:directoryStudent.getStudentByIdResp,
      }), shallowEqual);

      const editBranchHndlr = ()=>{}
      const deleteBranchHndlr = ()=>{}

      const cardMenuOptions = [{
        id: "edit",
        actionIcon: <i className={classnames("ri-pencil-fill text-primary fs-16", { "align-bottom tw-me-2": !branchState.isListMode })}></i>,
        actionName: "Edit",
        onClickHndlr: editBranchHndlr,
      }, {
        id: "delete",
        actionIcon: <i className={classnames("ri-delete-bin-5-fill text-danger fs-16", { "align-bottom tw-me-2": !branchState.isListMode })}></i>,
        actionName: "Delete",
        onClickHndlr: deleteBranchHndlr,
      }]

    // { data } = branchesWithAdminResp || {};

  return (
    <div>
      <ParentGuardianContainer
          branchesList={getStudentByIdResp?.studentParentDetails?.length>0 ? getStudentByIdResp?.studentParentDetails : []}
          menuOptions={cardMenuOptions}
        //   updateMainBranchHndlr={updateMainBranchHndlr}
        //   assignAdminHndlr={assignAdminHndlr}
        //   totalPages={totalPages}
        //   totalRecords={totalElements}
        //   callbackPaginationHndlr={paginationHndlr}
        //   currentPageNumber={pageNumber}
        />
    </div>
  )
}

export default ParentGuardian
