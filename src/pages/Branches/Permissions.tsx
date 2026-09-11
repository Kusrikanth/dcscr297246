import React, { useEffect } from 'react'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import { useFormik } from 'formik'
import { SelectInput, Switch } from '../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../hooks/storehook'
import { shallowEqual } from 'react-redux'
import classnames from "classnames"
import { generateActionPayload } from '../../utility/reduxutility'
import { getInstRoleTypeV2Act } from '../../store/mastersettings/instituteinfo/instituteinfoactions'

const switchDetails = [
    "Academics", "Uploads", "Directory", "Fee", "Front Desk", "Student Attendance", "Transportation", "Examination"
]

const Permissions = () => {

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
                    <div className="row gx-2">
                        <div className="col-3">
                            <div className='card sticky-left-menucard'>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className='col-12 fw-bold fs-16 d-flex align-items-center'>
                                            <i className={classnames("ri-profile-line text-primary fs-18 me-3")}></i> Role Type
                                        </div>
                                        <div className='col-12 mt-3'>
                                            <SelectInput
                                                name={`roleTypeId`}
                                                value={permissionsForm.values.roleTypeId}
                                                formgroupClassName="mb-0"
                                                onChange={permissionsForm.handleChange}
                                                menuItems={getInstRoleTypeV2Resp}
                                                valueKey="id"
                                                textKey="description"
                                            />
                                        </div>
                                    </div>
                                    <div className='row mt-4'>
                                        <div className='col-12 d-flex justify-content-between align-items-center'>
                                            <div className='col-8 fw-bold fs-16 d-flex align-items-center'>
                                                <i className={classnames("ri-folder-2-line text-primary fs-18 me-3")}></i> Modules Access
                                            </div>
                                            <div className='ms-auto col-auto'>
                                                <Switch
                                                    attributeId="switch1"
                                                    checked={true}
                                                    onChangeHndlr={undefined}
                                                    className="form-switch-sm form-check-left my-auto"
                                                />
                                            </div>
                                        </div>
                                        <div className='col-12 mt-4'>
                                            <div className='p-3 d-flex justify-content-between align-items-center rounded' style={{ background: "#DEE5FD" }}>
                                                <div className='col-8 fw-bold fs-14 d-flex align-items-center text-primary'>
                                                    Branch Settings
                                                </div>
                                                <div className='ms-auto col-auto'>
                                                    <Switch
                                                        attributeId="branch-setting"
                                                        checked={true}
                                                        onChangeHndlr={undefined}
                                                        className="form-switch-sm form-check-left my-auto"
                                                    />
                                                </div>
                                            </div>
                                            {switchDetails.map((item: string) => (
                                                <div key={item} className='p-3 d-flex justify-content-between align-items-center border border-light rounded'>
                                                    <div className='col-8 fs-14 d-flex align-items-center'>
                                                        {item}
                                                    </div>
                                                    <div className='ms-auto col-auto'>
                                                        <Switch
                                                            attributeId={item}     
                                                            checked={true}
                                                            onChangeHndlr={undefined}
                                                            className="form-switch-sm form-check-left my-auto"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-9'>
                            <div className='card'>
                                <div className='card-body'>
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