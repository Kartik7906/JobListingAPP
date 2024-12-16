const URL = 'http://localhost:3000/api';

export const register = (data) => {
  return fetch(`${URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const login = (data) => {
  return fetch(`${URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const getjob = ({ limit, offset, name }) => {
  return fetch(`${URL}/job?limit=${limit}&offset=${offset}&name=${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export const createjob = (data) => {
  const token = localStorage.getItem("token");
  return fetch(`${URL}/job`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": token || "",
    },
    body: JSON.stringify(data),
  });
};

export const Updatejob = (id, data) => {
  const token = localStorage.getItem("token");
  return fetch(`${URL}/job/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": token || "",
    },
    body: JSON.stringify(data),
  });
};

export const getjobByid = (id) => {
  const token = localStorage.getItem("token");
  return fetch(`${URL}/job/${id}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": token || "",
    },
  });
};

export const deleteJob = (id) => {
  const token = localStorage.getItem("token");
  return fetch(`${URL}/job/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": token || "",
    },
  });
};
