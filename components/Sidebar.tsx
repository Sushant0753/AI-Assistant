import { FiMenu, FiLayout } from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 z-10 h-screen w-16 bg-[#0D1218] flex flex-col items-center pt-5 border-r border-neutral-800">
      <div className="flex flex-col items-center gap-6">
        <button
          className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Menu"
        >
          <FiMenu size={24} />
        </button>
        <button
          className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Layout"
        >
          <FiLayout size={24} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;