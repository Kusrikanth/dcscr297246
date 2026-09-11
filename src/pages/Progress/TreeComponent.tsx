import React, { useState } from "react";
import "./_treecomponent.scss";
import { InputCheckbox } from "../../Components/Common";
import classnames from "classnames";

const data = [
    {
        id: "1",
        showContent: false,
        children: [
            {
                id: "1.1",
                showContent: true,
                name: "Sub Module 1"
            },
            {
                id: "1.2",
                showContent: true,
                name: "Sub Module 2"
            }
        ]
    },
    {
        id: "2",
        showContent: false, children: [
            {
                id: "2.1",
                showContent: true,
                name: "Sub Module 2.1"
            },
            {
                id: "2.2",
                showContent: true,
                name: "Sub Module 2.2"
            }
        ]
    },
    {
        id: "3",
        showContent: false, children: [
            {
                id: "3.1",
                showContent: true,
                name: "Sub Module 3.1"
            },
            {
                id: "3.2",
                showContent: true,
                name: "Sub Module 3.2"
            }
        ]
    }
    ,
    {
        id: "4",
        showContent: false,
        children: [
            {
                id: "4.1",
                showContent: true,
                name: "Sub Module 4.1"
            },
            {
                id: "4.2",
                showContent: true,
                name: "Sub Module 4.2"
            }
        ]
    }
]
export default function TreeComponent(props: any) {
    const { permissionDetails } = props;
    const [dataState, setDataState] = useState(data);

    function showContentHndlr(event: any) {
        const dataId = event.currentTarget.getAttribute("data-id");
        const updateData = [...dataState],
            indexOf = updateData.findIndex(item => item.id === dataId);
        if (indexOf >= 0) {
            const data = updateData[indexOf];
            updateData.splice(indexOf, 1, { ...data, showContent: !data.showContent });
            setDataState(updateData);
        }
    }
    return (
        <div className="tree-container">
            <div className="tw-flex tw-items-center">
                <span onClick={() => { }} className="expandable-icon">
                    <i className={"ri-subtract-fill"}></i>
                </span>
                <span className="horizontal-line"></span>
                <InputCheckbox
                    name="test"
                    labelName="Select All"
                    formgroupClassName="tw-mb-0"
                    value={false}
                    onChange={() => { }}
                    dataId={"2"}
                />
            </div>
            <div className="module-container">
                <div className="top-spacing-line">
                </div>
                {dataState.map((item: any) => <>
                    <div key={`item-${item.id}`} className="tw-relative tw-pb-2">
                        <div className="tw-flex tw-items-center">
                            <span data-id={item.id} onClick={showContentHndlr} className="expandable-icon">
                                <i className={classnames(item.showContent ? "ri-subtract-fill" : "ri-add-fill")}></i>
                            </span>
                            <span className="horizontal-line"></span>
                            <InputCheckbox
                                name="test"
                                labelName="Main Settings"
                                formgroupClassName="tw-mb-0"
                                value={false}
                                onChange={() => { }}
                                dataId={"2"}
                            />
                        </div>
                        {item.showContent && <><div className="submodule-container">
                            <SubModuleContainer subModules={item.children} />
                        </div>
                        </>}
                        <div className="vertical-line">

                        </div>
                    </div>

                </>)
                }
            </div>
        </div >
    )
}

function SubModuleContainer({ subModules }: any) {
    return (
        <>{Array.isArray(subModules) && (subModules.map((item, index) => <>
            <div className="top-spacing-line">
            </div>
            <div key={`submodule-${item.id}`} className="tw-flex tw-items-center">
                <span className="expandable-icon">
                    <i className="ri-subtract-fill"></i>
                </span>
                <span className="horizontal-line"></span>
                <InputCheckbox
                    name="test"
                    labelName="Sub Module"
                    formgroupClassName="tw-mb-0 tw-me-4"
                    value={false}
                    onChange={() => { }}
                    dataId={"2"}
                />
                <div className="tw-flex tw-items-center"> <InputCheckbox
                    name="test"
                    labelName="Permission 1"
                    formgroupClassName="tw-mb-0 tw-me-2"
                    value={false}
                    onChange={() => { }}
                    dataId={"2"}
                /> <InputCheckbox
                        name="test"
                        labelName="Permission 2"
                        formgroupClassName="tw-mb-0 tw-me-2"
                        value={false}
                        onChange={() => { }}
                        dataId={"2"}
                    /></div>
            </div>
            {/* {(index === (subModules.length - 1)) && <div className="last-submodule-spacing">
            </div>} */}

        </>))}</>
    )
}