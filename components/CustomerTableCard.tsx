
import React from 'react';
import { Table, TableStatus } from '../types';
import { TableIcon } from './icons';

interface CustomerTableCardProps {
    table: Table;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

const CustomerTableCard: React.FC<CustomerTableCardProps> = ({ table, isSelected, onSelect }) => {
    const isAvailable = table.status === TableStatus.Available;

    const statusClasses = {
        [TableStatus.Available]: 'bg-green-100 border-green-500 text-green-800 hover:bg-green-200 cursor-pointer',
        [TableStatus.Occupied]: 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed',
        [TableStatus.NeedsAttention]: 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed',
    };
    
    const statusText = {
        [TableStatus.Available]: 'Disponível',
        [TableStatus.Occupied]: 'Ocupada',
        [TableStatus.NeedsAttention]: 'Ocupada',
    }

    const selectionClass = isSelected ? 'ring-2 ring-brand-red ring-offset-2' : '';

    const handleClick = () => {
        if (isAvailable) {
            onSelect(table.id);
        }
    };

    return (
        <div 
            onClick={handleClick}
            className={`p-4 rounded-lg border-l-4 shadow-sm h-full transition-all duration-300 ${statusClasses[table.status]} ${selectionClass}`}
            aria-label={`Mesa ${table.name}, ${table.capacity} lugares, status ${statusText[table.status]}`}
            role="button"
            tabIndex={isAvailable ? 0 : -1}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        >
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
                </div>
            </div>
        </div>
    );
};

export default CustomerTableCard;
