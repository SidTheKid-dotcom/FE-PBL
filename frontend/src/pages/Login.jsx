import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from 'axios'

export default function Login() {
    const [loginInfo, setLoginInfo] = useState(['', '']);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const navigate = useNavigate();

    const handleInput = (index, value) => {

        if(showErrorMessage)    setShowErrorMessage(false)

        const newLoginInfo = [...loginInfo];
        newLoginInfo[index] = value;
        setLoginInfo(newLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/signin', {
                mobile: loginInfo[0],
                password: loginInfo[1],
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const token = response.data.token;
            localStorage.setItem('token', 'Bearer ' + token);

            navigate('/user/Todays-Menu');
        }
        catch (e) {
            setShowErrorMessage(true);
        }
    }

    return (
        <div className="grid grid-cols-12 h-[100vh] w-full">
            <section className="bg-green-700 col-span-7">
                <figure>
                    <img
                        src="./login-photo.jpg"
                        className="h-[100vh] object-cover"
                        alt="Login"
                    />
                </figure>
            </section>
            <section className="col-span-5 flex flex-col items-center justify-center">
                <div className="bg-slate-100 w-[80%] h-[70%] rounded-lg">
                    <header className="p-5 text-center font-bold text-3xl">Login</header>
                    <form onSubmit={handleLogin} className="px-10 py-7 flex flex-col">

                        <label className="ml-4">Mobile Number</label>
                        <input type="text" placeholder="983754259" className="m-5 bg-transparent outline-none border-b-2 border-solid border-white focus:border-orange-400 transition-all duration-300" onChange={(e) => handleInput(0, e.target.value)}></input>

                        <label className="ml-4">Password</label>
                        <input type="password" placeholder="abcd@123" className="m-5 bg-transparent outline-none border-b-2 border-solid border-white focus:border-orange-400 transition-all duration-500" onChange={(e) => handleInput(1, e.target.value)}></input>
                        {
                            showErrorMessage && (
                                <div className="mx-5 w-full text-red-500">*Invalid Credentials</div>
                            )
                        }
                        <button type="submit" className="bg-orange-400 m-5 p-2 rounded-md">Submit</button>
                    </form>
                    <footer className="text-center text-md"><i>"More tech, more ease, more business"</i></footer>
                </div>
            </section>
        </div>
    )
}