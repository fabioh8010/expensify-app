import React, {ForwardedRef, forwardRef, useContext} from 'react';
import TextInput from '@components/TextInput';
import FormContext from './FormContext';

type ValueType = 'string' | 'boolean' | 'date';

type InputWrapperProps<T extends React.ElementType> = React.ComponentProps<T> & {
    InputComponent: T;
    inputID: string;
    valueType?: ValueType;
};

function InputWrapper<T extends React.ElementType>({InputComponent, inputID, valueType = 'string', ...rest}: InputWrapperProps<T>, ref: ForwardedRef<T>) {
    // @ts-expect-error TODO: Remove this when FormContext is migrated to TS.
    const {registerInput} = useContext(FormContext);
    // There are inputs that dont have onBlur methods, to simulate the behavior of onBlur in e.g. checkbox, we had to
    // use different methods like onPress. This introduced a problem that inputs that have the onBlur method were
    // calling some methods too early or twice, so we had to add this check to prevent that side effect.
    // For now this side effect happened only in `TextInput` components.
    const shouldSetTouchedOnBlurOnly = InputComponent === TextInput;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <InputComponent {...registerInput(inputID, {ref, shouldSetTouchedOnBlurOnly, valueType, ...rest})} />;
}

InputWrapper.displayName = 'InputWrapper';

export default forwardRef(InputWrapper);
