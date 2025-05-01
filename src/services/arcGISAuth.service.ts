import IdentityManager from '@arcgis/core/identity/IdentityManager';
import { ARCGIS_SETTINGS } from 'consts/settings.const';

export const setupArcGISAuth = async () => {
  try {
    const response = await fetch(
      `${ARCGIS_SETTINGS.PORTAL_URL}/sharing/rest/generateToken`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: ARCGIS_SETTINGS.USERNAME,
          password: ARCGIS_SETTINGS.PASSWORD,
          client: 'referer',
          referer: window.location.origin,
          expiration: '60',
          f: 'json',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch token');
    }

    const tokenData = await response.json();

    if (!tokenData.token) {
      throw new Error('Token not received');
    }

    IdentityManager.registerToken({
      server: ARCGIS_SETTINGS.SERVER_URL,
      token: tokenData.token,
    });

    return true;
  } catch (error) {
    console.error('ArcGIS authentication failed:', error);
    return false;
  }
};
