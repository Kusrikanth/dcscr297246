import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrayHelpers } from 'formik';
import BreadCrumb from '../../../../../../Components/Common/BreadCrumb';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/storehook';
import classnames from "classnames";
import CreateQuestionBank from './CreateQuestionBank';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlayCircleIcon } from '@hugeicons-pro/core-stroke-standard';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../../../../utility/reduxutility';
import { getQuestionTypesAct } from '../../../../../../store/lms/lmssettings/lmssettingsaction';
import { useLocation } from 'react-router-dom';
import { getQuestionBankByIdAct } from '../../../../../../store/lms/lmsAssessment/lmsAssessmentaction';

// Component mapping for different question types
function getActiveMenuComponent(menuId: string | null, questionTypesResp?: IQuestionType[]) {
    if (!menuId) return null;

    if (!questionTypesResp) return null;

    if (questionTypesResp) {
        const questionType = questionTypesResp?.find(qt => qt.shortName === menuId);
        if (questionType) {
            switch (questionType.questionType) {
                case "Multiple Choice":
                case "Single Choice":
                    return CreateQuestionBank; 
                case "Short Answer":
                case "1-Line Answer":
                    return CreateQuestionBank;
                case "Very Long Answer":
                    return CreateQuestionBank; 
                default:
                    return CreateQuestionBank;
            }
        }
    }

}

interface IMenuOptions {
    id: string;
    labelName: string;
    iconClass: string;
    shortName: string;
}

// Interface for the API response
interface IQuestionType {
    id: number;
    questionType: string;
    shortName: string;
    typicalMarks: string;
    formatStyle: string;
    tags: string;
}

// Function to map question type to appropriate icon
function getIconForQuestionType(questionType: string): string {
    const typeIconMap: { [key: string]: string } = {
        'Multiple Choice': 'ri-list-check',
        'Single Choice': 'ri-checkbox-circle-line',
        'Short Answer': 'ri-input-method-line',
        'Very Long Answer': 'ri-article-line',
        '1-Line Answer': 'ri-edit-line',
        'Fill In The Blanks': 'ri-input-method-line',
        'Classify, Match & Order': 'ri-layout-grid-line',
        'Written & Recorded': 'ri-pencil-line',
        'Passage': 'ri-book-open-line',
        'Highlight': 'ri-focus-3-line',
        'Math': 'ri-functions',
        'Graphing': 'ri-line-chart-line',
        'Charts': 'ri-bar-chart-line',
        'Multipart': 'ri-links-line',
        'Instructions': 'ri-play-circle-line'
    };
    
    return typeIconMap[questionType] || 'ri-question-line';
}

