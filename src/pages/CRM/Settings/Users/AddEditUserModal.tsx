import { useMemo, type ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    CustomSelect,
    InputCheckbox,
    InputCheckboxUpdated,
    RadioInputContainer,
    SelectInput,
    TextInput,
} from "../../../../Components/Common";
import {
    callerDeskGroups,
    callerDeskMembers,
    employeeMaster,
    getInitials,
    settingsBranches,
    settingsBusinessUnits,
    smartfloAgents,
    smartfloDepartments,
    type EmployeeOption,
} from "../helper";
import { crmRoles, userTypeOptions, type CrmUser } from "./helper";

interface AddEditUserModalProps {
    data?: CrmUser;
    toggle: () => void;
    onSave: (user: CrmUser, isNew: boolean) => void;
}

const phoneRule = /^[6-9][0-9]{9}$/;

const validationSchema = (isEdit: boolean) =>
    Yup.object().shape({
        userType: Yup.string().required(),

        employeeId: Yup.string().when("userType", {
            is: "employee",
            then: schema =>
                isEdit ? schema : schema.required("Employee is required"),
            otherwise: schema => schema,
        }),

        firstName: Yup.string().when("userType", {
            is: "external",
            then: schema => schema.trim().required("First name is required"),
            otherwise: schema => schema,
        }),

        lastName: Yup.string().when("userType", {
            is: "external",
            then: schema => schema.trim().required("Last name is required"),
            otherwise: schema => schema,
        }),

        phone: Yup.string().when("userType", {
            is: "external",
            then: schema =>
                schema.matches(phoneRule, {
                    message: "Enter a valid 10-digit mobile number starting 6-9",
                    excludeEmptyString: true,
                }),
            otherwise: schema => schema,
        }),

        email: Yup.string()
            .trim()
            .email("Enter a valid email address")
            .required("Login email is required"),

        password: isEdit
            ? Yup.string().test(
                "min-length",
                "Password must be at least 8 characters",
                value => !value || value.length >= 8,
            )
            : Yup.string()
                .min(8, "Password must be at least 8 characters")
                .required("Initial password is required"),

        roleName: Yup.string().required("Select a CRM role"),

        branchIds: Yup.array()
            .of(Yup.string())
            .min(1, "Assign at least one CRM branch"),

        callerdeskMemberId: Yup.string().when("callerdeskEnabled", {
            is: true,
            then: schema => schema.required("Select a CallerDesk member"),
            otherwise: schema => schema,
        }),

        smartfloAgentId: Yup.string().when("smartfloEnabled", {
            is: true,
            then: schema => schema.required("Select a Smartflo agent"),
            otherwise: schema => schema,
        }),
    });

