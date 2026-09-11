import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import { deleteSubAlingmentsListAct, getSubAlingmentsListAct } from "../../../../store/healthrecords/healthrecordsaction";
import SubAlingmentsModel from "./SubAlingmentsModel";
import CommanAlingmentsModel from "./CommanAlingmentsModel";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
};

const SubAlingment = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [subAlingments, setSubAlingments] = useState(initialValues);
  const [ commanAlingmentsModelState, setCommanAlingmentsModelState] = useState({
    showModal: false,
    id: undefined
  });
  const [subAlingmentsModelState, setSubAlingmentsModelState] = useState({
    showModal: false,
    id: undefined,
    modalData: undefined
  })
  const [delSubAlingmentsModalState, setDelSubAlingmentsModalState] = useState({
    showModal: false,
    id: ""
  })

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const subAlingmentsForm = useFormik({
    enableReinitialize: true,
    initialValues: subAlingments,
    onSubmit: (values) => { },
  });

  const toggleCommanAlingmentsModel = (id?: any) => {
    setCommanAlingmentsModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  };
  const toggleDelSubAlingmentsModal = (id?: any) => {
    setDelSubAlingmentsModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  }
  const togglesubAlingmentsModel = (id?: any) => {
    setSubAlingmentsModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
      modalData: undefined
    }));
  };

  const delSubAlingmentsConfirmHndler = () => {
    dispatch(deleteSubAlingmentsListAct(generateActionPayload("delete_sub_alingments_list", { id: delSubAlingmentsModalState.id },)));
  }
  const subAlingmentsList = (otherProps?: any) => {
    const { searchString } = subAlingments;
    let payload = {
      branchId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getSubAlingmentsListAct(generateActionPayload("get_sub_alingments_list", undefined, payload)));
}
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getSubAlingmentsListResp,
    saveSubAlingmentsResp,
    editSubAlingmentsResp,
    deleteSubAlingmentsListResp,
    healthRecordsErrResp,
  } = useAppSelector(
    ({ healthRecords, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getSubAlingmentsListResp: healthRecords.getSubAlingmentsListResp,
      editSubAlingmentsResp: healthRecords.editSubAlingmentsResp,
      saveSubAlingmentsResp: healthRecords.saveSubAlingmentsResp,
      deleteSubAlingmentsListResp: healthRecords.deleteSubAlingmentsListResp,
      healthRecordsErrResp: healthRecords.healthRecordsErrResp,
            
    }),
    shallowEqual
  );
  const commanAlingmentsRef = useRef({
    prevAddSubCommanAlingments: saveSubAlingmentsResp,
    prevEditSubCommanAlingments: editSubAlingmentsResp,
    prevDeleteSubCommanAlingments: deleteSubAlingmentsListResp,
    prevHealthRecordsErrorResp: healthRecordsErrResp,
  });

  useEffect(() => {
    const { prevAddSubCommanAlingments, prevEditSubCommanAlingments,  prevDeleteSubCommanAlingments, prevHealthRecordsErrorResp } = commanAlingmentsRef.current;
    if (saveSubAlingmentsResp && prevAddSubCommanAlingments !== saveSubAlingmentsResp) {
      toast.success("Alingment Added successfully.");
      toggleCommanAlingmentsModel()
      subAlingmentsList()
    }
     else if (editSubAlingmentsResp && prevEditSubCommanAlingments !== editSubAlingmentsResp) {
      toast.success("Alingment Updated successfully.");
      togglesubAlingmentsModel()
      subAlingmentsList()
    }
     else if (deleteSubAlingmentsListResp && prevDeleteSubCommanAlingments !== deleteSubAlingmentsListResp) {
      toast.success("Alingment Deleted successfully.");
      toggleDelSubAlingmentsModal()
      subAlingmentsList()
    }
    else if (healthRecordsErrResp && prevHealthRecordsErrorResp !== healthRecordsErrResp) {
      const { details } = healthRecordsErrResp;
      toast.error(details);
    }
    commanAlingmentsRef.current.prevAddSubCommanAlingments = saveSubAlingmentsResp;
    commanAlingmentsRef.current.prevEditSubCommanAlingments = editSubAlingmentsResp;
    commanAlingmentsRef.current.prevDeleteSubCommanAlingments = deleteSubAlingmentsListResp;
    commanAlingmentsRef.current.prevHealthRecordsErrorResp = healthRecordsErrResp;

  }, [saveSubAlingmentsResp, editSubAlingmentsResp, deleteSubAlingmentsListResp, healthRecordsErrResp]);

