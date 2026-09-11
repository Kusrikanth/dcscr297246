import React, { useEffect } from 'react'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import { useFormik } from 'formik'
import { SelectInput, Switch } from '../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../hooks/storehook'
import { shallowEqual } from 'react-redux'
import classnames from "classnames"
import { generateActionPayload } from '../../utility/reduxutility'
import { getInstRoleTypeV2Act } from '../../store/mastersettings/instituteinfo/instituteinfoactions'
import { useLocation } from 'react-router-dom'

const switchDetails = [
    "Academics", "Uploads", "Directory", "Fee", "Front Desk", "Student Attendance", "Transportation", "Examination"
]

const Permissions = () => {
    const location = useLocation();
    console.log({ location });
    const dispatch = useAppDispatch();

    const { instInfoError, getInstRoleTypeV2Resp, showApiLoader, currentInstIdResp: instituteId, } = useAppSelector(({ instituteInfo, globalData, appData }) => ({
        getInstRoleTypeV2Resp: instituteInfo.getInstRoleTypeV2Resp,
        showApiLoader: globalData.showApiLoader,
        currentInstIdResp: appData.currentInstIdResp,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);

    const permissionsForm = useFormik({
        initialValues: {
            roleTypeId: ""
        },
        onSubmit: (values) => {

        }
    })

    useEffect(() => {
        if (instituteId) {
            getRoleTypeApiCall();
        }
    }, [instituteId]);

    function getRoleTypeApiCall() {
        dispatch(getInstRoleTypeV2Act(generateActionPayload("get_inst_role_type_v2")));
    }
    return (
        <>
            <div className="page-content fee-summary">
                <div className="container-fluid">
                    <BreadCrumb title="Permissions" pageTitle="Fee" />
                    <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                        <div className="tw-col-span-3">
                            <div className='tw-bg-white tw-rounded-lg tw-shadow sticky-left-menucard'>
                                <div className='tw-p-4'>
                                    <div className='tw-flex tw-flex-col'>
                                        <div className='tw-font-bold tw-text-[16px] tw-flex tw-items-center'>
                                            <i className={classnames("ri-profile-line tw-text-primary tw-text-[18px] tw-mr-3")}></i> Role Type
                                        </div>
                                        <div className='tw-mt-3'>
                                            <SelectInput
                                                name={`roleTypeId`}
                                                value={permissionsForm.values.roleTypeId}
                                                formgroupClassName="tw-mb-0"
                                                onChange={permissionsForm.handleChange}
                                                menuItems={getInstRoleTypeV2Resp}
                                                valueKey="id"
                                                textKey="description"
                                            />
                                        </div>
                                    </div>
                                    <div className='tw-flex tw-flex-col tw-mt-4'>
                                        <div className='tw-flex tw-justify-between tw-items-center'>
                                            <div className='tw-font-bold tw-text-[16px] tw-flex tw-items-center'>
                                                <i className={classnames("ri-folder-2-line tw-text-primary tw-text-[18px] tw-mr-3")}></i> Modules Access
                                            </div>
                                            <div className='tw-ml-auto'>
                                                <Switch
                                                    attributeId="switch1"
                                                    checked={true}
                                                    onChangeHndlr={undefined}
                                                    className="form-switch-sm form-check-left tw-my-auto"
                                                />
                                            </div>
                                        </div>
                                        <div className='tw-mt-4'>
                                            <div className='tw-p-3 tw-flex tw-justify-between tw-items-center tw-rounded' style={{ background: "#DEE5FD" }}>
                                                <div className='tw-font-bold tw-text-[14px] tw-flex tw-items-center tw-text-primary'>
                                                    Branch Settings
                                                </div>
                                                <div className='tw-ml-auto'>
                                                    <Switch
                                                        attributeId="branch-setting"
                                                        checked={true}
                                                        onChangeHndlr={undefined}
                                                        className="form-switch-sm form-check-left tw-my-auto"
                                                    />
                                                </div>
                                            </div>
                                            {switchDetails.map((item: string) => (
                                                <div key={item} className='tw-p-3 tw-flex tw-justify-between tw-items-center tw-border tw-border-gray-50 tw-rounded'>
                                                    <div className='tw-text-[14px] tw-flex tw-items-center'>
                                                        {item}
                                                    </div>
                                                    <div className='tw-ml-auto'>
                                                        <Switch
                                                            attributeId={item}
                                                            checked={true}
                                                            onChangeHndlr={undefined}
                                                            className="form-switch-sm form-check-left tw-my-auto"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='tw-col-span-9'>
                            <div className='tw-bg-white tw-rounded-lg tw-shadow'>
                                <div className='tw-p-4'>
                                    card-body

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Permissions