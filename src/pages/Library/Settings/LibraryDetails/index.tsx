import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { generateColumns } from "./helper";
import LibraryDetailsModel from "./LibraryDetailsModel";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteLibraryDetailsListAct, getLibraryDetailsListAct, getLibraryDetailsListByIdAct, } from "../../../../store/library/settings/librarysettingsaction";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
};

const LibraryDetails = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [libraryDetails, setLibraryDetails] = useState(initialValues);
  const [libraryDetailsModelState, setLibraryDetailsModelState] = useState({
    showModal: false,
    id: undefined
  })

  const [delLibraryDetailsModalState, setDelLibraryDetailsModalState] = useState({
    showModal: false,
    id: ""
  })

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const LibraryDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: libraryDetails,
    onSubmit: (values) => { },
  });

  const toggleLibraryDetailsModel = (id?: any) => {
    setLibraryDetailsModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  };

  const toggleDelLibraryDetailsModal = (id?: any) => {
    setDelLibraryDetailsModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  }

  const delLibraryDetailsConfirmHndler = () => {
    dispatch(deleteLibraryDetailsListAct(generateActionPayload("delete_Library_details_list", { id: delLibraryDetailsModalState.id },)));
  }

  const libraryDetailsList = (otherProps?: any) => {
    const { searchString } = libraryDetails;
    let payload = {
      branchId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
  };
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryDetailsRequestListResp,
    saveLibraryDetailsListResp,
    editLibraryDetailRequestResp,
    delLibraryRequestResp,
    libraryDetailsErrorAct,
  } = useAppSelector(
    ({ librarysettings, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      saveLibraryDetailsListResp: librarysettings.saveLibraryDetailsListResp,
      editLibraryDetailRequestResp: librarysettings.editLibraryDetailRequestResp,
      delLibraryRequestResp: librarysettings.delLibraryRequestResp,
      libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
    }),
    shallowEqual
  );

  const libraryDetailsRef = useRef({
    prevAddLibraryDetails: saveLibraryDetailsListResp,
    prevEditLibraryDetails: editLibraryDetailRequestResp,
    prevDeleteLibraryRequestListResp: delLibraryRequestResp,
    prevLibraryDetailsErrorResp: libraryDetailsErrorAct,
  });

  useEffect(() => {
    const { prevAddLibraryDetails, prevEditLibraryDetails, prevDeleteLibraryRequestListResp, prevLibraryDetailsErrorResp } = libraryDetailsRef.current;
    if (saveLibraryDetailsListResp && prevAddLibraryDetails !== saveLibraryDetailsListResp) {
      toast.success("Library added successfully.");
      toggleLibraryDetailsModel()
      libraryDetailsList()
    }
    else if (editLibraryDetailRequestResp && prevEditLibraryDetails !== editLibraryDetailRequestResp) {
      toast.success("Library Details updated successfully.");
      toggleLibraryDetailsModel()
      libraryDetailsList()
    }
    else if (delLibraryRequestResp && prevDeleteLibraryRequestListResp !== delLibraryRequestResp) {
      toast.success("Library Details deleted successfully.");
      toggleDelLibraryDetailsModal()
      libraryDetailsList()
    }
    else if (libraryDetailsErrorAct && prevLibraryDetailsErrorResp !== libraryDetailsErrorAct) {
      const { details } = libraryDetailsErrorAct;
      toast.error(details);
    }
    libraryDetailsRef.current.prevDeleteLibraryRequestListResp = delLibraryRequestResp;
    libraryDetailsRef.current.prevEditLibraryDetails = editLibraryDetailRequestResp;
    libraryDetailsRef.current.prevAddLibraryDetails = saveLibraryDetailsListResp;
    libraryDetailsRef.current.prevLibraryDetailsErrorResp = libraryDetailsErrorAct;

  }, [saveLibraryDetailsListResp, editLibraryDetailRequestResp, delLibraryRequestResp, libraryDetailsErrorAct]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-400" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getLibraryDetailsListByIdAct(generateActionPayload("get_library_details_list_by_id", { id: id })));
          toggleLibraryDetailsModel(id)
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-600" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleDelLibraryDetailsModal(id)
        },
      },
    ],
    []
  );

  const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

  useEffect(() => {
    libraryDetailsList();
  }, [branchId,instituteId,]);

  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setLibraryDetails((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    libraryDetailsList({ [name]: value });
  };


  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryDetailsList(paginationInfo);
  }

  const { content: libraryDetailsResp, totalElements, totalPages, pageable } = libraryDetailsRequestListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded tw-shadow">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                    Library Details
                  </h4>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={LibraryDetailsForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-4 tw-items-end">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={LibraryDetailsForm.values.searchString}
                        onChange={filterHandler}
                        floatingLabel
                        labelText="Search"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-8 tw-flex tw-justify-end">
                    <Button type="button"
                      variant="primary"
                      onClick={() => toggleLibraryDetailsModel()}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add New
                    </Button>
                  </div>
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={libraryDetailsResp || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
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
        id="library-details-modal"
        isOpen={libraryDetailsModelState.showModal}
        toggle={() => toggleLibraryDetailsModel()}
        modalTitle={libraryDetailsModelState.id ? "Edit Library Details" : "Create Details"}
        modalSize="md"
      >
        <LibraryDetailsModel
          id={libraryDetailsModelState.id}
          toggle={() => toggleLibraryDetailsModel()}
          modalTitle="Create Library Details" isOpen={false} />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-library-details-modal"
        isOpen={delLibraryDetailsModalState.showModal}
        confirmMessage="Are you sure you want to delete this Library Details ?"
        cancelHndlr={() => toggleDelLibraryDetailsModal()}
        confirmHndlr={delLibraryDetailsConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default LibraryDetails;
