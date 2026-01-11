import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Reorder = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, LOW_STOCK, CRITICAL, NORMAL
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { darkMode } = useSelector(state => state.ui);

  // Mock data for liquor products with reorder levels
  const mockLiquorData = [
    {
      id: 1,
      productName: "Johnnie Walker Black Label",
      category: "WHISKY",
      currentStock: 8,
      reorderLevel: 15,
      minimumStock: 5,
      maximumStock: 100,
      costPrice: 1850,
      sellingPrice: 2200,
      supplier: "Premium Spirits Ltd",
      lastOrderDate: "2024-10-15",
      leadTime: 7,
      status: "LOW_STOCK",
      salesRate: "HIGH"
    },
    {
      id: 2,
      productName: "Smirnoff Red Vodka",
      category: "VODKA",
      currentStock: 45,
      reorderLevel: 20,
      minimumStock: 10,
      maximumStock: 150,
      costPrice: 850,
      sellingPrice: 1100,
      supplier: "Vodka Imports",
      lastOrderDate: "2024-11-01",
      leadTime: 5,
      status: "NORMAL",
      salesRate: "MEDIUM"
    },
    {
      id: 3,
      productName: "Bacardi White Rum",
      category: "RUM",
      currentStock: 3,
      reorderLevel: 12,
      minimumStock: 6,
      maximumStock: 80,
      costPrice: 720,
      sellingPrice: 950,
      supplier: "Caribbean Spirits",
      lastOrderDate: "2024-10-20",
      leadTime: 10,
      status: "CRITICAL",
      salesRate: "HIGH"
    },
    {
      id: 4,
      productName: "Jack Daniels Tennessee",
      category: "WHISKY",
      currentStock: 22,
      reorderLevel: 18,
      minimumStock: 8,
      maximumStock: 120,
      costPrice: 2100,
      sellingPrice: 2600,
      supplier: "American Whisky Co",
      lastOrderDate: "2024-11-05",
      leadTime: 14,
      status: "NORMAL",
      salesRate: "MEDIUM"
    },
    {
      id: 5,
      productName: "Absolut Vodka",
      category: "VODKA",
      currentStock: 5,
      reorderLevel: 15,
      minimumStock: 7,
      maximumStock: 100,
      costPrice: 1200,
      sellingPrice: 1550,
      supplier: "Swedish Imports",
      lastOrderDate: "2024-10-25",
      leadTime: 7,
      status: "CRITICAL",
      salesRate: "HIGH"
    },
    {
      id: 6,
      productName: "Captain Morgan Spiced Rum",
      category: "RUM",
      currentStock: 12,
      reorderLevel: 10,
      minimumStock: 5,
      maximumStock: 60,
      costPrice: 680,
      sellingPrice: 890,
      supplier: "Caribbean Spirits",
      lastOrderDate: "2024-11-10",
      leadTime: 5,
      status: "LOW_STOCK",
      salesRate: "LOW"
    },
    {
      id: 7,
      productName: "Bombay Sapphire Gin",
      category: "GIN",
      currentStock: 25,
      reorderLevel: 12,
      minimumStock: 6,
      maximumStock: 80,
      costPrice: 1350,
      sellingPrice: 1750,
      supplier: "Gin Specialists",
      lastOrderDate: "2024-11-12",
      leadTime: 10,
      status: "NORMAL",
      salesRate: "MEDIUM"
    },
    {
      id: 8,
      productName: "Heineken Beer (Case)",
      category: "BEER",
      currentStock: 2,
      reorderLevel: 8,
      minimumStock: 4,
      maximumStock: 50,
      costPrice: 1800,
      sellingPrice: 2400,
      supplier: "Beverage Distributors",
      lastOrderDate: "2024-10-18",
      leadTime: 3,
      status: "CRITICAL",
      salesRate: "HIGH"
    }
  ];

  const categories = ["ALL", "WHISKY", "VODKA", "RUM", "GIN", "BEER", "WINE", "BRANDY"];

  useEffect(() => {
    // Simulate API call
    setProducts(mockLiquorData);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'ALL' || product.status === filter;
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const getStockStatus = (currentStock, reorderLevel, minimumStock) => {
    if (currentStock <= minimumStock) {
      return { status: "CRITICAL", color: "bg-red-500", text: "Out of Stock Soon", icon: "fa-exclamation-circle" };
    } else if (currentStock <= reorderLevel) {
      return { status: "LOW_STOCK", color: "bg-orange-500", text: "Reorder Now", icon: "fa-exclamation-triangle" };
    } else {
      return { status: "NORMAL", color: "bg-green-500", text: "In Stock", icon: "fa-check-circle" };
    }
  };

  const getStockPercentage = (currentStock, maximumStock) => {
    return (currentStock / maximumStock) * 100;
  };

  const getProgressBarColor = (percentage, status) => {
    if (status === "CRITICAL") return "bg-red-500";
    if (status === "LOW_STOCK") return "bg-orange-500";
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    return "bg-yellow-500";
  };

  const handleEditReorder = (product) => {
    setEditingProduct({...product});
    setShowEditModal(true);
  };

  const handleSaveReorder = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id ? {...editingProduct, status: getStockStatus(editingProduct.currentStock, editingProduct.reorderLevel, editingProduct.minimumStock).status} : p
      ));
      setShowEditModal(false);
      setEditingProduct(null);
    }
  };

  const handleGeneratePurchaseOrder = (product) => {
    const orderQuantity = product.maximumStock - product.currentStock;
    alert(`Purchase Order Generated!\nProduct: ${product.productName}\nQuantity: ${orderQuantity} bottles\nSupplier: ${product.supplier}`);
  };

  const handleBulkOrder = () => {
    const criticalProducts = filteredProducts.filter(p => p.status === "CRITICAL" || p.status === "LOW_STOCK");
    if (criticalProducts.length === 0) {
      alert("No products need immediate reordering!");
      return;
    }
    
    const orderSummary = criticalProducts.map(p => ({
      product: p.productName,
      quantity: p.maximumStock - p.currentStock,
      supplier: p.supplier
    }));
    
    alert(`Bulk Purchase Order Created for ${criticalProducts.length} products!`);
    console.log("Bulk Order:", orderSummary);
  };

  const calculateTotalReorderValue = () => {
    return filteredProducts
      .filter(product => product.status === "CRITICAL" || product.status === "LOW_STOCK")
      .reduce((total, product) => {
        const orderQuantity = product.maximumStock - product.currentStock;
        return total + (orderQuantity * product.costPrice);
      }, 0);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full overflow-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reorder Level Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor stock levels and automate purchasing</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button 
            onClick={handleBulkOrder}
            className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <i className="fas fa-cart-plus mr-2"></i>
            Bulk Purchase Order
          </button>
          <button 
            onClick={() => alert('Stock Report Generated!')}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <i className="fas fa-file-export mr-2"></i>
            Stock Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle text-red-500 text-xl mr-3"></i>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Critical Stock</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-300">
                {products.filter(p => getStockStatus(p.currentStock, p.reorderLevel, p.minimumStock).status === "CRITICAL").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-orange-500 text-xl mr-3"></i>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">Low Stock</h3>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">
                {products.filter(p => getStockStatus(p.currentStock, p.reorderLevel, p.minimumStock).status === "LOW_STOCK").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Normal Stock</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                {products.filter(p => getStockStatus(p.currentStock, p.reorderLevel, p.minimumStock).status === "NORMAL").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center">
            <i className="fas fa-rupee-sign text-purple-500 text-xl mr-3"></i>
            <div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">Reorder Value</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                {calculateTotalReorderValue().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Status
            </label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="CRITICAL">Critical</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Liquor Category
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by product or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Stock Level Monitoring ({filteredProducts.length} products)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock Levels
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reorder Settings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.currentStock, product.reorderLevel, product.minimumStock);
                const stockPercentage = getStockPercentage(product.currentStock, product.maximumStock);
                const orderQuantity = product.maximumStock - product.currentStock;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.productName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.category} • {product.supplier}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          Sales: {product.salesRate} • Lead Time: {product.leadTime} days
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 mr-4">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>{product.currentStock}</span>
                            <span>{product.maximumStock}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressBarColor(stockPercentage, stockStatus.status)}`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {product.currentStock} / {product.maximumStock}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Order Qty: {orderQuantity}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white space-y-1">
                        <div>Reorder: <span className="font-semibold">{product.reorderLevel}</span></div>
                        <div>Min: <span className="font-semibold">{product.minimumStock}</span></div>
                        <div>Max: <span className="font-semibold">{product.maximumStock}</span></div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${stockStatus.color}`}>
                        <i className={`fas ${stockStatus.icon} mr-1`}></i>
                        {stockStatus.text}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditReorder(product)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit Reorder Levels"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleGeneratePurchaseOrder(product)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Generate Purchase Order"
                        >
                          <i className="fas fa-file-invoice"></i>
                        </button>
                        <button 
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="View Stock History"
                        >
                          <i className="fas fa-chart-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <i className="fas fa-boxes text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
            <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Edit Reorder Level Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Edit Reorder Levels - {editingProduct.productName}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Stock
                </label>
                <input
                  type="number"
                  value={editingProduct.currentStock}
                  onChange={(e) => setEditingProduct({...editingProduct, currentStock: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reorder Level
                </label>
                <input
                  type="number"
                  value={editingProduct.reorderLevel}
                  onChange={(e) => setEditingProduct({...editingProduct, reorderLevel: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Stock
                </label>
                <input
                  type="number"
                  value={editingProduct.minimumStock}
                  onChange={(e) => setEditingProduct({...editingProduct, minimumStock: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Stock
                </label>
                <input
                  type="number"
                  value={editingProduct.maximumStock}
                  onChange={(e) => setEditingProduct({...editingProduct, maximumStock: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReorder}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reorder;