import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { UserContext } from "./UserContext";
import axios from "axios";
import SearchPage from "./pages/SearchPage";
import FilterInputGuestModal from "./pages/FilterGuestInput";
import FilterbyMoney from "./pages/FilterMoney";
import FilterbyGuest from "./pages/FilterGuestInput";

export default function HeaderPage() {
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState(''); // initial query is empty
  const [places, setPlaces] = useState([]);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook for redirection
  const [filterModeMoney, setFilterMoneyMode] = useState(false);
  const [filterModeGuest, setFilterGuestMode] = useState();

  // Fetch places based on the search query
  const handleSearch = async () => {
    if (searchQuery === '') {
      // Redirect to homepage if the search query is cleared
      navigate('/');
    } else {
      try {
        const response = await axios.get('/search', {
          params: { q: searchQuery }, // Pass the search query as a parameter
        });
        setPlaces(response.data);
        setReady(true);
      } catch (error) {
        console.error('Error fetching search results', error);
      }
    }
  };

  // Trigger search when searchQuery changes, but only if it’s not empty
  useEffect(() => {
    if (searchQuery !== '') {
      handleSearch();
    }
  }, [searchQuery]);

  return (
    <div>
      <header className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        <Link to={'/'} className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 rotate-90">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
          <span className="font-bold text-xl">Rental</span>
        </Link>

        {/* Search bar moves next to the logo on small screens */}
        <div className="flex h-full w-full sm:w-1/3 items-center gap-1 border border-gray-700 rounded-3xl py-1 px-1 pl-2">
          <input
            className="p-1 flex-grow rounded-full border-[1px] border-gray-400"
            placeholder="Search for a place"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
          <div className="flex text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>

        {/* Filters */}
       
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
  {/* Guest Filter */}
  <div className="w-full flex justify-center">
    <Link to={'/'} className="py-3 px-2 w-full sm:w-32 border border-gray-400 rounded-2xl bg-white text-gray-800 text-center">
      <button onClick={() => {setFilterGuestMode(true)}} className="bg-white text-3xl flex gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
        <p>Filter</p>
      </button>
    </Link>
    {filterModeGuest && (
      <FilterbyGuest
        setFilterGuestMode={setFilterGuestMode}
        filterModeGuest={filterModeGuest}
      />
    )}
  </div>

  {/* Money Filter */}
  <div className="w-full flex justify-center">
    <Link to={'/'} className="py-3 px-2 w-full sm:w-32 border border-gray-400 rounded-2xl bg-white text-gray-800 text-center">
      <button onClick={() => {setFilterMoneyMode(true)}} className="bg-white text-3xl flex gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p>Filter</p>
      </button>
    </Link>
    {filterModeMoney && (
      <FilterbyMoney
        setFilterMoneyMode={setFilterMoneyMode}
        filterModeMoney={filterModeMoney}
      />
    )}
  </div>
</div>


        {/* Account / Login Link */}
        <Link to={user ? '/account' : '/login'} className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden py-2 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 relative top-1">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-black text-lg">
            {user?.name}
          </div>
        </Link>
      
      </header>

      {/* Conditionally render the homepage or search results */}
      {searchQuery === '' ? (
        <div>
          {/* Render your original homepage content here */}
          <h1 className="mt-4 text-gray-900 text-3xl">Welcome to the Rental Platform</h1>
          {/* Add more content for the homepage if needed */}
        </div>
      ) : (
        <div>
          {/* Render the list of places using SearchPage component */}
          {places.length > 0 ? (
            <div className="places-list">
              <SearchPage places={places} />
            </div>
          ) : (
            <h1 className="mt-14 text-4xl p-3 mb-40">No places found.</h1>
          )}
        </div>
      )}
    </div>
  );
}
