/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable rulesdir/prefer-actions-set-data */
/* eslint-disable rulesdir/prefer-onyx-connect-in-libs */
import Onyx, {withOnyx} from 'react-native-onyx';
import ONYXKEYS from '../ONYXKEYS';

function Component() {
    const keys = Onyx.getAllKeys();

    const isSafeEvictionKey = Onyx.isSafeEvictionKey(ONYXKEYS.ACCOUNT);

    Onyx.removeFromEvictionBlockList(ONYXKEYS.ACTIVE_CLIENTS, 1);

    Onyx.addToEvictionBlockList(ONYXKEYS.ACTIVE_CLIENTS, 2);

    Onyx.connect({
        key: ONYXKEYS.ACCOUNT,
        callback: (value) => {
            if (!value) {
                return;
            }

            console.log(value.id);
        },
    });

    Onyx.disconnect(1000);
    Onyx.disconnect(1000, ONYXKEYS.COUNTRY_CODE);

    Onyx.set(ONYXKEYS.ACCOUNT, {id: 'account1'});
    Onyx.set(ONYXKEYS.ACCOUNT, 'something'); // error - correct
    Onyx.set(ONYXKEYS.IS_LOADING_PAYMENT_METHODS, true);
    Onyx.set(`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`, {url: 'download_url'});

    Onyx.multiSet({
        [ONYXKEYS.ACCOUNT]: {id: 'id2'},
        [ONYXKEYS.IS_LOADING_PAYMENT_METHODS]: false,
        [ONYXKEYS.IS_LOADING_PAYMENT_METHODS]: {id: ''}, // FIXME: no error - incorrect
    });

    Onyx.merge(ONYXKEYS.ACCOUNT, {name: 'user name'});
    Onyx.merge(ONYXKEYS.ACCOUNT, 'something'); // error - correct

    Onyx.clear();
    Onyx.clear([ONYXKEYS.ACCOUNT, ONYXKEYS.ACTIVE_CLIENTS]);

    Onyx.mergeCollection(ONYXKEYS.COLLECTION.DOWNLOAD, {
        [`${ONYXKEYS.COLLECTION.DOWNLOAD}${'attachment1'}`]: {url: 'download_url'},
    }); // FIXME: error - incorrect

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
        {
            onyxMethod: 'merge',
            key: ONYXKEYS.IS_LOADING_PAYMENT_METHODS,
            value: {id: 'id1'}, // FIXME: no error - incorrect
        },
    ]);

    Onyx.init({
        keys: ONYXKEYS,
        initialKeyStates: {
            [ONYXKEYS.ACCOUNT]: {id: 'id1'},
            [ONYXKEYS.IS_LOADING_PAYMENT_METHODS]: {id: 'id1'}, // FIXME: no error - incorrect
        },
        safeEvictionKeys: [ONYXKEYS.ACCOUNT],
    });

    return null;
}

export default withOnyx(Component);
