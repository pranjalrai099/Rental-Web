import React, { useEffect, useState } from 'react';
import AccountNav from './pages/AccountNav';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PlaceImg from './PlaceImg';
import { toast } from 'react-toastify'; // Assuming react-toastify is being used for notifications

export default function MyCart() {
    const [cart, setCart] = useState([]);
   const navigate=useNavigate();
    useEffect(() => {
        axios.get('/cart')
            .then(response => {
                console.log("Cart response:", response.data);
                setCart(response.data);
            })
            .catch(error => {
                console.error("Error fetching cart:", error);
            });
    }, []);

    // Function to remove an item from the cart
    const removeFromCart = async (itemId) => {
        try {
            await axios.delete(`/cart/${itemId}`);
            setCart(prevCart => prevCart.filter(item => item._id !== itemId));
            toast.success("Item removed from cart successfully!");
            navigate('/account/my-cart')
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Failed to remove item from cart.");
        }
    };

    return (
        <div>
            <AccountNav />
            <div className="flex flex-col gap-3">
                {cart.length > 0 ? (
                    cart.map(item => (
                        <Link to={`/account/my-cart/${item._id}`} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden" key={item._id}>
                            <div className="w-48">
                                {item.place ? <PlaceImg place={item.place} /> : <div>No Image</div>}
                            </div>
                            <div className="py-3 pr-3 grow">
                                <h2 className="text-2xl mb-2">{item.place ? item.place.title : "No Title Available"}</h2>
                                <h2 className="text-xl mb-2 text-gray-800">{item.place ? item.place.address : "No Address Available"}</h2>
                                <div className="flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                    <span className="text-2xl">
                                        Total price: ${item.place.price}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => removeFromCart(item._id)} className="text-xl flex gap-2 text-white p-3 bg-blue-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                    Remove
                                </button>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="w-full p-2 mt-3">
                 <p className='text-3xl font-semibold'>No Any Places in the Cart</p>
         <img src="https://as2.ftcdn.net/jpg/01/32/37/79/500_F_132377917_YL0Eq2Eqb9CzLbkFwN992l4ZnrALdfg1.jpg" alt=""/>
       </div>
                )}
            </div>
        </div>
    );
}
