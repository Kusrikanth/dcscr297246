import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateReportDetailsColumns, feeType } from './helper';
import TableContainer from '../../../../Components/Common/TableContainer';
import { exportStuConcessiondetailsAct, getStudentConcessionListAct } from '../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { useModal } from '../../../../hooks/modalhook';
import { ModalContainerUpdated } from '../../../../Components/Common';
import ExportModal from '../../../Directory/StudentManagement/ExportModal';
import { toast } from 'react-toastify';
import { downloadExcelFile } from '../../../../utility/commonutility';
import Button from '../../../../Components/Common/Button';

interface ModalData {
    slabFrom: string;
    slabTo: string;
    academicYearId: number;
    curriculumId: number;
    classId: number;
}

interface DetailReportModalProps {
    modalData: ModalData;
    toggle: () => void;
}

const DetailReportModal: React.FC<DetailReportModalProps> = ({ modalData, toggle }) => {

    const dispatch = useAppDispatch();
    const { closeModal: closeExportConfirmationModal, modalState: exportConfirmationModalState, openModal: openExportConfirmationModal } = useModal()
      const paginationRef = useRef({
        pageNo: 0,
        pageSize: 10
    })
    function getFeeConcessionReportApiCall (otherProps?: any) {
        const payload = {
            branchId,
            academicYearId: modalData?.academicYearId,
            curriculumId: modalData?.curriculumId,
            classId: modalData?.classId,
            slabFrom: modalData?.slabFrom,
            slabTo: modalData?.slabTo,
            ...paginationRef.current,
            ...otherProps,
        };
        dispatch(
            getStudentConcessionListAct(
                generateActionPayload("student_fee_concession_details", undefined, payload)
            )
        );
    }
    const exportModalHndler = () => {
        let payload = {
            academicYearId: modalData?.academicYearId,
            curriculumId: modalData?.curriculumId,
            classId: modalData?.classId,
            slabFrom: modalData?.slabFrom,
            slabTo: modalData?.slabTo,
            branchId: branchId,
        };
        dispatch(exportStuConcessiondetailsAct(generateActionPayload('student_fee_concession_details_export', undefined, { ...payload }, {
            responseType: 'blob'
        })))
    }
    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        branchClassResp,
        getStudentConcessionListResp,
        exportStuConcessionDetailsResp,
    } = useAppSelector(
        ({ instAcademics, branchAcademics, appData, masterFeeSettings }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            branchClassResp: branchAcademics.branchClassResp,
            getStudentConcessionListResp: masterFeeSettings.getStudentConcessionListResp,
            exportStuConcessionDetailsResp: masterFeeSettings.exportStuConcessionDetailsResp,
        }),
        shallowEqual
    );

      const StudentConcessionRef = useRef({
        prevExportStuConcessionDetailsResp: exportStuConcessionDetailsResp,
      })

   useEffect(() => {
     const { prevExportStuConcessionDetailsResp } = StudentConcessionRef.current || {};
     if (exportStuConcessionDetailsResp && exportStuConcessionDetailsResp !== prevExportStuConcessionDetailsResp) {
        downloadExcelFile(exportStuConcessionDetailsResp, "Concession_Details_List")
       toast.success("Concession Details Downloaded Successfully.")
       closeExportConfirmationModal();
     }
      StudentConcessionRef.current.prevExportStuConcessionDetailsResp = exportStuConcessionDetailsResp
   }, [exportStuConcessionDetailsResp])
   
    useEffect(() => {
        if (modalData?.academicYearId) {
            getFeeConcessionReportApiCall();

        }
    }, [modalData?.academicYearId]);

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        getFeeConcessionReportApiCall(paginationInfo);
    }

    const reportColumns = useMemo(() => generateReportDetailsColumns(), []);

    const { content: studentDetails, totalElements, totalPages, pageable } = getStudentConcessionListResp || {};

  return (
    <>
          <div className="tw-bg-white tw-rounded-lg tw-shadow">
              <div className="tw-border-b tw-px-4 tw-py-3">
                  <div className="tw-flex tw-items-center">
                      <div className="tw-flex-grow">
                          <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                              Student Concession Details
                          </h4>
                      </div>

                      <div className="tw-flex tw-items-center tw-gap-2">
                          <Button
                              id="export-btn"
                              variant='exportBtn'
                              onClick={openExportConfirmationModal}
                              
                          >
                              <img src={ExportIcon} alt="Export" className="tw-h-4 tw-w-4" />
                          </Button>

                          <UncontrolledTooltip placement="bottom" target="export-btn">
                              Export
                          </UncontrolledTooltip>

                          <button
                              type="button"
                              onClick={toggle}
                              aria-label="Close"
                              className="
            tw-w-8 tw-h-8
            tw-flex tw-items-center tw-justify-center
            tw-rounded-full
            tw-text-gray-400 hover:tw-text-gray-700
            hover:tw-bg-gray-100
            tw-transition
          "
                          >
                              ✕
                          </button>
                      </div>
                  </div>
              </div>

              {/* Body */}
              <div className="tw-p-0">
                  <TableContainer
                      columns={reportColumns}
                      data={Array.isArray(studentDetails) ? studentDetails : []}
                      tableClass="tw-mb-0"
                      divClass="tw-overflow-x-auto tw-mb-2"
                      theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                      paginationContainerClass="tw-px-3 tw-pt-0 tw-pb-2 tw-my-3"
                      showPagination={true}
                      totalPages={totalPages || 0}
                      totalRecords={totalElements || 0}
                      callbackPaginationHndlr={paginationHndlr}
                      currentPageNumber={pageable?.pageNumber || 0}
                  />
              </div>
          </div>



        <ModalContainerUpdated
        id="student-concession-export-modal"
        isOpen={exportConfirmationModalState.showModal}
        toggle={closeExportConfirmationModal}
        modalTitle="Export Concession Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportConfirmationModalState.showModal}
          toggle={closeExportConfirmationModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportModalHndler}
          feature="fee"
          subFeature="fee_concession"
          remarksText="Enter remarks to export Concession Data?"
        />
      </ModalContainerUpdated>
        </>   
  )
}

export default DetailReportModal