import React, { Suspense, useEffect, useRef, useState } from 'react'
import { DateInput, InputCheckbox, QuillEditor, SelectInput, TextInput, TimeInput } from '../../../../Components/Common'
import { useFormik } from 'formik';
import { userTypeOptions, statusOptionsCheckbox, statusOptionsParent, statusOptionsStaff, statusOptionsAll, dayOptions } from '../helper';
import * as Yup from 'yup';

const initialValues = {
    tittle: "",
    description: "",
    userType: "",
    time: "",
    date: "",
    day: "",
    daysFrom: "",
};

const validationSchema = Yup.object().shape({
    description: Yup.string().required("Description is required."),
    tittle: Yup.string().required("Tittle is required."),
    userType: Yup.string().required("User is required."),
});

const UserDetails = (props: any) => {
    const [activeTab, setActiveTab] = useState('Immediately');
    const [state, setState] = useState({
        smsAndEmailMenu: statusOptionsCheckbox,
        contactInfo: statusOptionsParent,
        contactInfoStaff: statusOptionsStaff,
        contactAll: statusOptionsAll,
        userDetails: initialValues,
    });

    const userDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: state.userDetails,
        validationSchema,
        onSubmit: (values) => { },
    });

    const onChangeFilterHndlr = (event: any) => {
        const { name, value } = event.target;
        userDetailsForm.setFieldValue(name, value);
    };

    const onSelectCheckboxHandler = (e: { target: { name: any; checked: any; }; }, type: any) => {
        const { name, checked } = e.target;
        setState((prevState: any) => {
            const updatedMenu = prevState[type].map((item: { id: any; }) =>
                item.id === name ? { ...item, selected: checked } : item
            );
            return { ...prevState, [type]: updatedMenu };
        });
    };

    const handleTabClick = (e: { preventDefault: () => void; }, tabName: React.SetStateAction<string>) => {
        e.preventDefault();
        setActiveTab(tabName);
    };
    useEffect(() => {
        userDetailsForm.setFieldValue("userType", "ALL");
    }, []);

    return (
        <>
            <form>
                <div style={{ padding: "1.25rem" }} className='!tw-pt-0 !tw-pb-0 communication'>
                    <div className='!tw-grid !tw-grid-cols-12 user-details'>
                        <div className='!tw-col-span-12'>
                            <div className='!tw-grid !tw-grid-cols-12 !tw-gap-x-6'>
                                <div className='!tw-col-span-12 lg:!tw-col-span-6'>
                                    <div className='!tw-grid !tw-grid-cols-12'>
                                        <div className='!tw-col-span-12'>
                                            <SelectInput
                                                name="userType"
                                                value={userDetailsForm.values.userType}
                                                onChange={onChangeFilterHndlr}
                                                menuItems={userTypeOptions}
                                                valueKey="id"
                                                textKey="name"
                                                labelText='User Type'
                                                labelClass=' '
                                                formgroupClassName='!tw-mb-1'
                                                defaultSelect='Select'
                                            />
                                        </div>
                                        {userDetailsForm.values.userType === "EMPLOYEE" &&
                                            <>
                                                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
                                                    <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Employee</p>
                                                    <div className='!tw-grid !tw-grid-cols-12'>
                                                        <div className='!tw-col-span-12 !tw-grid !tw-grid-cols-12 !tw-gap-3 !tw-mt-1'>
                                                            {state.contactInfoStaff && state.contactInfoStaff.map((item: any) => {
                                                                return (
                                                                    <div key={item.id} className="!tw-col-span-6 md:!tw-col-span-4 lg:!tw-col-span-3">
                                                                        <InputCheckbox
                                                                            name={`${item.id}`}
                                                                            labelName={item.name}
                                                                            value={item.selected}
                                                                            onChange={(e: { target: { name: any; checked: any; }; }) => onSelectCheckboxHandler(e, 'contactInfoStaff')}
                                                                            dataId={item.id}
                                                                        />
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div> </>}
                                        {userDetailsForm.values.userType === "PARENT" &&
                                            <>
                                                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
                                                    <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Parent</p>
                                                    <div className='!tw-grid !tw-grid-cols-12'>
                                                        <div className='!tw-col-span-12 !tw-grid !tw-grid-cols-12 !tw-gap-3'>
                                                            {state.contactInfo && state.contactInfo.map((item: any) => {
                                                                return (
                                                                    <div key={item.id} className="!tw-col-span-6 md:!tw-col-span-4 lg:!tw-col-span-3">
                                                                        <InputCheckbox
                                                                            name={`${item.id}`}
                                                                            labelName={item.name}
                                                                            value={item.selected}
                                                                            onChange={(e: { target: { name: any; checked: any; }; }) => onSelectCheckboxHandler(e, 'contactInfo')}
                                                                            dataId={item.id}
                                                                        />
                                                                    </div>
                                                                )
                                                            })}
                                                        </div> </div>
                                                </div></>}
                                        {userDetailsForm.values.userType === "ALL" &&
                                            <>
                                                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
                                                    <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>All</p>
                                                    <div className='!tw-grid !tw-grid-cols-12'>
                                                        <div className='!tw-col-span-12 !tw-grid !tw-grid-cols-12 !tw-gap-3'>
                                                            {state.contactAll && state.contactAll.map((item: any) => {
                                                                return (
                                                                    <div key={item.id} className="!tw-col-span-6 md:!tw-col-span-4 lg:!tw-col-span-3">
                                                                        <InputCheckbox
                                                                            name={`${item.id}`}
                                                                            labelName={item.name}
                                                                            value={item.selected}
                                                                            onChange={(e: { target: { name: any; checked: any; }; }) => onSelectCheckboxHandler(e, 'contactInfo')}
                                                                            dataId={item.id}
                                                                        />
                                                                    </div>
                                                                )
                                                            })}

                                                        </div>
                                                    </div>
                                                </div> </>}
                                    </div>
                                </div>
                                <div className='!tw-col-span-12 lg:!tw-col-span-6'>
                                    <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
                                        <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Send On</p>
                                        <div className='!tw-grid !tw-grid-cols-12'>
                                            <div className='!tw-col-span-12'>
                                                <div className="!tw-flex !tw-justify-start list-group overflow-scroll-tabs !tw-text-center">
                                                    <a
                                                        href="#immediately"
                                                        className={`tab-link ${activeTab === 'Immediately' ? 'active' : ''} list-group-item !tw-flex`}
                                                        onClick={(e) => handleTabClick(e, 'Immediately')}
                                                    >
                                                        <span className='!tw-flex !tw-items-center'><i className="ri-time-fill !tw-me-1"></i></span>  Immediately
                                                    </a>
                                                    <a
                                                        href="#scheduled"
                                                        className={`tab-link ${activeTab === 'Scheduled' ? 'active' : ''} list-group-item !tw-flex`}
                                                        onClick={(e) => handleTabClick(e, 'Scheduled')}
                                                    >
                                                        <span className='!tw-flex !tw-items-center'><i className="ri-time-fill !tw-me-1"></i></span> Scheduled
                                                    </a>
                                                    <a
                                                        href="#recurring"
                                                        className={`tab-link ${activeTab === 'Recurring' ? 'active' : ''} list-group-item !tw-flex`}
                                                        onClick={(e) => handleTabClick(e, 'Recurring')}
                                                    >
                                                        <span className='!tw-flex !tw-items-center'><i className="ri-time-fill !tw-me-1"></i></span> Recurring
                                                    </a>
                                                </div>
                                                <div className="tab-content">
                                                    {activeTab === 'Immediately' && (
                                                        <div>
                                                        </div>
                                                    )}
                                                    {activeTab === 'Scheduled' && (
                                                        <div className='!tw-grid !tw-grid-cols-12 !tw-gap-3 !tw-mt-3 !tw-ps-2'>
                                                            <div className='!tw-col-span-12 lg:!tw-col-span-4 xl:!tw-col-span-4'>
                                                                <DateInput
                                                                    name="date"
                                                                    labelText="Date"
                                                                    value={userDetailsForm.values.date}
                                                                    onChange={userDetailsForm.handleChange}
                                                                    placeHolder="Date"
                                                                />
                                                            </div>
                                                            <div className='!tw-col-span-12 lg:!tw-col-span-4 xl:!tw-col-span-4'>
                                                                <TimeInput
                                                                    name={`time`}
                                                                    labelText="Time"
                                                                    value={userDetailsForm.values.time}
                                                                    onChange={userDetailsForm.handleChange}
                                                                />
                                                            </div>

                                                        </div>
                                                    )}
                                                    {activeTab === 'Recurring' && (
                                                        <div className='!tw-grid !tw-grid-cols-12 !tw-gap-3 !tw-mt-3 !tw-ps-2'>
                                                            <div className='!tw-col-span-12 lg:!tw-col-span-6 xl:!tw-col-span-6'>
                                                                <DateInput
                                                                    name="date"
                                                                    labelText="Date"
                                                                    value={userDetailsForm.values.date}
                                                                    onChange={userDetailsForm.handleChange}
                                                                    placeHolder="Date"
                                                                />
                                                            </div>
                                                            <div className='!tw-w-full lg:!tw-col-span-6 xl:!tw-col-span-6'>
                                                                <TimeInput
                                                                    name={`time`}
                                                                    labelText="Time"
                                                                    value={userDetailsForm.values.time}
                                                                    onChange={userDetailsForm.handleChange}
                                                                />
                                                            </div>
                                                            <div className='!tw-col-span-12 lg:!tw-col-span-6 xl:!tw-col-span-6'>
                                                                <SelectInput
                                                                    name="day"
                                                                    value={userDetailsForm.values.day}
                                                                    onChange={onChangeFilterHndlr}
                                                                    menuItems={dayOptions}
                                                                    valueKey="id"
                                                                    textKey="name"
                                                                    labelText='User Type'
                                                                    labelClass=' '
                                                                    formgroupClassName='!tw-mb-1'
                                                                    defaultSelect='Select'
                                                                />
                                                            </div>
                                                            <div className='!tw-col-span-12 lg:!tw-col-span-6 xl:!tw-col-span-6'>
                                                                <TextInput
                                                                    name="daysFrom"
                                                                    formgroupClassName="!tw-mb-0"
                                                                    placeHolder="Every no of Days"
                                                                    labelText="Every"
                                                                    value={userDetailsForm.values.daysFrom}
                                                                    onChange={userDetailsForm.handleChange}
                                                                />
                                                            </div>

                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='!tw-col-span-12 !tw-mx-4'>
                                        &nbsp;
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

export default UserDetails