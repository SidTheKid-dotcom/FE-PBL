import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-8">Page Not Found</p>
            <button
                onClick={() => navigate('/admin')}
                className="text-lg text-blue-500 border-2 border-blue-500 px-4 py-2 rounded transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
                Go Back
            </button>
        </div>
    );
};
