import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = ({ open = false, setOpen = ()=>{} }) => {

    const {user} = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
      <Link to='/'>
        <img src={assets.logo} alt="" className="h-7"/>
      </Link>
      <div className='flex items-center gap-4'>
        <button onClick={()=> setOpen(!open)} className='md:hidden p-2 rounded border border-borderColor' aria-label='Toggle sidebar'>
          <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className='h-4 w-4'/>
        </button>
        <p className='max-md:hidden'>Welcome, {user?.name || "Owner"}</p>
      </div>
      {open && (
        <button aria-label='Close sidebar backdrop' onClick={()=> setOpen(false)} className='fixed inset-0 bg-black/30 md:hidden'></button>
      )}
    </div>
  )
}

export default NavbarOwner
