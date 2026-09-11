import React, { Suspense, useState } from 'react';
import { InputCheckbox, QuillEditor, RadioInputContainer, SelectInput, TextInput, UploadFileInput } from '../../../../Components/Common';
import { useFormik } from 'formik';
import { userTypeOptions, statusOptionsCheckbox, chooseTemplateOptions, eventTemplateOptions } from '../helper';
import * as Yup from 'yup';


const initialValues = {
    tittle: "",
    chooseTemplate: "",
    eventTemplate: "",
    description: "",
    userType: "",
    sendThrough: "",
    file: "",
};

const validationSchema = Yup.object().shape({
    description: Yup.string().required("Description is required."),
    tittle: Yup.string().required("Tittle is required."),
    userType: Yup.string().required("User is required."),
});

const NotifcationDetails = (props: any) => {

    const [description, setDescription] = useState('');

    const [errorBulkUpload, setErrorBulkUpload] = useState("");
    const [charCount, setCharCount] = useState(0);

    const [notifcationDetails, setNotifcationDetails] =
        useState(initialValues);

    const notifcationDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: notifcationDetails,
        validationSchema,
        onSubmit: (values) => { },
    });

    const onChangeFilterHndlr = (event: any) => {
        const { name, value } = event.target;
        notifcationDetailsForm.setFieldValue(name, value);
    }

    const removePTagsAndBrTags = (htmlContent: string) => {
        return htmlContent.replace(/<\/?p[^>]*>/g, '').replace(/<br\s*\/?>/gi, '');
    };

    const onChangeQuillHndlr = (content: string | any[]) => {
        let cleanContent = '';

        if (typeof content === 'string') {
            cleanContent = content;
            setDescription(cleanContent);
            notifcationDetailsForm.setFieldValue('description', cleanContent);
        } else if (Array.isArray(content)) {
            cleanContent = content.join('');
            setDescription(cleanContent);
            notifcationDetailsForm.setFieldValue('description', cleanContent);
        }

        const strippedContent = removePTagsAndBrTags(cleanContent).trim();
        setCharCount(strippedContent.length);
    };

    return (
        <>
            <form>
                <div style={{ padding: "1.25rem" }} className='!tw-pt-0 !tw-pb-0'>
                    <div className="!tw-grid !tw-grid-cols-12 !tw-gap-6">
                        <div className="!tw-col-span-12 md:!tw-col-span-8">
                            <div className='!tw-grid !tw-grid-cols-12 !tw-gap-y-4'>
                                <div className="!tw-col-span-12 !tw-flex !tw-mb-2">
                                    <RadioInputContainer
                                        name="sendThrough"
                                        labelText="Send Through : "
                                        inputContainerClassName="!tw-mt-2"
                                        radioOptions={[{ id: "sms", name: "SMS" }, { id: "mail", name: "EMAIL" }, { id: "whatsApp", name: "WhatsApp" }, { id: "pushNotifcation", name: "Push Notifcation" }]}
                                        value={notifcationDetailsForm.values.sendThrough}
                                        onChange={notifcationDetailsForm.handleChange}
                                    />
                                </div>
                                <div className='!tw-col-span-12 md:!tw-col-span-6'>
                                    <SelectInput
                                        name="chooseTemplate"
                                        value={notifcationDetailsForm.values.chooseTemplate}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={chooseTemplateOptions}
                                        valueKey="id"
                                        textKey="name"
                                        labelText='Choose Template'
                                        labelClass=' '
                                        formgroupClassName='!tw-mb-3'
                                        defaultSelect='Select'
                                    />
                                </div>
                                {notifcationDetailsForm.values.chooseTemplate === "existing" && (
                                    <div className='!tw-col-span-12 md:!tw-col-span-6'>
                                        <SelectInput
                                            name="eventTemplate"
                                            value={notifcationDetailsForm.values.eventTemplate}
                                            onChange={onChangeFilterHndlr}
                                            menuItems={eventTemplateOptions}
                                            valueKey="id"
                                            textKey="name"
                                            labelText='Event Type'
                                            labelClass=' '
                                            formgroupClassName='!tw-mb-3'
                                            defaultSelect='Select'
                                        />
                                    </div>
                                )}
                                <div className='!tw-col-span-12'>
                                    <TextInput
                                        name="tittle"
                                        value={notifcationDetailsForm.values.tittle}
                                        onChange={onChangeFilterHndlr}
                                        inputClassName="!tw-bg-gray-50"
                                        labelText='Tittle'
                                        maxLength={50}
                                        placeHolder='Enter Tittle'
                                        labelClass='required'
                                    />
                                </div>

                                <div className='!tw-col-span-12'>
                                    <Suspense fallback={<div>Loading...</div>} >
                                        <QuillEditor
                                            name="description"
                                            value={notifcationDetailsForm.values.description}
                                            onChange={onChangeQuillHndlr}
                                            invalid={(notifcationDetailsForm.touched.description && notifcationDetailsForm.errors.description) ? true : false}
                                            error={(notifcationDetailsForm.touched.description && notifcationDetailsForm.errors.description) ? notifcationDetailsForm.errors.description : ""}
                                            labelText="Description"
                                            labelClass='required'
                                        />
                                        <div className="character-count !tw-flex !tw-justify-end">
                                            Characters Count: {charCount}
                                        </div>
                                    </Suspense>
                                </div>
                                {notifcationDetailsForm.values.sendThrough === "mail" || notifcationDetailsForm.values.sendThrough === "whatsApp" && (
                                    <div className='!tw-col-span-12'>
                                        <div className='!tw-col-span-12 !tw-mt-1 upload_form_group_wrapper !tw-flex'>
                                            <span className='!tw-flex !tw-justify-center !tw-items-start !tw-mt-4'>Attach File : </span>
                                            <div className="!tw-ms-3">
                                                <UploadFileInput
                                                    name="file"
                                                    helperText="File supports : .pdf,.PDF formats"
                                                    formgroupClassName=''
                                                    value={notifcationDetailsForm.values.file}
                                                    onChange={notifcationDetailsForm.handleChange}
                                                    hideUploadBtn={true}
                                                    invalid={!!errorBulkUpload}
                                                    error={errorBulkUpload || notifcationDetailsForm.errors.file}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='!tw-col-span-12 md:!tw-col-span-4 !tw-p-5 !tw-flex !tw-justify-center mobile-view'>
                            <div className='!tw-h-[90%] !tw-sticky !tw-w-full'>
                                <div className='!tw-border !tw-w-full !tw-px-2 !tw-pb-4 btn-rounded !tw-shadow-lg'>
                                    <div className='top-mobile !tw-w-1/4 !tw-mb-2 !tw-bg-white !tw-border-[40px] position-bar !tw-mt-3'></div>
                                    <div className='!tw-border screen-h !tw-py-4 !tw-pe-4 !tw-ps-2 btn-rounded'>
                                        <p className='!tw-bg-white card-text !tw-p-3'>{removePTagsAndBrTags(description)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default NotifcationDetails;
