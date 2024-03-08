/* eslint-disable rulesdir/prefer-actions-set-data */

/* eslint-disable no-console */
import React, {useState} from 'react';
import type {OnyxEntry} from 'react-native-onyx';
import Onyx, {useOnyx, withOnyx} from 'react-native-onyx';
import * as Expensicons from '@components/Icon/Expensicons';
import MenuItem from '@components/MenuItem';
import Text from '@components/Text';
import useThemeStyles from '@hooks/useThemeStyles';
import ONYXKEYS from '@src/ONYXKEYS';

type InitWithStoredValuesWithOnyxOnyxProps = {
    policyID: OnyxEntry<string>;
};

type InitWithStoredValuesWithOnyxProps = InitWithStoredValuesWithOnyxOnyxProps;

const InitWithStoredValuesWithOnyx = withOnyx<InitWithStoredValuesWithOnyxProps, InitWithStoredValuesWithOnyxOnyxProps>({
    policyID: {
        key: ONYXKEYS.POLICY_ID,
        // selector: (v) => `${v}_selector`,
        // initialValue: 'INITIAL VALUE',
        initWithStoredValues: false,
    },
})(({policyID}: InitWithStoredValuesWithOnyxProps) => {
    console.log(`OnyxPlayground [App] InitWithStoredValuesWithOnyx policyID '${policyID}'`);
    return <Text>{policyID}</Text>;
});

function InitWithStoredValuesUseOnyx() {
    const policyID = useOnyx(ONYXKEYS.POLICY_ID, {
        // selector: (v) => `${v}_selector`,
        // initialValue: 'INITIAL VALUE',
        initWithStoredValues: false,
    });
    console.log(`OnyxPlayground [App] InitWithStoredValuesUseOnyx policyID`, policyID);
    return <Text>{policyID[0]}</Text>;
}

function InitWithStoredValuesTest() {
    const styles = useThemeStyles();

    return (
        <>
            <Text style={[styles.textHeadline, styles.mb2, styles.ph5]}>initWithStoredValues</Text>
            <MenuItem
                wrapperStyle={styles.mb4}
                title="Set value to POLICY_ID"
                icon={Expensicons.Sync}
                numberOfLinesTitle={2}
                onPress={() => {
                    Onyx.merge(ONYXKEYS.POLICY_ID, 'something');
                }}
            />
            <Text>
                InitWithStoredValuesWithOnyx - <InitWithStoredValuesWithOnyx />
            </Text>
            <Text>
                InitWithStoredValuesUseOnyx -<InitWithStoredValuesUseOnyx />
            </Text>
        </>
    );
}

export default InitWithStoredValuesTest;
