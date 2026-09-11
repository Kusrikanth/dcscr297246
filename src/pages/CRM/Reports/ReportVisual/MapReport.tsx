import { useEffect, useMemo, useState } from "react";

import {
    leadFieldValue,
    reportPalette,
    type ReportDefinition,
    type ReportRecord,
} from "../helper";
import Button from "../../../../Components/Common/Button";

interface MapPoint {
    label: string;
    latitude: number;
    longitude: number;
}

interface MapReportProps {
    report: Partial<ReportDefinition>;
    leads: Array<ReportRecord>;
    compact?: boolean;
}

const TILE_SIZE = 256;

const latitudeToRadians = (latitude: number) => {
    const sine = Math.sin((Math.max(-85, Math.min(85, latitude)) * Math.PI) / 180);
    return Math.log((1 + sine) / (1 - sine)) / 2;
};

const MapReport = ({ report, leads, compact = false }: MapReportProps) => {
    const points = useMemo<Array<MapPoint>>(() => {
        const latitudeField = report.mapLatitudeField || "latitude";
        const longitudeField = report.mapLongitudeField || "longitude";
        const labelField = (report.rows || [])[0] || "branchName";

        return leads
            .map(lead => ({
                label: String(leadFieldValue(lead, labelField) ?? "Lead"),
                latitude: Number(leadFieldValue(lead, latitudeField)),
                longitude: Number(leadFieldValue(lead, longitudeField)),
            }))
            .filter(point => Number.isFinite(point.latitude) && Number.isFinite(point.longitude));
    }, [leads, report.mapLatitudeField, report.mapLongitudeField, report.rows]);

    const [zoom, setZoom] = useState(() => (points.length > 1 ? 10 : 12));

    useEffect(() => {
        setZoom(points.length > 1 ? 10 : 12);
    }, [points.length]);

    if (!points.length) {
        return (
            <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                No records carry latitude and longitude values.
            </p>
        );
    }

    const changeZoom = (direction: number) =>
        setZoom(current => Math.max(4, Math.min(18, current + direction)));

    const project = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
        const scale = TILE_SIZE * 2 ** zoom;
        return {
            x: ((longitude + 180) / 360) * scale,
            y: (0.5 - latitudeToRadians(latitude) / (2 * Math.PI)) * scale,
        };
    };

    const centre = points.reduce(
        (sum, point) => ({
            latitude: sum.latitude + point.latitude / points.length,
            longitude: sum.longitude + point.longitude / points.length,
        }),
        { latitude: 0, longitude: 0 }
    );

    const centrePx = project(centre);
    const viewport = { width: 760, height: compact ? 220 : 340 };
    const origin = { x: centrePx.x - viewport.width / 2, y: centrePx.y - viewport.height / 2 };

    const tiles = [-2, -1, 0, 1, 2].flatMap(dx =>
        [-1, 0, 1].map(dy => ({
            x: Math.floor(centrePx.x / TILE_SIZE) + dx,
            y: Math.floor(centrePx.y / TILE_SIZE) + dy,
        }))
    );

    const grouped = Object.values(
        points.reduce((map: Record<string, MapPoint & { count: number }>, point) => {
            const key = `${point.latitude.toFixed(4)},${point.longitude.toFixed(4)}`;
            map[key] = map[key] || { ...point, count: 0 };
            map[key].count += 1;
            return map;
        }, {})
    );

    return (
        <div
            className="tw-relative tw-overflow-hidden tw-rounded-lg tw-border tw-border-gray-200 tw-bg-gray-100"
            style={{ height: `${viewport.height}px` }}
        >
            <div className="tw-absolute tw-right-2 tw-top-2 tw-z-10 tw-flex tw-flex-col tw-gap-1">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => changeZoom(1)}
                    aria-label="Zoom in"
                >
                    +
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => changeZoom(-1)}
                    aria-label="Zoom out"
                >
                    −
                </Button>
            </div>

            {tiles.map(tile => (
                <img
                    key={`${tile.x}-${tile.y}`}
                    src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
                    style={{
                        position: "absolute",
                        width: `${TILE_SIZE}px`,
                        height: `${TILE_SIZE}px`,
                        left: `${tile.x * TILE_SIZE - origin.x}px`,
                        top: `${tile.y * TILE_SIZE - origin.y}px`,
                    }}
                    alt=""
                    draggable={false}
                />
            ))}

            {grouped.map((point, index) => {
                const projected = project(point);

                return (
                    <span
                        key={`${point.latitude}-${point.longitude}`}
                        title={`${point.label}: ${point.count}`}
                        className="tw-absolute tw-flex tw-h-7 tw-w-7 tw-items-center tw-justify-center tw-rounded-full tw-text-xs tw-font-semibold tw-text-white tw-shadow"
                        style={{
                            left: `${projected.x - origin.x - 14}px`,
                            top: `${projected.y - origin.y - 14}px`,
                            backgroundColor: reportPalette[index % reportPalette.length],
                        }}
                    >
                        {point.count}
                    </span>
                );
            })}

            <a
                className="tw-absolute tw-bottom-1 tw-right-2 tw-bg-white/80 tw-px-1 tw-text-[10px] tw-text-gray-600"
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
            >
                © OpenStreetMap
            </a>
        </div>
    );
};

export default MapReport;
