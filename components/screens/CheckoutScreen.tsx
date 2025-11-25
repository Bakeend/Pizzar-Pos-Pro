
import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, Table, OrderType, TableStatus, View, MenuItem, Coupon, Customer, Order, OrderStatus } from '../../types';
import CustomerTableCard from '../CustomerTableCard';
import { TruckIcon, PosIcon, TableIcon, CheckCircleIcon, MapPinIcon, UserIcon, CreditCardIcon, BanknoteIcon, QrCodeIcon, TicketIcon, CrownIcon } from '../icons';

const calculateCartItemPrice = (cartItem: CartItem): number => {
    if (cartItem.isPromo) return cartItem.item.price;

    let basePrice;
    const { item, customization } = cartItem;

    if (!customization) return item.price; 

    if (customization.flavors && customization.flavors.length > 1) {
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
    const sizeText = size === 'large' ? 'G' : 'M';
    const crustText = crust === 'cheese-filled' ? 'Borda Recheada' : crust === 'thin' ? 'Massa Fina' : 'Tradicional';
    return `${sizeText} • ${crustText}`;
}

interface CheckoutScreenProps {
  cart: CartItem[];
  tables: Table[];
  coupons: Coupon[];
  orders: Order[];
  customers: Customer[];
  onPlaceOrder: (details: { 
      orderType: OrderType; 
      customerName: string; 
      phone?: string;
      customerId?: number;
      address?: string; 
      tableId?: number, 
      discount?: number 
  }) => void;
  setView: (view: View) => void;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ cart, tables, coupons, orders, customers, onPlaceOrder, setView }) => {
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Delivery);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', address: '' });
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [vipDiscount, setVipDiscount] = useState<number>(0);
  const [isVip, setIsVip] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
      const itemPrice = item.item.category === 'pizza' ? calculateCartItemPrice(item) : item.item.price;
      return sum + itemPrice * item.quantity;
  }, 0);

  // VIP Logic Check
  useEffect(() => {
    if (customerDetails.phone && customerDetails.phone.length > 8) {
        const phoneClean = customerDetails.phone.replace(/\D/g, '');
        const customer = customers.find(c => c.phone.replace(/\D/g, '') === phoneClean);
        
        if (customer) {
            const history = orders.filter(o => 
                o.customerId === customer.id && 
                o.status === OrderStatus.Completed
            );
            const totalSpent = history.reduce((sum, o) => sum + o.total, 0);
            
            if (totalSpent > 300) {
                setIsVip(true);
                // Auto-fill name if empty
                if (!customerDetails.name) {
                     setCustomerDetails(prev => ({...prev, name: customer.name, address: customer.address || prev.address}));
                }
                return;
            }
        }
    }
    setIsVip(false);
  }, [customerDetails.phone, customers, orders]);

  useEffect(() => {
      if (isVip) {
          setVipDiscount(subtotal * 0.05); // 5% Automatic Discount for VIPs
      } else {
          setVipDiscount(0);
      }
  }, [isVip, subtotal]);

  // Delivery Fee logic: Free for orders >= 80, else 5.00
  const deliveryFee = orderType === OrderType.Delivery 
    ? (subtotal >= 80 ? 0 : 5.00) 
    : 0;
  
  const couponDiscountAmount = useMemo(() => {
      if (!appliedCoupon) return 0;
      if (appliedCoupon.minValue && subtotal < appliedCoupon.minValue) return 0;
      
      if (appliedCoupon.type === 'percentage') {
          return subtotal * (appliedCoupon.value / 100);
      }
      return appliedCoupon.value;
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, subtotal + deliveryFee - couponDiscountAmount - vipDiscount);

  const handleApplyCoupon = () => {
      const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
      if (coupon) {
          if (coupon.minValue && subtotal < coupon.minValue) {
              alert(`Este cupom requer um pedido mínimo de R$ ${coupon.minValue.toFixed(2)}`);
              return;
          }
          setAppliedCoupon(coupon);
          setCouponCode('');
      } else {
          alert('Cupom inválido');
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Look up customer ID again for final submission
    let customerId: number | undefined;
    if (customerDetails.phone) {
        const phoneClean = customerDetails.phone.replace(/\D/g, '');
        const customer = customers.find(c => c.phone.replace(/\D/g, '') === phoneClean);
        if (customer) customerId = customer.id;
    }

    onPlaceOrder({
      orderType,
      customerName: customerDetails.name,
      phone: customerDetails.phone,
      customerId: customerId,
      address: orderType === OrderType.Delivery ? customerDetails.address : undefined,
      tableId: orderType === OrderType.DineIn ? (selectedTableId || undefined) : undefined,
      discount: couponDiscountAmount + vipDiscount,
    });
  };

  const selectedTableName = tables.find(t => t.id === selectedTableId)?.name;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-brand-dark text-white py-8 px-4 shadow-md">
        <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold font-serif mb-2">Finalizar Pedido</h2>
            <p className="text-gray-400">Complete seus dados para receber sua pizza quentinha.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 -mt-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Order Type */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Tipo de Entrega
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setOrderType(OrderType.Delivery)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                orderType === OrderType.Delivery 
                                ? 'border-brand-red bg-red-50 text-brand-red' 
                                : 'border-gray-100 hover:border-gray-200 text-gray-500'
                            }`}
                        >
                            <TruckIcon className="h-6 w-6 mb-2" />
                            <span className="font-bold text-sm">Delivery</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setOrderType(OrderType.Takeout)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                orderType === OrderType.Takeout 
                                ? 'border-brand-red bg-red-50 text-brand-red' 
                                : 'border-gray-100 hover:border-gray-200 text-gray-500'
                            }`}
                        >
                            <PosIcon className="h-6 w-6 mb-2" />
                            <span className="font-bold text-sm">Retirada</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setOrderType(OrderType.DineIn)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                orderType === OrderType.DineIn 
                                ? 'border-brand-red bg-red-50 text-brand-red' 
                                : 'border-gray-100 hover:border-gray-200 text-gray-500'
                            }`}
                        >
                            <TableIcon className="h-6 w-6 mb-2" />
                            <span className="font-bold text-sm">Mesa</span>
                        </button>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm relative overflow-hidden">
                    {isVip && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-brand-yellow text-brand-dark text-xs font-bold px-4 py-1 rounded-bl-xl shadow-sm flex items-center gap-1 animate-in slide-in-from-right">
                            <CrownIcon className="w-4 h-4" />
                            CLIENTE VIP
                        </div>
                    )}
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Seus Dados
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (Identifica VIP)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <span className="text-lg">📱</span>
                                </div>
                                <input 
                                    type="tel" 
                                    required 
                                    value={customerDetails.phone}
                                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                                    className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-brand-red outline-none ${isVip ? 'border-brand-yellow bg-yellow-50/30' : 'border-gray-300'}`}
                                    placeholder="(11) 99999-9999"
                                />
                                {isVip && <div className="absolute inset-y-0 right-3 flex items-center text-brand-yellow"><CrownIcon className="w-5 h-5" /></div>}
                            </div>
                            {isVip && <p className="text-xs text-brand-yellow font-bold mt-1 flex items-center gap-1"><CrownIcon className="w-3 h-3" /> Identificamos você como VIP! 5% de desconto aplicado.</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <div className="relative">
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    required 
                                    value={customerDetails.name}
                                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                                    placeholder="Seu nome"
                                />
                            </div>
                        </div>
                        {orderType === OrderType.Delivery && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <MapPinIcon className="w-5 h-5" />
                                    </div>
                                    <textarea 
                                        required 
                                        rows={2}
                                        value={customerDetails.address}
                                        onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none resize-none"
                                        placeholder="Rua, Número, Bairro, Complemento"
                                    ></textarea>
                                </div>
                            </div>
                        )}
                        {orderType === OrderType.DineIn && (
                             <div className="animate-in fade-in slide-in-from-top-2 pt-2 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-bold text-gray-800">Escolha sua Mesa</label>
                                    {selectedTableId && (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-in zoom-in">
                                            <CheckCircleIcon className="w-3 h-3" />
                                            {selectedTableName} Selecionada
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {tables.map(table => (
                                        <div key={table.id} className="min-h-[80px]">
                                            <CustomerTableCard 
                                                table={table} 
                                                isSelected={selectedTableId === table.id}
                                                onSelect={setSelectedTableId}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {!selectedTableId && <p className="text-xs text-red-500 mt-2 font-bold bg-red-50 p-2 rounded-lg border border-red-100">Por favor, selecione uma mesa disponível no mapa acima.</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                        Pagamento
                    </h3>
                    <div className="space-y-3">
                        {[
                            { id: 'credit', label: 'Cartão de Crédito', icon: <CreditCardIcon className="w-5 h-5" /> },
                            { id: 'debit', label: 'Cartão de Débito', icon: <CreditCardIcon className="w-5 h-5" /> },
                            { id: 'pix', label: 'PIX', icon: <QrCodeIcon className="w-5 h-5" /> },
                            { id: 'cash', label: 'Dinheiro', icon: <BanknoteIcon className="w-5 h-5" /> },
                        ].map((method) => (
                            <label key={method.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === method.id ? 'border-brand-green bg-green-50 ring-1 ring-brand-green' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value={method.id} 
                                    checked={paymentMethod === method.id} 
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-brand-green focus:ring-brand-green"
                                />
                                <div className="ml-3 flex items-center gap-2 text-gray-700 font-medium">
                                    {method.icon}
                                    {method.label}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Summary */}
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Resumo do Pedido</h3>
                    
                    {/* Items List */}
                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <div>
                                    <p className="font-bold text-gray-800">{item.quantity}x {item.customization ? formatFlavors(item.customization.flavors) : item.item.name}</p>
                                    {item.customization && <p className="text-xs text-gray-500">{formatCustomization(item.customization)}</p>}
                                    {item.isPromo && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded font-bold">PROMOÇÃO</span>}
                                </div>
                                <p className="font-medium text-gray-600">
                                    R$ {((item.item.category === 'pizza' ? calculateCartItemPrice(item) : item.item.price) * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t border-dashed border-gray-200 my-4"></div>

                    {/* Coupon Input */}
                    <div className="mb-4">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cupom de Desconto</label>
                         <div className="flex gap-2">
                             <div className="relative flex-grow">
                                 <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                                     <TicketIcon className="w-4 h-4" />
                                 </div>
                                 <input 
                                     type="text" 
                                     value={couponCode}
                                     onChange={(e) => setCouponCode(e.target.value)}
                                     className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-brand-red outline-none uppercase"
                                     placeholder="CODIGO"
                                 />
                             </div>
                             <button 
                                type="button"
                                onClick={handleApplyCoupon}
                                className="bg-gray-800 text-white text-sm font-bold px-3 py-2 rounded-lg hover:bg-black transition-colors"
                             >
                                 Aplicar
                             </button>
                         </div>
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Taxa de Entrega</span>
                            <span>
                                {deliveryFee === 0 
                                    ? <span className="text-brand-green font-bold">Grátis {subtotal >= 80 && '(Pedido > R$80)'}</span> 
                                    : `R$ ${deliveryFee.toFixed(2)}`
                                }
                            </span>
                        </div>
                        {appliedCoupon && (
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Cupom ({appliedCoupon.code})</span>
                                <span>- R$ {couponDiscountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        {isVip && (
                            <div className="flex justify-between text-brand-yellow font-bold animate-pulse">
                                <span className="flex items-center gap-1"><CrownIcon className="w-3 h-3" /> Desconto VIP (5%)</span>
                                <span>- R$ {vipDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                            <span className="font-bold text-gray-800 text-lg">Total</span>
                            <span className="font-black text-2xl text-brand-green">R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={cart.length === 0 || (orderType === OrderType.DineIn && !selectedTableId)}
                        className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 mt-6 transition-all transform hover:-translate-y-1 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        Confirmar Pedido
                    </button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutScreen;
