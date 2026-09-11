import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { ISlabsTermsModal, SlabsTermsFilterProps } from "./SlabsTerms";
import { generateColumns } from "./helper";
import SlabsTermsModal from "./SlabsTermsModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { shallowEqual } from "react-redux";
import { deleteSlabsTermsListAct, getSlabsListAct, getSlabsTermsListAct, getSlabsTermsListByIdAct } from "../../../../store/transportation/transportationaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getInstAcademicTermAct, getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { toast } from "react-toastify";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues: SlabsTermsFilterProps = {
  slabName: "",
  academicYearId: "2022-23",
  termTypeIds: "",
};

const SlabsTerms = () => {

  const dispatch = useAppDispatch()

  const [slabsModalState, setSlabsModalState] = useState<ISlabsTermsModal>({
    showModal: false,
    slabTermId: "",
  });

  const [delSlabTermModalState, setDelSlabTermModalState] = useState({
    showModal: false,
    slabTermId: ""
  })

  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const { currentBranchIdResp: branchId,
    currentInstIdResp: instituteId, showApiLoader, academicYearListResp, getSlabsTermsListResp, getSlabsListResp, transportationErrorAct, deleteSlabsTermsListResp, createSlabsTermListResp, editSlabsTermListResp, academicTermListResp } = useAppSelector(({ transportrequest, appData, globalData, instAcademics, masterData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getSlabsTermsListResp: transportrequest.getSlabsTermsListResp,
      getSlabsListResp: transportrequest.getSlabsListResp,
      transportationErrorAct: transportrequest.transportationErrorAct,
      deleteSlabsTermsListResp: transportrequest.deleteSlabsTermsListResp,
      createSlabsTermListResp: transportrequest.createSlabsTermListResp,
      editSlabsTermListResp: transportrequest.editSlabsTermListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      academicTermListResp: instAcademics.academicTermListResp,
    }), shallowEqual);

  const SlabsTermsFilterForm = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => { },
  });

  const slabsTermsRespRef = useRef({
    prevTransportationErrorAct: transportationErrorAct,
    prevDeleteSlabsTermsListResp: deleteSlabsTermsListResp,
    prevEditSlabsTermListResp: editSlabsTermListResp,
    prevCreateSlabsTermListResp: createSlabsTermListResp,

  });

  useEffect(() => {
    const { prevTransportationErrorAct, prevDeleteSlabsTermsListResp, prevEditSlabsTermListResp, prevCreateSlabsTermListResp } = slabsTermsRespRef.current;
    if (transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
      const { details } = transportationErrorAct || {};
      toast.error(details);
    }
    else if (deleteSlabsTermsListResp && prevDeleteSlabsTermsListResp !== deleteSlabsTermsListResp) {
      delModalCancelHndlr()
      toast.success("Slab Term Deleted Successfully.")
      getSlabsTermsList({ slabName: SlabsTermsFilterForm.values.slabName })
    }
    else if (editSlabsTermListResp && prevEditSlabsTermListResp !== editSlabsTermListResp) {
      toggleSlabsModal()
      toast.success("Slab Term Edited Successfully.")
      getSlabsTermsList({ slabName: SlabsTermsFilterForm.values.slabName })
    }
    else if (createSlabsTermListResp && prevCreateSlabsTermListResp !== createSlabsTermListResp) {
      toggleSlabsModal()
      toast.success("Slab Term Created Successfully.")
      getSlabsTermsList({ slabName: SlabsTermsFilterForm.values.slabName })
    }

    slabsTermsRespRef.current.prevTransportationErrorAct = transportationErrorAct;
    slabsTermsRespRef.current.prevDeleteSlabsTermsListResp = deleteSlabsTermsListResp;
    slabsTermsRespRef.current.prevEditSlabsTermListResp = editSlabsTermListResp;
    slabsTermsRespRef.current.prevCreateSlabsTermListResp = createSlabsTermListResp;

  }, [deleteSlabsTermsListResp, transportationErrorAct, editSlabsTermListResp, createSlabsTermListResp]);


  const toggleSlabsModal = useCallback((slabTermId?: any) => {
    setSlabsModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      slabTermId: slabTermId || "",
    }));
  }, []);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const slabTermId = event.currentTarget.getAttribute("data-id")
          if (slabTermId) {
            dispatch(getSlabsTermsListByIdAct(generateActionPayload("get_slabs_terms_list_by_id", { id: slabTermId }, undefined)))
          }
          toggleSlabsModal(slabTermId)
        },
      },
    ],
    []
  );
  const roleColumns = useMemo(() => generateColumns(menuOptions), []);

  const getSlabsTermsList = (otherProps?: any) => {
    dispatch(getSlabsTermsListAct(generateActionPayload("get_slabs_terms_list", undefined, { instituteId, branchId, orderBy: "DESC", sortBy: "createdAt", ...paginationDetailRef.current, academicYearId: SlabsTermsFilterForm.values.academicYearId, ...otherProps })));
  }

  function getSlabsList(otherProps?: any) {
    dispatch(getSlabsListAct(generateActionPayload("get_slabs_list", undefined, { slabName: otherProps || null, branchId, instituteId })));
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getSlabsTermsList();
  }

  function getTermNameHndler(value: any) {
    const payload = {
      instituteId,
      pageNo: 0,
      pageSize: 100,
      academicYearId: value,
      masterTermTypeId: 1,
      sortBy: "termName",
      orderBy: "asc",
    }
    dispatch(
      getInstAcademicTermAct(
        generateActionPayload("get_inst_academic_term", undefined, payload)
      )
    );
  }

  function delModalCancelHndlr() {
    setDelSlabTermModalState((prevState: any) => ({ ...prevState, showModal: false, slabTermId: "" }));
  }

  function delModalSubmitHndlr() {
    dispatch(deleteSlabsTermsListAct(generateActionPayload("delete_slabs_terms_list", { id: delSlabTermModalState.slabTermId }, undefined)));
  }

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    getSlabsList()
  }, [branchId, instituteId]);

  useEffect(() => {
    if (academicYearListResp) {
      let yearId = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      SlabsTermsFilterForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }))
      getSlabsTermsList({ academicYearId: yearId })
      getTermNameHndler(yearId)
    }
  }, [academicYearListResp]);

  const filterHndler = (event: any) => {
    const { name, value } = event.target;
    SlabsTermsFilterForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    getSlabsTermsList({ [name]: value })

    if (name === "academicYearId") {
      SlabsTermsFilterForm.setValues((prev: any) => ({ ...prev, termTypeId: "", [name]: value }))
      const payload = {
        instituteId,
        pageNo: 0,
        pageSize: 100,
        academicYearId: value,
        masterTermTypeId: 1,
        sortBy: "termName",
        orderBy: "asc",
      }
      dispatch(
        getInstAcademicTermAct(
          generateActionPayload("get_inst_academic_term", undefined, payload)
        )
      );
    } else {
      SlabsTermsFilterForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const { totalElements, totalPages, pageNumber } = getSlabsTermsListResp || {}

  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Dashboard" pageTitle="Transportation" />

          <div className="tw-bg-white tw-shadow tw-rounded-lg tw-mb-6">
            <div className="tw-p-4 tw-border-b tw-border-gray-200 tw-flex tw-items-center">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">Slab Terms</h4>
              <div className="tw-col-span-1 tw-col-start-1 lg:tw-col-auto tw-ml-auto tw-flex tw-justify-end">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => toggleSlabsModal()}
                >
                  <i className="ri-add-line tw-mr-2"></i>
                  Add New
                </Button>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-pt-2">
                <div className="tw-w-full tw-inline-block tw-mt-2">
                  <form
                    onSubmit={SlabsTermsFilterForm.handleSubmit}
                    className="tw-mb-3 tw-px-3"
                  >
                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-6 tw-gap-3">

                      <div className="tw-col-span-1 lg:tw-col-span-1">
                        <div className="search-box tw-relative">
                          <TextInput
                            name="slabName"
                            value={SlabsTermsFilterForm.values.slabName}
                            onChange={filterHndler}
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search"
                            labelText="Search"
                            floatingLabel
                          />
                          <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400" />
                        </div>
                      </div>
                      <div className="tw-col-span-1 lg:tw-col-span-1">
                        <SelectInput
                          name="academicYearId"
                          value={SlabsTermsFilterForm.values.academicYearId}
                          onChange={filterHndler}
                          formgroupClassName="tw-mb-0"
                          menuItems={academicYearListResp?.data || []}
                          valueKey="academicYearId"
                          textKey="academicYearName"
                          labelText="Academic Year"
                          floatingLabel
                        />
                      </div>
                      <div className="tw-col-span-1 lg:tw-col-span-1">
                        <SelectInput
                          name="termTypeIds"
                          value={SlabsTermsFilterForm.values.termTypeIds}
                          onChange={filterHndler}
                          formgroupClassName="tw-mb-0"
                          menuItems={academicTermListResp?.data || []}
                          valueKey="instituteTermId"
                          textKey="termName"
                          labelText="Term Type"
                          floatingLabel
                        />
                      </div>
                    </div>
                  </form>
                  <TableContainer
                    columns={roleColumns || []}
                    data={getSlabsTermsListResp?.data || []}
                    divClass="tw-overflow-x-auto tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    showPagination={true}
                    totalPages={totalPages || 0}
                    totalRecords={totalElements || 0}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageNumber || 0}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-slabs-details"
        isOpen={slabsModalState.showModal}
        toggle={() => toggleSlabsModal()}
        modalTitle={"Slab Details"}
        modalSize="md"
      >
        <SlabsTermsModal
          isOpen={slabsModalState.showModal}
          toggle={() => toggleSlabsModal()}
          modalTitle={"Slab Details"}
          instituteId={"1"}
          instituteName={""}
          slabTermId={slabsModalState.slabTermId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-slabs-terms-modal"
        isOpen={delSlabTermModalState.showModal}
        confirmMessage="Are you sure you want to delete this Slab ?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default SlabsTerms;
