// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as objectPath from 'object-path';

// Components
import ContentTile from 'components/common/ContentTile';

/**
 * MarketingContentTile Component
 */
class MarketingContentTile extends React.Component {
    /**
     * @param {*} props super props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.aem[this.props.config]
        };
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const config = objectPath.get(this.state, 'config', {});

        return (
            <article className={classNames('marketing-content-picture-tile',
                {
                    [`${config.paddingBottom}`]: config.paddingBottom
                })}
            >
                {
                    config &&
                    <ContentTile
                        {...config}
                    />
                }
            </article>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem
    };
};

MarketingContentTile.propTypes = {
    config: PropTypes.string.isRequired,
    aem: PropTypes.any.isRequired
};

export default connect(mapStateToProps)(MarketingContentTile);
