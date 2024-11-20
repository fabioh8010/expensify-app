/* eslint-disable rulesdir/prefer-actions-set-data */
import React, {useState} from 'react';
import type {OnyxEntry} from 'react-native-onyx';
import Onyx, {useOnyx, withOnyx} from 'react-native-onyx';
import * as Expensicons from '@components/Icon/Expensicons';
import MenuItem from '@components/MenuItem';
import Text from '@components/Text';
import useThemeStyles from '@hooks/useThemeStyles';
import ONYXKEYS from '@src/ONYXKEYS';
import mapOnyxCollectionItems from '@src/utils/mapOnyxCollectionItems';

type UseOnyxDependencyTestOnyxProps = {
    policyID: OnyxEntry<string>;
};

type UseOnyxDependencyTestProps = UseOnyxDependencyTestOnyxProps;

function UseOnyxDependencyTest({policyID}: UseOnyxDependencyTestProps) {
    const styles = useThemeStyles();
    const [internalValue, setInternalValue] = useState(`internal_${Math.random()}`);
    const [policies] = useOnyx(
        ONYXKEYS.COLLECTION.POLICY,
        {
            selector: (collection) =>
                mapOnyxCollectionItems(collection, (entry) => ({
                    id: entry?.id,
                    name: entry?.name,
                    internalValue,
                })),
        },
        [internalValue],
    );

    console.log('OnyxPlayground [App] UseOnyxDependencyTest policyID', policyID);
    console.log('OnyxPlayground [App] UseOnyxDependencyTest internalValue', internalValue);
    console.log('OnyxPlayground [App] UseOnyxDependencyTest policies', policies);

    return (
        <>
            <Text style={[styles.textHeadline, styles.mb2, styles.ph5]}>UseOnyxDependencyTest</Text>
            <MenuItem
                wrapperStyle={styles.mb4}
                title="Set value to POLICY_ID"
                icon={Expensicons.Send}
                numberOfLinesTitle={2}
                onPress={() => {
                    Onyx.merge(ONYXKEYS.POLICY_ID, policyID === 'DE9A9D2285F076A2' ? '3B5E8F685F5DEF21' : 'DE9A9D2285F076A2');
                }}
            />
            <MenuItem
                wrapperStyle={styles.mb4}
                title="Set value to internal state"
                icon={Expensicons.Send}
                numberOfLinesTitle={2}
                onPress={() => {
                    setInternalValue(`internal_${Math.random()}`);
                }}
            />
            <Text>InitWithStoredValuesWithOnyx</Text>
            <Text>InitWithStoredValuesUseOnyx</Text>
        </>
    );
}

export default withOnyx<UseOnyxDependencyTestProps, UseOnyxDependencyTestOnyxProps>({
    policyID: {
        key: ONYXKEYS.POLICY_ID,
    },
})(UseOnyxDependencyTest);
