import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleLogin = async (username, password) => {
    if (username && password) {
        const response = await axios.get(`https://localhost:7261/api/Usuario/login?username=${username}&password=${password}`);
        console.log(response.data);
        console.log(response.data[0].username);
        console.log(response.data[0].perfilId);
        localStorage.setItem("usuario", response.data[0].username);
        localStorage.setItem("perfilId",response.data[0].perfilId);
        history('/home'); 
    } else {
      alert('Por favor, ingresa un nombre de usuario y una contraseña.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', 
        backgroundColor: '#FFEBE7',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFF',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          width: '300px',
        }}
      >
        <h2 style={{ color: '#B74C4C', marginBottom: '20px' }}>Iniciar sesión</h2>
        <label style={{ marginBottom: '10px' }}>
          Usuario:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{padding: '8px', width: '100%', boxSizing: 'border-box', marginTop: '5px' }}
          />
        </label>
        <label style={{ marginBottom: '15px' }}>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginTop: '5px' }}
          />
        </label>
        <button
          onClick={()=> handleLogin(username,password)}
          style={{
            backgroundColor: '#B74C4C',
            color: '#FFF',
            padding: '10px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '4px',
            width: '100%',
            marginTop: '10px'
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default Login;
