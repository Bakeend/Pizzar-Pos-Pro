
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { salesData } from '../../data/mockData';
import { Order, OrderStatus } from '../../types';
import { ProductsIcon, OrdersIcon, ReportsIcon } from '../icons';

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

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


const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
    const statusClasses = {
        [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800',
        [OrderStatus.Preparing]: 'bg-blue-100 text-blue-800',
        [OrderStatus.Ready]: 'bg-green-100 text-green-800',
        [OrderStatus.Delivering]: 'bg-purple-100 text-purple-800',
        [OrderStatus.Completed]: 'bg-gray-100 text-gray-800',
        [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
    };
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-3 text-sm text-gray-700">
                 <div className="flex items-center">
                    {isOrderOverdue(order) && (
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse" title="Pedido Atrasado"></span>
                    )}
                    <span>#{order.id}</span>
                </div>
            </td>
            <td className="p-3 text-sm text-gray-700">{order.customerName}</td>
            <td className="p-3 text-sm font-semibold text-gray-800">R${order.total.toFixed(2)}</td>
            <td className="p-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[order.status]}`}>
                    {order.status}
                </span>
            </td>
        </tr>
    );
};

interface DashboardProps {
    orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
    // FIX: Calculate sales and average ticket for "Today" to match the KPI card labels.
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const todaysCompletedOrders = orders.filter(
        (o) =>
        o.status === OrderStatus.Completed && new Date(o.createdAt) >= startOfToday
    );

    const totalSales = todaysCompletedOrders.reduce(
        (sum, o) => sum + o.total,
        0
    );
    const activeOrders = orders.filter(o => ![OrderStatus.Completed, OrderStatus.Cancelled].includes(o.status)).length;
    const ticketMedio = todaysCompletedOrders.length > 0 ? totalSales / todaysCompletedOrders.length : 0;

    return (
        <div className="p-4 lg:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <KpiCard title="Vendas Totais (Hoje)" value={`R$${totalSales.toFixed(2)}`} icon={<ReportsIcon className="h-6 w-6 text-white"/>} color="bg-green-500" />
                <KpiCard title="Pedidos Ativos" value={activeOrders.toString()} icon={<OrdersIcon className="h-6 w-6 text-white"/>} color="bg-blue-500" />
                <KpiCard title="Ticket Médio" value={`R$${ticketMedio.toFixed(2)}`} icon={<ProductsIcon className="h-6 w-6 text-white"/>} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Vendas da Semana</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E53935" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#E53935" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `R$${value/1000}k`} />
                                <Tooltip formatter={(value: number) => [`R$${value.toFixed(2)}`, "Vendas"]} />
                                <Area type="monotone" dataKey="Vendas" stroke="#E53935" fillOpacity={1} fill="url(#colorVendas)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Pedidos Recentes</h3>
                    <div className="overflow-auto max-h-80">
                         <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map(order => <OrderRow key={order.id} order={order} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
