import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { ConfirmationModal } from "../../../Components/Common";
import { useModal } from "../../../hooks/modalhook";

import {
    currentCrmUser,
    readSavedReports,
    savedReportsChangedEvent,
    writeSavedReports,
    type ReportDefinition,
} from "./helper";
import ReportsLibrary from "./ReportsLibrary";
import ReportBuilder from "./ReportBuilder";

const Reports = () => {
    const [savedReports, setSavedReports] = useState<Array<ReportDefinition>>(() =>
        readSavedReports()
    );
    const [buildingReport, setBuildingReport] = useState<ReportDefinition | null>(null);
    const [isBuilding, setIsBuilding] = useState(false);

    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    useEffect(() => {
        const reload = () => setSavedReports(readSavedReports());

        window.addEventListener(savedReportsChangedEvent, reload);
        return () => window.removeEventListener(savedReportsChangedEvent, reload);
    }, []);

    const persist = useCallback((reports: Array<ReportDefinition>) => {
        writeSavedReports(reports);
        setSavedReports(reports);
    }, []);

    function createNewHndlr() {
        setBuildingReport(null);
        setIsBuilding(true);
    }

    function editHndlr(report: ReportDefinition) {
        setBuildingReport(report);
        setIsBuilding(true);
    }

    function saveHndlr(report: ReportDefinition, visibleToUserIds: Array<string>) {
        const user = currentCrmUser();

        const item: ReportDefinition = {
            ...report,
            id: buildingReport?.id || report.id || `report_${Date.now()}`,
            updatedAt: new Date().toISOString(),
            createdByUserId: buildingReport?.createdByUserId || user?.id,
            createdByName: buildingReport?.createdByName || user?.name || "",
            visibleToUserIds,
        };

        const existingIndex = savedReports.findIndex(existing => existing.id === item.id);

        persist(
            existingIndex >= 0
                ? savedReports.map(existing => (existing.id === item.id ? item : existing))
                : [item, ...savedReports]
        );

        toast.success("Report saved to the reports library");
        setBuildingReport(item);
    }

    function deleteHndlr(report: ReportDefinition) {
        persist(savedReports.filter(item => item.id !== report.id));
        toast.success("Report deleted");

        if (buildingReport?.id === report.id) {
            setBuildingReport(null);
            setIsBuilding(false);
        }
    }

    function reorderHndlr(report: ReportDefinition, direction: number) {
        const fromIndex = savedReports.findIndex(item => item.id === report.id);
        const toIndex = fromIndex + direction;

        if (fromIndex < 0 || toIndex < 0 || toIndex >= savedReports.length) {
            return;
        }

        const next = [...savedReports];
        [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
        persist(next);
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="CRM Reports" />

                {isBuilding ? (
                    <ReportBuilder
                        key={buildingReport?.id || "new"}
                        initialReport={buildingReport || undefined}
                        onBack={() => setIsBuilding(false)}
                        onSave={saveHndlr}
                        onDelete={deleteHndlr}
                    />
                ) : (
                    <ReportsLibrary
                        reports={savedReports}
                        onCreateNew={createNewHndlr}
                        onEdit={editHndlr}
                        onDelete={report => deleteOpenModal(report)}
                        onReorder={reorderHndlr}
                    />
                )}

                <ConfirmationModal
                    id="delete-saved-report-modal"
                    isOpen={deleteModalState.showModal}
                    iconType="reject"
                    confirmTitle="Delete saved report?"
                    confirmMessage={`"${deleteModalState.modalData?.title || "Untitled report"}" will be removed from the reports library.`}
                    cancelHndlr={deleteCloseModal}
                    confirmHndlr={() => {
                        deleteHndlr(deleteModalState.modalData);
                        deleteCloseModal();
                    }}
                    confirmBtnText="Delete report"
                />
            </div>
        </div>
    );
};

export default Reports;
