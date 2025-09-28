import React from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Profile = () => {
  const { axios, user, setUser, fetchUser } = useAppContext()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [profile, setProfile] = React.useState(null)
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 })

  React.useEffect(()=>{
    let raf
    const onMove = (e)=>{
      const { clientX, clientY } = e
      raf = window.requestAnimationFrame(()=> setCursorPos({ x: clientX, y: clientY }))
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return ()=>{
      window.removeEventListener('mousemove', onMove)
      if(raf) cancelAnimationFrame(raf)
    }
  }, [])

  const load = async ()=>{
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user/profile?mask=false')
      if(data.success){
        setProfile(data.profile)
      }
    } finally { setLoading(false) }
  }

  React.useEffect(()=>{ if(user) load() }, [user])

  const onSave = async (e)=>{
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        licenseNumber: profile.licenseNumber,
        aadhaarNumber: (profile.aadhaarNumber || '').replace(/\s+/g, ''),
      }
      const { data } = await axios.put('/api/user/profile', payload)
      if(data.success){
        setUser(data.user)
        await load()
        await fetchUser()
      }
    } finally { setSaving(false) }
  }

  

  const onImageChange = async (e)=>{
    const file = e.target.files?.[0]
    if(!file) return
    const form = new FormData()
    form.append('image', file)
    await axios.post('/api/owner/update-image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    await load(); await fetchUser()
  }

  if(!user) return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-gray-500">Loading profile...</div></div>
  if(loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-gray-500">Loading profile...</div></div>
  if(!profile) return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-gray-500">No profile data</div></div>

  const licenseDisplay = profile.licenseNumber || ''
  const aadhaarDisplay = profile.aadhaarNumber || ''

  return (
    <div className="relative">
      {/* Cursor follower */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block"
        animate={{ x: cursorPos.x - 8, y: cursorPos.y - 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="h-4 w-4 rounded-full bg-primary/30 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.1)]"></div>
      </motion.div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            {/* Left: Avatar card */}
            <motion.div whileHover={{ y: -2 }} className="bg-white border border-borderColor rounded-xl p-6 flex flex-col items-center gap-4">
              <div className="relative group">
                <img src={user?.image || assets.user_profile} alt="profile" className="h-32 w-32 rounded-full object-cover border border-borderColor" />
                <label className="absolute bottom-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-md cursor-pointer opacity-90 group-hover:opacity-100">Change
                  <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                </label>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-gray-800">{profile.name}</div>
                <div className="text-sm text-gray-500">{profile.email}</div>
              </div>
            </motion.div>

            {/* Right: Details form */}
            <form onSubmit={onSave} className="bg-white border border-borderColor rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Name</label>
                <input value={profile.name || ''} onChange={e=> setProfile(p=>({...p, name: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-borderColor rounded-lg outline-none focus:border-primary" />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Email</label>
                <input disabled value={profile.email || ''} className="w-full mt-1 px-3 py-2 border border-borderColor rounded-lg bg-gray-50 text-gray-500" />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Phone</label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={e=>{
                    const digits = (e.target.value || '').replace(/\D/g, '').slice(0,10)
                    setProfile(p=>({...p, phone: digits}))
                  }}
                  className="w-full mt-1 px-3 py-2 border border-borderColor rounded-lg outline-none focus:border-primary"
                  inputMode="numeric"
                  pattern="^[0-9]{10}$"
                  title="Enter exactly 10 digits"
                  placeholder="Enter 10-digit phone number"
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Address</label>
                <input value={profile.address || ''} onChange={e=> setProfile(p=>({...p, address: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-borderColor rounded-lg outline-none focus:border-primary" />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Driver's License Number</label>
                <input value={licenseDisplay} onChange={e=> setProfile(p=>({...p, licenseNumber: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-borderColor rounded-lg outline-none focus:border-primary" />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Aadhaar Number</label>
                <input value={aadhaarDisplay} onChange={e=> {
                  const digits = (e.target.value || '').replace(/\D/g, '').slice(0,12)
                  const grouped = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
                  setProfile(p=>({...p, aadhaarNumber: grouped}))
                }} className="w-full mt-1 px-3 py-2 border border-borderColor rounded-lg outline-none focus:border-primary" inputMode="numeric" placeholder="1234 5678 9012" />
              </div>

              <div className="col-span-1 md:col-span-2 mt-2 flex justify-end">
                <button disabled={saving} className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg transition-all disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile


