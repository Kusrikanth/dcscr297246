import React, { useContext, useState } from 'react';
import { InputCheckbox } from "../../../../Components/Common";
import classnames from "classnames";
import { AudienceSelectorProvider } from "./helper";
import "./_treecomponent.scss";

function RenderClasses({ curriculumId, classId, className, shortName, isSelected, sections = [] }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const { selectTreeRowHndlr } = useContext(AudienceSelectorProvider);

    function onClickHndlr() {
        setIsOpen(!isOpen);
    }

    function onChangeClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target;
        if (!curriculumId || !classId) return;
        selectTreeRowHndlr({
            rowType: 'CLASS',
            curriculumId,
            classId,
            checked
        })
    }

    function onChangeSectionHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target;
        const sectionId = event.currentTarget.getAttribute('data-id');
        if (!curriculumId || !classId || !sectionId) return;
        selectTreeRowHndlr({
            rowType: 'SECTION',
            curriculumId,
            classId,
            sectionId,
            checked
        })
    }

    return (
        <React.Fragment>
            <div className="custom-row">
                <div className="custom-column">
                    <InputCheckbox
                        name={`class-${classId}`}
                        value={isSelected}
                        onChange={onChangeClassHndlr}
                        formgroupClassName="mb-0"
                    />
                </div>
                <div className="custom-column" onClick={onClickHndlr}>
                    <div className="feature-column" style={{ marginLeft: '18px' }}>
                        <i
                            className={classnames("ri-arrow-right-s-line cursor-pointer arrow-icon",
                                isOpen ? 'openmenu' : 'closemenu'
                            )} style={{
                                color: '#405189'
                            }}></i>
                        <span>{className}</span>
                    </div>
                </div>
            </div>
            {isOpen && <div style={{ display: 'contents' }}>
                <div className='custom-row'>
                    <div className='custom-column'>
                    </div>
                    <div className="custom-column">
                        <div className=' d-flex' style={{ flexWrap: 'wrap', gap: '0.675rem', marginLeft: '36px' }}>
                            {
                                Array.isArray(sections) && sections.map(item => (
                                    <InputCheckbox
                                        key={`sectionId-${item.sectionId}`}
                                        name={`sectionId-${item.sectionId}`}
                                        labelName={item?.sectionName}
                                        dataId={item.sectionId}
                                        value={item.isSelected}
                                        onChange={onChangeSectionHndlr}
                                        formgroupClassName="mb-0"
                                    />
                                ))
                            }
                        </div>

                    </div>
                </div>


            </div>}
        </React.Fragment >
    )
}

function RenderCurriculums({ curriculumId = "", curriculumName = "", isSelected = false, classes = [] }: any) {
    const { selectTreeRowHndlr } = useContext(AudienceSelectorProvider);
    const [isOpen, setIsOpen] = useState(false);

    function onClickHndlr() {
        setIsOpen(!isOpen);
    }

    function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target;
        if (!curriculumId) return;
        selectTreeRowHndlr({
            rowType: 'CURRICULUM',
            curriculumId,
            checked
        })
    }

    return (
        <React.Fragment>
            <div className="custom-row">
                <div className="custom-column">
                    <InputCheckbox
                        name={`curriculum-${curriculumId}`}
                        value={isSelected}
                        dataId={curriculumId}
                        onChange={onChangeHndlr}
                        formgroupClassName="mb-0"
                    />
                </div>
                <div className="custom-column" onClick={onClickHndlr}>
                    <div className="feature-column">
                        <i
                            className={classnames("ri-arrow-right-s-line cursor-pointer arrow-icon",
                                isOpen ? 'openmenu' : 'closemenu'
                            )} style={{
                                color: '#405189'
                            }}></i>
                        <span>{curriculumName}</span>
                    </div>
                </div>
            </div>
            {isOpen && <div style={{ display: 'contents' }}>
                {
                    Array.isArray(classes) && classes.map(item => (
                        <RenderClasses
                            key={`class-${item.classId}`}
                            curriculumId={curriculumId}
                            {...item} />
                    ))
                }
            </div>}
        </React.Fragment >
    )
}

export default function TreeComponent({ selecteAllHndlr, isAllSelected, curriculumClass }: any) {
    return (
        <div className="modules-container"
            style={{
                gridTemplateColumns: `45px 1fr`
            }}
        >
            <div className="custom-row header">
                <div className="custom-column">
                    <InputCheckbox
                        name="all-curriculum-selectore"
                        value={isAllSelected}
                        onChange={selecteAllHndlr}
                        formgroupClassName="mb-0"
                    />
                </div>
                <div className="custom-column">Select All</div>
            </div>
            {
                Array.isArray(curriculumClass) && curriculumClass.map(item => (
                    <RenderCurriculums
                        key={`curriculum-${item.curriculumId}`}
                        {...item}
                    />
                ))
            }
        </div>
    )
}