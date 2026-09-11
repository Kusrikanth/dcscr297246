import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ConfirmationModal,
  DateInput,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getBranchCurriculumAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import {
  exportChangeTraReqListAct,
  getChangeTraReqListAct,
} from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import classNames from "classnames";
import UpdateChangeTransferStatus from "./UpdateChangeTransferStatus";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";

const initialValues: any = {
  searchString: "",
  academicYearId: "",
};

const CurrentBranchToOtherBranch = ({ activeId }: any) => {
  const history = useHistory();

  const dispatch = useDispatch();
  const [updateStatusModal, setUpdateStatusModal] = useState<any>({
    showModal: false,
    id: undefined,
    data: undefined,
  });

  const pagination: any = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const [exportExcel, setExportExcel] = useState<any>({
    showModal: false,
    id: undefined,
  });

  const [changeTransReqState, setChangeTransReqState] =
    useState<any>(initialValues);

  const {
    academicYearListResp,

    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    updateStatusChangeTransferResp,
    applicationSaleError,
    exportChangeTraReqListResp,
    showApiLoader,
    getChangeTraReqListResp,
  }: any = useAppSelector(
    ({ applicationSale, globalData, instAcademics, appData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      updateStatusChangeTransferResp:
        applicationSale.updateStatusChangeTransferResp,
      applicationSaleError: applicationSale.applicationSaleError,
      showApiLoader: globalData.showApiLoader,
      exportChangeTraReqListResp: applicationSale.exportChangeTraReqListResp,
      getChangeTraReqListResp: applicationSale.getChangeTraReqListResp,
    }),
    shallowEqual
  );

  const ChangeTransReqList = (otherProps?: any) => {
    const { academicYearId, searchString } = changeTransReqState;
    const branchField =
      activeId === "other-branch-to-current-branch"
        ? "recommendedBranchId"
        : "fromBranchId";
    let payload = {
      academicYearId: academicYearId,
      [branchField]: branchId,
      searchString,
      orderBy: "",
      sortBy: "",
      ...pagination.current,
      ...otherProps,
    };
    if (payload.academicYearId) {
      dispatch(
        getChangeTraReqListAct(
          generateActionPayload(
            "get_change_transfer_request",
            undefined,
            payload
          )
        )
      );
    }
  };

  useEffect(() => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    ChangeTransReqList({ pageNo: 0 });
  }, [activeId]);

  const changeTransferRequestRef = useRef({
    prevExportChangeTraReqListResp: exportChangeTraReqListResp,
    prevUpdateStatusChangeTransferResp: updateStatusChangeTransferResp,
    prevApplicationSaleError: applicationSaleError,
  });
  useEffect(() => {
    const {
      prevExportChangeTraReqListResp,
      prevApplicationSaleError,
      prevUpdateStatusChangeTransferResp,
    } = changeTransferRequestRef.current;
    if (
      exportChangeTraReqListResp &&
      prevExportChangeTraReqListResp !== exportChangeTraReqListResp
    ) {
      toast.success("Data Export Successfully");
      toggleExportExcelModal();
      downloadExcelFile(exportChangeTraReqListResp);
    } else if (
      updateStatusChangeTransferResp &&
      prevUpdateStatusChangeTransferResp !== updateStatusChangeTransferResp
    ) {
      toast.success("Status Update Successfully");
      ChangeTransReqList();
      toggleUpdateStatusModal();
    } else if (
      applicationSaleError &&
      prevApplicationSaleError !== applicationSaleError
    ) {
      const { details } = applicationSaleError;
      toast.error(details);
    }
    changeTransferRequestRef.current.prevExportChangeTraReqListResp =
      exportChangeTraReqListResp;
    changeTransferRequestRef.current.prevUpdateStatusChangeTransferResp =
      updateStatusChangeTransferResp;
    changeTransferRequestRef.current.prevApplicationSaleError =
      applicationSaleError;
  }, [
    exportChangeTraReqListResp,
    applicationSaleError,
    updateStatusChangeTransferResp,
  ]);

  function downloadExcelFile(blobStream: any) {
    const url = window.URL.createObjectURL(new Blob([blobStream]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Recommended_Campus_Export.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const updateStatusHndler = (event: any) => {
    const id = event.currentTarget.getAttribute("data-id");
    if (id) {
      const data = getChangeTraReqListResp?.content?.find(
        (item: any) => +item?.id === +id
      );
      toggleUpdateStatusModal(id, data);
    }
  };

  const toggleUpdateStatusModal = (id?: any, data?: any) => {
    setUpdateStatusModal((prev: any) => ({
      ...prev,
      showModal: !prev.showModal,
      id: id || "",
      data: data || "",
    }));
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "updateStatus",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="me-2 text-muted"
            size={18}
          />
        ),
        actionName: "Update Status",
        onClickHndlr: updateStatusHndler,
      },
    ],
    [getChangeTraReqListResp]
  );

  const roleColumns = useMemo(
    () => generateColumns(menuOptions),
    [getChangeTraReqListResp]
  );

  useEffect(() => {
    const payload = {
      instituteId: instituteId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "academicYearName",
      orderBy: "desc",
    };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    const payload1 = {
      branchId: branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
    };
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload1)
      )
    );
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    };
  }, []);

  useEffect(() => {
    if (academicYearListResp) {
      let yearId =
        academicYearListResp &&
        academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault)
          ?.academicYearId;

      setChangeTransReqState((prev: any) => ({
        ...prev,
        academicYearId: yearId,
      }));
      ChangeTransReqList({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    setChangeTransReqState((prev: any) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    ChangeTransReqList({ [name]: value });
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    ChangeTransReqList(paginationInfo);
  }

  const toggleExportExcelModal = (id?: any) => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      scrutinyId: id || "",
    }));
  };

  const exportExcelHndler = () => {
    const { academicYearId, searchString } = changeTransReqState;
    let payload = {
      academicYearId: academicYearId,
      recommendedBranchId: branchId,
      searchString,
    };
    dispatch(
      exportChangeTraReqListAct(
        generateActionPayload(
          "export_change_transfer_request",
          undefined,
          { ...payload },
          {
            responseType: "blob",
          }
        )
      )
    );
  };

  const { data: academicYearList } = academicYearListResp || {};
  const {
    content: changeTraReqResp,
    totalElements,
    totalPages,
    pageble,
  } = getChangeTraReqListResp || {};

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-border-0 tw-shadow-none">
        <div className="tw-p-6">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">

            {/* Search */}
            <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
              <div className="tw-relative  search-box">
                <TextInput
                  name="searchString"
                  value={changeTransReqState.searchString}
                  onChange={filterHandler}
                  inputClassName="tw-bg-gray-100"
                  formgroupClassName="tw-mb-0"
                  placeHolder="Search..."
                  labelText="Search"
                  floatingLabel
                />
                <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
              </div>
            </div>

            {/* Academic Year */}
            <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
              <SelectInput
                name="academicYearId"
                value={changeTransReqState.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="tw-mb-0"
                labelText="Academic Year"
                floatingLabel
              />
            </div>

          </div>
        </div>

        {/* Table */}
        <TableContainer
          columns={roleColumns || []}
          data={changeTraReqResp || []}
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
          showPagination={true}
          totalPages={totalPages || 0}
          totalRecords={totalElements || 0}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageble?.pageNumber || 0}
        />
      </div>


      <ModalContainerUpdated
        id="change-transfer-request-export"
        isOpen={exportExcel.showModal}
        toggle={toggleExportExcelModal}
        modalTitle="Export Recommended Campus Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="admission"
          subFeature="recommended_campus"
          remarksText="Enter remarks to export recommended campus data?"
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="update-status-change-transfer-request"
        isOpen={updateStatusModal.showModal}
        toggle={toggleUpdateStatusModal}
        modalTitle="Update Status Change Transfer Request"
        modalSize="md"
      >
        <UpdateChangeTransferStatus
          toggle={toggleUpdateStatusModal}
          data={updateStatusModal.data}
          isOpen={updateStatusModal.showModal}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default CurrentBranchToOtherBranch;
