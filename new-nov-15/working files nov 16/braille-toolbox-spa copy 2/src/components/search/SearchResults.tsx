import React from 'react';
import { useLocation } from 'react-router-dom';
import { BrailleCell } from '../common/BrailleCell';
import { braillePatterns } from '../../data/braillePatterns.json';

const SearchResults: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query') || '';
    const results = braillePatterns.filter(pattern => 
        pattern.character.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="search-results">
            <h2 className="text-2xl font-bold mb-4">Search Results for: "{query}"</h2>
            {results.length > 0 ? (
                <ul className="list-disc pl-5">
                    {results.map((result, index) => (
                        <li key={index} className="mb-2">
                            <div className="flex items-center">
                                <BrailleCell character={result.character} />
                                <span className="ml-2">{result.meaning}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;