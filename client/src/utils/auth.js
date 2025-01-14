export const getAuthData = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return {
    isAuthenticated: !!token, // true if token exists
    role: role || null, // return role if available
    token: token || null, // return token if available
  };
};

export const setAuthData = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
