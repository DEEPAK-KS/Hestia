import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails, updateProduct } from '../../redux/slice/productsSlice';

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const {selectedProduct, loading, error} = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    countInstock: 0, 
    sku: '',
    category: '',
    brand: '',
    sizes: [],
    colors: [],
    gender: '',
    images: [],
    collections: '' // <-- Add this line
  })

  const [uploadingImages, setUploadingImages] = useState(false); // State to manage image upload state
  useEffect(() => {
    if(id){
      dispatch(fetchProductDetails(id));
    }
  }, [id, dispatch])

  useEffect(() => {
    if(selectedProduct){
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handlechange = (e) => {
    const {name, value} = e.target;
    setProductData((prevData) => ({...prevData, [name]: value}))
  }
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Show local preview immediately
    const localImages = files.map(file => ({
      url: URL.createObjectURL(file)
    }));
    setProductData(prev => ({
      ...prev,
      images: [...prev.images, ...localImages]
    }));

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      setUploadingImages(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();

      // Assume data.imageUrls is an array of uploaded image URLs
      if (Array.isArray(data.imageUrls)) {
        setProductData(prev => ({
          ...prev,
          images: [
            ...prev.images.filter(img => !localImages.some(l => l.url === img.url)),
            ...data.imageUrls.map(url => ({ url }))
          ]
        }));
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploadingImages(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productData); // <-- Add this line for debugging
    dispatch(updateProduct({id, productData}))
    navigate('/admin/products');
  }

  if(loading) return <div>Loading...</div>;
  if(error) return <div className='text-red-500'>Error: {error}</div>;
  return (
    <div className='max-w-5xl p-6 mx-auto shadow-md rounded-md'>
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            required
            type="text"
            name="name"
            value={productData.name}
            onChange={handlechange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            required
            name="description" // change from "desc" to "description"
            value={productData.description} // change from productData.desc
            onChange={handlechange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        {/* Price */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Price</label>
          <input
            required
            type="number"
            name="price"
            value={productData.price}
            onChange={handlechange}
            className='w-full border border-gray-300 rounded-md p-2'
            min="0"
            step="0.01"
          />
        </div>
        {/* Count In Stock */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Count In Stock</label>
          <input
            required
            type="number"
            name="countInstock"
            value={productData.countInstock} 
            onChange={handlechange}
            className='w-full border border-gray-300 rounded-md p-2'
            min="0"
          />
        </div>
        {/* SKU */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            required
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handlechange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        {/* Category */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Category</label>
          <input
            required
            type="text"
            name="category"
            value={productData.category}
            onChange={handlechange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        {/* Brand */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Brand</label>
          <input
            required
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handlechange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        {/* Sizes */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Sizes (comma separated)</label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(',')}
            onChange={e =>
              setProductData(prev => ({
                ...prev,
                sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              }))
            }
            className='w-full border border-gray-300 rounded-md p-2'
            placeholder="e.g. S,M,L,XL"
          />
        </div>
        {/* Gender */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handlechange}
            className='w-full border border-gray-300 rounded-md p-2'
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        {/* Colors */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Colors (comma separated)</label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(',')}
            onChange={e =>
              setProductData(prev => ({
                ...prev,
                colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
              }))
            }
            className='w-full border border-gray-300 rounded-md p-2'
            placeholder="e.g. red,blue,green"
          />
        </div>
        {/* Collections */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Collections</label>
          <input
            required
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handlechange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        {/* Images */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Upload Image</label>
          <div className="flex gap-2 mb-2">
            {productData.images.map((img, idx) => (
              <div key={img.url || idx} className="relative inline-block">
                <img
                  src={img.url}
                  alt={`Product ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setProductData(prev => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== idx)
                    }))
                  }
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-800"
                  style={{ transform: 'translate(50%,-50%)' }}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block hover:underline hover:text-blue-500"
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 w-full text-white rounded-md transition-colors px-6 py-2 hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditProduct