export function FullPageLoader() {
    return (
        <div
            style={{
                background: "background: rgba(0,0,0,0.3)", width: "100vw", zIndex: 9999,
                paddingTop: "80px",
                pointerEvents: "none"
            }}
            className="tw-fixed tw-top-0 tw-left-0 tw-flex tw-justify-center tw-items-center">
            <div className="spinner-border tw-text-[#405189]" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}
