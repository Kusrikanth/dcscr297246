import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    TextInput,
} from "../../../../Components/Common";
import { discoverablePages } from "./helper";

interface AddFacebookAccountModalProps {
    connectedPageIds: Array<string>;
    subscribedPageIds: Array<string>;
    toggle: () => void;
    onConnect: (
        accountName: string,
        pages: Array<{ pageId: string; name: string }>,
    ) => void;
}

const validationSchema = Yup.object().shape({
    accountToken: Yup.string()
        .trim()
        .required("Paste the user access token for the account to add"),
});

const AddFacebookAccountModal = ({
    connectedPageIds,
    subscribedPageIds,
    toggle,
    onConnect,
}: AddFacebookAccountModalProps) => {
    const [discovered, setDiscovered] = useState<
        | {
            accountName: string;
            pages: Array<{ pageId: string; name: string }>;
        }
        | undefined
    >();
    const [chosenPageIds, setChosenPageIds] = useState<Array<string>>([]);

    const formik = useFormik({
        initialValues: { accountToken: "" },

        validationSchema,

        onSubmit: () => {
            setDiscovered(discoverablePages);
            setChosenPageIds([]);
        },
    });

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    const isAllSelected = Boolean(
        discovered && chosenPageIds.length === discovered.pages.length,
    );

    const toggleAllHandler = () =>
        setChosenPageIds(
            isAllSelected
                ? []
                : (discovered?.pages || []).map(page => page.pageId),
        );

    const togglePageHandler = (pageId: string) =>
        setChosenPageIds(current =>
            current.includes(pageId)
                ? current.filter(item => item !== pageId)
                : [...current, pageId],
        );

    const connectHandler = () => {
        if (!discovered) {
            return;
        }

        onConnect(
            discovered.accountName,
            discovered.pages.filter(page =>
                chosenPageIds.includes(page.pageId),
            ),
        );
        toggle();
    };

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <TextInput
                name="accountToken"
                inputType="password"
                labelText="User Access Token"
                labelClass="required"
                placeHolder="EAAB…"
                autoComplete="off"
                autoFocus
                value={formik.values.accountToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={errorFor("accountToken") ? true : false}
                error={errorFor("accountToken")}
            />

            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                Needs <code>pages_show_list</code>,{" "}
                <code>pages_manage_metadata</code> and <code>leads_retrieval</code>.
                Used once to list that account&apos;s pages — it is never stored;
                only each page&apos;s own token is saved, encrypted.
            </p>

            <div className="tw-mt-3">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!formik.values.accountToken.trim()}
                >
                    <i className="ri-search-line"></i>
                    Find Pages
                </Button>
            </div>

            {discovered && (
                <div className="tw-mt-4 tw-border-t tw-border-gray-200 tw-pt-3">
                    <div className="tw-mb-2 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                        <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                            {discovered.accountName} · choose the pages to connect
                        </p>

                        <Button
                            type="button"
                            variant="linkBtn"
                            className="tw-p-0"
                            disabled={!discovered.pages.length}
                            onClick={toggleAllHandler}
                        >
                            {isAllSelected ? "Clear all" : "Select all"}
                        </Button>
                    </div>

                    {discovered.pages.length ? (
                        <div className="tw-flex tw-max-h-64 tw-flex-col tw-gap-2 tw-overflow-y-auto">
                            {discovered.pages.map(page => {
                                const isConnected = connectedPageIds.includes(
                                    page.pageId,
                                );
                                const isSubscribed = subscribedPageIds.includes(
                                    page.pageId,
                                );

                                return (
                                    <div
                                        key={page.pageId}
                                        className="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-px-3 tw-py-2"
                                    >
                                        <InputCheckbox
                                            name={`page-${page.pageId}`}
                                            labelName={page.name}
                                            value={chosenPageIds.includes(
                                                page.pageId,
                                            )}
                                            onChange={() =>
                                                togglePageHandler(page.pageId)
                                            }
                                            formgroupClassName="tw-mb-0"
                                        />

                                        <span className="tw-font-mono tw-text-xs tw-text-gray-500">
                                            {page.pageId}
                                        </span>

                                        {isConnected && (
                                            <span className="badge badge-soft-primary tw-ms-auto">
                                                {isSubscribed
                                                    ? "Connected"
                                                    : "Added, not subscribed"}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                            This token can see no pages.
                        </p>
                    )}
                </div>
            )}

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    disabled={!chosenPageIds.length}
                    onClick={connectHandler}
                >
                    Connect {chosenPageIds.length || ""} Selected
                </Button>
            </div>
        </form>
    );
};

export default AddFacebookAccountModal;
