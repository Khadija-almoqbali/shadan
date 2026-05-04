import bcrypt from "bcryptjs";

const users = [
  {
    name: "Khadija",
    email: "khadija@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
];

export default users;
