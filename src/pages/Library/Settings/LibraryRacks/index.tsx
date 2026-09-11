import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import {
  generateColumns,
  hasStateChanged,
} from "./helper";
import LibraryRacksModel from "./LibraryRacksModel";
import { deleteLibraryRackPromptAct, deleteLibraryRacksListAct, getLibraryDetailsListAct, getLibraryRacksListByIdAct, getLibraryRooms, getLibraryrack, getLibraryshelf } from "../../../../store/library/settings/librarysettingsaction";
import { useAppSelector } from "../../../../hooks/storehook";
import Pagination, { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { resetLibraryListAct, resetLibraryRoomAct, resetLibraryShelfAct } from "../../../../store/library/settings/librarysettingsslice";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  libraryId: "",
  roomId: "",
  shelfId: "",
};

const LibraryRacks = () => {
  const history = useHistory()
  const [LibraryRacksModelState, setLibraryRacksModelState] =
    useState({
      showModal: false,
      id: undefined
    });
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [LibraryRacks, setLibraryRacks] = useState(initialValues);
  const dispatch = useDispatch();
  const LibraryRacksForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryRacks,
    onSubmit: (values) => { },
  });
  const [delLibraryRacksModalState, setDelLibraryRacksModalState] = useState({
  showModal: false,
  id: "",
  confirmMessage: "",
  isExpanded: false,
  fullBookIds: [],
  prefixText: "",
  shouldShowModal: false,
  })
  const toggleLibraryRacksModel = (id?: any) => {
    setLibraryRacksModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  };
  const pagination: any = useRef<any>({
    pageNo: 0,
    pageSize: 10
})
  const toggleDelLibraryRacksModal = (id?: string) => {
    if (!id) {
      setDelLibraryRacksModalState((prevState) => ({
        ...prevState,
        showModal: false,
        id: "",
        confirmMessage: "",
      }));
      return;
    }
    const payload = {
      branchId,
      rackId: id,
    };
    dispatch(
      deleteLibraryRackPromptAct(
        generateActionPayload("delete_library_rack_prompt", undefined, payload)
      )
    );

    setDelLibraryRacksModalState((prevState) => ({
      ...prevState,
      showModal: true,
      id,
      confirmMessage: "Loading...",
    }));
  };

