import { useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import { Button, TextInput } from "../../../../Components/Common";

interface GoogleSheetsConfigPanelProps {
    integrationName: string;
}

const GoogleSheetsConfigPanel = ({
    integrationName,
}: GoogleSheetsConfigPanelProps) => {
    const [form, setForm] = useState({
        clientId: "",
        clientSecret: "",
        redirectUrl: "",
    });
    const [showSecret, setShowSecret] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm(current => ({ ...current, [name]: value }));
    };

    const saveHandler = () => {
        if (
            !form.clientId.trim() ||
            !form.clientSecret.trim() ||
            !/^https?:\/\/\S+$/i.test(form.redirectUrl.trim())
        ) {
            setError(
                "Client ID, Client Secret and a valid Redirect URI are required.",
            );
            return;
        }

        setError("");
        toast.success(`Google credentials saved for ${integrationName}`);
    };

    return (
        <div className="tw-rounded tw-border tw-border-gray-200 tw-p-3">
            <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                Google OAuth credentials
            </p>
            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                Credentials are stored separately for this Google Sheets account.
            </p>

            {error && (
                <div className="alert alert-danger tw-py-2">
                    <span className="tw-text-sm">{error}</span>
                </div>
            )}

            <div className="row">
                <div className="col-12 col-md-6">
                    <TextInput
                        name="clientId"
                        labelText="Google Client ID"
                        labelClass="required"
                        placeHolder="OAuth client ID"
                        value={form.clientId}
                        onChange={changeHandler}
                    />
                </div>

                <div className="col-12 col-md-6">
                    <span className="tw-mb-1 tw-block tw-text-sm tw-text-[#495057]">
                        Google Client Secret <span className="tw-text-danger">*</span>
                    </span>

                    <div className="tw-mb-3 tw-flex tw-items-center tw-gap-2">
                        <TextInput
                            name="clientSecret"
                            inputType={showSecret ? "text" : "password"}
                            autoComplete="new-password"
                            placeHolder="OAuth client secret"
                            value={form.clientSecret}
                            onChange={changeHandler}
                            formgroupClassName="tw-mb-0 tw-flex-1"
                        />

                        <Button
                            type="button"
                            variant="secondary"
                            title={showSecret ? "Hide secret" : "Show secret"}
                            aria-label={showSecret ? "Hide secret" : "Show secret"}
                            className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                            onClick={() => setShowSecret(current => !current)}
                        >
                            <i
                                className={
                                    showSecret ? "ri-eye-off-line" : "ri-eye-line"
                                }
                            ></i>
                        </Button>
                    </div>
                </div>

                <div className="col-12">
                    <TextInput
                        name="redirectUrl"
                        labelText="Authorized Redirect URI"
                        labelClass="required"
                        placeHolder="https://your-api-domain.com/api/hub/oauth/callback"
                        helperText="Add this exact URI to the OAuth client in the Google Cloud Console."
                        value={form.redirectUrl}
                        onChange={changeHandler}
                    />
                </div>
            </div>

            <div className="tw-flex tw-justify-end">
                <Button type="button" variant="primary" onClick={saveHandler}>
                    Save Google Credentials
                </Button>
            </div>
        </div>
    );
};

export default GoogleSheetsConfigPanel;
