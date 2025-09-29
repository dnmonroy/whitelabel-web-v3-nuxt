// utils/arrayUtils.ts
export function duplicateArrayIfBelow(array, minLength) {
    if (!Array.isArray(array) || array.length === 0 || array.length >= minLength) {
        return array;
    }

    const result = [];
    while (result.length < minLength) {
        const remainingLength = minLength - result.length;
        const chunk = array.slice(0, Math.min(remainingLength, array.length));
        result.push(...chunk);
    }
    return result;
}