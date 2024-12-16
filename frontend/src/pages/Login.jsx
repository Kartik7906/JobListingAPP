import React, {useEffect, useState} from "react";
import { login } from "../services";
import { useNavigate } from "react-router-dom";
const Login = () => {

  const navigate =  useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      // alert("User Already Logged In");
      navigate("/home");
    }
  }, []);


  // usestate fro loginformdata:
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(loginFormData);
    if (res.status == 200) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      alert("Login Successfully");
      navigate("/home");
    } else {
      console.log(res);
      alert("Error occured");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        onChange={(e) => {
          setLoginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value,
          });
        }}
        type="text"
        value={loginFormData.email}
        name="email"
        placeholder="Enter email"
      />
      <input
        onChange={(e) => {
          setLoginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value,
          });
        }}
        type="text"
        value={loginFormData.password}
        name="password"
        placeholder="Enter password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
