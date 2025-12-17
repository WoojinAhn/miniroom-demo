interface ReleaseNote {
    version: string;
    date: string;
    features: string[];
    fixes?: string[];
}

interface ChangelogModalProps {
    isOpen: boolean;
    onClose: () => void;
    changelog: ReleaseNote[];
}

export const ChangelogModal = ({ isOpen, onClose, changelog }: ChangelogModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">🚀 What's New</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold p-2">✕</button>
                </div>

                <div className="overflow-y-auto p-4 space-y-6">
                    {changelog.map((release, index) => (
                        <div key={release.version} className={`pb-4 ${index !== changelog.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-blue-600 font-bold text-lg">{release.version}</h3>
                                <span className="text-xs text-gray-400">{release.date}</span>
                            </div>

                            <div className="space-y-3">
                                {release.features.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Features</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {release.features.map((feat, i) => (
                                                <li key={i} className="text-sm text-gray-700 pl-2">{feat}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {release.fixes && release.fixes.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Bug Fixes</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {release.fixes.map((fix, i) => (
                                                <li key={i} className="text-sm text-gray-600 pl-2">{fix}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 border-t text-center">
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
                        Awesome!
                    </button>
                </div>
            </div>
        </div>
    );
};
