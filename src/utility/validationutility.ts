// Formik validation
import * as Yup from "yup";

export const Only_Number_Input_Regex = "^[0-9]+$"

export function validateNumber(value: any) {
    const RegexExp = new RegExp(Only_Number_Input_Regex);
    return RegexExp.test(value);
}

export const NAME_REGEX = /^[A-Za-z]+(\s?[A-Za-z]+)*$/;


export async function validateOnChange(schema: any, path: any, items: any) {
    return schema.validateAt(path, items).then((valid: any) => {
        const [indexKey, nameKey] = path.split(".");
        if (indexKey && nameKey) {
            const indexMatch = indexKey.match(/\[(.*?)\]/) || "",
                index = Number(Number(indexMatch[1]));
            if (!isNaN(index) && items[index]?.errors && items[index]?.errors[nameKey]) {
                delete items[index]?.errors[nameKey];
            }
        }
        return { items, isValid: true }
    }).catch((err: any) => {
        const { message } = JSON.parse(JSON.stringify(err)) || {};
        const [indexKey, nameKey] = path.split(".");
        if (indexKey && nameKey) {
            const indexMatch = indexKey.match(/\[(.*?)\]/) || "",
                index = Number(Number(indexMatch[1]));
            if (!isNaN(index) && items[index]?.errors) {
                items[index].errors[nameKey] = message;
            } else {
                items[index].errors = { [nameKey]: message };
            }
        }
        return { items, isValid: false }
    })
}

export async function validateOnChangeUpdated(schema: any, path: any,
    rowIndex: any, nameKey: any,
    items: any) {
    if (isNaN(rowIndex) || !nameKey) {
        return { items, isValid: false };
    }
    return schema.validateAt(path, items).then((valid: any) => {

        // if (!isNaN(rowIndex) && items[rowIndex]?.errors && items[rowIndex]?.errors[nameKey]) {
        //     delete items[rowIndex]?.errors[nameKey];
        // }
        return { items, isValid: true }
    }).catch((err: any) => {
        const { message } = JSON.parse(JSON.stringify(err)) || {};
        if (!isNaN(rowIndex) && items[rowIndex]?.errors) {
            items[rowIndex].errors[nameKey] = message;
        } else {
            items[rowIndex].errors = { [nameKey]: message };
        }
        return { items, isValid: false }
    })
}

export async function validateOnSubmit(schema: any, items: any) {
    return schema.validate(items, { abortEarly: false }).then((valid: any) => {
        for (let i = 0; i < items.length; i++) {
            items[i].errors = {};
        }
        return { items, isValid: true }
    }).catch((err: any) => {
        const { inner } = JSON.parse(JSON.stringify(err)) || {};
        const allKeys = Object.keys(items[0]);
        const touchAllKeys = allKeys.reduce((data: any, item: any) => {
            data[item] = true;
            return data;
        }, {});
        for (let i = 0; i < items.length; i++) {
            items[i].touched = touchAllKeys;
            delete items[i].errors;
        }
        if (Array.isArray(inner)) {
            for (let i = 0; i < inner.length; i++) {
                const { path, message: errorMessage } = inner[i],
                    [indexKey, nameKey] = path.split(".");
                if (indexKey && nameKey) {
                    const indexMatch = indexKey.match(/\[(.*?)\]/) || "",
                        index = Number(Number(indexMatch[1]));
                    if (!isNaN(index)) {
                        const itemsInfo = items[index];
                        if (itemsInfo.errors) {
                            itemsInfo.errors[nameKey] = errorMessage;
                        } else {
                            itemsInfo.errors = { [nameKey]: errorMessage };
                        }
                    }
                }
            }
        }
        return { items, isValid: false }
    })
}



export async function validateSingleTableField(schema: any, items: any, keyName: any) {
    return schema.validate(items, { abortEarly: false }).then((valid: any) => {
        for (let i = 0; i < items.length; i++) {
            items[i].errors = {};
        }
        return items;
    }).catch((err: any) => {
        const { inner } = JSON.parse(JSON.stringify(err)) || {};
        for (let i = 0; i < items.length; i++) {
            if (items[i]?.errors) {
                delete items[i].errors[keyName];
            }
        }
        if (Array.isArray(inner)) {
            for (let i = 0; i < inner.length; i++) {
                const { path, message: errorMessage } = inner[i],
                    [indexKey, nameKey] = path.split(".");
                if (indexKey && nameKey === keyName) {
                    const indexMatch = indexKey.match(/\[(.*?)\]/) || "",
                        index = Number(Number(indexMatch[1]));
                    if (!isNaN(index)) {
                        const itemsInfo = items[index];
                        if (itemsInfo.errors) {
                            itemsInfo.errors[nameKey] = errorMessage;
                        } else {
                            itemsInfo.errors = { [nameKey]: errorMessage };
                        }
                    }
                }
            }
        }
        return items;
    })
}


export async function touchFieldOnBlur(path: any, items: any) {
    const [indexKey, nameKey] = path.split(".");
    if (indexKey && nameKey) {
        const indexMatch = indexKey.match(/\[(.*?)\]/) || "",
            index = Number(Number(indexMatch[1]));
        if (!isNaN(index) && items[index]?.touched) {
            items[index].touched[nameKey] = true;
        } else {
            items[index].touched = { [nameKey]: true };
        }
    }
    return items;
}


export async function touchTableFieldOnBlur(index: any, nameKey: any, items: any) {
    if (isNaN(index) || !nameKey) {
        return;
    }
    if (items[index]?.touched) {
        items[index].touched[nameKey] = true;
    } else {
        items[index].touched = { [nameKey]: true };
    }
    return items;
}

export async function touchAllColumnField(items: any, touchKeyName: any) {
    if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].touched) {
                items[i].touched[touchKeyName] = true;
            } else {
                items[i].touched = { [touchKeyName]: true };
            }
        }
    }
    return items;
}