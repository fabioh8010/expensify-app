/* eslint-disable rulesdir/prefer-actions-set-data */
import React from 'react';
import HeaderPageLayout from '@components/HeaderPageLayout';
import AllowStaleDataTest from './AllowStaleDataTest';
import InitWithStoredValuesTest from './InitWithStoredValuesTest';
import OnyxConnectTest from './OnyxConnectTest';
import PolicyIDToggle from './PolicyIDToggle';
import WithOnyxVSuseOnyx from './WithOnyxVSuseOnyx';

function OnyxPlaygroundPage() {
    return (
        <HeaderPageLayout
            title="Onyx Playground"
            testID="Onyx Playground"
        >
            <WithOnyxVSuseOnyx />

            <PolicyIDToggle />

            <AllowStaleDataTest />

            <InitWithStoredValuesTest />

            <OnyxConnectTest />
        </HeaderPageLayout>
    );
}

OnyxPlaygroundPage.displayName = 'OnyxPlaygroundPage';

export default OnyxPlaygroundPage;
