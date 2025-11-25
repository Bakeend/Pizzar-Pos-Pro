
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, MenuItem, CartItem, OrderType } from '../../types';
import { ClockIcon, PosIcon, TableIcon, TruckIcon, CheckCircleIcon } from '../icons';

const formatFlavors = (flavors: MenuItem[]): string => {
    if (flavors.length > 1) {
        return `1/2 ${flavors[0].name} \n1/2 ${flavors[1].name}`;
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
    return `${sizeText} • ${crustText}`;
}

const OrderTypeIcon: React.FC<{ type: OrderType, className?: string }> = ({ type, className }) => {
    switch (type) {
        case OrderType.DineIn: return <TableIcon className={className} />;
        case OrderType.Delivery: return <TruckIcon className={className} />;
        case OrderType.Takeout: return <PosIcon className={className} />;
        default: return <PosIcon className={className} />;
    }
}


const OrderCard: React.FC<{ 
    order: Order, 
    actionLabel: string,
    onAction: (orderId: number) => void,
    color: 'yellow' | 'blue' | 'green'
}> = ({ order, actionLabel, onAction = (id: number) => {}, color }) => {
    const [timeElapsed, setTimeElapsed] = useState(0);

    const totalPrepTime = order.items.reduce((sum, item) => sum + (item.item.preparationTime || 0) * item.quantity, 0);

    useEffect(() => {
        if (order.status === OrderStatus.Pending) {
             const now = new Date();
             const created = new Date(order.createdAt);
             setTimeElapsed(Math.floor((now.getTime() - created.getTime()) / 1000));
        } else if (order.status === OrderStatus.Preparing && order.startedPreparingAt) {
            const calculateTime = () => {
                const now = new Date();
                const startTime = new Date(order.startedPreparingAt!);
                const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                setTimeElapsed(diff);
            };
            calculateTime();
            const interval = setInterval(calculateTime, 1000);
            return () => clearInterval(interval);
        }
    }, [order.status, order.startedPreparingAt, order.createdAt]);
    
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    
    // Alert if preparing takes longer than estimated
    const isLate = order.status === OrderStatus.Preparing && timeElapsed > totalPrepTime * 60;
    
    const colorClasses = {
        yellow: 'border-yellow-500 bg-yellow-50',
        blue: 'border-blue-500 bg-blue-50',
        green: 'border-brand-green bg-green-50',
    };

    const headerColorClasses = {
        yellow: 'bg-yellow-100 text-yellow-900',
        blue: 'bg-blue-100 text-blue-900',
        green: 'bg-green-100 text-green-900',
    };
    
    const buttonClasses = {
        yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        blue: 'bg-blue-500 hover:bg-blue-600 text-white',
        green: 'bg-brand-green hover:bg-green-600 text-white',
    };

    const handleAction = () => {
        if (typeof onAction === 'function') {
            onAction(order.id);
        } else {
            console.warn('No action handler provided for order', order.id);
        }
    };

    return (
        <div className={`relative bg-white rounded-xl shadow-md flex flex-col h-full border-l-[6px] overflow-hidden transition-transform duration-200 hover:-translate-y-1 
            ${isLate ? 'border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : colorClasses[color]}
        `}>
            {/* Visual Pulse Overlay for Late Orders */}
            {isLate && (
                <div className="absolute inset-0 border-2 border-red-500 rounded-xl animate-pulse pointer-events-none z-10 ring-4 ring-red-100"></div>
            )}

            {/* Header */}
            <div className={`p-3 flex justify-between items-center border-b border-opacity-10 border-black 
                ${isLate ? 'bg-red-100 text-red-900' : headerColorClasses[color]}`}>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white bg-opacity-50 rounded-lg">
                        <OrderTypeIcon type={order.type} className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none">#{order.id.toString().slice(-4)}</h3>
                        <p className="text-xs font-medium opacity-80">{order.customerName}</p>
                    </div>
                </div>
                <div className="text-right">
                     <div className={`flex items-center justify-end gap-1 font-mono text-lg font-bold ${isLate ? 'text-red-600 animate-pulse' : ''}`}>
                        {isLate && <span className="text-xl mr-1">⚠️</span>}
                        <ClockIcon className="h-4 w-4" />
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    {order.status === OrderStatus.Preparing && (
                         <div className={`text-[10px] font-bold ${isLate ? 'text-red-600' : 'opacity-70'}`}>
                             META: {totalPrepTime} min
                         </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-grow bg-white relative z-0">
                <ul className="space-y-4">
                    {order.items.map((cartItem, index) => (
                        <li key={index} className="flex items-start text-gray-800 border-b border-dashed border-gray-200 last:border-0 pb-3 last:pb-0">
                           <span className="font-black text-xl mr-3 text-gray-400 w-6 text-center">{cartItem.quantity}</span>
                           <div className="flex-grow">
                             <div className="font-bold text-base leading-tight whitespace-pre-line">
                                {cartItem.customization ? formatFlavors(cartItem.customization.flavors) : cartItem.item.name}
                             </div>
                             {cartItem.customization && (
                                <p className="text-xs text-gray-500 mt-1 font-medium">
                                    {formatCustomization(cartItem.customization)}
                                </p>
                             )}
                           </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-gray-100 relative z-0">
                <button 
                    onClick={handleAction}
                    className={`w-full font-bold py-3.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 
                        ${isLate && color === 'blue' ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : buttonClasses[color]}
                    `}
                >
                    {color === 'green' && <CheckCircleIcon className="h-5 w-5" />}
                    {actionLabel}
                </button>
            </div>
        </div>
    );
};

interface KdsViewProps {
    orders: Order[];
    onStartPreparation: (orderId: number) => void;
    onMarkAsReady: (orderId: number) => void;
    onOrderDelivered: (orderId: number) => void;
}

const KdsView: React.FC<KdsViewProps> = ({ 
    orders, 
    onStartPreparation = (id: number) => {}, 
    onMarkAsReady = (id: number) => {}, 
    onOrderDelivered = (id: number) => {} 
}) => {
    const pendingOrders = orders.filter(o => o.status === OrderStatus.Pending).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const preparingOrders = orders.filter(o => o.status === OrderStatus.Preparing).sort((a,b) => new Date(a.startedPreparingAt!).getTime() - new Date(b.startedPreparingAt!).getTime());
    const readyOrders = orders.filter(o => o.status === OrderStatus.Ready).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return (
        <div className="h-full bg-gray-100 overflow-x-auto overflow-y-hidden flex flex-col">
             <header className="bg-brand-dark text-white px-6 py-4 shadow-md shrink-0 flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-wide">Monitor de Cozinha (KDS)</h2>
                <div className="flex gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Pendente: {pendingOrders.length}</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Preparando: {preparingOrders.length}</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Pronto: {readyOrders.length}</div>
                </div>
            </header>

            <div className="flex-grow p-4 overflow-auto">
                <div className="flex flex-col md:flex-row gap-6 min-w-full h-full">
                    
                    {/* Column 1: Pending */}
                    <div className="flex-1 min-w-[300px] flex flex-col bg-gray-200/50 rounded-xl border border-gray-300/50">
                        <div className="p-3 bg-gray-300/50 rounded-t-xl border-b border-gray-300 font-bold text-gray-700 flex justify-between sticky top-0 z-10 backdrop-blur-sm">
                            <span>A FAZER</span>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm">{pendingOrders.length}</span>
                        </div>
                        <div className="p-3 space-y-3 overflow-y-auto flex-grow">
                            {pendingOrders.map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    actionLabel="Iniciar Preparo" 
                                    onAction={onStartPreparation}
                                    color="yellow"
                                />
                            ))}
                             {pendingOrders.length === 0 && (
                                <div className="text-center text-gray-400 py-10 italic">Nenhum pedido pendente</div>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Preparing */}
                    <div className="flex-1 min-w-[300px] flex flex-col bg-blue-50/50 rounded-xl border border-blue-200/50">
                        <div className="p-3 bg-blue-200/50 rounded-t-xl border-b border-blue-200 font-bold text-blue-800 flex justify-between sticky top-0 z-10 backdrop-blur-sm">
                            <span>PREPARANDO</span>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm">{preparingOrders.length}</span>
                        </div>
                        <div className="p-3 space-y-3 overflow-y-auto flex-grow">
                            {preparingOrders.map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    actionLabel="Marcar Pronto" 
                                    onAction={onMarkAsReady}
                                    color="blue"
                                />
                            ))}
                            {preparingOrders.length === 0 && (
                                <div className="text-center text-gray-400 py-10 italic">Nenhum pedido em preparo</div>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Ready */}
                    <div className="flex-1 min-w-[300px] flex flex-col bg-green-50/50 rounded-xl border border-green-200/50">
                         <div className="p-3 bg-green-200/50 rounded-t-xl border-b border-green-200 font-bold text-green-800 flex justify-between sticky top-0 z-10 backdrop-blur-sm">
                            <span>PRONTO / EXPEDIÇÃO</span>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm">{readyOrders.length}</span>
                        </div>
                        <div className="p-3 space-y-3 overflow-y-auto flex-grow">
                            {readyOrders.map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    actionLabel="Entregue" 
                                    onAction={onOrderDelivered}
                                    color="green"
                                />
                            ))}
                             {readyOrders.length === 0 && (
                                <div className="text-center text-gray-400 py-10 italic">Nenhum pedido aguardando</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default KdsView;
