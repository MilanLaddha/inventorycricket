import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Plus, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Trophy,
  Pencil
} from 'lucide-react';

const CricketInventoryManager = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('product'); // 'product' or 'sale'
  
  // Mock Initial Data
  const [inventory, setInventory] = useState([
    { id: 1, name: "English Willow Bat (Grade A)", category: "Bats", price: 350, stock: 12, sku: "BAT-EW-001" },
    { id: 2, name: "Leather Match Ball (Red)", category: "Balls", price: 25, stock: 150, sku: "BAL-RD-005" },
    { id: 3, name: "Pro Keeper Gloves", category: "Protection", price: 55, stock: 8, sku: "GLV-KP-022" },
    { id: 4, name: "Batting Pads (Lightweight)", category: "Protection", price: 80, stock: 20, sku: "PAD-BT-101" },
  ]);

  const [sales, setSales] = useState([
    { id: 101, customer: "Rahul D.", product: "English Willow Bat (Grade A)", quantity: 1, total: 350, paymentStatus: "Paid", shippingStatus: "Shipped", date: "2023-10-25" },
    { id: 102, customer: "Local Club XI", product: "Leather Match Ball (Red)", quantity: 12, total: 300, paymentStatus: "Pending", shippingStatus: "Ready", date: "2023-10-26" },
  ]);

  // Form States
  const [newItem, setNewItem] = useState({ name: '', category: 'Bats', price: '', stock: '', sku: '' });
  const [editingId, setEditingId] = useState(null);
  const [newSale, setNewSale] = useState({ customer: '', productId: '', quantity: 1, paymentStatus: 'Pending', shippingStatus: 'Pending' });

  // --- Handlers ---

  // Inventory Logic
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing product
      const updatedInventory = inventory.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            ...newItem,
            price: Number(newItem.price),
            stock: Number(newItem.stock)
          };
        }
        return item;
      });
      setInventory(updatedInventory);
      setEditingId(null);
    } else {
      // Create new product
      const product = {
        id: Date.now(),
        ...newItem,
        price: Number(newItem.price),
        stock: Number(newItem.stock)
      };
      setInventory([...inventory, product]);
    }
    
    setNewItem({ name: '', category: 'Bats', price: '', stock: '', sku: '' });
    setIsModalOpen(false);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setNewItem({
      name: product.name,
      category: product.category,
      sku: product.sku,
      price: product.price,
      stock: product.stock
    });
    setModalType('product');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewItem({ name: '', category: 'Bats', price: '', stock: '', sku: '' });
    setNewSale({ customer: '', productId: '', quantity: 1, paymentStatus: 'Pending', shippingStatus: 'Pending' });
  };

  // Sales Logic
  const handleAddSale = (e) => {
    e.preventDefault();
    
    const selectedProduct = inventory.find(p => p.id === Number(newSale.productId));
    
    if (!selectedProduct) return;
    if (selectedProduct.stock < newSale.quantity) {
      alert("Insufficient stock for this operation!");
      return;
    }

    const saleRecord = {
      id: Date.now(),
      customer: newSale.customer,
      product: selectedProduct.name,
      quantity: Number(newSale.quantity),
      total: selectedProduct.price * Number(newSale.quantity),
      paymentStatus: newSale.paymentStatus,
      shippingStatus: newSale.shippingStatus,
      date: new Date().toISOString().split('T')[0]
    };

    // Update Sales History
    setSales([saleRecord, ...sales]);

    // Update Inventory Stock
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedProduct.id) {
        return { ...item, stock: item.stock - Number(newSale.quantity) };
      }
      return item;
    });
    setInventory(updatedInventory);

    setNewSale({ customer: '', productId: '', quantity: 1, paymentStatus: 'Pending', shippingStatus: 'Pending' });
    setIsModalOpen(false);
  };

  // Status Updaters
  const updateSaleStatus = (id, field, value) => {
    const updatedSales = sales.map(sale => {
      if (sale.id === id) {
        return { ...sale, [field]: value };
      }
      return sale;
    });
    setSales(updatedSales);
  };

  // --- Calculations ---
  const totalRevenue = sales.reduce((acc, curr) => acc + curr.total, 0);
  const totalItemsSold = sales.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Top Navbar */}
      <div className="bg-emerald-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold tracking-tight">CrickStore Pro</h1>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <p className="text-emerald-300 text-xs uppercase font-semibold">Total Revenue</p>
              <p className="font-bold text-lg">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-emerald-300 text-xs uppercase font-semibold">Items Sold</p>
              <p className="font-bold text-lg">{totalItemsSold}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 pb-4 px-2 font-medium transition-colors ${activeTab === 'inventory' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Package className="w-5 h-5" />
            Product Inventory
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 pb-4 px-2 font-medium transition-colors ${activeTab === 'sales' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ShoppingCart className="w-5 h-5" />
            Sales & Orders
          </button>
        </div>

        {/* --- INVENTORY VIEW --- */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Current Stock</h2>
              <button 
                onClick={() => { 
                  setEditingId(null);
                  setNewItem({ name: '', category: 'Bats', price: '', stock: '', sku: '' });
                  setModalType('product'); 
                  setIsModalOpen(true); 
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-center">Stock Level</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">₹{item.price}</td>
                      <td className="px-6 py-4 text-center font-bold">{item.stock}</td>
                      <td className="px-6 py-4 text-center">
                        {item.stock < 5 ? (
                          <span className="text-red-600 text-xs font-bold flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3"/> Low Stock</span>
                        ) : (
                          <span className="text-emerald-600 text-xs font-bold flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3"/> In Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-full transition-all"
                          title="Edit Product"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                        No products in inventory yet. Add some gear!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SALES VIEW --- */}
        {activeTab === 'sales' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Sales History</h2>
              <button 
                onClick={() => { setModalType('sale'); setIsModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> New Sale
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4">Payment Status</th>
                    <th className="px-6 py-4">Shipping Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 text-sm">{sale.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{sale.customer}</td>
                      <td className="px-6 py-4 text-slate-600">{sale.product}</td>
                      <td className="px-6 py-4 text-center">{sale.quantity}</td>
                      <td className="px-6 py-4 text-right font-bold">₹{sale.total}</td>
                      
                      {/* Editable Payment Status */}
                      <td className="px-6 py-4">
                        <select 
                          value={sale.paymentStatus}
                          onChange={(e) => updateSaleStatus(sale.id, 'paymentStatus', e.target.value)}
                          className={`text-xs font-bold py-1 px-2 rounded border-0 cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 ${
                            sale.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>

                      {/* Editable Shipping Status */}
                      <td className="px-6 py-4">
                        <select 
                          value={sale.shippingStatus}
                          onChange={(e) => updateSaleStatus(sale.id, 'shippingStatus', e.target.value)}
                          className={`text-xs font-bold py-1 px-2 rounded border-0 cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 ${
                            sale.shippingStatus === 'Delivered' ? 'bg-blue-100 text-blue-800' : 
                            sale.shippingStatus === 'Shipped' ? 'bg-purple-100 text-purple-800' : 
                            'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Ready">Ready to Ship</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                   {sales.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                        No sales recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                {modalType === 'product' ? (editingId ? 'Edit Product' : 'Add New Product') : 'Record New Sale'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <div className="p-6">
              {modalType === 'product' ? (
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                    <input required type="text" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none" 
                      value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                        <option>Bats</option>
                        <option>Balls</option>
                        <option>Protection</option>
                        <option>Clothing</option>
                        <option>Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                      <input required type="text" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newItem.sku} onChange={e => setNewItem({...newItem, sku: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                      <input required type="number" min="0" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stock Qty</label>
                      <input required type="number" min="0" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 font-medium mt-2">
                    {editingId ? 'Update Product' : 'Add to Inventory'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddSale} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Product</label>
                    <select required className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newSale.productId} onChange={e => setNewSale({...newSale, productId: e.target.value})}>
                      <option value="">-- Choose Item --</option>
                      {inventory.map(p => (
                        <option key={p.id} value={p.id} disabled={p.stock === 0}>
                          {p.name} (₹{p.price}) - Stock: {p.stock}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                    <input required type="text" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newSale.customer} onChange={e => setNewSale({...newSale, customer: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                      <input required type="number" min="1" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newSale.quantity} onChange={e => setNewSale({...newSale, quantity: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Initial Payment Status</label>
                      <select className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newSale.paymentStatus} onChange={e => setNewSale({...newSale, paymentStatus: e.target.value})}>
                        <option>Pending</option>
                        <option>Paid</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium mt-2">
                    Record Sale
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CricketInventoryManager;