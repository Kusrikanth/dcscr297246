import { useCallback, useEffect, useMemo, useRef } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useModal } from "../../../../hooks/modalhook";
import {
  ConfirmationModal,
  DateInput,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import UploadGalleryModal from "./UploadGalleryModal";
import {
  Delete02StrokeStandard,
  EyeIcon,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import {
  deleteGalleryManagementItemAct,
  getGalleryManagementListAct,
} from "../../../../store/communication/communicationactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";
import { debounce } from "../../../../utility/commonutility";
import { useFilterState } from "../../../../hooks/filterhook";

const initialValues = {
  searchString: "",
  academicYearId: "",
  startDate: "",
  endDate: "",
  
};

const StudentGallery = () => {
  const {
    closeModal: closeUploadGalleryModal,
    openModal: openUploadGalleryModal,
    modalState: uploadGalleryModal,
  } = useModal();
  const { showClearFilterState, advanceFilterChange } = useFilterState();
  const { closeModal: closeDeleteTemplateModal, modalState: deleteTemplateState, openModal: openDeleteTemplateModal } = useModal();
  const dispatch = useAppDispatch();

  const galleryManagementFormik = useFormik({
    initialValues,
    onSubmit: (value) => { },
  });

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    currentBranchIdResp: branchId,
    getGalleryManagementListResp,
    academicYearListResp,
    communicationErrorResp,
    currentInstIdResp: instituteId,
    showApiLoader,
    deleteGalleryManagementItemResp,
    saveGalleryManagementItemResp,
    updateGalleryManagementItemResp
  } = useAppSelector(
    ({ appData, globalData, instAcademics, communication }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      getGalleryManagementListResp: communication.getGalleryManagementListResp,
      showApiLoader: globalData.showApiLoader,
      communicationErrorResp: communication.communicationErrorResp,
      deleteGalleryManagementItemResp: communication.deleteGalleryManagementItemResp,
      saveGalleryManagementItemResp: communication.saveGalleryManagementItemResp,
      updateGalleryManagementItemResp: communication.updateGalleryManagementItemResp
    }),
    shallowEqual
  );

    const evntsRef = useRef({
          prevCommunicationErrorResp: communicationErrorResp,
          prevDeleteGalleryManagementItemResp: deleteGalleryManagementItemResp,
          prevSaveGalleryManagementItemResp: saveGalleryManagementItemResp,
          prevUpdateGalleryManagementItemResp: updateGalleryManagementItemResp
      });
      useEffect(() => {
          const { prevCommunicationErrorResp, prevDeleteGalleryManagementItemResp, prevSaveGalleryManagementItemResp, prevUpdateGalleryManagementItemResp } = evntsRef.current;
           if (communicationErrorResp && communicationErrorResp !== prevCommunicationErrorResp) {
              const { details } = communicationErrorResp;
              toast.error(details || "Something went wrong.");
          }
          else if (deleteGalleryManagementItemResp && deleteGalleryManagementItemResp !== prevDeleteGalleryManagementItemResp) {
              toast.success("Gallery deleted successfully.");
              fetchGalleryManagementList();
              closeDeleteTemplateModal();
          }
          else if(saveGalleryManagementItemResp && saveGalleryManagementItemResp !== prevSaveGalleryManagementItemResp) {
              toast.success("Gallery saved successfully.");
              fetchGalleryManagementList();
              closeUploadGalleryModal();
          }
          else if(updateGalleryManagementItemResp && updateGalleryManagementItemResp !== prevUpdateGalleryManagementItemResp) {
              toast.success("Gallery updated successfully.");
              fetchGalleryManagementList();
              closeUploadGalleryModal();
          }
          evntsRef.current.prevCommunicationErrorResp = communicationErrorResp;
          evntsRef.current.prevDeleteGalleryManagementItemResp = deleteGalleryManagementItemResp;
          evntsRef.current.prevSaveGalleryManagementItemResp = saveGalleryManagementItemResp;
          evntsRef.current.prevUpdateGalleryManagementItemResp = updateGalleryManagementItemResp;
      }, [communicationErrorResp, deleteGalleryManagementItemResp, saveGalleryManagementItemResp, updateGalleryManagementItemResp]);


  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionName: "Edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
         onClickHndlr: (event: React.MouseEvent<HTMLElement>) =>  {
            const id = event.currentTarget.getAttribute("data-id");
            openUploadGalleryModal(id);
        },
      },
      {
        id: "view",
        actionName: "View",
        actionIcon: (
          <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />
        ),
      },
      {
        id: "delete",
        actionName: "Delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDeleteTemplateModal(id)
        },
      },
    ],
    []
  );

  function fetchGalleryManagementList(otherProps?: any) {
    const { academicYearId, startDate, endDate, searchString } = galleryManagementFormik.values;
    const payload = {
      branchId,
      searchString,
      academicYearId,
      startDate,
      endDate,
      ...paginationRef.current,
      ...otherProps,
    };

    dispatch(
      getGalleryManagementListAct(
        generateActionPayload("get_gallery_management_list", undefined, payload)
      )
    );
  }

  function callbackPaginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
  }

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  useEffect(() => {
    let yearId =
      academicYearListResp &&
      academicYearListResp?.data?.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    galleryManagementFormik.setFieldValue("academicYearId", yearId);
    fetchGalleryManagementList({ academicYearId: yearId });
  }, [academicYearListResp]);

  
  function search(value: string) {
    paginationRef.current.pageNo = 0;
    fetchGalleryManagementList({ ...galleryManagementFormik.values, searchString: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [getGalleryManagementListResp]);

  const filterHndlr = (event: any) => {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;
    advanceFilterChange({
            keys: { ...galleryManagementFormik.values, [name]: value },
            ignoredKeys: ["academicYearId"],
        });
    if (name === "academicYearId") {
      galleryManagementFormik.setFieldValue("academicYearId", value);
      fetchGalleryManagementList({ academicYearId: value });
    }
    else if(name === "startDate") {
      galleryManagementFormik.setFieldValue("startDate", value);
      fetchGalleryManagementList({ startDate: value });
    }
    else if(name === "endDate") {
      galleryManagementFormik.setFieldValue("endDate", value);
      fetchGalleryManagementList({ endDate: value });
    }
    else if(name === "searchString") {
      galleryManagementFormik.setFieldValue("searchString", value);
      debounceFun(value);
    }
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
          paginationRef.current = paginationInfo;
          fetchGalleryManagementList(paginationInfo);
      }
  const deleteTemplateHandler = () => {
    dispatch(
      deleteGalleryManagementItemAct(
        generateActionPayload("delete_gallery_managament_item", {
          galleryId: deleteTemplateState.modalData,
        })
      )
    );
  };

   const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationRef.current = { ...paginationRef.current, pageNo: 0 }
            let { academicYearId } = academicYearListResp?.data?.find((year: any) =>  year.yearStatus.toLowerCase() === "current") || {};
            galleryManagementFormik.setValues({ ...initialValues, academicYearId: academicYearId || "" })
            fetchGalleryManagementList({ ...initialValues, academicYearId })
            advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: ["academicYearId"] });
        }
    };
  // useEffect(() => fetchGalleryManagementList(), []);
  const { data: feedsList, pageNo: pageNumber, totalPages, totalElements: totalRecords } = getGalleryManagementListResp || {};


  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Gallery"></BreadCrumb>

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3">

            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-lg tw-font-semibold tw-flex-grow">
                  Gallery Management
                </h4>

                <div>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => openUploadGalleryModal()}
                  >
                    <i className="ri-add-line tw-mr-1"></i>
                    <span>Upload Gallery</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-4">

                <div className="tw-col-span-12 lg:tw-col-span-3">
                  <div className="tw-relative">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        value={galleryManagementFormik.values.searchString}
                        onChange={filterHndlr}
                        formgroupClassName="mb-0"
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                  </div>
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={galleryManagementFormik.values.academicYearId}
                    onChange={filterHndlr}
                    menuItems={academicYearListResp?.data || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <DateInput
                    name="startDate"
                    value={galleryManagementFormik.values.startDate}
                    onChange={filterHndlr}
                    formgroupClassName="mb-0"
                    labelText="Start Date"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <DateInput
                    name="endDate"
                    value={galleryManagementFormik.values.endDate}
                    onChange={filterHndlr}
                    formgroupClassName="mb-0"
                    labelText="End Date"
                    floatingLabel
                  />
                </div>
                {showClearFilterState && (
                  <div className="tw-col-span-2  tw-flex">
                    <Button
                      type="button"
                      onClick={clearFilterHndlr}
                      variant='wrong'
                    >
                      Clear filter
                    </Button>
                  </div>
                )}
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={getGalleryManagementListResp?.data || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                tableClass="tw-whitespace-nowrap"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalRecords}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              ></TableContainer>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="upload-gallery"
        isOpen={uploadGalleryModal.showModal}
        toggle={closeUploadGalleryModal}
        modalTitle="Upload Image Gallery"
        modalSize="xl"
      >
        <UploadGalleryModal toggle={closeUploadGalleryModal} id={uploadGalleryModal.modalData}></UploadGalleryModal>
      </ModalContainerUpdated>
      <ConfirmationModal
                      id="delete-template"
                      isOpen={deleteTemplateState.showModal}
                      confirmMessage="Are you sure you want to delete a Gallery?"
                      cancelHndlr={closeDeleteTemplateModal}
                      confirmHndlr={deleteTemplateHandler}
                      isDisble={showApiLoader}
                      showImgIcon={true}
                      iconType='reject'
                  />
    </>
  );
};

export default StudentGallery;
