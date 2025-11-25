
import React from 'react';
import { Table, TableStatus, AdminView } from '../../types';
import { TableIcon } from '../icons';

const TableCard: React.FC<{ table: Table; isSelected: boolean }> = ({ table, isSelected }) => {
    const statusClasses = {
        [TableStatus.Available]: 'bg-green-100 border-green-500 text-green-800',
        [TableStatus.Occupied]: 'bg-yellow-100 border-yellow-500 text-yellow-800',
        [TableStatus.NeedsAttention]: 'bg-red-100 border-red-500 text-red-800 animate-pulse',
    };
    
    const statusText = {
        [TableStatus.Available]: 'Disponível',
        [TableStatus.Occupied]: 'Ocupada',
        [TableStatus.NeedsAttention]: 'Atenção',
    }

    const selectionClass = isSelected ? 'ring-2 ring-brand-red ring-offset-2' : '';

    return (
        <div className={`p-4 rounded-lg border-l-4 shadow-sm h-full hover:shadow-lg transition-shadow duration-300 ${statusClasses[table.status]} ${selectionClass}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <TableIcon className="h-8 w-8 mr-3" />
                    <div>
                        <p className="font-bold text-lg">{table.name}</p>
                        <p className="text-xs">{table.capacity} lugares</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold">{statusText[table.status]}</p>
                    {table.orderId && <p className="text-xs">Pedido #{table.orderId}</p>}
                </div>
            </div>
        </div>
    );
};

interface TableViewProps {
    tables: Table[];
    setActiveView: (view: AdminView) => void;
    selectedTableId: number | null;
    setSelectedTableId: (id: number | null) => void;
    setViewingTableDetailsId: (id: number | null) => void;
}

const TableView: React.FC<TableViewProps> = ({ tables, setActiveView, selectedTableId, setSelectedTableId, setViewingTableDetailsId }) => {

    const handleTableClick = (table: Table) => {
        if (table.status === TableStatus.Available) {
            setSelectedTableId(selectedTableId === table.id ? null : table.id);
        } else {
            setViewingTableDetailsId(table.id);
        }
    };

    return (
        <div className="p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Gerenciamento de Mesas</h2>
                <button 
                    onClick={() => setActiveView(AdminView.POS)}
                    className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-400"
                    disabled={!selectedTableId}
                >
                    Nova Venda
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {tables.map(table => (
                    <div 
                        key={table.id} 
                        onClick={() => handleTableClick(table)}
                        className="cursor-pointer"
                    >
                        <TableCard table={table} isSelected={selectedTableId === table.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableView;
