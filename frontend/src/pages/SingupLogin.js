import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupLogin({ setUsernameTransfer }) {
    const [isSignup, setIsSignup] = useState(true)
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const checkUsername = async (event) => {
        event.preventDefault();
        if(password !== confirmPassword) {
            setErrorMessage("Password and Confirm Password do not match, please check that")
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password})
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.detail);
                return;
            }
            const data = await response.json()
            if(data.exists) {
                if(data.sameEmail) {
                    setErrorMessage("Username and Email pair already exists, try loggin in or try with other username and email");
                } else {
                    setErrorMessage("Username is already taken, please choose a different username")
                }
            } else {
                localStorage.setItem("username", username);
                setUsernameTransfer(username)
                setErrorMessage("")
                navigate("/notes")
            }
           
        } catch (error) {
            console.error("Error checking username:", error);
            setErrorMessage("An error occurred while checking the username.");
        }
    }

    const checkLogin = async (event) => {
        event.preventDefault()

        const userData = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.detail);
                return;
            }
    
            const data = await response.json();
    
            if (data.message === 'Login successful') {
                localStorage.setItem("username", username);
                setUsernameTransfer(username);
                navigate('/notes');
            }
        } catch (error) {
            console.error("Error checking credentials:", error);
            setErrorMessage("An error occurred while checking the credentials.");
        }
    }

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("username");
        const visitedNotes = localStorage.getItem("visitedNotes");

        if (isLoggedIn && visitedNotes){
            navigate("/notes");
        }
    }, [navigate])

    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
        {/* App title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Notes App - Save your thoughts easily
        </h2>
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
            {/* Tabs */}
            <div className="flex justify-around border-b pb-2">
                <button
                    className={`text-lg font-semibold ${
                        isSignup ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => setIsSignup(true)}
                >
                    Sign Up
                </button>
                <button
                    className={`text-lg font-semibold ${
                        !isSignup ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => setIsSignup(false)}
                >
                    Login
                </button>
            </div>

            { isSignup ? (
                // Signup Form
                <form className="mt-4 flex flex-col space-y-3" onSubmit={checkUsername}>
                    <input 
                        type="email"
                        placeholder="Email Address"
                        className="border p-2 rounded w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required               
                    />
                    <input 
                        type="text"
                        placeholder="Username"
                        className="border p-2 rounded w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required                      
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        className="border p-2 rounded w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required                      
                    />
                    <input 
                        type="password"
                        placeholder="Confirm Password"
                        className="border p-2 rounded w-full"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required                  
                    />
                    <button className="bg-blue-500 text-white py-2 rounded mt-2">
                        Sign Up
                    </button>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <p className="text-xs sm:text-base text-gray-500 mt-2">
                        Email is collected to know the users signing up, nothing else
                    </p>
                </form>
            ) : (
                // Login Form
                <form className="mt-4 flex flex-col space-y-4" onSubmit={checkLogin}>
                    <input 
                        type="text"
                        placeholder="Username"
                        className="border p-2 rounded w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}                      
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        className="border p-2 rounded w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}                       
                    />
                    <button className="bg-blue-500 text-white py-2 rounded mt-2">
                        Login
                    </button>
                </form>
            )}
        </div>
      </div>
    );
  }
  