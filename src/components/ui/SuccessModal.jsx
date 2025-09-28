'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function SuccessModal({ open, onClose, message, title, icon, summary, style }) {    
    return (
        <Dialog open={open} onClose={onClose} className="relative z-10000">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden modal-container success-modal bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="">
                                <div className="flex items-start gap-4">
                                    <div className='icon-container'>
                                        <i className={`${icon ? icon : 'icon-user-remove'}`}></i>
                                    </div>
                                    <div className="text-start w-auto">
                                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900 dialog-title">
                                            {title}
                                        </DialogTitle>
                                        <p className="text-sm text-gray-500 dialog-desc" style={style}>
                                            {message}
                                        </p>
                                        {summary && Array.isArray(summary) && (
                                            <div className="import-summary mt-6 text-start">
                                                {summary.map((line, idx) => (
                                                    idx > 0 && <p className='mb-0 mt-3' key={idx}>{line}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}