const MainContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="sm:ml-64 p-4 px-6 flex-1 bg-orange-50 rounded-lg overflow-auto mt-20 sm:mr-6">
      {children}
    </div>
  );
}

export default MainContainer;