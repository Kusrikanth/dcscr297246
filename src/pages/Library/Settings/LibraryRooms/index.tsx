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
import LibraryRoomsModel from "./LibraryRoomsModel";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { deleteLibraryRackPromptAct, deleteLibraryRoomsListAct, getLibraryDetailsListAct, getLibraryRooms, getLibraryRoomsListByIdAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";
import { shallowEqual, useDispatch } from "react-redux";
import { resetLibraryListAct, setLibraryRoomsListAct } from "../../../../store/library/settings/librarysettingsslice";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  libraryId: "",
};

const LibraryRooms = () => {
  const history = useHistory();
  const [LibraryRoomsModelState, setLibraryRoomsModelState] =
    useState({
      showModal: false,
      id: undefined
    });
  const [LibraryRooms, setLibraryRooms] = useState(initialValues);
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const dispatch = useDispatch();
  const LibraryRoomsForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryRooms,
    onSubmit: (values) => {},
  });

  const [delLibraryRoomsModalState, setDelLibraryRoomsModalState] = useState({
    showModal: false,
    id: "",
    confirmMessage: "",
    isExpanded: false,
    previewLine: "",
    fullMessage: "",
  });

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  });

  const toggleAddLibraryRoomsModel = (id?: any) => {
    setLibraryRoomsModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }))
  }

  const toggleLibraryRoomsModel = (id?: any) => {
    if (!id) {
      setDelLibraryRoomsModalState((prevState) => ({
        ...prevState,
        showModal:!prevState.showModal,
        id: "",
        confirmMessage: "",
      }));
      return;
    }
    const payload = {
      branchId,
      roomId: id,
    };
    dispatch(
      deleteLibraryRackPromptAct(
        generateActionPayload("delete_library_rack_prompt", undefined, payload)
      )
    );
    setDelLibraryRoomsModalState((prevState) => ({
      ...prevState,
      showModal: true,
      id,
      confirmMessage: "Loading...",
    }));
  };

  const delLibraryRoomsConfirmHndler = () => {
    dispatch(deleteLibraryRoomsListAct(generateActionPayload("delete_Library_rooms_list", { id: delLibraryRoomsModalState.id },)));
  }

  const libraryRoomsList = (otherProps?: any) => {
    const { searchString, libraryId } = LibraryRooms;
    const payload = {
      branchId,
      libraryId: libraryId ,
      searchString,
      ...otherProps,
    };
    
    dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
  };

  const libraryNameList = ( otherProps?: any) => {
    const { libraryId } = LibraryRooms;
    const payload = {
      branchId,
      libraryId: libraryId ,
      pageSize: 100,
    };
    dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
  };

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryRoomsRequestListResp,
    libraryDetailsErrorAct,
    libraryDetailsRequestListResp,
    saveLibraryRoomsListResp,
    editLibraryRoomsRequestResp,
    deleteLibraryRackPromptListResp,
    delLibraryRoomsRequestResp,
  } = useAppSelector(
    ({ librarysettings, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
      saveLibraryRoomsListResp: librarysettings.saveLibraryRoomsListResp,
      editLibraryRoomsRequestResp: librarysettings.editLibraryRoomsRequestResp,
      delLibraryRoomsRequestResp: librarysettings.delLibraryRoomsRequestResp,
      deleteLibraryRackPromptListResp: librarysettings.deleteLibraryRackPromptListResp,
      libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
    }),
    shallowEqual
  );
  const libraryRoomsRef = useRef({
    prevAddLibraryRooms: saveLibraryRoomsListResp,
    prevEditLibraryRooms: editLibraryRoomsRequestResp,
    prevDeleteLibraryRoomsRequestListResp: delLibraryRoomsRequestResp,
    prevLibraryRoomsErrorResp: libraryDetailsErrorAct,
  });

  useEffect(() => {
    const { prevAddLibraryRooms, prevEditLibraryRooms, prevDeleteLibraryRoomsRequestListResp, prevLibraryRoomsErrorResp } = libraryRoomsRef.current;
    if (saveLibraryRoomsListResp && prevAddLibraryRooms !== saveLibraryRoomsListResp) {
      toast.success("Library Rooms added successfully.");
      toggleAddLibraryRoomsModel()
      libraryRoomsList()
    }
    else if (editLibraryRoomsRequestResp && prevEditLibraryRooms !== editLibraryRoomsRequestResp) {
      toast.success("Library Rooms updated successfully.");
      toggleAddLibraryRoomsModel()
      libraryRoomsList()
    }
    else if (delLibraryRoomsRequestResp && prevDeleteLibraryRoomsRequestListResp !== delLibraryRoomsRequestResp) {
      toast.success("Library Rooms deleted successfully.");
      toggleLibraryRoomsModel()
      libraryRoomsList()
    }
    else if (libraryDetailsErrorAct && prevLibraryRoomsErrorResp !== libraryDetailsErrorAct) {
      const { details } = libraryDetailsErrorAct;
      toast.error(details);
    }
    libraryRoomsRef.current.prevDeleteLibraryRoomsRequestListResp = delLibraryRoomsRequestResp;
    libraryRoomsRef.current.prevEditLibraryRooms = editLibraryRoomsRequestResp;
    libraryRoomsRef.current.prevAddLibraryRooms = saveLibraryRoomsListResp;
    libraryRoomsRef.current.prevLibraryRoomsErrorResp = libraryDetailsErrorAct;
  }, [ saveLibraryRoomsListResp, editLibraryRoomsRequestResp, delLibraryRoomsRequestResp, libraryDetailsErrorAct]);

  useEffect(() => {
    if (deleteLibraryRackPromptListResp) {
      const fullMessage = deleteLibraryRackPromptListResp.trim();
      const lines = fullMessage.split("\n").filter(Boolean);
      const firstLine = lines[0];
      const match = firstLine.match(/^(.*?has\s+\d+\s+book\(s\))\s+\(([\d,\s]+)\)/i);
      let previewLine = firstLine;
      if (match) {
        const prefix = match[1];
        const bookIds = match[2].split(",").map((id: any) => id.trim());
        const previewBookIds = bookIds.slice(0, 4).join(", ");
        previewLine = `${prefix} (${previewBookIds}, ...)`;
      }
      setDelLibraryRoomsModalState((prev) => ({
        ...prev,
        fullMessage,
        previewLine,
        isExpanded: false,
      }));
    }
  }, [deleteLibraryRackPromptListResp]);

  const toggleShelfBookIdExpand = () => {
    setDelLibraryRoomsModalState((prev) => ({
      ...prev,
      isExpanded: true,
    }));
  };

  const renderConfirmMessage = () => {
    const { isExpanded, previewLine, fullMessage } = delLibraryRoomsModalState;
    if (isExpanded) {
      const lines = fullMessage.split("\n").filter((line) => line.trim() !== "");
      const listLines = lines.slice(0, -1);
      const shouldShowDetachText = !fullMessage.includes("No active books found.");
      return (
        <div>
          <ul
            style={{
              paddingLeft: "20px",
              listStyleType: "disc",
              textAlign: "left",
            }}
          >
            {listLines.map((line, idx) => (
              <li key={idx} className="py-1">
                {line}
              </li>
            ))}
          </ul>
          {shouldShowDetachText && (
            <div style={{ textAlign: "center" }}>
              <span style={{ color: "red" }}>*</span> Would you like to detach them?{" "}
              <span style={{ color: "red" }}>*</span>
            </div>
          )}
        </div>
      );
    }
    return (
      <div>
        <div>
          {previewLine}
          {!previewLine.includes("No active books found.") && (
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={toggleShelfBookIdExpand}
            >
              ...
            </span>
          )}
        </div>
      </div>
    );
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-grey-400" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getLibraryRoomsListByIdAct(generateActionPayload("get_library_rooms_list_by_id", { id: id })));
          toggleAddLibraryRoomsModel(id)
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-600" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleLibraryRoomsModel(id);
        },
      },
    ],
    []
  );


  useEffect(() => {
    libraryNameList();
    libraryRoomsList();
    return () => {};
  }, [branchId,instituteId,]);

  const filterHandler = (event:any)=>{
    const { name , value } = event.target;
    pagination.current.pageNo = 0;
    setLibraryRooms((prev:any)=>({...prev,[name] : value }));
    libraryRoomsList({ [name]: value });
  
    const stateChanged = hasStateChanged({ ...initialValues, [name]: value });
    setShowClearFilterState(stateChanged?.stateChange);
  }


  function filterDropDownHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name , value } = event.target;
    pagination.current.pageNo = 0;
    setLibraryRooms((prev:any)=>({...prev,[name] : value }));
    libraryRoomsList({ [name]: value });
  
    const stateChanged = hasStateChanged({ ...initialValues, [name]: value });
    setShowClearFilterState(stateChanged?.stateChange);

  }
  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    dispatch(resetLibraryListAct(undefined));
    setLibraryRooms({ ...initialValues });
    libraryRoomsList({ ...initialValues });
    setShowClearFilterState(false);
  };
  
  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryRoomsList(paginationInfo)
  }

  const columns = useMemo(() => generateColumns(menuOptions), [libraryRoomsRequestListResp]);
  const { content: libraryRooms, totalElements, totalPages, pageable } = libraryRoomsRequestListResp || {};
  const { content: libraryDetailsResp } = libraryDetailsRequestListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded-md tw-shadow">
            <div className="tw-border-b tw-border-slate-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Library Rooms
                  </h4>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={LibraryRoomsForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-py-4 tw-mt-1">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={LibraryRoomsForm.values.searchString}
                        onChange={filterHandler}
                        floatingLabel
                        labelText="Search"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-3">
                    <SelectInput
                      name="libraryId"
                      value={LibraryRoomsForm.values.libraryId}
                      onChange={filterDropDownHandler}
                      menuItems={libraryDetailsResp}
                      valueKey="id"
                      textKey="libraryName"
                      formgroupClassName="tw-mb-0"
                      labelText="Library Name"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-2 tw-flex tw-justify-end">
                    {showClearFilterState && (
                      <Button type="button" variant="wrong"  onClick={clearFilterHndlr}>Clear</Button>
                    )}
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-1 tw-flex tw-justify-end">
                  </div>
                   <div className="tw-col-span-12 lg:tw-col-span-2 tw-flex tw-justify-end">
                    <Button type="button" variant="primary"  onClick={() => toggleAddLibraryRoomsModel()}>Add New</Button>
                  </div>
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={libraryRooms || []}
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
        id="library-rooms"
        isOpen={LibraryRoomsModelState.showModal}
        toggle={() => toggleAddLibraryRoomsModel()}
        modalTitle={LibraryRoomsModelState.id ? "Edit Library Rooms" : "Add Library Rooms"}
        modalSize="md"
      >
        <LibraryRoomsModel
          id={LibraryRoomsModelState.id}
          toggle={() => toggleAddLibraryRoomsModel()}
          modalTitle="Create Library Rooms"
          isOpen={false}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-library-Rooms-modal"
        isOpen={delLibraryRoomsModalState.showModal}
        confirmMessage={renderConfirmMessage()}
        cancelHndlr={() => toggleLibraryRoomsModel()}
        confirmHndlr={delLibraryRoomsConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default LibraryRooms;
