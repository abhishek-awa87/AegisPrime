export interface SimulatedAnalysis {
    contentType: 'Article' | 'Blog Post' | 'Documentation';
    readingTimeMinutes: number;
    keyPoints: string[];
    relevanceScore: number; // 0.0 to 1.0
}

export interface UrlContent {
    url: string;
    title: string;
    description: string;
    mainContent: { heading: string; paragraphs: string[] }[];
    summary: string;
    source: {
        name: string;
        credibility: 'High' | 'Medium' | 'Low';
    };
    analysis: SimulatedAnalysis;
}
