import { useFormik } from "formik";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { ConfirmationModal, ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { routesProps } from "./RoutesTypes";
import { generateColumns } from "./helper";
import RoutesTabModal from "./RoutesTabModal";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { deleteRouteDetailAct, getRouteListAct, getRoutesListByIdAct } from "../../../../store/transportation/transportationaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useModal } from "../../../../hooks/modalhook";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues: routesProps = {
  search: "",
};

const RoutesTab = () => {
  const dispatch = useAppDispatch();
  const { modalState: routesTabModal, closeModal: closeRoutesTabModalHndlr,
    openModal: openRoutesTabModalHndlr
  } = useModal();
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const { routeRequestListResp, addRouteRequestResp, updateRouteDetailRequestResp, currentBranchIdResp: branchId,
    currentInstIdResp: instituteId, delRouteRequestResp, showApiLoader } = useAppSelector(({ transportrequest, appData, globalData }) => ({
      routeRequestListResp: transportrequest.routeRequestListResp,
      addRouteRequestResp: transportrequest.addRouteRequestResp,
      updateRouteDetailRequestResp: transportrequest.updateRouteDetailRequestResp,
      delRouteRequestResp: transportrequest.delRouteRequestResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
    }), shallowEqual);

  const routeRespRef = useRef({
    prevDelRouteRequestResp: delRouteRequestResp,
  });

  useEffect(() => {
    const { prevDelRouteRequestResp } = routeRespRef.current;
    if (delRouteRequestResp && prevDelRouteRequestResp !== delRouteRequestResp) {
      delModalCancelHndlr()
      getRoutesList()
      toast.success("Route Details Deleted successfully.");
    }
    routeRespRef.current.prevDelRouteRequestResp = delRouteRequestResp;

  }, [delRouteRequestResp, updateRouteDetailRequestResp]);

  const routesTabFilterForm = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => { },
  });
  const [delFeeDeptModalState, setDelFeeDeptModalState] = useState<any>({
    showModal: false,
    routeId: ""
  })
  const menuOptions = useMemo((): IOptionsHrtl[] => ([{
    id: "edit",
    actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={20} />,
    actionName: "Edit",
    onClickHndlr: editFeeCategoryHndlr,
  },
  ]), [routeRequestListResp]);

  const getRoutesList = (otherProps?: any) => {
    dispatch(getRouteListAct(generateActionPayload("get_route_details_list", undefined, { branchId, instituteId, ...paginationDetailRef.current, sortBy: "routeName", orderBy: "ASC", routeName: routesTabFilterForm.values.search || null, ...otherProps })))
  }

  function editFeeCategoryHndlr(event: any) {
    const routeId = event.currentTarget.getAttribute("data-id")
    openRoutesTabModalHndlr(routeId)
    dispatch(getRoutesListByIdAct(generateActionPayload("get_route_by_id", { routeId }, undefined,)))

  }

  function deleteFeeCategoryHndlr(event: any) {
    const routeId = event.currentTarget.getAttribute("data-id");
    if (routeId)
      setDelFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: true, routeId }));
  }

  function delModalCancelHndlr() {
    setDelFeeDeptModalState((prevState: any) => ({ ...prevState, showModal: false }));
  }

  function delModalSubmitHndlr() {
    const { routeId } = delFeeDeptModalState;
    dispatch(deleteRouteDetailAct(generateActionPayload("delete_route_details", { routeId: routeId })));
  }
  
  const roleColumns = useMemo(() => generateColumns(menuOptions), [routeRequestListResp]);

  useEffect(() => {
    getRoutesList()
  }, [addRouteRequestResp, updateRouteDetailRequestResp, branchId, instituteId])

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getRoutesList();
  }

  const filterHndler = (event: any) => {
    routesTabFilterForm.handleChange(event)
    paginationDetailRef.current.pageNo = 0
    getRoutesList({ routeName: event.target.value })
  }

  const { totalElements, totalPages, pageNumber } = routeRequestListResp || {}

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Transport Concession" pageTitle="Transportation" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                  Routes
                </h4>
                <div className="lg:tw-col-span-9 xl:tw-col-span-10 tw-flex tw-justify-end">
                  <Button
                    onClick={() => openRoutesTabModalHndlr()}
                    variant="primary"
                  >
                    <i className="ri-add-line" />
                    Add New
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-items-end">
                <div className="lg:tw-col-span-3 xl:tw-col-span-4">
                  <div>
                    <div className="search-box tw-relative">
                      <TextInput
                        name="search"
                        value={routesTabFilterForm.values.search}
                        onChange={filterHndler}
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search"
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TableContainer
              columns={roleColumns || []}
              data={routeRequestListResp?.data || []}
              divClass="tw-overflow-x-auto tw-mb-1"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
              showPagination={true}
              totalRecords={totalElements || 0}
              callbackPaginationHndlr={paginationHndlr}
              totalPages={totalPages || 0}
              currentPageNumber={pageNumber || 0}
            />
          </div>
        </div>

        <ModalContainerUpdated
          id="add-edit-route-details"
          isOpen={routesTabModal.showModal}
          toggle={closeRoutesTabModalHndlr}
          modalTitle={
            routesTabModal.modalData
              ? "Update Route Details"
              : "Create New Route"
          }
          modalSize="md"
        >
          <RoutesTabModal
            isOpen={routesTabModal.showModal}
            toggle={closeRoutesTabModalHndlr}
            modalTitle={
              routesTabModal.modalData
                ? "Update Route Details"
                : "Create New Route"
            }
            routeId={routesTabModal.modalData}
          />
        </ModalContainerUpdated>

        <ConfirmationModal
          id="delete-route-modal"
          isOpen={delFeeDeptModalState.showModal}
          confirmMessage="Are you sure you want to delete this Route ?"
          cancelHndlr={delModalCancelHndlr}
          confirmHndlr={delModalSubmitHndlr}
          showImgIcon={true}
          isDisble={showApiLoader}
          iconType="reject"
        />
      </div>
    </>
  );
};

export default RoutesTab;
