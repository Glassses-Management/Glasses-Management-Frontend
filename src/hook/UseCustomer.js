import { useContext } from "react";
import { CustomerContext } from "@/context/CustomerContextStore";

export function useCustomers(){
    const ctx = useContext(CustomerContext);
    if(!ctx){
        throw new Error('useCustomers must be used inside a <CustomerProvider>');
    }
    return ctx;
}