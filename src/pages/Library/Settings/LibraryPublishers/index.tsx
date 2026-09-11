import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { generateColumns } from "./helper";
import LibraryPublishersModel from "./LibraryPublishersModel";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";
import { deleteLibraryPublisherListAct, getLibrarypublisherList, getLibraryPublisherListByIdAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  publisherName: "",
};

const LibraryPublishers = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [LibraryPublishers, setLibraryPublishers] = useState(initialValues);
  const [LibraryPublishersModelState, setLibraryPublishersModelState] = useState({
    showModal: false,
    publisherId: undefined
  });

  const [delLibraryDetailsModalState, setDelLibraryDetailsModalState] = useState({
    showModal: false,
    publisherId: ""
  });

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const LibraryPublishersForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryPublishers,
    onSubmit: (values) => { },
  });

  const toggleDelLibraryDetailsModal = (publisherId?: any) => {
    setDelLibraryDetailsModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      publisherId: publisherId || "",
    }));
  };

  const toggleLibraryPublishersModel = (publisherId?: any) => {
    setLibraryPublishersModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      publisherId: publisherId || "",
    }));
  };

  const delLibraryPublisherConfirmHndler = () => {
    dispatch(deleteLibraryPublisherListAct(generateActionPayload("delete_Library_Publishers_list", { publisherId: delLibraryDetailsModalState.publisherId })));
  };


  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryPublisherRequestListResp,
    saveLibraryPublisherListResp,
    editLibraryPublisherRequestResp,
    delLibraryPublisherRequestResp,
    libraryDetailsErrorAct,
  } = useAppSelector(
    ({ librarysettings, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryPublisherRequestListResp: librarysettings.libraryPublisherRequestListResp,
      saveLibraryPublisherListResp: librarysettings.saveLibraryPublisherListResp,
      editLibraryPublisherRequestResp: librarysettings.editLibraryPublisherRequestResp,
      delLibraryPublisherRequestResp: librarysettings.delLibraryPublisherRequestResp,
      libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
    }),
    shallowEqual
  );

  const libraryPublishersList = (otherProps?: any) => {
    const { publisherName } = LibraryPublishers;
    let payload = {
      publisherName,
      branchId,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getLibrarypublisherList(generateActionPayload("get_library_publisher", undefined, payload)));
  };

  const libraryPublishersRef = useRef({
    prevAddLibraryPublisher: saveLibraryPublisherListResp,
    prevEditLibraryPublisher: editLibraryPublisherRequestResp,
    prevDeleteLibraryPublisherRequestListResp: delLibraryPublisherRequestResp,
    prevLibraryDetailsErrorResp: libraryDetailsErrorAct,
  });

  useEffect(() => {
    const { prevAddLibraryPublisher, prevEditLibraryPublisher, prevDeleteLibraryPublisherRequestListResp, prevLibraryDetailsErrorResp } = libraryPublishersRef.current;
    if (saveLibraryPublisherListResp && prevAddLibraryPublisher !== saveLibraryPublisherListResp) {
      toast.success("Library added successfully.");
      toggleLibraryPublishersModel();
      libraryPublishersList();
    } 
    else if (editLibraryPublisherRequestResp && prevEditLibraryPublisher !== editLibraryPublisherRequestResp) {
      toast.success("Library Publisher updated successfully.");
      toggleLibraryPublishersModel();
      libraryPublishersList();
    } 
    else if (delLibraryPublisherRequestResp && prevDeleteLibraryPublisherRequestListResp !== delLibraryPublisherRequestResp) {
      toast.success("Library Publisher deleted successfully.");
      toggleDelLibraryDetailsModal();
      libraryPublishersList();
    } 
    else if (libraryDetailsErrorAct && prevLibraryDetailsErrorResp !== libraryDetailsErrorAct) {
      const { details } = libraryDetailsErrorAct;
      toast.error(details);
    }
    libraryPublishersRef.current.prevDeleteLibraryPublisherRequestListResp = delLibraryPublisherRequestResp;
    libraryPublishersRef.current.prevEditLibraryPublisher = editLibraryPublisherRequestResp;
    libraryPublishersRef.current.prevAddLibraryPublisher = saveLibraryPublisherListResp;
    libraryPublishersRef.current.prevLibraryDetailsErrorResp = libraryDetailsErrorAct;
  }, [saveLibraryPublisherListResp, editLibraryPublisherRequestResp, delLibraryPublisherRequestResp, libraryDetailsErrorAct]);



  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-grey-400" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const publisherId = event.currentTarget.getAttribute("data-id");
           dispatch(getLibraryPublisherListByIdAct(generateActionPayload("get_library_Publishers_list_by_id", { publisherId: publisherId })));
            toggleLibraryPublishersModel(publisherId);
       
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-600" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const publisherId = event.currentTarget.getAttribute("data-id");
          toggleDelLibraryDetailsModal(publisherId);
      
        },
      },
  
    ],
    []
  );

  const columns = useMemo(() => generateColumns(menuOptions), []);
  useEffect(() => {
    libraryPublishersList();
  }, [branchId,instituteId,]);

  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setLibraryPublishers((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    libraryPublishersList({ [name]: value });
  };
  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryPublishersList(paginationInfo);
  }

  const { content: libraryPublishersResp, totalElements, totalPages, pageable } = libraryPublisherRequestListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded-md tw-shadow">
            <div className="tw-border-b tw-border-slate-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Publishers
                </h4>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={LibraryPublishersForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-justify-between tw-py-3 tw-items-end">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="publisherName"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={LibraryPublishersForm.values.publisherName}
                        onChange={filterHandler}
                        floatingLabel
                        labelText="Search"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                  <div className="tw-hidden lg:tw-col-span-6"></div>
                  <div className="tw-col-span-12 lg:tw-col-span-2 tw-flex tw-justify-end">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => toggleLibraryPublishersModel()}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add New
                    </Button>
                  </div>
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={libraryPublishersResp || []}
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
        id="library-publishers"
        isOpen={LibraryPublishersModelState.showModal}
        toggle={() => toggleLibraryPublishersModel()}
        modalTitle={LibraryPublishersModelState.publisherId ? "Edit Library Publishers" : "Create Publishers"}
        modalSize="md"
      >
        <LibraryPublishersModel
          publisherId={LibraryPublishersModelState.publisherId}
          isOpen={false}
          toggle={() => toggleLibraryPublishersModel()}
          modalTitle="Create Publisher"
          editBranchDetails={""}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-library-publisher-modal"
        isOpen={delLibraryDetailsModalState.showModal}
        confirmMessage="Are you sure you want to delete this Library Publisher ?"
        cancelHndlr={() => toggleDelLibraryDetailsModal()}
        confirmHndlr={delLibraryPublisherConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default LibraryPublishers;
