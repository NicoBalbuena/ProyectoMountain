
import { FacebookLogo, GithubLogo } from "@phosphor-icons/react";
import { TwitterLogo } from "@phosphor-icons/react/dist/ssr";

const Footer = () => {
  return (
    <footer className="items-center flex flex-col border-t-2 mt-6 gap-1 pb-7 bg-primary absolute bottom-0 w-full">
      <div className="flex gap-2 mt-4">
        <FacebookLogo size={28} weight="fill" className="text-blue-600 cursor-pointer" />
        <TwitterLogo size={28} weight="fill" className="text-blue-500 cursor-pointer" />
        <GithubLogo size={28} weight="fill" className="cursor-pointer" />
      </div>
      <div>
        © 2024 MountainHaven, Inc.
      </div>
      <div className="flex gap-2 items-center ">
        <p className="hover:underline cursor-pointer">privacidad</p>
        <div className="w-[3px] bg-gray-500 rounded-full h-[3px] "></div>
        <p className="hover:underline cursor-pointer">Terminos</p>
        <div className="w-[3px] bg-gray-500 rounded-full h-[3px] "></div>
        <p className="hover:underline cursor-pointer">Mapa del sitio</p>
        <div className="w-[3px] bg-gray-500 rounded-full h-[3px] "></div>
        <p className="hover:underline cursor-pointer">Informacion de la compañia</p>
      </div>
    </footer>
  )
}

export default Footer