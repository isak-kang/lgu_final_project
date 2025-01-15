export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        axios
          .get(`http://${API_URL}/api/protected`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setUser(response.data.user);
          })
          .catch((error) => {
            console.error("Authorization failed:", error);
            if (error.response?.status === 401) {
              alert("Session expired. Please log in again.");
              localStorage.removeItem("access_token");
              setUser(null);
              window.location.href = "/login";
            }
          });
      } else {
        setUser(null);
      }
    }, []);
  
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  };