export async function latLongToPlace(
    lat: string,
    long: string,
    shortName: string
) {
    return new Promise((resolve) => {
        const APIkey = import.meta.env.VITE_MAP_KEY;
        const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=` + APIkey;
        fetch(URL).then(async function (addressResp: any) {
            const response = await addressResp.json();
            if (shortName) {
                resolve(
                    response?.results[0]?.address_components[1]?.long_name
                        ? response?.results[0]?.address_components[1].long_name
                        : response?.results[0]?.address_components[0].long_name || ""
                );
            } else {
                let address = response?.results[0]?.formatted_address;
                let splitAddress = address && address?.split(" ") || [];
                if (Array.isArray(splitAddress) && splitAddress.length > 0 && splitAddress[0].indexOf("+")) {
                    splitAddress.splice(0, 1);
                    address = splitAddress.join(" ")
                }
                resolve(address || "");
                // resolve(response.results[0].formatted_address);
            }
        })
            .catch(function (error) {
                resolve(error);
            });
    });
}
