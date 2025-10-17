import React from 'react';
import { ElevenLabsProvider } from "@elevenlabs/react-native";
import { RealtimeVoiceSession } from './RealtimeVoiceSession';
import { useRealtimeVoiceEnabled } from '@/sync/storage';

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
    const isVoiceEnabled = useRealtimeVoiceEnabled();

    return (
        <>
            {isVoiceEnabled ? (
                <ElevenLabsProvider>
                    <RealtimeVoiceSession />
                </ElevenLabsProvider>
            ) : null}
            {children}
        </>
    );
};
