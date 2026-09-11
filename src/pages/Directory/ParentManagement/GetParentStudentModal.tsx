import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
//Component
import TableContainer from "../../../Components/Common/TableContainer";
//Custom Hooks
import { useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getStudentsListAct, getParentChildrensAct
} from "../../../store/directory/studentmanagement/studentmanagementactions";
//
import { generateStudentModalColumns } from "./helper";
//Utility
import { searhWithTextInList, debounce } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";



export default function GetParentStudentModal({
    branchId, instituteId, parentId, academicYearId, dispatch, closeModalHndlr
}: any) {
    const [searchStudentState, setSearchStudentState] = useState("");
    const [childrenListState, setChildrenListState] = useState<any>([]);

    const { parentChildrensResp } =
        useAppSelector(({ directoryStudent }) => ({
            parentChildrensResp: directoryStudent.parentChildrensResp
        }), shallowEqual);

    const parentChildrenRespRef = useRef({
        prevParentChildrensResp: parentChildrensResp
    });

    useEffect(() => {
        const { prevParentChildrensResp } = parentChildrenRespRef.current;
        if (parentChildrensResp && prevParentChildrensResp !== parentChildrenRespRef) {
            if (Array.isArray(parentChildrensResp)) {
                setChildrenListState(parentChildrensResp);
            }
        }
        parentChildrenRespRef.current.prevParentChildrensResp = parentChildrensResp;
    }, [parentChildrensResp]);
    useEffect(() => {
        if (parentId) {
            const params = {
                parentId, instituteId, academicYearId
            };
            dispatch(getParentChildrensAct(generateActionPayload("get_parent_childrens", undefined, params)));
        }
    }, [branchId, parentId]);

    function searchStudentByNameHndlr(searchValue: any) {
        if (Array.isArray(parentChildrensResp) && searchValue) {
            const filterAvailableStudent = searhWithTextInList(parentChildrensResp, "childName", searchValue);
            setChildrenListState(filterAvailableStudent);
        } else if (Array.isArray(parentChildrensResp)) {
            setChildrenListState(parentChildrensResp);
        }
    }
    const debouncedHandler = useCallback(debounce(searchStudentByNameHndlr, 200), [parentChildrensResp]);
    function onSearchHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event,
            { value } = target;
        setSearchStudentState(value);
        debouncedHandler(value);
    }
    const studentColumns = useMemo(() => generateStudentModalColumns(), [parentChildrensResp]);
    return (
        <div className="tw-w-full">
            <div className="tw-flex tw-flex-col">

                {/* Table */}
                <div className="tw-w-full tw-mt-2 tw-px-0">
                    <TableContainer
                        columns={studentColumns}
                        data={Array.isArray(childrenListState) ? childrenListState : []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        tableClass="tw-min-w-full"
                        theadClass="tw-bg-gray-100 tw-text-gray-500"
                        showPagination={false}
                    />
                </div>

                {/* Footer Actions */}
                <div className="tw-w-full tw-px-3 tw-py-3 tw-flex tw-justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={closeModalHndlr}
                    >
                        Close
                    </Button>
                </div>

            </div>
        </div>

    )
}