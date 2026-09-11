import { Add01Icon, PencilEdit02Icon, StudentsIcon, TimeQuarter02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";

import AssignStudents from "./AssignStudents";
import ViewAssignStudents from "./ViewAssignStudents";
import { useMemo } from "react";
import ScheduleTypeModal from "./ScheduleTypeModal";
import { useModal } from "../../../../../../hooks/modalhook";
import { DropDownToggle, ModalContainerUpdated } from "../../../../../../Components/Common";

const AssignClassesSection = () => {
    const { closeModal: closeAssignStudentModal, modalState: assignStudentModalState, openModal: openAssignStudentsModal } = useModal();
    const { closeModal: closeViewAssignStudentModal, modalState: viewAssignStudentModalState, openModal: openViewAssignStudentsModal } = useModal();
    const { closeModal: closeManageScheduleModal, modalState: manageScheduleModalState, openModal: openManageScheduleModal } = useModal();
    const stats = [
        {
            title: "Assign Students & Examination Schedule",
            value: 80,
            subtitle: "Grace Period - 60min",
            assessmentName: "Assigned Classes",
            class: "X-A, X-B, XI-A",
            change: "Live monitoring active",
            bgColor: "#E8F0FE",
            overlayChildColor: "#CACBF0",
            circleColor: "rgb(202 216 246 / 25%)",
            borderColor: "#93C5FD", // light blue
            valueColor: "#2563EB",
            icon: "ri-bar-chart-line",
        }
    ];

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    const dummyClassSubjectList = [
        { cardName: "John Smith", shortName: "JS", color: "rgb(228, 169, 10)", bookColor: "rgb(255, 243, 211)" },
        { cardName: "Alice Johnson", shortName: "AJ", color: "rgb(253, 227, 222)", bookColor: "rgb(190, 29, 92)" },
        { cardName: "Raj Kumar", shortName: "RK", color: "rgb(216, 237, 249)", bookColor: "rgb(0, 126, 230)" }
    ]
    const dropDownOption = useMemo(() => [
        {
            id: "add-single-book",
            actionName: "Reschedule",
            actionIcon: <HugeiconsIcon icon={Add01Icon} className="me-2 text-muted" size={20} />,
            onClickHndlr: (event: any) => { openManageScheduleModal() }
        },
        {
            id: "upload-bulk-book",
            actionName: "Manage Students",
            actionIcon: <HugeiconsIcon icon={StudentsIcon} className="me-2 text-muted" size={18} />,
            onClickHndlr: (event: any) => { openViewAssignStudentsModal() }
        },
    ], [])
    return (
        <>
            <div className="row g-4 justify-content-center">
                {stats.map((stat, index) => (
                    <div className="col-md-12 mt-0 assessment-list" key={index}>
                        <div
                            className="card position-relative p-3 overflow-hidden"
                            style={{
                                backgroundColor: stat.bgColor,
                                borderTop: `4px solid ${stat.borderColor}`,
                                borderRadius: "10px",
                                boxShadow: `0px 4px 12px ${hexToRgba(stat.borderColor, 0.4)}`,
                            }}
                        >
                            <div
                                className="bg-white shadow-lg p-3 my-2 d-flex flex-column"
                                style={{ borderRadius: "10px", }}
                            >
                                {/* Title & edit button */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="fs-14 fw-bold">
                                        <div className="fs-14 fw-bold">
                                            {stat.assessmentName} -{" "}
                                            {stat.class.split(",").map((cls, idx) => (
                                                <span
                                                    key={idx}
                                                    className="badge text-uppercase bg-light text-muted p-2 me-1"
                                                >
                                                    {cls.trim()}
                                                </span>
                                            ))}
                                        </div>

                                    </div>
                                    <DropDownToggle
                                        id="book-collection-dropdown"
                                        menuOptions={dropDownOption}
                                        btnName="Manage"
                                        dropDownClassName="me-4 fs-12 py-0"
                                        toggleClassName="py-0"
                                        btnVariant="btn-outline-primary"
                                    />
                                </div>

                                {/* Subtitle */}


                                {/* Dates */}

                                <div className="d-flex mb-3 justify-content-between">
                                    <div className="d-grid my-1 g-2">
                                        <span>Start Date & Time</span>
                                        <span className="text-muted">14 Aug 2025 -  <HugeiconsIcon
                                            icon={TimeQuarter02Icon}
                                            className="text-muted ms-1"
                                            size={16}
                                        /> 10:00 AM</span>
                                    </div>
                                    <p className="mb-2 text-muted">{stat.subtitle}</p>
                                    <div className="d-grid fw-medium mb-1 g-2">
                                        <span>End Date & Time</span>
                                        <span className="text-muted">14 Aug 2025 - <HugeiconsIcon
                                            icon={TimeQuarter02Icon}
                                            className="text-muted ms-1"
                                            size={16}
                                        />14:00 PM</span>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div>
                                    <div
                                        className="progress"
                                        style={{
                                            height: "6px",
                                            backgroundColor: hexToRgba(stat.borderColor, 0.15),
                                        }}
                                    >
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: `${stat.value}%`,
                                                backgroundColor: stat.valueColor,
                                            }}
                                            aria-valuenow={stat.value}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        ></div>
                                    </div>
                                    <small className="text-muted mt-1 d-block mb-3">
                                        80/120 Assigned Students
                                    </small>
                                </div>

                                {/* Avatars + Add button */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="avatar-group d-flex">
                                        {dummyClassSubjectList.map((sub: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="avatar-group-item p-2"
                                                data-bs-toggle="tooltip"
                                                title={sub.cardName}
                                                style={{
                                                    backgroundColor: sub.color,
                                                    color: sub.bookColor,
                                                    borderRadius: "50%",
                                                    width: "36px",
                                                    height: "36px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {sub.shortName}
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className="badge rounded bg-success fs-12 p-2"
                                        id="ticket-priority"
                                    >
                                        Published
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={assignStudentModalState.showModal}
                toggle={() => closeAssignStudentModal()}
                modalTitle="Assign Students"
                modalSize="md"
            >
                <AssignStudents
                    toggle={closeAssignStudentModal}
                    id={assignStudentModalState.modalData}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={viewAssignStudentModalState.showModal}
                toggle={() => closeViewAssignStudentModal()}
                modalTitle="Manage Students"
                modalSize="lg"
            >
                <ViewAssignStudents
                    toggle={closeViewAssignStudentModal}
                    id={viewAssignStudentModalState.modalData}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={manageScheduleModalState.showModal}
                toggle={() => closeManageScheduleModal()}
                modalTitle="Manage Schedule"
                modalSize="md"
            >
                <ScheduleTypeModal
                    toggle={closeManageScheduleModal}
                    id={manageScheduleModalState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default AssignClassesSection;
