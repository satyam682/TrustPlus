import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Lightbulb, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Download, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { generateInsights } from '../../../services/cohere';

export const AnalyticsPage: React.FC = () => {
  const { apps, feedbacks } = useData();
  const [selectedAppId, setSelectedAppId] = useState<string>('all');
  const [insights, setInsights] = useState<Array<{ type: 'insight' | 'attention' | 'success'; title: string; description: string; recommendation: string }>>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Filter feedbacks based on selected app
  const filteredFeedbacks = selectedAppId === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.appId === selectedAppId);

  // Calculate metrics
  const totalFeedback = filteredFeedbacks.length;
  const avgRating = totalFeedback > 0
    ? (filteredFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(1)
    : '0.0';

  const sentimentCounts = filteredFeedbacks.reduce((acc, f) => {
    acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const positivePercent = totalFeedback > 0 ? Math.round((sentimentCounts.positive || 0) / totalFeedback * 100) : 0;
  const neutralPercent = totalFeedback > 0 ? Math.round((sentimentCounts.neutral || 0) / totalFeedback * 100) : 0;
  const negativePercent = totalFeedback > 0 ? Math.round((sentimentCounts.negative || 0) / totalFeedback * 100) : 0;

  // Generate AI insights when app selection changes
  useEffect(() => {
    if (filteredFeedbacks.length === 0) {
      setInsights([{
        type: 'insight',
        title: 'No feedback yet',
        description: 'Start collecting feedback to see AI-powered insights here.',
        recommendation: 'Share your feedback form link with users to get started.'
      }]);
      return;
    }

    const fetchInsights = async () => {
      setLoadingInsights(true);
      const appName = selectedAppId === 'all'
        ? 'All Apps'
        : apps.find(a => a.id === selectedAppId)?.name || 'Selected App';

      const aiInsights = await generateInsights(
        filteredFeedbacks.map(f => ({
          content: f.content,
          rating: f.rating,
          sentiment: f.sentiment
        })),
        appName
      );

      setInsights(aiInsights);
      setLoadingInsights(false);
    };

    fetchInsights();
  }, [selectedAppId, filteredFeedbacks.length]);

  // Prepare sentiment chart data
  const sentimentData = filteredFeedbacks.length > 0 ? [
    { name: 'Current', pos: sentimentCounts.positive || 0, neu: sentimentCounts.neutral || 0, neg: sentimentCounts.negative || 0 }
  ] : [{ name: 'Current', pos: 0, neu: 0, neg: 0 }];

  // Extract keywords from feedback
  const extractKeywords = () => {
    if (filteredFeedbacks.length === 0) return [];

    const words: Record<string, { count: number; positiveCount: number }> = {};

    filteredFeedbacks.forEach(f => {
      const content = f.content.toLowerCase();
      const commonWords = ['the', 'and', 'is', 'it', 'to', 'a', 'of', 'for', 'in', 'on', 'with', 'this', 'that', 'but', 'very', 'really'];

      content.split(/\s+/).forEach(word => {
        const cleaned = word.replace(/[^a-z]/g, '');
        if (cleaned.length > 3 && !commonWords.includes(cleaned)) {
          if (!words[cleaned]) {
            words[cleaned] = { count: 0, positiveCount: 0 };
          }
          words[cleaned].count++;
          if (f.sentiment === 'positive') {
            words[cleaned].positiveCount++;
          }
        }
      });
    });

    return Object.entries(words)
      .map(([word, data]) => ({
        word,
        count: data.count,
        pos: Math.round((data.positiveCount / data.count) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  const keywords = extractKeywords();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-500 mt-2">AI-powered analysis of your feedback data</p>
        </div>

        {/* App Selection Dropdown */}
        <select
          value={selectedAppId}
          onChange={(e) => setSelectedAppId(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">All Apps</option>
          {apps.map(app => (
            <option key={app.id} value={app.id}>{app.name}</option>
          ))}
        </select>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Feedback", val: totalFeedback.toString(), change: "", good: true },
          { label: "Avg Rating", val: avgRating, change: "", good: true },
          { label: "Positive", val: `${positivePercent}%`, change: "", good: true },
          { label: "Negative", val: `${negativePercent}%`, change: "", good: negativePercent < 10 },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Sentiment Distribution */}
      {totalFeedback > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Sentiment Distribution</h3>
            <p className="text-sm text-gray-500">Based on {totalFeedback} feedback {totalFeedback === 1 ? 'item' : 'items'}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-green-600 font-bold text-xl">{positivePercent}%</div>
              <div className="text-xs text-green-700 font-medium uppercase tracking-wide">Positive</div>
              <div className="text-xs text-gray-500 mt-1">{sentimentCounts.positive || 0} items</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-gray-600 font-bold text-xl">{neutralPercent}%</div>
              <div className="text-xs text-gray-700 font-medium uppercase tracking-wide">Neutral</div>
              <div className="text-xs text-gray-500 mt-1">{sentimentCounts.neutral || 0} items</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-red-600 font-bold text-xl">{negativePercent}%</div>
              <div className="text-xs text-red-700 font-medium uppercase tracking-wide">Negative</div>
              <div className="text-xs text-gray-500 mt-1">{sentimentCounts.negative || 0} items</div>
            </div>
          </div>
        </div>
      )}

      {/* Keywords Section */}
      {keywords.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-1">🤖 Most Mentioned Keywords</h3>
          <p className="text-sm text-gray-500 mb-6">Extracted from feedback content</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {keywords.map((k, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">{k.word}</span>
                  <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">{k.count}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${k.pos > 70 ? 'bg-green-500' : k.pos < 40 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${k.pos}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">🤖 AI-Generated Insights</h3>
          {loadingInsights && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing feedback...
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight, i) => {
            const colors = {
              insight: { bg: 'from-blue-50 to-white', border: 'border-blue-100', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
              attention: { bg: 'from-yellow-50 to-white', border: 'border-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' },
              success: { bg: 'from-green-50 to-white', border: 'border-green-100', text: 'text-green-700', badge: 'bg-green-100 text-green-800' }
            };
            const color = colors[insight.type];
            const Icon = insight.type === 'insight' ? Lightbulb : insight.type === 'attention' ? AlertTriangle : CheckCircle;

            return (
              <div key={i} className={`bg-gradient-to-br ${color.bg} p-6 rounded-xl border ${color.border} shadow-sm`}>
                <div className={`flex items-center gap-2 mb-3 ${color.text} font-bold`}>
                  <Icon className="w-5 h-5" /> {insight.type === 'insight' ? 'Insight' : insight.type === 'attention' ? 'Attention' : 'Success'}
                </div>
                <p className="text-gray-800 font-medium mb-2">{insight.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {insight.description}
                </p>
                <div className={`text-xs ${color.badge} p-2 rounded`}>
                  <strong>Recommendation:</strong> {insight.recommendation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {totalFeedback === 0 && (
        <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Feedback Data</h3>
          <p className="text-gray-500 mb-6">
            {selectedAppId === 'all'
              ? 'Start collecting feedback from your apps to see analytics here.'
              : 'This app has no feedback yet. Share the feedback form link to start collecting responses.'}
          </p>
        </div>
      )}
    </div>
  );
};