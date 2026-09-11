import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ModalContainerUpdated, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns } from './helper';
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as EmailSvg } from "../../../../assets/imagesdps/academics/EmailSvg.svg?react";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as CrossSvg } from "../../../../assets/imagesdps/academics/CrossSvg.svg?react";
import { shallowEqual } from 'react-redux';
import { exportSiblingVerifyListAct, getSiblingVerificationListAct, getSiblingVerificationListRecordsCount } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { toast } from 'react-toastify';
import ExportModal from '../../../Directory/StudentManagement/ExportModal';
import { downloadExcelFile } from '../../../../utility/commonutility';
import Button from '../../../../Components/Common/Button';

const initialState = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: ""
}
const ApprovedVerification = () => {
    const dispatch = useAppDispatch();

    const [applicationSaleFilter, setApplicationSaleFilter] = useState(initialState);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getsiblingverificationlistResp,
        exportSiblingVerifyListResp,
        showApiLoader
    } = useAppSelector(
        ({  instAcademics, branchAcademics, appData, globalData, applicationSale }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getsiblingverificationlistResp : applicationSale.getsiblingverificationlistResp,
            exportSiblingVerifyListResp : applicationSale.exportSiblingVerifyListResp,
            showApiLoader:globalData.showApiLoader,
        }),
        shallowEqual
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <EditSvg className="me-2 d-inline-block" fill='#878A99' />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    let itFormId = event.currentTarget.getAttribute('data-id');
                    //   toggleApproveRejectModal("APPROVED",itFormId);
                },
            },
            {
                id: "sendNotification",
                actionIcon: <EmailSvg className="me-2 d-inline-block" />,
                actionName: "Send Notification",
                onClickHndlr: (event: any) => {
                    let itFormId = event.currentTarget.getAttribute('data-id');
                    //   toggleApproveRejectModal("REJECTED",itFormId);
                },
            },
            {
                id: "print",
                actionIcon: <PrintSvg className="me-2 d-inline-block" stroke="#707070" />,
                actionName: "Print",
                onClickHndlr: (event: any) => {
                    let itFormId = event.currentTarget.getAttribute('data-id');
                    //   toggleApproveRejectModal("REJECTED",itFormId);
                },
            },
            {
                id: "generateReceipt",
                actionIcon: <EmailSvg className="me-2 d-inline-block" />,
                actionName: "Generate Receipt",
                onClickHndlr: (event: any) => {
                    let itFormId = event.currentTarget.getAttribute('data-id');
                    //   toggleApproveRejectModal("REJECTED",itFormId);
                },
            },
            {
                id: "sendPaymentLink",
                actionIcon: <EmailSvg className="me-2 d-inline-block" />,
                actionName: "Send Payment Link",
                onClickHndlr: (event: any) => {
                    let itFormId = event.currentTarget.getAttribute('data-id');
                    //   toggleApproveRejectModal("REJECTED",itFormId);
                },
            },
            {
                id: "cancelAdmission",
                actionIcon: <CrossSvg className="me-2 d-inline-block" />,
                actionName: "Cancel Admission",
                onClickHndlr: (event: any) => {
                    let itFormId = event.currentTarget.getAttribute('data-id');
                    //   toggleApproveRejectModal("REJECTED",itFormId);
                },
            },
            // {
            //   id: "download",
            //   actionIcon: <DownloadSvg fill="#cfcfcf"/>,
            //   actionName: "Download",
            //   onClickHndlr: (event:any) => {
            //     let itFormId=event.currentTarget.getAttribute('data-id');
            //     // toggleDownloadITFormModal(itFormId);
            //     dispatch(downloadItFormAct(generateActionPayload('download_it_form',{itFormId:itFormId})));
            //   },
            // },
        ],
        []
    );
    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const ApplicationSaleList = (otherProps?: any) => {
        let payload = { ...applicationSaleFilter, ...otherProps, branchId: branchId,approvedStatus:"APPROVED",...pagination.current, }

        if (payload.academicYearId) {
            dispatch(getSiblingVerificationListAct(generateActionPayload('get_sibling_verification_list', undefined, payload)))
        }
    }

    const approvalPendingRef=useRef({
        prevExportSiblingVerifyListResp:exportSiblingVerifyListResp
    })

   useEffect(()=>{
    const {prevExportSiblingVerifyListResp}=approvalPendingRef.current;

    if(exportSiblingVerifyListResp&&exportSiblingVerifyListResp!==prevExportSiblingVerifyListResp){
    toast.success('Approved Verification Data downloaded Successfully.');
        ApplicationSaleList();
        downloadExcelFile(exportSiblingVerifyListResp,"Sibling_Verification")
        SiblingsCountRecords()
        toggleExportExcelModal();
    }

    approvalPendingRef.current.prevExportSiblingVerifyListResp=exportSiblingVerifyListResp;
    
   },[exportSiblingVerifyListResp])
    const SiblingsCountRecords = (otherProps?:any)=>{
        const payload = {branchId ,...applicationSaleFilter, ...otherProps}
        dispatch(getSiblingVerificationListRecordsCount(generateActionPayload('get_sibling_verification_list_count',undefined,payload)))
    }

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : applicationSaleFilter?.academicYearId, curriculumId: applicationSaleFilter?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: applicationSaleFilter.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        SiblingsCountRecords({[name] : value})
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            setApplicationSaleFilter((prev:any) => ({ ...prev, [name]: value , classId : null,curriculumId : null }));
            ApplicationSaleList({ [name]: value, classId: null , curriculumId: null });
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ curriculumId: value,academicYearId:applicationSaleFilter.academicYearId});
            }
            else {
                dispatch(resetBrchClassAct(undefined));
            }
            ApplicationSaleList({ [name]: value, classId: null });
            setApplicationSaleFilter((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            setApplicationSaleFilter((prevState: any) => ({ ...prevState, [name]: value }));
            ApplicationSaleList({ [name]: value, });
        }
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            setApplicationSaleFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
            ApplicationSaleList({academicYearId:yearId})
            getCurriculumApiCall({academicYearId:yearId})
            SiblingsCountRecords({academicYearId : yearId})
        }
    }, [academicYearListResp]);

    const [exportConfirmationModal, setExportConfirmationModal] =
        useState({
            showModal: false,
            resultId: "",
        });
        const toggleExportExcelModal = (id?: any) => {
            setExportConfirmationModal((prevState: any) => ({
                ...prevState,
                showModal: !prevState.showModal,
                resultId: id || "",
            }));
        };

        
    const exportExcelHndler = ()=>{
        dispatch(exportSiblingVerifyListAct(generateActionPayload("export_sibling_verify_list",undefined, { ...applicationSaleFilter, branchId: branchId,approvedStatus:"APPROVED" },{
            responseType: 'blob'
        })));
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};
    const { content: siblingsVerificationList,pageble,totalElements,totalPages } = getsiblingverificationlistResp || {};

 function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        ApplicationSaleList(paginationInfo)
        // getSectionListResp(paginationInfo);
    }
    return (<>
        <div className="tw-inline-block tw-w-full tw-bg-white tw-rounded-lg tw-shadow">

            {/* Filters Row */}
            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-py-3">

                {/* Search */}
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                    <div className="tw-relative search-box">
                        <TextInput
                            name="searchString"
                            value={applicationSaleFilter.searchString}
                            onChange={ChangeHandler}
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search..."
                            labelText="Search"
                            floatingLabel
                        />
                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                </div>

                {/* Academic Year */}
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="academicYearId"
                        value={applicationSaleFilter.academicYearId}
                        onChange={ChangeHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                        floatingLabel
                    />
                </div>

                {/* Curriculum */}
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="curriculumId"
                        value={applicationSaleFilter.curriculumId}
                        onChange={ChangeHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        labelText="Curriculum"
                        floatingLabel
                    />
                </div>

                {/* Class */}
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="classId"
                        value={applicationSaleFilter.classId}
                        onChange={ChangeHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        formgroupClassName="tw-mb-0"
                        labelText="Class"
                        floatingLabel
                    />
                </div>

                {/* Export Button */}
                <div className="tw-col-span-12 lg:tw-col-span-3 tw-flex tw-justify-end tw-items-end">
                    <Button
                        onClick={toggleExportExcelModal}
                        variant='info'
                    >
                        <i className="ri-add-line"></i>
                        <span>Export</span>
                    </Button>
                </div>

            </div>

            {/* Table */}
            <TableContainer
                columns={roleColumns || []}
                data={siblingsVerificationList || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageble?.pageNumber || 0}
            />

        </div>
        <ModalContainerUpdated
           id="sibling-verification-approved"
           isOpen={exportConfirmationModal.showModal}
            toggle={toggleExportExcelModal}
            modalTitle="Export Sibling Approved Verification Data"
            modalSize="md"
        >
            <ExportModal
               isOpen={exportConfirmationModal.showModal}
                toggle={toggleExportExcelModal}
                instituteId={instituteId}
                branchId={branchId}
                submitHndlr={exportExcelHndler}
                feature="admission"
                subFeature="sibling_verification_approved"
                remarksText="Enter remarks to export sibling approved verification data?"
            />
        </ModalContainerUpdated>
        
    </>
    );
}

export default ApprovedVerification
