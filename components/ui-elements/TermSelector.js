import { __ } from '@wordpress/i18n';
import { TextControl, Spinner, CheckboxControl, Button, SelectControl } from '@wordpress/components';

export default function TermSelector({
    selectedTaxonomy, onTaxonomyChange, taxonomyOptions, isLoadingTaxonomies,
    searchTerm, onSearchTermChange,
    searchResults, isLoadingSearchResults,
    selectedTerms, selectedTermObjects, onTermSelectionChange, onClearSelectedTerms
}) {
    // Ensure taxonomyOptions is an array before trying to access its properties or length
    const validTaxonomyOptions = Array.isArray(taxonomyOptions) ? taxonomyOptions : [];

    return (
        <>
            {isLoadingTaxonomies && <Spinner />}
            {!isLoadingTaxonomies && validTaxonomyOptions.length > 0 && validTaxonomyOptions[0].value !== '' && (
                <SelectControl
                    label={__('Filter by Taxonomy', 'news-ticker-block')}
                    value={selectedTaxonomy}
                    options={validTaxonomyOptions}
                    onChange={onTaxonomyChange}
                    help={__('Select a taxonomy to filter posts by its terms.', 'news-ticker-block')}
                />
            )}
             {!isLoadingTaxonomies && validTaxonomyOptions.length > 0 && validTaxonomyOptions[0].value === '' && validTaxonomyOptions.length === 1 && ( // Only "Select..." or "No tax..."
                <p><small>{validTaxonomyOptions[0].label}</small></p> // Display the placeholder message like "No taxonomies..."
            )}


            {selectedTaxonomy && (
                <div className="news-ticker-term-selection">
                    <h4>{__('Select Terms from', 'news-ticker-block')}{` "${selectedTaxonomy}"`}</h4>
                    <TextControl
                        label={__('Search Terms by Name', 'news-ticker-block')}
                        value={searchTerm}
                        onChange={onSearchTermChange}
                        placeholder={__('Type to search terms...', 'news-ticker-block')}
                    />
                    {isLoadingSearchResults && <Spinner />}
                    {(!isLoadingSearchResults && searchResults && searchResults.length > 0) && (
                        <ul className="news-ticker-search-results">
                            {searchResults.map((term) => (
                                <li key={term.id}>
                                    <CheckboxControl
                                        label={`${term.name} (ID: ${term.id}, Count: ${term.count})`}
                                        checked={selectedTerms.includes(term.id)}
                                        onChange={(isChecked) => {
                                            let newSelectedTerms = [...selectedTerms];
                                            if (isChecked) { if (!newSelectedTerms.includes(term.id)) newSelectedTerms.push(term.id); }
                                            else { newSelectedTerms = newSelectedTerms.filter(id => id !== term.id); }
                                            onTermSelectionChange(newSelectedTerms);
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                    {(!isLoadingSearchResults && searchTerm && searchResults && searchResults.length === 0) && (
                        <p>{__('No terms found matching your search.', 'news-ticker-block')}</p>
                    )}

                    {selectedTerms.length > 0 && selectedTermObjects && selectedTermObjects.length > 0 && (
                        <div className="news-ticker-selected-items">
                            <strong>{__('Selected Terms:', 'news-ticker-block')}</strong>
                            <ul>{selectedTermObjects.map(term => <li key={term.id}>{term.name} (ID: ${term.id})</li>)}</ul>
                            <Button isSecondary onClick={onClearSelectedTerms}>
                                {__('Clear All Selected Terms', 'news-ticker-block')}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
