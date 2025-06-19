
export const isTokenExpired = () => {
  let token;

  try {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    token = storedData?.token;
  } catch (e) {
    return true;
  }

  if (!token) return true;

  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true;
  }
};
