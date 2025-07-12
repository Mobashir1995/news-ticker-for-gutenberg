import { __ } from '@wordpress/i18n';
import { Button, CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useTaxonomies, useTaxonomyTerms } from '../hooks/useWordPressData';

/**
 * Taxonomy Filters Component
 * Handles taxonomy and term selection for filtering posts
 */
export function TaxonomyFilters({ attributes, setAttributes }) {
    const { postType, selectedTerms } = attributes;
    const [expandedTaxonomies, setExpandedTaxonomies] = useState({});
    const [taxonomySectionExpanded, setTaxonomySectionExpanded] = useState(false);

    const taxonomies = useTaxonomies(postType);
    const taxonomyTerms = useTaxonomyTerms(taxonomies);

    const toggleTaxonomy = (taxonomySlug) => {
        setExpandedTaxonomies(prev => ({
            ...prev,
            [taxonomySlug]: !prev[taxonomySlug]
        }));
    };

    const toggleTaxonomySection = () => {
        setTaxonomySectionExpanded(!taxonomySectionExpanded);
    };

    const handleTermChange = (taxonomySlug, termId, checked) => {
        const currentTerms = selectedTerms[taxonomySlug] || [];
        const newSelectedTerms = checked 
            ? [...currentTerms, termId]
            : currentTerms.filter(id => id !== termId);
        
        setAttributes({ 
            selectedTerms: {
                ...selectedTerms,
                [taxonomySlug]: newSelectedTerms
            }
        });
    };

    if (!taxonomies || !Array.isArray(taxonomies) || taxonomies.length === 0) {
        return null;
    }

    const hasSelectedTerms = selectedTerms && Object.keys(selectedTerms).some(key => 
        selectedTerms[key] && selectedTerms[key].length > 0
    );

    return (
        <div className="taxonomy-selectors">
            <div className="taxonomy-section-header" onClick={toggleTaxonomySection}>
                <div className="taxonomy-section-title">
                    <span className="taxonomy-icon">🏷️</span>
                    {__('Filter by Taxonomies', 'news-ticker-for-gutenberg')}
                    {hasSelectedTerms && (
                        <span className="section-indicator">
                            <span className="indicator-dot"></span>
                        </span>
                    )}
                </div>
                <Button
                    isSmall
                    variant="tertiary"
                    className="taxonomy-section-toggle"
                >
                    {taxonomySectionExpanded ? '−' : '+'}
                </Button>
            </div>
            
            {taxonomySectionExpanded && (
                <div className="taxonomy-section-content">
                    {taxonomies.map(taxonomy => {
                        const terms = taxonomyTerms[taxonomy.rest_base];
                        const taxonomySelectedTerms = selectedTerms[taxonomy.rest_base] || [];
                        const isExpanded = expandedTaxonomies[taxonomy.rest_base];
                        
                        return (
                            <div key={taxonomy.rest_base} className="taxonomy-group">
                                <div className="taxonomy-header">
                                    <h5>
                                        {taxonomy.name}
                                        {taxonomySelectedTerms.length > 0 && (
                                            <span className="selected-count">
                                                ({taxonomySelectedTerms.length} selected)
                                            </span>
                                        )}
                                    </h5>
                                    <Button
                                        isSmall
                                        variant="tertiary"
                                        onClick={() => toggleTaxonomy(taxonomy.rest_base)}
                                        className="taxonomy-toggle"
                                    >
                                        {isExpanded ? '−' : '+'}
                                    </Button>
                                </div>
                                {isExpanded && (
                                    <>
                                        {terms && Array.isArray(terms) && terms.length > 0 ? (
                                            <div className="terms-checkboxes">
                                                {terms.map(term => (
                                                    <CheckboxControl
                                                        key={term.id}
                                                        label={term.name}
                                                        checked={taxonomySelectedTerms.includes(term.id)}
                                                        onChange={(checked) => handleTermChange(taxonomy.rest_base, term.id, checked)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p>{__('No terms found for this taxonomy.', 'news-ticker-for-gutenberg')}</p>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
} 