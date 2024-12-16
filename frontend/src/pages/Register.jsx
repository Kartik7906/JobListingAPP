import React,{useState} from "react";
import { register } from "../services";

const Register = () => {
  // this is usestate for register
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res.status === 200) {
      alert("Register Successfully");
    } else {
      console.log(res);
      alert("Error occurred");
    }
  };
  return (
    <form onSubmit={handleRegister}>
      <input
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        type="text"
        value={formData.name}
        name="name"
        placeholder="Enter Name"
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        type="text"
        value={formData.mobile}
        name="mobile"
        placeholder="Enter Phone"
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        type="text"
        value={formData.email}
        name="email"
        placeholder="Enter Email"
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        type="text"
        value={formData.password}
        name="password"
        placeholder="Enter Password"
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
