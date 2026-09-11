import { useMemo, useState, type ChangeEvent, type MouseEvent } from "react";

import UpdatedHorizontalTab from "../../../../../../Components/Common/UpdatedHorizontalTab";
import { SelectInput } from "../../../../../../Components/Common";
import type { BusinessUnitConfig } from "../../../businessunitconfig";
import LinkRules from "./LinkRules";
import SectionManager from "./SectionManager";
import SectionValues from "./SectionValues";
import {
    configLinkRules,
    type ConfigLinkRule,
    type ConfigSection,
    type ConfigSectionValue,
} from "./helper";

interface ConfigurationProps {
    pipelines: BusinessUnitConfig["leadPipelines"];
    sections: Array<ConfigSection>;
    onSectionsChange: (sections: Array<ConfigSection>) => void;
}

const Configuration = ({
    pipelines,
    sections,
    onSectionsChange,
}: ConfigurationProps) => {
    const [rules, setRules] =
        useState<Array<ConfigLinkRule>>(configLinkRules);
    const [activeId, setActiveId] = useState<string>("manage");
    const [pipelineFilter, setPipelineFilter] = useState<string>("");

    const visibleSections = useMemo(
        () =>
            sections.filter(
                section =>
                    !pipelineFilter ||
                    !section.pipelineId ||
                    section.pipelineId === pipelineFilter,
            ),
        [sections, pipelineFilter],
    );

    const menuOptions = useMemo(
        () => [
            ...visibleSections.map(section => ({
                id: section.id,
                labelName: section.displayName,
                customPadding: "0px 10px 0px 10px",
                count: section.values.length,
            })),
            {
                id: "links",
                labelName: "Linked Configuration",
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "manage",
                labelName: "Manage Sections",
                customPadding: "0px 10px 0px 10px",
            },
        ],
        [visibleSections],
    );

    const activeSection = visibleSections.find(
        section => section.id === activeId,
    );

    const clickMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveId(menuId);
        }
    };

    const pipelineFilterChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        setPipelineFilter(event.target.value);
        setActiveId("manage");
    };

    const sectionValuesChangeHandler = (
        sectionId: string,
        values: Array<ConfigSectionValue>,
    ) =>
        onSectionsChange(
            sections.map(section =>
                section.id === sectionId ? { ...section, values } : section,
            ),
        );

    return (
        <>
            {pipelines.length > 1 && (
                <div className="tw-card tw-mb-3">
                    <div className="tw-card-body">
                        <div className="row tw-items-end">
                            <div className="col-12 col-md-6 col-xl-4">
                                <SelectInput
                                    name="pipelineFilter"
                                    labelText="Lead Pipeline"
                                    defaultSelect="All pipelines"
                                    value={pipelineFilter}
                                    onChange={pipelineFilterChangeHandler}
                                    menuItems={pipelines.map(pipeline => ({
                                        id: pipeline.id,
                                        name: pipeline.displayName,
                                    }))}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-8">
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    Shows this pipeline&apos;s configuration plus
                                    anything shared across the unit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <UpdatedHorizontalTab
                MenuOptions={menuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge
                horizontalClass=""
            />

            <div className="tw-mt-3">
                {activeId === "links" && (
                    <LinkRules
                        sections={sections}
                        pipelines={pipelines}
                        rules={rules}
                        onChange={setRules}
                    />
                )}

                {activeId === "manage" && (
                    <SectionManager
                        sections={sections}
                        pipelines={pipelines}
                        onChange={onSectionsChange}
                        onOpenValues={setActiveId}
                    />
                )}

                {activeSection && (
                    <SectionValues
                        key={activeSection.id}
                        section={activeSection}
                        onChange={values =>
                            sectionValuesChangeHandler(
                                activeSection.id,
                                values,
                            )
                        }
                    />
                )}
            </div>
        </>
    );
};

export default Configuration;
