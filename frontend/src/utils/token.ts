// src/utils/token.ts

export const parseJwt = (token: string): any => {
  try {
    console.log('Parsing token:', token);
    const base64Url = token.split('.')[1];
    console.log('Base64Url part:', base64Url);
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    console.log('JSON Payload:', jsonPayload);

    const parsed = JSON.parse(jsonPayload);
    console.log('Parsed result:', parsed);
    return parsed;
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};
