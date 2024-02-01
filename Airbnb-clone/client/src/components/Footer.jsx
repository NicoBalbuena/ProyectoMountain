
import { FacebookLogo, GithubLogo, Tipi } from "@phosphor-icons/react";
import { TwitterLogo } from "@phosphor-icons/react/dist/ssr";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {

  const { pathname } = useLocation()


  return (
    <footer className="items-center flex flex-col border-t-2 pt-4 gap-1 pb-7 bg-primary mt-auto w-full">

      <Tipi size={32} weight="thin" />
      <div className="flex gap-2 mt-2">
        <FacebookLogo size={28} weight="fill" className="text-blue-600 cursor-pointer" />
        <TwitterLogo size={28} weight="fill" className="text-blue-500 cursor-pointer" />
        <GithubLogo size={28} weight="fill" className="cursor-pointer" />
      </div>
      <div>
        © 2024 MountainHaven, Inc.
      </div>
      <div className="flex gap-2 items-center ">
        <p className="hover:underline cursor-pointer">Privacy</p>
        <div className="w-[3px] bg-gray-500 rounded-full h-[3px] "></div>
        <p className="hover:underline cursor-pointer">Terms</p>
        <div className="w-[3px] bg-gray-500 rounded-full h-[3px] "></div>
        <p className="hover:underline cursor-pointer">Site Map</p>
        <div className="w-[3px] bg-gray-500 rounded-full h-[3px] "></div>
        <Link to={pathname !== `/about` ? "/about" : `/`} className="hover:underline cursor-pointer">Company information</Link>
      </div>
    </footer>
  )
}

export default Footer