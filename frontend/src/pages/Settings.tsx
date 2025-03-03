import { useTheme } from '../core/ThemeContext';

const Settings = () => {
  const { theme: currentTheme, setTheme } = useTheme();

  const themes = [
    'light',
    'dark',
    'gourmet',
    'corporate',
    'luxury',
    'soft',
  ];

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-medium">
        Settings
      </div>
      <div className="divider m-0 h-1"></div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Theme Settings</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <div
                key={theme}
                className={`card bg-base-100 cursor-pointer hover:scale-105 transition-transform
                  ${currentTheme === theme ? 'ring-2 ring-primary' : 'border border-base-300'}`}
                data-theme={theme}
                onClick={() => handleThemeChange(theme)}
              >
                <div className="card-body p-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral"></div>
                  </div>
                  <div className="mt-2 text-sm capitalize">
                    {theme === 'gourmet' ? `${theme} - Best UI experience` : theme}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Preview</h3>
            <div className="flex flex-wrap gap-2">
              <button className="btn">Default</button>
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
              <button className="btn btn-accent">Accent</button>
              <button className="btn btn-ghost">Ghost</button>
              <button className="btn btn-link">Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;