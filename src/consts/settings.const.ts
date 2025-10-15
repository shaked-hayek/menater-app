
export const SERVER_IP = 'http://localhost:5000';

export const ARCGIS_SETTINGS = {
    SERVER_URL: 'https://menater-server.localdomain/server',
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

export const CITY_DATA = {
    CITY_MAP_LOC: '/BeerSheva/MapServer/4', // Buildings_Final
    NATARIM_LAYER: '/BeerSheva/MapServer/1', // Natarim_Final_New
}