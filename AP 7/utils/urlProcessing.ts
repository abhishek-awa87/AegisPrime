import { UrlContent } from '../types';

const MOCK_DATA: Record<string, UrlContent> = {
    'https://en.wikipedia.org/wiki/React_(software)': {
        url: 'https://en.wikipedia.org/wiki/React_(software)',
        title: 'React (software) - Wikipedia',
        description: 'React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies.',
        summary: 'React is a popular JavaScript library for building user interfaces, developed by Meta. It uses a component-based architecture, allowing developers to create reusable UI elements. Key features include the Virtual DOM for efficient updates, JSX for syntax, and a unidirectional data flow. It forms the view layer in MVC applications and can be used with other libraries like React Router for routing and Redux for state management.',
        source: {
            name: 'Wikipedia',
            credibility: 'High',
        },
        mainContent: [
            {
                heading: 'Basic usage',
                paragraphs: [
                    'React is used for creating single-page applications. The following is a rudimentary example of React usage in HTML with JSX and JavaScript.',
                    'The HelloMessage component is a React component that renders a "Hello" message. The ReactDOM.createRoot function gets a reference to the HTML element with id "root" and tells React to render the HelloMessage component inside this element.',
                ]
            },
            {
                heading: 'Notable features',
                paragraphs: [
                    'Components: React code is made of entities called components. These components are modular and reusable.',
                    'Virtual DOM: React maintains a virtual DOM. It uses this to determine which parts of the actual DOM need to change, which leads to performance improvements.',
                ]
            }
        ],
        analysis: {
            contentType: 'Article',
            readingTimeMinutes: 15,
            keyPoints: [
                'Component-based architecture',
                'Virtual DOM for performance',
                'JSX for UI syntax',
                'Maintained by Meta',
            ],
            relevanceScore: 0.95,
        }
    }
};

export const processUrl = (url: string): Promise<UrlContent> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const urlData = MOCK_DATA[url];
            if (urlData) {
                resolve(urlData);
            } else {
                reject(new Error('This URL is not supported by the simulation. Try: https://en.wikipedia.org/wiki/React_(software)'));
            }
        }, 1500); // Simulate network delay
    });
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};
