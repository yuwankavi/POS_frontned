import React, { useState } from 'react';
import Modal from '../../../common/Modal';
import { closeModal } from '../../../../actions/modalActions';
import { useDispatch } from 'react-redux';

const categories = [
    {
        mainCategory: "Electronics",
        subCategory: [
            { name: "Mobile Phones", product: ["iPhone", "Samsung Galaxy", "OnePlus", "nokia"] },
            { name: "Laptops", product: ["MacBook", "Dell XPS", "HP Spectre"] },
            { name: "Cameras", product: ["Canon", "Nikon", "Sony"] },
            { name: "Sound", product: ["Bose", "Sony", "JBL"] },
        ],
    },
    {
        mainCategory: "Clothing",
        subCategory: [
            { name: "Men", product: ["Shirts", "Pants", "Jackets"] },
            { name: "Women", product: ["Dresses", "Tops", "Skirts"] },
            { name: "Kids", product: ["T-Shirts", "Shorts", "Shoes"] },
            { name: "Baby", product: ["T-Shirts", "Shorts", "Shoes"] },
        ],
    },
];

export default function BarCodePrintModal() {
    const dispatch = useDispatch();
    const [mainCategory, setMainCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState(0);

    // Selected main category
    const selectedMainCategory = categories.find(c =>
        c.mainCategory.toLowerCase().includes(mainCategory.toLowerCase())
    );

    // Filter subcategories based on main category and partial match
    const subCategories = selectedMainCategory
        ? selectedMainCategory.subCategory.filter(s =>
            s.name.toLowerCase().includes(subCategory.toLowerCase())
        ).slice(0, 3) // only 3 subcategories
        : [];



    const selectedSubCategory = subCategories.find(s =>
        s.name.toLowerCase().includes(subCategory.toLowerCase())
    );

    const products = selectedSubCategory
        ? selectedSubCategory.product.filter(p =>
            p.toLowerCase().includes(product.toLowerCase())
        ).slice(0, 3)
        : [];
    // console.log(products);    

    const handlePrint = () => {
        alert(`Printing: ${mainCategory} - ${subCategory} - ${product} -(${quantity})`);
        dispatch(closeModal());
    };



    return (
        <Modal size="md">
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold dark:text-white underline text-center mb-6">
                    Create New Bar Code
                </h3>

                {/* Main Category */}
                <div className="flex items-center gap-4 mb-2">
                    <label className="text-lg font-semibold dark:text-white w-40">Main Category</label>
                    <input
                        list="main-categories"
                        value={mainCategory}
                        onChange={e => setMainCategory(e.target.value)}
                        className="px-3 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <datalist id="main-categories">
                        {categories.map(c => (
                            <option key={c.mainCategory} value={c.mainCategory} />
                        ))}
                    </datalist>
                </div>

                {/* Sub Category */}
                <div className="flex items-center gap-4 mb-2">
                    <label className="text-lg font-semibold dark:text-white w-40">Sub Category</label>
                    <input
                        list="sub-categories"
                        value={subCategory}
                        onChange={e => setSubCategory(e.target.value)}
                        className="px-3 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <datalist id="sub-categories">
                        {subCategories.map(s => (
                            <option key={s.name} value={s.name} />
                        ))}
                    </datalist>
                </div>

                {/* Product */}
                <div className="flex items-center gap-4 mb-2">
                    <label className="text-lg font-semibold dark:text-white w-40">Product (Item)</label>
                    <input
                        list="products"
                        value={product}
                        onChange={e => setProduct(e.target.value)}
                        className="px-3 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <datalist id="products">
                        {products.map(p => (
                            <option key={p} value={p} />
                        ))}
                    </datalist>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-4">
                    <label className="text-lg font-semibold dark:text-white w-40">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        step="1"
                        min="0"
                        className="px-3 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                {/* Print Button */}
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handlePrint}
                        className="h-10 px-4 py-2 border rounded-lg bg-green-500 text-white hover:bg-green-600 focus:ring-2 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <i className="fas fa-print"></i> Print
                    </button>
                </div>
            </div>
        </Modal>
    );
}
