"use client";

import { Item } from "@/types/miniroom";

interface InventoryProps {
    items: Item[];
    onAddItem: (itemId: string) => void;
}

export const Inventory = ({ items, onAddItem }: InventoryProps) => {
    return (
        <div className="flex flex-col gap-2 p-2 md:p-4 border-t md:border-t-0 md:border-l border-gray-200 w-full md:w-64 bg-white h-auto md:h-[600px] overflow-y-auto">
            {/* Inventory title removed for cleaner mobile UI */}
            {/* Special Items Section */}
            {items.some(i => i.type === 'special') && (
                <div className="mb-1 flex-shrink-0">
                    <h3 className="text-sm font-bold text-indigo-600 mb-1 uppercase tracking-wider">Special Items</h3>
                    <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                        {items
                            .filter(item => item.type === 'special')
                            .map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onAddItem(item.id)}
                                    className="flex-shrink-0 w-24 md:w-auto flex flex-col items-center p-2 bg-white border border-indigo-200 rounded hover:bg-indigo-100 hover:border-indigo-300 transition shadow-sm"
                                >
                                    <div
                                        className="mb-2 relative flex items-center justify-center"
                                        style={{
                                            width: 40,
                                            height: 40,
                                        }}
                                    >
                                        {item.imageUrl && (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        )}
                                    </div>
                                    <span className="text-xs text-center font-medium text-indigo-900">{item.name}</span>
                                </button>
                            ))}
                    </div>
                </div>
            )}

            {/* General Inventory */}
            <h3 className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider flex-shrink-0">General Items</h3>
            <div className="flex-shrink-0 flex overflow-x-auto md:grid md:grid-cols-2 gap-2 pb-2 md:pb-0">
                {items
                    .filter(item => item.type !== 'special')
                    .map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onAddItem(item.id)}
                            className="flex-shrink-0 w-24 md:w-auto flex flex-col items-center p-2 border border-gray-100 rounded hover:bg-gray-50 transition"
                        >
                            <div
                                className="mb-2 relative flex items-center justify-center"
                                style={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: item.imageUrl ? "transparent" : item.color,
                                    borderRadius: "4px",
                                }}
                            >
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                )}
                            </div>
                            <span className="text-xs text-center">{item.name}</span>
                        </button>
                    ))}
            </div>
        </div>
    );
};
