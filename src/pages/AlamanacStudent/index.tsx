import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { DateInput, TextInput } from "../../Components/Common";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { getAlamanacList } from "../../store/academic/academicRequest/academicrequestactions";
//Action Generator
import { generateActionPayload } from "../../utility/reduxutility";
import Button from "../../Components/Common/Button";

export default function Alamanac() {
    const [studentDetailsState, setStudentDetailsState] = useState<any>({});
    const [fileUrlState, setFileUrlState] = useState("");
    const dispatch = useAppDispatch();
    const {
        currentInstIdResp: instituteId, currentBranchIdResp: branchId, currentStudentId, parentChildrensResp,
        alamanacListResp, academicRequestErrorResp }: any = useAppSelector(
            ({ globalData, appData, directoryStudent, academicRequest }) => ({
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentStudentId: appData.currentStudentId,
                showApiLoader: globalData.showApiLoader,
                alamanacListResp: academicRequest.alamanacListResp,
                parentChildrensResp: directoryStudent.parentChildrensResp,
                academicRequestErrorResp: academicRequest.academicRequestErrorResp,
            }),
            shallowEqual
        );

    const alamanacStudentRef = useRef({
        prevAlamanacListResp: alamanacListResp,
        prevAcademicRequestErrorResp: academicRequestErrorResp
    })

    useEffect(() => {
        const { prevAlamanacListResp, prevAcademicRequestErrorResp } = alamanacStudentRef.current;
        if (alamanacListResp && prevAlamanacListResp !== alamanacListResp) {

            if (Array.isArray(alamanacListResp?.data)) {
                const { fileInfo } = alamanacListResp.data?.[0] || {};
                setFileUrlState(fileInfo);
            }
        } else if (academicRequestErrorResp && prevAcademicRequestErrorResp !== academicRequestErrorResp) {
            const { message } = academicRequestErrorResp;
            toast.error(message || "Something went wrong.");
        }
        alamanacStudentRef.current.prevAlamanacListResp = alamanacListResp;
        alamanacStudentRef.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
    }, [alamanacListResp, academicRequestErrorResp]);


    // useEffect(() => {
    //     if (currentStudentId && parentChildrensResp) {
    //         return parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId) || {};
    //     }
    // }, [])

    useEffect(() => {
        if (Array.isArray(parentChildrensResp)) {
            const studentInfo = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId);
            setStudentDetailsState(studentInfo);
            const payload = {
                branchId: studentInfo?.childBranchId,
                searchString: "",
                academicYearId: studentInfo?.academicYearId,
                curriculumId: studentInfo?.curriculumId,
                classId: studentInfo?.classId,
                pageNo: 0, pageSize: 1
            }
            dispatch(getAlamanacList(generateActionPayload("get_alamanac_list", undefined, payload)));
        }
    }, [currentStudentId, parentChildrensResp]);

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="Parent" />

                <div className="tw-bg-white tw-rounded-lg tw-shadow">

                    <div className="tw-border-b tw-px-4 tw-py-3">
                        <div className="tw-flex tw-items-center">
                            <div className="tw-flex-1">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Student Almanac
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="tw-p-4">
                        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4">
                            <div className="lg:tw-col-span-3">
                                <TextInput
                                    name="curriculumName"
                                    isDisabled={true}
                                    labelText="Curriculum"
                                    value={studentDetailsState?.curriculumName}
                                    onChange={null}
                                />
                            </div>
                            <div className="lg:tw-col-span-3">
                                <TextInput
                                    name="classId"
                                    isDisabled={true}
                                    labelText="Class"
                                    value={studentDetailsState?.className}
                                    onChange={null}
                                />
                            </div>
                            <div className="lg:tw-col-span-3">
                                <TextInput
                                    name="classId"
                                    isDisabled={true}
                                    labelText="Section"
                                    value={studentDetailsState?.sectionName}
                                    onChange={null}
                                />
                            </div>
                            <div className="tw-col-span-1 lg:tw-col-span-12">
                                <div className="tw-flex tw-justify-end">
                                    <a href={fileUrlState} target="_blank" rel="noopener noreferrer">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={!fileUrlState}
                                        >
                                            Download PDF
                                        </Button>
                                    </a>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}