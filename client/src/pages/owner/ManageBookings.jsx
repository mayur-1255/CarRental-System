import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])

  // Admin view: show full IDs

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."/>

      <div className='w-full mt-6 rounded-md border border-borderColor overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-[950px] w-full border-collapse text-left text-sm text-gray-600'>
            <thead className='text-gray-500 sticky top-0 bg-white'>
              <tr>
                <th className="p-3 font-medium w-14">#</th>
                <th className="p-3 font-medium">Booking</th>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Booked For</th>
                <th className="p-3 font-medium max-lg:hidden">Location</th>
                <th className="p-3 font-medium max-md:hidden">Period</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium max-md:hidden">Payment</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index)=>(
                <tr key={index} className='border-t border-borderColor text-gray-600 hover:bg-light/40'>

                  <td className='p-3 align-top text-gray-500'>{index + 1}</td>

                  <td className='p-3 align-top'>
                    <div className='flex flex-col gap-1'>
                      <span className='text-xs text-gray-500'>#{booking.bookingid}</span>
                      <span className='text-xs'>On {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                  </td>

                  <td className='p-3 align-top'>
                    <div className='flex items-center gap-3'>
                      <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover'/>
                      <div className='flex flex-col'>
                        <span className='font-medium text-gray-700'>{booking.car.brand} {booking.car.model}</span>
                        <span className='text-xs text-gray-500 max-lg:hidden'>{booking.car.year} • {booking.car.category}</span>
                      </div>
                    </div>
                  </td>

                  <td className='p-3 max-md:hidden align-top'>
                    <div className='flex flex-col gap-1'>
                      <span className='font-medium text-gray-700'>{booking.passengerName}</span>
                      <span className='text-xs'>License: {booking.passengerLicenseNumber}</span>
                      <span className='text-xs text-gray-500'>Booked By: {booking.user?.name} ({booking.user?.phone || '—'})</span>
                    </div>
                  </td>

                  <td className='p-3 max-lg:hidden align-top'>
                    {booking.car.location}
                  </td>

                  <td className='p-3 max-md:hidden align-top'>
                    {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                  </td>

                  <td className='p-3 align-top whitespace-nowrap'>{currency}{booking.price}</td>

                  <td className='p-3 max-md:hidden align-top'>
                    <span className={`px-3 py-1 rounded-full text-xs capitalize ${booking.paymentMethod === 'online' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {booking.paymentMethod || 'offline'}
                      {booking.paymentMethod === 'online' && booking.paymentType === 'card' && ' • Card'}
                      {booking.paymentMethod === 'online' && booking.paymentType === 'upi' && ` • UPI (${booking.paymentUpiApp})`}
                    </span>
                  </td>

                  <td className='p-3 align-top'>
                    {booking.status === 'pending' ? (
                      <select onChange={e=> changeBookingStatus(booking._id, e.target.value)} value={booking.status} className='px-2 py-1.5 mt-1 text-gray-600 border border-borderColor rounded-md outline-none bg-white'>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ): (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{booking.status}</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default ManageBookings
