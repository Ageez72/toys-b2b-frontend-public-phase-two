'use client';
import { useState, useRef } from 'react';

export default function Accordion({
    items = [],
    multiple = false,
    className = ''
}) {
    const [open, setOpen] = useState(multiple ? [] : null);
    const itemRefs = useRef([]);

    const toggle = (idx) => {
        if (multiple) {
            setOpen((prev) =>
                prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
            );
        } else {
            setOpen((prev) => (prev === idx ? null : idx));
        }
    };

    const isOpen = (idx) => (multiple ? open.includes(idx) : open === idx);

    const onKeyDown = (e, idx) => {
        const key = e.key;
        if (key === 'ArrowDown' || key === 'ArrowUp') {
            e.preventDefault();
            const dir = key === 'ArrowDown' ? 1 : -1;
            const next = (idx + dir + items.length) % items.length;
            itemRefs.current[next]?.focus();
        }
    };

    return (
        <div className={`cart-accordion divide-y divide-gray-200 ${className}`}>
            {items.map((item, idx) => {
                const panelId = `accordion-panel-${idx}`;
                const buttonId = `accordion-button-${idx}`;
                const openNow = isOpen(idx);

                return (
                    <div key={item.id ?? idx} className="group">
                        <button
                            id={buttonId}
                            ref={(el) => (itemRefs.current[idx] = el)}
                            aria-controls={panelId}
                            aria-expanded={openNow}
                            onClick={() => toggle(idx)}
                            onKeyDown={(e) => onKeyDown(e, idx)}
                            className="flex w-full items-center justify-between bg-white text-left text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                            <span className="font-medium">{item.title}</span>
                            <svg
                                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${openNow ? 'rotate-180' : 'rotate-0'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
                            style={{ maxHeight: openNow ? '240px' : '0px' }}
                        >
                            <div className="content pb-4 pt-1 text-sm text-gray-700 mt-3">
                                {typeof item.content === 'function' ? item.content() : item.content}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
