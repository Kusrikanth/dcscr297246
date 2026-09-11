import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getAppUsageStatsAct } from '../../../../store/academic/academicRequest/academicrequestactions';
import LoginCounts from './LoginCounts';

interface IMenuOptions {
    id: string;
    labelName: string;
    customPadding: string;
}

const initialValues = {
    startDate: "",
    endDate: "",
    academicYearId: "",
};

const UsersByDevices = (props: any) => {

    const { branchId, academicYearId, startDate, endDate, roleType , instituteId } = props || {}

    const [activeId, setActiveId] = useState<string | null>("parentUsers");
    const dispatch = useAppDispatch();
    const appUsageStatsApiCall = (otherProps?: any) => {
        const payload = {
            startDate,
            endDate,
            branchId,
            academicYearId,
            roleType,
            instituteId,
            ...otherProps,
        };
        dispatch(getAppUsageStatsAct(generateActionPayload('get_app_usage_stats', undefined, payload)))
    }

    const {
        academicYearListResp,
    } = useAppSelector(
        ({ instAcademics, appData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (roleType) {
            appUsageStatsApiCall();
        }
    }, [branchId, academicYearId, startDate, endDate, roleType]);

    const MenuOptions: Array<IMenuOptions> = [

        {
            id: "parentUsers",
            labelName: "Parent",
            customPadding: "5px 5px 5px 5px",
        },
        {
            id: "staffUsers",
            labelName: "Staff",
            customPadding: "5px 5px 5px 5px",
        }

    ];

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveId(menuId);
    }

    const upcomingEvents = useFormik({
        initialValues,
        onSubmit: (values) => { },
    })

    const handleDateChange = ({ startDate, endDate }: any) => {
        if (startDate && endDate) {
            upcomingEvents.setValues((prev) => ({ ...prev, startDate, endDate }));
            appUsageStatsApiCall({ startDate, endDate });
        }
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        upcomingEvents.setValues((prev) => ({ ...prev, academicYearId: value }));
        appUsageStatsApiCall({ [name]: value });
    }

    const { data: academicYearList } = academicYearListResp || {};

    return (
        <div className='card !tw-shadow-sm !tw-rounded-2xl'>
            <div className="card-header !tw-py-2 !tw-rounded-t-2xl">
                <div className="tw-flex tw-items-center">
                    <div className="tw-flex-1 tw-pr-0">
                        <h4 className="card-title !tw-mb-0">App Usage Stats</h4>
                    </div>
                    <div className="tw-ml-auto tw-invisible">
                        <button
                            id="export-btn"
                            className="btn btn-icon tw-p-2 !tw-rounded-full !tw-bg-sky-100"
                        >
                            export
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body !tw-pt-3 !tw-pb-1 !tw-px-0">
                <div className="card-body">
                    {/* <div className='tw-grid tw-grid-cols-12'>
                        <div className='tw-col-span-12 tw-flex tw-justify-center horizontal_tab'>
                            <UpdatedHorizontalTab
                                MenuOptions={MenuOptions}
                                clickMenuHandler={clickMenuHandler}
                                activeTabId={activeId}
                                horizontalClass="tw-pl-0"
                            />
                        </div>
                    </div> */}
                    <LoginCounts />
                </div>
            </div>
        </div>
    );
}

export default UsersByDevices;
