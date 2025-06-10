import { __ } from '@wordpress/i18n';
import { TextControl, Spinner, CheckboxControl, Button, SelectControl } from '@wordpress/components';

export default function TermSelector({
    selectedTaxonomy, onTaxonomyChange, taxonomyOptions = [], isLoadingTaxonomies,
    searchTerm, onSearchTermChange,
    searchResults, isLoadingSearchResults,
    selectedTerms = [], selectedTermObjects = [], // Ensure defaults
    onTermSelectionChange, onClearSelectedTerms
}) {
    return (
        <>
            {isLoadingTaxonomies && <Spinner />}
            {!isLoadingTaxonomies && taxonomyOptions && taxonomyOptions.length > 0 && (taxonomyOptions[0]?.value !== '' || taxonomyOptions.length > 1 ) && (
                <SelectControl
                    label={__('Filter by Taxonomy', 'news-ticker-block')}
                    value={selectedTaxonomy}
                    options={taxonomyOptions}
                    onChange={onTaxonomyChange}
                    help={__('Select a taxonomy to filter posts by its terms.', 'news-ticker-block')}
                />
            )}
             {!isLoadingTaxonomies && taxonomyOptions && (taxonomyOptions.length === 0 || (taxonomyOptions.length === 1 && taxonomyOptions[0]?.value === '')) && (
                <p><small>{taxonomyOptions.length === 1 && taxonomyOptions[0].label ? taxonomyOptions[0].label : __('No taxonomies available for the selected post type or post type not selected.', 'news-ticker-block')}</small></p>
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
                            <ul>{selectedTermObjects.map(term => <li key={term.id}>{term.name} (ID: {term.id})</li>)}</ul>
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
