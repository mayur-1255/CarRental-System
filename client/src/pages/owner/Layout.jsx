import React, { useEffect, useState } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const {isOwner, navigate} = useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(()=>{
    if(!isOwner){
      navigate('/')
    }
  },[isOwner])
  useEffect(()=>{
    setSidebarOpen(false)
  }, [location.pathname])
  return (
    <div className='flex flex-col'>
      <NavbarOwner open={sidebarOpen} setOpen={setSidebarOpen} />
      {sidebarOpen && (<button aria-label='Close sidebar backdrop' onClick={()=> setSidebarOpen(false)} className='fixed inset-0 bg-black/30 md:hidden z-40'></button>)}
      <div className='flex'>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
