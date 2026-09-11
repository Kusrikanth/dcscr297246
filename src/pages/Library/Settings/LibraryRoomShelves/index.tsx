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
import { shallowEqual, useDispatch } from "react-redux";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { deleteLibraryRackPromptAct, deleteLibraryShelfsListAct, getLibraryDetailsListAct, getLibraryRooms, getLibraryshelf, getLibraryShelfsListByIdAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";
import { resetLibraryListAct, resetLibraryRoomAct } from "../../../../store/library/settings/librarysettingsslice";
import LibraryRoomShelvesModel from "./LibraryRoomShelvesModel";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  libraryId: "",
  roomId: "",
};

const LibraryShelf = () => {
  const history = useHistory()
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [LibraryShelfModelState, setLibraryShelfModelState] =
    useState({
      showModal: false,
      id: undefined
    });
  const [LibraryShelf, setLibraryShelf] = useState(initialValues);
  const dispatch = useDispatch();
  const LibraryShelfForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryShelf,
    onSubmit: (values) => { },
  });
  
const [delLibraryShelfsModalState, setDelLibraryShelfsModalState] = useState({
  showModal: false,
  id: "",
  confirmMessage: "",
  fullMessage: "",
  previewLine: "",
  isExpanded: false,
});


  const pagination: any = useRef<any>({
    pageNo: 0,
    pageSize: 10
})

const toggleLibraryShelfsModel = (id?: any) => {
  setLibraryShelfModelState((prevState: any) => ({
    ...prevState,
    showModal: !prevState.showModal,
    id: id || "",
  }));
};

  const toggleDelLibraryShelfsModal = (id?: any) => {
    if (!id) {
      setDelLibraryShelfsModalState((prevState) => ({
        ...prevState,
        showModal: false,
        id: "",
        confirmMessage: "",
      }));
      return;
    }
    const payload = {
      branchId,
      shelfId: id,
    };
    dispatch(
      deleteLibraryRackPromptAct(
        generateActionPayload("delete_library_rack_prompt", undefined, payload)
      )
    );
    setDelLibraryShelfsModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
      confirmMessage: "Loading...",
    }));
  }
const delLibraryShelfsConfirmHndler = () => {
  dispatch(deleteLibraryShelfsListAct(generateActionPayload("delete_Library_shelfs_list", { id: delLibraryShelfsModalState.id },)));
}

