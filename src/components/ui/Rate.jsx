import React from 'react';
import StarsRate from './StarsRate';

export default function Rate({ item, onOpen }) {

    const getInitials = (str) => {
        if (!str) return ['', ''];
        const words = str.trim().split(/\s+/);
        const first = words[0]?.[0] || '';
        const last = words[words.length - 1]?.[0] || '';
        return [first.toUpperCase(), last.toUpperCase()];
    };

    const [firstInitial, lastInitial] = getInitials(item.name);

    return (
        <div className='comment-wrapper flex items-center justify-between gap-2'>
            <div className='rate-item flex gap-2 mt-6'>
                <div className="rate-info">
                    <div className="rate-name flex items-center gap-2 mb-2">
                        <div className="user-short-name flex items-center justify-center">
                            <span>{firstInitial}</span>
                            <span>.</span>
                            <span>{lastInitial}</span>
                        </div>
                        <div className="user-name sub-title">{item.name}</div>
                    </div>
                    <StarsRate rate={item.rating} />
                    <div className="rate-date mt-2">{item.time}</div>
                </div>
                <div className="rate-comment mt-3 md:mt-0">
                    <p className='sub-title'>{item.review}</p>
                </div>
            </div>
            <div className='remove-rate-btn cursor-pointer' onClick={onOpen}>
                <i className="icon-trash text-red-500"></i>
            </div>
        </div>
    )
}
