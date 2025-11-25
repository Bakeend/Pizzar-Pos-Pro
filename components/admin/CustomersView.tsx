
import React, { useState, useMemo } from 'react';
import { Customer, Order, OrderStatus } from '../../types';
import { EditIcon, TrashIcon, GridViewIcon, ListViewIcon, UsersIcon, CrownIcon } from '../icons';

interface CustomersViewProps {
    customers: Customer[];
    orders?: Order[]; // Made optional to prevent crashes
    onAddCustomer: () => void;
    onEditCustomer: (customer: Customer) => void;
    onDeleteCustomer: (id: number) => void;
}

// Helper to generate initials
const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

// Helper to generate a consistent color from string
const getColorFromName = (name: string) => {
    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 
        'bg-green-500', 'bg-teal-500', 'bg-blue-500', 
        'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
        'bg-rose-500', 'bg-cyan-500', 'bg-emerald-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const CustomerAvatar: React.FC<{ name: string; className?: string }> = ({ name, className = "h-12 w-12" }) => (
    <div className={`${className} rounded-full ${getColorFromName(name)} text-white flex items-center justify-center font-bold shadow-md ring-2 ring-white`}>
        {getInitials(name)}
    </div>
);

const CustomerStatCard: React.FC<{ title: string; value: string; icon?: React.ReactNode; trend?: string; trendType?: 'positive' | 'neutral' | 'negative' }> = ({ title, value, icon, trend, trendType = 'positive' }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-gray-500">{title}</span>
            {icon && <div className="text-gray-400 bg-gray-50 p-2 rounded-lg">{icon}</div>}
        </div>
        <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-800">{value}</span>
            {trend && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    trendType === 'positive' ? 'bg-green-100 text-green-700' : 
                    trendType === 'neutral' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                }`}>
                    {trend}
                </span>
            )}
        </div>
    </div>
);

const CustomersView: React.FC<CustomersViewProps> = ({ customers = [], orders = [], onAddCustomer, onEditCustomer, onDeleteCustomer }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name' | 'spent' | 'recent'>('recent');

    // Safe access to arrays
    const safeCustomers = customers || [];
    const safeOrders = orders || [];

    // CRM Logic: Calculate stats per customer
    const customerStats = useMemo(() => {
        return safeCustomers.map(customer => {
            const customerOrders = safeOrders.filter(o => 
                o.status === OrderStatus.Completed && 
                o.customerName.toLowerCase() === customer.name.toLowerCase()
            );
            
            const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
            const totalOrders = customerOrders.length;
            const lastOrderDate = customerOrders.length > 0 
                ? new Date(Math.max(...customerOrders.map(o => new Date(o.createdAt).getTime())))
                : null;
            
            // Calculate average ticket
            const avgTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;

            // Determine if active (order in last 30 days)
            const isActive = lastOrderDate && (new Date().getTime() - lastOrderDate.getTime()) < (30 * 24 * 60 * 60 * 1000);

            return {
                ...customer,
                totalSpent,
                totalOrders,
                lastOrderDate,
                avgTicket,
                isActive
            };
        });
    }, [safeCustomers, safeOrders]);

    // Filtering and Sorting
    const filteredCustomers = useMemo(() => {
        let result = customerStats.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm)
        );

        switch (sortBy) {
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'spent':
                result.sort((a, b) => b.totalSpent - a.totalSpent);
                break;
            case 'recent':
                result.sort((a, b) => {
                    if (!a.lastOrderDate) return 1;
                    if (!b.lastOrderDate) return -1;
                    return b.lastOrderDate.getTime() - a.lastOrderDate.getTime();
                });
                break;
        }
        return result;
    }, [customerStats, searchTerm, sortBy]);

    // KPI Calculations
    const totalRevenue = customerStats.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrdersCount = customerStats.reduce((sum, c) => sum + c.totalOrders, 0);
    const activeCustomers = customerStats.filter(c => c.isActive).length;
    const vipCustomers = customerStats.filter(c => c.totalSpent > 300).length;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-full">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Clientes</h2>
                        <p className="text-gray-500 mt-1">Gerencie relacionamentos e visualize métricas.</p>
                    </div>
                    <button 
                        onClick={onAddCustomer}
                        className="bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <UsersIcon className="h-5 w-5" />
                        <span>Novo Cliente</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CustomerStatCard 
                        title="Total de Clientes" 
                        value={safeCustomers.length.toString()} 
                        icon={<UsersIcon className="h-5 w-5"/>}
                    />
                    <CustomerStatCard 
                        title="Clientes Ativos (30d)" 
                        value={activeCustomers.toString()} 
                        trend={safeCustomers.length > 0 ? `${Math.round((activeCustomers/safeCustomers.length)*100)}%` : "0%"}
                        trendType={activeCustomers > 0 ? 'positive' : 'neutral'}
                    />
                    <CustomerStatCard 
                        title="Clientes VIP (>R$300)" 
                        value={vipCustomers.toString()} 
                        trend="Alta Fidelidade"
                        trendType="positive"
                    />
                     <CustomerStatCard 
                        title="Receita Acumulada" 
                        value={`R$${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`} 
                        trend={`${totalOrdersCount} pedidos`}
                        trendType="neutral"
                    />
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm transition-shadow"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="block w-full md:w-auto pl-3 pr-8 py-2.5 text-sm border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent rounded-lg cursor-pointer"
                    >
                        <option value="recent">📅 Recentes</option>
                        <option value="spent">💰 Maior Gasto</option>
                        <option value="name">🔤 Nome (A-Z)</option>
                    </select>

                    <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-white text-brand-red shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Visualização em Grade"
                        >
                            <GridViewIcon className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-brand-red shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Visualização em Lista"
                        >
                            <ListViewIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Customers List/Grid */}
            {filteredCustomers.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                        <UsersIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Nenhum cliente encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">Não encontramos resultados para sua busca. Tente limpar os filtros ou adicionar um novo cliente.</p>
                    <button onClick={() => setSearchTerm('')} className="mt-4 text-brand-red font-medium hover:underline">Limpar busca</button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCustomers.map(customer => (
                        <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative group overflow-hidden">
                            {customer.totalSpent > 300 && (
                                <div className="absolute top-0 left-0 bg-brand-yellow text-brand-dark text-[10px] font-bold px-3 py-1 rounded-br-lg shadow-sm z-10 flex items-center gap-1">
                                    <CrownIcon className="w-3 h-3" /> VIP
                                </div>
                            )}
                            
                            <div className="p-6 flex flex-col items-center text-center border-b border-gray-50">
                                <CustomerAvatar name={customer.name} className="h-16 w-16 mb-4 text-xl" />
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={customer.name}>{customer.name}</h3>
                                <p className="text-sm text-gray-500 mb-1 line-clamp-1" title={customer.email}>{customer.email}</p>
                                <p className="text-xs text-gray-400">{customer.phone}</p>
                            </div>
                            
                            <div className="p-4 grid grid-cols-2 gap-4 bg-gray-50/50 flex-grow">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Gasto</p>
                                    <p className="font-bold text-brand-green">R${customer.totalSpent.toFixed(0)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Pedidos</p>
                                    <p className="font-bold text-gray-700">{customer.totalOrders}</p>
                                </div>
                            </div>

                            <div className="p-3 bg-white border-t border-gray-100 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-0 left-0 right-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                <button onClick={() => onEditCustomer(customer)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">Editar</button>
                                <button onClick={() => onDeleteCustomer(customer.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contato</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Última Compra</th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Pedidos</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">LTV (Total)</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.map(customer => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <CustomerAvatar name={customer.name} className="h-10 w-10 text-sm" />
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{customer.name}</div>
                                                    {customer.totalSpent > 300 && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 gap-1">
                                                            <CrownIcon className="w-3 h-3" /> VIP
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.phone}</div>
                                            <div className="text-sm text-gray-500">{customer.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {customer.lastOrderDate ? customer.lastOrderDate.toLocaleDateString('pt-BR') : '-'}
                                            </div>
                                            {customer.lastOrderDate && (
                                                <div className="text-xs text-gray-400">
                                                    {Math.floor((new Date().getTime() - customer.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))} dias atrás
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {customer.totalOrders}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-bold text-brand-green">R${customer.totalSpent.toFixed(2)}</div>
                                            <div className="text-xs text-gray-400">Méd: R${customer.avgTicket.toFixed(0)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onEditCustomer(customer)} className="text-blue-600 hover:text-blue-900 transition-colors">
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => onDeleteCustomer(customer.id)} className="text-red-600 hover:text-red-900 transition-colors">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersView;
