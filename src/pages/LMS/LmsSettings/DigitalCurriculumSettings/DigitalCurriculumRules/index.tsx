import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useEffect, useMemo, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { generateColumns } from "./helper";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { getDigitalCurriculumRulesListAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { useModal } from "../../../../../hooks/modalhook";
import { ModalContainerUpdated } from "../../../../../Components/Common";
import CurriculumRulesModal from "./CurriculumRulesModal";
import { toast } from "react-toastify";

const DigitalCurriculumRules = () => {
    const { openModal: openCurriculumRulesModal, closeModal: closeCurriculumRulesModal, modalState: curriculumRulesModalState } = useModal();

    const dispatch = useAppDispatch();

    const getDigitalCurriculumRulesListApiCall = () => {
        if (!branchId) return;
        const payload = { branchId };
        dispatch(
            getDigitalCurriculumRulesListAct(
                generateActionPayload(
                    "get_digital_curriculum_rules_list",
                    undefined,
                    payload
                )
            )
        );
    };

    const {
        currentBranchIdResp: branchId,
        showApiLoader,
        getDigitalCurriculumRulesListResp,
        saveDigitalCurriculumRulesResp,
        lmsSettingsErrorAct
    } = useAppSelector(
        ({ globalData, appData, lmsSettings }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getDigitalCurriculumRulesListResp: lmsSettings.getDigitalCurriculumRulesListResp,
            saveDigitalCurriculumRulesResp: lmsSettings.saveDigitalCurriculumRulesResp,
            lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
        }),
        shallowEqual
    );

    const academicYearDetailsRef = useRef({
        prevLmsSettingsErrorAct: lmsSettingsErrorAct,
        prevSaveCurriculumRUlesResp: saveDigitalCurriculumRulesResp,
    })

    useEffect(() => {
        const { prevLmsSettingsErrorAct, prevSaveCurriculumRUlesResp } = academicYearDetailsRef.current || {}
        if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
            const { details } = lmsSettingsErrorAct || {}
            toast.error(details || "Something went wrong")
        }
        else if (saveDigitalCurriculumRulesResp && prevSaveCurriculumRUlesResp !== saveDigitalCurriculumRulesResp) {
            if (curriculumRulesModalState.modalData) {
                toast.success("Academic Year Details Updated successfully")
            } else {
                toast.success("Academic Year Details Added successfully")
            }
            getDigitalCurriculumRulesListApiCall();
            closeCurriculumRulesModal();
        }
        academicYearDetailsRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
        academicYearDetailsRef.current.prevSaveCurriculumRUlesResp = saveDigitalCurriculumRulesResp;
    }, [lmsSettingsErrorAct, saveDigitalCurriculumRulesResp])

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: (
                    <HugeiconsIcon
                        icon={PencilEdit02Icon}
                        className="text-muted"
                        size={18}
                    />
                ),
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const rowId = Number(event.currentTarget.getAttribute("data-id"));
                    const rowData = getDigitalCurriculumRulesListResp?.find(
                        (item: any) => item.id === rowId
                    );
                    if (!rowData) return;
                    openCurriculumRulesModal(rowData);
                }
            },
        ],
        [getDigitalCurriculumRulesListResp]
    );

    useEffect(() => {
        if (branchId) {
            getDigitalCurriculumRulesListApiCall();
        }
    }, [branchId]);

    const columns = useMemo(() => generateColumns(menuOptions), [getDigitalCurriculumRulesListResp]);

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-6">
                            <h4 className="card-title mb-0 flex-grow-1">Curriculum Levels</h4>
                        </div>
                        <div className="col-auto ms-auto">
                            <div className="d-flex">
                                <button
                                    className="btn btn-success float-end d-flex align-items-center"
                                    onClick={() => openCurriculumRulesModal()}
                                >
                                    <HugeiconsIcon
                                        icon={PlusSignIcon}
                                        className="me-2"
                                        size={18}
                                    />
                                    Add New
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <TableContainer
                        columns={columns || []}
                        data={Array.isArray(getDigitalCurriculumRulesListResp) ? getDigitalCurriculumRulesListResp : []}
                        tableClass="mb-0"
                        divClass="table-responsive mb-0"
                        theadClass="table-light text-muted align-middle"
                        showPagination={false}
                    />
                </div>
            </div>
            <ModalContainerUpdated
                id="add-edit-difficulty-levels-modal"
                isOpen={curriculumRulesModalState.showModal}
                toggle={closeCurriculumRulesModal}
                modalTitle={
                    curriculumRulesModalState.modalData
                        ? "Edit Curriculum Rules"
                        : "Add Curriculum Rules"
                }
                modalSize="md"
            >
                <CurriculumRulesModal
                    toggle={closeCurriculumRulesModal}
                    id={curriculumRulesModalState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default DigitalCurriculumRules;
