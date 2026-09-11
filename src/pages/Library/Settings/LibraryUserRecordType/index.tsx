import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { generateColumns } from "./helper";
import { getLibraryRecordListAct, getLibraryUserRecordTypeListAct, getLibraryUserTypeListAct } from "../../../../store/library/settings/librarysettingsaction";
import { resetLibraryListAct } from "../../../../store/library/settings/librarysettingsslice";
import LibraryUserRecordTypeModel from "./LibraryUserRecordTypeModel";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  recordTypeId: "",
  userTypeId: "",
};

const LibraryUserRecordType = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const [libraryUserRecordTypeForm, setLibraryUserRecordType] = useState(initialValues);
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [libraryUserRecordTypeModelState, setLibraryUserRecordTypeModelState] = useState({
    showModal: false,
    userTypeId: undefined,
    modalData: undefined
  })

  const libraryUserRecordTypeList = (otherProps?: any) => {
    const { recordTypeId, userTypeId } = libraryUserRecordTypeForm;
    let payload = {
      branchId,
      recordTypeId,
      userTypeId,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getLibraryUserRecordTypeListAct(generateActionPayload("get_library_user_record_type", undefined, payload)));
  };

  const libraryRecordList = () => {
    dispatch(getLibraryRecordListAct(generateActionPayload("get_library_record", undefined)));
  };

  const libraryCategoryList = () => {
    dispatch(getLibraryUserTypeListAct(generateActionPayload("get_library_user_type", undefined)));
  };
  const libraryUserTypeList = () => {
    let payload = {
        branchId,
    };
    dispatch(getLibraryUserTypeListAct(generateActionPayload("get_library_user_type", undefined, payload)));
};
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryUserRecordTypeRequestListResp,
    libraryRecordRequestListResp,
    libraryUserTypeRequestListResp,
    editLibraryUserRecordTypeRequestResp,
    libraryDetailsErrorAct,
  } = useAppSelector(
    ({ librarysettings, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryUserRecordTypeRequestListResp: librarysettings.libraryUserRecordTypeRequestListResp,
      libraryRecordRequestListResp: librarysettings.libraryRecordRequestListResp,
      libraryUserTypeRequestListResp: librarysettings.libraryUserTypeRequestListResp,
      editLibraryUserRecordTypeRequestResp: librarysettings.editLibraryUserRecordTypeRequestResp,
      libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
    }),
    shallowEqual
  );

  const libraryUserRecordTypeRef = useRef({
    prevEditLibraryUserRecordTypeRequestResp: editLibraryUserRecordTypeRequestResp,
    prevLibraryDetailsErrorResp: libraryDetailsErrorAct,
  });

  useEffect(() => {
    const { prevEditLibraryUserRecordTypeRequestResp, prevLibraryDetailsErrorResp } = libraryUserRecordTypeRef.current;
    if (editLibraryUserRecordTypeRequestResp && prevEditLibraryUserRecordTypeRequestResp !== editLibraryUserRecordTypeRequestResp) {
      toast.success("User Record Type Updated Successfully.");
      toggleEditModal();
      libraryUserRecordTypeList();
    } else if (libraryDetailsErrorAct && prevLibraryDetailsErrorResp !== libraryDetailsErrorAct) {
      const { details } = libraryDetailsErrorAct;
      toast.error(details);
    }
    libraryUserRecordTypeRef.current.prevEditLibraryUserRecordTypeRequestResp = editLibraryUserRecordTypeRequestResp;
    libraryUserRecordTypeRef.current.prevLibraryDetailsErrorResp = libraryDetailsErrorAct;
  }, [editLibraryUserRecordTypeRequestResp, libraryDetailsErrorAct]);

  const toggleEditModal = useCallback((apiCall?: boolean) => {
    setLibraryUserRecordTypeModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: "",
      modalData: undefined
    }));
    if (typeof apiCall === "boolean" && apiCall) {
      libraryUserRecordTypeList();
    }
  }, [libraryUserRecordTypeRequestListResp]);

  function editUserTypeHndlr(event: any) {
    const userTypeId = event.currentTarget.getAttribute("data-id"),
      modalData = libraryUserRecordTypeRequestListResp?.content?.find((item: any) => item.userTypeId === Number(userTypeId));
    if (modalData) {
      setLibraryUserRecordTypeModelState((prevState: any) => ({
        ...prevState, showModal: true, userTypeId,
        modalData
      }));
    }
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-grey-400" size={20} />,
        actionName: "Edit",
        onClickHndlr: editUserTypeHndlr,
      },
    ],
    [libraryUserRecordTypeRequestListResp]
  );

  useEffect(() => {
    libraryUserRecordTypeList();
    libraryRecordList();
    libraryUserTypeList();
    libraryCategoryList();
  }, [branchId,instituteId,]);



  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryUserRecordTypeList(paginationInfo);
  }
  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setLibraryUserRecordType((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    libraryUserRecordTypeList({ [name]: value });
    setShowClearFilterState(true);
  };

  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    dispatch(resetLibraryListAct(undefined));
    setLibraryUserRecordType({ ...initialValues });
    libraryUserRecordTypeList({ ...initialValues });
    setShowClearFilterState(false);
  };

  const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

  const { content: libraryUserRecordTypeResp, totalElements, totalPages, pageable } = libraryUserRecordTypeRequestListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-flex-1">
                  Library User Record Type
                </h4>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-5 tw-items-end">
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-4">
                  <SelectInput
                    name="userTypeId"
                    labelText="User Type"
                    floatingLabel
                    value={libraryUserRecordTypeForm.userTypeId}
                    onChange={filterHandler}
                    menuItems={(Array.isArray(libraryUserTypeRequestListResp?.content) && libraryUserTypeRequestListResp?.content) || []}
                    valueKey="id"
                    textKey="userType"
                    formgroupClassName="tw-mb-2"
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-4">
                  <SelectInput
                    name="recordTypeId"
                    labelText="Record Type"
                    floatingLabel
                    value={libraryUserRecordTypeForm.recordTypeId}
                    onChange={filterHandler}
                    menuItems={(Array.isArray(libraryRecordRequestListResp?.content) && libraryRecordRequestListResp?.content) || []}
                    valueKey="id"
                    textKey="recordType"
                    formgroupClassName="tw-mb-2"
                  />
                </div>
                <div className="tw-col-span-12 tw-flex tw-justify-end">
                  {showClearFilterState && (
                     <Button type="button" variant="wrong"  onClick={clearFilterHndlr}>Clear</Button>
                  )}
                </div>
              </div>
              <TableContainer
                columns={columns || []}
                data={libraryUserRecordTypeResp || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-slate-50 tw-text-slate-500 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="library-user-type"
        isOpen={libraryUserRecordTypeModelState.showModal}
        toggle={() => toggleEditModal()}
        modalTitle={"Edit User Record Type"}
        modalSize="md"
      >
        <LibraryUserRecordTypeModel
          userTypeId={libraryUserRecordTypeModelState.userTypeId}
          modalTitle="Edit User Record Type"
          isOpen={false}
          modalData={libraryUserRecordTypeModelState.modalData}
          toggle={() => toggleEditModal()}        />
      </ModalContainerUpdated>
    </>
  );
};

export default LibraryUserRecordType;
