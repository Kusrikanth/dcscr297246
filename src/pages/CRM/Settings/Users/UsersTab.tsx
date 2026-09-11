import { useCallback, useMemo, useState, type MouseEvent } from "react";

import {
    Button,
    ModalContainerUpdated,
    TextIconInput,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../hooks/modalhook";
import AddEditUserModal from "./AddEditUserModal";
import {
    crmUsers as sampleUsers,
    generateUserColumns,
    type CrmUser,
} from "./helper";
import { toast } from "react-toastify";

interface PaginationState {
    pageNo: number;
    pageSize: number;
}

const initialPagination: PaginationState = { pageNo: 0, pageSize: 10 };

const UsersTab = () => {
    const [users, setUsers] = useState<Array<CrmUser>>(sampleUsers);
    const [searchString, setSearchString] = useState<string>("");
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);

    const { openModal, closeModal, modalState } = useModal();

    const paginatedUsers = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return users.slice(start, start + pagination.pageSize);
    }, [pagination, users]);

    const stats = useMemo(
        () => [
            {
                id: "total",
                label: "CRM users",
                value: users.length,
                icon: "ri-user-settings-line",
                tone: "tw-bg-[#eef1f7] tw-text-[#405189]",
            },
            {
                id: "active",
                label: "Active accounts",
                value: users.filter(user => user.isActive).length,
                icon: "ri-shield-check-line",
                tone: "tw-bg-emerald-50 tw-text-emerald-700",
            },
            {
                id: "counsellors",
                label: "Counsellors",
                value: users.filter(user => user.roles.includes("COUNSELLOR")).length,
                icon: "ri-key-2-line",
                tone: "tw-bg-amber-50 tw-text-amber-700",
            },
        ],
        [users],
    );

    const findUser = useCallback(
        (userId: string | null) => users.find(user => user.id === userId),
        [users],
    );

    const statusToggleHandler = (user: CrmUser) => {
        setUsers(current =>
            current.map(item =>
                item.id === user.id ? { ...item, isActive: !item.isActive } : item,
            ),
        );
        toast.success(`${user.name} marked ${user.isActive ? "inactive" : "active"}`);
    };

    const saveHandler = (user: CrmUser, isNew: boolean) => {
        setUsers(current =>
            isNew
                ? [user, ...current]
                : current.map(item => (item.id === user.id ? user : item)),
        );
        toast.success(isNew ? "CRM user added" : "CRM user access saved");
    };

    const searchChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSearchString(event.target.value);
    };

    const menuOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
                actionName: "Configure",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const user = findUser(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (user) {
                        openModal(user);
                    }
                },
            },
        ],
        [findUser, openModal],
    );

    const tableColumns = useMemo(
        () => generateUserColumns(menuOptions, statusToggleHandler),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [menuOptions, users],
    );

    return (
        <>
            <div className="row tw-mb-4 tw-gap-y-3">
                {stats.map(stat => (
                    <div key={stat.id} className="col-12 col-md-4">
                        <div className="tw-card tw-h-full">
                            <div className="tw-card-body tw-flex tw-items-center tw-gap-3">
                                <span
                                    className={`tw-grid tw-h-11 tw-w-11 tw-flex-shrink-0 tw-place-items-center tw-rounded-full ${stat.tone}`}
                                >
                                    <i className={`${stat.icon} tw-text-lg`}></i>
                                </span>

                                <div className="tw-min-w-0">
                                    <p className="tw-mb-0 tw-text-xl tw-font-semibold tw-text-gray-800">
                                        {stat.value}
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-4">
                            <TextIconInput
                                formgroupClassName="search-box tw-mb-0"
                                name="searchString"
                                labelText="Search"
                                value={searchString}
                                onChange={searchChangeHandler}
                                placeHolder="Search users, roles or branches…"
                                floatingLabel
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="col-12 col-md-6 col-xl-8">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => openModal()}
                                >
                                    <i className="ri-add-line tw-me-1"></i>
                                    Add CRM User
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-card">
                <div className="tw-card-body !tw-p-0">
                    <TableContainer
                        columns={tableColumns}
                        data={paginatedUsers}
                        tableClass="mb-0"
                        divClass="table-responsive mb-3"
                        theadClass="table-light text-muted align-middle"
                        showPagination
                        totalPages={Math.ceil(
                            users.length / pagination.pageSize,
                        )}
                        totalRecords={users.length}
                        currentPageNumber={pagination.pageNo}
                        pageSize={pagination.pageSize}
                        callbackPaginationHndlr={setPagination}
                    />
                </div>
            </div>

            <ModalContainerUpdated
                id="crm-settings-user"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={
                    modalState.modalData
                        ? `Configure ${modalState.modalData.name}`
                        : "Add CRM User"
                }
                modalSize="lg"
            >
                <AddEditUserModal
                    data={modalState.modalData}
                    toggle={closeModal}
                    onSave={saveHandler}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default UsersTab;
