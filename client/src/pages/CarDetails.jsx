import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const CarDetails = () => {

  const {id} = useParams()

  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, user, token, setShowLogin} = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY
  const [passengerName, setPassengerName] = useState('')
  const [passengerLicenseNumber, setPassengerLicenseNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('offline')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [paymentType, setPaymentType] = useState('card') // 'card' | 'upi'
  const [upiApp, setUpiApp] = useState('gpay') // 'gpay' | 'phonepe' | 'paytm'
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      if(!token || !user){
        setShowLogin && setShowLogin(true)
        toast.error('Please login to book a car')
        return
      }
      if(!axios.defaults.headers.common['Authorization']){
        axios.defaults.headers.common['Authorization'] = token
      }
      setSubmitting(true)
      const {data} = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate, 
        returnDate,
        passengerName,
        passengerLicenseNumber,
        paymentMethod,
        paymentType: paymentMethod === 'online' ? paymentType : null,
        paymentUpiApp: paymentMethod === 'online' && paymentType === 'upi' ? upiApp : null,
      })

      if (data.success){
        toast.success(data.message)
        navigate('/my-bookings')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally { setSubmitting(false) }
  }

  useEffect(()=>{
    setCar(cars.find(car => car._id === id))
  },[cars, id])

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65'/>
        Back to all cars
       </button>

       <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
          {/* Left: Car Image & Details */}
          <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

          className='lg:col-span-2'>
              <motion.img 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}

              src={car.image} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'/>
              <motion.div className='space-y-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div>
                  <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
                  <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
                </div>
                <hr className='border-borderColor my-6'/>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {[
                    {icon: assets.users_icon, text: `${car.seating_capacity} Seats`},
                    {icon: assets.fuel_icon, text: car.fuel_type},
                    {icon: assets.car_icon, text: car.transmission},
                    {icon: assets.location_icon, text: car.location},
                  ].map(({icon, text})=>(
                    <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    
                    key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                      <img src={icon} alt="" className='h-5 mb-2'/>
                      {text}
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Description</h1>
                  <p className='text-gray-500'>{car.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Features</h1>
                  <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    {
                      ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item)=>(
                        <li key={item} className='flex items-center text-gray-500'>
                          <img src={assets.check_icon} className='h-4 mr-2' alt="" />
                          {item}
                        </li>
                      ))
                    }
                  </ul>
                </div>

              </motion.div>
          </motion.div>

          {/* Right: Booking Form */}
          <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}

          onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>

            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>{currency}{car.pricePerDay}<span className='text-base text-gray-400 font-normal'>per day</span></p> 

            <hr className='border-borderColor my-6'/>

            <div className='flex flex-col gap-2'>
              <label htmlFor="passenger-name">Passenger Name</label>
              <input value={passengerName} onChange={e=> setPassengerName(e.target.value)}
              type="text" className='border border-borderColor px-3 py-2 rounded-lg' required id='passenger-name' placeholder='Enter full name'/>
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="passenger-license">Passenger License Number</label>
              <input value={passengerLicenseNumber} onChange={e=> setPassengerLicenseNumber(e.target.value)}
              type="text" className='border border-borderColor px-3 py-2 rounded-lg' required id='passenger-license' placeholder="License number"/>
            </div>

            {/* Demo Payment Method (visible only when logged in) */}
            {user && (
              <div className='flex flex-col gap-2'>
                <span>Payment Method </span>
                <div className='flex items-center gap-6'>
                  <label className='flex items-center gap-2'>
                    <input
                      type="radio"
                      name="payment-method"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={()=> { 
                        if(!user || !token){ setShowLogin && setShowLogin(true); toast.error('Please login to choose payment method'); return; }
                        setPaymentMethod('online'); setShowPaymentModal(true) 
                      }}
                    />
                    <span>Online</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type="radio"
                      name="payment-method"
                      value="offline"
                      checked={paymentMethod === 'offline'}
                      onChange={()=> { 
                        if(!user || !token){ setShowLogin && setShowLogin(true); toast.error('Please login to choose payment method'); return; }
                        setPaymentMethod('offline'); setShowPaymentModal(false) 
                      }}
                    />
                    <span>Offline</span>
                  </label>
                </div>
              </div>
            )}

            <div className='flex flex-col gap-2'>
              <label htmlFor="pickup-date">Pickup Date</label>
              <input 
                value={pickupDate} 
                onChange={(e)=>{
                  const nextPickup = e.target.value
                  // If current return date is before the new pickup, align it to pickup
                  if(returnDate && nextPickup && returnDate < nextPickup){
                    setReturnDate(nextPickup)
                  }
                  setPickupDate(nextPickup)
                }}
                type="date" 
                className='border border-borderColor px-3 py-2 rounded-lg' 
                required 
                id='pickup-date' 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="return-date">Return Date</label>
              <input 
                value={returnDate} 
                onChange={(e)=>{
                  const nextReturn = e.target.value
                  // Guard: don't allow return before pickup
                  if(pickupDate && nextReturn < pickupDate){
                    setReturnDate(pickupDate)
                    return
                  }
                  setReturnDate(nextReturn)
                }}
                type="date" 
                className='border border-borderColor px-3 py-2 rounded-lg' 
                required 
                id='return-date'
                min={(pickupDate || new Date().toISOString().split('T')[0])}
              />
            </div>

            <button disabled={submitting} className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer disabled:opacity-60'>{submitting ? 'Booking...' : 'Book Now'}</button>

            <p className='text-center text-sm'>No credit card required to reserve</p>

          </motion.form>

          {showPaymentModal && (
            <div className='fixed inset-0 z-50 flex items-center justify-center'>
              <div className='absolute inset-0 bg-black/40' onClick={()=> setShowPaymentModal(false)}></div>
              <div className='relative z-10 w-[92%] max-w-md bg-white rounded-xl border border-borderColor p-6 shadow-xl'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Online Payment </h3>

                {/* Method Switch */}
                <div className='flex items-center gap-2 p-1 bg-light rounded-lg text-sm mb-4'>
                  <button type='button' onClick={()=> setPaymentType('card')} className={`px-3 py-1.5 rounded-md ${paymentType==='card' ? 'bg-white shadow border border-borderColor text-gray-800' : 'text-gray-600'}`}>Debit/Credit Card</button>
                  <button type='button' onClick={()=> setPaymentType('upi')} className={`px-3 py-1.5 rounded-md ${paymentType==='upi' ? 'bg-white shadow border border-borderColor text-gray-800' : 'text-gray-600'}`}>UPI</button>
                </div>

                {paymentType === 'card' ? (
                  <div className='space-y-3'>
                    <div>
                      <label className='text-xs text-gray-500'>Cardholder Name</label>
                      <input value={cardName} onChange={e=> setCardName(e.target.value)} className='w-full mt-1 px-3 py-2 border border-borderColor rounded-lg outline-none focus:border-primary' placeholder='John Doe'/>
                    </div>
                    <div>
                      <label className='text-xs text-gray-500'>Card Number</label>
                      <input value={cardNumber} onChange={e=> setCardNumber((e.target.value||'').replace(/\D/g,'').slice(0,16))} className='w-full mt-1 px-3 py-2 border border-borderColor rounded-lg outline-none focus:border-primary' inputMode='numeric' placeholder='1234 5678 9012 3456'/>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='text-xs text-gray-500'>Expiry (MM/YY)</label>
                        <input value={cardExpiry} onChange={e=> { const v = (e.target.value||'').replace(/[^\d/]/g,'').slice(0,5); setCardExpiry(v) }} className='w-full mt-1 px-3 py-2 border border-borderColor rounded-lg outline-none focus:border-primary' placeholder='MM/YY'/>
                      </div>
                      <div>
                        <label className='text-xs text-gray-500'>CVV</label>
                        <input value={cardCvv} onChange={e=> setCardCvv((e.target.value||'').replace(/\D/g,'').slice(0,4))} className='w-full mt-1 px-3 py-2 border border-borderColor rounded-lg outline-none focus:border-primary' inputMode='numeric' placeholder='123'/>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-3 gap-3'>
                      {[{key:'gpay', label:'GPay', color:'bg-blue-500'}, {key:'phonepe', label:'PhonePe', color:'bg-violet-600'}, {key:'paytm', label:'Paytm', color:'bg-sky-500'}].map(app => (
                        <button
                          key={app.key}
                          type='button'
                          onClick={()=> setUpiApp(app.key)}
                          className={`flex flex-col items-center gap-2 border border-borderColor rounded-lg p-3 hover:shadow ${upiApp===app.key ? 'ring-2 ring-primary' : ''}`}
                        >
                          <span className={`h-10 w-10 ${app.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                            {app.label.slice(0,1)}
                          </span>
                          <span className='text-xs text-gray-700'>{app.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className='text-xs text-gray-500'>Selecting an app will simulate a UPI flow.</p>
                  </div>
                )}

                <div className='mt-5 flex justify-end gap-3'>
                  <button type='button' onClick={()=> setShowPaymentModal(false)} className='px-4 py-2 rounded-lg border border-borderColor text-gray-600'>Cancel</button>
                  <button type='button' onClick={()=> { setShowPaymentModal(false) }} className='px-4 py-2 rounded-lg bg-primary hover:bg-primary-dull text-white'>
                    {paymentType === 'card' ? 'Pay' : `Pay with ${upiApp === 'gpay' ? 'GPay' : upiApp === 'phonepe' ? 'PhonePe' : 'Paytm'}`}
                  </button>
                </div>
              </div>
            </div>
          )}
       </div>

    </div>
  ) : <Loader />
}

export default CarDetails
