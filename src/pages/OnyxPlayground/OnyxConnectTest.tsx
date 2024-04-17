/* eslint-disable no-console */

/* eslint-disable rulesdir/prefer-onyx-connect-in-libs */
import {useEffect} from 'react';
import type {OnyxEntry} from 'react-native-onyx';
import Onyx, {withOnyx} from 'react-native-onyx';
import ONYXKEYS from '@src/ONYXKEYS';

type OnyxConnectTestOnyxProps = {
    policyID: OnyxEntry<string>;
};

type OnyxConnectTestProps = OnyxConnectTestOnyxProps;

function OnyxConnectTest({policyID}: OnyxConnectTestProps) {
    useEffect(() => {
        const policyIdConnection = Onyx.connect({
            key: ONYXKEYS.POLICY_ID,
            callback: (value) => {
                console.log(`OnyxPlayground [App] OnyxConnectTest ${ONYXKEYS.POLICY_ID}`, value);
            },
        });

        const policiesConnection = Onyx.connect({
            key: ONYXKEYS.COLLECTION.POLICY,
            callback: (value) => {
                console.log(`OnyxPlayground [App] OnyxConnectTest ${ONYXKEYS.COLLECTION.POLICY}`, value);
            },
            waitForCollectionCallback: true,
        });

        const policyConnection = Onyx.connect({
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            callback: (value) => {
                console.log(`OnyxPlayground [App] OnyxConnectTest ${ONYXKEYS.COLLECTION.POLICY}${policyID}`, value);
            },
        });

        return () => {
            Onyx.disconnect(policyIdConnection);
            Onyx.disconnect(policiesConnection);
            Onyx.disconnect(policyConnection);
        };
    });

    return null;
}

export default withOnyx<OnyxConnectTestProps, OnyxConnectTestOnyxProps>({
    policyID: {
        key: ONYXKEYS.POLICY_ID,
    },
})(OnyxConnectTest);
