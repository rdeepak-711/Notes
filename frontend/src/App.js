import { useEffect, useState } from "react";
import Notes from "./pages/Notes";
import SignupLogin from "./pages/SingupLogin";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";
 
function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if(storedUsername){
      setUsername(storedUsername);
    }
    console.log(username);
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupLogin setUsernameTransfer={setUsername}/>} />

        <Route path="/notes" element={
          <ProtectedRoute>
            <Notes  usernameTransfer={username}/>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
