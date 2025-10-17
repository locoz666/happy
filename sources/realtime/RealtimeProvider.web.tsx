import React from 'react';
import { RealtimeVoiceSession } from './RealtimeVoiceSession';
import { useRealtimeVoiceEnabled } from '@/sync/storage';

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
    const isVoiceEnabled = useRealtimeVoiceEnabled();

    return (
        <>
            {isVoiceEnabled ? <RealtimeVoiceSession /> : null}
            {children}
        </>
    );
};
