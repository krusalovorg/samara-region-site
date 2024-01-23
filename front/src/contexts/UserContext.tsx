import React, { createContext } from "react";
import { UserData } from "../utils/backend";

const UserContext = createContext<UserData>({
  name: '',
  email: '',
  role: 'user',
  favorites: {
    routes: [],
    places: []
  },
  _id: '',
});

export default UserContext;