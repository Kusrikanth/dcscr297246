import React, { useMemo, useEffect, useRef, useState, useCallback } from "react";
// import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns, branchData } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchModuleAct, updateBranchModuleAct } from "../../../store/mastersettings/branch/branchactions";
import { getMasterModuelAct } from "../../../store/masterdata/masterdataactions";


//Interface and Types
import { IModuleLevelProps, IModuleLevelRespRef } from "./moduleleveltypes";

const ModuleLevel: React.FC<IModuleLevelProps> = ({ instituteId, instituteName }) => {
    const [moduleListState, setModuleListState] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const { masterModuleResp, branchModulesResp, updateBranchModuleResp, branchErrorResp } = useAppSelector(({ masterData, branch }) => ({
        masterModuleResp: masterData.masterModuleResp,
        branchModulesResp: branch.branchModulesResp,
        updateBranchModuleResp: branch.updateBranchModuleResp,
        branchErrorResp: branch.branchErrorResp
    }), shallowEqual);

    useEffect(() => {
        dispatch(getMasterModuelAct(generateActionPayload("get_master_modules")));
        getBranchModulesApiCall();
    }, [instituteId]);

    const moduleLevelRespRef = useRef<IModuleLevelRespRef>({
        prevBranchModulesResp: branchModulesResp,
        prevUpdateBranchModuleResp: updateBranchModuleResp,
        prevBranchErrorResp: branchErrorResp
    });

    useEffect(() => {
        const { prevBranchModulesResp, prevUpdateBranchModuleResp, prevBranchErrorResp } = moduleLevelRespRef.current;
        if (Array.isArray(branchModulesResp) && prevBranchModulesResp !== branchModulesResp) {
            const modifiedData = branchModulesResp.map(item => {
                const { modulesResponse } = item,
                    branchModulesId = modulesResponse.filter((moduleItem: any) => moduleItem.mapped).map((item: any) => item.moduleId);
                return Object.assign({}, item, { branchModulesId });
            })
            setModuleListState(modifiedData);
        } else if (updateBranchModuleResp && updateBranchModuleResp !== prevUpdateBranchModuleResp) {
            toast.success("Branch module updated successfully.");
            getBranchModulesApiCall();
        } else if (branchErrorResp && branchErrorResp !== prevBranchErrorResp) {
            const { message }: any = branchErrorResp;
            toast.error(message);
        }
        moduleLevelRespRef.current.prevBranchModulesResp = branchModulesResp;
        moduleLevelRespRef.current.prevUpdateBranchModuleResp = updateBranchModuleResp;
        moduleLevelRespRef.current.prevBranchErrorResp = branchErrorResp;
    }, [branchModulesResp, updateBranchModuleResp, branchErrorResp]);

    function getBranchModulesApiCall() {
        const params = { instituteId };
        dispatch(getBranchModuleAct(generateActionPayload("get_branch_modules", params)));
    }

    const updateBranchModuleHndlr = useCallback((event: any, branchId: any) => {
        const moduleId = event.target.getAttribute("data-id");
        if (branchId && moduleId) {
            const { branchModulesId = [] } = moduleListState.find(item => item.branchId === branchId) || {},
                updateModuleId = [...branchModulesId],
                existingIndex = updateModuleId.findIndex(item => item === moduleId);
            if (existingIndex > -1) {
                updateModuleId.splice(existingIndex, 1);
            } else {
                updateModuleId.push(moduleId);
            }
            const payload: any = {
                branchId,
                modulesList: updateModuleId
            }
            dispatch(updateBranchModuleAct(generateActionPayload("update_branch_module", undefined, payload)));
        }

    }, [masterModuleResp, moduleListState]);

    const moduleColumns = useMemo(() => generateColumns(masterModuleResp, updateBranchModuleHndlr), [masterModuleResp, moduleListState]);
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200">
                <div className="tw-bg-gray-50 tw-rounded-t-lg tw-border-b tw-border-gray-200 tw-px-6 tw-py-4">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Module Lists</h4>
                </div>
                <div className="tw-p-0">
                    <TableContainer
                        columns={moduleColumns || []}
                        data={moduleListState}
                        divClass="table-responsive tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

export default ModuleLevel;