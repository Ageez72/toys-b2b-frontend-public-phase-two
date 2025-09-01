import React from 'react'

export default function StarsRate({ rate }) {
    return (
        <div className='flex gap-1'>
            {
                rate && rate > 0 ?
                    Array.from({ length: 5 }, (_, index) => (
                        index < rate ? <i key={index} className="icon-star-fill-sm"></i> : <i key={index} className="icon-star-blank-sm"></i>
                    )) : (
                        <>
                            <i className="icon-star-blank-sm"></i>
                            <i className="icon-star-blank-sm"></i>
                            <i className="icon-star-blank-sm"></i>
                            <i className="icon-star-blank-sm"></i>
                            <i className="icon-star-blank-sm"></i>
                        </>
                    )
            }
        </div>
    )
}
