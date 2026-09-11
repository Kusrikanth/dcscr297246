import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import {
  hasStateChanged,
  relocateColumns,
} from "./helper";
import RelocateModel from "./RelocateModel";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getStockRelocateListAct, getStockVerificationListAct } from "../../../store/library/stockDetails/stockdetailsaction";
import { resetLibraryListAct, resetLibraryRoomAct, resetRackAct, resetShelfAct } from "../../../store/library/settings/librarysettingsslice";
import { getLibraryDetailsListAct, getLibraryrack, getLibraryRooms, getLibraryshelf } from "../../../store/library/settings/librarysettingsaction";
import { toast } from "react-toastify";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  libraryId: "",
  roomId: "",
  shelfId: "",
  rackId: "",
};

const RelocateStock = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [relocateStockModelState, setRelocateStockModelState] =
    useState({
      showModal: false,
      branchId: "",
      academicYearId: "",
    });
  const [relocateStock, setRelocateStock] = useState(initialValues);
  const RelocateStockForm = useFormik({
    enableReinitialize: true,
    initialValues: relocateStock,
    onSubmit: (values) => { },
  });
  const toggleRelocateStockModel = () => {
    setRelocateStockModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const columns = useMemo(() => relocateColumns(),
    []
  );

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const RelocateStockDetailsList = (otherProps = {}) => {
    const { academicYearId, searchString, libraryId, roomId, shelfId, rackId } = relocateStock;
    let payload = {
      branchId,
      libraryId,
      roomId,
      shelfId, rackId,
      searchString,
      academicYearId,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.academicYearId) {
      dispatch(getStockRelocateListAct(generateActionPayload("get_library_stock_relocate_list", undefined, payload)));
    }
  };

  const libraryDetailsList = (otherProps?: any) => {
    let payload = {
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      pageNo: 0, pageSize: 20,
      ...otherProps,
    };
    dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
  };
  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    stockRecloateRequestListResp,
    libraryDetailsRequestListResp,
    libraryRoomsRequestListResp,
    libraryShelfRequestListResp,
    libraryRackRequestListResp,
    stockCheckingErrorAct,
  }: any = useAppSelector(
    ({ instAcademics, appData, stockChecking, librarysettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      stockRecloateRequestListResp: stockChecking.stockRecloateRequestListResp,
      libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
      libraryShelfRequestListResp: librarysettings.libraryShelfRequestListResp,
      libraryRackRequestListResp: librarysettings.libraryRackRequestListResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      stockCheckingErrorAct: stockChecking.stockCheckingErrorAct,

    }),
    shallowEqual
  );

  const RelocateStockDetailsRef = useRef({
    prevStockCheckingErrorAct: stockCheckingErrorAct,

  })

  useEffect(() => {
    const { prevStockCheckingErrorAct } = RelocateStockDetailsRef.current;
    if (stockCheckingErrorAct && prevStockCheckingErrorAct !== stockCheckingErrorAct) {
      const { details } = stockCheckingErrorAct;
      toast.error(details || "Something went wrong!");
    }
    RelocateStockDetailsRef.current.prevStockCheckingErrorAct = stockCheckingErrorAct;

  }, [stockCheckingErrorAct,])

  useEffect(() => {
    const payload = { instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    RelocateStockDetailsList();
    libraryDetailsList();
  }, [instituteId]);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setRelocateStock((prev: any) => ({ ...prev, academicYearId: yearId }));
      RelocateStockDetailsList({ academicYearId: yearId, });
    }
  }, [academicYearListResp]);

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === 'libraryId') {
      setRelocateStock((prev: any) => ({ ...prev, [name]: value, roomId: "", shelfId: "", rackId: "", }));
      const payload = { branchId: branchId, libraryId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      RelocateStockDetailsList({ [name]: value })
      if (!value) {
        dispatch(resetShelfAct(undefined))
        dispatch(resetRackAct(undefined));
        dispatch(resetLibraryRoomAct(undefined))
        dispatch(resetLibraryListAct(undefined));
      }
      else {
        dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
      }
    } else if (name === 'roomId') {
      setRelocateStock((prev: any) => ({ ...prev, [name]: value, shelfId: "", rackId: "", }));
      const payload = { branchId: branchId, roomId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      RelocateStockDetailsList({ [name]: value })
      if (!value) {
        dispatch(resetShelfAct(undefined))
        dispatch(resetRackAct(undefined));
      }
      else {
        dispatch(getLibraryshelf(generateActionPayload("get_library_shelf", undefined, payload)));
      }
    } else if (name === 'shelfId') {
      setRelocateStock((prev: any) => ({ ...prev, [name]: value, rackId: "", }));
      const shelfPayload = { branchId: branchId, shelfId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      RelocateStockDetailsList({ [name]: value });

      if (!value) {
        dispatch(resetRackAct(undefined));
      } else {
        dispatch(getLibraryrack(generateActionPayload("get_library_rack", undefined, shelfPayload)));
      }
    } else {
      setRelocateStock((prev: any) => ({ ...prev, [name]: value }));
      RelocateStockDetailsList({ [name]: value });
    }
    const stateChanged = hasStateChanged({ ...initialValues, [name]: value });
    setShowClearFilterState(stateChanged?.stateChange);
  };

  const clearFilterHndlr = () => {
    setRelocateStock(initialValues);
    pagination.current.pageNo = 0;
    RelocateStockDetailsList({ libraryId: "", roomId: "", searchString: "" });
    setShowClearFilterState(false);
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    RelocateStockDetailsList(paginationInfo);
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { content: RelocateStockDetails = [], totalElements = 0, totalPages = 0, pageable = {} } = stockRecloateRequestListResp || {};
  const { content: libraryRoomNameResp } = libraryRoomsRequestListResp || {};
  const { data: libraryShelfNameResp } = libraryShelfRequestListResp || {};
  const { content: libraryRackNameResp } = libraryRackRequestListResp || {};

  return (
    <>

      <div className="tw-bg-white tw-rounded tw-shadow tw-mb-0">
        <div className="tw-border-b tw-py-2 tw-px-4">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-6">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Relocate
              </h4>
            </div>
            <div className="tw-col-span-6 tw-flex tw-justify-end">
              <Button
                variant="info"
                type="button"
                className="tw-flex tw-items-center"
                onClick={toggleRelocateStockModel}
              >
                Relocate
              </Button>
            </div>
          </div>
        </div>
        <div className="tw-p-0">
          <form onSubmit={RelocateStockForm.handleSubmit}>
            <div className="tw-px-4 tw-pt-5 tw-pb-2">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search..."
                      value={RelocateStockForm.values.searchString}
                      onChange={filterHandler}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={RelocateStockForm.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="libraryId"
                    value={RelocateStockForm.values.libraryId}
                    onChange={filterHandler}
                    menuItems={libraryDetailsRequestListResp?.content || []}
                    valueKey="id"
                    textKey="libraryName"
                    formgroupClassName="tw-mb-0"
                    labelText="Library Name"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="roomId"
                    value={RelocateStockForm.values.roomId}
                    onChange={filterHandler}
                    menuItems={libraryRoomNameResp}
                    valueKey="id"
                    textKey="roomName"
                    formgroupClassName="tw-mb-0"
                    labelText="Room Name"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="shelfId"
                    value={RelocateStockForm.values.shelfId}
                    onChange={filterHandler}
                    menuItems={libraryShelfNameResp}
                    valueKey="id"
                    textKey="shelfName"
                    formgroupClassName="tw-mb-0"
                    labelText="Shelf"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="rackId"
                    value={RelocateStockForm.values.rackId}
                    onChange={filterHandler}
                    menuItems={libraryRackNameResp}
                    valueKey="id"
                    textKey="rackName"
                    formgroupClassName="tw-mb-0"
                    labelText="Rack"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 tw-flex tw-justify-end">
                  {showClearFilterState && (
                    <Button
                      variant="wrong"
                      type="button"
                      className="tw-px-2 tw-py-1"
                      onClick={clearFilterHndlr}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
          <TableContainer
            columns={columns || []}
            data={RelocateStockDetails || []}
            tableClass="tw-mb-0"
            divClass="tw-overflow-x-auto tw-mb-3"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            showCheckbox={false}
            showPagination={true}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            selectedMembers
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageable?.pageNumber || 0}
          />
        </div>
      </div>
      <ModalContainerUpdated
        id="relocate-book"
        isOpen={relocateStockModelState.showModal}
        toggle={toggleRelocateStockModel}
        modalTitle="Relocate Book"
        modalSize="xl"
      >
        <RelocateModel
          isOpen={relocateStockModelState.showModal}
          toggle={toggleRelocateStockModel}
          modalTitle="Relocate Book"
        />
      </ModalContainerUpdated>

    </>
  );
};

export default RelocateStock;
