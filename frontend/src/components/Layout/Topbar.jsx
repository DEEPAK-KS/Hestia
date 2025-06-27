import {TbBrandMeta} from "react-icons/tb";
import {IoLogoInstagram} from "react-icons/io";
import {RiTwitterXLine} from "react-icons/ri";
import React from 'react'

const Topbar = () => {
  return (
    <div className='bg-[#ea2e0e] text-white'>
        <div className='container mx-auto flex justify-between items-center py-3 px-4'>
            <div className="hidden md:flex items-center space-x-4">
                <a href="#" className='hover:text-gray-300'>
                    <TbBrandMeta className="h-5 w-5"/>
                </a>
                <a href="#" className='hover:text-gray-300'>
                    <IoLogoInstagram className="h-5 w-5"/>
                </a>
                <a href="#" className='hover:text-gray-300'>
                    <RiTwitterXLine className="h-4 w-4"/>
                </a>
            </div>
            <div className="text-sm text-center flex-grow">
                <span>We Ship World-Wide Fast & Reliable</span>
            </div>
            <div className="hidden text-sm  md:block">
            <a href="tel: +91 95648 75428" className="hover:text-gray-300">
                +91 95648 75428
            </a>
        </div>
        </div>
    </div>
  )
}

export default Topbar