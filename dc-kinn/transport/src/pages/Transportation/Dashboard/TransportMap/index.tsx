import Map from "./Map";

const TransportMap = () => {
  return (
    <div className="card transport-map-container" style={{ height: "628px" }}>
      <div className="card-header d-none">
        <div className="row">
          <h4 className="card-title mb-0 flex-grow-1">Show Routes</h4>
        </div>
      </div>

      <div className="card-body h-100">
        <Map></Map>
      </div>
    </div>
  );
};

export default TransportMap;