const libraryShelfList = (otherProps?: any) => {
  const { searchString, libraryId, roomId } = LibraryShelf;
  let payload = {
    branchId,
    libraryId,
    roomId,
    searchString,
    ...pagination.current,
    ...otherProps,
  };
dispatch(getLibraryshelf(generateActionPayload("get_library_shelf", undefined, payload)))
};
const libraryNameList = ( otherProps?: any) => {
  const { libraryId } = LibraryShelf;
  const payload = {
    branchId,
    libraryId: libraryId ,
    pageSize: 100,
  };
  dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
};
const libraryRoomsList = (otherProps?: any) => {
  const { libraryId } = LibraryShelf;
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
libraryShelfRequestListResp,
libraryDetailsErrorAct,
libraryDetailsRequestListResp,
libraryRoomsRequestListResp,
saveLibraryShelfsListResp,
editLibraryShelfsRequestResp,
deleteLibraryRackPromptListResp,
delLibraryShelfsRequestResp,
} = useAppSelector(
({ librarysettings, appData, globalData, }) => ({
  
  currentBranchIdResp: appData.currentBranchIdResp,
  showApiLoader: globalData.showApiLoader,
    currentInstIdResp: appData.currentInstIdResp,
    libraryShelfRequestListResp: librarysettings.libraryShelfRequestListResp,
    libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
    libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
    saveLibraryShelfsListResp: librarysettings.saveLibraryShelfsListResp,
      editLibraryShelfsRequestResp: librarysettings.editLibraryShelfsRequestResp,
      delLibraryShelfsRequestResp: librarysettings.delLibraryShelfsRequestResp,
      deleteLibraryRackPromptListResp: librarysettings.deleteLibraryRackPromptListResp,
      libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
  }),
shallowEqual
);
const libraryShelvesRef = useRef({
  prevAddLibraryShelfs: saveLibraryShelfsListResp,
    prevEditLibraryShelfs: editLibraryShelfsRequestResp,
    prevDeleteLibraryShelfsRequestListResp: delLibraryShelfsRequestResp,
prevLibraryShelfErrorResp: libraryDetailsErrorAct,
})
useEffect(() => {
  const {
    prevAddLibraryShelfs,
    prevEditLibraryShelfs,
    prevDeleteLibraryShelfsRequestListResp,
    prevLibraryShelfErrorResp,
  } = libraryShelvesRef.current;
  if (saveLibraryShelfsListResp && prevAddLibraryShelfs !== saveLibraryShelfsListResp) {
    toast.success("Library Shelfs added successfully.");
    toggleLibraryShelfsModel();
    libraryShelfList();
  } else if (editLibraryShelfsRequestResp && prevEditLibraryShelfs !== editLibraryShelfsRequestResp) {
    toast.success("Library Shelfs updated successfully.");
    toggleLibraryShelfsModel();
    libraryShelfList();
  } else if (delLibraryShelfsRequestResp && prevDeleteLibraryShelfsRequestListResp !== delLibraryShelfsRequestResp) {
    toast.success("Library Shelfs deleted successfully.");
    toggleDelLibraryShelfsModal();
    libraryShelfList();
  } else if (libraryDetailsErrorAct && prevLibraryShelfErrorResp !== libraryDetailsErrorAct) {
    const { details } = libraryDetailsErrorAct;
    toast.error(details);
  }
  libraryShelvesRef.current.prevDeleteLibraryShelfsRequestListResp = delLibraryShelfsRequestResp;
  libraryShelvesRef.current.prevEditLibraryShelfs = editLibraryShelfsRequestResp;
  libraryShelvesRef.current.prevAddLibraryShelfs = saveLibraryShelfsListResp;
  libraryShelvesRef.current.prevLibraryShelfErrorResp = libraryDetailsErrorAct;
}, [saveLibraryShelfsListResp, editLibraryShelfsRequestResp, delLibraryShelfsRequestResp, libraryDetailsErrorAct]);

  useEffect(() => {
    if (deleteLibraryRackPromptListResp && delLibraryShelfsModalState.id) {
      const fullMessage = deleteLibraryRackPromptListResp.trim();
      const lines = fullMessage.split("\n").filter(Boolean);

      const firstLine = lines[0];
      const match = firstLine.match(/^(.*?has\s+\d+\s+book\(s\))\s+\(([\d,\s]+)\)/i);

      let previewLine = firstLine;
      if (match) {
        const prefix = match[1];
        const bookIds = match[2].split(",").map((id) => id.trim());
        const previewBookIds = bookIds.slice(0, 4).join(", ");
        previewLine = `${prefix} (${previewBookIds}, ...)`;
      }

      setDelLibraryShelfsModalState((prev) => ({
        ...prev,
        fullMessage,
        previewLine,
        confirmMessage: "",
        isExpanded: false,
      }));
    }
  }, [deleteLibraryRackPromptListResp]);

  const toggleShelfBookIdExpand = () => {
    setDelLibraryShelfsModalState((prev) => ({
      ...prev,
      isExpanded: true,
    }));
  };

  const renderShelfConfirmMessage = () => {
    const { isExpanded, previewLine, fullMessage } = delLibraryShelfsModalState;
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
        dispatch(getLibraryShelfsListByIdAct(generateActionPayload("get_library_shelfs_list_by_id", { id: id })));
        toggleLibraryShelfsModel(id)
      },
    },
    {
      id: "delete",
      actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-600" size={18} />,
      actionName: "Delete",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id");
        toggleDelLibraryShelfsModal(id)
      },
    },
  ],
  []
  );

useEffect(() => {
  libraryShelfList();
  libraryNameList();
  libraryRoomsList();
  return () => {

  }
}, [branchId,instituteId,]);

// useEffect(() => {
//   if (LibraryShelf.libraryId) {
//     libraryRoomsList();
//   } else {
//     setLibraryShelf((prev) => ({ ...prev, roomId: "" }));
//     dispatch(resetLibraryRoomAct(undefined));
//   }
// }, [LibraryShelf.libraryId]);

