export function parseJwt(token) {
  try {
    const b64 = token.split('.')[1];
    const base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

export const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};