import { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, InputCheckboxUpdated, RadioInputContainer, SelectInput, TextArea, TextInput } from "../../../Components/Common";

const MESSAGE_TYPES = {
    delay: "DELAY",
    custom: "CUSTOM",
};

const messageTypeOptions = [
    {
        id: MESSAGE_TYPES.delay,
        name: "Delay Alert",
        description: "Standard template with delay duration",
    },
    {
        id: MESSAGE_TYPES.custom,
        name: "Custom Message",
        description: "Compose your own update",
    },
];

const mediaTypeOptions = [
    {
        id: "NONE",
        name: "None",
    },
];

const CUSTOM_MESSAGE_TEMPLATE = "Dear Parent,\nHere is an update for {{1}} ({{2}}):\n\n{{3}}\n\nThank you!";

const initialValues: any = {
    messageType: MESSAGE_TYPES.delay,
    delayDuration: "",
    title: "",
    mediaType: "NONE",
    msgBody: "",
    communicationModes: {
        isWhatsApp: true,
        isMobile: true,
    },
};

const validationSchema = Yup.object({
    delayDuration: Yup.mixed().test("delayDuration", "Delay duration is required", function (value: any) {
        if (this.parent?.messageType !== MESSAGE_TYPES.delay) {
            return true;
        }
        if (value === "" || value === null || value === undefined) {
            return false;
        }
        return !Number.isNaN(Number(value));
    }),
    title: Yup.string().test("title", "Title is required", function (value: any) {
        if (this.parent?.messageType !== MESSAGE_TYPES.custom) {
            return true;
        }
        return Boolean(value?.trim());
    }),
    msgBody: Yup.string().test("msgBody", "Description is required", function (value: any) {
        if (this.parent?.messageType !== MESSAGE_TYPES.custom) {
            return true;
        }
        return Boolean(value?.trim());
    }),
    communicationModes: Yup.object()
        .shape({
            isWhatsApp: Yup.boolean(),
            isMobile: Yup.boolean(),
        })
        .test("communicationModes", "Select at least one delivery channel", (value) => {
            return Boolean(value?.isWhatsApp || value?.isMobile);
        }),
});

const dummySelectedRoutes = [
    {
        id: 1,
        routeName: "Route No 1",
        vehicleNumber: "TG08W2138",
        attenderPhone: "+91 97011 63824",
    },
    {
        id: 2,
        routeName: "Route No 2",
        vehicleNumber: "TG08W2132",
        attenderPhone: "+91 99892 10482",
    },
    {
        id: 3,
        routeName: "Route No 3",
        vehicleNumber: "TG08W2127",
        attenderPhone: "+91 98480 21643",
    },
];

const getRouteLabel = (route: any) => route.routeName || "-";

const getVehicleLabel = (route: any) => route.vehicleNumber || "Not assigned";

const getAttenderContact = (route: any) => route.attenderPhone || "Not available";

