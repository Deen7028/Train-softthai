'use client';

import React from 'react';
import { ManualProvider } from './manual/ManualContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ManualProvider>
            {children}
        </ManualProvider>
    );
}
