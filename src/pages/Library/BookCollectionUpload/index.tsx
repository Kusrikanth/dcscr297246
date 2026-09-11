
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, DropDownToggle, ModalContainerUpdated, OffCanvasContainer, SearchInput, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  bookColletionSearchInputOptions,
  generateColumns,
  ignoredKeys,
} from "./helper";
import BookCollectionUploadModel from "./BookCollectionUploadModel";
import { shallowEqual } from "react-redux"; import { generateActionPayload } from "../../../utility/reduxutility";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { getLibraryCategoryListAct, getLibraryDetailsListAct, getLibraryLanguageListAct, getLibraryRecordListAct, getLibraryRooms, getLibraryrack, getLibraryshelf } from "../../../store/library/settings/librarysettingsaction";
import { resetLibraryRoomAct, resetRackAct, resetShelfAct } from "../../../store/library/settings/librarysettingsslice";
import { deleteLibraryBookCollectionAct, exportLibraryBookCollectionAct, getLibraryBookCollectionByIdAct, getLibraryBookCollectionListAct } from "../../../store/library/bookcollection/bookcollectionaction";
import { resetLibraryListAct } from "../../../store/library/bookissuance/bookissuanceslice";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvancFilterModal";
import classnames from "classnames"
import UploadExcelModal from "./UploadExcelModal";
import { downloadExcelFile, removeLeadingZeros } from "../../../utility/commonutility";
import { useModal } from "../../../hooks/modalhook";
import { useFilterState } from "../../../hooks/filterhook";
import LibraryCarousel from "./LibraryCarousel";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { Add01Icon, BookUploadIcon, Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import Button from "../../../Components/Common/Button";


const initialValues = {
  searchString: "",
  roomId: "",
  curriculumId: "",
  rackId: "",
  shelfId: "",
  bookCondition: "",
  issueStatus: "",
  libraryId: "",
  category: ""
};

const BookCollectionUpload = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [searchType, setSearchType] = useState("global");

  const [bookCollectUploadFilterState, setBookCollectUploadFilterState] = useState(initialValues);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()

  const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
  const { closeModal: closeDelBookCollectionModal, modalState: deleteBookCollectionState, openModal: openDelBookCollectionModal } = useModal();
  const { closeModal: closebulkUploadModal, modalState: bulkUploadState, openModal: openbulkUploadModal } = useModal();
  const { closeModal: closeBookCollectionUploadModal, modalState: bookCollectionUploadState, openModal: openBookCollectionUploadModal } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const sanitizeId = (id: any) => (id === "NOT_AUTH" ? 0 : id);
  const libraryBookCollectionList = (otherProps?: any) => {
    const { libraryId, roomId, shelfId, ...restState } = bookCollectUploadFilterState;

    const payload = {
      branchId,
      libraryId: sanitizeId(libraryId),
      roomId: sanitizeId(roomId),
      shelfId: sanitizeId(shelfId),
      searchFilterType: searchType,
      ...restState,
      ...pagination.current,
      ...otherProps,
    };

    dispatch(getLibraryBookCollectionListAct(generateActionPayload("get_library_book_collection", undefined, payload)));
  };

  const libraryRoomsList = (libraryId?: string) => {
    if (libraryId) {
      const payload = { branchId: branchId, libraryId, orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
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

  const libraryRecordList = () => {
    dispatch(getLibraryRecordListAct(generateActionPayload("get_library_record", undefined, {
      pageNo: 0, pageSize: 100
    })));
  };

  const libraryLanguageList = () => {
    dispatch(getLibraryLanguageListAct(generateActionPayload("get_library_language", undefined, {
      pageNo: 0, pageSize: 100
    })));
  };

  const libraryCategoryList = () => {
    dispatch(getLibraryCategoryListAct(generateActionPayload("get_library_category", undefined, {
      pageNo: 0, pageSize: 500
    })));
  };
  const libraryRactList = (otherProps?: any) => {
    const { libraryId, roomId, shelfId } = bookCollectUploadFilterState;
    const payload: any = {
      branchId,
      ...pagination.current,
      libraryId, roomId: roomId === "NOT_AUTH" ? 0 : roomId, shelfId: shelfId === "NOT_AUTH" ? 0 : shelfId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    dispatch(getLibraryrack(generateActionPayload("get_library_rack", undefined, payload)));
  };

  const {
    brchCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryBookCollectionErrorAct,
    libraryBookCollectionRequestListResp,
    libraryRoomsRequestListResp,
    libraryShelfRequestListResp,
    exportLibraryBookCollectionResp,
    bulkUploadLibraryBookCollectionResp,
    downloadStaticLibraryBookCollectionResp,
    libraryRackRequestListResp,
    libraryDetailsRequestListResp,
    saveLibraryBookCollectionResp,
    editLibraryBookCollectionRequestResp,
    deleteLibraryBookCollectionResp,
  } = useAppSelector(
    ({ branchAcademics, librarysettings, libraryBookCollection, appData, globalData, }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryBookCollectionErrorAct: libraryBookCollection.libraryBookCollectionErrorAct,
      libraryBookCollectionRequestListResp: libraryBookCollection.libraryBookCollectionRequestListResp,
      saveLibraryBookCollectionResp: libraryBookCollection.saveLibraryBookCollectionResp,
      editLibraryBookCollectionRequestResp: libraryBookCollection.editLibraryBookCollectionRequestResp,
      deleteLibraryBookCollectionResp: libraryBookCollection.deleteLibraryBookCollectionResp,
      exportLibraryBookCollectionResp: libraryBookCollection.exportLibraryBookCollectionResp,
      bulkUploadLibraryBookCollectionResp: libraryBookCollection.bulkUploadLibraryBookCollectionResp,
      downloadStaticLibraryBookCollectionResp: libraryBookCollection.downloadStaticLibraryBookCollectionResp,
      libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
      libraryShelfRequestListResp: librarysettings.libraryShelfRequestListResp,
      libraryRackRequestListResp: librarysettings.libraryRackRequestListResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
    }),
    shallowEqual
  );

  const libraryShelvesRef = useRef({
    prevSaveLibraryBookCollectionResp: saveLibraryBookCollectionResp,
    prevEditLibraryBookCollectionRequestResp: editLibraryBookCollectionRequestResp,
    prevDeleteLibraryBookCollectionResp: deleteLibraryBookCollectionResp,
    prevExportLibraryBookCollectionResp: exportLibraryBookCollectionResp,
    prevBulkUploadLibraryBookCollectionResp: bulkUploadLibraryBookCollectionResp,
    prevDownloadStaticLibraryBookCollectionResp: downloadStaticLibraryBookCollectionResp,
    prevLibraryBookCollectionErrorResp: libraryBookCollectionErrorAct,
  })
  useEffect(() => {

    const { prevSaveLibraryBookCollectionResp, prevEditLibraryBookCollectionRequestResp, prevDeleteLibraryBookCollectionResp, prevExportLibraryBookCollectionResp, prevBulkUploadLibraryBookCollectionResp, prevDownloadStaticLibraryBookCollectionResp, prevLibraryBookCollectionErrorResp, } = libraryShelvesRef.current;
    if (saveLibraryBookCollectionResp && prevSaveLibraryBookCollectionResp !== saveLibraryBookCollectionResp) {
      toast.success("Book Collection added successfully.");
      closeBookCollectionUploadModal()
      libraryBookCollectionList()
    }
    else if (editLibraryBookCollectionRequestResp && prevEditLibraryBookCollectionRequestResp !== editLibraryBookCollectionRequestResp) {
      toast.success("Book Collection Updated Successfully")
      closeBookCollectionUploadModal()
      libraryBookCollectionList()
    }
    else if (deleteLibraryBookCollectionResp && prevDeleteLibraryBookCollectionResp !== deleteLibraryBookCollectionResp) {
      toast.success("Book Collection Deleted Successfully")
      closeDelBookCollectionModal()
      libraryBookCollectionList()
    }
    else if (exportLibraryBookCollectionResp && prevExportLibraryBookCollectionResp !== exportLibraryBookCollectionResp) {
      toast.success("Book Collection Data Download Successfully.");
      closeExportExcelModal();
      downloadExcelFile(exportLibraryBookCollectionResp, 'Book_Collection_Upload.xlsx')
    }
    else if (bulkUploadLibraryBookCollectionResp && bulkUploadLibraryBookCollectionResp !== prevBulkUploadLibraryBookCollectionResp) {
      toast.success("Bulk Book Collection Added Successfully.");
      closebulkUploadModal();
      libraryBookCollectionList()
    } else if (downloadStaticLibraryBookCollectionResp && downloadStaticLibraryBookCollectionResp !== prevDownloadStaticLibraryBookCollectionResp) {
      const { systemFile } = downloadStaticLibraryBookCollectionResp,
        { s3URL } = systemFile || {};
      if (s3URL) {
        const url = s3URL || ""
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'concession_template.xlsx');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        toast.error('Download url for health form is not found.');
      }
    } else if ( bulkUploadLibraryBookCollectionResp && prevBulkUploadLibraryBookCollectionResp !== bulkUploadLibraryBookCollectionResp ) {
      toast.success("Bulk Book Collection Added Successfully.");
      closebulkUploadModal();
      libraryBookCollectionList();
    } else if ( libraryBookCollectionErrorAct && prevLibraryBookCollectionErrorResp !== libraryBookCollectionErrorAct) {
      const { message,details } = libraryBookCollectionErrorAct || {};
      toast.error(message || details || "Something went wrong.");
    }

    libraryShelvesRef.current.prevSaveLibraryBookCollectionResp = saveLibraryBookCollectionResp;
    libraryShelvesRef.current.prevDeleteLibraryBookCollectionResp = deleteLibraryBookCollectionResp;
    libraryShelvesRef.current.prevExportLibraryBookCollectionResp = exportLibraryBookCollectionResp;
    libraryShelvesRef.current.prevBulkUploadLibraryBookCollectionResp = bulkUploadLibraryBookCollectionResp;
    libraryShelvesRef.current.prevDownloadStaticLibraryBookCollectionResp = downloadStaticLibraryBookCollectionResp;
    libraryShelvesRef.current.prevLibraryBookCollectionErrorResp = libraryBookCollectionErrorAct;

  }, [saveLibraryBookCollectionResp, editLibraryBookCollectionRequestResp, deleteLibraryBookCollectionResp, exportLibraryBookCollectionResp, bulkUploadLibraryBookCollectionResp, downloadStaticLibraryBookCollectionResp, libraryBookCollectionErrorAct,])

  useEffect(() => {
    if (branchId) {
      const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
          dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
  }, [branchId]);
      
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-400" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getLibraryBookCollectionByIdAct(generateActionPayload("get_library_book_collection_list_by_id", { id: id })));
          openBookCollectionUploadModal(id)
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-mr-2 tw-text-red-600" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelBookCollectionModal(id)
        },
      }
    ],
    []
  );

  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    dispatch(resetLibraryListAct(undefined));
    dispatch(resetShelfAct(undefined));
    dispatch(resetRackAct(undefined));
    setBookCollectUploadFilterState({ ...initialValues });
    libraryBookCollectionList({ ...initialValues });

    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
  };

  useEffect(() => {

    libraryBookCollectionList();
    libraryRoomsList();
    libraryDetailsList();
    libraryRecordList();
    libraryLanguageList();
    libraryCategoryList();
  }, [branchId,instituteId,]);

  useEffect(() => {
    if (
      bookCollectUploadFilterState.libraryId ||
      bookCollectUploadFilterState.roomId ||
      bookCollectUploadFilterState.shelfId
    ) {
      libraryRactList();
    }
  }, [
    bookCollectUploadFilterState.libraryId,
    bookCollectUploadFilterState.roomId,
    bookCollectUploadFilterState.shelfId,
  ]);

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    let processedValue = value;
    if (name === 'searchString') {
      processedValue = removeLeadingZeros(value);
    }
    if (name === 'libraryId') {
      setBookCollectUploadFilterState((prev: any) => ({ ...prev, [name]: value, roomId: "", shelfId: "", rackId: "", }));
      libraryBookCollectionList({ [name]: processedValue })
      if (!value) {
        dispatch(resetShelfAct(undefined));
        dispatch(resetRackAct(undefined));
        dispatch(resetLibraryRoomAct(undefined));
      }
      else {
        libraryRoomsList(value);
      }
    } else if (name === 'roomId') {
      setBookCollectUploadFilterState((prev: any) => ({ ...prev, [name]: value, shelfId: "", rackId: "", }));
      const isNotAuth = value === "NOT_AUTH";
      const payload = isNotAuth ? { roomId: 0 } : { roomId: processedValue };
      libraryBookCollectionList(payload);

      if (!value || isNotAuth) {
        dispatch(resetShelfAct(undefined));
        dispatch(resetRackAct(undefined));
      } else {
        dispatch(getLibraryshelf(generateActionPayload("get_library_shelf", undefined, {branchId,roomId: value,orderBy: "asc",pageNo: 0,pageSize: 100,})));
      }
    } else if (name === 'shelfId') {
      setBookCollectUploadFilterState((prev: any) => ({
        ...prev, [name]: value, rackId: "",
      }));
      const isNotAuth = value === "NOT_AUTH";
      const payload = isNotAuth ? { shelfId: 0 } : { shelfId: processedValue };
      libraryBookCollectionList(payload);
    } else {
      setBookCollectUploadFilterState((prev: any) => ({ ...prev, [name]: value }));
      libraryBookCollectionList({ [name]: value });
    }
    advanceFilterChange({ keys: { ...bookCollectUploadFilterState, [name]: value }, ignoredKeys })
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryBookCollectionList(paginationInfo)
  }

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  const dropDownOption = useMemo(() => [
    {
      id: "add-single-book",
      actionName: "Add Single Book",
      actionIcon: <HugeiconsIcon icon={BookUploadIcon} className="tw-mr-2 tw-text-gray-400" size={18} />,
      onClickHndlr: () => {
        openBookCollectionUploadModal()
      }
    },
    {
      id: "upload-bulk-book",
      actionName: "Upload Bulk Collection",
      actionIcon: <HugeiconsIcon icon={Add01Icon} className="tw-mr-2 tw-text-gray-400" size={20} />,
      onClickHndlr: (event: any) => {
        openbulkUploadModal()
      }
    },
  ], [])

  function delModalSubmitHndlr() {
    dispatch(deleteLibraryBookCollectionAct(generateActionPayload("delete_library_book_collection", { id: deleteBookCollectionState.modalData })));
  }
  const sanitizeIds = (filters: any) => {
    const updated = { ...filters };
    Object.keys(updated).forEach((key) => {
      if (updated[key] === "NOT_AUTH") {
        updated[key] = 0;
      }
    });
    return updated;
  };
  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 };

    const sanitizedFilters = sanitizeIds(appliedFilters);

    advanceFilterChange({
      keys: { ...bookCollectUploadFilterState, ...sanitizedFilters },
      ignoredKeys
    });

    setBookCollectUploadFilterState((prevState: any) => ({
      ...prevState,
      ...sanitizedFilters
    }));

    libraryBookCollectionList(sanitizedFilters);
  }

  const exportExcelHndler = () => {

    dispatch(exportLibraryBookCollectionAct(generateActionPayload("export_library_book_collection", undefined, { ...bookCollectUploadFilterState, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  const columns = useMemo(() => generateColumns(menuOptions), [libraryBookCollectionRequestListResp,menuOptions]);
  const { content: libraryBookCollection, totalElements, totalPages, pageable } = libraryBookCollectionRequestListResp || {}
  const { content: rawRoomResp } = libraryRoomsRequestListResp || {};

  const { data: rawShelfResp } = libraryShelfRequestListResp || {};
  const libraryRoomNameResp = [
    { id: "NOT_AUTH", roomName: "Not Assigned" },
    ...(rawRoomResp || []),
  ];

  const libraryShelfNameResp = [
    { id: "NOT_AUTH", shelfName: "Not Assigned" },
    ...(rawShelfResp || []),
  ];

  function onSearchHandler(name:string,value:any) {
    pagination.current.pageNo = 0;
    setSearchType((prev:any) => {
      const updatedFilterType = prev;
      setBookCollectUploadFilterState((prev:any) => {
        const updatedFilters = {
          ...prev,
          searchString: value,
          searchFilterType: updatedFilterType
        }
        libraryBookCollectionList(updatedFilters)
        return updatedFilters
      })
      return updatedFilterType;
    })
  }

  function onChangeHandler(name:string, id:any, item:any) {
    pagination.current.pageNo = 0;
    setSearchType(id);

    setBookCollectUploadFilterState((prev:any) => {
      const updatedFilters = {
        ...prev,
        searchString: "",
        searchFilterType: id
      }
      libraryBookCollectionList(updatedFilters)
      return updatedFilters
    })
  }

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <LibraryCarousel />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-flex-1">
                  Book Collection Upload
                </h4>
                <div className="tw-flex">
                  <DropDownToggle
                    id="book-collection-dropdown"
                    menuOptions={dropDownOption}
                    btnName="Add New"
                    dropDownClassName="tw-mr-2"
                  />
                   <Button
                    variant="info"
                    type="button"
                    className="tw-flex tw-items-center"
                    onClick={() => openExportExcelModal()}
                    disabled={showApiLoader}
                  >
                    <i className="ri-add-line tw-mr-1" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-4">
                <div className="tw-col-span-12 lg:tw-col-span-5 xl:tw-col-span-3">
                  <SearchInput
                    hideDefaultSelect
                    name="searchString"
                    value={searchType}
                    menuItems={bookColletionSearchInputOptions}
                    idKey="id"
                    labelName="Search With"
                    searchHandler={onSearchHandler}
                    onChange={onChangeHandler}
                    renderSelectedValue={(item: any) => item?.name}
                    renderOptions={(item: any) => item?.name}
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={bookCollectUploadFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="libraryId"
                    value={bookCollectUploadFilterState.libraryId}
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
                    value={bookCollectUploadFilterState.roomId}
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
                    value={bookCollectUploadFilterState.shelfId}
                    onChange={filterHandler}
                    menuItems={libraryShelfNameResp}
                    valueKey="id"
                    textKey="shelfName"
                    formgroupClassName="tw-mb-0"
                    labelText="Shelf"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
                  <Button
                    variant="secondary"
                    type="button"
                    className="tw-flex tw-items-center"
                    onClick={toggleAdvanceFilter}
                    disabled={showApiLoader}
                  >
                    <FilterSvg height="18px" width="18px" />
                    <span className="tw-ml-2">Filters</span>
                  </Button>
                  <span className="tw-absolute tw--top-2 tw-left-14 tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-px-2 tw-rounded-full">
                    {count}
                  </span>
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
              <TableContainer
                columns={columns || []}
                data={libraryBookCollection || []}
                tableClass="tw-mb-0"
                divClass="table-responsive tw-mb-3"
                theadClass="table-light text-muted align-middle"
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
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="feereceipt-advance-filter"
      >
        <AdvanceFilterModal
          appliedFilter={bookCollectUploadFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />

      </OffCanvasContainer>
      <ModalContainerUpdated
        id="book-collection"
        isOpen={bookCollectionUploadState.showModal}
        toggle={closeBookCollectionUploadModal}
        modalTitle={bookCollectionUploadState.modalData ? "Edit Book Collection" : "Add Book Collection"}
        modalSize="xl"
      >
        <BookCollectionUploadModel
          id={bookCollectionUploadState.modalData}
          isOpen={false}
          toggle={closeBookCollectionUploadModal}
          modalTitle="Book Collection"
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="bulk-upload-modal"
        isOpen={bulkUploadState.showModal}
        toggle={closebulkUploadModal}
        modalTitle="Bulk Upload Modal"
        modalSize="md"
      >
        <UploadExcelModal
          toggle={closebulkUploadModal}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-book-collection-modal"
        isOpen={deleteBookCollectionState.showModal}
        confirmMessage="Are you sure you want to delete this Book Collection ?"
        cancelHndlr={closeDelBookCollectionModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
      <ModalContainerUpdated
        id="book-collection-export"
        isOpen={exportExcelState.showModal}
        toggle={closeExportExcelModal}
        modalTitle="Export Book Collection Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcelState.showModal}
          toggle={closeExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="library"
          subFeature="book_collection"
          remarksText="Enter remarks to export book collection data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default BookCollectionUpload;
