import { Auth0Role } from "./auth0role";

export interface User {
    _id: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    roles: Auth0Role[];
  }