import React, { useContext, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { Collapse } from "reactstrap";
import { IFeature, ISubTreeParentInfo } from "./types";
import { TreeContextProvider } from "./helper";

export function ModuleTree({ id: featureId, parentFeatureId,
    parentsInfo = [],
    level, description, subFeatures, showInstituteAdminUI }: {
        id: string, parentFeatureId: string, parentsInfo: ISubTreeParentInfo[],
        level: number, description: string, subFeatures: IFeature[], showInstituteAdminUI: any
    }) {
    const [isOpen, setIsOpen] = useState(false);
    const { value, editModuleHandler, toggle } = useContext(TreeContextProvider);

    const parentInfoRef = useRef<string[]>(parentsInfo.map(item => item.parentFeatureId));
    const updatedParentInfo = [...parentsInfo];
    updatedParentInfo.push({ parentFeatureId: featureId, parentFeatureName: description });
    
    const isRootGoal = level === 1;
    
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
    
    function editHandler(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        editModuleHandler({
            isRootFeature: level === 1,
            parentFeatureId,
            featureId,
            featureName: description,
            parentsInfo
        });
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
                            {description}
                        </span>
                        
                        {isRootGoal && (
                            <div className="feature-actions">
                                {showInstituteAdminUI && <button title="Edit Feature" className="featurebtn" onClick={editHandler}>
                                    <i className="ri-pencil-fill text-info cursor-pointer"></i>
                                </button>}
                            </div>
                        )}
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
                                showInstituteAdminUI={showInstituteAdminUI}
                            />
                        ))
                    }
                </>
            </Collapse>

        </React.Fragment>
    )
}