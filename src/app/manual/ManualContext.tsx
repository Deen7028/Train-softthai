'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IManual } from '@/src/interfaces';

interface ManualContextType {
    manuals: IManual[];
    addManual: (manual: IManual) => void;
    updateManual: (id: string, manual: IManual) => void;
    deleteManual: (id: string) => void;
}

const ManualContext = createContext<ManualContextType | undefined>(undefined);

export const ManualProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [manuals, setManuals] = useState<IManual[]>([]);

    useEffect(() => {
        fetch('/api/manual')
            .then(res => res.json())
            .then(data => setManuals(data))
            .catch(console.error);
    }, []);

    const addManual = async (manual: IManual) => {
        const formData = new FormData();
        formData.append('title', manual.title ?? '');
        formData.append('system', manual.system ?? '');
        formData.append('status', manual.status ?? '');
        await fetch('/api/manual', { method: 'POST', body: formData });
        const res = await fetch('/api/manual');
        const data = await res.json();
        setManuals(data);
    };

    const updateManual = async (id: string, manual: IManual) => {
        const formData = new FormData();
        formData.append('title', manual.title ?? '');
        formData.append('system', manual.system ?? '');
        formData.append('status', manual.status ?? '');
        await fetch(`/api/manual/${id}`, { method: 'PUT', body: formData });
        const res = await fetch('/api/manual');
        const data = await res.json();
        setManuals(data);
    };

    const deleteManual = async (id: string) => {
        await fetch(`/api/manual/${id}`, { method: 'DELETE' });
        const res = await fetch('/api/manual');
        const data = await res.json();
        setManuals(data);
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
