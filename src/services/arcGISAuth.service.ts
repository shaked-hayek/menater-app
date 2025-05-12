import IdentityManager from '@arcgis/core/identity/IdentityManager';
import { ARCGIS_SETTINGS, SERVER_IP } from 'consts/settings.const';

export const setupArcGISAuth = async () => {
  try {
    const response = await fetch(`${SERVER_IP}/auth/arcgis/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        referer: window.location.origin,
      }),
    });

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
      expires: Date.now() + 7200000,
    });
    
    IdentityManager.registerToken({
      server: ARCGIS_SETTINGS.SERVER_URL + '/rest/services',
      token: tokenData.token,
      expires: Date.now() + 7200000,
    });

    return true;

  } catch (error) {
    console.error('ArcGIS authentication failed:', error);
    return false;
  }
};
