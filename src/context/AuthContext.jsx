import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { login as loginApi, register as registerApi, getMe } from "@/api/authApi";

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

    const login = useCallback(async (identifier, password) => {
        const data = await loginApi(identifier, password);
        setToken(data.access_token);
        setUser(data.user);

        return data.user;
    }, [])

    const register = useCallback(async (payload) => {
        const data = await registerApi(payload);
        setToken(data.access_token);
        setUser(data.user);
        return data.user;
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
            return user;
        }
        finally{
            setLoading(false);
        }
    }, [token, user]);

    const value = {user, token, loading, login, register, logout, getUser}

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}
