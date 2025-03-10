import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: (email: string, password: string) => void;
  onLogout: () => void;
  onRegister?: (email: string, password: string, name: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onLogin,
  onLogout,
  onRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegistering && onRegister) {
        await onRegister(email, password, name);
      } else {
        await onLogin(email, password);
      }
      setEmail("");
      setPassword("");
      setName("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    onClose();
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
    <>
      {/* Backdrop with higher z-index than navbar */}
      <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={onClose} />

      {/* Modal content with even higher z-index */}
      <div className="fixed inset-0 flex items-center justify-center z-[1001] pointer-events-none">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative pointer-events-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <span className="icon-[tabler--x] size-5"></span>
          </button>

          {isLoggedIn ? (
            // Logout view
            <div className="text-center">
              <span className="icon-[tabler--user-circle] size-16 text-primary mb-4"></span>
              <h2 className="text-2xl font-bold mb-6">Account</h2>
              <button onClick={handleLogout} className="btn btn-error w-full">
                <span className="icon-[tabler--logout] size-5 mr-2"></span>
                Logout
              </button>
            </div>
          ) : (
            // Login/Register view
            <>
              <div className="text-center mb-6">
                <span className="icon-[tabler--user-circle] size-16 text-primary mb-4"></span>
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
                  <div className="bg-error/10 text-error rounded-lg p-3 mb-4 text-sm">
                    {error}
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
                    />
                  </div>

                  {!isRegistering && (
                    <div className="flex items-center justify-between">
                      <button type="button" className="text-sm text-primary">
                        Forgot Password?... Well, we don't have that feature
                        yet.
                      </button>
                    </div>
                  )}

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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthModal;
