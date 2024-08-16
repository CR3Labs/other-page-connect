"use client";

import { FC, createContext, useContext, useState } from "react";

type AppProviderProps = { children: React.ReactNode };

type AppContextType = {
	mode: "light" | "dark" | "auto";
	primaryColor: `#${string}`;
	toggleMode: () => void;
	handleSetPrimaryColor: (value: `#${string}`) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: FC<AppProviderProps> = ({ children }) => {
	const [mode, setMode] = useState<"light" | "dark" | "auto">("dark");
	const [primaryColor, setPrimaryColor] = useState<`#${string}`>("#F91515");

	const handleToggleMode = () => {
		setMode((prev) => (prev === "light" ? "dark" : prev === "dark" ? "auto" : "light"));
	};

	const handleSetPrimaryColor = (value: `#${string}`) => {
		setPrimaryColor(value);
	};

	const settings = {
		mode,
		primaryColor,
		toggleMode: handleToggleMode,
		handleSetPrimaryColor,
	};

	return <AppContext.Provider value={settings}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("Hook can only be used inside App Provider");
	}

	return context;
};

export { AppProvider, useAppContext };
