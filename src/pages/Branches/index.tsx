import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardHeader, CardBody, Row, Col, Button, Input } from "reactstrap";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../Components/Common";
import BreadCrumb from "../../Components/Common/BreadCrumb";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { useEffect, useRef } from "react";

//Action Generator
import { generateActionPayload } from "../../utility/reduxutility";
import { getInstBranchesAct, updateMainBranchAct, deleteBranchAct } from "../../store/mastersettings/branch/branchactions";
import { getInstituteListAct } from "../../store/mastersettings/instituteinfo/instituteinfoactions";

import { IBranchInfo } from "../../store/mastersettings/branch/branchtypes";
import { IOptionsHrtl } from "../../Components/Common/MenuOptions";
import { IPaginationState } from "../../Components/Common/Pagination";
import { generateColumns } from "./helper"

const Branches: React.FC<any> = ({ instituteId, instituteName }) => {
    const [addInstModalState, setAddInstModalState] = useState<any>({
        showModal: false,
        instituteId: ""
    });
    const [delInstModalState, setDelInstModalState] = useState<any>({
        showModal: false,
        instituteId: ""
    })
    const [viewInstituteState, setViewInstituteState] = useState<any>(undefined);
    const history = useHistory();
    const [branchState, setBranchState] = useState({
        isListMode: true
    });
    const [filterState, setFilterState] = useState({
        branchName: undefined
    });
    const dispatch = useAppDispatch();
    const { instituteListResp,branchListResp,currentInstIdResp, instInfoError } = useAppSelector(({ instituteInfo, branch,appData }) => ({
        instituteListResp: instituteInfo.instituteListResp,
        branchListResp:branch.branchListResp,
        currentInstIdResp:appData.currentInstIdResp,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);

    const instituteRespRef = useRef<any>({
        prevInstituteListResp: undefined,
        prevInstInfoError: instInfoError,
    });
    
    useEffect(() => {
      if(currentInstIdResp){
        getBranchApiCall({ instituteId: currentInstIdResp});
      }
    }, [currentInstIdResp])
    

    useEffect(() => {
        const { prevInstituteListResp, prevInstInfoError } = instituteRespRef.current;
        if (instituteListResp && prevInstituteListResp !== instituteListResp) {
            if (Array.isArray(instituteListResp?.data) && instituteListResp.data?.length > 0) {
                const instDetails = instituteListResp?.data[0];
                setViewInstituteState(instDetails);
            }
        } else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { details }: any = instInfoError;
            toast.error(details);
        }
        instituteRespRef.current.prevInstituteListResp = instituteListResp;
        instituteRespRef.current.prevInstInfoError = instInfoError;
    }, [instituteListResp, instInfoError]);


    function addBranchHndlr() {
        setAddInstModalState((prevState: any) => ({ ...prevState, showModal: true, instituteId: undefined, modalData: undefined }));
    }

    function editInstHandler(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id");
        let modalData: any = undefined;
        if (instituteId) {
            modalData = instituteListResp?.data?.find((item: any) => item.id === Number(instituteId));
        }
        if (modalData) {
            setAddInstModalState((prevState: any) => ({ ...prevState, showModal: true, instituteId, modalData }));
        }
    }

    function viewInstHndlr(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id");
        const findData = instituteListResp?.data?.find((item: any) => item.id === Number(instituteId));
        setViewInstituteState(findData);
    }

    const permissionsHndler = (event: any) => {
        history.push("/institute-branches/permissions")
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => {
        return ([ {
            id: "permissions",
            actionIcon: <i className={classnames("ri-lock-unlock-line text-primary fs-16 me-2")}></i>,
            actionName: "Permissions Info",
            onClickHndlr: permissionsHndler,
        }])
    }, [branchState.isListMode, instituteListResp]);

    function getBranchApiCall(otherProps?: any) {
            const payload = { ...filterState,instituteId: currentInstIdResp, ...otherProps };
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
    }

    function delModalCancelHndlr() {
        setDelInstModalState((prevState: any) => ({ ...prevState, showModal: false, instituteId: "" }));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        getBranchApiCall(paginationInfo);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getBranchApiCall({ "branchName": value });
    }

    function delModalSubmitHndlr() {
        const { instituteId } = delInstModalState;
        dispatch(deleteBranchAct(generateActionPayload("delete_branch", { instituteId })));
    }

    const branchColumns = useMemo(() => generateColumns(menuOptions), [instituteListResp]),
        { data: branchList, pageNumber, totalPages, totalElements } = branchListResp || {};
    return (
        <React.Fragment>

            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Institutions" pageTitle="DPS" />

                    <div className="row">
                        <div className="col-12">
                            <div className="card mb-0">
                                <div className="card-header">
                                    <h4 className="card-title mb-0 flex-grow-1">Branches</h4>
                                </div>
                                <CardHeader className="border-0 rounded">
                                    <Row>
                                        <div className="col-12 col-sm-4">
                                            <TextIconInput
                                                formgroupClassName="search-box"
                                                name="branchName"
                                                value={filterState.branchName}
                                                placeHolder="Search..."
                                                onChange={onChangeFilterHndlr}
                                            ><i className="ri-search-line search-icon"></i></TextIconInput>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <TableContainer
                                    columns={branchColumns}
                                    data={Array.isArray(branchList) ? branchList : []}
                                    divClass="table-responsive mb-1"
                                    theadClass="table-light text-muted align-middle"
                                    showPagination={true}
                                    totalPages={totalPages}
                                    totalRecords={totalElements}
                                    callbackPaginationHndlr={paginationHndlr}
                                    currentPageNumber={pageNumber}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment >
    )
}


export default Branches;
