import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getBranchWiseUsageForSuperAdminAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";

const BranchWiseUsage = (props: any) => {
    const dispatch = useAppDispatch()
    const [tableData, setTableData] = useState<any[]>([])
    const { branchId, academicYearId, startDate, endDate, roleType } = props || {}

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
        dispatch(getBranchWiseUsageForSuperAdminAct(generateActionPayload('get_branch_wise_usage_for_super_admin', undefined, payload)))
    }

    const {
        academicYearListResp,
        getBranchWiseUsageForSuperAdminResp,
        currentInstIdResp: instituteId,
    } = useAppSelector(
        ({ instAcademics, reports, appData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            getBranchWiseUsageForSuperAdminResp: reports.getBranchWiseUsageForSuperAdminResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (roleType) {
            appUsageStatsApiCall();
        }
    }, [branchId, academicYearId, startDate, endDate, roleType]);

    useEffect(() => {
        if (Array.isArray(getBranchWiseUsageForSuperAdminResp)) {
            const transformedData = getBranchWiseUsageForSuperAdminResp.reduce((acc, curr) => {
                const { branchName, loginSource, loginCount = 0 } = curr;

                const existing = acc.find((item: any) => item.branchName === branchName);

                if (existing) {
                    if (loginSource === "TOTAL_COUNT") existing.totalCount = loginCount;
                    else if (loginSource === "WEB") existing.web = loginCount;
                    else if (loginSource === "ANDROID") existing.android = loginCount;
                    else if (loginSource === "IOS") existing.ios = loginCount;
                    else if (loginSource === "NOTLOGGEDINCOUNT") existing.notLoggedUsers = loginCount;
                } else {
                    acc.push({
                        branchName,
                        totalCount: loginSource === "TOTAL_COUNT" ? loginCount : 0,
                        web: loginSource === "WEB" ? loginCount : 0,
                        android: loginSource === "ANDROID" ? loginCount : 0,
                        ios: loginSource === "IOS" ? loginCount : 0,
                        notLoggedUsers: loginSource === "NOTLOGGEDINCOUNT" ? loginCount : 0,
                    });
                }

                return acc;
            }, []);
            setTableData(transformedData)
        }
    }, [getBranchWiseUsageForSuperAdminResp]);

    const tableColumns = useMemo(() => generateColumns(), []);

    return (
        <>
            {/* <div className="card"> */}
            {/* <div className="card-header">
                    <div className="row align-items-center gy-3">
                        <div className="col-12 col-lg-4">
                            <h4 className="card-title mb-0 flex-grow-1">Branch Wise Usage</h4>
                        </div>
                    </div>
                </div> */}

            <div className="card-body tw-p-0">
                <TableContainer
                    columns={tableColumns || []}
                    data={tableData || []}
                    tableClass="tw-mb-0"
                    divClass="table-responsive tw-mb-3"
                    theadClass="table-light text-muted align-middle position-sticky top-0 tw-z-10"
                    showFooter={true}
                    trFooterClass="tw-font-bold bg-light tw-sticky tw-bottom-0 tw-z-10"
                ></TableContainer>
            </div>
            {/* </div> */}
        </>
    );
};

export default BranchWiseUsage;
