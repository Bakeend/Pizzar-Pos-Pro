
import React, { useState, useEffect, useRef } from 'react';
import { tables } from '../../data/mockData';
import { MenuItem, CartItem, AdminView, Customer } from '../../types';
import { XIcon, UsersIcon, UserIcon, TrashIcon, ShoppingCartIcon, CheckCircleIcon } from '../icons';

interface PosViewProps {
  selectedTableId?: number | null;
  onFinalizeOrder: (cart: CartItem[], total: number, tableId: number | null, customer?: Customer | null, walkInName?: string) => void;
  setActiveView: (view: AdminView) => void;
  menuItems: MenuItem[];
  customers: Customer[];
  onAddCustomer: () => void;
}

const PosView: React.FC<PosViewProps> = ({ 
    selectedTableId, 
    onFinalizeOrder, 
    setActiveView, 
    menuItems = [], 
    customers = [],
    onAddCustomer
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'pizza' | 'drink' | 'dessert'>('pizza');
  
  // State for Customer Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const selectedTable = tables.find(t => t.id === selectedTableId);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside suggestions to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter customers based on input
  const filteredCustomers = customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
     setCart(prevCart => {
        const existingItem = prevCart.find(cartItem => cartItem.item.id === itemId);
        if (existingItem && existingItem.quantity > 1) {
            return prevCart.map(cartItem => 
                cartItem.item.id === itemId
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
            );
        }
        return prevCart.filter(cartItem => cartItem.item.id !== itemId);
     });
  };

  const calculateTotal = () => {
    return cart.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);
  };

  const handleFinalizeClick = () => {
    if (cart.length === 0) return;
    setIsConfirmationOpen(true);
  };

  const handleConfirmSale = () => {
    // Logic priority: Selected Customer Object > Table Name > Search Query (as walk-in name) > Default
    onFinalizeOrder(
        cart, 
        calculateTotal(), 
        selectedTableId, 
        selectedCustomer,
        searchQuery 
    );
    
    setCart([]);
    setSearchQuery('');
    setSelectedCustomer(null);
    setIsConfirmationOpen(false);
    setActiveView(AdminView.Tables);
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const clearCustomer = () => {
    setSelectedCustomer(null);
    setSearchQuery('');
  };

  const filteredMenuItems = menuItems.filter(item => item.category === activeCategory);

  const CategoryButton: React.FC<{ category: 'pizza' | 'drink' | 'dessert'; label: string; icon: string }> = ({ category, label, icon }) => (
    <button
        onClick={() => setActiveCategory(category)}
        className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 border-b-4 ${
            activeCategory === category 
            ? 'border-brand-red text-brand-red bg-red-50' 
            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        }`}
    >
        <span>{icon}</span>
        {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gray-50 relative overflow-hidden">
      {/* Main content - Product Selection */}
      <div className="flex-grow flex flex-col h-[60vh] lg:h-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
            <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-brand-dark text-brand-yellow p-1.5 rounded-md">
                        <ShoppingCartIcon className="w-5 h-5" />
                    </span>
                    Ponto de Venda
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    {selectedTable ? `📍 Atendendo: ${selectedTable.name}` : '🛒 Venda Balcão'}
                </p>
            </div>
            <div className="text-right">
               <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Operador</p>
               <p className="text-sm font-bold text-gray-700">Admin</p>
            </div>
        </header>

        {/* Categories */}
        <div className="flex bg-white border-b border-gray-200 shadow-sm shrink-0">
            <CategoryButton category="pizza" label="Pizzas" icon="🍕" />
            <CategoryButton category="drink" label="Bebidas" icon="🥤" />
            <CategoryButton category="dessert" label="Sobremesas" icon="🍰" />
        </div>

        {/* Product Grid */}
        <div className="flex-grow overflow-y-auto p-4 lg:p-6 bg-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredMenuItems.map(item => (
                <button 
                    key={item.id} 
                    onClick={() => addToCart(item)} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-brand-red transition-all duration-200 flex flex-col overflow-hidden text-left group active:scale-95"
                >
                    <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                            {item.preparationTime} min
                        </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow w-full">
                        <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1 mb-1 group-hover:text-brand-red transition-colors">{item.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-grow leading-relaxed">{item.description}</p>
                        <div className="flex justify-between items-end w-full mt-auto">
                            <span className="text-lg font-black text-gray-900">R$ {item.price.toFixed(0)}</span>
                            <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-brand-red group-hover:text-white transition-colors text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* Sidebar - Cart & Customer */}
      <div className="w-full lg:w-[400px] bg-white shadow-xl flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 h-[40vh] lg:h-full z-20">
        
        {/* Customer Section */}
        <div className="p-5 bg-gray-50 border-b border-gray-200 relative shrink-0">
             <div className="flex justify-between items-center mb-3">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <UsersIcon className="h-3 w-3" />
                    Cliente Associado
                </label>
                {!selectedCustomer && (
                    <button onClick={onAddCustomer} className="text-xs bg-brand-dark text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors">
                        + Novo
                    </button>
                )}
            </div>
           
            {selectedCustomer ? (
                <div className="bg-white border border-blue-200 rounded-xl p-3 shadow-sm flex justify-between items-center group animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-3 min-w-0">
                         <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm border-2 border-white shadow-sm shrink-0">
                             {selectedCustomer.name.slice(0,2).toUpperCase()}
                         </div>
                         <div className="min-w-0">
                             <p className="font-bold text-gray-900 text-sm truncate">{selectedCustomer.name}</p>
                             <p className="text-xs text-gray-500 truncate">{selectedCustomer.phone || selectedCustomer.email}</p>
                         </div>
                    </div>
                    <button onClick={clearCustomer} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Remover cliente">
                        <XIcon className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="relative" ref={suggestionsRef}>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder={selectedTable ? `Mesa ${selectedTable.name} (Opcional)` : "Buscar cliente por nome/tel..."}
                            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-shadow shadow-sm"
                        />
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && searchQuery.length > 0 && (
                        <div className="absolute z-30 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto mt-2 animate-in fade-in zoom-in-95">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(c => (
                                    <div 
                                        key={c.id} 
                                        onClick={() => selectCustomer(c)}
                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold group-hover:bg-brand-red group-hover:text-white transition-colors">
                                            {c.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.phone}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    <p>Nenhum cliente encontrado.</p>
                                    <button onClick={onAddCustomer} className="text-brand-red font-bold hover:underline mt-1 block w-full">
                                        + Cadastrar Novo
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-hidden flex flex-col">
            <div className="px-5 py-3 bg-white border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    Itens do Pedido
                </h3>
                <span className="text-xs font-bold text-brand-red bg-red-50 px-2 py-1 rounded-full">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} itens
                </span>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-white">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <ShoppingCartIcon className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="text-sm font-medium">Seu carrinho está vazio</p>
                </div>
            ) : (
                cart.map(cartItem => (
                    <div key={cartItem.item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                             <img src={cartItem.item.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-sm text-gray-800 truncate">{cartItem.item.name}</p>
                            <p className="text-xs text-gray-500">R$ {cartItem.item.price.toFixed(2)} un</p>
                        </div>
                        
                        <div className="flex items-center gap-3 shrink-0 bg-gray-50 rounded-lg p-1">
                            <button 
                                onClick={() => removeFromCart(cartItem.item.id)} 
                                className="w-6 h-6 rounded bg-white shadow-sm text-gray-600 font-bold flex items-center justify-center hover:text-red-500 text-xs transition-colors"
                            >
                                -
                            </button>
                            <span className="w-4 text-center font-bold text-sm text-gray-800">{cartItem.quantity}</span>
                            <button 
                                onClick={() => addToCart(cartItem.item)} 
                                className="w-6 h-6 rounded bg-white shadow-sm text-brand-green font-bold flex items-center justify-center hover:bg-green-50 text-xs transition-colors"
                            >
                                +
                            </button>
                        </div>
                        
                        <p className="w-14 text-right font-bold text-sm text-gray-900">
                            {(cartItem.item.price * cartItem.quantity).toFixed(0)}
                        </p>
                    </div>
                ))
            )}
            </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-5 bg-white border-t border-gray-200 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium text-sm">Subtotal</span>
                <span className="text-3xl font-black text-gray-900 tracking-tight">R$ {calculateTotal().toFixed(2)}</span>
            </div>
            <button 
                onClick={handleFinalizeClick}
                className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all duration-200 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg" 
                disabled={cart.length === 0}>
                <span>Cobrar</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
          <div className="absolute inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200">
                  <div className="bg-gray-50 p-6 text-center border-b border-gray-100">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircleIcon className="w-8 h-8 text-brand-green" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Confirmar Venda</h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                           <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                                <UserIcon className="w-5 h-5" />
                           </div>
                           <div>
                               <p className="text-xs text-gray-500 font-bold uppercase">Cliente</p>
                               <p className="font-bold text-gray-800">
                                   {selectedCustomer ? selectedCustomer.name : (searchQuery || (selectedTable ? selectedTable.name : 'Consumidor Final'))}
                               </p>
                           </div>
                      </div>
                      
                      <div className="space-y-1 text-center">
                          <p className="text-sm text-gray-500">Valor Total</p>
                          <p className="text-4xl font-black text-gray-900">R$ {calculateTotal().toFixed(2)}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <button 
                              onClick={() => setIsConfirmationOpen(false)}
                              className="py-3.5 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                          >
                              Voltar
                          </button>
                          <button 
                              onClick={handleConfirmSale}
                              className="py-3.5 rounded-xl bg-brand-dark text-white font-bold shadow-lg hover:bg-black transition-all active:scale-95"
                          >
                              Confirmar
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default PosView;
