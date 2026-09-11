import React, { useEffect } from 'react';
import { commonCardTypes } from './CommonCardTypes';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getBranchCardAnalysisAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { SkeletonLoader } from '../../../Components/Common';


const CommonCard = (props: commonCardTypes) => {

const dispatch = useAppDispatch();
    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        getClassWiseAnalysisResp,
        brchCardCurriculumResp
    } = useAppSelector(
        ({ instAcademics, branchAcademics, appData,applicationSale}) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getClassWiseAnalysisResp: applicationSale.getClassWiseAnalysisResp,
            brchCardCurriculumResp: applicationSale.brchCardCurriculumResp
        }),
        shallowEqual
    );
    
    useEffect(() => {
        getCurriculumApiCall();
    }, []);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCardAnalysisAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const cardCurriculumData = brchCardCurriculumResp?.data?.map((item: any) => {
        const matchingCurriculum = props?.curriculumData?.value?.find(
            (curriculum: { key: string }) => curriculum.key === item.curriculumName
        );
        return {
            curriculumName: item?.curriculumName.split(' ')[0],
            value: matchingCurriculum ? matchingCurriculum?.value : 0,
        };
    }) || [];
        

    return (
        <React.Fragment>
            <div
                className="tw-bg-white tw-mb-3 tw-pt-3 tw-pb-2 tw-px-0 tw-rounded-xl"
                style={{ backgroundColor: `${props.bgColor}` }}
            >
                <div className="tw-px-3 tw-flex tw-justify-between tw-items-center">

                    <div className="tw-flex tw-items-center tw-gap-2">

                        <div
                            className="tw-flex tw-items-center tw-justify-center tw-mb-3 tw-bg-white tw-rounded-full"
                            style={{ width: "48px", height: "48px" }}
                        >
                            <img
                            src={props.cardIcon}
                            alt="card icon"
                            className="img-fluid"
                            ></img>
                        </div>

                        <h6 className="tw-flex tw-items-center tw-mr-2 tw-text-sm tw-font-medium">
                            {props.cardMainText}
                        </h6>
                    </div>

                    <div className="tw-flex tw-items-center tw-justify-between">
                        <h4 className="tw-text-xl tw-font-semibold">
                            {props.cardMainAmount}
                        </h4>
                    </div>
                </div>

                <div className="tw-grid tw-grid-cols-3 tw-bg-white tw-p-2 tw-mx-3 tw-my-1 tw-rounded-xl">

                    {[...Array(3)].map((_, index) => {
                        const curriculum =
                            cardCurriculumData[index] || { curriculumName: "", value: "" };

                        return (
                            <div
                                key={index}
                                className={`tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center
                                    ${index !== 2 ? "tw-border-r tw-border-gray-200" : ""}
                                `}
                            >
                                {curriculum?.curriculumName ? (
                                    <div className="tw-mb-1">
                                        <span className="tw-text-sm tw-font-medium">
                                            {curriculum?.value}
                                        </span>
                                    </div>
                                ) : (
                                    <SkeletonLoader width="50%" height="10px" />
                                )}

                                {curriculum?.curriculumName ? (
                                    <div>
                                        <h6 className="tw-text-xs tw-text-gray-500 tw-font-normal tw-truncate">
                                            {curriculum?.curriculumName}
                                        </h6>
                                    </div>
                                ) : (
                                    <SkeletonLoader width="100%" height="10px" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
          </React.Fragment>
    );
};

export default CommonCard;
