import { Recipe } from '../recipe/recipe';

export interface User {
  id?: number;
  email: string;
  roles?: string[];
  password: string;
  firstName: string;
  lastName: string;
  photo?: string;
  recipes?: Recipe[];
}
