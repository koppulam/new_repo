// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Components
import ProductCareCarousel from 'components/containers/ProductCareCarousel';
import ContentTile from 'components/common/ContentTile';

/**
 * Product Care Component
 */
class ProductCare extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config],
            hideComponent: true
        };
    }

    /**
     * @description Will hide the component when no data
     * @returns {void}
     */
    dataFetched = () => {
        this.setState({ hideComponent: false });
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        return this.state.config ? (
            <article
                className={
                    classNames('product-care', {
                        hide: this.state.hideComponent
                    })
                }
            >
                <div className={`content-band--40x60 ${this.state.config.textAlignment === 'right' ? 'inverted' : ''}`}>
                    <div className="band-item">
                        <ContentTile
                            textAlignment="tf-g__start"
                            heading={this.state.config.heading}
                            description={this.state.config.description}
                        />
                    </div>
                    <div className="band-item">
                        <ProductCareCarousel
                            config={this.state.config.carouselConfigKey}
                            type={this.state.config.carouselType}
                            dataFetched={this.dataFetched}
                        />
                    </div>
                </div>
            </article>)
            :
            (null);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        recommendations: state.recommendations,
        aem: state.aem
    };
};

ProductCare.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(ProductCare);
