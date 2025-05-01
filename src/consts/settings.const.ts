
export const SERVER_IP = 'http://localhost:5000';

export const ARCGIS_SETTINGS = {
    SERVER_URL: 'https://menater-server.localdomain:6443/arcgis',
    PORTAL_URL: 'https://menater-server.localdomain/portal',
    USERNAME: 'admin',
    PASSWORD: 'Password1',
};

export const MAP_SETTINGS = {
    INITIAL_CENTER: [34.7868, 31.2521], // Be'er Sheva coordinates
    INITIAL_ZOOM: 13,
    BASEMAP_URL: 'https://{subDomain}.tile.openstreetmap.org/{level}/{col}/{row}.png',
    SUBDOMAINS: ['a', 'b', 'c'],
}

export const HTTP_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};