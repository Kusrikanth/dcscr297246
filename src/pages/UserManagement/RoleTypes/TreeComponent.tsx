import React, { useEffect, useState } from "react";
import "./_treecomponent.scss";
import { InputCheckbox } from "../../../Components/Common";
import { InputCheckboxUpdated } from "../../../Components/Common/InputCheckbox";

import classnames from "classnames";

// const data = [
//     {
//         id: "1",
//         showContent: false,
//         children: [
//             {
//                 id: "1.1",
//                 showContent: true,
//                 name: "Sub Module 1"
//             },
//             {
//                 id: "1.2",
//                 showContent: true,
//                 name: "Sub Module 2"
//             }
//         ]
//     },
//     {
//         id: "2",
//         showContent: false, children: [
//             {
//                 id: "2.1",
//                 showContent: true,
//                 name: "Sub Module 2.1"
//             },
//             {
//                 id: "2.2",
//                 showContent: true,
//                 name: "Sub Module 2.2"
//             }
//         ]
//     },
//     {
//         id: "3",
//         showContent: false, children: [
//             {
//                 id: "3.1",
//                 showContent: true,
//                 name: "Sub Module 3.1"
//             },
//             {
//                 id: "3.2",
//                 showContent: true,
//                 name: "Sub Module 3.2"
//             }
//         ]
//     }
//     ,
//     {
//         id: "4",
//         showContent: false,
//         children: [
//             {
//                 id: "4.1",
//                 showContent: true,
//                 name: "Sub Module 4.1"
//             },
//             {
//                 id: "4.2",
//                 showContent: true,
//                 name: "Sub Module 4.2"
//             }
//         ]
//     }
// ]
export default function TreeComponent(props: any) {
    const { permissionDetails } = props;
    const [dataState, setDataState] = useState<any>([]);

    useEffect(() => {
        if (Array.isArray(permissionDetails)) {
            setDataState(permissionDetails);
        }
    }, [permissionDetails]);

    function showContentHndlr(event: any) {
        const dataId = event.currentTarget.getAttribute("data-id");
        const updateData = [...dataState],
            indexOf = updateData.findIndex(item => item.id === Number(dataId));
        if (indexOf >= 0) {
            const data = updateData[indexOf];
            updateData.splice(indexOf, 1, { ...data, showContent: !data.showContent });
            setDataState(updateData);
        }
    }

    return (
        <div className="tree-container">
            <div className="d-flex align-items-center">
                <span onClick={() => { }} className="expandable-icon">
                    <i className={"ri-subtract-fill"}></i>
                </span>
                <span className="horizontal-line"></span>
                <InputCheckboxUpdated
                    name="test"
                    labelName="Select All"
                    formgroupClassName="mb-0"
                    // value={false}
                    // onChange={() => { }}
                    dataId={"2"}
                />
            </div>
            <div className="module-container">
                <div className="top-spacing-line">
                </div>
                {Array.isArray(dataState) && dataState.map((item: any) => <>
                    <div key={`item-${item.id}`} className="position-relative pb-1">
                        <div className="d-flex align-items-center">
                            <span data-id={item.id} onClick={showContentHndlr} className="expandable-icon">
                                <i className={classnames(item.showContent ? "ri-subtract-fill" : "ri-add-fill")}></i>
                            </span>
                            <span className="horizontal-line"></span>
                            <InputCheckboxUpdated
                                name={`module-${item.id}`}
                                labelName={item.name}
                                formgroupClassName="mb-0"
                                // value={false}
                                // onChange={() => { }}
                                dataId={"2"}
                            />
                        </div>
                        {item.showContent && <><div className="submodule-container">
                            <SubModuleContainer subModules={item.subModules} />
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
        <><div className="top-spacing-line">
        </div>
            {Array.isArray(subModules) && (subModules.map((item, index) => <>
                <div key={`submodule-${item.id}`} className="tw-flex tw-items-start tw-relative tw-pb-3">
                    {(index !== subModules.length - 1) && (
                        <div className="vertical-line"></div>
                    )}
                    <div className="tw-grid tw-grid-cols-12 tw-flex-1 tw-gap-4">
                        <div className="tw-col-span-12 md:tw-col-span-5">
                            <div className="tw-flex tw-items-center">
                                <span className="expandable-icon">
                                    <i className="ri-subtract-fill"></i>
                                </span>
                                <span className="horizontal-line"></span>
                                <InputCheckboxUpdated
                                    name={`submodule-${item.id}`}
                                    labelName={item.name}
                                    formgroupClassName="tw-mb-0 tw-mr-4 tw-whitespace-nowrap"
                                    dataId={"2"}
                                />
                            </div>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-7">
                            <div className="tw-flex tw-items-center tw-flex-wrap tw-gap-x-4 tw-gap-y-2">
                                {Array.isArray(item.permissions) &&
                                    item.permissions.map((permissions: any) => (
                                        <React.Fragment key={`permissions-${permissions.id}`}>
                                            <InputCheckboxUpdated
                                                name={`permission-${item.id}`}
                                                labelName={permissions.displayName}
                                                formgroupClassName="tw-mb-0 tw-whitespace-nowrap"
                                                dataId={"2"}
                                            />
                                        </React.Fragment>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>))
            }</>
    )
}