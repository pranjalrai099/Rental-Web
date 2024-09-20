import { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "./UserContext"
export default function HeaderPage(){
  const {user}=useContext(UserContext);

    return(
        <div>
             <header className='flex justify-between'>
  <Link to={'/'} className="flex items-center gap-1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 rotate-90">
  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
</svg>
<span className="font-bold text-xl">Rental</span>
  </Link>
  <div className='flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4'>
  <div>Anywhere</div>
  <div className='border-l border-gray-300'></div>
  <div>Anytime</div>
  <div className='border-l border-gray-300'></div>
  <div>Add Guests</div>
  <button className="bg-red-500 text-white p-1 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
</svg>
</button>
  </div>
  <Link to={user?'/account':'/login'} className='flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4'>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>
  <div className='bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden py-2 px-4' >
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 relative top-1">
  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
</svg>
  </div>
  <div className='text-black text-lg'>
    {user?.name}
  </div>
  </Link>
  </header>
  </div>
    )
}