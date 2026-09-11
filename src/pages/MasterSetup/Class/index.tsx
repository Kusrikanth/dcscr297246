import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../Components/Common";
import { generateColumns } from "./helper";

//Modal Component
import AddClassModal from "./AddClassModal";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstClassAct, deleteInstClassAct } from "../../../store/mastersettings/instacademics/instacademicactions";
//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";

//Interface & Types
import { IClassProps } from "./classtypes";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import Button from "../../../Components/Common/Button";

const Class: React.FC<IClassProps> = ({ instituteId, instituteName }) => {
    const [classModalState, setClassModalState] = useState<any>({
        showModal: false, classId: "", modalData: undefined
    });
    const [delClassModalState, setDelClassModalState] = useState<any>({
        showModal: false,
        classId: ""
    })
    const [filterState, setFilterState] = useState<any>({
        className: undefined
    });
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingDetailRef = useRef<any>(undefined);


    const dispatch = useAppDispatch();
    const { instClassResp, deleteClassResp, instAcademicErrorResp } = useAppSelector(({ instAcademics }) => ({
        instClassResp: instAcademics.instClassResp,
        deleteClassResp: instAcademics.deleteClassResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp
    }), shallowEqual);

    const classRespRef = useRef<any>({
        prevDeleteClassResp: deleteClassResp,
        prevInstAcademicErrorResp: instAcademicErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            getClassApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteClassResp, prevInstAcademicErrorResp } = classRespRef.current;
        if (deleteClassResp && prevDeleteClassResp !== deleteClassResp) {
            setDelClassModalState((prevState: any) => ({ ...prevState, showModal: false }));
            getClassApiCall();
            toast.success("Class deleted successfully.")
        } else if (instAcademicErrorResp && instAcademicErrorResp !== prevInstAcademicErrorResp) {
            const { details }: any = instAcademicErrorResp;
            toast.error(details || "Something went wrong");
        }
        classRespRef.current.prevDeleteClassResp = deleteClassResp;
        classRespRef.current.prevInstAcademicErrorResp = instAcademicErrorResp;
    }, [deleteClassResp, instAcademicErrorResp]);

    const toggleClassModal = useCallback((apiCall?: boolean) => {
        setClassModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getClassApiCall();
        }
    }, [instituteId, instClassResp]);

    function addClassHndlr() {
        setClassModalState((prevState: any) => ({ ...prevState, showModal: true, classId: "", modalData: undefined }));
    }

    function editClassHndlr(event: any) {
        const classId = Number(event.currentTarget.getAttribute("data-id")),
            modalData: any = instClassResp?.data.find((item: any) => item.instituteClassId === classId);
        if (modalData) {
            setClassModalState((prevState: any) => ({ ...prevState, showModal: true, classId, modalData }));
        }
    }

    function deleteClassHndlr(event: any) {
        const classId = event.currentTarget.getAttribute("data-id");
        if (classId)
            setDelClassModalState((prevState: any) => ({ ...prevState, showModal: true, classId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: editClassHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: deleteClassHndlr
    }]), [instClassResp]);

    function delModalCancelHndlr() {
        setDelClassModalState((prevState: any) => ({ ...prevState, showModal: false, classId: "" }));
    }
    function delModalSubmitHndlr() {
        const { classId } = delClassModalState,
            params = { classId };
        dispatch(deleteInstClassAct(generateActionPayload("delete_inst_class", params)));
    }
    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getClassApiCall();
    }

    function getClassApiCall(otherProps?: any) {
        const sortingParams = getSortingKeys(sortingDetailRef.current);
        const payload = {
            ...filterState, ...otherProps, instituteId, ...paginationDetailRef.current,
            ...sortingParams
        };
        dispatch(getInstClassAct(generateActionPayload("get_inst_class", undefined, payload)));
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getClassApiCall({ [name]: value });
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getClassApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }


    const classColumns = useMemo(() => generateColumns(menuOptions), [instClassResp]),
        { data: classList, pageNumber, totalPages, totalElements } = instClassResp || {};
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow">

                <div className="tw-px-4 tw-py-3 tw-border-b">
                    <div className="tw-flex tw-items-center">

                        <div className="tw-flex-1">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Class
                            </h4>
                        </div>

                        <div className="tw-ml-auto">
                            <Button
                            variant="primary"
                                onClick={addClassHndlr}
                            >
                                Add Class
                            </Button>
                        </div>

                    </div>
                </div>

                <div className="tw-p-0">

                    <div className="tw-px-3 tw-py-3">
                        <form onClick={e => e.preventDefault()}>
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                                <div className="tw-col-span-12 xl:tw-col-span-4">
                                    <TextIconInput
                                        formgroupClassName="search-box"
                                        name="className"
                                        value={filterState.className}
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                        onChange={onChangeFilterHndlr}
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </TextIconInput>
                                </div>

                            </div>
                        </form>
                    </div>

                    <TableContainer
                        columns={classColumns || []}
                        data={(Array.isArray(classList) && classList) || []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber}
                        manualSorting={true}
                        sortingHandler={sortingHandler}
                    />
                </div>
            </div>
            <ModalContainerUpdated
                id="add-class-admin"
                isOpen={classModalState.showModal}
                toggle={toggleClassModal}
                modalTitle={classModalState.classId ? "Edit Class" : "Add Class"}
                modalSize="lg"
            >
            <AddClassModal
                isOpen={classModalState.showModal}
                toggle={toggleClassModal}
                instituteId={instituteId}
                classId={classModalState.classId}
                editCurriculumData={classModalState.modalData}
            />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delClassModalState.showModal}
                confirmMessage="Are you sure you want to delete this class ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default Class;