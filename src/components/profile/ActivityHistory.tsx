import React from 'react';
import { History, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

interface ActivityRecord {
  id: string;
  type: 'points' | 'reward' | 'emotion' | 'report';
  description: string;
  date: string;
  amount?: string;
  status?: string;
}

interface ActivityHistoryProps {
  records: ActivityRecord[];
  expanded: boolean;
  onToggle: () => void;
}

export function ActivityHistory({ records, expanded, onToggle }: ActivityHistoryProps) {
  return (
    <div>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <History className="w-5 h-5 text-gray-500 mr-3" />
          <span className="text-gray-700">Historial de Actividad</span>
        </div>
        <ChevronDown className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </Button>
      
      {expanded && (
        <div className="mt-4 space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{record.description}</p>
                  <p className="text-sm text-gray-500">{record.date}</p>
                </div>
                {record.amount && (
                  <span className={`font-medium ${
                    record.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {record.amount}
                  </span>
                )}
                {record.status && (
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    record.status === 'Resuelto' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {record.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}