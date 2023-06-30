/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable rulesdir/prefer-actions-set-data */
/* eslint-disable rulesdir/prefer-onyx-connect-in-libs */
import Onyx, {withOnyx} from 'react-native-onyx';
import ONYXKEYS, {OnyxKey} from '../ONYXKEYS';

function Component() {
    const keys: Promise<OnyxKey[]> = Onyx.getAllKeys();

    const isSafeEvictionKey = Onyx.isSafeEvictionKey(ONYXKEYS.ACCOUNT);
    const isSafeEvictionCollectionKey = Onyx.isSafeEvictionKey(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`);

    Onyx.removeFromEvictionBlockList(ONYXKEYS.ACTIVE_CLIENTS, 1);
    Onyx.removeFromEvictionBlockList(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, 1);

    Onyx.addToEvictionBlockList(ONYXKEYS.ACTIVE_CLIENTS, 2);
    Onyx.addToEvictionBlockList(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, 2);

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

    Onyx.disconnect(1000);
    Onyx.disconnect(1000, ONYXKEYS.COUNTRY_CODE);
    Onyx.disconnect(1000, `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`);

    Onyx.set(ONYXKEYS.ACCOUNT, {id: 'account1'});
    // Onyx.set(ONYXKEYS.ACCOUNT, 'something'); // raises an error - correct
    Onyx.set(ONYXKEYS.IS_LOADING_PAYMENT_METHODS, true);
    Onyx.set(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, {url: 'download_url'});

    Onyx.multiSet({
        [ONYXKEYS.ACCOUNT]: {id: 'id2'},
        [ONYXKEYS.IS_LOADING_PAYMENT_METHODS]: false,
        // [ONYXKEYS.NVP_PREFERRED_LOCALE]: 1, // raises an error - correct
        // [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`]: {url: 'download_url'}, // FIXME: raise errors if I add collection key - incorrect
    });

    Onyx.merge(ONYXKEYS.ACCOUNT, {name: 'user name'});
    // Onyx.merge(ONYXKEYS.ACCOUNT, 'something'); // raises an error - correct
    Onyx.merge(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, {});

    Onyx.clear();
    Onyx.clear([ONYXKEYS.ACCOUNT, ONYXKEYS.ACTIVE_CLIENTS, `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`]);

    Onyx.mergeCollection(ONYXKEYS.COLLECTION.DOWNLOAD, {
        [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`]: {url: 'download_url'},
        // [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment2'}`]: false,
        [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment3'}`]: {url: 'download_url3'},
    }); // FIXME: raises an error - incorrect

    Onyx.update([
        {
            onyxMethod: 'merge',
            key: ONYXKEYS.ACCOUNT,
            value: {id: 'id1'},
        },
        {
            onyxMethod: 'merge',
            key: ONYXKEYS.IS_LOADING_PAYMENT_METHODS,
            value: false,
        },
        // {
        //     onyxMethod: 'merge',
        //     key: ONYXKEYS.IS_LOADING_PAYMENT_METHODS,
        //     value: {id: 'id1'}, // raises an error - correct
        // },
        {
            onyxMethod: 'merge',
            key: `${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`,
            value: {url: 'url1'},
        },
    ]);

    Onyx.init({
        keys: ONYXKEYS,
        initialKeyStates: {
            [ONYXKEYS.ACCOUNT]: {id: 'id1'},
            [ONYXKEYS.IS_LOADING_PAYMENT_METHODS]: false,
            // [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`]: {url: 'download_url'}, // FIXME: raise errors if I add collection key - incorrect
        },
        safeEvictionKeys: [ONYXKEYS.ACCOUNT],
    });

    Onyx.registerLogger(({level, message}) => {});

    return null;
}

export default withOnyx(Component);
