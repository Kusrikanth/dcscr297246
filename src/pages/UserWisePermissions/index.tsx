import { useState } from 'react'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import { useFormik } from 'formik'
import { AutoSearchInputUpdated, Switch, Button } from '../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../hooks/storehook'
import { shallowEqual } from 'react-redux'
import classnames from "classnames"
import { generateActionPayload } from '../../utility/reduxutility'
import { getStudentByFilterAct } from '../../store/directory/studentmanagement/studentmanagementactions'

const switchDetails = [
    "Academics", "Uploads", "Directory", "Fee", "Front Desk", "Student Attendance", "Transportation", "Examination"
]

const UserWisePermissions = () => {

    const dispatch = useAppDispatch();
    const [searchStudentState, setSearchStudentState] = useState<any>(null);

    const { instInfoError, showApiLoader, currentInstIdResp: instituteId, getStudentsByFilterResp } = useAppSelector(({ instituteInfo, globalData, appData, directoryStudent }) => ({
        getInstRoleTypeV2Resp: instituteInfo.getInstRoleTypeV2Resp,
        showApiLoader: globalData.showApiLoader,
        currentInstIdResp: appData.currentInstIdResp,
        getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);

    const permissionsForm = useFormik({
        initialValues: {
            studentId: ""
        },
        onSubmit: (values) => {

        }
    })

    function onInputSearchChange(inputString: any) {
        dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined, {
            instituteId,
            studentName: inputString || "",
            pageNo: 0, pageSize: 50
        })));
    }

    function selectedStudentHndlr(selectedStudent: any) {
        setSearchStudentState(selectedStudent);
        if (selectedStudent) {
            const { id } = selectedStudent;
            permissionsForm.setValues((prevState) => ({ ...prevState, studentId: id, }));
        } else {
            permissionsForm.setValues((prevState) => ({ ...prevState, studentId: "" }));
        }
    }

    return (
        <>
            <div className="page-content fee-summary">
                <div className="container-fluid">
                    <BreadCrumb title="Permissions" pageTitle="Fee" />
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        <div className="tw-col-span-12 lg:tw-col-span-3">
                            <div className='tw-card tw-sticky tw-top-20'>
                                <div className='tw-p-4'>
                                    <div className='tw-flex tw-flex-col'>
                                        <div className='tw-flex tw-items-center tw-font-bold tw-text-[16px]'>
                                            <i className={classnames("ri-profile-line tw-text-primary tw-text-[18px] tw-mr-3")}></i> User Name
                                        </div>
                                        <div className='tw-mt-3 tw-relative'>
                                            <AutoSearchInputUpdated
                                                formgroupClassName="search-box"
                                                name="searchString"
                                                placeHolder="Search"
                                                labelText="Search"
                                                onChange={onInputSearchChange}
                                                valueKey="id"
                                                labelKey="studentCode"
                                                subLabelKey="name"
                                                labelHeader="Student Code"
                                                subLabelHeader="Student Name"
                                                options={getStudentsByFilterResp}
                                                selected={searchStudentState}
                                                selectedOptionCallbck={selectedStudentHndlr}
                                            >
                                                <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                                            </AutoSearchInputUpdated>
                                        </div>
                                    </div>
                                    <div className='tw-flex tw-flex-col tw-mt-6'>
                                        <div className='tw-flex tw-justify-between tw-items-center tw-mb-4'>
                                            <div className='tw-flex tw-items-center tw-font-bold tw-text-[16px]'>
                                                <i className={classnames("ri-folder-2-line tw-text-primary tw-text-[18px] tw-mr-3")}></i> Modules Access
                                            </div>
                                            <div className='tw-ml-auto'>
                                                <Button 
                                                    variant="primary"
                                                >
                                                    Add New
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='tw-space-y-2'>
                                            <div className='tw-p-3 tw-flex tw-justify-between tw-items-center tw-rounded tw-bg-[#DEE5FD]'>
                                                <div className='tw-font-bold tw-text-[14px] tw-text-primary'>
                                                    Branch Settings
                                                </div>
                                                <div className='tw-ml-auto'>
                                                    <Switch
                                                        attributeId="branch-setting"
                                                        checked={true}
                                                        onChangeHndlr={undefined}
                                                        className="form-switch-sm form-check-left"
                                                    />
                                                </div>
                                            </div>
                                            {switchDetails.map((item: string) => (
                                                <div key={item} className='tw-p-3 tw-flex tw-justify-between tw-items-center tw-border tw-border-gray-100 tw-rounded hover:tw-bg-gray-50 tw-transition-colors'>
                                                    <div className='tw-text-[14px] tw-text-gray-600'>
                                                        {item}
                                                    </div>
                                                    <div className='tw-ml-auto'>
                                                        <Switch
                                                            attributeId={item}
                                                            checked={true}
                                                            onChangeHndlr={undefined}
                                                            className="form-switch-sm form-check-left"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='tw-col-span-12 lg:tw-col-span-9'>
                            <div className='tw-card'>
                                <div className='tw-p-4'>
                                    <div className="tw-flex tw-items-center tw-justify-between tw-gap-4">
                                        <div>
                                            <h4 className="tw-text-lg tw-font-bold tw-mb-0">
                                                Branch Settings Permissions
                                            </h4>
                                        </div>
                                        <div className="tw-flex tw-gap-2">
                                            <Button 
                                                className="tw-text-white"
                                                style={{ background: "#5DA1C8", border: "none" }}
                                            >
                                                Copy Same Access
                                            </Button>
                                            <Button
                                                variant="info"
                                            >
                                                Export
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="tw-flex tw-justify-end tw-items-center tw-mt-4 tw-gap-2">
                                        <Button
                                            variant="secondary"
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            variant="primary"
                                        >
                                            Submit
                                        </Button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserWisePermissions