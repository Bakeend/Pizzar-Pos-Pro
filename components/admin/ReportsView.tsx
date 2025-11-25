
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Order, OrderStatus, OrderType } from '../../types';
import { ReportsIcon, OrdersIcon, ProductsIcon, FileTextIcon, FileSpreadsheetIcon } from '../icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

const getOrderTypeLabel = (type: OrderType) => {
    switch (type) {
        case OrderType.DineIn: return 'Mesa';
        case OrderType.Delivery: return 'Delivery';
        case OrderType.Takeout: return 'Balcão';
        default: return 'N/A';
    }
}

const ReportsView: React.FC<{ orders: Order[] }> = ({ orders }) => {
    type Period = '7d' | '30d' | 'all';
    const [period, setPeriod] = useState<Period>('7d');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = useMemo(() => {
        const now = new Date();
        const completedOrders = orders.filter(o => o.status === OrderStatus.Completed);
        
        const ordersInPeriod = completedOrders.filter(order => {
            const orderDate = new Date(order.createdAt);
            if (period === 'all') return true;
            const days = period === '7d' ? 7 : 30;
            // Set hours to 0 to compare dates only
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfOrderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
            const diffTime = startOfToday.getTime() - startOfOrderDay.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays < days;
        });

        const sortedOrders = ordersInPeriod.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (!searchTerm) return sortedOrders;

        return sortedOrders.filter(order =>
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm)
        );

    }, [orders, period, searchTerm]);

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const chartData = useMemo(() => {
        const dataMap = new Map<string, { name: string; Faturamento: number; date: Date }>();
        filteredOrders.forEach(order => {
            const orderDate = new Date(order.createdAt)
            const dateKey = orderDate.toISOString().split('T')[0];
            const formattedDate = orderDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            
            if (!dataMap.has(dateKey)) {
                dataMap.set(dateKey, { name: formattedDate, Faturamento: 0, date: orderDate });
            }
            dataMap.get(dateKey)!.Faturamento += order.total;
        });
        
        return Array.from(dataMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());

    }, [filteredOrders]);


    const PeriodButton: React.FC<{ value: Period; label: string }> = ({ value, label }) => (
        <button
          onClick={() => setPeriod(value)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              period === value ? 'bg-brand-red text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          {label}
        </button>
    );

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Title and Header
        doc.setFontSize(18);
        doc.setTextColor(229, 57, 53); // Brand Red
        doc.text("Relatório de Vendas - Pizza POS Pro", 14, 22);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Período: ${period === '7d' ? 'Últimos 7 dias' : period === '30d' ? 'Últimos 30 dias' : 'Todo o período'}`, 14, 30);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 36);

        // Summary Stats
        doc.setDrawColor(200);
        doc.line(14, 42, 196, 42);
        
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Faturamento: R$ ${totalRevenue.toFixed(2)}`, 14, 52);
        doc.text(`Pedidos: ${totalOrders}`, 80, 52);
        doc.text(`Ticket Médio: R$ ${averageTicket.toFixed(2)}`, 140, 52);
        
        doc.line(14, 58, 196, 58);

        // Table
        const tableColumn = ["ID", "Data", "Cliente", "Tipo", "Total (R$)"];
        const tableRows: any[] = [];

        filteredOrders.forEach(order => {
            const orderData = [
                order.id,
                new Date(order.createdAt).toLocaleDateString('pt-BR'),
                order.customerName,
                getOrderTypeLabel(order.type),
                order.total.toFixed(2)
            ];
            tableRows.push(orderData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 65,
            theme: 'grid',
            headStyles: { fillColor: [229, 57, 53] }, // Brand Red
            styles: { fontSize: 10, cellPadding: 3 },
        });

        doc.save(`relatorio_vendas_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const exportToExcel = () => {
        const worksheetData = filteredOrders.map(order => ({
            "ID": order.id,
            "Data": new Date(order.createdAt).toLocaleDateString('pt-BR'),
            "Hora": new Date(order.createdAt).toLocaleTimeString('pt-BR'),
            "Cliente": order.customerName,
            "Tipo": getOrderTypeLabel(order.type),
            "Total": order.total,
            "Itens": order.items.length
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Vendas");

        // Adjust column widths
        const wscols = [
            { wch: 10 }, // ID
            { wch: 12 }, // Data
            { wch: 10 }, // Hora
            { wch: 30 }, // Cliente
            { wch: 15 }, // Tipo
            { wch: 12 }, // Total
            { wch: 8 },  // Itens
        ];
        worksheet['!cols'] = wscols;

        XLSX.writeFile(workbook, `relatorio_vendas_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-full">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Relatórios de Vendas</h2>
                    <p className="text-gray-500 text-sm mt-1">Analise o desempenho e exporte dados.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                     <div className="flex items-center space-x-2 bg-white border rounded-lg p-1 shadow-sm">
                        <PeriodButton value="7d" label="7 Dias" />
                        <PeriodButton value="30d" label="30 Dias" />
                        <PeriodButton value="all" label="Tudo" />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={exportToPDF}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors text-sm"
                            title="Exportar PDF"
                        >
                            <FileTextIcon className="w-4 h-4" /> PDF
                        </button>
                        <button 
                            onClick={exportToExcel}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors text-sm"
                            title="Exportar Excel"
                        >
                            <FileSpreadsheetIcon className="w-4 h-4" /> Excel
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <KpiCard title="Faturamento Total" value={`R$${totalRevenue.toFixed(2)}`} icon={<ReportsIcon className="h-6 w-6 text-white"/>} color="bg-green-500" />
                 <KpiCard title="Pedidos Concluídos" value={totalOrders.toString()} icon={<OrdersIcon className="h-6 w-6 text-white"/>} color="bg-blue-500" />
                 <KpiCard title="Ticket Médio" value={`R$${averageTicket.toFixed(2)}`} icon={<ProductsIcon className="h-6 w-6 text-white"/>} color="bg-yellow-500" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Evolução do Faturamento</h3>
                 <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ dy: 10 }} />
                             <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `R$${value}`} />
                             <Tooltip 
                                cursor={{fill: 'rgba(229, 57, 53, 0.1)'}}
                                contentStyle={{ borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                                formatter={(value: number) => [`R$${value.toFixed(2)}`, "Faturamento"]} />
                             <Bar dataKey="Faturamento" fill="#E53935" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold text-gray-700">Histórico de Pedidos Concluídos</h3>
                    <input 
                        type="text"
                        placeholder="Buscar por ID ou cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full sm:w-64 pl-3 pr-3 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                       <thead className="bg-gray-50">
                           <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                           </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                          {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getOrderTypeLabel(order.type)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">R${order.total.toFixed(2)}</td>
                            </tr>
                          ))}
                           {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        Nenhum pedido concluído encontrado para o período e filtro selecionados.
                                    </td>
                                </tr>
                            )}
                       </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
