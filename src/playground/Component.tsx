/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable rulesdir/prefer-actions-set-data */
/* eslint-disable rulesdir/prefer-onyx-connect-in-libs */
import Onyx, {withOnyx} from 'react-native-onyx';
import ONYXKEYS, {Account, Report} from '../ONYXKEYS';

type OnyxProps = {
    onyxPropWithStringKey: Account | null;
    onyxPropWithStringKeyAndFunctionSelector: string;

    onyxPropWithFunctionKey: Account | null;
    onyxPropWithFunctionKeyAndFunctionSelector: string;

    onyxPropWithStringCollectionKey: Record<string, Report | null> | null;
    onyxPropWithStringCollectionKeyAndFunctionSelector: boolean;

    onyxPropWithStringCollectionRecordKey: Report | null;
    onyxPropWithStringCollectionRecordKeyAndFunctionSelector: boolean;

    onyxPropWithFunctionCollectionKey: Record<string, Report | null> | null;
    onyxPropWithFunctionCollectionKeyAndFunctionSelector: boolean;

    onyxPropWithFunctionCollectionRecordKey: Report | null;
    onyxPropWithFunctionCollectionRecordKeyAndFunctionSelector: boolean;
};

type Props = OnyxProps & {
    reportId: string;
    prop2?: number;
};

