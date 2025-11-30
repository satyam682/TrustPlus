import React from 'react';
import { useData } from '../../context/DataContext';
import { AlertTriangle, ShieldAlert, Filter, Download } from 'lucide-react';
import { Button } from '../../ui/Button';

export const FlaggedReviewsPage: React.FC = () => {
    const { flaggedFeedback = [] } = useData();

    const getCategoryColor = (issue: string) => {
        const lowerIssue = issue.toLowerCase();
        if (lowerIssue.includes('fake') || lowerIssue.includes('ai-generated')) return 'bg-red-100 text-red-700';
        if (lowerIssue.includes('spam') || lowerIssue.includes('promotional')) return 'bg-orange-100 text-orange-700';
        if (lowerIssue.includes('toxic') || lowerIssue.includes('abusive')) return 'bg-purple-100 text-purple-700';
        if (lowerIssue.includes('sarcasm') || lowerIssue.includes('insult')) return 'bg-pink-100 text-pink-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                    Flagged Reviews
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{flaggedFeedback.length} flagged items</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>AI-powered detection</span>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <select className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <option>All Apps</option>
                    </select>

                    <select className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <option>All Detection Types</option>
                        <option>Fake / AI-generated</option>
                        <option>Spam</option>
                        <option>Toxic / Abusive</option>
                        <option>Copy-paste</option>
                        <option>Over-positive</option>
                        <option>Promotional ads</option>
                        <option>Incomplete</option>
                        <option>Suspicious patterns</option>
                        <option>Sarcasm</option>
                    </select>
                </div>

                <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export Report</Button>
            </div>

            {/* Flagged Reviews List */}
            <div className="space-y-4">
                {flaggedFeedback.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No flagged reviews!</h3>
                        <p className="text-gray-500 mt-2">All feedback passed AI verification ✅</p>
                    </div>
                ) : (
                    flaggedFeedback.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border-2 border-red-200 dark:border-red-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-700 dark:text-red-300 font-bold text-xs">
                                        {item.appName[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.appName}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{item.user}</span>
                                            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                                🚩 FLAGGED
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">{item.time}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{item.content}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-sm ${i < item.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
                                    ))}
                                </div>
                            </div>

                            {/* Detection Details */}
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h5 className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">Detection Report</h5>
                                        <p className="text-xs text-red-700 dark:text-red-400 mb-2">{item.detectionReason}</p>

                                        {/* Detected Issues Tags */}
                                        {item.detectedIssues && item.detectedIssues.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-[10px] font-medium text-red-800 dark:text-red-300 mb-1 uppercase">Detected Issues:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.detectedIssues.map((issue, idx) => (
                                                        <span key={idx} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(issue)}`}>
                                                            {issue}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Confidence Score */}
                                        {item.confidence !== undefined && (
                                            <div className="mt-3">
                                                <div className="flex justify-between items-center text-xs mb-1">
                                                    <span className="text-red-800 dark:text-red-300 font-medium">Confidence Level</span>
                                                    <span className="text-red-700 dark:text-red-400 font-bold">{item.confidence}%</span>
                                                </div>
                                                <div className="w-full bg-red-200 dark:bg-red-900/30 rounded-full h-2">
                                                    <div
                                                        className="bg-red-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${item.confidence}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                        ⚠️ {item.category || 'Flagged'}
                                    </span>
                                    {item.tags && item.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors dark:text-gray-400 dark:hover:text-red-400">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
