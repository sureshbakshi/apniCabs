import React from 'react';
import { Keyboard, TextInput, InteractionManager } from 'react-native';

// Hook that returns a dismiss function and a HiddenInput component for fallback blur
export default function useKeyboardDismiss() {
    const hiddenRef = React.useRef(null);

    const dismiss = React.useCallback(() => {
        InteractionManager.runAfterInteractions(() => {
            try {
                Keyboard.dismiss();
                const currentlyFocused = TextInput.State && (TextInput.State.currentlyFocusedInput ? TextInput.State.currentlyFocusedInput() : TextInput.State.currentlyFocusedField ? TextInput.State.currentlyFocusedField() : null);
                if (currentlyFocused && TextInput.State.blurTextInput) {
                    TextInput.State.blurTextInput(currentlyFocused);
                }
            } catch (e) {
                Keyboard.dismiss();
            }

            // fallback: focus and blur hidden input to force keyboard hide
            setTimeout(() => {
                try {
                    if (hiddenRef.current && hiddenRef.current.focus) {
                        hiddenRef.current.focus();
                        setTimeout(() => {
                            try {
                                hiddenRef.current.blur && hiddenRef.current.blur();
                                Keyboard.dismiss();
                            } catch (e) { Keyboard.dismiss(); }
                        }, 60);
                    } else {
                        Keyboard.dismiss();
                    }
                } catch (e) {
                    Keyboard.dismiss();
                }
            }, 80);
        });
    }, []);

    const HiddenInput = React.useCallback(() => (
        <TextInput
            ref={hiddenRef}
            style={{ height: 0, width: 0, opacity: 0 }}
            importantForAutofill="no"
            accessible={false}
            caretHidden
        />
    ), []);

    return { dismiss, HiddenInput };
}
