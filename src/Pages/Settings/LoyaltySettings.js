import React, { useState } from 'react';
import {
  FiGift,
  FiStar,
  FiDollarSign,
  FiPercent,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiArrowRight,
  FiShoppingCart,
  FiCreditCard,
  FiSave,
  FiRefreshCw,
  FiInfo,
  FiSettings,
  FiDatabase,
  FiShield,
  FiEdit3,
  FiToggleLeft,
  FiToggleRight,
  FiPlus,
  FiMinus
} from 'react-icons/fi';

const LoyaltySettings = ({ darkMode }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);
  
  // Loyalty Configuration State
  const [loyaltyConfig, setLoyaltyConfig] = useState({
    earnRate: 1, // Points per Rs.100
    earnThreshold: 100, // Minimum spend to earn points
    redeemRate: 10, // Rs. value per point
    minRedeemPoints: 50, // Minimum points to redeem
    maxRedeemPercent: 50, // Max % of bill that can be paid with points
    pointsExpiry: 365, // Days until points expire
    welcomeBonus: 10, // Points given on first purchase
    birthdayBonus: 50, // Bonus points on birthday
  });

  // Tier Configuration
  const [tierConfig, setTierConfig] = useState([
    { id: 'bronze', name: 'Bronze', minPoints: 0, multiplier: 1, color: 'bg-amber-600', benefits: ['1x Point Earning', 'Basic Offers'] },
    { id: 'silver', name: 'Silver', minPoints: 500, multiplier: 1.5, color: 'bg-gray-400', benefits: ['1.5x Point Earning', 'Priority Support', 'Exclusive Offers'] },
    { id: 'gold', name: 'Gold', minPoints: 2000, multiplier: 2, color: 'bg-yellow-500', benefits: ['2x Point Earning', 'VIP Support', 'Special Discounts', 'Early Access'] },
    { id: 'platinum', name: 'Platinum', minPoints: 5000, multiplier: 3, color: 'bg-purple-600', benefits: ['3x Point Earning', 'Personal Account Manager', 'Exclusive Events', 'Free Delivery'] },
  ]);

  const handleConfigChange = (field, value) => {
    setLoyaltyConfig(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Loyalty settings saved successfully!');
  };

  // Earn Points Flow Steps
  const earnFlowSteps = [
    { icon: FiUsers, title: 'Select Customer', description: 'Cashier selects or adds customer', color: 'bg-blue-500' },
    { icon: FiShoppingCart, title: 'Calculate Bill', description: 'Bill total is calculated', color: 'bg-green-500' },
    { icon: FiSettings, title: 'Check Rules', description: 'System checks loyalty rules', color: 'bg-purple-500' },
    { icon: FiStar, title: 'Add Points', description: 'Points added to customer account', color: 'bg-yellow-500' },
    { icon: FiDatabase, title: 'Save Transaction', description: 'Transaction is saved', color: 'bg-teal-500' },
  ];

  // Redeem Points Flow Steps
  const redeemFlowSteps = [
    { icon: FiUsers, title: 'Select Customer', description: 'Cashier selects customer', color: 'bg-blue-500' },
    { icon: FiStar, title: 'Show Points', description: 'System shows available points', color: 'bg-yellow-500' },
    { icon: FiEdit3, title: 'Choose Points', description: 'Cashier chooses points to redeem', color: 'bg-purple-500' },
    { icon: FiPercent, title: 'Apply Discount', description: 'Discount is applied to bill', color: 'bg-green-500' },
    { icon: FiMinus, title: 'Deduct Points', description: 'Points are deducted', color: 'bg-orange-500' },
    { icon: FiDatabase, title: 'Save Transaction', description: 'Transaction is saved', color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Enable Toggle */}
      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-purple-700' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'} border`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <FiGift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Loyalty Program Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configure points earning, redemption, and tier rules</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${loyaltyEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                {loyaltyEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={() => setLoyaltyEnabled(!loyaltyEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${loyaltyEnabled ? 'bg-green-500' : 'bg-gray-400'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${loyaltyEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: FiInfo },
          { id: 'earning', label: 'Earning Rules', icon: FiTrendingUp },
          { id: 'redemption', label: 'Redemption Rules', icon: FiGift },
          { id: 'tiers', label: 'Tier Levels', icon: FiAward },
          { id: 'flow', label: 'How It Works', icon: FiArrowRight },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeSection === section.id
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Earn Rate</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{loyaltyConfig.earnRate} pts / Rs.{loyaltyConfig.earnThreshold}</p>
                </div>
                <FiTrendingUp className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Redeem Value</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">1 pt = Rs.{loyaltyConfig.redeemRate}</p>
                </div>
                <FiDollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Min. Redeem</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{loyaltyConfig.minRedeemPoints} points</p>
                </div>
                <FiShield className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Points Expiry</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{loyaltyConfig.pointsExpiry} days</p>
                </div>
                <FiCalendar className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>

          {/* What is Loyalty Program */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <FiInfo className="text-purple-500" />
              What is a Loyalty Program?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A loyalty program rewards customers for their purchases. Customers earn points based on their spending, 
              which they can later redeem for discounts. This encourages repeat purchases and builds customer loyalty.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: FiStar, title: 'Earn Points', desc: 'Customers earn points on every purchase', color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' },
                { icon: FiGift, title: 'Redeem Rewards', desc: 'Use points for discounts on future purchases', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
                { icon: FiAward, title: 'Tier Benefits', desc: 'Higher tiers earn more points and get better perks', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
                { icon: FiUsers, title: 'Customer Retention', desc: 'Keep customers coming back', color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
                { icon: FiTrendingUp, title: 'Increase Sales', desc: 'Loyal customers spend more over time', color: 'text-teal-500 bg-teal-100 dark:bg-teal-900/30' },
                { icon: FiDatabase, title: 'Track History', desc: 'Complete points transaction history', color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30' },
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} flex items-start gap-3`}>
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Earning Rules Section */}
      {activeSection === 'earning' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <FiTrendingUp className="text-green-500" />
              Points Earning Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earn Rate */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Points Earned per Transaction
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={loyaltyConfig.earnRate}
                    onChange={(e) => handleConfigChange('earnRate', e.target.value)}
                    className={`w-24 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    min="1"
                  />
                  <span className="text-gray-500 dark:text-gray-400">point(s) per Rs.</span>
                  <input
                    type="number"
                    value={loyaltyConfig.earnThreshold}
                    onChange={(e) => handleConfigChange('earnThreshold', e.target.value)}
                    className={`w-24 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    min="1"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Example: Customer spending Rs.500 earns {Math.floor(500 / loyaltyConfig.earnThreshold) * loyaltyConfig.earnRate} points
                </p>
              </div>

              {/* Welcome Bonus */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Welcome Bonus (First Purchase)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={loyaltyConfig.welcomeBonus}
                    onChange={(e) => handleConfigChange('welcomeBonus', e.target.value)}
                    className={`w-24 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    min="0"
                  />
                  <span className="text-gray-500 dark:text-gray-400">bonus points</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Extra points given on customer's first purchase
                </p>
              </div>

              {/* Birthday Bonus */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Birthday Bonus
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={loyaltyConfig.birthdayBonus}
                    onChange={(e) => handleConfigChange('birthdayBonus', e.target.value)}
                    className={`w-24 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    min="0"
                  />
                  <span className="text-gray-500 dark:text-gray-400">bonus points</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Extra points given on customer's birthday
                </p>
              </div>

              {/* Points Expiry */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Points Expiry
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={loyaltyConfig.pointsExpiry}
                    onChange={(e) => handleConfigChange('pointsExpiry', e.target.value)}
                    className={`w-24 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    min="30"
                  />
                  <span className="text-gray-500 dark:text-gray-400">days</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Points expire after {loyaltyConfig.pointsExpiry} days of inactivity
                </p>
              </div>
            </div>
          </div>

          {/* Earning Preview */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-green-900/30 to-teal-900/30 border-green-700' : 'bg-gradient-to-br from-green-50 to-teal-50 border-green-200'} border`}>
            <h4 className="font-bold mb-3 dark:text-white flex items-center gap-2">
              <FiCheckCircle className="text-green-500" />
              Earning Example
            </h4>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <span className="text-gray-500 dark:text-gray-400">Bill Amount:</span>
                <span className="font-bold ml-2 dark:text-white">Rs.1,500</span>
              </div>
              <FiArrowRight className="text-gray-400" />
              <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <span className="text-gray-500 dark:text-gray-400">Points Earned:</span>
                <span className="font-bold ml-2 text-green-600 dark:text-green-400">
                  {Math.floor(1500 / loyaltyConfig.earnThreshold) * loyaltyConfig.earnRate} pts
                </span>
              </div>
              <FiArrowRight className="text-gray-400" />
              <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <span className="text-gray-500 dark:text-gray-400">Worth:</span>
                <span className="font-bold ml-2 text-purple-600 dark:text-purple-400">
                  Rs.{Math.floor(1500 / loyaltyConfig.earnThreshold) * loyaltyConfig.earnRate * loyaltyConfig.redeemRate}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Redemption Rules Section */}
      {activeSection === 'redemption' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <FiGift className="text-purple-500" />
              Points Redemption Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Redeem Rate */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Point Value
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">1 point =</span>
                  <span className="text-gray-500 dark:text-gray-400">Rs.</span>
                  <input
                    type="number"
                    value={loyaltyConfig.redeemRate}
                    onChange={(e) => handleConfigChange('redeemRate', e.target.value)}
                    className={`w-24 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    min="1"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  100 points = Rs.{100 * loyaltyConfig.redeemRate} discount
                </p>
              </div>

              {/* Minimum Points to Redeem */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Minimum Points to Redeem
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={loyaltyConfig.minRedeemPoints}
                    onChange={(e) => handleConfigChange('minRedeemPoints', e.target.value)}
                    className={`w-24 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    min="1"
                  />
                  <span className="text-gray-500 dark:text-gray-400">points minimum</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Customer needs at least {loyaltyConfig.minRedeemPoints} points (Rs.{loyaltyConfig.minRedeemPoints * loyaltyConfig.redeemRate}) to redeem
                </p>
              </div>

              {/* Max Redeem Percentage */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Maximum Bill Payment with Points
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={loyaltyConfig.maxRedeemPercent}
                    onChange={(e) => handleConfigChange('maxRedeemPercent', e.target.value)}
                    className={`w-24 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    min="1"
                    max="100"
                  />
                  <span className="text-gray-500 dark:text-gray-400">% of bill</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Customer can pay up to {loyaltyConfig.maxRedeemPercent}% of bill using points
                </p>
              </div>
            </div>
          </div>

          {/* Redemption Preview */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'} border`}>
            <h4 className="font-bold mb-3 dark:text-white flex items-center gap-2">
              <FiGift className="text-purple-500" />
              Redemption Example
            </h4>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <span className="text-gray-500 dark:text-gray-400">Customer Points:</span>
                <span className="font-bold ml-2 text-yellow-600 dark:text-yellow-400">200 pts</span>
              </div>
              <FiArrowRight className="text-gray-400" />
              <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <span className="text-gray-500 dark:text-gray-400">Redeem 100 pts:</span>
                <span className="font-bold ml-2 text-green-600 dark:text-green-400">Rs.{100 * loyaltyConfig.redeemRate} OFF</span>
              </div>
              <FiArrowRight className="text-gray-400" />
              <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <span className="text-gray-500 dark:text-gray-400">Remaining:</span>
                <span className="font-bold ml-2 text-blue-600 dark:text-blue-400">100 pts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tier Levels Section */}
      {activeSection === 'tiers' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <FiAward className="text-yellow-500" />
              Customer Tier Levels
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Customers automatically move to higher tiers based on their total points earned. Higher tiers earn points faster.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tierConfig.map((tier, idx) => (
                <div 
                  key={tier.id}
                  className={`p-4 rounded-xl border-2 ${
                    darkMode 
                      ? `bg-gray-600/50 border-gray-500` 
                      : `bg-gradient-to-br from-${tier.id === 'bronze' ? 'amber' : tier.id === 'silver' ? 'gray' : tier.id === 'gold' ? 'yellow' : 'purple'}-50 to-white border-${tier.id === 'bronze' ? 'amber' : tier.id === 'silver' ? 'gray' : tier.id === 'gold' ? 'yellow' : 'purple'}-200`
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 ${tier.color} rounded-lg`}>
                      <FiAward className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">{tier.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tier.minPoints === 0 ? 'Starting tier' : `${tier.minPoints}+ points`}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium text-center mb-3 ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {tier.multiplier}x Point Multiplier
                  </div>
                  <ul className="space-y-1">
                    {tier.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <FiCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Progress Example */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h4 className="font-bold mb-4 dark:text-white">Tier Progress Example</h4>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs font-semibold text-amber-600">Bronze (0)</div>
                <div className="text-xs font-semibold text-gray-400">Silver (500)</div>
                <div className="text-xs font-semibold text-yellow-600">Gold (2000)</div>
                <div className="text-xs font-semibold text-purple-600">Platinum (5000)</div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-600">
                <div style={{ width: '10%' }} className="bg-amber-600 rounded-l-full"></div>
                <div style={{ width: '30%' }} className="bg-gray-400"></div>
                <div style={{ width: '30%' }} className="bg-yellow-500"></div>
                <div style={{ width: '30%' }} className="bg-purple-600 rounded-r-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      {activeSection === 'flow' && (
        <div className="space-y-6">
          {/* Earn Points Flow */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">🟢</div>
              Earn Points (During Billing)
            </h3>
            
            {/* Desktop Flow */}
            <div className="hidden lg:flex items-center justify-between gap-2 mb-4">
              {earnFlowSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={`p-3 ${step.color} rounded-xl shadow-lg mb-2`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-medium text-sm dark:text-white">{step.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                  </div>
                  {idx < earnFlowSteps.length - 1 && (
                    <FiArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile Flow */}
            <div className="lg:hidden space-y-3">
              {earnFlowSteps.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'}`}>
                  <div className={`p-2 ${step.color} rounded-lg flex-shrink-0`}>
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm dark:text-white">{step.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                  </div>
                  <span className={`w-6 h-6 ${step.color} rounded-full text-white text-xs font-bold flex items-center justify-center`}>
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Redeem Points Flow */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">🔵</div>
              Redeem Points (During Billing)
            </h3>
            
            {/* Desktop Flow */}
            <div className="hidden lg:flex items-center justify-between gap-2 mb-4">
              {redeemFlowSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={`p-3 ${step.color} rounded-xl shadow-lg mb-2`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-medium text-sm dark:text-white">{step.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                  </div>
                  {idx < redeemFlowSteps.length - 1 && (
                    <FiArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile Flow */}
            <div className="lg:hidden space-y-3">
              {redeemFlowSteps.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'}`}>
                  <div className={`p-2 ${step.color} rounded-lg flex-shrink-0`}>
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm dark:text-white">{step.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                  </div>
                  <span className={`w-6 h-6 ${step.color} rounded-full text-white text-xs font-bold flex items-center justify-center`}>
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Rules Summary */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'} border`}>
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <FiSettings className="text-indigo-500" />
              Core Loyalty Rules (Configurable)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'} shadow`}>
                <div className="flex items-center gap-3">
                  <FiTrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium dark:text-white">Earn Rate</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{loyaltyConfig.earnRate} point per Rs.{loyaltyConfig.earnThreshold}</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'} shadow`}>
                <div className="flex items-center gap-3">
                  <FiDollarSign className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium dark:text-white">Redeem Rate</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">1 point = Rs.{loyaltyConfig.redeemRate}</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'} shadow`}>
                <div className="flex items-center gap-3">
                  <FiShield className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium dark:text-white">Minimum to Redeem</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{loyaltyConfig.minRedeemPoints} points</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'} shadow`}>
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium dark:text-white">Points Expiry</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{loyaltyConfig.pointsExpiry} days ({Math.round(loyaltyConfig.pointsExpiry / 365 * 10) / 10} year)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltySettings;
