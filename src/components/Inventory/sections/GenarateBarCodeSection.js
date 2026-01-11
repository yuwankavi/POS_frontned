
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../../actions/modalActions';
// import BarCodePrintModal from '../modals/BarCodePrintModal';
import SeachedItemCard from '../common/SeachedItemCard';

const GenarateBarCodeSection = () => {
    const dispatch = useDispatch();
    const { darkMode, activeModal } = useSelector(state => state.ui);
    //for show img
    const [showImage, setShowImage] = useState(false);
    const [loading, setLoading] = useState(false);


    const [itemName, setItemName] = useState();
    const [amount, setAmount] = useState(0);

    const mockData = [
        { productName: "Sahan", sku: "sku1", price: "1000" },
        { productName: "Apple", sku: "sku2", price: "2000" },
        { productName: "Orange", sku: "sku3", price: "1500" },
        { productName: "Banana", sku: "sku4", price: "800" },
        { productName: "Grapes", sku: "sku5", price: "2500" },
        { productName: "Mango", sku: "sku6", price: "3000" },
        { productName: "Pineapple", sku: "sku7", price: "2200" },
        { productName: "Strawberry", sku: "sku8", price: "2800" },
        { productName: "Watermelon", sku: "sku9", price: "3500" },
        { productName: "Papaya", sku: "sku10", price: "1800" },
    ];

    const sortedData = mockData.filter(obj =>
        itemName === undefined || itemName === ""
            ? true
            : obj.productName.toLowerCase().includes(itemName.toLowerCase()) ||
            obj.sku.toLowerCase().includes(itemName.toLowerCase())
    )
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "barCodeId") {
            setItemName(value);
        } else if (name === "amount") {
            setAmount(value);
        }
    };

    const handleSaveSettings = () => {
        if (itemName == undefined || itemName === "") {
            alert("Select a product!");
            return;
        }
        //to make sure it  have the right value
        const matchedItem = sortedData.find(
            obj => obj.productName.toLowerCase() === itemName.toLowerCase()
        );

        if (!matchedItem) {
            alert("Select a valid product from the list!");
            setItemName("");
            return;
        }
        if (amount == 0) {
            alert("Amount Cant be 0!");
            return;
        }
        alert("Prrint sucess");
    }

    const handleClick = (item) => {
        setItemName(item.productName);
        setShowImage(true);
        setLoading(true);
    };

    const openBarCodeModal = () => {
        dispatch(openModal("CREATE_BAR_CODE"))
    }


    return (
        <>
            <div className=" w-full flex justify-center bg-gray-100 dark:bg-gray-900">
                <div className="h-[1500px]  w-[500px] mt-8 flex items-start justify-center bg-gray-100 dark:bg-gray-900 ">
                    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg ">

                        <div className="mb-6">
                            <div className="flex gap-3 mb-4">
                                <input
                                    type="text"
                                    name="barCodeId"
                                    value={itemName}
                                    onChange={handleInputChange}
                                    placeholder="Search by item or code"
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                <button
                                    onClick={openBarCodeModal}
                                    className="px-4 py-2 border rounded-lg bg-green-500 text-white hover:bg-green-600 focus:ring-2 transition-all hover:shadow-lg hover:-translate-y-0.5 ">
                                    <i className="fas fa-plus"></i> Create Bar Code
                                </button>
                            </div>
                        </div>

                        {/* maping the seaching item only load 4 */}
                        <div className="flex flex-col h-80 gap-4 overflow-y-auto ">
                            {/* {mockData.filter(obj => 
                itemName === undefined || itemName === "" 
                ? true 
                : obj.productName.toLowerCase().includes(itemName.toLowerCase()) ||
                    obj.sku.toLowerCase().includes(itemName.toLowerCase())
                ) */}
                            {sortedData.slice(0, 3)
                                .map((item, index) => (
                                    <SeachedItemCard
                                        key={index}
                                        productName={item.productName}
                                        sku={item.sku}
                                        price={item.price}
                                        onClick={() => { handleClick(item); }}
                                    />
                                ))}
                        </div>

                        <div className="flex items-start gap-3 mb-2">
                            {/* loadin the picture  ! beacuse when fist time usrl it cahses in to the chace memory so onloding dosent happen again*/}
                            {showImage && itemName && (
                                <div className="w-[190px] h-[150px] flex items-center justify-center">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="relative w-[190px] h-[150px]">
                                            {loading && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                            <img
                                                src={`https://placehold.co/190x90?text=${itemName}`}
                                                alt="Example"
                                                className="absolute inset-0 m-auto rounded shadow-md"
                                                onLoad={() => setLoading(false)}
                                            />
                                        </div>

                                    </div>
                                </div>
                            )}


                            <div className="flex gap-3 mt-6 ml-auto">
                                <div className="items-center justify-items-center">
                                    <h6 className=" text-lg font-semibold mb-3 dark:text-white">Quaintity</h6   >
                                    <input
                                        type="number"
                                        name="amount"
                                        value={amount}
                                        onChange={handleInputChange}
                                        placeholder="Amount"
                                        step="1"
                                        min="0"
                                        className="flex-1 px-3 py-2 border w-32 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <button
                                    onClick={() => handleSaveSettings()}
                                    className=" h-10 mt-10 px-4 py-2 border rounded-lg bg-green-500 text-white hover:bg-green-600 focus:ring-2 transition-all hover:shadow-lg hover:-translate-y-0.5 "
                                >
                                    <i className="fas fa-print"></i> Print
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>


            {/* <div>
    {activeModal === "BARCODE_MODAL" && (
            <BarCodePrintModal/>
        )}
    </div> */}
        </>

    );
};

export default GenarateBarCodeSection;