"use client";

import { Item } from "@/types/miniroom";

interface InventoryProps {
    items: Item[];
    onAddItem: (itemId: string) => void;
}

export const Inventory = ({ items, onAddItem }: InventoryProps) => {
    return (
        <div className="flex flex-col gap-4 p-4 border-l border-gray-200 w-64 bg-white h-[600px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Inventory</h2>
            <div className="grid grid-cols-2 gap-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onAddItem(item.id)}
                        className="flex flex-col items-center p-2 border border-gray-100 rounded hover:bg-gray-50 transition"
                    >
                        <div
                            className="mb-2"
                            style={{
                                width: 30,
                                height: 30,
                                backgroundColor: item.color,
                                borderRadius: "4px",
                            }}
                        />
                        <span className="text-xs text-center">{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