const delLibraryRacksConfirmHndler = () => {
  dispatch(deleteLibraryRacksListAct(generateActionPayload("delete_Library_racks_list", { id: delLibraryRacksModalState.id },)));
}
  const libraryRackList = (otherProps?: any) => {
    const { searchString, libraryId, roomId, shelfId } = LibraryRacks;
    let payload = {
      branchId,
      libraryId,
      shelfId,
      roomId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
dispatch(getLibraryrack(generateActionPayload("get_library_rack", undefined, payload)))
  };

  const libraryNameList = ( otherProps?: any) => {
    const { libraryId } = LibraryRacks;
    const payload = {
      branchId,
      libraryId: libraryId ,
      pageSize: 100,
      ...otherProps,
    };
    dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
  };
  const libraryRoomsList = (otherProps?: any) => {
    const { libraryId } = LibraryRacks;
    const payload = {
      branchId,
      ...otherProps,
      libraryId
    };
    if (payload.libraryId) {
    dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
   }
  };

const {
  currentBranchIdResp: branchId,
  currentInstIdResp: instituteId,
  showApiLoader,
  libraryRackRequestListResp,
  libraryShelfRequestListResp,
  libraryDetailsRequestListResp,
  libraryRoomsRequestListResp,
  saveLibraryRacksListResp,
  editLibraryRacksRequestResp,
  delLibraryRacksRequestResp,
  deleteLibraryRackPromptListResp,
  libraryDetailsErrorAct
} = useAppSelector(
  ({ librarysettings, appData, globalData, }) => ({
    
    currentBranchIdResp: appData.currentBranchIdResp,
    showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryRackRequestListResp: librarysettings.libraryRackRequestListResp,
      libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
      libraryShelfRequestListResp: librarysettings.libraryShelfRequestListResp,
      saveLibraryRacksListResp: librarysettings.saveLibraryRacksListResp,
      editLibraryRacksRequestResp: librarysettings.editLibraryRacksRequestResp,
      deleteLibraryRackPromptListResp: librarysettings.deleteLibraryRackPromptListResp,
      delLibraryRacksRequestResp: librarysettings.delLibraryRacksRequestResp,
  }),
  shallowEqual
);
const libraryRackRef = useRef({
  prevAddLibraryRacks: saveLibraryRacksListResp,
  prevEditLibraryRacks: editLibraryRacksRequestResp,
  prevDeleteLibraryRacksRequestListResp: delLibraryRacksRequestResp,
  prevLibraryRackErrorResp: libraryDetailsErrorAct,
})
useEffect(() => {
  const { prevAddLibraryRacks, prevEditLibraryRacks, prevDeleteLibraryRacksRequestListResp, prevLibraryRackErrorResp } = libraryRackRef.current;
    if (saveLibraryRacksListResp && prevAddLibraryRacks !== saveLibraryRacksListResp) {
      toast.success("Library Racks added successfully.");
      toggleLibraryRacksModel()
      libraryRackList()
    }
    else if (editLibraryRacksRequestResp && prevEditLibraryRacks !== editLibraryRacksRequestResp) {
      toast.success("Library Racks updated successfully.");
      toggleLibraryRacksModel()
      libraryRackList()
    }
    else if (delLibraryRacksRequestResp && prevDeleteLibraryRacksRequestListResp !== delLibraryRacksRequestResp) {
      toast.success("Library Racks deleted successfully.");
      toggleDelLibraryRacksModal()
      libraryRackList()
    }
    else if (libraryDetailsErrorAct && prevLibraryRackErrorResp !== libraryDetailsErrorAct) {
      const { details } = libraryDetailsErrorAct;
      toast.error(details);
    }
    libraryRackRef.current.prevDeleteLibraryRacksRequestListResp = delLibraryRacksRequestResp;
    libraryRackRef.current.prevEditLibraryRacks = editLibraryRacksRequestResp;
    libraryRackRef.current.prevAddLibraryRacks = saveLibraryRacksListResp;
    libraryRackRef.current.prevLibraryRackErrorResp = libraryDetailsErrorAct;
  }, [ saveLibraryRacksListResp, editLibraryRacksRequestResp, delLibraryRacksRequestResp, libraryDetailsErrorAct]);

  useEffect(() => {
    if (deleteLibraryRackPromptListResp && delLibraryRacksModalState.id) {
      const rawMsg = deleteLibraryRackPromptListResp;
  
      const prefixMatch = rawMsg.match(/^(Rack\s+".*?"\s+has\s+\d+\s+book\(s\))/i);
      const idsMatch = rawMsg.match(/\(\s*([\d,\s]+)\s*\)/);
  
      if (prefixMatch && idsMatch) {
        const prefixText = prefixMatch[1];
        const bookIds = idsMatch[1]
          .split(",")
          .map((id: any) => id.trim())
          .filter(Boolean);
        const limitedIds = bookIds.slice(0, 5).join(", ");
        setDelLibraryRacksModalState((prev) => ({
          ...prev,
          confirmMessage: `${prefixText} (${limitedIds}, ...) Would you like to detach them?`,
          fullBookIds: bookIds,
          prefixText: prefixText,
          isExpanded: false,
          showModal: true,
          shouldShowModal: true,
        }));
      } else {
        setDelLibraryRacksModalState((prev) => ({
          ...prev,
          confirmMessage: rawMsg,
          fullBookIds: [],
          prefixText: "",
          isExpanded: false,
          showModal: true,
          shouldShowModal: true,
        }));
      }
    }
  }, [deleteLibraryRackPromptListResp, delLibraryRacksModalState.id, delLibraryRacksModalState.shouldShowModal]);
  
  const renderConfirmMessage = () => {
    const msg = delLibraryRacksModalState.confirmMessage;
  
    if (typeof msg === "string" && msg.includes("...")) {
      const [beforeDots, afterDots] = msg.split("...");
      return (
        <span>
          {beforeDots}
          <span
            style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
            onClick={toggleBookIdExpand}
          >
            ...
          </span>
          {afterDots}
        </span>
      );
    }
  
    return <span>{msg}</span>;
  };

  function toggleBookIdExpand() {
  setDelLibraryRacksModalState((prev) => {
    if (prev.isExpanded) {
      const shortList = prev.fullBookIds.slice(0, 5).join(", ");
      return {
        ...prev,
        isExpanded: false,
        confirmMessage: `${prev.prefixText} (${shortList}, ...) Would you like to detach them?`,
      };
    } else {
      return {
        ...prev,
        isExpanded: true,
        confirmMessage: `${prev.prefixText} (${prev.fullBookIds.join(", ")}) Would you like to detach them?`,
      };
    }
  });
}

const menuOptions = useMemo(
  () => [
    {
      id: "edit",
      actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-grey-400" size={20} />,
      actionName: "Edit",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id");
        dispatch(getLibraryRacksListByIdAct(generateActionPayload("get_library_racks_list_by_id", { id: id })));
        toggleLibraryRacksModel(id)
      },
    },
    {
      id: "delete",
      actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-600" size={18} />,
      actionName: "Delete",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id");
        toggleDelLibraryRacksModal(id)
      },
    },
  ],
  []
);


  useEffect(() => {

    libraryRackList();
    libraryNameList();
    libraryRoomsList();
    return () => {

    }
}, [branchId,instituteId,]);

