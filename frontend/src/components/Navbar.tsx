import logo from '../assets/images/logo.png';

const Navbar = () => {

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
          <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
            <button id="dropdown-scrollable" type="button" className="dropdown-toggle flex items-center" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
              <div className="avatar">
                <div className="w-10 rounded-full">
                <div className="icon-[tabler--user-circle] bg-primary size-10"></div>
                {/* <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="avatar" />  TODO: Add link to real image later */}
                </div>
              </div>
      </button>
      <ul className="dropdown-menu dropdown-open:opacity-100 hidden min-w-60" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-avatar">
        <li className="dropdown-header gap-2">
          <div className="avatar">
            <div className="w-10 rounded-full">
            <div className="icon-[tabler--user-circle] bg-primary size-10"></div>
                {/* <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="avatar" />  TODO: Add link to real image later */}
            </div>
          </div>
          <div>
            <h6 className="text-base-content text-base font-semibold">Jean Charles</h6>
          </div>
        </li>
        <li>
          <a className="dropdown-item" href="/settings">
            <span className="icon-[tabler--settings]"></span>
            Settings
          </a>
        </li>

        <li>
          <a className="dropdown-item" href="/faqs">
            <span className="icon-[tabler--help-triangle]"></span>
            FAQs
          </a>
        </li>
        <li className="dropdown-footer gap-2">
          <a className="btn btn-error btn-soft btn-block" href="/logout">
            <span className="icon-[tabler--logout]"></span>
            Sign out
          </a>
        </li>
      </ul>
    </div>
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
    </>
  );
}

export default Navbar;

