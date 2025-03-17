import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      // Check for error response from axios
      const axiosError = error as any;
      if (axiosError.response?.data?.error) {
        return axiosError.response.data.error;
      }

      // Messages d'erreur spécifiques pour l'authentification
      if (error.message.includes('User not found') || error.message.includes('Invalid email or password')) {
        return "Invalid email or password. Please check your credentials.";
      }
      if (error.message.includes('Email already exists')) {
        return "This email is already registered. Please try logging in instead.";
      }
      if (error.message.includes('Password too short')) {
        return "Password must be at least 8 characters long and contain at least one number.";
      }
      // Message par défaut si l'erreur n'est pas reconnue
      return error.message;
    }
    return "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegistering) {
        await register({
          username: name,
          email,
          password
        });
      } else {
        await login({
          email,
          password
        });
      }
      setEmail("");
      setPassword("");
      setName("");
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  if (!isOpen) return null;

  return (
    <div className="relative">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-600">
            {isRegistering
              ? "Please fill in your information"
              : "Please login to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-error/10 text-error rounded-lg p-3 mb-4 text-sm flex items-start">
              <span className="icon-[tabler--alert-circle] size-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                  required={isRegistering}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
                placeholder={isRegistering ? "Min. 6 characters with numbers" : "Enter your password"}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${
                isLoading ? "loading" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : isRegistering
                ? "Sign Up"
                : "Login"}
            </button>

            <div className="text-center text-sm text-gray-600">
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={switchMode}
              >
                {isRegistering ? "Login here" : "Sign up"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
