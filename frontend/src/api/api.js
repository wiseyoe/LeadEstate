import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// AUTO INJECT ROLE HEADER
apiClient.interceptors.request.use((config) => {

  const user = localStorage.getItem("user");

  if (user) {
    try {
      const parsedUser = JSON.parse(user);

      config.headers.Role = parsedUser.role;
    } catch (e) {
      console.error("Failed parsing user");
    }
  }

  return config;
});

export default apiClient;