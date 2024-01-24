import React, { createContext } from "react";
import { UserData } from "../utils/backend";

interface UserContextData extends UserData {
  setUserData: (data: any) => void;
}

const UserContext = createContext<UserContextData>({
  name: '',
  email: '',
  role: 'none',
  favorites: {
    routes: [],
    places: []
  },
  _id: '',
  setUserData: (data: any)=>{}
});

export default UserContext;