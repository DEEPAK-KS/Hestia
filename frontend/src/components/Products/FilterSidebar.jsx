import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const categories = ["Top Wear", "Bottom Wear"];
const colors = ["Red", "Blue", "Green", "Black", "Gold", "Pink", "Purple", "Orange"];
const sizes = ["S", "M", "L", "XL", "XXL"];
const materials = ["Cotton", "Polyester", "Wool"];
const brands = ["Nike", "Adidas", "Puma", "Reebok"];
const genders = ["Men","Women","Unisex"];

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    category: '',
    gender: "",
    colors: '',
    size: [],
    material: [],
    minprice: '',
    maxprice: '',
    brand: [],
    rating: ''
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilter({
      category: params.category || '',
      gender: params.gender || '',
      colors: params.colors || '',
      size: params.size ? params.size.split(',') : [],
      material: params.material ? params.material.split(',') : [],
      minprice: params.minprice || '',
      maxprice: params.maxprice || '',
      brand: params.brand ? params.brand.split(',') : [],
      rating: params.rating || ''
    });
    setPriceRange([
      params.minprice ? parseFloat(params.minprice) : 0,
      params.maxprice ? parseFloat(params.maxprice) : 100
    ]);
  }, [searchParams]);
  

  return (
    <React.Fragment>
      <div className="p-4 overflow-x-hidden">
        <div className="text-xl font-medium text-gray-800 mb-4">Filter</div>
        {/* Category Filter */}
        <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Category</label>
            {categories.map((category) => (
                <div key={category} className="flex items-center mb-1">
                    <input
                        type="radio"
                        name="category"
                        id={category}
                        checked={filter.category === category}
                        onChange={() => {
                            const newCategory = filter.category === category ? '' : category;
                            setFilter({ ...filter, category: newCategory });
                            setSearchParams({ ...filter, category: newCategory });
                        }}
                        className="mr-2 h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{category}</span>
                </div>
            ))}
        </div>

        {/* Gender Filter */}
        <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Gender</label>
            {genders.map((gender) => (
                <div key={gender} className="flex items-center mb-1">
                    <input
                        type="radio"
                        name="gender"
                        id={gender}
                        checked={filter.gender === gender}
                        onChange={() => {
                            const newGender = filter.gender === gender ? '' : gender;
                            setFilter({ ...filter, gender: newGender });
                            setSearchParams({ ...filter, gender: newGender });
                        }}
                        className="mr-2 h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{gender}</span>
                </div>
            ))}
        </div>

        {/* Color Filter */}
        <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
                {colors.map((colors) => (
                    <button
                        key={colors}
                        type="button"
                        title={colors}
                        onClick={() => {
                            const newColor = filter.colors === colors ? '' : colors;
                            setFilter({ ...filter, colors: newColor });
                            setSearchParams({ ...filter, colors: newColor });
                        }}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition
                            ${filter.colors === colors ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'}
                        `}
                        style={{ backgroundColor: colors.toLowerCase() }}
                    >
                        {filter.colors === colors && (
                            <span className="text-white font-bold">&#10003;</span>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Size Filter */}
        <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Size</label>
            {sizes.map((size) => (
                <div key={size} className="flex items-center mb-1">
                    <input
                        type="checkbox"
                        name="size"
                        id={size}
                        checked={filter.size.includes(size)}
                        onChange={() => {
                            let newSizes = filter.size.includes(size)
                                ? filter.size.filter(s => s !== size)
                                : [...filter.size, size];
                            setFilter({ ...filter, size: newSizes });
                            setSearchParams({ ...filter, size: newSizes.join(',') });
                        }}
                        className="mr-2 h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{size}</span>
                </div>
            ))}
        </div>

        {/* Material Filter */}
        <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Material</label>
            {materials.map((material) => (
                <div key={material} className="flex items-center mb-1">
                    <input
                        type="checkbox"
                        name="material"
                        id={material}
                        checked={filter.material.includes(material)}
                        onChange={() => {
                            let newMaterials = filter.material.includes(material)
                                ? filter.material.filter(m => m !== material)
                                : [...filter.material, material];
                            setFilter({ ...filter, material: newMaterials });
                            setSearchParams({ ...filter, material: newMaterials.join(',') });
                        }}
                        className="mr-2 h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{material}</span>
                </div>
            ))}
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Brand</label>
            {brands.map((brand) => (
                <div key={brand} className="flex items-center mb-1">
                    <input
                        type="checkbox"
                        name="brand"
                        id={brand}
                        checked={filter.brand.includes(brand)}
                        onChange={() => {
                            let newBrands = filter.brand.includes(brand)
                                ? filter.brand.filter(b => b !== brand)
                                : [...filter.brand, brand];
                            setFilter({ ...filter, brand: newBrands });
                            setSearchParams({ ...filter, brand: newBrands.join(',') });
                        }}
                        className="mr-2 h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{brand}</span>
                </div>
            ))}
        </div>

        {/* Price Range Slider — Max Only */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Max Price</label>
          <div className="flex flex-col items-center">
            <input
              type="range"
              min={0}
              max={1000}
              value={priceRange[1] > 1000 ? 1000 : priceRange[1]}
              step={1}
              aria-label={`Maximum price ₹${priceRange[1] > 1000 ? '1000+' : priceRange[1]}`}
              aria-valuetext={`₹${priceRange[1] > 1000 ? '1000+' : priceRange[1]}`}
              onChange={e => {
                const max = parseInt(e.target.value, 10);
                setPriceRange([0, max]);
                setFilter({ ...filter, minprice: 0, maxprice: max });
                setSearchParams({ ...filter, minprice: 0, maxprice: max });
              }}
              className="w-full"
            />
            <div className="flex justify-between w-full mt-2 text-sm text-gray-700">
              <span>₹0</span>
              <span>₹{priceRange[1] >= 1000 ? '1000+' : priceRange[1]}</span>
            </div>
          </div>
        </div>
        <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Rating</label>
            <select
                value={filter.rating}
                onChange={e => {
                    setFilter({ ...filter, rating: e.target.value });
                    setSearchParams({ ...filter, rating: e.target.value });
                }}
                className="border rounded px-2 py-1 w-full"
            >
                <option value="">All Ratings</option>
                <option value="1">1★ & up</option>
                <option value="2">2★ & up</option>
                <option value="3">3★ & up</option>
                <option value="4">4★ & up</option>
                <option value="5">5★</option>
            </select>
        </div>
      </div>
    </React.Fragment>
  )
}

export default FilterSidebar