const SendMessageModal = ({ toggle }: any) => {
    const selectedRoutes = dummySelectedRoutes;
    const previewRoute = useMemo(() => selectedRoutes[0] || {}, [selectedRoutes]);

    const sendMessageForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
        },
    });

    const isCustomMessage = sendMessageForm.values.messageType === MESSAGE_TYPES.custom;

    const messagePreview = useMemo(() => {
        if (isCustomMessage) {
            return CUSTOM_MESSAGE_TEMPLATE
                .replace(/{{\s*1\s*}}/g, getRouteLabel(previewRoute))
                .replace(/{{\s*2\s*}}/g, getVehicleLabel(previewRoute))
                .replace(/{{\s*3\s*}}/g, sendMessageForm.values.msgBody || "");
        }
        return `Dear Parent, ${getRouteLabel(previewRoute)} (${getVehicleLabel(previewRoute)}) is delayed by ${sendMessageForm.values.delayDuration || "-"} minutes. For assistance, contact the bus attender at ${getAttenderContact(previewRoute)}.`;
    }, [previewRoute, isCustomMessage, sendMessageForm.values.delayDuration, sendMessageForm.values.msgBody]);

    const showChannelError = sendMessageForm.submitCount > 0 || Boolean(sendMessageForm.touched.communicationModes);
    const channelError = showChannelError && typeof sendMessageForm.errors.communicationModes === "string"
        ? sendMessageForm.errors.communicationModes
        : "";

    const toggleCommunicationMode = (mode: any, checked: boolean) => {
        const currentModes = sendMessageForm.values.communicationModes;
        const updatedModes = {
            ...currentModes,
            [mode]: checked,
        };

        sendMessageForm.setFieldValue("communicationModes", updatedModes);
        sendMessageForm.setFieldTouched("communicationModes", true, false);
    };

    const changeMessageTypeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        sendMessageForm.setValues((prev: any) => ({
            ...prev,
            messageType: value,
            delayDuration: value === MESSAGE_TYPES.delay ? prev.delayDuration : "",
            title: value === MESSAGE_TYPES.custom ? prev.title : "",
            msgBody: value === MESSAGE_TYPES.custom ? prev.msgBody : "",
        }));
        sendMessageForm.setTouched({ communicationModes: sendMessageForm.touched.communicationModes }, false);
    };

    return (
        <form onSubmit={sendMessageForm.handleSubmit}>
            <div className="tw-card tw-shadow-none tw-mb-0 tw-border-0">
                <div className="tw-card-body tw-max-h-[70vh] tw-overflow-auto">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                        <div className="tw-col-span-12">
                            <RadioInputContainer
                                name="messageType"
                                labelText="Message Type"
                                labelClassName="required"
                                value={sendMessageForm.values.messageType}
                                onChange={changeMessageTypeHandler}
                                radioOptions={messageTypeOptions}
                                inputContainerClassName="tw-flex-col lg:tw-flex-row tw-gap-2 lg:tw-gap-6"
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="tw-col-span-12 lg:tw-col-span-7">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                {isCustomMessage ? (
                                    <>
                                        <div className="tw-col-span-12">
                                            <TextInput
                                                name="title"
                                                labelText="Title"
                                                labelClass="required"
                                                value={sendMessageForm.values.title}
                                                onChange={sendMessageForm.handleChange}
                                                onBlur={sendMessageForm.handleBlur}
                                                inputClassName="bg-soft-light"
                                                placeHolder="Enter title"
                                                invalid={sendMessageForm.touched.title && sendMessageForm.errors.title ? true : false}
                                                error={sendMessageForm.touched.title && sendMessageForm.errors.title ? sendMessageForm.errors.title : ""}
                                            />
                                        </div>

                                        <div className="tw-col-span-12">
                                            <SelectInput
                                                name="mediaType"
                                                labelText="Media Type"
                                                labelClass="required"
                                                value={sendMessageForm.values.mediaType}
                                                menuItems={mediaTypeOptions}
                                                valueKey="id"
                                                textKey="name"
                                                hideSelectOption
                                                isDisabled
                                                inputClassName="bg-soft-light"
                                            />
                                        </div>

                                        <div className="tw-col-span-12">
                                            <TextArea
                                                name="msgBody"
                                                labelText="Description"
                                                labelClass="required"
                                                placeHolder="Enter Description"
                                                height="160px"
                                                maxLength={900}
                                                showRemainingChars
                                                value={sendMessageForm.values.msgBody}
                                                onChange={sendMessageForm.handleChange}
                                                onBlur={sendMessageForm.handleBlur}
                                                invalid={sendMessageForm.touched.msgBody && sendMessageForm.errors.msgBody ? true : false}
                                                error={sendMessageForm.touched.msgBody && sendMessageForm.errors.msgBody ? sendMessageForm.errors.msgBody : ""}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="tw-col-span-12">
                                        <TextInput
                                            name="delayDuration"
                                            labelText="Delay Duration"
                                            labelClass="required"
                                            value={sendMessageForm.values.delayDuration}
                                            onChange={sendMessageForm.handleChange}
                                            onBlur={sendMessageForm.handleBlur}
                                            inputType="number"
                                            inputClassName="bg-soft-light"
                                            placeHolder="Enter delay in minutes"
                                            invalid={sendMessageForm.touched.delayDuration && sendMessageForm.errors.delayDuration ? true : false}
                                            error={sendMessageForm.touched.delayDuration && sendMessageForm.errors.delayDuration ? sendMessageForm.errors.delayDuration : ""}
                                        />
                                    </div>
                                )}

                                <div className="tw-col-span-12">
                                    <div className="mb-3">
                                        <div className="form-label required">Send Through</div>

                                        <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                                            <div className="tw-col-span-12 ">
                                                <div className="tw-border tw-rounded tw-p-3 tw-h-full">
                                                    <div className="tw-flex tw-items-start tw-gap-2">
                                                        <i className="ri-whatsapp-line tw-text-lg text-success" />
                                                        <InputCheckboxUpdated
                                                            name="whatsapp"
                                                            value={sendMessageForm.values.communicationModes.isWhatsApp}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleCommunicationMode("isWhatsApp", event.target.checked)}
                                                            labelName="WhatsApp"
                                                            formgroupClassName="tw-mb-0"
                                                        >
                                                            <div className="tw-text-xs text-muted tw-mt-1">Template message</div>
                                                        </InputCheckboxUpdated>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="tw-col-span-12 ">
                                                <div className="tw-border tw-rounded tw-p-3 tw-h-full">
                                                    <div className="tw-flex tw-items-start tw-gap-2">
                                                        <i className="ri-smartphone-line tw-text-lg text-primary" />
                                                        <InputCheckboxUpdated
                                                            name="app"
                                                            value={sendMessageForm.values.communicationModes.isMobile}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleCommunicationMode("isMobile", event.target.checked)}
                                                            labelName="Mobile App Notification"
                                                            formgroupClassName="tw-mb-0"
                                                        >
                                                            <div className="tw-text-xs text-muted tw-mt-1">Push notification</div>
                                                        </InputCheckboxUpdated>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {channelError && <div className="tw-mt-1 tw-text-xs tw-text-[#f06548]">{channelError}</div>}
                                    </div>
                                </div>

                                <div className="tw-col-span-12">
                                    <div className="tw-border tw-rounded">
                                        <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-px-3 tw-py-2">
                                            <div className="tw-text-sm tw-font-medium">Selected Routes</div>
                                            <div className="tw-text-xs text-muted">{selectedRoutes.length} Selected</div>
                                        </div>

                                        <div className="tw-max-h-44 tw-overflow-auto tw-p-3">
                                            <div className="tw-flex tw-flex-wrap tw-gap-2">
                                                {selectedRoutes.map((route) => (
                                                    <div
                                                        key={route.id}
                                                        className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-bg-[#eef2ff] tw-px-3 tw-py-1.5 tw-text-xs tw-text-[#405189]"
                                                    >
                                                        <i className="ri-check-line" />
                                                        <span className="tw-font-semibold">{getRouteLabel(route)}</span>
                                                        <span className="tw-text-[#64748b]">{getVehicleLabel(route)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tw-col-span-12 lg:tw-col-span-5 tw-border-l tw-border-gray-300">
                            <div className="tw-p-4 tw-h-full">
                                <div className="tw-flex tw-items-center tw-justify-between">
                                    <div className="tw-text-sm tw-font-semibold tw-text-gray-800">Message Preview</div>
                                    <div className="tw-text-xs tw-text-gray-500">{isCustomMessage ? 2 : 4} Variables</div>
                                </div>

                                <div className="tw-mt-3 tw-grid tw-grid-cols-2 tw-gap-2">
                                    {!isCustomMessage && (
                                        <div className="tw-rounded-md tw-bg-white tw-p-2 tw-text-xs tw-shadow-sm tw-border">
                                            <div className="tw-text-gray-500">Delay</div>
                                            <div className="tw-font-semibold tw-text-gray-800">{sendMessageForm.values.delayDuration || "-"} Min</div>
                                        </div>
                                    )}
                                    <div className="tw-rounded-md tw-bg-white tw-p-2 tw-text-xs tw-shadow-sm tw-border">
                                        <div className="tw-text-gray-500">Route</div>
                                        <div className="tw-font-semibold tw-text-gray-800">{getRouteLabel(previewRoute)}</div>
                                    </div>
                                    <div className="tw-rounded-md tw-bg-white tw-p-2 tw-text-xs tw-shadow-sm tw-border">
                                        <div className="tw-text-gray-500">Bus</div>
                                        <div className="tw-font-semibold tw-text-gray-800">{getVehicleLabel(previewRoute)}</div>
                                    </div>
                                    {!isCustomMessage && (
                                        <div className="tw-rounded-md tw-bg-white tw-p-2 tw-text-xs tw-shadow-sm tw-border">
                                            <div className="tw-text-gray-500">Attender</div>
                                            <div className="tw-font-semibold tw-text-gray-800">{getAttenderContact(previewRoute)}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="tw-mt-4 tw-rounded-[24px] tw-border tw-border-gray-200 tw-bg-white tw-p-3 tw-shadow-sm">
                                    <div className="tw-rounded-t-[18px] tw-bg-[#405189] tw-px-3 tw-py-2 tw-text-sm tw-font-medium tw-text-white">
                                        <i className="ri-message-3-line tw-me-2" />
                                        <span>School Transport</span>
                                    </div>
                                    <div className="tw-rounded-b-[18px] tw-bg-[#e8f5e9] tw-p-3 tw-text-sm tw-leading-6 tw-text-gray-800">
                                        <div className="tw-whitespace-pre-wrap tw-break-words">{messagePreview}</div>
                                        <div className="tw-mt-2 tw-text-right tw-text-[11px] tw-text-gray-500">10:32 AM</div>
                                    </div>
                                </div>

                                <div className="tw-mt-3 tw-text-xs tw-leading-5 tw-text-gray-500">
                                    Preview uses {getRouteLabel(previewRoute)}. Each selected route receives its own route details.
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
                <div className="tw-card-footer tw-col-span-12 tw-flex tw-justify-end tw-gap-2">
                    <Button type="button" variant="secondary" onClick={toggle}>
                        Close
                    </Button>

                    <Button type="submit" variant="primary" disabled={selectedRoutes.length <= 0}>
                        Send
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default SendMessageModal
