// utils/userUtils.ts

export function getFullName(user) {
    if (!user) return '';

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    if (firstName && lastName) {
        return `${firstName} ${lastName}`;
    }
    if (firstName) {
        return firstName;
    }
    if (lastName) {
        return lastName;
    }
    return '';
}