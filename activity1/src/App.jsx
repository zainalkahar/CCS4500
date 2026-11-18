
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "EDFGCC") {
      const cipherText = "Khoor Vwxghqwv, ilqg wklv phvvdjh dv flskhu whaw";

      const decrypt = (text) => {
        return text.replace(/[a-z]/gi, (char) => {
          const base = char === char.toUpperCase() ? 65 : 97;

          return String.fromCharCode(
            ((char.charCodeAt(0) - base - 3 + 26) % 26) + base
          );
        });
      };

      const realMessage = decrypt(cipherText);  
      Swal.fire({
        title: "Login Successful!",
        text: realMessage,
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#7c3aed",
      });
    } else {
      Swal.fire({
        title: "Login Failed!",
        text: "Invalid username or password.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
<div className="fixed inset-0 w-screen min-h-screen
  flex items-center justify-center
  bg-gradient-to-br from-indigo-950 via-purple-900 to-purple-800 p-4">

      {/* Login Frame */}
      <div className="card w-full max-w-md bg-[#1e242c]
        shadow-2xl rounded-3xl">

        <div className="card-body px-8 py-4">

          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 rounded-2xl
              bg-gradient-to-br from-indigo-500 to-purple-600
              flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-3">
            <h3 className="text-3xl font-bold text-white">
              CSC4500 Activity 1 <br/>(2 Mark)
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Find the username and password
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>

            {/* Username */}
            <div className="form-control mb-2">

              <label className="label py-1">
                <span className="label-text text-gray-300 font-semibold">
                  Username
                </span>
              </label>

              <input
                type="text"
                placeholder="Enter username"
                className="input input-bordered w-full
                  bg-[#252c35] text-white border-gray-700
                  rounded-xl h-11 min-h-11
                  focus:outline-none focus:border-purple-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

            </div>

            {/* Password */}
            <div className="form-control mb-3">

              <label className="label py-1">
                <span className="label-text text-gray-300 font-semibold">
                  Password
                </span>
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="input input-bordered w-full
                    bg-[#252c35] text-white border-gray-700
                    rounded-xl h-11 min-h-11 pr-16
                    focus:outline-none focus:border-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-sm
                    text-purple-400 hover:text-purple-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn w-full h-11 min-h-11
                border-0 rounded-xl text-white font-semibold
                text-base bg-gradient-to-r from-indigo-600
                to-purple-600 hover:from-indigo-700
                hover:to-purple-700 shadow-lg"
            >
              Login →
            </button>

          </form>

          {/* Footer */}
          <div className="divider before:bg-gray-700
            after:bg-gray-700 my-2"></div>

          <p className="text-center text-xs text-gray-500">
            © 2026 Secure Login Portal
          </p>

        </div>
      </div>
    </div>
  );
}

export default App;
