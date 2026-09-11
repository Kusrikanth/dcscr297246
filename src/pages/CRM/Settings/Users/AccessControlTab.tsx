import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import {
    Button,
    ConfirmationModal,
    InputCheckboxUpdated,
    SelectInput,
    TextInput,
} from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import { crmUsers } from "./helper";
import {
    accessPresets,
    accessRoles as sampleRoles,
    applyPresetToGrants,
    entriesUnder,
    permissionRegistry,
    scopeLabels,
    type AccessRole,
    type PermissionScreen,
} from "./accesscontrolhelper";
import { toast } from "react-toastify";

const scopeOptions = Object.entries(scopeLabels).map(([id, name]) => ({
    id,
    name,
}));

const AccessControlTab = () => {
    const [roles, setRoles] = useState<Array<AccessRole>>(sampleRoles);
    const [selectedRoleId, setSelectedRoleId] = useState<string>(
        sampleRoles[0]?.id || "",
    );
    const [grants, setGrants] = useState<Record<string, string>>({});
    const [baseline, setBaseline] = useState<Record<string, string>>({});
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [isAddingRole, setIsAddingRole] = useState<boolean>(false);
    const [newRoleName, setNewRoleName] = useState<string>("");
    const [assignUserId, setAssignUserId] = useState<string>("");

    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const selectedRole = useMemo(
        () => roles.find(role => role.id === selectedRoleId),
        [roles, selectedRoleId],
    );

    useEffect(() => {
        const role = sampleRoles.find(item => item.id === selectedRoleId);
        const current = roles.find(item => item.id === selectedRoleId);
        const saved = current?.grants || role?.grants || {};

        setGrants(saved);
        setBaseline(saved);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRoleId]);

    const isDirty = useMemo(
        () => JSON.stringify(grants) !== JSON.stringify(baseline),
        [baseline, grants],
    );

    const roleUsers = useMemo(
        () => crmUsers.filter(user => selectedRole?.userIds.includes(user.id)),
        [selectedRole],
    );

    const assignableUsers = useMemo(
        () => crmUsers.filter(user => !selectedRole?.userIds.includes(user.id)),
        [selectedRole],
    );

    const isGranted = (key: string) =>
        Object.prototype.hasOwnProperty.call(grants, key);

    const grantChangeHandler = (
        key: string,
        isOn: boolean,
        scope?: string,
    ) => {
        setGrants(current => {
            const next = { ...current };

            if (isOn) {
                next[key] = scope ?? next[key] ?? "all";
            } else {
                delete next[key];
            }

            return next;
        });
    };

    const presetHandler = (
        node: (typeof permissionRegistry)[number] | PermissionScreen | "all",
        preset: string,
    ) => {
        const targets =
            node === "all"
                ? permissionRegistry.flatMap(entriesUnder)
                : entriesUnder(node);

        setGrants(current => applyPresetToGrants(current, targets, preset));
    };

    const saveHandler = () => {
        if (!selectedRole) {
            return;
        }

        const added = Object.keys(grants).filter(key => !(key in baseline)).length;
        const removed = Object.keys(baseline).filter(key => !(key in grants))
            .length;

        setRoles(current =>
            current.map(role =>
                role.id === selectedRole.id ? { ...role, grants } : role,
            ),
        );
        setBaseline(grants);
        toast.success(`Saved: ${added} added, ${removed} removed`);
    };

    const createRoleHandler = () => {
        const name = newRoleName.trim();

        if (!name) {
            return;
        }

        const role: AccessRole = {
            id: `role-${Date.now()}`,
            name,
            description: "",
            isActive: true,
            isSuperAdmin: false,
            userIds: [],
            grants: {},
        };

        setRoles(current => [...current, role]);
        setSelectedRoleId(role.id);
        setNewRoleName("");
        setIsAddingRole(false);
        toast.success(`Role "${name}" created with no permissions`);
    };

    const cloneRoleHandler = () => {
        if (!selectedRole) {
            return;
        }

        const clone: AccessRole = {
            ...selectedRole,
            id: `role-${Date.now()}`,
            name: `${selectedRole.name} copy`,
            isSuperAdmin: false,
            userIds: [],
            grants: { ...grants },
        };

        setRoles(current => [...current, clone]);
        setSelectedRoleId(clone.id);
        toast.success(`Cloned "${selectedRole.name}"`);
    };

    const activeToggleHandler = () => {
        if (!selectedRole) {
            return;
        }

        setRoles(current =>
            current.map(role =>
                role.id === selectedRole.id
                    ? { ...role, isActive: !role.isActive }
                    : role,
            ),
        );
        toast.success(selectedRole.isActive ? "Role deactivated" : "Role activated");
    };

    const deleteRoleHandler = () => {
        if (!selectedRole) {
            return;
        }

        const remaining = roles.filter(role => role.id !== selectedRole.id);

        setRoles(remaining);
        setSelectedRoleId(remaining[0]?.id || "");
        deleteCloseModal();
        toast.success(`Deleted "${selectedRole.name}"`);
    };

    const memberChangeHandler = (userId: string, isAdding: boolean) => {
        if (!selectedRole || !userId) {
            return;
        }

        const user = crmUsers.find(item => item.id === userId);

        setRoles(current =>
            current.map(role =>
                role.id === selectedRole.id
                    ? {
                        ...role,
                        userIds: isAdding
                            ? [...role.userIds, userId]
                            : role.userIds.filter(id => id !== userId),
                    }
                    : role,
            ),
        );
        setAssignUserId("");
        toast.success(
            isAdding
                ? "Role assigned"
                : `Removed ${user?.name || "user"}`,
        );
    };

    const grantCount = Object.keys(grants).length;

    return (
        <>
            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="tw-flex tw-flex-wrap tw-items-end tw-justify-end tw-gap-2">
                        {isAddingRole ? (
                            <>
                                <div className="tw-w-full sm:tw-w-[260px]">
                                    <TextInput
                                        name="newRoleName"
                                        labelText="New Role Name"
                                        placeHolder="e.g. Admissions Lead"
                                        autoFocus
                                        maxLength={60}
                                        value={newRoleName}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>,
                                        ) => setNewRoleName(event.target.value)}
                                        formgroupClassName="tw-mb-0"
                                        helperText="Starts with no permissions"
                                        floatingLabel
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="primary"
                                    disabled={!newRoleName.trim()}
                                    onClick={createRoleHandler}
                                >
                                    Create
                                </Button>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setIsAddingRole(false);
                                        setNewRoleName("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="tw-w-full sm:tw-w-[280px]">
                                    <SelectInput
                                        name="selectedRoleId"
                                        labelText="Role"
                                        defaultSelect="Select a role…"
                                        value={selectedRoleId}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLSelectElement>,
                                        ) => setSelectedRoleId(event.target.value)}
                                        menuItems={roles.map(role => ({
                                            id: role.id,
                                            name: `${role.name}${role.isActive ? "" : " (inactive)"}`,
                                        }))}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => setIsAddingRole(true)}
                                >
                                    <i className="ri-add-line tw-me-1"></i>
                                    Add New Role
                                </Button>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                    title="Reload roles and permissions"
                                    aria-label="Reload roles and permissions"
                                    onClick={() => {
                                        setRoles(sampleRoles);
                                        setSelectedRoleId(sampleRoles[0]?.id || "");
                                        toast.success("Roles and permissions reloaded");
                                    }}
                                >
                                    <i className="ri-refresh-line"></i>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {!selectedRole ? (
                <div className="tw-card">
                    <div className="tw-card-body">
                        <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                            Select a role to configure its access.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="tw-card">
                    <div className="tw-card-body">
                        <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-3">
                            <div className="tw-min-w-0">
                                <p className="tw-mb-0 tw-flex tw-items-center tw-gap-2 tw-text-base tw-font-semibold tw-text-gray-800">
                                    {selectedRole.name}
                                    {selectedRole.isSuperAdmin && (
                                        <span className="badge badge-soft-success">
                                            <i className="ri-lock-line tw-me-1"></i>
                                            Protected
                                        </span>
                                    )}
                                </p>
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {roleUsers.length} user
                                    {roleUsers.length === 1 ? "" : "s"} · {grantCount}{" "}
                                    permission{grantCount === 1 ? "" : "s"}
                                    {selectedRole.description
                                        ? ` · ${selectedRole.description}`
                                        : ""}
                                </p>
                            </div>

                            {!selectedRole.isSuperAdmin && (
                                <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                                    <Button
                                        type="button"
                                        variant="hoverInfo"
                                        onClick={cloneRoleHandler}
                                    >
                                        <i className="ri-file-copy-line tw-me-1"></i>
                                        Clone
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="hoverInfo"
                                        onClick={activeToggleHandler}
                                    >
                                        {selectedRole.isActive ? "Deactivate" : "Activate"}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="wrong"
                                        title={`Delete ${selectedRole.name}`}
                                        aria-label={`Delete ${selectedRole.name}`}
                                        onClick={() => deleteOpenModal(selectedRole)}
                                    >
                                        <i className="ri-delete-bin-line"></i>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {selectedRole.isSuperAdmin ? (
                            <div className="alert alert-success tw-mb-0 tw-mt-3">
                                <strong>Super Admin has unrestricted access.</strong> Its
                                permissions are not editable and it cannot be deleted or
                                deactivated, so there is always a way back in if another
                                role is misconfigured.
                            </div>
                        ) : (
                            <>
                                <div className="tw-mt-3 tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-border-b tw-border-gray-200 tw-pb-3">
                                    <span className="tw-text-xs tw-font-semibold tw-text-gray-600">
                                        Apply to everything:
                                    </span>

                                    {accessPresets.map(preset => (
                                        <Button
                                            key={preset.key}
                                            type="button"
                                            variant="hoverInfo"
                                            onClick={() => presetHandler("all", preset.key)}
                                        >
                                            {preset.label}
                                        </Button>
                                    ))}

                                    <span className="tw-text-xs tw-text-gray-400">
                                        or set each row below
                                    </span>
                                </div>

                                <div className="tw-mt-3 tw-flex tw-flex-col tw-gap-2">
                                    {permissionRegistry.map(module => {
                                        const isOpen = !collapsed[module.module];
                                        const moduleEntries = entriesUnder(module);
                                        const grantedCount = moduleEntries.filter(entry =>
                                            isGranted(entry.key),
                                        ).length;

                                        return (
                                            <div
                                                key={module.module}
                                                className="tw-overflow-hidden tw-rounded tw-border tw-border-gray-200"
                                            >
                                                <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-px-3 tw-py-2">
                                                    <Button
                                                        type="button"
                                                        variant="sidebarMenu"
                                                        className="tw-text-gray-500"
                                                        aria-label={
                                                            isOpen ? "Collapse" : "Expand"
                                                        }
                                                        aria-expanded={isOpen}
                                                        onClick={() =>
                                                            setCollapsed(current => ({
                                                                ...current,
                                                                [module.module]: isOpen,
                                                            }))
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                isOpen
                                                                    ? "ri-arrow-down-s-line"
                                                                    : "ri-arrow-right-s-line"
                                                            }
                                                        ></i>
                                                    </Button>

                                                    <span className="tw-flex-1 tw-text-sm tw-font-semibold tw-text-gray-800">
                                                        {module.label}
                                                    </span>

                                                    <span className="tw-text-[11px] tw-text-gray-500">
                                                        {grantedCount}/{moduleEntries.length}
                                                    </span>

                                                    {accessPresets.map(preset => (
                                                        <Button
                                                            key={preset.key}
                                                            type="button"
                                                            variant="secondary"
                                                            className="!tw-px-1.5 !tw-py-0.5 tw-border tw-border-gray-200 !tw-bg-white !tw-text-[11px] tw-text-gray-700"
                                                            onClick={() =>
                                                                presetHandler(
                                                                    module,
                                                                    preset.key,
                                                                )
                                                            }
                                                        >
                                                            {preset.label}
                                                        </Button>
                                                    ))}
                                                </div>

                                                {isOpen && (
                                                    <div className="tw-divide-y tw-divide-gray-200">
                                                        {module.screens.map(screen => (
                                                            <div
                                                                key={screen.screen}
                                                                className="tw-px-3 tw-py-2"
                                                            >
                                                                <ActionRow
                                                                    label={screen.label}
                                                                    actions={screen.actions}
                                                                    grants={grants}
                                                                    isGranted={isGranted}
                                                                    onChange={
                                                                        grantChangeHandler
                                                                    }
                                                                />

                                                                {(screen.tabs || []).map(
                                                                    tab => (
                                                                        <div
                                                                            key={tab.tab}
                                                                            className="tw-ms-2 tw-border-s-2 tw-border-gray-200 tw-ps-3"
                                                                        >
                                                                            <ActionRow
                                                                                label={
                                                                                    tab.label
                                                                                }
                                                                                actions={
                                                                                    tab.actions
                                                                                }
                                                                                grants={grants}
                                                                                isGranted={
                                                                                    isGranted
                                                                                }
                                                                                onChange={
                                                                                    grantChangeHandler
                                                                                }
                                                                            />
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="tw-mt-4 tw-flex tw-items-center tw-gap-3 tw-border-t tw-border-gray-200 tw-pt-3">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        disabled={!isDirty}
                                        onClick={saveHandler}
                                    >
                                        Save Permissions
                                    </Button>

                                    {isDirty && (
                                        <span className="tw-text-xs tw-text-amber-700">
                                            Unsaved changes
                                        </span>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="tw-mt-5 tw-border-t tw-border-gray-200 tw-pt-4">
                            <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                                Users with this role ({roleUsers.length})
                            </p>

                            {roleUsers.length === 0 ? (
                                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                    Nobody has this role yet.
                                </p>
                            ) : (
                                <div className="tw-mb-3 tw-flex tw-flex-wrap tw-gap-2">
                                    {roleUsers.map(user => (
                                        <span
                                            key={user.id}
                                            className="tw-inline-flex tw-items-center tw-gap-1.5 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-px-2 tw-py-1 tw-text-xs tw-text-gray-700"
                                        >
                                            {user.name}
                                            <Button
                                                type="button"
                                                variant="sidebarMenu"
                                                className="tw-text-gray-400"
                                                title={`Remove ${user.name}`}
                                                aria-label={`Remove ${user.name}`}
                                                onClick={() =>
                                                    memberChangeHandler(user.id, false)
                                                }
                                            >
                                                <i className="ri-close-line"></i>
                                            </Button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="row tw-items-end tw-gap-y-2">
                                <div className="col-12 col-md-5 col-xl-4">
                                    <SelectInput
                                        name="assignUserId"
                                        defaultSelect="Assign a user…"
                                        value={assignUserId}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLSelectElement>,
                                        ) =>
                                            memberChangeHandler(
                                                event.target.value,
                                                true,
                                            )
                                        }
                                        menuItems={assignableUsers.map(user => ({
                                            id: user.id,
                                            name: user.name || user.email,
                                        }))}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="col-12 col-md-7 col-xl-8">
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        <i className="ri-user-add-line tw-me-1"></i>
                                        Assignment takes effect immediately.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                id="crm-settings-role-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete this role?"
                confirmMessage={`"${deleteModalState.modalData?.name}" will be removed and anyone holding it loses its access.`}
                noteMessage="This cannot be undone."
                confirmBtnText="Delete Role"
                confirmHndlr={deleteRoleHandler}
                cancelHndlr={deleteCloseModal}
            />
        </>
    );
};

const ActionRow = ({
    label,
    actions,
    grants,
    isGranted,
    onChange,
}: {
    label: string;
    actions: Array<{ key: string; action: string; isScoped: boolean }>;
    grants: Record<string, string>;
    isGranted: (key: string) => boolean;
    onChange: (key: string, isOn: boolean, scope?: string) => void;
}) => (
    <div className="tw-flex tw-flex-wrap tw-items-start tw-gap-3 tw-py-1.5">
        <span className="tw-w-40 tw-flex-shrink-0 tw-pt-1 tw-text-xs tw-text-gray-600">
            {label}
        </span>

        <div className="tw-flex tw-min-w-0 tw-flex-1 tw-flex-wrap tw-items-center tw-gap-3">
            {actions.map(entry => (
                <div
                    key={entry.key}
                    className="tw-inline-flex tw-items-center tw-gap-1.5 tw-text-xs"
                >
                    <InputCheckboxUpdated
                        name={entry.key}
                        formgroupClassName="tw-mb-0"
                        value={isGranted(entry.key)}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onChange(entry.key, event.target.checked)
                        }
                        labelName={
                            <span className="tw-capitalize tw-text-gray-700">
                                {entry.action}
                            </span>
                        }
                    />

                    {entry.isScoped && isGranted(entry.key) && (
                        <SelectInput
                            name={`${entry.key}-scope`}
                            value={grants[entry.key] || "all"}
                            onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                            ) => onChange(entry.key, true, event.target.value)}
                            menuItems={scopeOptions}
                            valueKey="id"
                            textKey="name"
                            hideSelectOption
                            inputClassName="form-select-sm tw-h-7 tw-py-0 tw-text-[11px]"
                            formgroupClassName="tw-mb-0 tw-w-[140px]"
                        />
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default AccessControlTab;
