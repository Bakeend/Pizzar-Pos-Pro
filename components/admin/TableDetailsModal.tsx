
import React from 'react';
import { Table, Order, OrderStatus, CartItem, MenuItem } from '../../types';
import { XIcon } from '../icons';

interface TableDetailsModalProps {
    table: Table;
    allOrders: Order[];
    onClose: () => void;
    onReleaseTable: (tableId: number) => void;
}

const calculateCartItemPrice = (cartItem: CartItem): number => {
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

const OrderDetails: React.FC<{order: Order}> = ({ order }) => (
    <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-lg">Pedido #{order.id}</h4>
            <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</span>
        </div>
        <ul className="space-y-2 mb-3">
            {order.items.map((cartItem, index) => {
                const itemPrice = calculateCartItemPrice(cartItem);
                const itemName = cartItem.customization ? formatFlavors(cartItem.customization.flavors) : cartItem.item.name;
                return (
                    <li key={index} className="flex justify-between text-sm">
                        <span>{cartItem.quantity}x {itemName}</span>
                        <span className="font-medium">R${(itemPrice * cartItem.quantity).toFixed(2)}</span>
                    </li>
                );
            })}
        </ul>
        <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>R${order.total.toFixed(2)}</span>
        </div>
    </div>
);


const TableDetailsModal: React.FC<TableDetailsModalProps> = ({ table, allOrders, onClose, onReleaseTable }) => {
    const currentOrder = allOrders.find(o => o.id === table.orderId);
    const pastOrders = allOrders
        .filter(o => o.tableId === table.id && o.id !== table.orderId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{table.name}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <XIcon className="h-6 w-6 text-gray-600" />
                    </button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    {/* Current Order Section */}
                    <section>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Pedido Atual</h3>
                        {currentOrder ? (
                            <div>
                                <OrderDetails order={currentOrder} />
                                <button 
                                    onClick={() => onReleaseTable(table.id)}
                                    className="w-full mt-4 bg-brand-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-transform duration-200 hover:scale-105"
                                >
                                    Finalizar e Liberar Mesa
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500">Não há pedido ativo para esta mesa.</p>
                        )}
                    </section>
                    
                    {/* Order History Section */}
                    {pastOrders.length > 0 && (
                        <section>
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">Histórico de Pedidos</h3>
                            <div className="space-y-4">
                                {pastOrders.map(order => (
                                    <OrderDetails key={order.id} order={order} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TableDetailsModal;
