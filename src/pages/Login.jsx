import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { IoEye, IoEyeOff } from 'react-icons/io5';
import { PiSignInBold } from 'react-icons/pi';
import { Snackbar, Alert } from '@mui/material';
import { Card, CardContent } from '@/components/Card/card';
import { Input } from '@/components/Input/input';
import { Button } from '@/components/Button/button';
import { Label } from '@/components/Label/label';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import '../assets/css/login.css';
import logo from '../assets/img/logo/logo1.png';

const Login = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = (e) => {
    e.preventDefault();
    sendSignin();
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setToastMessage('Por favor, completa todos los campos requeridos.');
      setToastSeverity('warning');
      setSnackBarOpen(true);
      return false;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToastMessage('El correo electrónico no tiene un formato válido.');
      setToastSeverity('warning');
      setSnackBarOpen(true);
      return false;
    }

    // Validación básica de longitud de contraseña
    if (password.length < 6) {
      setToastMessage('La contraseña debe tener al menos 6 caracteres.');
      setToastSeverity('warning');
      setSnackBarOpen(true);
      return false;
    }

    return true;
  };

  const sendSignin = async () => {
    const body = { email, password };
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, body);
      console.log(response);
      
      const { access_token } = response.data;  

      // Guardar token en localStorage
      localStorage.setItem('token', access_token);

      // Actualizar contexto de autenticación si usas uno
      login(access_token); // asegúrate que `login` lo actualice

      // Si el login es exitoso (status 200), navega
      if (response.status === 200 || response.status === 201) {
        navigate('/dashboard');
      }
    } catch (error) {
      setToastMessage('Credenciales incorrectas');
      setToastSeverity('error');
      setSnackBarOpen(true);
      setLoading(false);
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };


  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post('http://localhost:3000/auth/login', {
  //       email,
  //       password,
  //     });
  //     console.log(res.data)
  //     alert('Login exitoso')
  //     localStorage.setItem('token', res.data.token);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     alert('Error al iniciar sesión');
  //     setError('Credenciales inválidas')
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-okip-100 relative overflow-hidden login-background">

      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0 login-background bg-cover bg-center opacity-20" />
      <div className="login-container">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card de login */}
          <Card className="relative z-10 bg-white/30 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-[350px]">

            {/* Logo de la empresa */}
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Logo empresa" className="h-16 object-contain" />
            </div>

            <h2 className="text-okip-500 text-2xl font-bold text-center mb-6">Login</h2>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="text-okip-600 text-sm font-medium">Usuario</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="usuario@dominio.com"
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-okip-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-okip-500"
                />
              </div>

              <div className="relative mb-4">
                <Label htmlFor="password" className="text-okip-600 text-sm font-medium">Contraseña</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-okip-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-okip-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute mt-3 right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>



              <div className="flex justify-end text-sm text-okip-400 mb-6">
                <a href="#" className="hover:underline">¿Olvidaste tu contraseña?</a>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="login-button"
              //className="w-full bg-okip-500 hover:bg-okip-505 text-white font-semibold py-2 rounded-full transition duration-300"
              >
                {loading ? (
                  <span className="login-loading">
                    <svg
                      className="login-spinner"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  <>
                    Ingresar <PiSignInBold className="login-button-icon" />
                  </>
                )}
              </Button>
            </form>

            {/* Redes sociales (opcional) */}
            <div className="mt-6 flex justify-center gap-4 text-okip-500">
              <i className="fab fa-facebook" />
              <i className="fab fa-twitter" />
              <i className="fab fa-instagram" />
            </div>
          </Card>

        </motion.div>
      </div>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={toastSeverity} variant="filled" onClose={() => setSnackBarOpen(false)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
