import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      // TODO: Implement actual authentication logic here
      console.log('Logging in with:', { email, password });
      setIsLoggedIn(true);
      setUserEmail(email);
    } catch (err) {
      console.error('Login error:', err);
      throw new Error('Invalid credentials');
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      // TODO: Implement actual registration logic here
      console.log('Registering with:', { email, password, name });
      setIsLoggedIn(true);
      setUserEmail(email);
    } catch (err) {
      console.error('Registration error:', err);
      throw new Error('Registration failed');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail(undefined);
  };

  return (
    <>
      <nav className="navbar bg-base-100 max-sm:rounded-box max-sm:shadow sm:border-b border-base-content/25 fixed top-0 left-0 right-0 z-[999] shadow-sm">
        <button type="button" className="btn btn-text max-sm:btn-square sm:hidden me-2" aria-haspopup="dialog" aria-expanded="false" aria-controls="default-sidebar" data-overlay="#default-sidebar" >
          <span className="icon-[tabler--menu-2] size-5"></span>
        </button>
        <div className="flex flex-1 items-center">
          <img src={logo} className="w-12 h-12" alt="logo" />
          <a className="link text-base-content link-neutral text-xl font-semibold no-underline" href="/">
            MelonTusk
          </a>
        </div>
        <div className="navbar-end flex items-center gap-4">
          {isLoggedIn ? (
            <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
              <button 
                id="dropdown-scrollable" 
                type="button" 
                className="dropdown-toggle flex items-center focus:outline-gray-800 focus:outline-rounded" 
                aria-haspopup="menu" 
                aria-expanded="false" 
                aria-label="Dropdown"
              >
                <div className="avatar">
                  <div className="size-9.5 rounded-full bg-primary text-white flex items-center justify-center">
                    <span className="text-lg font-medium">{userEmail?.[0].toUpperCase()}</span>
                  </div>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-open:opacity-100 hidden min-w-60" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-avatar">
                <li className="dropdown-header gap-2">
                  <div className="avatar">
                    <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      <span className="text-lg font-medium">{userEmail?.[0].toUpperCase()}</span>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-base-content text-base font-semibold">{userEmail}</h6>
                    <small className="text-base-content/50">User</small>
                  </div>
                </li>
                <li>
                  <a className="dropdown-item" href="/settings">
                    <span className="icon-[tabler--settings] size-5"></span>
                    Settings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/faq">
                    <span className="icon-[tabler--question-mark] size-5"></span>
                    FAQs
                  </a>
                </li>
                <li className="dropdown-footer gap-2">
                  <button 
                    className="btn btn-error btn-soft btn-block"
                    onClick={handleLogout}
                  >
                    <span className="icon-[tabler--logout] size-5"></span>
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              <span className="icon-[tabler--login] size-5 mr-2"></span>
              Login
            </button>
          )}
        </div>
      </nav>

      <aside id="default-sidebar" className="overlay sm:shadow-none overlay-open:translate-x-0 drawer drawer-start hidden max-w-64 sm:flex sm:translate-x-0 bottom-16 pt-16 z-[998]" role="dialog" >
        <div className="drawer-body px-2 pt-4">
          <ul className="menu p-0">
            <li>
              <a href="/">
                <span className="icon-[tabler--home] size-6"></span>
                Dashboard
              </a>
            </li>
            <li>
              <a href="/markets">
                <span className="icon-[tabler--coin-bitcoin] size-6"></span>
                Markets
              </a>
            </li>
            <li>
              <a href="/watchlist">
                <span className="icon-[tabler--star] size-6"></span>
                Watchlist
              </a>
            </li>
            <li>
              <a href="/assets">
                <span className="icon-[tabler--wallet] size-6"></span>
                Assets
              </a>
            </li>
            <li>
              <a href="/transactions">
                <span className="icon-[tabler--arrows-exchange] size-6"></span>
                Transactions
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onRegister={handleRegister}
      />
    </>
  );
}

export default Navbar;