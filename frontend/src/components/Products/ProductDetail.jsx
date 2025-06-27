
import React, { useEffect, useState } from 'react'
import { TbBrightness } from 'react-icons/tb'
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useDispatch, useSelector } from 'react-redux';
import {fetchProductDetails, fetchSimilarProducts} from "../../redux/slice/productsSlice"
import { addToCart } from '../../redux/slice/cartSlice';
import { useParams } from 'react-router-dom';



const ProductDetail = ({productId}) => {
    const {Id} = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector ((state)=> state.products)
    const {user, guestId} = useSelector((state)=> state.auth);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncrease = () => {
        setQuantity((prev) => (prev < selectedProduct.countInstock ? prev + 1 : prev));
    };

    const [mainImage, setMainImage] = React.useState("");

    const productFetchId = productId || Id;
    useEffect(()=>{
        if(productFetchId){
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts(productFetchId)); 
        }
    },[dispatch, productFetchId])

    useEffect(() => {
        if(selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);
    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Please select a color and size before adding to cart.", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }
        setIsButtonDisabled(true);
        
        dispatch(addToCart({
            productId: productFetchId,
            quantity,
            size: selectedSize,
            color: selectedColor,
            guestId,
            userId: user?._id
        })) .then(()=>{
            toast.success("Product Added to the Cart",{
                duration: 1000,
            });
        })
        .finally(()=>{
            setIsButtonDisabled(false);
        })
    };
        
    

    if (loading){
        return <p>Loading...</p>
    }
    if (error){
        return <p>Error: {error}</p>
    }


    return (
        <div className='p-6'>
            {selectedProduct && (
            <div className="max-w-6xl mx-auto bg-white rounded-lg">
                <div className="flex flex-col md:flex-row">
                    {/* Left Thumbnails */}
                    <div className="hidden md:flex flex-col space-y-4 mr-6">
                        {selectedProduct.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.alt || `Thumbnail index ${index}`}
                                className={`w-22 h-22 object-cover rounded-lg cursor-pointer ${mainImage === image.url ? 'border-2 border-gray-600' : 'shadow-lg shadow-stone-600'}`}
                                onClick={() =>setMainImage(image.url)}
                            />
                        ))}
                    </div>
                    {/* Main Image */}
                    <div className="md:w-1/2">
                        <div className="mb-4">
                            {mainImage && (
                                <img
                                    src={mainImage}
                                    alt="Main Product"
                                    className='w-full h-auto object-cover rounded-lg'
                                />
                            )}
                        </div>
                    </div>
                    {/* Mobile Thumbnails */}
                    <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
                        {selectedProduct.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.alt || `Thumbnail index ${index}`}
                                className={`w-22 h-22 object-cover rounded-lg cursor-pointer ${mainImage === image.url ? 'border-2 border-gray-600' : 'shadow-lg shadow-stone-600'}`}
                                    onClick={() =>setMainImage(image.url)}/>
                        ))}
                    </div>
                    {/* Right Side */}
                    <div className="md:w-1/2 md:ml-10">
                        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                            {selectedProduct.name}
                        </h1>
                        <p className="text-lg text-gray-600 mb-1 line-through">
                            ₹{selectedProduct.price && `${selectedProduct.price}`}
                        </p>
                        <p className="text-xl text-gray-500 mb-2">
                            ₹{selectedProduct.discountPrice}
                        </p>
                        <p className="text-gray-600 mb-4">
                            {selectedProduct.description}
                        </p>
                        <div className="mb-4">
                            <p className="text-gray-700">
                                Color:
                                <span className="flex gap-2 mt-2">
                                    {selectedProduct.colors.map((color) => (
                                        <button
                                            key={color}
                                            className={`w-8 h-8 rounded-full ${selectedColor === color ? ' border-4 border-black' : ''} hover:opacity-80`}
                                            style={{
                                                backgroundColor: color.toLowerCase(),
                                                filter: "brightness(0.5)"
                                            }}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setIsButtonDisabled(false);
                                            }}
                                        ></button>
                                    ))}
                                </span>
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-700">Size:</p>
                            <div className="flex gap-2 mt-2">
                                {selectedProduct.sizes.map((sizes) => (
                                    <button
                                        key={sizes}
                                        className={`px-4 py-2 border border-gray-300 rounded  ${selectedSize === sizes ? 'bg-black text-white' : ''}`}
                                        onClick={() => {
                                            setSelectedSize(sizes);
                                        }}
                                    >
                                        {sizes}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-700">Quantity</p>
                            <div className="flex items-center mt-2 space-x-4">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                    onClick={handleDecrease}
                                    disabled={quantity === 1}
                                >-</button>
                                <span className="text-lg">{quantity}</span>
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                    onClick={handleIncrease}
                                >+</button>
                            </div>
                        </div>
                        <button disabled={isButtonDisabled} onClick={handleAddToCart} className={`bg-black text-white py-2 rounded w-full mb-4 ${isButtonDisabled? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-900'}`}>
                            {isButtonDisabled ? "Adding to cart..." : "Add to Cart"}
                        </button>
                        <div className="mt-10 text-gray-700">
                            <h3 className="text-xl font-bold mb-4">Characteristics</h3>
                            <table className='w-full text-left text-sm text-gray-600'>
                                <tbody>
                                    <tr className='border-b border-gray-200'>
                                        <td className='py-2'>Brand</td>
                                        <td className='py-2'>{selectedProduct.brand}</td>
                                    </tr>
                                    <tr className='border-b border-gray-200'>
                                        <td className='py-2'>Material</td>
                                        <td className='py-2'>{selectedProduct.material}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="mt-20">
                    <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
                    {/* Pass similarProducts as 'products' prop */}
                    <ProductGrid products={similarProducts} loading={loading} error={error}/>
                </div>
            </div>
            )}
        </div>
    )
}

export default ProductDetail