import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../Components/Common";


import { generateBranchesColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { useEffect, useRef } from "react";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {  updateMainBranchAct, deleteBranchAct, getInstBranchesWithAdminAct } from "../../../store/mastersettings/branch/branchactions";

//Modal Component
import AddBranchModal from "./AddBranchModal";
import AddBranchAdminModal from "./AddBranchAdminModal";

//Card Component
import BranchesCardContainer from "./BranchCard";
// Interface & Types
import {
  IBranchProps, IBranchModal, IBranchState, IDelBranchModalState, IBranchResp, IFilterBranchState
} from "./branchtypes";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import Button from "../../../Components/Common/Button";

const Branches: React.FC<IBranchProps> = ({ instituteId, instituteName }) => {
  const [addDranchModalState, setAddBranchModalState] = useState<IBranchModal>({
    showModal: false,
    branchId: ""
  });
  const [addBranchAdminModalState, setAddBranchAdminModalState] = useState<any>({
    showModal: false,
    branchId: undefined,
    branchAdminId: undefined,
    modalData: undefined,
  });
  const [delBranchModalState, setDelBranchModalState] = useState<IDelBranchModalState>({
    showModal: false,
    branchId: ""
  })
  const history = useHistory();
  const [branchState, setBranchState] = useState<IBranchState>({
    isListMode: true
  });
  const [filterState, setFilterState] = useState<IFilterBranchState>({
    branchName: undefined
  });
  const dispatch = useAppDispatch();
  const { branchesWithAdminResp, deleteBranchResp, setMainBranchResp, branchErrorResp } = useAppSelector(({ branch }) => ({
    branchesWithAdminResp: branch.branchesWithAdminResp,
    deleteBranchResp: branch.deleteBranchResp,
    setMainBranchResp: branch.setMainBranchResp,
    branchErrorResp: branch.branchErrorResp
  }), shallowEqual);

  const branchRespRef = useRef<IBranchResp>({
    prevDeleteBranchResp: deleteBranchResp,
    prevBranchErrorResp: branchErrorResp,
    prevSetMainBranchResp: setMainBranchResp
  });

  useEffect(() => {
    if (instituteId) {
      // const params = { instituteId };
      getBranchesApiCall();
      // dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", params)));
    }
  }, [instituteId]);

  useEffect(() => {
    const { prevDeleteBranchResp, prevSetMainBranchResp, prevBranchErrorResp } = branchRespRef.current;
    if (deleteBranchResp && prevDeleteBranchResp !== deleteBranchResp) {
      setDelBranchModalState((prevState: any) => ({ ...prevState, showModal: false, branchId: "" }));
      toast.success("Branch deleted successfully.");
      getBranchesApiCall();
    }
    else if (branchErrorResp && branchErrorResp !== prevBranchErrorResp) {
      const { message, details }: any = branchErrorResp;
      toast.error(message || details);
    } else if (setMainBranchResp && setMainBranchResp !== prevSetMainBranchResp) {
      toast.success("Main branch updated successfully.");
      getBranchesApiCall();
    }
    branchRespRef.current.prevDeleteBranchResp = deleteBranchResp;
    branchRespRef.current.prevSetMainBranchResp = setMainBranchResp;
    branchRespRef.current.prevBranchErrorResp = branchErrorResp;
  }, [deleteBranchResp, setMainBranchResp, branchErrorResp]);


  function addBranchHndlr() {
    setAddBranchModalState(prevState => ({ ...prevState, showModal: true, branchId: "", modalData: undefined }));
  }
  const toggleBranchModal = useCallback((apiCall?: boolean) => {
    setAddBranchModalState(prevState => ({ ...prevState, showModal: !prevState.showModal, modalData: undefined }));
    if (typeof (apiCall) === "boolean" && apiCall) {
      getBranchesApiCall();
    }
  }, [instituteId, branchesWithAdminResp]);

  const toggleAdminModal = useCallback((apiCall?: boolean) => {
    setAddBranchAdminModalState((prevState: any) => ({ ...prevState, branchId: "", showModal: false, modalData: undefined }));
    if (typeof (apiCall) === "boolean" && apiCall) {
      getBranchesApiCall();
    }
  }, [instituteId, branchesWithAdminResp]);
  function configurationHandler(event: any) {
    const branchId = event.currentTarget.getAttribute("data-id");
    if (branchId)
      history.push(`/general-settings/branch-setting`,{ branchId });
  }

  function editBranchHndlr(event: any) {
    const branchId = event.currentTarget.getAttribute("data-id");
    let modalData: any = undefined;
    if (branchId) {
      modalData = branchesWithAdminResp?.data?.find((item: any) => item.branchId === Number(branchId));
    }
    if (modalData) {
      setAddBranchModalState(prevState => ({ ...prevState, showModal: true, branchId, modalData }));
    }
  }

  function deleteBranchHndlr(event: any) {
    const branchId = event.currentTarget.getAttribute("data-id");
    if (branchId)
      setDelBranchModalState(prevState => ({ ...prevState, showModal: true, branchId }));
  }

  const menuOptions = useMemo((): IOptionsHrtl[] => {
    return ([{
      id: "edit",
      actionIcon: <i className={classnames("ri-pencil-fill text-primary fs-16", { "align-bottom me-2": !branchState.isListMode })}></i>,
      actionName: "Edit",
      onClickHndlr: editBranchHndlr,
    }, {
      id: "delete",
      actionIcon: <i className={classnames("ri-delete-bin-5-fill text-danger fs-16", { "align-bottom me-2": !branchState.isListMode })}></i>,
      actionName: "Delete",
      onClickHndlr: deleteBranchHndlr,
    }, {
      id: "configuration",
      actionIcon: <i className={classnames("ri-settings-5-fill  text-warning fs-16", { "align-bottom me-2": !branchState.isListMode })}></i>,
      actionName: "Configuration",
      onClickHndlr: configurationHandler,
    }])
  }, [branchState.isListMode, branchesWithAdminResp]);

  const cardMenuOptions = useMemo((): IOptionsHrtl[] => {
    return ([{
      id: "edit",
      actionIcon: <i className={classnames("ri-pencil-fill text-primary fs-16", { "align-bottom me-2": !branchState.isListMode })}></i>,
      actionName: "Edit",
      onClickHndlr: editBranchHndlr,
    }, {
      id: "delete",
      actionIcon: <i className={classnames("ri-delete-bin-5-fill text-danger fs-16", { "align-bottom me-2": !branchState.isListMode })}></i>,
      actionName: "Delete",
      onClickHndlr: deleteBranchHndlr,
    }, {
      id: "configuration",
      actionIcon: <i className={classnames("ri-settings-5-fill  text-warning fs-16", { "align-bottom me-2": !branchState.isListMode })}></i>,
      actionName: "Configuration",
      onClickHndlr: configurationHandler,
    }, {
      id: "assign-admin",
      actionIcon: <i className={classnames("ri-user-add-fill  text-info fs-16", { "align-bottom me-2": !branchState.isListMode })}></i>,
      actionName: "Assign Admin",
      onClickHndlr: assignAdminHndlr,
    }])
  }, [branchState.isListMode, branchesWithAdminResp]);

  function getBranchesApiCall(otherProps?: (IPaginationState | IFilterBranchState)) {
    const payload = { ...filterState, isAdminDetails: true, ...otherProps, instituteId };
    dispatch(getInstBranchesWithAdminAct(generateActionPayload("get_inst_branches", undefined, payload)));
  }
  function branchViewHandler(event: React.MouseEvent<HTMLElement>) {
    const viewMode = event.currentTarget.getAttribute("data-view");
    setBranchState(prevState => ({ ...prevState, isListMode: viewMode === "list" }));
  }

  function delModalCancelHndlr() {
    setDelBranchModalState(prevState => ({ ...prevState, showModal: false, branchId: "" }));
  }

  const updateMainBranchHndlr = useCallback((event: any) => {
    const branchId: string = event.currentTarget.getAttribute("data-id");
    if (branchId) {
      const params = { instituteId, branchId },
        payload = {
          isMainBranch: true
        }
      dispatch(updateMainBranchAct(generateActionPayload("update_main_branch", params, payload)));
    }
  }, [branchesWithAdminResp]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    getBranchesApiCall(paginationInfo);
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState(prevState => ({ ...prevState, [name]: value }));
    getBranchesApiCall({ "branchName": value });
  }

  function delModalSubmitHndlr() {
    const { branchId } = delBranchModalState;
    dispatch(deleteBranchAct(generateActionPayload("delete_branch", { branchId })));
  }

  function assignAdminHndlr(event: any) {
    const branchId: string = event.currentTarget.getAttribute("data-id");
    let modalData: any = undefined;
    if (branchId) {
      modalData = branchesWithAdminResp?.data?.find((item: any) => item.branchId === Number(branchId));
      if (modalData) {
        const { branchAdminBasicDetails } = modalData, { id } = branchAdminBasicDetails || {};
        setAddBranchAdminModalState((prevState: any) => ({
          ...prevState, showModal: true, branchId,
          branchAdminId: id,
          modalData
        }));
      }
    }

  }

  const branchColumns = useMemo(() => generateBranchesColumns(menuOptions, updateMainBranchHndlr, assignAdminHndlr), [branchesWithAdminResp]),
    { data: branchList, pageNumber, totalPages, totalElements } = branchesWithAdminResp || {};
  return (
    <React.Fragment>
      <div className="tw-bg-white tw-shadow tw-rounded-lg tw-mb-0">
        <div className="tw-px-4 tw-py-3 tw-rounded-t-lg tw-border-b tw-border-gray-200">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">

            <div className="tw-w-full lg:tw-w-1/3">
              <TextIconInput
                formgroupClassName="search-box"
                name="branchName"
                value={filterState.branchName}
                placeHolder="Search"
                onChange={onChangeFilterHndlr}
                labelText="Search"
                floatingLabel
              >
                <i className="ri-search-line search-icon"></i>
              </TextIconInput>
            </div>

            <div className="tw-flex tw-items-center tw-ml-auto tw-gap-2 tw-mt-2 lg:tw-mt-0">
              <div
                color="info"
                data-view="card"
                className={classnames(
                  "tw-cursor-pointer tw-bg-blue-100 tw-text-blue-600 tw-px-3 tw-py-2 tw-rounded tw-text-sm tw-flex tw-items-center tw-justify-center",
                  { "tw-bg-blue-500 tw-text-white": !branchState.isListMode }
                )}
                onClick={branchViewHandler}
              >
                <i className="ri-grid-fill"></i>
              </div>

              <div
                color="info"
                data-view="list"
                className={classnames(
                  "tw-cursor-pointer tw-bg-blue-100 tw-text-blue-600 tw-px-3 tw-py-2 tw-rounded tw-text-sm tw-flex tw-items-center tw-justify-center",
                  { "tw-bg-blue-500 tw-text-white": branchState.isListMode }
                )}
                onClick={branchViewHandler}
              >
                <i className="ri-list-unordered"></i>
              </div>

              <Button
              variant="primary"
                onClick={addBranchHndlr}
              >
                <i className="ri-add-fill tw-align-bottom"></i> Add Branch
              </Button>
            </div>

          </div>
        </div>

        {branchState.isListMode && (
          <TableContainer
            columns={branchColumns}
            data={Array.isArray(branchList) ? branchList : []}
            divClass="tw-overflow-x-auto tw-mb-1"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            showPagination={true}
            totalPages={totalPages}
            totalRecords={totalElements}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageNumber}
          />
        )}
      </div>
      {!branchState.isListMode &&
        <BranchesCardContainer
          branchesList={branchList || []}
          menuOptions={cardMenuOptions}
          updateMainBranchHndlr={updateMainBranchHndlr}
          assignAdminHndlr={assignAdminHndlr}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber}
        />}
        <ModalContainerUpdated
          id="add-branch-modal"
          isOpen={addDranchModalState.showModal}
          toggle={toggleBranchModal}
          modalTitle="Add Branch Admin"
          modalSize="lg"
            > 
      <AddBranchModal
        isOpen={addDranchModalState.showModal}
        toggle={toggleBranchModal}
        modalTitle={addDranchModalState.branchId ? "Edit Branch" : "Add Branch"}
        instituteId={instituteId}
        instituteName={instituteName}
        branchId={addDranchModalState.branchId}
        editBranchDetails={addDranchModalState.modalData}
      />
       </ModalContainerUpdated>
      <ModalContainerUpdated
          id="add-branch-admin"
          isOpen={addBranchAdminModalState.showModal}
          toggle={toggleAdminModal}
          modalTitle="Add Branch Admin"
          modalSize="lg"
            >        
      <AddBranchAdminModal
        isOpen={addBranchAdminModalState.showModal}
        toggle={toggleAdminModal}
        modalTitle={"Add Branch Admin"}
        instituteId={instituteId}
        branchId={addBranchAdminModalState.branchId}
        branchAdminId={addBranchAdminModalState.branchAdminId}
        editBranchAdminDetails={addBranchAdminModalState.modalData}
      />
            </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-branch-modal"
        isOpen={delBranchModalState.showModal}
        confirmMessage="Are you sure you want to delete this branch ?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
      />
    </React.Fragment >
  )
}


export default Branches;