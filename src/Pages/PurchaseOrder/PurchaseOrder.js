

// export default PurchaseOrder;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiShoppingCart, 
  FiTruck, 
  FiPackage, 
  FiFileText, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiArrowRight,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiHash,
  FiBox,
  FiAlertCircle,
  FiRefreshCw,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiPercent,
  FiTag
} from 'react-icons/fi';
import { listSupplier } from '../../actions/supplierAction';
import { listAllPurchaseOrders, getPurchaseOrderById, createPurchaseOrder } from '../../actions/purchaseOrderActions';
import { fetchProducts } from '../../actions/POS/productAction';
import { clearPoPrefillData } from '../../actions/uiActions';
import purchaseOrderService from '../../services/purchaseOrderService';

const PurchaseOrder = () => {
  const { darkMode, poPrefillData } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  
  // Get suppliers from Redux
  const { suppliers = [] } = useSelector((state) => state.supplierList);
  
  // Get products from Redux (POS products)
  const { allProducts: products = [], loading: productsLoading } = useSelector((state) => state.products);
  
  // Get purchase orders from Redux
  const { loading: poLoading, purchaseOrders = [], error: poError } = useSelector((state) => state.poList);
  const { loading: poDetailLoading, purchaseOrder: selectedPO } = useSelector((state) => state.poDetails);
  const { loading: poCreating, success: poCreateSuccess, error: poCreateError } = useSelector((state) => state.poCreate || {});
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newItem, setNewItem] = useState({ product: '', productCode: '', quantity: 1, price: 0 });
  const [isCreatingPO, setIsCreatingPO] = useState(false);
  const [currentPO, setCurrentPO] = useState({
    supplier: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    paymentTerms: 'Net 30',
    shippingAddress: '',
    notes: '',
    discount: 0,
    tax: 0
  });

  // Load suppliers, products, and purchase orders on component mount
  useEffect(() => {
    dispatch(listSupplier());
    dispatch(fetchProducts());
    dispatch(listAllPurchaseOrders());
  }, [dispatch]);

  // Handle prefill data from ROA Reorder button (via Redux)
  useEffect(() => {
    if (poPrefillData && suppliers.length > 0) {
      // Find the supplier from the list
      const supplier = suppliers.find(s => 
        s.SUP_CODE?.toString() === poPrefillData.supplierId?.toString() ||
        s.SUP_NAME === poPrefillData.supplierName
      );
      
      if (supplier) {
        // Set the supplier
        setSelectedSupplier(supplier);
        setCurrentPO(prev => ({
          ...prev,
          supplier: supplier.SUP_NAME,
          shippingAddress: supplier.SUP_ADDRESS
        }));
      }
      
      // Pre-fill the product in the form
      if (poPrefillData.productCode && poPrefillData.productName) {
        setProductSearchTerm(poPrefillData.productName);
        setSelectedProduct({
          id: poPrefillData.productCode,
          name: poPrefillData.productName,
          price: poPrefillData.purchasePrice || 0
        });
        setNewItem({
          product: poPrefillData.productName,
          productCode: poPrefillData.productCode,
          quantity: 1,
          price: poPrefillData.purchasePrice || 0
        });
      }
      
      // Open the Create New PO modal automatically
      setIsNewPOModalOpen(true);
      
      // Clear the prefill data after using it
      dispatch(clearPoPrefillData());
    }
  }, [poPrefillData, suppliers, dispatch]);

  // Filter products based on search term
  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    p.id?.toString().includes(productSearchTerm) ||
    p.sku?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    p.barcode?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Dummy product data
  const dummyProducts = [
    { id: 1, name: 'Laptop', sku: 'LP-001', price: 120000, stock: 25 },
    { id: 2, name: 'Mouse', sku: 'MS-002', price: 2500, stock: 100 },
    { id: 3, name: 'Keyboard', sku: 'KB-003', price: 4500, stock: 50 },
    { id: 4, name: 'Monitor', sku: 'MN-004', price: 35000, stock: 30 },
    { id: 5, name: 'Printer', sku: 'PR-005', price: 28000, stock: 15 },
    { id: 6, name: 'Scanner', sku: 'SC-006', price: 32000, stock: 10 },
    { id: 7, name: 'Router', sku: 'RT-007', price: 12000, stock: 40 },
    { id: 8, name: 'External HDD', sku: 'HD-008', price: 15000, stock: 60 },
  ];

  // Dummy purchase orders data
  const dummyPurchaseOrders = [
    { 
      id: 'PO-2026-001', 
      supplier: 'ABC Distributors', 
      supplierCode: 'SUP001',
      items: 5, 
      totalAmount: 25000.00, 
      orderDate: '2026-01-18', 
      expectedDate: '2026-01-22',
      status: 'Pending',
      createdBy: 'Admin'
    },
    { 
      id: 'PO-2026-002', 
      supplier: 'XYZ Suppliers', 
      supplierCode: 'SUP002',
      items: 12, 
      totalAmount: 48500.00, 
      orderDate: '2026-01-15', 
      expectedDate: '2026-01-20',
      status: 'Received',
      createdBy: 'Manager'
    },
    { 
      id: 'PO-2026-003', 
      supplier: 'Global Trading Co.', 
      supplierCode: 'SUP003',
      items: 3, 
      totalAmount: 12000.00, 
      orderDate: '2026-01-10', 
      expectedDate: '2026-01-15',
      status: 'Cancelled',
      createdBy: 'Admin'
    },
    { 
      id: 'PO-2026-004', 
      supplier: 'Metro Wholesalers', 
      supplierCode: 'SUP004',
      items: 8, 
      totalAmount: 35750.00, 
      orderDate: '2026-01-19', 
      expectedDate: '2026-01-25',
      status: 'Pending',
      createdBy: 'Admin'
    },
    { 
      id: 'PO-2026-005', 
      supplier: 'City Supplies Ltd.', 
      supplierCode: 'SUP005',
      items: 15, 
      totalAmount: 62000.00, 
      orderDate: '2026-01-12', 
      expectedDate: '2026-01-18',
      status: 'Received',
      createdBy: 'Manager'
    },
  ];

  // Filter purchase orders - use real data from API
  const filteredOrders = purchaseOrders.filter(order => {
    const poId = `PO-${order.poId}`;
    const matchesSearch = poId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const statusLabel = purchaseOrderService.getStatusLabel(order.status);
    const matchesStatus = statusFilter === 'all' || statusLabel.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Filter active suppliers
  const activeSuppliers = suppliers.filter(s => s.SUP_STATUS === 'A');

  // Statistics from real data
  const stats = {
    total: purchaseOrders.length,
    pending: purchaseOrders.filter(o => o.status === 'P').length,
    received: purchaseOrders.filter(o => o.status === 'R').length,
    cancelled: purchaseOrders.filter(o => o.status === 'C').length,
    totalValue: purchaseOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Handle view PO
  const handleViewPO = (poId) => {
    dispatch(getPurchaseOrderById(poId));
    setIsViewModalOpen(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(listAllPurchaseOrders());
  };

  const getStatusColor = (status) => {
    const colors = purchaseOrderService.getStatusColor(status);
    return `${colors.bg} ${colors.text}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'P': return <FiClock className="w-4 h-4" />;
      case 'R': return <FiCheckCircle className="w-4 h-4" />;
      case 'C': return <FiXCircle className="w-4 h-4" />;
      default: return <FiFileText className="w-4 h-4" />;
    }
  };

  // Calculate order totals
  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const discountAmount = (subtotal * currentPO.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * currentPO.tax) / 100;
    const total = subtotal - discountAmount + taxAmount;
    
    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  };

  // Add item to order
  const addItemToOrder = () => {
    if (!selectedProduct || newItem.quantity <= 0 || newItem.price <= 0) {
      alert('Please select a product and enter valid quantity and price');
      return;
    }
    
    setOrderItems([...orderItems, {
      id: Date.now(),
      product: selectedProduct.name,
      productCode: selectedProduct.id,
      sku: selectedProduct.sku || selectedProduct.id,
      quantity: newItem.quantity,
      price: newItem.price,
      total: newItem.quantity * newItem.price
    }]);
    
    // Reset the form
    setNewItem({ product: '', productCode: '', quantity: 1, price: 0 });
    setSelectedProduct(null);
    setProductSearchTerm('');
    setShowProductDropdown(false);
  };

  // Handle product selection (using POS product format: id, name, price, sku, barcode)
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProductSearchTerm(product.name);
    setNewItem({
      ...newItem,
      product: product.name,
      productCode: product.id, // Product code is the id
      price: parseFloat(product.price) || 0
    });
    setShowProductDropdown(false);
  };

  // Remove item from order
  const removeItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // Handle supplier selection
  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setCurrentPO({
      ...currentPO,
      supplier: supplier.SUP_NAME,
      shippingAddress: supplier.SUP_ADDRESS
    });
    setShowSupplierDropdown(false);
  };

  // Handle new PO creation
  const handleCreatePO = async () => {
    if (!selectedSupplier || orderItems.length === 0) {
      alert('Please select a supplier and add items to create a purchase order');
      return;
    }

    if (!currentPO.orderDate) {
      alert('Please select an order date');
      return;
    }
    
    setIsCreatingPO(true);
    
    try {
      // Prepare PO data for API
      const poData = {
        supplierId: selectedSupplier.SUP_CODE,
        orderDate: currentPO.orderDate,
        items: orderItems.map(item => ({
          productCode: item.productCode,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      // Dispatch create action
      await dispatch(createPurchaseOrder(poData));
      
      // Reset form on success
      setSelectedSupplier(null);
      setOrderItems([]);
      setSelectedProduct(null);
      setProductSearchTerm('');
      setCurrentPO({
        supplier: '',
        orderDate: new Date().toISOString().split('T')[0],
        expectedDate: '',
        paymentTerms: 'Net 30',
        shippingAddress: '',
        notes: '',
        discount: 0,
        tax: 0
      });
      setIsNewPOModalOpen(false);
      
      // Show success message
      alert('Purchase Order created successfully!');
    } catch (error) {
      console.error('Error creating PO:', error);
      alert('Failed to create Purchase Order. Please try again.');
    } finally {
      setIsCreatingPO(false);
    }
  };

  // PO Flow Steps
  const flowSteps = [
    { icon: FiFileText, title: 'Create PO', description: 'Admin/Manager creates Purchase Order', color: 'bg-blue-500' },
    { icon: FiTruck, title: 'Send to Supplier', description: 'PO is sent to the supplier', color: 'bg-purple-500' },
    { icon: FiPackage, title: 'Receive Items', description: 'Supplier delivers the items', color: 'bg-orange-500' },
    { icon: FiBox, title: 'Update Stock', description: 'Inventory is updated', color: 'bg-teal-500' },
    { icon: FiCheckCircle, title: 'Complete', description: 'PO status changes to Received', color: 'bg-green-500' },
  ];

  return (
    <div className={`flex flex-col p-4 md:p-6 rounded-xl shadow-md h-screen overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <FiShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Purchase Orders</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage supplier purchase orders and track deliveries</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setIsNewPOModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-md"
          >
            <FiPlus className="w-4 h-4" />
            New Purchase Order
          </button>
          <button className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
            <FiDownload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {['overview', 'orders', 'how-it-works'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'orders' ? 'All Orders' : 'How It Works'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards - Compact like Customer Management */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-2 mb-1 md:mb-2">
            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</p>
                </div>
                <FiFileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
                <FiClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>

            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">{stats.received}</p>
                </div>
                <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cancelled</p>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
                </div>
                <FiXCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Value</p>
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400">Rs.{stats.totalValue.toLocaleString()}</p>
                </div>
                <FiDollarSign className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>

          {/* What is a Purchase Order */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'} border`}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                <FiAlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 dark:text-white">What is a Purchase Order?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A Purchase Order (PO) is a commercial document issued by a buyer to a seller, indicating the types, quantities, and agreed prices for products or services. It's a formal request to purchase goods from a supplier.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <FiPackage className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">What items are purchased</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">List of products ordered</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiTruck className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">From which supplier</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Vendor information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiHash className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">How many</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quantities ordered</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiDollarSign className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">At what cost</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Agreed prices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCalendar className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">When ordered</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order date & expected delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiRefreshCw className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">Current status</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pending, Received, Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Purchase Orders are Important */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <FiCheckCircle className="text-green-500" />
              Why Purchase Orders are Important in POS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: FiBox, title: 'Manage Inventory', desc: 'Helps manage stock in and replenishment', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
                { icon: FiTruck, title: 'Track Purchases', desc: 'Tracks all supplier purchases in one place', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
                { icon: FiAlertCircle, title: 'Prevent Errors', desc: 'Prevents over-ordering or under-ordering', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
                { icon: FiFileText, title: 'Accounting & Audit', desc: 'Used for accounting & auditing purposes', color: 'text-teal-500 bg-teal-100 dark:bg-teal-900/30' },
                { icon: FiCheckCircle, title: 'Match Invoices', desc: 'Matches invoice vs received goods', color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
                { icon: FiDollarSign, title: 'Budget Control', desc: 'Helps control spending and budgets', color: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30' },
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} flex items-start gap-3`}>
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold dark:text-white">Recent Purchase Orders</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleRefresh}
                  disabled={poLoading}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <FiRefreshCw className={`w-4 h-4 ${poLoading ? 'animate-spin' : ''} text-gray-500`} />
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  View All <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {poLoading ? (
              <div className="flex items-center justify-center py-8">
                <FiRefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                <span className="ml-2 text-gray-500">Loading purchase orders...</span>
              </div>
            ) : poError ? (
              <div className="text-center py-8 text-red-500">
                <FiAlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>{poError}</p>
              </div>
            ) : purchaseOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiPackage className="w-8 h-8 mx-auto mb-2" />
                <p>No purchase orders found</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-left text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <th className="pb-3 font-medium">PO Number</th>
                    <th className="pb-3 font-medium">Supplier</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {purchaseOrders.slice(0, 5).map((order) => (
                    <tr key={order.poId} className="hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors">
                      <td className="py-3 font-medium text-indigo-600 dark:text-indigo-400">PO-{order.poId}</td>
                      <td className="py-3 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                            {(order.supplierName || 'S').charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{order.supplierName || 'Unknown'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">ID: {order.supplierId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 dark:text-gray-300">{order.items?.length || 0}</td>
                      <td className="py-3 font-medium dark:text-white">Rs.{(order.totalAmount || 0).toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {purchaseOrderService.getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-3">
                        <button 
                          onClick={() => handleViewPO(order.poId)}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          <FiEye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      )}

      {/* All Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by PO number, supplier, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className={`rounded-xl overflow-hidden border shadow-sm ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className={`${darkMode ? 'bg-gray-700/80' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                  <tr className={`text-xs uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <th className="px-4 py-3.5 text-left font-semibold whitespace-nowrap w-24">
                      <span className="flex items-center gap-1.5">
                        <FiHash className="w-3.5 h-3.5" />
                        PO #
                      </span>
                    </th>
                    <th className="px-4 py-3.5 text-left font-semibold whitespace-nowrap min-w-[180px]">
                      <span className="flex items-center gap-1.5">
                        <FiTruck className="w-3.5 h-3.5" />
                        Supplier
                      </span>
                    </th>
                    <th className="px-3 py-3.5 text-center font-semibold whitespace-nowrap w-16">
                      <span className="flex items-center justify-center gap-1">
                        <FiBox className="w-3.5 h-3.5" />
                        Qty
                      </span>
                    </th>
                    <th className="px-4 py-3.5 text-right font-semibold whitespace-nowrap w-28">
                      <span className="flex items-center justify-end gap-1.5">
                        <FiDollarSign className="w-3.5 h-3.5" />
                        Amount
                      </span>
                    </th>
                    <th className="px-4 py-3.5 text-left font-semibold whitespace-nowrap w-28">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5" />
                        Ordered
                      </span>
                    </th>
                    <th className="px-4 py-3.5 text-left font-semibold whitespace-nowrap w-28">
                      <span className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5" />
                        Expected
                      </span>
                    </th>
                    <th className="px-4 py-3.5 text-left font-semibold whitespace-nowrap w-20">
                      <span className="flex items-center gap-1.5">
                        <FiUser className="w-3.5 h-3.5" />
                        By
                      </span>
                    </th>
                    <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap w-24">
                      Status
                    </th>
                    <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                  {poLoading ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-12 text-center">
                        <FiRefreshCw className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading purchase orders...</span>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-12 text-center">
                        <FiPackage className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No purchase orders found</p>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your search or filter</p>
                      </td>
                    </tr>
                  ) : filteredOrders.map((order, index) => (
                    <tr 
                      key={order.poId} 
                      className={`group transition-all duration-150 ${
                        darkMode 
                          ? 'hover:bg-gray-700/50' 
                          : index % 2 === 0 ? 'bg-white hover:bg-indigo-50/50' : 'bg-gray-50/50 hover:bg-indigo-50/50'
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                          PO-{order.poId}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                            {(order.supplierName || 'S').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className={`font-medium text-sm truncate max-w-[140px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {order.supplierName || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">ID: {order.supplierId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {order.items?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`font-bold text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          Rs.{(order.totalAmount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {formatDate(order.orderDate)}
                      </td>
                      <td className={`px-4 py-3.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {order.expectedDate ? formatDate(order.expectedDate) : (
                          <span className="text-gray-300 dark:text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <FiUser className="w-3 h-3" />
                          </div>
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {order.createdBy || 'Sys'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {purchaseOrderService.getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleViewPO(order.poId)}
                            className={`p-2 rounded-lg transition-all duration-150 ${
                              darkMode 
                                ? 'hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300' 
                                : 'hover:bg-indigo-50 text-indigo-500 hover:text-indigo-600'
                            }`}
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button 
                            className={`p-2 rounded-lg transition-all duration-150 ${
                              darkMode 
                                ? 'hover:bg-amber-500/20 text-amber-400 hover:text-amber-300' 
                                : 'hover:bg-amber-50 text-amber-500 hover:text-amber-600'
                            }`}
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          {/* Delete button removed */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer with count */}
            {!poLoading && filteredOrders.length > 0 && (
              <div className={`px-4 py-3 border-t ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-100 bg-gray-50/50'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{purchaseOrders.length}</span> orders
                  </span>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Total Value: <span className={`font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      Rs.{filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}   {/* order ended */}

      {/* How It Works Tab */}
      {activeTab === 'how-it-works' && (
        <div className="space-y-6">
          {/* PO Flow Diagram */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-6 dark:text-white text-center">Purchase Order Flow in POS</h3>
            
            {/* Flow Steps - Desktop */}
            <div className="hidden lg:flex items-center justify-between gap-4 mb-8">
              {flowSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={`p-4 ${step.color} rounded-xl shadow-lg mb-3`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold dark:text-white">{step.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
                  </div>
                  {idx < flowSteps.length - 1 && (
                    <FiArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Flow Steps - Mobile */}
            <div className="lg:hidden space-y-4">
              {flowSteps.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 ${step.color} rounded-xl shadow-lg flex-shrink-0`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full ${step.color} text-white text-sm font-bold flex items-center justify-center`}>
                          {idx + 1}
                        </span>
                        <h4 className="font-bold dark:text-white">{step.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiFileText className="w-5 h-5 text-blue-500" />
                </div>
                Step 1: Create Purchase Order
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Admin or Manager logs into the system
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Selects products that need to be ordered
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Specifies quantities and selects supplier
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Sets expected delivery date
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Creates and saves the Purchase Order
                </li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiTruck className="w-5 h-5 text-purple-500" />
                </div>
                Step 2: Send to Supplier
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  PO is generated with a unique number
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Can be printed or emailed to supplier
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Status remains as "Pending"
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Supplier confirms the order
                </li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FiPackage className="w-5 h-5 text-orange-500" />
                </div>
                Step 3: Receive Items
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Supplier delivers the ordered items
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Staff verifies items against the PO
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Checks quantities and quality
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Records any discrepancies
                </li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiCheckCircle className="w-5 h-5 text-green-500" />
                </div>
                Step 4 & 5: Update & Complete
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Inventory is automatically updated
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Stock levels increase in the system
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  PO status changes to "Received"
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  GRN (Goods Received Note) is created
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Ready for accounting & payment processing
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* New Purchase Order Modal */}
      {isNewPOModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div className={`rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="relative">
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-indigo-900/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                    <FiShoppingCart className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">Create New Purchase Order</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Select supplier and add items to create order</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNewPOModalOpen(false)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Supplier & Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Supplier Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-white">
                      Select Supplier *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
                        className={`w-full px-4 py-3 rounded-lg border text-sm flex items-center justify-between ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      >
                        <div className="flex items-center gap-3">
                          {selectedSupplier ? (
                            <>
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                {selectedSupplier.SUP_NAME.charAt(0)}
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{selectedSupplier.SUP_NAME}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ID: {selectedSupplier.SUP_CODE} • {selectedSupplier.SUP_CITY}
                                </div>
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-500">Select a supplier...</span>
                          )}
                        </div>
                        {showSupplierDropdown ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {showSupplierDropdown && (
                        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-64 overflow-y-auto">
                          {activeSuppliers.length > 0 ? (
                            activeSuppliers.map((supplier) => (
                              <div
                                key={supplier.SUP_CODE}
                                onClick={() => handleSupplierSelect(supplier)}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                    {supplier.SUP_NAME.charAt(0)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium dark:text-white truncate">{supplier.SUP_NAME}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                                      <span className="flex items-center gap-1">
                                        <FiUser className="w-3 h-3" /> {supplier.SUP_CONPERSON}
                                      </span>
                                      <span>•</span>
                                      <span>{supplier.SUP_PHONENO}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                      {supplier.SUP_CITY}, {supplier.SUP_COUNTRY}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                              No active suppliers found. Please add suppliers first.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-white">
                      Order Items *
                    </label>
                    <div className={`rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'} overflow-hidden`}>
                      <table className="w-full">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-medium">Quantity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                          {orderItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3 dark:text-gray-300">{item.product} ({item.sku})</td>
                              <td className="px-4 py-3 dark:text-gray-300">{item.quantity}</td>
                              <td className="px-4 py-3 dark:text-gray-300">Rs.{item.price.toLocaleString()}</td>
                              <td className="px-4 py-3 font-medium dark:text-white">Rs.{item.total.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-700"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {orderItems.length === 0 && (
                            <tr>
                              <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                No items added. Add items using the form below.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add Item Form */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={productSearchTerm}
                        onChange={(e) => {
                          setProductSearchTerm(e.target.value);
                          setShowProductDropdown(true);
                          if (!e.target.value) {
                            setSelectedProduct(null);
                          }
                        }}
                        onFocus={() => setShowProductDropdown(true)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                      />
                      {showProductDropdown && productSearchTerm && (
                        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.slice(0, 10).map((product) => (
                              <div
                                key={product.id}
                                onClick={() => handleProductSelect(product)}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0"
                              >
                                <div className="font-medium text-sm dark:text-white">{product.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Code: {product.id} • SKU: {product.sku} • Price: Rs.{parseFloat(product.price || 0).toLocaleString()}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {productsLoading ? 'Loading products...' : 'No products found'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <input
                      type="number"
                      placeholder="Quantity"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                      className={`px-3 py-2 rounded-lg border text-sm ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-indigo-500`}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                      className={`px-3 py-2 rounded-lg border text-sm ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-indigo-500`}
                    />
                    <button
                      type="button"
                      onClick={addItemToOrder}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-white">
                        Order Date
                      </label>
                      <input
                        type="date"
                        value={currentPO.orderDate}
                        onChange={(e) => setCurrentPO({ ...currentPO, orderDate: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-white">
                        Expected Delivery Date *
                      </label>
                      <input
                        type="date"
                        value={currentPO.expectedDate}
                        onChange={(e) => setCurrentPO({ ...currentPO, expectedDate: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-white">
                        Payment Terms
                      </label>
                      <select
                        value={currentPO.paymentTerms}
                        onChange={(e) => setCurrentPO({ ...currentPO, paymentTerms: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option>Net 30</option>
                        <option>Net 15</option>
                        <option>Net 45</option>
                        <option>Due on Receipt</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-white">
                        Shipping Address
                      </label>
                      <input
                        type="text"
                        placeholder="Shipping address"
                        value={currentPO.shippingAddress}
                        onChange={(e) => setCurrentPO({ ...currentPO, shippingAddress: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-white">
                      Notes
                    </label>
                    <textarea
                      placeholder="Additional notes or instructions"
                      value={currentPO.notes}
                      onChange={(e) => setCurrentPO({ ...currentPO, notes: e.target.value })}
                      rows="3"
                      className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                        } focus:ring-2 focus:ring-indigo-500 resize-none`}
                    />
                  </div>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                  <div className={`p-6 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Order Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium dark:text-white">Rs.{calculateTotals().subtotal.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Discount</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={currentPO.discount}
                            onChange={(e) => setCurrentPO({ ...currentPO, discount: parseFloat(e.target.value) || 0 })}
                            className="w-16 px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-700 text-right"
                          />
                          <span className="text-gray-600 dark:text-gray-400">%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={currentPO.tax}
                            onChange={(e) => setCurrentPO({ ...currentPO, tax: parseFloat(e.target.value) || 0 })}
                            className="w-16 px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-700 text-right"
                          />
                          <span className="text-gray-600 dark:text-gray-400">%</span>
                        </div>
                      </div>
                      
                      <div className="border-t dark:border-gray-600 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold dark:text-white">Total</span>
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            Rs.{calculateTotals().total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={handleCreatePO}
                        disabled={!selectedSupplier || orderItems.length === 0 || isCreatingPO}
                        className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${!selectedSupplier || orderItems.length === 0 || isCreatingPO
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                          }`}
                      >
                        {isCreatingPO ? (
                          <>
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <FiSave className="w-4 h-4" />
                            Create Purchase Order
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setIsNewPOModalOpen(false)}
                        disabled={isCreatingPO}
                        className={`w-full py-2.5 rounded-lg font-medium text-sm ${darkMode
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } ${isCreatingPO ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                    <h4 className="font-medium mb-3 dark:text-white">Quick Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Selected Supplier:</span>
                        <span className="font-medium dark:text-white">{selectedSupplier ? selectedSupplier.SUP_NAME : 'None'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Items in Order:</span>
                        <span className="font-medium dark:text-white">{orderItems.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Quantity:</span>
                        <span className="font-medium dark:text-white">{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View PO Details Modal */}
      {isViewModalOpen && selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <FiFileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white">Purchase Order Details</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">PO-{selectedPO.poId}</p>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <FiX className="w-5 h-5 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {poDetailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <FiRefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
              ) : (
                <>
                  {/* PO Info Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-indigo-50'}`}>
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                        <FiTruck className="w-4 h-4" />
                        <span className="text-xs font-medium">Supplier</span>
                      </div>
                      <p className="font-bold dark:text-white text-sm">{selectedPO.supplierName || 'N/A'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {selectedPO.supplierId}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-green-50'}`}>
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                        <FiCalendar className="w-4 h-4" />
                        <span className="text-xs font-medium">Order Date</span>
                      </div>
                      <p className="font-bold dark:text-white text-sm">{formatDate(selectedPO.orderDate)}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-amber-50'}`}>
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                        <FiDollarSign className="w-4 h-4" />
                        <span className="text-xs font-medium">Total Amount</span>
                      </div>
                      <p className="font-bold dark:text-white text-sm">Rs.{(selectedPO.totalAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-purple-50'}`}>
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                        <FiCheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Status</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPO.status)}`}>
                        {getStatusIcon(selectedPO.status)}
                        {purchaseOrderService.getStatusLabel(selectedPO.status)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className={`rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                    <div className={`px-4 py-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <h3 className="font-semibold dark:text-white flex items-center gap-2">
                        <FiPackage className="w-4 h-4" />
                        Order Items ({selectedPO.items?.length || 0})
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'}`}>
                          <tr className={`text-left text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <th className="px-4 py-3 font-medium">Product</th>
                            <th className="px-4 py-3 font-medium">Code</th>
                            <th className="px-4 py-3 font-medium text-right">Qty Ordered</th>
                            <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                            <th className="px-4 py-3 font-medium text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                          {selectedPO.items?.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3 dark:text-gray-300 font-medium">{item.productName}</td>
                              <td className="px-4 py-3 dark:text-gray-400 text-sm">{item.productCode}</td>
                              <td className="px-4 py-3 dark:text-gray-300 text-right">{parseInt(item.qtyOrdered)}</td>
                              <td className="px-4 py-3 dark:text-gray-300 text-right">Rs.{(item.unitPrice || 0).toLocaleString()}</td>
                              <td className="px-4 py-3 dark:text-white font-medium text-right">
                                Rs.{((parseInt(item.qtyOrdered) || 0) * (item.unitPrice || 0)).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} font-medium`}>
                          <tr>
                            <td colSpan="4" className="px-4 py-3 text-right dark:text-gray-300">Grand Total:</td>
                            <td className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400 font-bold">
                              Rs.{(selectedPO.totalAmount || 0).toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                    <button
                      onClick={() => setIsViewModalOpen(false)}
                      className={`px-6 py-2.5 rounded-lg font-medium text-sm ${darkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Close
                    </button>
                    <button
                      className="px-6 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 flex items-center gap-2"
                    >
                      <FiDownload className="w-4 h-4" />
                      Export PDF
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;