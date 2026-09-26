import { useCallback, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContextStore";
import { login as loginApi, getMe, googleLogin as googleLoginApi } from "@/api/authApi";
import { registerCustomer as registerApi } from "@/api/customerApi";

// Read the exp (expiry, in seconds) claim from a stored JWT without any library.
// Returns a timestamp in ms, or null when the token is not a decodable JWT.
function jwtExpiryMs(token) {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64Url));
        return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    }
    catch {
        return null;
    }
}

// Normalises an auth response into { token, user }.
//
// The backend may answer with the documented AuthResponse object
// ({access_token, user}), an object using `token`, or the raw JWT as plain
// text. Both login and register go through here, because a shape mismatch must
// fail loudly. Previously register trusted the shape blindly: an unexpected
// body set the token to undefined, threw nothing, and the form reported
// success while the account was unusable.
async function readAuthResponse(data, action) {
    const token = typeof data === 'string' ? data : data?.access_token || data?.token;
    if (!token) {
        throw new Error(`${action} response did not include a token`);
    }

    let user = data && typeof data === 'object' ? data.user : null;
    if (!user) {
        // Token-only response: fetch the profile with the token we just got.
        localStorage.setItem('token', token);
        try {
            user = await getMe();
        }
        catch {
            user = null;
        }
    }

    return { token, user };
}

export function AuthProvider({ children }){
    const [user, setUser] = useState(() => {
        try{
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        }
        catch{
            return null;
        }
    })
    const [token, setToken] = useState(() => localStorage.getItem('token'))
    const [loading, setLoading] = useState(false);
    // True while we verify a stored token on first load, so route guards wait.
    // Starts as true only when a still-valid-looking token is stored.
    const [checking, setChecking] = useState(() => {
        const storedToken = localStorage.getItem('token');
        if(!storedToken){
            return false;
        }
        const expiresAt = jwtExpiryMs(storedToken);
        return expiresAt ? Date.now() < expiresAt : true;
    });

    // Keep a stable reference to the latest user so getUser can fall back to it
    // without depending on `user` (which would make the callback change identity
    // and cause infinite refetch loops in effects that use getUser).
    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        if(token){
            localStorage.setItem('token', token);
        }
        else{
            localStorage.removeItem('token');
        }

        if(user){
            localStorage.setItem('user', JSON.stringify(user));
        }
        else{
            localStorage.removeItem('user');
        }
    }, [token, user])

    // On first load: drop obviously-expired JWTs, then re-validate with the server.
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if(!storedToken){
            return;
        }

        const expiresAt = jwtExpiryMs(storedToken);
        let cancelled = false;
        // Run in a microtask so the state updates below are not synchronous
        // within the effect body.
        const validate = async () => {
            if(expiresAt && Date.now() >= expiresAt){
                setToken(null);
                setUser(null);
                setChecking(false);
                return;
            }

            try{
                const me = await getMe();
                if(!cancelled){
                    setUser(me);
                }
            }
            catch(err){
                // A 401 means the token is no longer accepted -> force re-login.
                // Network/other errors keep the session so the app is not disruptive.
                if(err?.response?.status === 401 && !cancelled){
                    setToken(null);
                    setUser(null);
                }
            }
            finally{
                if(!cancelled){
                    setChecking(false);
                }
            }
        };
        void Promise.resolve().then(validate);
        return () => { cancelled = true; };
    }, [])

    // When any API call returns 401 (token expired mid-session), log out.
    useEffect(() => {
        const handleUnauthorized = () => {
            setToken(null);
            setUser(null);
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [])

    const login = useCallback(async (identifier, password) => {
        const { token, user } = await readAuthResponse(await loginApi(identifier, password), 'Login');
        setToken(token);
        setUser(user);
        return user;
    }, [])

    const register = useCallback(async (payload) => {
        const { token, user } = await readAuthResponse(await registerApi(payload), 'Registration');
        setToken(token);
        setUser(user);
        return user;
    }, [])

    // Signs in with the ID token that Google Identity Services produced in the
    // browser. The token is only an assertion of identity: the backend verifies
    // it with Google's keys and decides the role, so nothing here is trusted for
    // authorization.
    const loginWithGoogle = useCallback(async (credential) => {
        const { token, user } = await readAuthResponse(await googleLoginApi(credential), 'Google sign-in');
        setToken(token);
        setUser(user);
        return user;
    }, [])

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
    }, [])

    const getUser = useCallback(async () => {
        if(!token){
            return null;
        }
        setLoading(true);
        try{
            const me = await getMe();
            setUser(me);

            return me;
        }
        catch{
            return userRef.current;
        }
        finally{
            setLoading(false);
        }
    }, [token]);

    const value = {user, token, loading, checking, login, register, loginWithGoogle, logout, getUser}

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}
