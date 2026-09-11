import { useState, type MouseEvent } from "react";
import { useHistory } from "react-router-dom";

import {
    Button,
    ConfirmationModal,
    MenuOptionHrtl,
    ModalContainerUpdated,
    TextIconInput,
} from "../../../../Components/Common";
import type { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../hooks/modalhook";
import {
    settingsBusinessUnits as sampleUnits,
    type BusinessUnitOption,
} from "../helper";
import { configForUnit } from "../businessunitconfig";
import { withSettingsPage } from "../index";
import AddEditBusinessUnitModal from "./AddEditBusinessUnitModal";
import { toast } from "react-toastify";

const BusinessUnits = () => {
    const history = useHistory();

    const [units, setUnits] = useState<Array<BusinessUnitOption>>(sampleUnits);
    const [searchString, setSearchString] = useState<string>("");

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const findUnit = (unitId: string | null) =>
        units.find(unit => unit.id === unitId);

    const actionsListFor = (unit: BusinessUnitOption): Array<IOptionsHrtl> => [
        {
            id: "edit",
            actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
            actionName: "Edit Business Unit",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const selectedUnit = findUnit(
                    event.currentTarget.getAttribute("data-id"),
                );

                if (selectedUnit) {
                    openModal(selectedUnit);
                }
            },
        },
        {
            id: "delete",
            actionIcon: <i className="ri-delete-bin-line tw-text-danger"></i>,
            actionName: unit.isDefault ? "" : "Delete Business Unit",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const selectedUnit = findUnit(
                    event.currentTarget.getAttribute("data-id"),
                );

                if (selectedUnit && !selectedUnit.isDefault) {
                    deleteOpenModal(selectedUnit);
                }
            },
        },
    ];

    const saveHandler = (unit: BusinessUnitOption, isNew: boolean) => {
        setUnits(current =>
            isNew
                ? [...current, unit]
                : current.map(item => (item.id === unit.id ? unit : item)),
        );
        toast.success(isNew ? "Business unit added" : "Business unit saved");
    };

    const deleteHandler = () => {
        const unit: BusinessUnitOption | undefined = deleteModalState.modalData;

        if (!unit || unit.isDefault) {
            deleteCloseModal();
            return;
        }

        setUnits(current => current.filter(item => item.id !== unit.id));
        deleteCloseModal();
        toast.success(`${unit.name} deleted`);
    };

    return (
        <>
            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-4">
                            <TextIconInput
                                formgroupClassName="search-box tw-mb-0"
                                name="searchString"
                                labelText="Search"
                                value={searchString}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => setSearchString(event.target.value)}
                                placeHolder="Search business units…"
                                floatingLabel
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="col-12 col-md-6 col-xl-8">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                <span className="tw-text-sm tw-text-gray-500">
                                    {units.length} unit
                                    {units.length === 1 ? "" : "s"}
                                </span>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => openModal()}
                                >
                                    <i className="ri-add-line tw-me-1"></i>
                                    Add Business Unit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row tw-gap-y-3">
                {units.map(unit => {
                    const config = configForUnit(unit.id);

                    const counts = [
                        { label: "Lead fields", value: config.fields.length },
                        {
                            label: "Pipeline stages",
                            value: config.pipelineStages.length,
                        },
                        { label: "Branches", value: config.branches.length },
                        {
                            label: "Tracker statuses",
                            value: config.trackerStatuses.length,
                        },
                    ];

                    return (
                        <div key={unit.id} className="col-12 col-xl-6">
                            <div className="tw-card tw-h-full">
                                <div className="tw-card-body">
                                    <div className="tw-flex tw-items-start tw-gap-3">
                                        <span
                                            className="tw-grid tw-h-11 tw-w-11 tw-flex-shrink-0 tw-place-items-center tw-rounded tw-text-white"
                                            style={{ backgroundColor: unit.color }}
                                        >
                                            <i className="ri-building-2-line tw-text-lg"></i>
                                        </span>

                                        <div className="tw-min-w-0 tw-flex-1">
                                            <p className="tw-mb-0 tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {unit.name}

                                                {unit.isDefault && (
                                                    <span className="badge badge-soft-success">
                                                        Default
                                                    </span>
                                                )}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                {unit.industryType} ·{" "}
                                                {unit.leadCount.toLocaleString("en-IN")}{" "}
                                                records
                                            </p>
                                        </div>

                                        <div className="tw-flex-shrink-0">
                                            <MenuOptionHrtl
                                                actionOptions={actionsListFor(unit)}
                                                rowId={unit.id}
                                            />
                                        </div>
                                    </div>

                                    <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-text-gray-600">
                                        {unit.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="tw-mt-3 tw-grid tw-grid-cols-2 tw-gap-2 sm:tw-grid-cols-4">
                                        {counts.map(count => (
                                            <div
                                                key={count.label}
                                                className="tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-2 tw-text-center"
                                            >
                                                <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                                    {count.value}
                                                </p>
                                                <p className="tw-mb-0 tw-text-[11px] tw-text-gray-500">
                                                    {count.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="tw-mt-3 tw-flex tw-justify-end tw-border-t tw-border-gray-200 tw-pt-3">
                                        <Button
                                            type="button"
                                            variant="hoverInfo"
                                            onClick={() =>
                                                history.push(
                                                    `/business-units/${unit.id}`,
                                                )
                                            }
                                        >
                                            <i className="ri-settings-3-line tw-me-1"></i>
                                            Configure
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!units.length && (
                    <div className="col-12">
                        <div className="tw-card">
                            <div className="tw-card-body">
                                <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                                    No business units yet.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ModalContainerUpdated
                id="crm-settings-business-unit"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={
                    modalState.modalData
                        ? `Edit ${modalState.modalData.name}`
                        : "Add Business Unit"
                }
                modalSize="lg"
            >
                <AddEditBusinessUnitModal
                    data={modalState.modalData}
                    toggle={closeModal}
                    onSave={saveHandler}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-settings-business-unit-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete this business unit?"
                confirmMessage={`All unused configuration belonging to ${deleteModalState.modalData?.name} will be removed.`}
                noteMessage="Configuration still linked to a lead or tracker record is kept."
                confirmBtnText="Delete Unit"
                confirmHndlr={deleteHandler}
                cancelHndlr={deleteCloseModal}
            />
        </>
    );
};

const BusinessUnitsPage = withSettingsPage(BusinessUnits, "Business Units");

export default BusinessUnitsPage;
