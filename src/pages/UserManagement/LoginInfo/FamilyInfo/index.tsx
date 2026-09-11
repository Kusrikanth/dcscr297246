import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useFormik } from "formik";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";

import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { shallowEqual, } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Constants
import { roleTypes } from "../../../../Components/constants/common";

//Common Utility
import { getSortingKeys } from "../../../../utility/commonutility";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { ResetPasswordStrokeStandard } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  search: ""
};

const FamilyInfo = ({ instituteId, branchId, showCreateUserModal, closeModalHndlr }: any) => {
  const [studentFilterState, setStudentFilterState] = useState({ searchString: "" });

  const history = useHistory();
  const dispatch = useAppDispatch();
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const { getRoleTypeUsersResp,
    deleteRoleTypeUserResp, userManagementErrorResp
  } = useAppSelector(({ userManagement }) => ({
    getRoleTypeUsersResp: userManagement.getRoleTypeUsersResp,
    deleteRoleTypeUserResp: userManagement.deleteRoleTypeUserResp,
    userManagementErrorResp: userManagement.userManagementErrorResp
  }), shallowEqual);


  const menuOptions = useMemo(
    () => [
      {
        id: "change-password",
        actionIcon: <HugeiconsIcon icon={ResetPasswordStrokeStandard} className="tw-mr-2 tw-text-gray-500 align-bottom" size={18} />,
        actionName: "Change Password",
        // onClickHndlr: changePwdHandler
      },
    ], [getRoleTypeUsersResp]);

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    // getStudentsHavingLoginIdApiCall();
  }

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;
    setStudentFilterState((prevState: any) => ({ ...prevState, [name]: value }));
  }

  const { data: studentData, totalElements, pageNumber, totalPages } = getRoleTypeUsersResp || {};
  const roleColumns = useMemo(() => generateColumns(menuOptions), [getRoleTypeUsersResp]);
  return (
    <>
      <div className="tw-w-full">
        <div className="tw-px-4 tw-py-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-4">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  value={studentFilterState.searchString}
                  onChange={onChangeFilterHndlr}
                  formgroupClassName="tw-mb-0"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <TableContainer
          columns={roleColumns || []}
          data={[]}
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber}
          manualSorting={true}
        />
      </div>
    </>
  );
};

export default FamilyInfo;