const toggleEditModal = useCallback((apiCall?: boolean) => {
  setSubAlingmentsModelState((prevState: any) => ({
    ...prevState,
    showModal: !prevState.showModal,
    id: "",
    modalData: undefined
  }));
  if (typeof apiCall === "boolean" && apiCall) {
    subAlingmentsList();
  }
}, [getSubAlingmentsListResp]);
function editSpecialFeeHndlr(event: any) {
  const id = event.currentTarget.getAttribute("data-id");
  let modalData: any = getSubAlingmentsListResp?.data.find((item: any) => +item.id === +id);
  if (modalData) {
    setSubAlingmentsModelState((prevState: any) => {
      const newState = { ...prevState, showModal: true, id, modalData };
      return newState;
    });
  }
}


  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: editSpecialFeeHndlr,
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleDelSubAlingmentsModal(id)
        },
      },
    ],
    [getSubAlingmentsListResp]
  );

  const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

  useEffect(() => {
    subAlingmentsList();
  }, []);

  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setSubAlingments((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    subAlingmentsList({ [name]: value });
  };


  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    subAlingmentsList(paginationInfo);
  }

  const { data: commanAlingmentsResp, totalElements, totalPages, pageable } = getSubAlingmentsListResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Manage Alingments" pageTitle="Health Records" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            {/* Card Header */}
            <div className="tw-border-b tw-p-4">
              <div className="tw-flex tw-items-center">
                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Manage Ailments
                  </h4>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="tw-p-0">
              <form onSubmit={subAlingmentsForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-1 tw-gap-3 tw-px-3 tw-pt-3 md:tw-grid-cols-12">

                  {/* Search */}
                  <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-3"
                        placeHolder="Search"
                        labelText="Search"
                        floatingLabel
                        value={subAlingmentsForm.values.searchString}
                        onChange={filterHandler}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className="tw-col-span-8  tw-ml-auto">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => toggleCommanAlingmentsModel()}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add New
                    </Button>
                  </div>

                </div>
              </form>

              {/* Table */}
              <TableContainer
                columns={columns || []}
                data={commanAlingmentsResp || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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
        id="aliments-details-modal"
        isOpen={commanAlingmentsModelState.showModal}
        toggle={() => toggleCommanAlingmentsModel()}
        modalTitle={commanAlingmentsModelState.id ? "Edit Ailments Details" : "Create Details"}
        modalSize="md"
      >
        <CommanAlingmentsModel
          id={commanAlingmentsModelState.id}
          toggle={() => toggleCommanAlingmentsModel()}
          modalTitle="Create Ailments Details" isOpen={false} />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="alinment-details-modal"
        isOpen={subAlingmentsModelState.showModal}
        toggle={toggleEditModal}
        modalTitle={subAlingmentsModelState.id ? "Edit Details" : "Create Details"}
        modalSize="md"
      >
        <SubAlingmentsModel
          id={subAlingmentsModelState.id}
          toggle={toggleEditModal}
          editModalData={subAlingmentsModelState.modalData}
          modalTitle="Create Sub Alinment Details" 
          isOpen={subAlingmentsModelState.showModal} />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-alinment-details-modal"
        isOpen={delSubAlingmentsModalState.showModal}
        confirmMessage="Are you sure you want to delete this Alinment Details ?"
        cancelHndlr={() => toggleDelSubAlingmentsModal()}
        confirmHndlr={delSubAlingmentsConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );  
};

export default SubAlingment;
