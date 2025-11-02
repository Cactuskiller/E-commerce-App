import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaPhone, FaEnvelope } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode'; 
import InputField from "../componets/inputField";
import Button from "../componets/button";
import { URL } from "../utils/api";

const STATIC_AVATAR_URL = "https://example.com/avatar.png";

const AuthForm = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    email: "",
  });

  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch(`${URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_name: fields.username, 
            password: fields.password,
          }),
        });

        if (!res.ok) {
          throw new Error(`Login failed: ${res.status}`);
        }

        const data = await res.json();


        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
          
          // Decode the token and store user data
          try {
            const decoded = jwtDecode(data.token);

            
            const userData = {
              id: decoded.userId,
              name: decoded.userName,
              phone: decoded.phone,
              email: decoded.email,

            };
            
            localStorage.setItem("user", JSON.stringify(userData));

          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
          }
          
          navigate("/home"); 
        } else {
          setError(data.message || data.error || "Login failed");
        }
      } else {
        if (
          !fields.name ||
          !fields.username ||
          !fields.phone ||
          !fields.email ||
          !fields.password
        ) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }
        if (fields.password !== fields.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const res = await fetch(`${URL}/users/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fields.name,
            user_name: fields.username, 
            phone: fields.phone,
            email: fields.email,
            avatar: STATIC_AVATAR_URL,
            password: fields.password,
            active: true, 
            created_at: new Date().toISOString(), 
          }),
        });

        if (!res.ok) {
          throw new Error(`Signup failed: ${res.status}`);
        }

        const data = await res.json();


        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
          try {
            const decoded = jwtDecode(data.token);

            
            const userData = {
              id: decoded.userId,
              name: decoded.userName,
              phone: decoded.phone,
              email: decoded.email,
            };
            
            localStorage.setItem("user", JSON.stringify(userData));

          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
          }
          
          navigate("/home");
        } else {
          setError(data.message || data.error || "Signup failed");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Network error or server issue");
    }
    setLoading(false);
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-white px-4 py-6 max-w-sm mx-auto">
      <div className="w-full mt-6 flex flex-col flex-1">
        <h1 className="text-4xl font-bold mb-8">
          {mode === "login" ? "Welcome Back!" : "Create an account"}
        </h1>
        <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <InputField
                placeholder="Full Name"
                icon={<FaUser />}
                value={fields.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <InputField
                placeholder="Phone"
                icon={<FaPhone />}
                value={fields.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <InputField
                placeholder="Email"
                icon={<FaEnvelope />}
                value={fields.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </>
          )}
          <InputField
            placeholder="Username"
            icon={<FaUser />}
            value={fields.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            icon={<FaLock />}
            value={fields.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {mode === "signup" && (
            <InputField
              type="password"
              placeholder="Confirm Password"
              icon={<FaLock />}
              value={fields.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          )}
          {mode === "login" && (
            <div className="flex justify-end mb-4">
              <button type="button" className="text-sm text-red-400 font-medium">
                Forgot Password?
              </button>
            </div>
          )}
          {mode === "signup" && (
            <p className="text-medium text-gray-500 mb-4">
              By clicking the{" "}
              <span className="text-red-500 font-medium">Register</span> button,
              you agree to the public offer
            </p>
          )}
          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
          )}
          <div className="flex-1" />
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex justify-center items-center text-base mb-6">
              {mode === "login" ? (
                <>
                  Create An Account&nbsp;
                  <button
                    type="button"
                    className="text-red-500 font-semibold"
                    onClick={() => setMode("signup")}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  I Already Have an Account&nbsp;
                  <button
                    type="button"
                    className="text-red-500 font-semibold"
                    onClick={() => setMode("login")}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
            <Button disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
