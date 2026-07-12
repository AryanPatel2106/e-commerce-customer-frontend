import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

const CustomerContext = createContext(null);

function CustomerProvider({ children }) {
    const [address, setAddress] = useState(null);

    const [customerLoading, setCustomerLoading] = useState(true);

    const getCustomerAddress = async () => {
        setCustomerLoading(true);
        try {
            const response = await api.get(
                "/customer/addresses"
            );

            const customerAddress = response.data.data;

            setAddress(customerAddress);

        } catch {
            setAddress(null);
        } finally {
            setCustomerLoading(false);
        }
    }


    useEffect(() => {
        getCustomerAddress();
    }, []);

    const contextValue = {
        address,
        setAddress,
        customerLoading,
        getCustomerAddress,
    };

    return (
        <CustomerContext.Provider
            value={contextValue}
        >
            {children}
        </CustomerContext.Provider>
    );
}

function useCustomer() {
    const context = useContext(
        CustomerContext
    );

    if (!context) {
        throw new Error(
            "useCustomer must be used inside CustomerProvider"
        );
    }

    return context;
}

export {
    CustomerProvider,
    useCustomer,
};