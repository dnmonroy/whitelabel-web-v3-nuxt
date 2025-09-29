// utils/lobbyUtils.ts


function filterLobbies(object) {
    if (!object || !object.links || object.links.length === 0) {
        return [];
    }
    return object.links.filter(link => link.buttonType === 'lobby');
}

export function getAllLobbies(links) {
    if (!links) return [];
    const lobbyLinks = links.filter(link => link.buttonType === "lobby");
    return lobbyLinks.map(item => ({
        id: item.id,
        href: item.href,
        title: item.title,
    }));
}

export function getLobbiesIds(object) {
    const lobbies = filterLobbies(object);
    return lobbies.map(lobby => lobby.id);
}

export function getLobbies(object) {
    return filterLobbies(object);
}