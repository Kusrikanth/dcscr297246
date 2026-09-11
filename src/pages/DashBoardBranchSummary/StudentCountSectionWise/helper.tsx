
const borderColors = ["#BCE3FF", "#C4F4E4", "#D8D4FE"];

const getDynamicBorderColor = (index: number): string => borderColors[index % borderColors.length];

export function generateRowData(masterSection: any, mainApiResponse: any) {
    if (!masterSection || !mainApiResponse) return [];
    const romanToNum = (roman: string): number => {
        const values: Record<string, number> = {
            I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
        };
        return roman
            .toUpperCase()
            .split("")
            .reduceRight((acc, ch, i, arr) => {
                const curr = values[ch] || 0;
                const next = values[arr[i + 1]] || 0;
                return acc + (curr < next ? -curr : curr);
            }, 0);
    };
    const getSortKey = (label: string): [number, number, string] => {
        const [cls, section = ""] = label.replace("-", " - ").split(" - ").map(s => s.trim());

        if (/^EY\s*[-]?\s*\d+$/i.test(cls)) {
            return [0, parseInt(cls.replace(/\D/g, ""), 10) || 0, section];
        }

        return [1, romanToNum(cls), section];
    };
    return Object.entries(masterSection)
        .sort(([, a], [, b]) => {
            const keyA = getSortKey(a as string);
            const keyB = getSortKey(b as string);
            for (let i = 0; i < keyA.length; i++) {
                if (keyA[i] !== keyB[i]) {
                    return keyA[i] < keyB[i] ? -1 : 1;
                }
            }
            return 0;
        })
        .map(([key, label]) => {
            const { MALE = 0, FEMALE = 0, TOTAL = 0 } = mainApiResponse[key] || {};
            return {
                label,
                boys: MALE,
                girls: FEMALE,
                total: TOTAL,
                borderColor: getDynamicBorderColor(Number(key)),
            };
        });
}