const filterHandler = (event:any)=>{
  const { name , value } = event.target;
  pagination.current.pageNo = 0;
  libraryRackList({ [name]: value });

  if (name === 'libraryId') {
    setLibraryRacks((prev: any) => ({ ...prev, [name]: value, roomId: "" }));
    const payload = { branchId: branchId, libraryId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
    libraryRackList({ [name]: value });
    
    if (!value) {
      dispatch(resetLibraryListAct(undefined));
      dispatch(resetLibraryRoomAct(undefined));
    } else {
      dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
    }
  } else if (name === 'roomId') {
    setLibraryRacks((prev: any) => ({ ...prev, [name]: value }));
    const payload = { branchId: branchId, libraryId: LibraryRacks.libraryId, roomId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
    libraryRackList({ [name]: value });

    if (!value) {
      dispatch(resetLibraryRoomAct(undefined));
      dispatch(resetLibraryShelfAct(undefined));
    }
    else {
      dispatch(getLibraryshelf(generateActionPayload("get_library_shelf", undefined, payload)));
    }
  } else if (name === 'shelfId') {
    setLibraryRacks((prev: any) => ({ ...prev, [name]: value, rackId: "", }));
    const shelfPayload = { branchId: branchId, shelfId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
    libraryRackList({ [name]: value });

    if (!value) {
      dispatch(resetLibraryShelfAct(undefined));
    } else {
      dispatch(getLibraryrack(generateActionPayload("get_library_rack", undefined, shelfPayload)));
    }
  }
  else {
    setLibraryRacks((prev: any) => ({ ...prev, [name]: value }));
    libraryRackList({ [name]: value });
  }

  const stateChanged = hasStateChanged({ ...initialValues, [name]: value });
  setShowClearFilterState(stateChanged?.stateChange);
}
const clearFilterHndlr = () => {
  pagination.current = { ...pagination.current, pageNo: 0 };
  dispatch(resetLibraryListAct(undefined));
  setLibraryRacks({ ...initialValues });
  libraryRackList({ ...initialValues });
  setShowClearFilterState(false);
};
function paginationHndlr(paginationInfo: IPaginationState) {
  pagination.current = paginationInfo;
  libraryRackList(paginationInfo)
  }

  const columns = useMemo(() => generateColumns(menuOptions), [libraryRackRequestListResp]);
  const { content: libraryRack, totalElements, totalPages, pageable } = libraryRackRequestListResp || {}
  const { content: libraryDetailsResp } = libraryDetailsRequestListResp || {};
  const { content: libraryRoomNameResp } = libraryRoomsRequestListResp || {};
  const { data: libraryShelfNameResp } = libraryShelfRequestListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded-md tw-shadow">
            <div className="tw-border-b tw-border-slate-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Library Racks
                </h4>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={LibraryRacksForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-4 tw-items-end">
                  <div className="tw-col-span-12 lg:tw-col-span-3">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={LibraryRacksForm.values.searchString}
                        onChange={filterHandler}
                        floatingLabel
                        labelText="Search"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-2">
                    <SelectInput
                      name="libraryId"
                      value={LibraryRacksForm.values.libraryId}
                      onChange={filterHandler}
                      menuItems={libraryDetailsResp}
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
                      value={LibraryRacksForm.values.roomId}
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
                      value={LibraryRacksForm.values.shelfId}
                      onChange={filterHandler}
                      menuItems={libraryShelfNameResp}
                      valueKey="id"
                      textKey="shelfName"
                      formgroupClassName="tw-mb-0"
                      labelText="Shelf Name"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-1 tw-flex tw-justify-end">
                    {showClearFilterState && (
                      <Button type="button" variant="wrong" onClick={clearFilterHndlr}>
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-2 tw-flex tw-justify-end">
                    <Button type="button" variant="primary" onClick={() => toggleLibraryRacksModel()}>
                      Add New
                    </Button>
                  </div>
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={libraryRack || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-slate-100 tw-text-slate-500 tw-align-middle"
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
        id="library-racks"
        isOpen={LibraryRacksModelState.showModal}
        toggle={() => toggleLibraryRacksModel()}
        modalTitle={LibraryRacksModelState.id ? "Edit Library Racks" : "Add Library Racks"}
        modalSize="md"
      >
        <LibraryRacksModel
          id={LibraryRacksModelState.id}
          toggle={() => toggleLibraryRacksModel()}
          modalTitle="Create Library Details"
          isOpen={false}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-library-racks-modal"
        isOpen={delLibraryRacksModalState.showModal}
        confirmMessage={renderConfirmMessage()}
        cancelHndlr={() => toggleDelLibraryRacksModal()}
        confirmHndlr={delLibraryRacksConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default LibraryRacks;
