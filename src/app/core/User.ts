export interface User {
  id:         number;
  username:   string;
  password:   string;
  email:      string;
  first_name: string;
  last_name:  string;
  avatar:     string;
  created_at: string;
  deleteDate: string;
  role:       Role;
}

export interface Role {
  id:   number;
  type: string;
}
