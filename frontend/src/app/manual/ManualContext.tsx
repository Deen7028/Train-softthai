'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IManual } from '@/src/interfaces';
import { ManualStatus } from '@/src/enum';

interface ManualContextType {
    manuals: IManual[];
    addManual: (manual: IManual) => void;
    updateManual: (id: string, manual: IManual) => void;
    deleteManual: (id: string) => void;
}

const ManualContext = createContext<ManualContextType | undefined>(undefined);

export const ManualProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [manuals, setManuals] = useState<IManual[]>([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5124/api';
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`${apiUrl}/manual`);
                const result = await res.json();
                
                const mappedData: IManual[] = (result as IManual[]).map((item) => ({
                    ...item,
                    id: item.id?.toString() || "",
                    status: item.status === (ManualStatus.ACTIVE as string) ? ManualStatus.ACTIVE : ManualStatus.INACTIVE,
                    updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
                }));
                
                setManuals(mappedData);
            } catch (error) {
                console.error("Fetch manuals error:", error);
            }
        };
        loadData();
    }, [apiUrl]);

    const addManual = async (manual: IManual) => {
        const formData = new FormData();
        formData.append('title', manual.manualName ?? '');
        formData.append('system', manual.systemName ?? '');
        formData.append('status', manual.status ?? '');
        await fetch(`${apiUrl}/manual`, { method: 'POST', body: formData });
        const res = await fetch(`${apiUrl}/manual`);
        const data = await res.json();
        setManuals(data);
    };

    const updateManual = async (id: string, manual: IManual) => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('title', manual.manualName ?? '');
        formData.append('system', manual.systemName ?? '');
        formData.append('status', manual.status ?? '');
        await fetch(`${apiUrl}/manual`, { method: 'POST', body: formData });
        const res = await fetch(`${apiUrl}/manual`);
        const data = await res.json();
        setManuals(data);
    };

    const deleteManual = async (id: string) => {
        await fetch(`${apiUrl}/manual/${id}`, { method: 'DELETE' });
        const res = await fetch(`${apiUrl}/manual`);
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