const AddEditUserModal = ({ data, toggle, onSave }: AddEditUserModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            userType: data ? (data.employeeId ? "employee" : "external") : "employee",
            employeeId: data?.employeeId || "",
            firstName: data?.firstName || "",
            lastName: data?.lastName || "",
            phone: data?.phone || "",
            email: data?.email || "",
            password: "",
            roleName: data?.roles[0] || "COUNSELLOR",
            branchIds: data?.branchIds || ([] as Array<string>),
            businessUnitIds: data?.businessUnitIds || ([] as Array<string>),
            isActive: data ? data.isActive : true,
            callerdeskEnabled: data?.callerdeskEnabled || false,
            callerdeskMemberId: data?.callerdeskMemberId || "",
            callerdeskMemberName: data?.callerdeskMemberName || "",
            callerdeskMemberNumber: data?.callerdeskMemberNumber || "",
            callerdeskCallGroup: data?.callerdeskCallGroup || "",
            smartfloEnabled: data?.smartfloEnabled || false,
            smartfloAgentId: data?.smartfloAgentId || "",
            smartfloAgentName: data?.smartfloAgentName || "",
            smartfloAgentNumber: data?.smartfloAgentNumber || "",
            smartfloDepartmentId: data?.smartfloDepartmentId || "",
        },

        validationSchema: validationSchema(isEdit),

        onSubmit: values => {
            const employee = employeeMaster.find(
                item => item.id === values.employeeId,
            );

            const name =
                values.userType === "employee"
                    ? employee?.name || data?.name || ""
                    : `${values.firstName.trim()} ${values.lastName.trim()}`.trim();

            onSave(
                {
                    ...(data || ({} as CrmUser)),
                    id: data?.id || `user-${Date.now()}`,
                    name,
                    firstName:
                        values.userType === "external"
                            ? values.firstName.trim()
                            : name.split(" ")[0] || "",
                    lastName:
                        values.userType === "external"
                            ? values.lastName.trim()
                            : name.split(" ").slice(1).join(" "),
                    email: values.email.trim(),
                    phone: values.phone,
                    employeeId: values.userType === "employee" ? values.employeeId : "",
                    employeeNumber:
                        values.userType === "employee"
                            ? employee?.employeeNumber || data?.employeeNumber || ""
                            : "",
                    roles: [values.roleName],
                    branchIds: values.branchIds,
                    businessUnitIds: values.businessUnitIds,
                    isActive: values.isActive,
                    lastLoginAt: data?.lastLoginAt || "",
                    callerdeskEnabled: values.callerdeskEnabled,
                    callerdeskMemberId: values.callerdeskEnabled
                        ? values.callerdeskMemberId
                        : "",
                    callerdeskMemberName: values.callerdeskEnabled
                        ? values.callerdeskMemberName
                        : "",
                    callerdeskMemberNumber: values.callerdeskEnabled
                        ? values.callerdeskMemberNumber
                        : "",
                    callerdeskCallGroup: values.callerdeskEnabled
                        ? values.callerdeskCallGroup
                        : "",
                    smartfloEnabled: values.smartfloEnabled,
                    smartfloAgentId: values.smartfloEnabled ? values.smartfloAgentId : "",
                    smartfloAgentName: values.smartfloEnabled
                        ? values.smartfloAgentName
                        : "",
                    smartfloAgentNumber: values.smartfloEnabled
                        ? values.smartfloAgentNumber
                        : "",
                    smartfloDepartmentId: values.smartfloEnabled
                        ? values.smartfloDepartmentId
                        : "",
                },
                !isEdit,
            );

            toggle();
        },
    });

    const selectedEmployee = useMemo(
        () => employeeMaster.find(item => item.id === formik.values.employeeId),
        [formik.values.employeeId],
    );

    const isExistingLogin = Boolean(selectedEmployee?.userId);

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    const employeeChangeHandler = (employee: EmployeeOption) => {
        formik.setValues({
            ...formik.values,
            employeeId: employee.id,
            email: employee.loginEmail || "",
            branchIds:
                employee.employeeBranchId &&
                    !formik.values.branchIds.includes(employee.employeeBranchId)
                    ? [...formik.values.branchIds, employee.employeeBranchId]
                    : formik.values.branchIds,
        });
    };

    const userTypeChangeHandler = (userType: string) => {
        if (isEdit || userType === formik.values.userType) {
            return;
        }

        formik.setValues({
            ...formik.values,
            userType,
            employeeId: "",
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
        });
    };

    const toggleIdHandler = (
        field: "branchIds" | "businessUnitIds",
        id: string,
    ) => {
        const chosen = formik.values[field];

        formik.setFieldValue(
            field,
            chosen.includes(id)
                ? chosen.filter(value => value !== id)
                : [...chosen, id],
        );
    };

    const callerDeskMemberChangeHandler = (memberId: string) => {
        const member = callerDeskMembers.find(item => item.id === memberId);

        formik.setValues({
            ...formik.values,
            callerdeskMemberId: memberId,
            callerdeskMemberName: member?.name || "",
            callerdeskMemberNumber: member?.number || "",
        });
    };

    const smartfloAgentChangeHandler = (agentId: string) => {
        const agent = smartfloAgents.find(item => item.id === agentId);

        formik.setValues({
            ...formik.values,
            smartfloAgentId: agentId,
            smartfloAgentName: agent?.name || "",
            smartfloAgentNumber: agent?.number || "",
        });
    };

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    User identity and login
                </p>

                <div className="row">
                    <div className="col-12">
                        <p className="tw-mb-1 tw-text-xs tw-font-medium tw-text-gray-600">
                            User source
                        </p>

                        <RadioInputContainer
                            name="userType"
                            radioOptions={userTypeOptions}
                            value={formik.values.userType}
                            isDisabled={isEdit}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                userTypeChangeHandler(event.target.value)
                            }
                            inputContainerClassName="tw-flex-wrap tw-gap-3"
                        />
                    </div>

                    {formik.values.userType === "employee" ? (
                        <div className="col-12">
                            <CustomSelect
                                name="employeeId"
                                idKey="id"
                                searchKey="name"
                                labelText="Employee"
                                labelClass="required"
                                defaultSelect="Search employee name or number…"
                                containerClassName="tw-mb-3"
                                isDisabled={isEdit}
                                value={formik.values.employeeId}
                                options={employeeMaster}
                                onChange={employeeChangeHandler}
                                renderValue={(employee?: EmployeeOption) =>
                                    employee
                                        ? `${employee.name} · ${employee.employeeNumber}`
                                        : ""
                                }
                                renderOptions={(employee: EmployeeOption) => (
                                    <div className="tw-flex tw-items-center tw-gap-2">
                                        <span className="tw-grid tw-h-7 tw-w-7 tw-place-items-center tw-rounded-full tw-bg-[#eef1f7] tw-text-[10px] tw-font-semibold tw-text-[#405189]">
                                            {getInitials(employee.name)}
                                        </span>

                                        <span className="tw-min-w-0">
                                            <span className="tw-block tw-text-sm tw-text-gray-800">
                                                {employee.name}
                                            </span>
                                            <span className="tw-block tw-text-xs tw-text-gray-500">
                                                {employee.employeeNumber} ·{" "}
                                                {employee.employeeBranch ||
                                                    "No employee branch"}
                                                {employee.userId ? " · Existing login" : ""}
                                            </span>
                                        </span>
                                    </div>
                                )}
                                invalid={errorFor("employeeId") ? true : false}
                                error={errorFor("employeeId")}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="firstName"
                                    labelText="First Name"
                                    labelClass="required"
                                    placeHolder="Enter first name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    maxLength={60}
                                    invalid={errorFor("firstName") ? true : false}
                                    error={errorFor("firstName")}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="lastName"
                                    labelText="Last Name"
                                    labelClass="required"
                                    placeHolder="Enter last name"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    maxLength={60}
                                    invalid={errorFor("lastName") ? true : false}
                                    error={errorFor("lastName")}
                                />
                            </div>

                            <div className="col-12">
                                <TextInput
                                    name="phone"
                                    labelText="Phone"
                                    placeHolder="10-digit mobile number"
                                    value={formik.values.phone}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        formik.setFieldValue(
                                            "phone",
                                            event.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 10),
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    maxLength={10}
                                    invalid={errorFor("phone") ? true : false}
                                    error={errorFor("phone")}
                                />
                            </div>
                        </>
                    )}

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="email"
                            labelText="Login Email"
                            labelClass="required"
                            placeHolder="name@digitalcampus.in"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isDisabled={
                                isEdit ||
                                (formik.values.userType === "employee" && isExistingLogin)
                            }
                            invalid={errorFor("email") ? true : false}
                            error={errorFor("email")}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="password"
                            inputType="password"
                            labelText={
                                isEdit || isExistingLogin
                                    ? "New Password (optional)"
                                    : "Initial Password"
                            }
                            labelClass={isEdit || isExistingLogin ? "" : "required"}
                            placeHolder={
                                isEdit || isExistingLogin
                                    ? "Leave blank to keep the current password"
                                    : "Minimum 8 characters"
                            }
                            autoComplete="new-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("password") ? true : false}
                            error={errorFor("password")}
                        />
                    </div>

                    {formik.values.userType === "external" && (
                        <div className="col-12">
                            <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                                <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                    Standalone CRM login
                                </p>
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    This user is not added to the employee master. Their
                                    access is limited to the CRM role and branches
                                    configured below.
                                </p>
                            </div>
                        </div>
                    )}

                    {formik.values.userType === "employee" && selectedEmployee && (
                        <div className="col-12">
                            <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                                <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                    {isExistingLogin
                                        ? "Existing Attendance login"
                                        : "New shared login"}
                                </p>
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {isExistingLogin
                                        ? "The current email and password remain unchanged unless a new password is entered."
                                        : "A shared Attendance/CRM login will be created for this employee."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <p className="tw-mb-2 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    CRM user status
                </p>

                <RadioInputContainer
                    name="isActive"
                    radioOptions={[
                        {
                            id: "active",
                            name: "Active",
                            description:
                                "User can sign in and access assigned CRM branches.",
                        },
                        {
                            id: "inactive",
                            name: "Inactive",
                            description:
                                "CRM access is paused; assignments and Attendance access remain unchanged.",
                        },
                    ]}
                    value={formik.values.isActive ? "active" : "inactive"}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        formik.setFieldValue(
                            "isActive",
                            event.target.value === "active",
                        )
                    }
                    inputContainerClassName="tw-flex-wrap tw-gap-3"
                />

                <p className="tw-mb-1 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    CallerDesk one-click calling
                </p>
                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                    Map this CRM user to a member returned by the connected CallerDesk
                    account.
                </p>

                <InputCheckbox
                    name="callerdeskEnabled"
                    labelName="Enable one-click calling for this user"
                    value={formik.values.callerdeskEnabled}
                    onChange={formik.handleChange}
                />

                {formik.values.callerdeskEnabled && (
                    <div className="row tw-mt-2">
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="callerdeskMemberId"
                                labelText="CallerDesk Member"
                                labelClass="required"
                                defaultSelect="Select member"
                                value={formik.values.callerdeskMemberId}
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>,
                                ) => callerDeskMemberChangeHandler(event.target.value)}
                                onBlur={formik.handleBlur}
                                menuItems={callerDeskMembers.map(member => ({
                                    id: member.id,
                                    name: `${member.name} · ${member.number}`,
                                }))}
                                valueKey="id"
                                textKey="name"
                                invalid={errorFor("callerdeskMemberId") ? true : false}
                                error={errorFor("callerdeskMemberId")}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="callerdeskCallGroup"
                                labelText="Call Group"
                                defaultSelect="Use branch/account default group"
                                value={formik.values.callerdeskCallGroup}
                                onChange={formik.handleChange}
                                menuItems={callerDeskGroups}
                                valueKey="name"
                                textKey="name"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <TextInput
                                name="callerdeskMemberName"
                                labelText="Member Name"
                                value={formik.values.callerdeskMemberName}
                                onChange={undefined}
                                isReadOnly
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <TextInput
                                name="callerdeskMemberNumber"
                                labelText="Member Number"
                                value={formik.values.callerdeskMemberNumber}
                                onChange={undefined}
                                isReadOnly
                            />
                        </div>
                    </div>
                )}

                <p className="tw-mb-1 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Tata Smartflo one-click calling
                </p>
                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                    Map this CRM user to an agent returned by the connected Tata Smartflo
                    account.
                </p>

                <InputCheckbox
                    name="smartfloEnabled"
                    labelName="Enable Smartflo one-click calling for this user"
                    value={formik.values.smartfloEnabled}
                    onChange={formik.handleChange}
                />

                {formik.values.smartfloEnabled && (
                    <div className="row tw-mt-2">
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="smartfloAgentId"
                                labelText="Smartflo User / Agent"
                                labelClass="required"
                                defaultSelect="Select Smartflo user"
                                value={formik.values.smartfloAgentId}
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>,
                                ) => smartfloAgentChangeHandler(event.target.value)}
                                onBlur={formik.handleBlur}
                                menuItems={smartfloAgents.map(agent => ({
                                    id: agent.id,
                                    name: `${agent.name} · ${agent.number}`,
                                }))}
                                valueKey="id"
                                textKey="name"
                                invalid={errorFor("smartfloAgentId") ? true : false}
                                error={errorFor("smartfloAgentId")}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="smartfloDepartmentId"
                                labelText="Department"
                                defaultSelect="Use branch/account default department"
                                value={formik.values.smartfloDepartmentId}
                                onChange={formik.handleChange}
                                menuItems={smartfloDepartments}
                                valueKey="id"
                                textKey="name"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <TextInput
                                name="smartfloAgentName"
                                labelText="Agent Name"
                                value={formik.values.smartfloAgentName}
                                onChange={undefined}
                                isReadOnly
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <TextInput
                                name="smartfloAgentNumber"
                                labelText="Agent Number"
                                value={formik.values.smartfloAgentNumber}
                                onChange={undefined}
                                isReadOnly
                            />
                        </div>
                    </div>
                )}

                <p className="tw-mb-2 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                    CRM role
                </p>

                <RadioInputContainer
                    name="roleName"
                    formgroupClassName="tw-mb-1"
                    radioOptions={crmRoles.map(role => ({
                        id: role.name,
                        name: role.displayName,
                        description: role.description,
                    }))}
                    value={formik.values.roleName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        formik.setFieldValue("roleName", event.target.value)
                    }
                    inputContainerClassName="tw-flex-wrap tw-gap-3"
                />

                {errorFor("roleName") && (
                    <p className="tw-mb-0 tw-text-xs tw-text-danger">
                        {errorFor("roleName")}
                    </p>
                )}

                {settingsBusinessUnits.length > 1 && (
                    <>
                        <p className="tw-mb-1 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                            Business unit access
                        </p>
                        <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                            Which businesses this user can work in. The first selected one
                            is where the CRM opens for them.
                        </p>

                        <div className="tw-mb-1 tw-grid tw-gap-2 md:tw-grid-cols-3">
                            {settingsBusinessUnits.map(unit => (
                                <div
                                    key={unit.id}
                                    className={`tw-rounded tw-border tw-p-2.5 ${formik.values.businessUnitIds.includes(unit.id)
                                        ? "tw-border-[#405189] tw-bg-[#eef1f7]"
                                        : "tw-border-gray-200 tw-bg-white"
                                        }`}
                                >
                                    <InputCheckboxUpdated
                                        name={`businessUnit-${unit.id}`}
                                        formgroupClassName="tw-mb-0"
                                        value={formik.values.businessUnitIds.includes(
                                            unit.id,
                                        )}
                                        onChange={() =>
                                            toggleIdHandler("businessUnitIds", unit.id)
                                        }
                                        labelName={
                                            <span className="tw-min-w-0">
                                                <span className="tw-block tw-text-sm tw-text-gray-800">
                                                    {unit.name}
                                                </span>
                                                <span className="tw-block tw-text-xs tw-text-gray-500">
                                                    {unit.industryType}
                                                </span>
                                            </span>
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <p className="tw-mb-1 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                    CRM branch access <span className="tw-text-danger">*</span>
                </p>
                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                    These assignments affect only CRM data access.
                </p>

                <div className="tw-grid tw-gap-2 md:tw-grid-cols-3">
                    {settingsBranches.map(branch => (
                        <div
                            key={branch.id}
                            className={`tw-rounded tw-border tw-p-2.5 ${formik.values.branchIds.includes(branch.id)
                                ? "tw-border-[#405189] tw-bg-[#eef1f7]"
                                : "tw-border-gray-200 tw-bg-white"
                                }`}
                        >
                            <InputCheckboxUpdated
                                name={`branch-${branch.id}`}
                                formgroupClassName="tw-mb-0"
                                value={formik.values.branchIds.includes(branch.id)}
                                onChange={() => toggleIdHandler("branchIds", branch.id)}
                                labelName={
                                    <span className="tw-min-w-0">
                                        <span className="tw-block tw-text-sm tw-text-gray-800">
                                            {branch.name}
                                        </span>
                                        <span className="tw-block tw-text-xs tw-text-gray-500">
                                            {branch.shortName}
                                        </span>
                                    </span>
                                }
                            />
                        </div>
                    ))}
                </div>

                {errorFor("branchIds") && (
                    <p className="tw-mb-0 tw-mt-1 tw-text-xs tw-text-danger">
                        {errorFor("branchIds")}
                    </p>
                )}
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save Access" : "Add CRM User"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditUserModal;
