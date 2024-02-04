import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : '';
  });

  console.log(data)

  useEffect(() => {
    // Save data to local storage whenever it changes
    localStorage.setItem("userData", JSON.stringify(data));
  }, [data]);

  return (
    <UserContext.Provider value={{ data, setData }}>
      {children}
    </UserContext.Provider>
  );
};
