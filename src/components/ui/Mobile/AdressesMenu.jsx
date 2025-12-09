"use client";
import { useState, useEffect } from "react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import en from "../../../../locales/en.json";
import ar from "../../../../locales/ar.json";
import { useAppContext } from "../../../../context/AppContext";

export default function AddressesMenu({ list, selectedAdd, setAddress }) {
    const [selected, setSelected] = useState(null);
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    useEffect(() => {
        setSelected(selectedAdd);
    }, [selectedAdd]);

    return (
        <div className="card relative addresses-menu">
            <Listbox value={selected} onChange={(value) => {
                setSelected(value);
                setAddress(value);
            }}>
                <ListboxButton
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-md flex items-center justify-between">

                    {/* ⭐ Placeholder or selected value */}
                    {selected ? (
                        <div className="flex items-center gap-2">
                            <i className="icon-location"></i>
                            <span className="address-title">{selected["branch name"] ? selected["branch name"] + " -" : null}  {selected.address}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <i className="icon-location"></i>
                            <span className="text-gray-400 address-title">{translation.mobile.selectAdress}</span>
                        </div>
                    )}

                    <svg
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 rotate-0`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </ListboxButton>

                <ListboxOptions className="address-options rounded-md absolute left-0 bg-white mt-2 max-h-60 w-full overflow-auto focus:outline-none z-50">
                    {list.map((add) => (
                        <ListboxOption
                            key={add.id}
                            value={add}
                            className={({ active }) =>
                                `flex items-center address-option justify-between cursor-pointer px-3 py-2 ${active ? "active" : ""
                                }`
                            }
                        >
                            {add["branch name"] ? add["branch name"] + " -" : null}  {add.address}
                            <i className="icon-tick-circle"></i>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
        </div>
    );
}
