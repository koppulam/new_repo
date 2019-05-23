// Packages
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as objectPath from 'object-path';
import MediaQuery from 'react-responsive';
import Slider from 'react-slick';

import { scrollTo } from 'lib/utils/scroll-to-content';
import { findFirst } from 'lib/dom/dom-util';
import styleVariables from 'lib/utils/breakpoints';
import TiffanyModal from 'components/common/TiffanyModal';
import Picture from 'components/common/Picture';
import { updateCurrentValues } from 'actions/ChooseDiamondActions';

import Card from './Card.jsx';

/**
 * Product Description Component for Engagement
 */
class DiamondCards extends React.Component {
    /**
     * @constructor
     * @param {*} props Props
     * @returns {void}
     */
    constructor(props) {
        super();
        this.state = {
            isLoading: false
        };
        this.slickSlider = React.createRef();
    }

    /**
     * @description life cycle hook
     * @param {*} nextProps Next Props
     * @returns {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.filtersData.moreCardSku !== this.props.filtersData.moreCardSku) {
            setTimeout(() => {
                this.setState({ isLoading: false });
                this.slickSlider.slickGoTo(0);
            }, 1000);
        }
    }

    /**
     * @description function to toggle the loading modal on click of more like this button
     * @returns {void}
     */
    toggleLoadingModal = () => {
        this.props.dispatch(updateCurrentValues({ childCardsOpen: true }));
        const tabletMax = window.matchMedia(styleVariables.tabletMax).matches;

        scrollTo('.choose-your-diamond__container_cards_header', null, -(findFirst('.header__nav-container').offsetHeight));

        if (tabletMax) {
            this.setState({ isLoading: true });
        }
    }

    /**
     * @param {string} url image url
     * @param {string} preset image preset
     * @param {string} name image name
     * @returns {void}
     */
    transformImage = (url, preset, name) => {
        const image = url ? url.replace('<Preset>', preset).replace('<ImagePrefix>-<ImageName>', name) : '';

        return image;
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const cardsData = objectPath.get(this.props, 'filtersData.cards', {});
        const imgUrl = cardsData && cardsData.imageUrlFormat;
        const imgPreset = cardsData && cardsData.imagePreset;
        const {
            desktopAndBelow, desktopAndAbove, belowDesktopTablet
        } = styleVariables;
        const settings = {
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 1.2,
            slidesToScroll: 1,
            swipeToSlide: false,
            initialSlide: 0,
            arrows: false,
            variableWidth: false,
            useTransform: false,
            accessibility: false
        };
        const {
            filtersData
        } = this.props;

        const loadingModalOptions = {
            visible: this.state.isLoading,
            options: {
                className: 'full-screen more-like-this',
                closeClass: 'close-modal'
            },
            onClose: () => {
                this.setState({ isLoading: false });
            }
        };

        return (
            Object.keys(cardsData).length > 0 ?
                <article className="diamond-cards">
                    <MediaQuery query={desktopAndBelow}>
                        <Slider
                            className="diamond-cards-carousel__body"
                            {...settings}
                            ref={element => { if (element) { this.slickSlider = element; } }}
                        >
                            {
                                cardsData &&
                                cardsData.mergedProducts &&
                                cardsData.mergedProducts.map((product, index) => {
                                    const parentIndex = objectPath.get(product, 'parentIndex', 0);
                                    const showCard = objectPath.get(product, 'parentSku', '') ? (filtersData.moreCardSku && filtersData.moreCardIndex === parentIndex) : ((filtersData.moreCardIndex === parentIndex) || !filtersData.moreCardSku);

                                    return showCard ? (
                                        <Card
                                            key={index.toString()}
                                            isAvailableOnline={product.isAvailableOnline}
                                            caratWeight={objectPath.get(product, 'caratWeight', '') ? parseFloat(objectPath.get(product, 'caratWeight', '')).toFixed(2) : ''}
                                            diamondClarity={objectPath.get(product, 'diamondClarity.0', '')}
                                            diamondColor={objectPath.get(product, 'diamondColor.0', '')}
                                            diamondCut={objectPath.get(product, 'diamondCut.0', '')}
                                            image={this.transformImage(imgUrl, imgPreset, product.imageURL)}
                                            parentSku={objectPath.get(product, 'parentSku', '')}
                                            sku={objectPath.get(product, 'sku', '')}
                                            title={objectPath.get(product, 'title', '')}
                                            hasChildren={objectPath.get(product, 'hasChildren', false)}
                                            parentIndex={parentIndex}
                                            price={objectPath.get(product, 'price', '0')}
                                            labels={this.props.labels}
                                            interactionName={index}
                                            show1B={this.props.show1B}
                                            onMoreClick={() => this.toggleLoadingModal()}
                                        />
                                    ) : null;
                                })
                            }
                        </Slider>
                    </MediaQuery>
                    <MediaQuery query={desktopAndAbove}>
                        {
                            cardsData &&
                            cardsData.mergedProducts &&
                            cardsData.mergedProducts.map((product, index) => {
                                return (
                                    <Card
                                        key={index.toString()}
                                        isAvailableOnline={product.isAvailableOnline}
                                        caratWeight={objectPath.get(product, 'caratWeight', '') ? parseFloat(objectPath.get(product, 'caratWeight', '')).toFixed(2) : ''}
                                        diamondClarity={objectPath.get(product, 'diamondClarity.0', '')}
                                        diamondColor={objectPath.get(product, 'diamondColor.0', '')}
                                        diamondCut={objectPath.get(product, 'diamondCut.0', '')}
                                        image={this.transformImage(imgUrl, imgPreset, product.imageURL)}
                                        parentSku={objectPath.get(product, 'parentSku', '')}
                                        sku={objectPath.get(product, 'sku', '')}
                                        title={objectPath.get(product, 'title', '')}
                                        hasChildren={objectPath.get(product, 'hasChildren', false)}
                                        parentIndex={objectPath.get(product, 'parentIndex', 0)}
                                        price={objectPath.get(product, 'price', '0')}
                                        labels={this.props.labels}
                                        interactionName={index}
                                        show1B={this.props.show1B}
                                        onMoreClick={() => this.toggleLoadingModal()}
                                    />
                                );
                            })
                        }
                    </MediaQuery>
                    <MediaQuery query={belowDesktopTablet}>
                        <TiffanyModal {...loadingModalOptions}>
                            <div className="more-like-this-loading">
                                <Picture
                                    sources={[]}
                                    defaultSrc={objectPath.get(this.props, 'aem.engagementpdp.labels.beautifulChoice.moreLikeThisLoadingIcon', '')}
                                    altText={objectPath.get(this.props, 'aem.engagementpdp.labels.beautifulChoice.moreLikeThisLoadingIconAlt')}
                                    customClass="more-like-this-loading_image"
                                    isLazyLoad={objectPath.get(this.props, 'aem.engagementpdp.labels.beautifulChoice.imagesShouldLoadLazily')}
                                />
                                <span className="more-like-this-loading_text">{objectPath.get(this.props, 'aem.engagementpdp.labels.beautifulChoice.moreLikeThisLoadingText')}</span>
                            </div>
                        </TiffanyModal>
                    </MediaQuery>
                </article> : null
        );
    }
}

DiamondCards.propTypes = {
    labels: PropTypes.object.isRequired,
    show1B: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        aem: state.aem,
        filtersData: state.diamondFilters
    };
};

export default connect(mapStateToProps)(DiamondCards);
