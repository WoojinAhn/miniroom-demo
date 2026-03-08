"use client";

import { PRESET_TEMPLATES, PresetTemplate } from "@/data/presetTemplates";

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: PresetTemplate) => void;
}

export function TemplateModal({ isOpen, onClose, onSelect }: TemplateModalProps) {
    if (!isOpen) return null;

    const handleSelect = (template: PresetTemplate) => {
        const confirmed = window.confirm(
            `Load "${template.name}"?\n\nThis will replace your current room. This cannot be undone.`
        );
        if (!confirmed) return;
        onSelect(template);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Room Templates</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
                        aria-label="Close"
                    >
                        x
                    </button>
                </div>

                <p className="text-sm text-gray-500 px-4 pt-3 pb-1">
                    Choose a template to get started. Your current room will be replaced.
                </p>

                <div className="overflow-y-auto p-4 grid grid-cols-2 gap-3">
                    {PRESET_TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleSelect(template)}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-left"
                        >
                            <span className="text-4xl" role="img" aria-label={template.name}>
                                {template.thumbnail}
                            </span>
                            <span className="text-sm font-semibold text-gray-800 text-center">
                                {template.name}
                            </span>
                            <span className="text-xs text-gray-500 text-center leading-snug">
                                {template.description}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
