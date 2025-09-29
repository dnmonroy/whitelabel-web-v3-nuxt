export const useLocalStorage = () => {
  const isClient = typeof window !== "undefined";

  return {
    getItem(key) {
      if (!isClient) return null;
      return localStorage.getItem(key);
    },

    setItem(key, value) {
      if (isClient) {
        localStorage.setItem(key, value);
      }
    },

    removeItem(key) {
      if (isClient) {
        localStorage.removeItem(key);
      }
    },

    getJSON(key) {
      if (!isClient) return null;
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error("Failed to parse JSON from localStorage", e);
        return null;
      }
    },

    setJSON(key, value) {
      if (isClient) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
          console.error("Failed to stringify JSON for localStorage", e);
        }
      }
    },
  };
};

export const useSessionStorage = () => {
  const isClient = typeof window !== "undefined";

  return {
    getItem(key) {
      if (!isClient) return null;
      return sessionStorage.getItem(key);
    },

    setItem(key, value) {
      if (isClient) {
        sessionStorage.setItem(key, value);
      }
    },

    removeItem(key) {
      if (isClient) {
        sessionStorage.removeItem(key);
      }
    },

    getJSON(key) {
      if (!isClient) return null;
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error("Failed to parse JSON from sessionStorage", e);
        return null;
      }
    },

    setJSON(key, value) {
      if (isClient) {
        try {
          sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
          console.error("Failed to stringify JSON for sessionStorage", e);
        }
      }
    },
  };
};
