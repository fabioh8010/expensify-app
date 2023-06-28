import Onyx, {withOnyx} from 'react-native-onyx';
import ONYXKEYS from '../ONYXKEYS';

function Component() {
    Onyx.isSafeEvictionKey(ONYXKEYS.WRONG); // error
    Onyx.isSafeEvictionKey(ONYXKEYS.ACCOUNT);
    Onyx.isSafeEvictionKey(ONYXKEYS.ACCOUNT_MANAGER_REPORT_ID);
    Onyx.isSafeEvictionKey(`${ONYXKEYS.ACCOUNT_MANAGER_REPORT_ID}${'17837'}`); // error
    Onyx.isSafeEvictionKey(`${ONYXKEYS.COLLECTION.POLICY}${'164882'}`);
    Onyx.isSafeEvictionKey(ONYXKEYS.FORMS.ADD_DEBIT_CARD_FORM);
    // Onyx.set(ONYXKEYS.ACCOUNT, {});
    return null;
}

export default withOnyx(Component);
