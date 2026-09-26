// Loads Google Identity Services on demand and resolves once `google.accounts.id`
// is ready. The script is a third-party asset, so it is only fetched when a page
// that actually offers Google sign-in is shown.

const SOURCE = 'https://accounts.google.com/gsi/client';
const ID = 'google-identity-services';

let loader = null;

function loadScript() {
    if (window.google?.accounts?.id) {
        return Promise.resolve();
    }

    if (loader) {
        return loader;
    }

    loader = new Promise((resolve, reject) => {
        const existing = document.getElementById(ID);
        if (existing) {
            existing.addEventListener('load', resolve, { once: true });
            existing.addEventListener('error', () => reject(new Error('Google sign-in failed to load')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.id = ID;
        script.src = SOURCE;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', resolve, { once: true });
        script.addEventListener('error', () => {
            // Allow a later attempt to retry instead of caching the failure.
            loader = null;
            reject(new Error('Google sign-in failed to load'));
        }, { once: true });
        document.head.appendChild(script);
    });

    return loader;
}

export const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export function isGoogleConfigured() {
    return Boolean(CLIENT_ID);
}

// Fail loudly instead of letting the login page silently look like it never had
// a Google option. The usual cause is a VITE_GOOGLE_CLIENT_ID that was added
// after the dev server started: Vite reads env values only at startup.
if (import.meta.env.DEV && !CLIENT_ID) {
    console.warn(
        '[auth] VITE_GOOGLE_CLIENT_ID is empty, so the Google sign-in button is hidden. ' +
        'Set it in .env and restart the dev server.',
    );
}

// The page that currently wants the credential. Kept here rather than in the
// button component because Google Identity Services delivers the token through
// the callback registered with initialize(), not only through the button's own
// `credential` property.
let credentialHandler = null;

/**
 * Registers the handler for a verified Google credential.
 * @returns {() => void} cleanup that detaches this exact handler.
 */
export function onGoogleCredential(handler) {
    credentialHandler = handler;
    return () => {
        if (credentialHandler === handler) {
            credentialHandler = null;
        }
    };
}

// Prints the public claims of a credential so a failing sign-in can be diagnosed
// without reading server logs. Only claims that are already public are shown and
// the token itself is never logged.
function logCredentialClaims(credential) {
    try {
        const payload = credential.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        const claims = JSON.parse(atob(padded));
        console.log('[auth] Google credential claims', {
            aud: claims.aud,
            iss: claims.iss,
            email_verified: claims.email_verified,
            email: claims.email,
        });
    } catch (err) {
        console.warn('[auth] could not decode the Google credential', err);
    }
}

// Notifies Google when the sign-in UI is mounted, which is required for the
// One Tap prompt and keeps the credential state fresh after a redirect.
//
// initialize() is guarded because React 18 StrictMode deliberately double-invokes
// effects in development, and Google logs a console warning when initialize() runs
// more than once for the same page. Only the first call for a given client id
// actually configures Google; later calls are no-ops.
let initializedFor = null;

export async function initGoogle() {
    if (!isGoogleConfigured()) {
        return false;
    }

    await loadScript();

    if (!window.google?.accounts?.id) {
        return false;
    }

    if (initializedFor !== CLIENT_ID) {
        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            ux_mode: 'popup',
            // Closing the popup on an outside click avoids leaving a stray window
            // behind when the user dismisses the account chooser.
            cancel_on_tap_outside: true,
            // This is the callback Google actually invokes when the button flow
            // finishes, so the handler must be registered here.
            callback: (response) => {
                // Stop the "sign in again" auto-select prompt once we have a token.
                window.google.accounts.id.disableAutoSelect();
                if (response?.credential) {
                    if (import.meta.env.DEV) {
                        logCredentialClaims(response.credential);
                    }
                    credentialHandler?.(response.credential);
                }
            },
        });
        initializedFor = CLIENT_ID;
    }

    return true;
}
