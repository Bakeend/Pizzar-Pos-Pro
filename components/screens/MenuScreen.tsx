
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import { PizzaIcon, ShoppingCartIcon, ClockIcon } from '../icons';

interface MenuScreenProps {
  menuItems: MenuItem[];
  onOrderPizza: (pizza: MenuItem) => void;
  onAddItem: (item: MenuItem) => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ menuItems, onOrderPizza, onAddItem }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'pizza' | 'drink' | 'dessert'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Debounce logic: Update debouncedTerm only after user stops typing for 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(debouncedTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(debouncedTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedTerm(''); // Clear immediately for better UX
    setActiveCategory('all');
  };

  const categories = [
    { id: 'all', label: 'Todos', icon: '🍽️' },
    { id: 'pizza', label: 'Pizzas', icon: '🍕' },
    { id: 'drink', label: 'Bebidas', icon: '🥤' },
    { id: 'dessert', label: 'Sobremesas', icon: '🍰' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[380px] w-full overflow-hidden shadow-2xl">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transform hover:scale-105 transition-transform duration-[10s]"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-50/95"></div>
         
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-10 pb-20">
            <span className="text-brand-yellow font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 animate-in slide-in-from-bottom-5 fade-in duration-700">Experiência Gastronômica</span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg" style={{ fontFamily: "'Roboto Slab', serif" }}>
                Cardápio <span className="text-brand-red italic">Premium</span>
            </h2>
            <p className="text-gray-200 text-sm md:text-lg max-w-2xl font-light leading-relaxed">
                Ingredientes selecionados e receitas exclusivas para momentos especiais.
            </p>
         </div>

         {/* Floating Search Bar */}
         <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[90%] max-w-2xl z-20">
             <div className="bg-white p-2 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] flex items-center border border-gray-100 group focus-within:ring-4 focus-within:ring-brand-red/20 transition-all">
                 <div className="pl-4 text-gray-400 group-focus-within:text-brand-red transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 </div>
                 <input
                    type="text"
                    placeholder="Busque por sabor, ingrediente ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 px-4 rounded-full text-gray-700 placeholder-gray-400 outline-none bg-transparent text-base md:text-lg"
                />
             </div>
         </div>
      </div>

      <div className="container mx-auto px-4 pt-16">
        {/* Category Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto py-2 no-scrollbar">
            <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-200 inline-flex space-x-1">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as any)}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                            activeCategory === cat.id
                            ? 'bg-brand-dark text-white shadow-md transform scale-105'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        <span>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>

        {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 mx-auto max-w-md">
                <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
                    <PizzaIcon className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ops! Nada encontrado.</h3>
                <p className="text-gray-500">Tente buscar por outro termo ou mude a categoria.</p>
                <button onClick={handleClearSearch} className="mt-4 text-brand-red font-bold hover:underline">Ver todo o cardápio</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-gray-100 overflow-hidden hover:-translate-y-2">
                    
                    {/* Image Area */}
                    <div className="relative h-64 overflow-hidden">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {item.tags?.includes('vegan') && (
                                <span className="bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wider">
                                    VEGAN
                                </span>
                            )}
                            {item.id % 3 === 0 && (
                                <span className="bg-brand-yellow/90 backdrop-blur-md text-brand-dark text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wider">
                                    POPULAR
                                </span>
                            )}
                        </div>

                        {/* Prep Time */}
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {item.preparationTime} min
                        </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-grow relative">
                        {/* Floating Price Tag effect */}
                        <div className="absolute -top-8 right-6 bg-brand-red text-white px-4 py-2 rounded-2xl shadow-lg shadow-red-500/30 transform group-hover:scale-110 transition-transform duration-300">
                            <span className="text-xs font-medium opacity-80 mr-1">R$</span>
                            <span className="text-xl font-extrabold tracking-tight">{item.price.toFixed(0)}</span>
                            <span className="text-xs font-bold align-top">,00</span>
                        </div>

                        <div className="mb-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category === 'pizza' ? 'Artesanal' : item.category}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight" style={{ fontFamily: "'Roboto Slab', serif" }}>{item.name}</h3>
                        
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow font-light">
                            {item.description}
                        </p>
                        
                        <div className="mt-auto">
                            {item.category === 'pizza' ? (
                                <button 
                                    onClick={() => onOrderPizza(item)}
                                    className="w-full bg-gray-900 hover:bg-brand-red text-white py-4 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 group/btn"
                                >
                                    <span>Personalizar & Pedir</span>
                                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => onAddItem(item)}
                                    className="w-full bg-white border-2 border-gray-200 hover:border-brand-green hover:bg-brand-green hover:text-white text-gray-700 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <ShoppingCartIcon className="w-4 h-4" />
                                    <span>Adicionar ao Pedido</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default MenuScreen;
