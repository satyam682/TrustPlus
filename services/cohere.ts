// Cohere API Service for AI-powered features
// Uses command-r-03-2025 model for spam detection and feedback analysis

const COHERE_API_KEY = 'XJV8lWhAXQuvmqdRtT2DGaGvCCyoVOdPjMACTRzx';
const COHERE_API_URL = 'https://api.cohere.ai/v1/chat';
const MODEL = 'command-r-03-2025';

interface CohereResponse {
    text: string;
    message?: {
        content: { text: string }[];
    };
}

export interface FakeReviewDetectionResult {
    isFake: boolean;
    confidence: number; // 0-100
    detectedIssues: string[];
    primaryReason: string;
    category: 'clean' | 'suspicious' | 'fake';
    details: string;
}

/**
 * Comprehensive fake review detection with 12+ checks
 * @param content - The feedback content to analyze
 * @param rating - The rating given (1-5)
 * @returns Detailed detection results
 */
export async function detectFakeReview(
    content: string,
    rating: number
): Promise<FakeReviewDetectionResult> {
    if (!COHERE_API_KEY || COHERE_API_KEY.trim().length === 0) {
        console.warn('Cohere API key not configured. Skipping fake detection.');
        return {
            isFake: false,
            confidence: 0,
            detectedIssues: [],
            primaryReason: 'API not configured',
            category: 'clean',
            details: 'Detection skipped - API key missing'
        };
    }

    // Quick pre-checks
    if (!content || content.trim().length < 3) {
        return {
            isFake: true,
            confidence: 100,
            detectedIssues: ['Incomplete review'],
            primaryReason: 'Review is too short or empty',
            category: 'fake',
            details: 'Feedback must contain meaningful content'
        };
    }

    try {
        const prompt = `You are an advanced fake review detection system. Analyze the following feedback and detect if it contains ANY of these issues:

1. **Fake / AI-generated reviews** - Generic ChatGPT/AI-style language
2. **Spam** - Promotional/advertising content
3. **Abusive / toxic text** - Offensive, hateful, or inappropriate language
4. **Copy-paste reviews** - Generic template text
5. **Over-positive fake praise** - Unrealistic excessive enthusiasm
6. **Keyword stuffing** - Repeated words/phrases unnaturally
7. **Promotional ads** - Sales pitches, links, promotions
8. **Incomplete reviews** - Too vague or meaningless
9. **Suspicious patterns** - Bot-like repetitive structure
10. **Language mismatch** - Non-English or mixed languages inappropriately
11. **Invalid sentiment** - Rating completely contradicts text content
12. **Sarcasm / hidden insults** - Fake positivity hiding criticism

FEEDBACK TO ANALYZE:
Content: "${content}"
Rating: ${rating}/5

Respond in this EXACT JSON format (no markdown, just raw JSON):
{
  "isFake": true/false,
  "confidence": 0-100,
  "detectedIssues": ["issue1", "issue2"],
  "primaryReason": "brief explanation",
  "category": "clean/suspicious/fake"
}

Rules:
- If NO issues detected: isFake=false, category="clean", confidence=0, detectedIssues=[]
- If minor concerns: isFake=false, category="suspicious", confidence=30-60
- If clear violations: isFake=true, category="fake", confidence=70-100
- primaryReason should be user-friendly (what they did wrong)
- detectedIssues should list ALL categories that apply

Respond with ONLY the JSON, no other text.`;

        const response = await fetch(COHERE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COHERE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                message: prompt,
                temperature: 0.3,
                max_tokens: 300,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cohere API error:', errorText);
            // Fail-open for better UX
            return {
                isFake: false,
                confidence: 0,
                detectedIssues: [],
                primaryReason: 'Unable to verify, accepted by default',
                category: 'clean',
                details: 'Detection system temporarily unavailable'
            };
        }

        const data: CohereResponse = await response.json();
        const resultText = data.text || data.message?.content?.[0]?.text || '';

        // Extract JSON from response
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);

            return {
                isFake: result.isFake || false,
                confidence: result.confidence || 0,
                detectedIssues: result.detectedIssues || [],
                primaryReason: result.primaryReason || 'No issues detected',
                category: result.category || 'clean',
                details: result.detectedIssues.length > 0
                    ? `Detected: ${result.detectedIssues.join(', ')}`
                    : 'Review appears genuine'
            };
        }

        // Fallback if parsing fails
        return {
            isFake: false,
            confidence: 0,
            detectedIssues: [],
            primaryReason: 'Could not analyze, accepted by default',
            category: 'clean',
            details: 'Analysis inconclusive'
        };
    } catch (error) {
        console.error('Error detecting fake review:', error);
        // Fail-open
        return {
            isFake: false,
            confidence: 0,
            detectedIssues: [],
            primaryReason: 'Error in detection, accepted by default',
            category: 'clean',
            details: 'System error during analysis'
        };
    }
}

/**
 * Legacy spam detection (kept for backward compatibility)
 */
export async function detectSpam(content: string, rating: number): Promise<{ isSpam: boolean; reason: string }> {
    const result = await detectFakeReview(content, rating);
    return {
        isSpam: result.isFake,
        reason: result.primaryReason
    };
}

/**
 * Generate AI insights from feedback data
 */
export async function generateInsights(
    feedbacks: Array<{ content: string; rating: number; sentiment: string }>,
    appName: string
): Promise<Array<{ type: 'insight' | 'attention' | 'success'; title: string; description: string; recommendation: string }>> {
    if (!COHERE_API_KEY || COHERE_API_KEY.trim().length === 0) {
        console.warn('Cohere API key not configured. Returning mock insights.');
        return getMockInsights();
    }

    if (feedbacks.length === 0) {
        return [{
            type: 'insight',
            title: 'No feedback yet',
            description: 'Start collecting feedback to see AI-powered insights here.',
            recommendation: 'Share your feedback form link with users to get started.'
        }];
    }

    try {
        const feedbackSummary = feedbacks.slice(0, 20).map((f, i) =>
            `${i + 1}. Rating: ${f.rating}/5, Content: "${f.content}"`
        ).join('\n');

        const prompt = `Analyze the following user feedback for "${appName}" and provide 2-3 actionable insights.

Feedback data:
${feedbackSummary}

Provide insights in this exact JSON format (no markdown, just raw JSON):
[
  {
    "type": "insight|attention|success",
    "title": "Brief title (max 5 words)",
    "description": "1-2 sentence description of the finding",
    "recommendation": "Specific actionable recommendation"
  }
]

Types:
- "insight" for opportunities or patterns
- "attention" for problems or concerns
- "success" for positive achievements

Respond with ONLY the JSON array, no other text.`;

        const response = await fetch(COHERE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COHERE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                message: prompt,
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            console.error('Cohere API error generating insights');
            return getMockInsights();
        }

        const data: CohereResponse = await response.json();
        const resultText = data.text || data.message?.content?.[0]?.text || '';

        // Extract JSON from the response
        const jsonMatch = resultText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const insights = JSON.parse(jsonMatch[0]);
            return insights.slice(0, 3); // Max 3 insights
        }

        return getMockInsights();
    } catch (error) {
        console.error('Error generating insights:', error);
        return getMockInsights();
    }
}

function getMockInsights() {
    return [
        {
            type: 'insight' as const,
            title: 'Gathering feedback data',
            description: 'Collect more feedback to unlock AI-powered insights about your app.',
            recommendation: 'Share feedback forms with users to gather more responses.'
        }
    ];
}
