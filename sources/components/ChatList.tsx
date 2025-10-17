import * as React from 'react';
import { useSession, useSessionMessages } from "@/sync/storage";
import { ActivityIndicator, FlatList, Platform, View } from 'react-native';
import { useCallback } from 'react';
import { useHeaderHeight } from '@/utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageView } from './MessageView';
import { Metadata, Session } from '@/sync/storageTypes';
import { ChatFooter } from './ChatFooter';
import { Message } from '@/sync/typesMessage';
import { sync } from '@/sync/sync';

export const ChatList = React.memo((props: { session: Session }) => {
    const { messages, hasMore, isLoaded, isLoadingOlder } = useSessionMessages(props.session.id);
    return (
        <ChatListInternal
            metadata={props.session.metadata}
            sessionId={props.session.id}
            messages={messages}
            hasMore={hasMore}
            isLoaded={isLoaded}
            isLoadingOlder={isLoadingOlder}
        />
    )
});

const ListHeader = React.memo(() => {
    const headerHeight = useHeaderHeight();
    const safeArea = useSafeAreaInsets();
    return <View style={{ flexDirection: 'row', alignItems: 'center', height: headerHeight + safeArea.top + 32 }} />;
});

const ListFooter = React.memo((props: { sessionId: string }) => {
    const session = useSession(props.sessionId)!;
    return (
        <ChatFooter controlledByUser={session.agentState?.controlledByUser || false} />
    )
});

const ListHeaderWithLoader = React.memo((props: { isLoadingOlder: boolean }) => (
    <View>
        {props.isLoadingOlder && (
            <View style={{ paddingVertical: 12 }}>
                <ActivityIndicator size="small" />
            </View>
        )}
        <ListHeader />
    </View>
));

const ChatListInternal = React.memo((props: {
    metadata: Metadata | null,
    sessionId: string,
    messages: Message[],
    hasMore: boolean,
    isLoaded: boolean,
    isLoadingOlder: boolean,
}) => {
    const keyExtractor = useCallback((item: any) => item.id, []);
    const renderItem = useCallback(({ item }: { item: any }) => (
        <MessageView message={item} metadata={props.metadata} sessionId={props.sessionId} />
    ), [props.metadata, props.sessionId]);

    const handleEndReached = useCallback(() => {
        if (!props.isLoaded || !props.hasMore || props.isLoadingOlder) {
            return;
        }
        sync.loadOlderMessages(props.sessionId);
    }, [props.hasMore, props.isLoaded, props.isLoadingOlder, props.sessionId]);

    return (
        <FlatList
            data={props.messages}
            inverted={true}
            keyExtractor={keyExtractor}
            maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
            renderItem={renderItem}
            ListHeaderComponent={<ListFooter sessionId={props.sessionId} />}
            ListFooterComponent={<ListHeaderWithLoader isLoadingOlder={props.isLoadingOlder} />}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
        />
    )
});
