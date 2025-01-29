import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      navigate("/contacts");  // Redirect after login
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome to LinkedIn Assistant</h1>
      <button onClick={signInWithGoogle} className="login-btn">
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;