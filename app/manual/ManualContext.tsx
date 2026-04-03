'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IManual } from '@/interfaces';
import { MOCK_MANUALS } from './mock';

interface ManualContextType {
    manuals: IManual[];
    addManual: (manual: IManual) => void;
    updateManual: (id: string, manual: IManual) => void;
    deleteManual: (id: string) => void;
}

const ManualContext = createContext<ManualContextType | undefined>(undefined);

export const ManualProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [manuals, setManuals] = useState<IManual[]>(MOCK_MANUALS);

    const addManual = (manual: IManual) => {
        const newManual = {
            ...manual,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
        };
        setManuals([...manuals, newManual]);
    };

    const updateManual = (id: string, manual: IManual) => {
        setManuals(manuals.map((m) => (m.id === id ? { ...manual, id } : m)));
    };

    const deleteManual = (id: string) => {
        setManuals(manuals.filter((m) => m.id !== id));
    };

    return (
        <ManualContext.Provider value={{ manuals, addManual, updateManual, deleteManual }}>
            {children}
        </ManualContext.Provider>
    );
};

export const useManualContext = () => {
    const context = useContext(ManualContext);
    if (!context) {
        throw new Error('useManualContext must be used within ManualProvider');
    }
    return context;
};
