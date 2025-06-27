import React, { useEffect, useState, useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import axios from 'axios'




const NewArivals = () => {
    const scrollRef = useRef(null);
    const [isDragging, setisDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftStart, setScrollLeftStart] = useState(0);
    const [canScrollRight, setcanScrollRight] = useState(true);
    const [canScrollLeft, setcanScrollLeft] = useState(true);

    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -300 : 300;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    }

    const [newArrivals, setnewArrivals] = useState([]);
    useEffect(() =>{
    const fetchNewArrivals = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`)
            setnewArrivals(response.data)   
        } catch (error) {
            console.error(error); 
        }
    }
    fetchNewArrivals();
    }, [])

    // Mouse drag scroll handlers
    const handleMouseDown = (e) => {
        setisDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftStart(scrollRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setisDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1;
        scrollRef.current.scrollLeft = scrollLeftStart - walk;
    };

    const handleMouseLeave = () => {
        setisDragging(false);
    };

    // Update Scroll Button
    const updateScrollButton = () => {
        const container = scrollRef.current;
        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
            setcanScrollLeft(leftScroll > 0);
            setcanScrollRight(rightScrollable);
        }
    }

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButton);
            updateScrollButton();
            return () => {
                container.removeEventListener("scroll", updateScrollButton);
            }
        }
    }, [newArrivals]);

    useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let intervalId = null;

    const autoScroll = () => {
        // If at (or past) end, reset to start
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
            container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            container.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    intervalId = setInterval(autoScroll, 6000);

    return () => {
        clearInterval(intervalId);
    };
}, []);


    return (
        <section className='py-14 px-5 lg:px-30'>
            <div className='conatainer mx-auto text-center mb-10 relative'>
                <h2 className='text-3xl font-bold mb-4'>
                    Explore New Arrivals
                </h2>
                <p className='text-lg text-gray-600 mb-8'>
                    Discover the latest style straight off the runway, frshly added to keep your wardrobe on cutting edge fashion
                </p>
                {/* Scroll Button */}
                <div className="absolute right-1 top-15 hidden lg:flex space-x-1 ">
                    <button
                        className={`p-2 rounded-2xl shadow-md shadow-gray-400 ${canScrollLeft ? "bg-white text-black hover:bg-black hover:text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"} `}
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                    >
                        <FiChevronLeft className='text-2xl' />
                    </button>
                    <button
                        className={`p-2 rounded-2xl shadow-md shadow-gray-400 ${canScrollRight ? "bg-white text-black hover:bg-black hover:text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"} `}
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                    >
                        <FiChevronRight className='text-2xl' />
                    </button>
                </div>
            </div>
            {/* Scrollable content */}
            <div
                ref={scrollRef}
                className={`container mx-auto overflow-x-scroll flex space-x-6 relative scrollbar-hide`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }}
            >
                {newArrivals.map((product) => (
                    <div key={product._id} className='min-w-[100%] sm:min-w-[35%] lg:w-[30%] relative'>
                        <img src={product.images[0]?.url} alt={product.images[0]?.alttext || product.name} className='w-full h-[500px] object-cover rounded-lg' draggable="false"/>
                        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-4 rounded-b-lg">
                            <Link to={`/product/${product._id}`} className='block'>
                                <h4 className='font-medium'>
                                    {product.name}
                                </h4>
                                <p className="mt-1">{product.discountPrice}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default NewArivals