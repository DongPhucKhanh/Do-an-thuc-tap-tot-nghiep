import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-between items-center p-4 border-t border-slate-200 bg-slate-50 mt-4" style={{ borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <span className="text-sm text-slate-500">
                Hiển thị <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> trong tổng số <span className="font-semibold text-slate-700">{totalItems}</span> bản ghi
            </span>
            <div className="flex items-center gap-1">
                <button 
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 bg-white"
                >
                    Trước
                </button>
                <div className="flex gap-1 hidden sm:flex">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-blue-500 text-white shadow-sm border-blue-500' : 'border border-slate-200 hover:bg-slate-100 text-slate-600 bg-white'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600 bg-white"
                >
                    Sau
                </button>
            </div>
        </div>
    );
}
