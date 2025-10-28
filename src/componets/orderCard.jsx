import React from 'react';


const OrderCard = ({ image, title, subtitle, size, color, qty, className = '' }) => {
    return (
        <div className={`w-full rounded-2xl border border-gray-200 bg-white p-3  ${className}`}>
            <div className="flex gap-3 items-start">
                {/* Image */}
                <div className="w-28 h-28 rounded-[4px] overflow-hidden bg-gray-100 shrink-0">
                    {image ? (
                        <img src={image} alt={title} className="w-full h-full object-cover" />
                    ) : null}
                </div>

                {/* Texts */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#1f2937] truncate">{title}</h3>
                    {subtitle && (
                        <p className="text-[14px] text-gray-700 leading-snug mt-0.5 line-clamp-2">
                            {subtitle}
                        </p>
                    )}

                    {/* Meta: Size, Color and Qty */}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="bg-gray-100 rounded px-2 py-1 text-xs">Size: {size}</span>
                        {color && (
                            <span className="bg-gray-100 rounded px-2 py-1 text-xs">Color: {color}</span>
                        )}
                        <span className="bg-gray-100 rounded px-2 py-1 text-xs">Qty: {qty}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;