function Component({reportId, prop2 = true}: Props) {
    const keys = Onyx.getAllKeys();

    const isSafeEvictionKey = Onyx.isSafeEvictionKey(ONYXKEYS.ACCOUNT);
    const isSafeEvictionCollectionKey = Onyx.isSafeEvictionKey(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`);
    // const isSafeEvictionWrongKey = Onyx.isSafeEvictionKey('wrong key'); // raises an error, wrong key - correct

    Onyx.removeFromEvictionBlockList(ONYXKEYS.ACTIVE_CLIENTS, 1);
    Onyx.removeFromEvictionBlockList(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, 1);
    // Onyx.removeFromEvictionBlockList('wrong key', 1); // raises an error, wrong key - correct

    Onyx.addToEvictionBlockList(ONYXKEYS.ACTIVE_CLIENTS, 2);
    Onyx.addToEvictionBlockList(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, 2);
    // Onyx.addToEvictionBlockList('wrong key', 1); // raises an error, wrong key - correct

    Onyx.connect({
        key: ONYXKEYS.ACCOUNT,
        callback: (value) => {
            if (!value) {
                return;
            }

            console.log(value.id);
        },
        selector: (value) => ({id: value?.id ?? 'id1'}),
    });

    Onyx.connect({
        key: `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`,
        callback: (value) => {
            if (!value) {
                return;
            }

            console.log(value.url);
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        selector: (value) => value,
    });

    Onyx.connect({
        key: ONYXKEYS.COLLECTION.REPORT,
        callback: (value) => {
            if (!value) {
                return;
            }

            console.log(value.report1?.id);
            console.log(value.report2?.id);
        },
        waitForCollectionCallback: true,
    });

    Onyx.disconnect(1000);
    Onyx.disconnect(1000, ONYXKEYS.COUNTRY_CODE);
    Onyx.disconnect(1000, `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`);
    // Onyx.disconnect(1000, 'wrong key'); // raises an error, wrong key - correct

    Onyx.set(ONYXKEYS.ACCOUNT, {id: 'account1'});
    Onyx.set(ONYXKEYS.IS_LOADING_PAYMENT_METHODS, true);
    Onyx.set(ONYXKEYS.NVP_PREFERRED_LOCALE, null);
    Onyx.set(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, {url: 'download_url'});
    // Onyx.set(ONYXKEYS.ACCOUNT, 'wrong value'); // raises an error, wrong value - correct

    Onyx.multiSet({
        [ONYXKEYS.ACCOUNT]: {id: 'id2'},
        [ONYXKEYS.NVP_PREFERRED_LOCALE]: null,
        [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}` as const]: {url: 'download_url'},
        [`${ONYXKEYS.COLLECTION.REPORT}${'report1'}` as const]: {id: 'download_url', isArchived: false, data: {message: 'message1'}},
        // [ONYXKEYS.NVP_PREFERRED_LOCALE]: 1, // raises an error, wrong value - correct
    });

    Onyx.merge(ONYXKEYS.ACCOUNT, {name: 'user name'});
    Onyx.merge(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, {});
    Onyx.merge(`${ONYXKEYS.COLLECTION.REPORT}${'report'}`, {data: {isRead: true}});
    // Onyx.merge(ONYXKEYS.ACCOUNT, 'something'); // raises an error, wrong value - correct

    Onyx.clear();
    Onyx.clear([ONYXKEYS.ACCOUNT, ONYXKEYS.ACTIVE_CLIENTS, `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`]);
    // Onyx.clear(['wrong key']); // raises an error, wrong key - correct

    Onyx.mergeCollection(ONYXKEYS.COLLECTION.DOWNLOAD, {
        [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}` as const]: {url: 'download_url'},
        [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment3'}` as const]: {url: 'download_url3'},
        // [`${ONYXKEYS.COLLECTION.REPORT}${'report1'}` as const]: {id: 'account'}, // raises an error, wrong key - correct
        // [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment2'}` as const]: false, // raises an error, wrong value - correct
    });

    Onyx.mergeCollection(ONYXKEYS.COLLECTION.REPORT, {
        [`${ONYXKEYS.COLLECTION.REPORT}${'report1'}` as const]: {data: {isRead: true}},
    });

    // Onyx.mergeCollection(ONYXKEYS.ACCOUNT, {
    //     [`${ONYXKEYS.ACCOUNT}${'report1'}` as const]: {id: 'account'},
    // });  // raises an error, not a collection - correct

    Onyx.update([
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: ONYXKEYS.ACCOUNT,
            value: {id: 'id1'},
        },
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: ONYXKEYS.IS_LOADING_PAYMENT_METHODS,
            value: false,
        },
        {
            onyxMethod: Onyx.METHOD.SET,
            key: ONYXKEYS.IS_LOADING_PAYMENT_METHODS,
            value: null,
        },
        // {
        //     onyxMethod: Onyx.METHOD.MERGE,
        //     key: ONYXKEYS.IS_LOADING_PAYMENT_METHODS,
        //     value: {id: 'id1'}, // raises an error - correct
        // },
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`,
            value: {url: 'url1'},
        },
        {
            onyxMethod: Onyx.METHOD.SET,
            key: `${ONYXKEYS.COLLECTION.REPORT}${'report1'}`,
            value: {id: 'id1', isArchived: false, data: {message: 'message1'}},
        },
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: `${ONYXKEYS.COLLECTION.REPORT}${'report2'}`,
            value: {data: {isRead: true}},
        },
        // {
        //     onyxMethod: Onyx.METHOD.MERGE_COLLECTION,
        //     key: ONYXKEYS.ACCOUNT,
        //     value: {},
        // }, // raises an error - correct
        {
            onyxMethod: Onyx.METHOD.MERGE_COLLECTION,
            key: ONYXKEYS.COLLECTION.REPORT,
            value: {
                [`${ONYXKEYS.COLLECTION.REPORT}${'report1'}` as const]: {data: {isRead: true}},
                [`${ONYXKEYS.COLLECTION.REPORT}${'report2'}` as const]: {data: {isRead: false}},
                // [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'report2'}` as const]: {data: {isRead: false}}, // raises an error - correct
            },
        },
    ]);

    Onyx.init({
        keys: ONYXKEYS,
        initialKeyStates: {
            [ONYXKEYS.ACCOUNT]: {id: 'id1'},
            [ONYXKEYS.IS_LOADING_PAYMENT_METHODS]: false,
            [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}` as const]: {url: 'download_url'},
            // [ONYXKEYS.IS_LOADING_PAYMENT_METHODS]: 'wrong value', // raises an error, wrong value - correct
        },
        safeEvictionKeys: [ONYXKEYS.ACCOUNT, `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`],
    });

    Onyx.registerLogger(({level, message}) => {});

    Onyx.hasPendingMergeForKey(ONYXKEYS.ACCOUNT);

    Onyx.setMemoryOnlyKeys([ONYXKEYS.ACCOUNT, ONYXKEYS.COLLECTION.DOWNLOAD, `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`]);

    return null;
}

export default withOnyx<Props, OnyxProps>({
    onyxPropWithStringKey: {
        key: ONYXKEYS.ACCOUNT,
        // key: ONYXKEYS.IS_LOADING_PAYMENT_METHODS, // raises an error - correct
    },
    onyxPropWithStringKeyAndFunctionSelector: {
        key: ONYXKEYS.ACCOUNT,
        selector: (value: Account | null): string => value?.id ?? '',
    },

    onyxPropWithFunctionKey: {
        key: ({reportId}) => ONYXKEYS.ACCOUNT,
        // key: ({reportId}) => ONYXKEYS.IS_LOADING_PAYMENT_METHODS, // raises an error - correct
    },
    onyxPropWithFunctionKeyAndFunctionSelector: {
        key: ({reportId}) => ONYXKEYS.ACCOUNT,
        // key: ({reportId}) => ONYXKEYS.IS_LOADING_PAYMENT_METHODS, // raises an error - correct
        selector: (value: Account | null) => value?.id ?? '',
        // selector: (value: Report | null) => value?.id ?? '', // raises an error - correct
    },

    onyxPropWithStringCollectionKey: {
        key: ONYXKEYS.COLLECTION.REPORT,
        // key: ONYXKEYS.COLLECTION.DOWNLOAD, // raises an error - correct
    },
    onyxPropWithStringCollectionKeyAndFunctionSelector: {
        key: ONYXKEYS.COLLECTION.REPORT,
        selector: (value: Report | null) => true,
        // selector: (value: Account | null) => false, // FIXME: don't raises an error - incorrect
    },

    onyxPropWithStringCollectionRecordKey: {
        key: `${ONYXKEYS.COLLECTION.REPORT}${`report1`}`,
        // key: `${ONYXKEYS.COLLECTION.DOWNLOAD}${`report1`}`, // raises an error - correct
    },
    onyxPropWithStringCollectionRecordKeyAndFunctionSelector: {
        key: `${ONYXKEYS.COLLECTION.REPORT}${`report1`}`,
        selector: (value: Report | null) => value?.isArchived ?? false,
        // selector: (value: Account | null) => false, // FIXME: don't raises an error - incorrect
    },

    onyxPropWithFunctionCollectionKey: {
        key: ({reportId}) => ONYXKEYS.COLLECTION.REPORT,
        // key: ({reportId}) => ONYXKEYS.COLLECTION.REPORT, // raises an error - correct
    },
    onyxPropWithFunctionCollectionKeyAndFunctionSelector: {
        key: ({reportId}) => ONYXKEYS.COLLECTION.REPORT,
        selector: (value: Report | null) => value?.isArchived ?? false,
        // selector: (value: Account | null) => false, // FIXME: don't raises an error - incorrect
    },

    onyxPropWithFunctionCollectionRecordKey: {
        key: ({reportId}) => `${ONYXKEYS.COLLECTION.REPORT}${reportId}`,
        // key: ({reportId}) => `${ONYXKEYS.COLLECTION.DOWNLOAD}${reportId}`, // raises an error - correct
    },
    onyxPropWithFunctionCollectionRecordKeyAndFunctionSelector: {
        key: ({reportId}) => `${ONYXKEYS.COLLECTION.REPORT}${reportId}`,
        selector: (value: Report | null) => value?.isArchived ?? false,
        // selector: (value: Account | null) => false, // FIXME: don't raises an error - incorrect
    },
})(Component);
