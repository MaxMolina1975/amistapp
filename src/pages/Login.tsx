import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2, Users } from 'lucide-react';
import { useAuth } from '../lib/context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import toast from 'react-hot-toast';

type UserType = 'teacher' | 'tutor' | 'student';

export function Login() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState<UserType>('teacher');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('online');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        school: '',
        subjects: '',
        relationship: 'parent' as 'parent' | 'guardian' | 'other'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            console.log('Intentando iniciar sesión con:', formData.email);
            
            if (isLogin) {
                const success = await login(formData.email, formData.password);
                
                if (!success) {
                    throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
                }
                
                toast.success('Inicio de sesión exitoso');
                
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    
                    if (user.role === 'teacher') {
                        navigate('/teacher/dashboard');
                    } else if (user.role === 'tutor') {
                        navigate('/tutor/dashboard');
                    } else if (user.role === 'student') {
                        navigate('/estudiante/dashboard');
                    } else {
                        navigate('/');
                    }
                } else {
                    navigate('/');
                }
            } else {
                // Permitir el registro de nuevos usuarios
                const success = await register({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    role: userType,
                    school: formData.school,
                    subjects: formData.subjects,
                    relationship: formData.relationship
                });
                
                if (!success) {
                    throw new Error('Error al registrar usuario. Inténtalo de nuevo.');
                }
                
                toast.success('Registro exitoso');
                
                if (userType === 'teacher') {
                    navigate('/teacher/dashboard');
                } else if (userType === 'tutor') {
                    navigate('/tutor/dashboard');
                } else if (userType === 'student') {
                    navigate('/estudiante/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || 'Error al procesar la solicitud');
            toast.error(error.message || 'Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
    };

    if (serverStatus === 'checking') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-600 mb-4" />
                    <p className="text-gray-600">Verificando conexión con el servidor...</p>
                </div>
            </div>
        );
    }

    if (serverStatus === 'offline') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                        <h2 className="text-lg font-semibold text-red-700 mb-2">
                            Error de conexión
                        </h2>
                        <p className="text-red-600 mb-4">
                            No se pudo conectar con el servidor. Por favor, intenta nuevamente más tarde.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => setServerStatus('checking')}
                            loading={loading}
                        >
                            Reintentar conexión
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-4 py-8 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 mb-4">
                        <LogIn className="w-8 h-8 text-violet-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {isLogin ? 'Iniciar Sesión' : 'Registro'}
                    </h1>
                    <p className="text-gray-600">
                        {isLogin 
                            ? 'Accede a tu panel' 
                            : 'Crea tu cuenta para comenzar'}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* Selector de tipo de usuario */}
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de usuario</label>
                            <div className="flex space-x-2">
                                <Button
                                    type="button"
                                    variant={userType === 'teacher' ? 'primary' : 'outline'}
                                    onClick={() => setUserType('teacher')}
                                    className="flex-1"
                                >
                                    Docente
                                </Button>
                                <Button
                                    type="button"
                                    variant={userType === 'tutor' ? 'primary' : 'outline'}
                                    onClick={() => setUserType('tutor')}
                                    className="flex-1"
                                >
                                    Tutor
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Formulario de autenticación */}
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <Alert variant="error" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Correo electrónico
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="ejemplo@correo.com"
                                icon={<Mail className="w-5 h-5 text-gray-400" />}
                                autoComplete="email"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Contraseña
                            </label>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5 text-gray-400" />}
                                autoComplete={isLogin ? "current-password" : "new-password"}
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Nombre completo
                                    </label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nombre y apellido"
                                        icon={<Users className="w-5 h-5 text-gray-400" />}
                                    />
                                </div>

                                {userType === 'teacher' && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                                Escuela (opcional)
                                            </label>
                                            <Input
                                                type="text"
                                                name="school"
                                                value={formData.school}
                                                onChange={handleInputChange}
                                                placeholder="Nombre de la escuela"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                                Materias (opcional)
                                            </label>
                                            <Input
                                                type="text"
                                                name="subjects"
                                                value={formData.subjects}
                                                onChange={handleInputChange}
                                                placeholder="Materias que imparte"
                                            />
                                        </div>
                                    </>
                                )}

                                {userType === 'tutor' && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Relación con el estudiante
                                        </label>
                                        <select
                                            name="relationship"
                                            value={formData.relationship}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                relationship: e.target.value as any
                                            }))}
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                                        >
                                            <option value="parent">Padre/Madre</option>
                                            <option value="guardian">Tutor legal</option>
                                            <option value="other">Otro</option>
                                        </select>
                                    </div>
                                )}
                            </>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            loading={loading}
                        >
                            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
                        </Button>
                    </form>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="text-violet-600 hover:text-violet-800 text-sm font-medium"
                        >
                            {isLogin
                                ? '¿No tienes cuenta? Regístrate'
                                : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </div>
                </div>

                {/* Nota: Las credenciales de prueba han sido eliminadas por seguridad */}
            </div>
        </div>
    );
}
