
import React from 'react';
import { View, CartItem } from '../types';
import { ShoppingCartIcon } from './icons';
import BrandLogo from './BrandLogo';

interface HeaderProps {
  setView: (view: View) => void;
  cart: CartItem[];
  setIsCartOpen: (isOpen: boolean) => void;
  isCartAnimating?: boolean;
}

const Header: React.FC<HeaderProps> = ({ setView, cart, setIsCartOpen, isCartAnimating = false }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, view: View, elementId?: string) => {
    e.preventDefault();
    setView(view);
    if (view === View.Home) {
        if (elementId) {
            // Short timeout to allow state update and re-render if coming from another view
            setTimeout(() => {
                const element = document.getElementById(elementId);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-brand-dark text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setView(View.Home)}
          >
            <BrandLogo className="h-12 w-12 mr-3 transform transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]"/>
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold tracking-wider leading-none text-brand-yellow" style={{ fontFamily: "'Roboto Slab', serif" }}>PIZZA</h1>
                <span className="text-xs font-bold tracking-[0.3em] text-white leading-none mt-1">POS PRO</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" onClick={(e) => handleNavClick(e, View.Home)} className="text-lg font-medium text-gray-300 hover:text-brand-yellow transform hover:scale-105 transition-all duration-300">Início</a>
            <a href="#about" onClick={(e) => handleNavClick(e, View.Home, 'about')} className="text-lg font-medium text-gray-300 hover:text-brand-yellow transform hover:scale-105 transition-all duration-300">Sobre Nós</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, View.Home, 'contact')} className="text-lg font-medium text-gray-300 hover:text-brand-yellow transform hover:scale-105 transition-all duration-300">Contato</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
                onClick={() => setIsCartOpen(true)} 
                className={`relative text-white p-2 rounded-full transition-all duration-300 ${
                    isCartAnimating 
                    ? 'bg-brand-red scale-110 shadow-[0_0_20px_rgba(229,57,53,0.6)] ring-2 ring-brand-yellow' 
                    : 'hover:bg-gray-700'
                }`}
                aria-label={`Carrinho com ${cartItemCount} itens`}
            >
                <ShoppingCartIcon className={`h-6 w-6 transition-transform duration-300 ${isCartAnimating ? 'scale-110' : ''}`} />
                {cartItemCount > 0 && (
                    <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-xs font-bold border-2 border-brand-dark transition-transform duration-300 ${isCartAnimating ? 'scale-125' : ''}`}>
                        {cartItemCount}
                    </span>
                )}
            </button>
            <button onClick={() => setView(View.Admin)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Admin
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