// Function to convert question type name to kebab-case id
function generateMenuId(questionType: string): string {
    return questionType
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

interface LocationState {
    questionBankId?: string | number;
}

const AddQuestion = () => {
    const location = useLocation<LocationState>();
    const dispatch = useAppDispatch();
    const [activeMenuId, setActiveMenuId] = useState<string | null>("MCQ");

    const questionBankId = location.state?.questionBankId ?? null;
    const isEditMode = !!questionBankId; 

    const {
        getQuestionTypesResp,
        getQuestionBankByIdResp,
    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData, lmsAssessment, lmsSettings }) => ({
            getQuestionTypesResp: lmsSettings.getQuestionTypesResp,
            getQuestionBankByIdResp: lmsAssessment.getQuestionBankByIdResp,
        }),
        shallowEqual
    );

    const MenuOptions: IMenuOptions[] = useMemo(() => {
        if (!getQuestionTypesResp || !Array.isArray(getQuestionTypesResp?.data)) {
            // Fallback to static menu options if API response is not available
            return [
                { id: "multiple-choice", labelName: "Multiple Choice", iconClass: "ri-list-check", shortName: "MCQ" },
                { id: "fill-blanks", labelName: "Fill In The Blanks", iconClass: "ri-input-method-line", shortName: "FIB" },
                { id: "classify-match", labelName: "Classify, Match & Order", iconClass: "ri-layout-grid-line", shortName: "CMO" },
                { id: "written-recorded", labelName: "Written & Recorded", iconClass: "ri-pencil-line", shortName: "WR" },
                { id: "passage", labelName: "Passage", iconClass: "ri-book-open-line", shortName: "P" },
                { id: "highlight", labelName: "Highlight", iconClass: "ri-focus-3-line", shortName: "H" },
                { id: "math", labelName: "Math", iconClass: "ri-functions", shortName: "M" },
                { id: "graphing", labelName: "Graphing", iconClass: "ri-line-chart-line", shortName: "G" },
                { id: "charts", labelName: "Charts", iconClass: "ri-bar-chart-line", shortName: "C" },
                { id: "multipart", labelName: "Multipart", iconClass: "ri-links-line", shortName: "MP" },
                { id: "instructions", labelName: "Instructions", iconClass: "ri-play-circle-line", shortName: "I" }
            ];
        }

        return getQuestionTypesResp?.data.map((questionType: IQuestionType) => ({
            id: generateMenuId(questionType.questionType),
            labelName: questionType.questionType,
            iconClass: getIconForQuestionType(questionType.questionType),
            shortName: questionType.shortName.toUpperCase()
        }));
    }, [getQuestionTypesResp]);

    
    useEffect(() => {
        if (isEditMode && getQuestionBankByIdResp && getQuestionBankByIdResp.questionTypeShortName) {

            setActiveMenuId(getQuestionBankByIdResp.questionTypeShortName);
        } else if (MenuOptions.length > 0 && !activeMenuId && !isEditMode) {
            setActiveMenuId(MenuOptions[0].shortName);
        }
    }, [MenuOptions, activeMenuId, isEditMode, getQuestionBankByIdResp]);

    useEffect(() => {
        if (questionBankId) {
             dispatch(getQuestionBankByIdAct(generateActionPayload("get_question_bank_repository_by_id", { id: questionBankId })));
        }
    }, [questionBankId]);

    const getQuestionTypeApiCall = (otherProps?: any) => {
        let payload = {
            ...otherProps,
        };
        dispatch(getQuestionTypesAct(generateActionPayload("get_question_types", undefined, payload)));
    };

    useEffect(() => {
        getQuestionTypeApiCall();
    }, []);

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event;        
        const menuId = currentTarget.getAttribute("data-id");
        setActiveMenuId(menuId);
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeMenuId, getQuestionTypesResp?.data);
        return TabComponent ? (
            <TabComponent 
                activeMenuId={activeMenuId} 
                questionTypesResp={getQuestionTypesResp?.data}
                isEditMode={isEditMode}
                editData={isEditMode ? getQuestionBankByIdResp : null}
                id={questionBankId}
            />
        ) : null;
    }, [activeMenuId, getQuestionTypesResp, isEditMode, getQuestionBankByIdResp]);

    return (
        <>
            <div className="page-content lms_faq">
                <div className="container-fluid LMS">
                    <BreadCrumb title="LMS" pageTitle="LMS" />
                    <div className="card shadow-sm">
                        <div className="card-header pb-0">
                            <div className="row mb-2">
                                <div className='col-8 d-grid align-items-center'>
                                    <h4 className="card-title fs-12">
                                        {isEditMode ? 'Edit Question' : 'Create Question'}
                                    </h4>
                                    <h4 className="card-title fs-12 fw-normal text-muted">
                                        {isEditMode ? 'Edit Your Question' : 'Create Your Own Customized Question'}
                                    </h4>
                                </div>
                                <div className='col-auto ms-auto d-flex align-items-center'>
                                    <a href="#" className="d-flex align-items-center text-info fs-12">
                                        <span className="fw-medium me-1">Help Video</span>
                                        <HugeiconsIcon icon={PlayCircleIcon} className="me-2 text-info" size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-2">
                            <div className='row pe-3'>
                                <div className='col-md-3 col-12 px-0'>
                                    <div className="lms_setup_wrapper master-setup-wrapper">
                                        <div className='card-body'>
                                            <div className="menu-container-box">
                                                <div className="menu-border-frame">
                                                    <ul className="left-menu-section lms">
                                                        {MenuOptions.map((item) => (
                                                            <li
                                                                data-id={item.shortName}
                                                                onClick={clickMenuHandler}
                                                                className={classnames("menu-item", { active: item.shortName === activeMenuId })}
                                                                key={item.id}
                                                            >
                                                                <i className={classnames(item.iconClass, "ri-icon")} />
                                                                <span className="menu-label">{item.labelName}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-9 col-12 px-0'>
                                    {activeComponent}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddQuestion