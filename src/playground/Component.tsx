/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable rulesdir/prefer-actions-set-data */
/* eslint-disable rulesdir/prefer-onyx-connect-in-libs */
import Onyx, {withOnyx} from 'react-native-onyx';
import {createOnyxSelector} from 'react-native-onyx/lib/withOnyx';
import ONYXKEYS, {Account, Report} from '../ONYXKEYS';

type OnyxProps = {
    onyxPropWithStringKey: Account | null;
    onyxPropWithStringKeyAndFunctionSelector: string;
    onyxPropWithStringKeyAndStringSelector: string;

    onyxPropWithFunctionKey: Account | null;
    onyxPropWithFunctionKeyAndFunctionSelector: string;
    onyxPropWithFunctionKeyAndStringSelector: string;

    onyxPropWithStringCollectionKey: Report | null;
    onyxPropWithStringCollectionKeyAndFunctionSelector: boolean;
    onyxPropWithStringCollectionKeyAndStringSelector: boolean;

    onyxPropWithFunctionCollectionKey: Report | null;
    onyxPropWithFunctionCollectionKeyAndFunctionSelector: boolean;
    onyxPropWithFunctionCollectionKeyAndStringSelector: boolean;
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

            console.log(value.report1.id);
            console.log(value.report2.id);
        },
        waitForCollectionCallback: true,
        selector: 'data.isRead',
    });

    Onyx.disconnect(1000);
    Onyx.disconnect(1000, ONYXKEYS.COUNTRY_CODE);
    Onyx.disconnect(1000, `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`);
    // Onyx.disconnect(1000, 'wrong key'); // raises an error, wrong key - correct

    Onyx.set(ONYXKEYS.ACCOUNT, {id: 'account1'});
    Onyx.set(ONYXKEYS.IS_LOADING_PAYMENT_METHODS, true);
    Onyx.set(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, {url: 'download_url'});
    // Onyx.set(ONYXKEYS.ACCOUNT, 'wrong value'); // raises an error, wrong value - correct

    Onyx.multiSet({
        [ONYXKEYS.ACCOUNT]: {id: 'id2'},
        [ONYXKEYS.IS_LOADING_PAYMENT_METHODS]: false,
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
        safeEvictionKeys: [ONYXKEYS.ACCOUNT],
    });

    Onyx.registerLogger(({level, message}) => {});

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
        // selector: createOnyxSelector<typeof ONYXKEYS.ACCOUNT, OnyxProps['onyxPropWithStringKeyAndFunctionSelector']>((value) => value?.id ?? ''),
    },
    onyxPropWithStringKeyAndStringSelector: {
        key: ONYXKEYS.ACCOUNT,
        // key: ONYXKEYS.IS_LOADING_PAYMENT_METHODS, // don't raises an error - correct
        selector: 'id',
    },

    onyxPropWithFunctionKey: {
        key: ({reportId}) => ONYXKEYS.ACCOUNT,
        // key: ({reportId}) => ONYXKEYS.IS_LOADING_PAYMENT_METHODS, // raises an error - correct
    },
    onyxPropWithFunctionKeyAndFunctionSelector: {
        key: ({reportId}) => ONYXKEYS.ACCOUNT,
        // key: ({reportId}) => ONYXKEYS.IS_LOADING_PAYMENT_METHODS, // raises an error - correct
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        // selector: createOnyxSelector<typeof ONYXKEYS.ACCOUNT, OnyxProps['onyxPropWithFunctionKeyAndFunctionSelector']>((value) => value?.id ?? ''),
        selector: (value: Account | null) => value?.id ?? '',
        // selector: (value: Report | null) => value?.id ?? '', // raises an error - correct
    },
    onyxPropWithFunctionKeyAndStringSelector: {
        key: ({reportId}) => ONYXKEYS.ACCOUNT,
        // key: ({reportId}) => ONYXKEYS.IS_LOADING_PAYMENT_METHODS, // don't raises an error - correct
        selector: 'id',
    },

    onyxPropWithStringCollectionKey: {
        key: ONYXKEYS.COLLECTION.REPORT,
        // key: `${ONYXKEYS.COLLECTION.DOWNLOAD}${`report1`}`, // raises an error - correct
    },
    onyxPropWithStringCollectionKeyAndFunctionSelector: {
        key: `${ONYXKEYS.COLLECTION.REPORT}${`report1`}`,
        // selector: createOnyxSelector<typeof ONYXKEYS.COLLECTION.REPORT, OnyxProps['onyxPropWithStringCollectionKeyAndFunctionSelector']>((value) => value?.isArchived ?? false),
        selector: (value: Report | null) => value?.isArchived ?? false,
        // selector: (value: Account | null) => false, // FIXME: don't raises an error - incorrect
    },
    onyxPropWithStringCollectionKeyAndStringSelector: {
        key: `${ONYXKEYS.COLLECTION.REPORT}${`report1`}`,
        // key: `${ONYXKEYS.COLLECTION.DOWNLOAD}${`report1`}`, // don't raises an error - correct
        selector: 'isArchived',
    },

    onyxPropWithFunctionCollectionKey: {
        key: ({reportId}) => `${ONYXKEYS.COLLECTION.REPORT}${reportId}`,
        // key: ({reportId}) => `${ONYXKEYS.COLLECTION.DOWNLOAD}${reportId}`, // raises an error - correct
    },
    onyxPropWithFunctionCollectionKeyAndFunctionSelector: {
        key: ({reportId}) => `${ONYXKEYS.COLLECTION.REPORT}${reportId}`,
        selector: createOnyxSelector<typeof ONYXKEYS.COLLECTION.REPORT, OnyxProps['onyxPropWithStringCollectionKeyAndFunctionSelector']>((value) => value?.isArchived ?? false),
        // selector: (value: Report | null) => value?.isArchived ?? false,
        // selector: (value: Account | null) => false, // FIXME: don't raises an error - incorrect
    },
    onyxPropWithFunctionCollectionKeyAndStringSelector: {
        key: ({reportId}) => `${ONYXKEYS.COLLECTION.REPORT}${reportId}`,
        // key: ({reportId}) => `${ONYXKEYS.COLLECTION.REPORT}${reportId}`, // don't raises an error - correct
        selector: 'isArchived',
    },
})(Component);