const filterHandler = (event: any) => {
  const { name, value } = event.target;
  pagination.current.pageNo = 0;

  if (name === 'libraryId') {
    setLibraryShelf((prev: any) => ({ ...prev, [name]: value, roomId: "" }));
    const payload = { branchId: branchId, libraryId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
    libraryShelfList({ [name]: value });
    
    if (!value) {
      dispatch(resetLibraryListAct(undefined));
      dispatch(resetLibraryRoomAct(undefined));
    } else {
      dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
    }
  } else if (name === 'roomId') {
    setLibraryShelf((prev: any) => ({ ...prev, [name]: value }));
    const payload = { branchId: branchId, libraryId: LibraryShelf.libraryId, roomId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
    libraryShelfList({ [name]: value });

    if (!value) {
      dispatch(resetLibraryRoomAct(undefined));
    }
  } else {
    setLibraryShelf((prev: any) => ({ ...prev, [name]: value }));
    libraryShelfList({ [name]: value });
  }

  const stateChanged = hasStateChanged({ ...initialValues, [name]: value });
  setShowClearFilterState(stateChanged?.stateChange);
};


// const filterHandler = (event: any) => {
//   const { name, value } = event.target;
//   pagination.current.pageNo = 0;
//  if (name === "libraryId") {
//     if (!value) {
//       setLibraryShelf((prev) => ({ ...prev, roomId: "" }));
//       dispatch(resetLibraryListAct(undefined));
//       dispatch(resetLibraryRoomAct(undefined));
//     } else {
//       libraryNameList();
//       libraryRoomsList();
//     }
//   } else if (name === "roomId") {
//     libraryRoomsList({ roomId: value });
//     dispatch(resetLibraryRoomAct(undefined));
//   }
//   libraryShelfList({ [name]: value });
//   const stateChanged = hasStateChanged({ ...initialValues, [name]: value }, LibraryShelf);
//   setShowClearFilterState(stateChanged?.stateChange);
// };
const clearFilterHndlr = () => {
  setLibraryShelf(initialValues);
  pagination.current.pageNo = 0;
  libraryShelfList({ libraryId: "", roomId: "", searchString: "" });
  setShowClearFilterState(false);
};

function paginationHndlr(paginationInfo: IPaginationState) {
  pagination.current = paginationInfo;
  libraryShelfList(paginationInfo)
  }
const columns = useMemo(() => generateColumns(menuOptions), []);
const { data: libraryShelf, totalElements, totalPages, pageable } = libraryShelfRequestListResp || {}
const { content: libraryDetailsResp } = libraryDetailsRequestListResp || {};
const { content: libraryRoomNameResp } = libraryRoomsRequestListResp || {};


  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-flex-1">
                  Library Room Shelves
                </h4>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={LibraryShelfForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-4 tw-items-end tw-mb-4">
                  <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={LibraryShelfForm.values.searchString}
                        onChange={filterHandler}
                        floatingLabel
                        labelText="Search"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="libraryId"
                      value={LibraryShelfForm.values.libraryId}
                      onChange={filterHandler}
                      menuItems={libraryDetailsResp}
                      valueKey="id"
                      textKey="libraryName"
                      formgroupClassName="tw-mb-0"
                      labelText="Library Name"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="roomId"
                      value={LibraryShelfForm.values.roomId}
                      onChange={filterHandler}
                      menuItems={libraryRoomNameResp}
                      valueKey="id"
                      textKey="roomName"
                      formgroupClassName="tw-mb-0"
                      labelText="Room Name"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-2 tw-flex tw-justify-end">
                    {showClearFilterState && (
                      <Button type="button" variant="wrong"  onClick={clearFilterHndlr}>Clear</Button>
                    )}
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-2 tw-flex tw-justify-end">
                    <Button
                    type="button"
                      variant="primary"
                      onClick={() => toggleLibraryShelfsModel()}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add New
                    </Button>
                  </div>
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={libraryShelf || []}
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
        id="detensions-or-promotions"
        isOpen={LibraryShelfModelState.showModal}
        toggle={() => toggleLibraryShelfsModel()}
        modalTitle={LibraryShelfModelState.id ? "Edit Library Shelves" : "Add Library Shelves"}
        modalSize="md"
      >
        <LibraryRoomShelvesModel
          id={LibraryShelfModelState.id}
          modalTitle="Create Library Rooms"
          isOpen={false}
          editBranchDetails={""}
          toggle={() => toggleLibraryShelfsModel()}        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-library-shelfs-modal"
        isOpen={delLibraryShelfsModalState.showModal}
        confirmMessage={renderShelfConfirmMessage()}
        cancelHndlr={() => toggleDelLibraryShelfsModal()}
        confirmHndlr={delLibraryShelfsConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default LibraryShelf;
