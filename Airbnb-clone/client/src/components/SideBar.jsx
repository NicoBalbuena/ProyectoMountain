import { Link, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { DASHBOARD_SIDEBAR_LINKS } from "../lib/consts/navigation";
import { RiLogoutBoxLine } from "react-icons/ri";
import classNames from "classnames";

const linksClasses =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base";

export const SideBar = () => {
  return (
    <aside className="flex flex-col bg-neutral-900 w-60 p-3 max-h-screen text-white sticky top-0">
      {/* Enlace para "/": */}
      <Link to="/" className="flex items-center gap-2 px-1 py-3">
        <IoHome fontSize={25} />
        <span className="text-neutral-100 text-lg">MountainHaven</span>
      </Link>
      <section className="flex-1 py-8 flex flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS?.map((item) => (
          <ul>
            <SideBarLinks key={item.key} item={item} />
          </ul>
        ))}
      </section>
      
    </aside>
  );
};

function SideBarLinks({ item }) {
  const { pathname } = useLocation();
  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path
          ? "bg-neutral-700 text-neutral-100"
          : "text-neutral-400 ",
        linksClasses
      )}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}
