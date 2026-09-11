import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import { Collapse } from "reactstrap";
import { IFeature } from "./types";
import { TreeNodeContextProvider } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  Folder01Icon as Folder01SolidIcon,
  Folder02Icon as Folder02SolidIcon,
  File01Icon as File01SolidIcon,
  Clock01Icon as ClockSolidIcon,
  Tick01Icon as Tick01SolidIcon,
  Cancel01Icon as Cancel01SolidIcon,
  Alert02Icon as Alert02SolidIcon,
} from "@hugeicons-pro/core-solid-standard";

const levelObj = {
  iconObj: {
    1: { icon: Folder01SolidIcon, iconColor: "#F7C94A" },
    2: { icon: Folder02SolidIcon, iconColor: "#099885" },
    3: { icon: File01SolidIcon, iconColor: "#008ed3" },
    4: { icon: ClockSolidIcon, iconColor: "#f89127" },
  },
  fontSizeObj: {
    1: "14px",
    2: "12px",
    3: "12px",
    4: "12px",
  },
};

const progressStatusObj = {
  completed: {
    icon: Tick01SolidIcon,
    iconColor: "tw-text-green-500",
  },
  inProgress: {
    icon: Cancel01SolidIcon,
    iconColor: "tw-text-red-500",
  },
  notCompleted: {
    icon: Alert02SolidIcon,
    iconColor: "tw-text-yellow-500",
  },
};

export function TreeNode({
  id: featureId,
  parentFeatureId,
  parentsInfo = [],
  level,
  description,
  subFeatures = [],
  type,
  hours,
  code,
  nodeIndex = 0,
  progressStatus,
}: {
  id: string;
  parentFeatureId?: string;
  parentsInfo?: {
    parentFeatureId: string;
    parentFeatureName: string;
    nodeIndex: number;
  }[];
  level: number;
  description: string;
  subFeatures?: IFeature[];
  type: string;
  hours?: number;
  code?: string;
  nodeIndex?: number;
  progressStatus?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { value, toggle } = useContext(TreeNodeContextProvider);

  const pathIndexes = useMemo(
    () => [...(parentsInfo || []).map((p) => p.nodeIndex + 1), nodeIndex + 1],
    [parentsInfo, nodeIndex]
  );
  const displayNumber = pathIndexes.join(".");

  const parentInfoRef = useRef<string[]>(
    (parentsInfo || []).map((item) => item.parentFeatureId)
  );

  const updatedParentInfo = [
    ...(parentsInfo || []),
    {
      parentFeatureId: featureId,
      parentFeatureName: description,
      nodeIndex,
    },
  ];

  useEffect(() => {
    const { ids, action } = value;
    if (
      action === "COLLAPSE" &&
      ids.some((id: string) => parentInfoRef.current.includes(id))
    ) {
      setIsOpen(false);
    } else if (action === "EXPAND_ALL") {
      setIsOpen(true);
    } else if (action === "COLLAPSE_ALL") {
      setIsOpen(false);
    }
  }, [value]);

  const toggleHandler = () => {
    if (isOpen && subFeatures.some((item) => item?.subFeatures?.length > 0)) {
      toggle("COLLAPSE", [featureId]);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="tree-node">
      <div className="custom-row cursor-pointer" onClick={toggleHandler}>
        <div className="custom-column">
          <div
            className={classnames(
              "tw-relative tw-flex tw-items-center feature-column tw-truncate tw-w-full tw-px-0 tw-ps-6",
              level === 1
                ? "tw-text-gray-700 tw-py-[8px] tw-text-medium"
                : "tw-text-gray-500 tw-py-[6px] tw-text-medium tw-w-[94%]"
            )}
            style={{
              marginLeft: `${(level - 1) * 24}px`,
              fontSize: `${levelObj.fontSizeObj?.[level]}`,
            }}
          >
            {subFeatures && subFeatures.length > 0 && (
              <HugeiconsIcon
                icon={isOpen ? MinusSignIcon : PlusSignIcon}
                size={14}
                className="me-2 text-muted tw-flex-shrink-0 tw-absolute tw-left-[0px]"
              />
            )}
            <HugeiconsIcon
              icon={levelObj.iconObj?.[level]?.icon}
              size={18}
              className={`me-2 tw-flex-shrink-0`}
              style={{ color: levelObj.iconObj?.[level]?.iconColor }}
            />
            <p className="me-2 mb-0 tw-flex tw-flex-1 tw-justify-between tw-items-center tw-min-w-0">
              <span className="me-3 featuretext tw-truncate tw-block">{`${displayNumber} . ${description}`}</span>
              {level === 1 ? (
                <HugeiconsIcon
                  icon={
                    progressStatusObj?.[progressStatus ?? "notCompleted"]?.icon
                  }
                  size={16}
                  className={
                    progressStatusObj?.[progressStatus ?? "notCompleted"]
                      ?.iconColor
                  }
                />
              ) : null}
            </p>
          </div>
        </div>
      </div>

      <Collapse isOpen={isOpen}>
        {subFeatures.map((item, idx) => (
          <TreeNode
            id={item?.id}
            key={item?.id}
            level={level + 1}
            parentsInfo={updatedParentInfo}
            parentFeatureId={featureId}
            description={item.description}
            subFeatures={item.subFeatures || []}
            type={item.type}
            hours={item.hours}
            code={item.code}
            nodeIndex={idx}
          />
        ))}
      </Collapse>
    </div>
  );
}
