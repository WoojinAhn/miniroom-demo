"use client";

interface MobileControlPanelProps {
    isVisible: boolean;
    onRotate: () => void;
    onFlip: () => void;
    onScaleUp: () => void;
    onScaleDown: () => void;
    onBringForward: () => void;
    onSendBackward: () => void;
    onDelete: () => void;
    onDeselect: () => void;
}

export const MobileControlPanel = ({
    isVisible,
    onRotate,
    onFlip,
    onScaleUp,
    onScaleDown,
    onBringForward,
    onSendBackward,
    onDelete,
    onDeselect,
}: MobileControlPanelProps) => {
    if (!isVisible) return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
            {/* Backdrop tap to deselect */}
            <div 
                className="absolute -top-screen left-0 right-0 h-screen pointer-events-none"
                onClick={onDeselect}
            />
            
            <div className="flex items-center justify-between px-4 py-3 gap-2">
                {/* Transform Group */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onRotate}
                        className="flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl text-gray-700 text-lg font-bold transition-colors"
                        title="회전"
                    >
                        ↻
                    </button>
                    <button
                        onClick={onFlip}
                        className="flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl text-gray-700 text-lg font-bold transition-colors"
                        title="반전"
                    >
                        ⇄
                    </button>
                </div>

                {/* Scale Group */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onScaleDown}
                        className="flex items-center justify-center w-11 h-11 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 rounded-xl text-blue-700 text-xl font-bold transition-colors"
                        title="축소"
                    >
                        −
                    </button>
                    <button
                        onClick={onScaleUp}
                        className="flex items-center justify-center w-11 h-11 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 rounded-xl text-blue-700 text-xl font-bold transition-colors"
                        title="확대"
                    >
                        +
                    </button>
                </div>

                {/* Layer Group */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onSendBackward}
                        className="flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl text-gray-700 text-lg font-bold transition-colors"
                        title="뒤로"
                    >
                        ⬇
                    </button>
                    <button
                        onClick={onBringForward}
                        className="flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl text-gray-700 text-lg font-bold transition-colors"
                        title="앞으로"
                    >
                        ⬆
                    </button>
                </div>

                {/* Delete */}
                <button
                    onClick={onDelete}
                    className="flex items-center justify-center w-11 h-11 bg-red-100 hover:bg-red-200 active:bg-red-300 rounded-xl text-red-600 text-lg font-bold transition-colors"
                    title="삭제"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};
