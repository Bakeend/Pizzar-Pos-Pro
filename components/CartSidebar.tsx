
import React from 'react';
import { CartItem, MenuItem } from '../types';
import { XIcon, TrashIcon } from './icons';

// Helper function to calculate the price of a single customized item
const calculateCartItemPrice = (cartItem: CartItem): number => {
    if (cartItem.isPromo) return cartItem.item.price;

    let basePrice;
    const { item, customization } = cartItem;

    if (!customization) return item.price; // For non-pizza items

    // For pizzas
    if (customization.flavors && customization.flavors.length > 1) {
        // Half-and-half: price is the higher of the two
        basePrice = Math.max(customization.flavors[0].price, customization.flavors[1].price);
    } else {
        basePrice = item.price;
    }

    let finalPrice = basePrice;
    if (customization.size === 'large') finalPrice += 10.00;
    if (customization.crust === 'cheese-filled') finalPrice += 8.00;

    return finalPrice;
};

const formatFlavors = (flavors: MenuItem[]): string => {
    if (flavors.length > 1) {
        return `Meio a Meio: ${flavors.map(f => f.name).join(' / ')}`;
    }
    return flavors[0].name;
}

const formatCustomization = (customization: CartItem['customization']): string => {
    if (!customization) return '';
    const { size, crust } = customization;
    const sizeText = size === 'large' ? 'Grande' : 'Média';
    const crustText = {
        'classic': 'Borda Clássica',
        'thin': 'Borda Fina',
        'cheese-filled': 'Borda Recheada'
    }[crust];
    return `${sizeText}, ${crustText}`;
}


interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    onProceedToCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cart, setCart, onProceedToCheckout }) => {
    
    const handleRemoveItem = (itemIndex: number) => {
        setCart(currentCart => currentCart.filter((_, index) => index !== itemIndex));
    };
    
    const handleQuantityChange = (itemIndex: number, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveItem(itemIndex);
            return;
        }
        setCart(currentCart => currentCart.map((item, index) => 
            index === itemIndex ? { ...item, quantity: newQuantity } : item
        ));
    };

    const subtotal = cart.reduce((sum, item) => {
        const itemPrice = item.item.category === 'pizza' ? calculateCartItemPrice(item) : item.item.price;
        return sum + itemPrice * item.quantity;
    }, 0);

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-[110] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <aside 
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[120] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    <header className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Seu Pedido</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                            <XIcon className="h-6 w-6 text-gray-600" />
                        </button>
                    </header>

                    {cart.length === 0 ? (
                        <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
                            <p className="text-gray-500">Seu carrinho está vazio.</p>
                            <button onClick={onClose} className="mt-4 bg-brand-red text-white font-bold py-2 px-6 rounded-lg">
                                Começar a pedir
                            </button>
                        </div>
                    ) : (
                       <>
                         <main className="flex-grow overflow-y-auto p-4 space-y-4">
                            {cart.map((cartItem, index) => {
                                const itemPrice = cartItem.item.category === 'pizza' ? calculateCartItemPrice(cartItem) : cartItem.item.price;
                                return (
                                    <div key={index} className="flex items-start space-x-4">
                                        <img src={cartItem.item.image} alt={cartItem.item.name} className="w-20 h-20 object-cover rounded-md"/>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-800">
                                                {cartItem.customization ? formatFlavors(cartItem.customization.flavors) : cartItem.item.name}
                                            </h3>
                                            {cartItem.customization && <p className="text-xs text-gray-500">{formatCustomization(cartItem.customization)}</p>}
                                            {cartItem.isPromo && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded font-bold">PROMOÇÃO</span>}
                                            <p className="text-sm font-bold text-brand-green mt-1">R${itemPrice.toFixed(2)}</p>
                                            <div className="flex items-center mt-2">
                                                <button onClick={() => handleQuantityChange(index, cartItem.quantity - 1)} className="w-6 h-6 rounded-full bg-gray-200 font-bold">-</button>
                                                <span className="w-8 text-center font-semibold">{cartItem.quantity}</span>
                                                <button onClick={() => handleQuantityChange(index, cartItem.quantity + 1)} className="w-6 h-6 rounded-full bg-gray-200 font-bold">+</button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">R${(itemPrice * cartItem.quantity).toFixed(2)}</p>
                                            <button onClick={() => handleRemoveItem(index)} className="mt-2 text-red-500 hover:text-red-700">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </main>
                        <footer className="p-4 bg-gray-50 border-t space-y-3">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Subtotal</span>
                                <span>R${subtotal.toFixed(2)}</span>
                            </div>
                            <button onClick={onProceedToCheckout} className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-transform duration-200 hover:scale-105">
                                Continuar
                            </button>
                        </footer>
                       </>
                    )}
                </div>
            </aside>
        </>
    );
};

export default CartSidebar;