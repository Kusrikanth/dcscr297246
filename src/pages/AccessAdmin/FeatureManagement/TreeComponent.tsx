import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import { Collapse } from "reactstrap";
import { IFeature, ISubTreeParentInfo } from "./types";
import { TreeContextProvider } from "./helper";

export function ModuleTree({ id: featureId, parentFeatureId,
    parentsInfo = [],
    level, description, subFeatures }: {
        id: string, parentFeatureId: string, parentsInfo: ISubTreeParentInfo[],
        level: number, description: string, subFeatures: IFeature[]
    }) {
    const [isOpen, setIsOpen] = useState(false);
    const { value, editModuleHandler, addModuleHandler, deleteModuleHndlr, toggle } = useContext(TreeContextProvider);

    const parentInfoRef = useRef<string[]>(parentsInfo.map(item => item.parentFeatureId));
    const updatedParentInfo = [...parentsInfo];
    updatedParentInfo.push({ parentFeatureId: featureId, parentFeatureName: description });
    useEffect(() => {
        const { ids, action } = value;
        if (action === 'COLLAPSE' && ids.some(element => parentInfoRef.current.includes(element))) {
            setIsOpen(false);
        }else if(action === 'EXPAND_ALL'){
            setIsOpen(true);
        }else if(action === 'COLLAPSE_ALL'){
            setIsOpen(false);
        }
    }, [value, parentInfoRef]);

    function toggleHandler() {
        if (isOpen && subFeatures.some(item => item?.subFeatures?.length > 0)) {
            toggle('COLLAPSE', [featureId]);
        }
        setIsOpen(prevState => !prevState);
    }

    function addHandler(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        addModuleHandler({
            isRootFeature: level === 1,
            featureId,
            featureName: description,
            parentsInfo
        });
        //consolde
    }
    function editHandler(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        editModuleHandler({
            isRootFeature: level === 1,
            parentFeatureId,
            featureId,
            featureName: description,
            parentsInfo
        });
        //consolde
    }
    function deleteHandler(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        deleteModuleHndlr({
            isRootFeature: level === 1,
            featureId,
            featureName: description,
            subFeatureNames: subFeatures.map((item) => item.description)
        });
        //consolde
    }

    return (
        <React.Fragment>
            <div className="custom-row cursor-pointer" onClick={toggleHandler}>
                <div className="custom-column">
                    <div className="feature-column" style={{ marginLeft: `${(level - 1) * 30}px` }}>
                        {(Array.isArray(subFeatures) && subFeatures.length > 0) && <i
                            className={classnames("ri-arrow-right-s-line cursor-pointer arrow-icon",
                                isOpen ? 'openmenu' : 'closemenu'
                            )} style={{
                                color: '#405189'
                            }}></i>}
                        <span className="me-3 featuretext">
                            {/* {`ParentId - `} {JSON.stringify(parentFeatureId)} {' - '}*/}
                            {/* {`FeatureId - `} {JSON.stringify(featureId)} {' - '} */}
                            {description}</span>
                        <div className="feature-actions">
                            <button title="Add Sub-Feature" className="featurebtn" onClick={addHandler}>
                                <i className="ri-add-circle-fill text-success cursor-pointer"></i>
                            </button>
                            <button title="Edit Feature" className="featurebtn" onClick={editHandler}>
                                <i className="ri-pencil-fill text-info cursor-pointer"></i>
                            </button>
                            <button title="Delete Feature" className="featurebtn" onClick={deleteHandler}>
                                <i className="ri-delete-bin-fill text-danger cursor-pointer"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Collapse isOpen={isOpen}>
                <>
                    {
                        subFeatures.map((item) => (
                            <ModuleTree
                                key={item.id}
                                level={level + 1}
                                parentsInfo={updatedParentInfo}
                                parentFeatureId={featureId}
                                {...item}
                            />
                        ))
                    }
                </>
            </Collapse>

        </React.Fragment>
    )
}
