import React, { useEffect, useState } from 'react';
import { FaUser, FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import LoadingDots from "../assets/animations/LoadingDots";
import { jwtDecode } from 'jwt-decode';
import '../App.css'; // Custom CSS for oscillation effect

export default function Overview() {
    const images = [
        '/PBL-Landing-Page/360_F_465288715_F3uc0aZMhzSbNbftEzHSb6RfUVQfCHeU.jpg',
        '/PBL-Landing-Page/85402539.webp',
        '/PBL-Landing-Page/Fresh-Veggies-1200x834.jpg',
        '/PBL-Landing-Page/premium_photo-1661778156582-670d5b62a9e4.avif',
        '/PBL-Landing-Page/premium_photo-1679503585289-c02467981894.avif',
        '/PBL-Landing-Page/photo-1614873636018-548106274e2a.avif',
        '/PBL-Landing-Page/seedless_fruits.jpg',
        '/PBL-Landing-Page/happy-waiter-using-digital-tablet-260nw-1460315789.jpg',
        '/PBL-Landing-Page/south-indian-food-dosa.png',
        '/PBL-Landing-Page/photo-1556742393-d75f468bfcb0.avif',
        '/PBL-Landing-Page/premium_photo-1661563844238-126db10e77b7.avif',
        '/PBL-Landing-Page/tango_20tamari_20-_20outdoor.webp',
        '/PBL-Landing-Page/Types-of-Food-Grinding-101-CA.png',
        '/PBL-Landing-Page/Untitled-design-2022-01-24T193825.271--1-.webp',
        '/PBL-Landing-Page/istockphoto-177728353-612x612.jpg',
    ];

    const [selectedRole, setSelectedRole] = useState('');
    const [formType, setFormType] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            return;
        }
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === 'user' && decodedToken.exp * 1000 > Date.now()) {
                navigate('/user/Todays-Menu');
                return;
            }
            else if (decodedToken.role === 'admin' && decodedToken.exp * 1000 > Date.now()) {
                navigate('admin');
                return;
            }
        } catch (error) {
            console.error('Invalid token', error);
            navigate('/');
        }
    }, [token]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setFormType('login'); // Reset to login whenever role changes
    };

    const handleGoBack = () => {
        setSelectedRole('');
        setEmail('');
        setPassword('');
        setName('');
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');
            const response = await axios.post(`http://localhost:3000/api/v1/${selectedRole}/signin`, {
                email: email,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const token = response.data.token;
            localStorage.setItem('token', 'Bearer ' + token);
            setTimeout(() => {
                setLoading(false);
                if (selectedRole === 'user') {
                    navigate('/user/Todays-Menu')
                }
                else {
                    navigate('/admin')
                }
            }, 700)
        }
        catch (e) {
            setLoading(false);
            setError('Login failed. Please try again.');
            console.log('error occurred while trying to sign in ', e);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');
            const response = await axios.post(`http://localhost:3000/api/v1/${selectedRole}/signup`, {
                name: name,
                email: email,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const token = response.data.token;
            localStorage.setItem('token', 'Bearer ' + token);
            setTimeout(() => {
                setLoading(false);
                if (selectedRole === 'user') {
                    navigate('/user/Todays-Menu')
                }
                else {
                    navigate('/admin')
                }
            }, 700)
        }
        catch (e) {
            setLoading(false);
            setError('Registration failed. Please try again.');
            console.log('error occurred while trying to register ', e);
        }
    };

    return (
        <div className="grid grid-cols-10 h-screen overflow-hidden">
            <div className="mt-[-28rem] col-span-3 flex items-center justify-center bg-gray-100 p-4">
                <div className='flex flex-col gap-[2rem]'>
                    <div className='flex flex-col items-center justify-center'>
                        <div className="mb-4 flex flex-row justify-center gap-[0.5rem]">
                            <figure>
                                <img src='/restaurant-fine.svg' alt='logo' width='50px'></img>
                            </figure>
                            <h1 className='text-4xl font-bold '>ProRestro.</h1>
                        </div>
                        <i className="text-lg mb-4">More Tech, More Ease, More Business</i>
                    </div>

                    {!selectedRole ? (
                        <div>
                            <h1 className="text-lg font-bold mb-4">Choose Your Role</h1>
                            <div className="flex flex-col space-y-4">
                                <button
                                    className="py-2 bg-orange-400 font-bold text-white rounded"
                                    onClick={() => handleRoleChange('admin')}
                                >
                                    Admin
                                </button>
                                <button
                                    className="py-2 bg-orange-400 font-bold text-white rounded"
                                    onClick={() => handleRoleChange('user')}
                                >
                                    User
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {selectedRole === 'admin' ? (
                                <div className='flex flex-row gap-[0.5rem] justify-center items-center'>
                                    <FaUserShield className="text-3xl text-gray-600" />
                                    <h1 className='font-bold text-3xl text-gray-600'>Admin</h1>
                                </div>
                            ) : (
                                <div className='flex flex-row gap-[0.5rem] justify-center items-center'>
                                    <FaUser className="text-3xl text-gray-600" />
                                    <h1 className='font-bold text-3xl text-gray-600'>User</h1>
                                </div>
                            )}
                            <div className="relative flex mb-4">
                                <div
                                    className={`absolute top-0 left-0 w-1/2 h-full bg-orange-400 rounded transition-transform ease-in-out duration-300 ${formType === 'register' ? 'transform translate-x-full' : ''
                                        }`}
                                ></div>
                                <button
                                    className={`flex-1 py-2 z-10 ${formType === 'login' ? 'text-white' : 'text-black'}`}
                                    onClick={() => setFormType('login')}
                                >
                                    Login
                                </button>
                                <button
                                    className={`flex-1 py-2 z-10 ${formType === 'register' ? 'text-white' : 'text-black'}`}
                                    onClick={() => setFormType('register')}
                                >
                                    Register
                                </button>
                            </div>
                            {error && <div className="text-red-500 mb-4">{error}</div>}
                            <div>
                                {formType === 'login' ? (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            className="w-full p-2 mb-4 border rounded cursor-pointer"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full p-2 mb-4 border rounded cursor-pointer"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {
                                            loading ? (
                                                <button className="w-full bg-orange-400 text-white rounded flex flex-col items-center justify-center">&nbsp;<LoadingDots />&nbsp;</button>
                                            ) : (
                                                <button onClick={handleLogin} className="w-full py-2 bg-orange-400 text-white rounded">Login</button>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            className="w-full p-2 mb-4 border rounded cursor-pointer"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            className="w-full p-2 mb-4 border rounded cursor-pointer"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full p-2 mb-4 border rounded cursor-pointer"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {
                                            loading ? (
                                                <button className="w-full bg-orange-400 text-white rounded flex flex-col items-center justify-center">&nbsp;<LoadingDots />&nbsp;</button>
                                            ) : (
                                                <button onClick={handleRegister} className="w-full py-2 bg-orange-400 text-white rounded">Register</button>
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                            <button
                                className="mt-4 py-2 px-4 bg-gray-200 text-gray-500 font-bold rounded hover:bg-gray-300"
                                onClick={handleGoBack}
                            >
                                Go Back
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="col-span-7 grid grid-cols-3 grid-rows-5 gap-2 p-4">
                {images.map((src, index) => (
                    <div key={index} className={`oscillate-${index % 3} h-56 overflow-hidden rounded-lg`}>
                        <img src={src} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        </div>
    );
}
