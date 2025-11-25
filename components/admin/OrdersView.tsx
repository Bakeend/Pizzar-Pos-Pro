
import React, { useState } from 'react';
import { Order, Table, OrderStatus, OrderType, CartItem, MenuItem } from '../../types';
import { ChevronDownIcon } from '../icons';

const getStatusClasses = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Pending: return 'bg-yellow-100 text-yellow-800';
        case OrderStatus.Preparing: return 'bg-blue-100 text-blue-800';
        case OrderStatus.Ready: return 'bg-green-100 text-green-800';
        case OrderStatus.Delivering: return 'bg-purple-100 text-purple-800';
        case OrderStatus.Completed: return 'bg-gray-200 text-gray-800';
        case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getOrderTypeLabel = (type: OrderType) => {
    switch (type) {
        case OrderType.DineIn: return 'Mesa';
        case OrderType.Delivery: return 'Delivery';
        case OrderType.Takeout: return 'Balcão';
        default: return 'N/A';
    }
}

// Helper function to calculate the price of a single customized item
const calculateCartItemPrice = (cartItem: CartItem): number => {
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

// Helper function to check if an order is overdue
const isOrderOverdue = (order: Order): boolean => {
    if (order.status !== OrderStatus.Preparing || !order.startedPreparingAt) {
        return false;
    }
    const totalPrepTime = order.items.reduce((sum, item) => sum + (item.item.preparationTime || 0) * item.quantity, 0); // in minutes
    const startTime = new Date(order.startedPreparingAt);
    const elapsedTime = (new Date().getTime() - startTime.getTime()) / (1000 * 60); // in minutes
    return elapsedTime > totalPrepTime;
};


interface OrdersViewProps {
    orders: Order[];
    tables: Table[];
}

const OrdersView: React.FC<OrdersViewProps> = ({ orders, tables }) => {
    const [filter, setFilter] = useState<'all' | 'takeout' | number>('all');
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'takeout') return order.type === OrderType.Takeout;
        return order.tableId === filter;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const toggleExpand = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Histórico de Pedidos</h2>
                <div className="flex items-center gap-2">
                    <label htmlFor="table-filter" className="text-sm font-medium text-gray-700">Filtrar por:</label>
                    <select
                        id="table-filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value === 'all' || e.target.value === 'takeout' ? e.target.value : Number(e.target.value))}
                        className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm rounded-md shadow-sm"
                    >
                        <option value="all">Todos os Pedidos</option>
                        <option value="takeout">Vendas Balcão</option>
                        <optgroup label="Mesas">
                            {tables.map(table => (
                                <option key={table.id} value={table.id}>{table.name}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>
            </header>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente/Mesa</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Detalhes</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map(order => (
                            <React.Fragment key={order.id}>
                                <tr onClick={() => toggleExpand(order.id)} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center">
                                            {isOrderOverdue(order) && (
                                                <span className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse" title="Pedido Atrasado"></span>
                                            )}
                                            <span>#{order.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getOrderTypeLabel(order.type)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">R${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedOrderId === order.id ? 'transform rotate-180' : ''}`} />
                                    </td>
                                </tr>
                                {expandedOrderId === order.id && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={7} className="px-6 py-4">
                                            <div className="p-2">
                                                <h4 className="font-semibold text-sm mb-2 text-gray-700">Itens do Pedido:</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    {order.items.map((cartItem, index) => {
                                                        const itemPrice = calculateCartItemPrice(cartItem);
                                                        const itemName = cartItem.customization ? formatFlavors(cartItem.customization.flavors) : cartItem.item.name;
                                                        return (
                                                            <li key={index}>
                                                                {cartItem.quantity}x {itemName} - <span className="font-medium">R${(itemPrice * cartItem.quantity).toFixed(2)}</span>
                                                                <span className="text-xs text-gray-400 ml-2">({cartItem.item.preparationTime} min)</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                         {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-gray-500">
                                    Nenhum pedido encontrado para o filtro selecionado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersView;
