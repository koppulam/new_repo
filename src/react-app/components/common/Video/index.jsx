// Packages
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';

import { youtubeGetId } from 'lib/utils/String';
import * as isFalse from 'lib/utils/is-false';
import scopeFocus from 'lib/dom/scope-focus';
import styleVariables from 'lib/utils/breakpoints';

// import './index.scss';

/**
 * Video Component
 */
class Video extends React.Component {
    /**
     * @param {*} props Super Props
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.videoContainer = React.createRef();
    }

    /**
     * Lifcycle hook for
     * @returns {void}
     */
    componentDidMount() {
        if (this.videoContainer.current && this.props.isiframe) {
            scopeFocus.setScopeLimit(this.videoContainer.current);
        }
    }

    /**
     * @description remove focus
     * @returns {void}
     */
    closeVideoContainer = () => {
        scopeFocus.dispose();
    }

    /**
     * Render Component.
     * @returns {object} html instance
     */
    render() {
        const {
            videourl,
            isyoutubevideo,
            title,
            capSrc,
            capLabel,
            capLang,
            closelabel,
            islazyload,
            mobilevideourl
        } = this.props;
        let youtubeVideoId;

        const lazyLoad = !isFalse(islazyload);

        if (videourl.indexOf(window.location.host) > -1) {
            const url = videourl;
            const urlSplitArr = url.split('/');
            let id = urlSplitArr.pop();

            if (id === '') {
                id = urlSplitArr.pop();
            }

            youtubeVideoId = id;
        } else {
            youtubeVideoId = youtubeGetId(videourl);
        }

        const src = `https://www.youtube.com/embed/${youtubeVideoId}?border=0&autoplay=1&wmode='opaque'&enablejsapi=1&modestbranding=1&hl='en_US'&rel=0&showinfo=0&hd=1`;

        return (
            <div className="video-cta" ref={this.videoContainer}>
                <button type="button" aria-label={closelabel} className="video-cta__header-close icon-Close" onClick={this.closeVideoContainer} />
                {!isFalse(isyoutubevideo) &&
                    <iframe
                        className={classNames('youtube', {
                            'load-lazily': lazyLoad
                        })}
                        title={title}
                        data-src={lazyLoad ? src : ''}
                        src={!lazyLoad ? src : ''}
                        allowFullScreen
                        allow="autoplay; fullscreen"
                    />
                }
                {isFalse(isyoutubevideo) &&
                <MediaQuery query={styleVariables.desktopAndAbove}>
                    <video
                        tabIndex={0}
                        aria-describedby="Video"
                        className={classNames('video', {
                            'load-lazily': lazyLoad
                        })}
                        controls
                        autoPlay
                        data-autoloop="true"
                        src={videourl}
                    >
                        <track src={capSrc} kind="captions" srcLang={capLang} label={capLabel} />
                    </video>
                </MediaQuery>
                }
                {isFalse(isyoutubevideo) &&
                <MediaQuery query={styleVariables.desktopAndBelow}>
                    <video
                        tabIndex={0}
                        aria-describedby="Video"
                        className={classNames('video', {
                            'load-lazily': lazyLoad
                        })}
                        controls
                        autoPlay
                        data-autoloop="true"
                        src={mobilevideourl}
                    >
                        <track src={capSrc} kind="captions" srcLang={capLang} label={capLabel} />
                    </video>
                </MediaQuery>
                }
            </div>
        );
    }
}

Video.propTypes = {
    islazyload: PropTypes.bool,
    isyoutubevideo: PropTypes.any.isRequired,
    videourl: PropTypes.string.isRequired,
    mobilevideourl: PropTypes.string.isRequired,
    title: PropTypes.any,
    capSrc: PropTypes.string,
    capLabel: PropTypes.string,
    capLang: PropTypes.string,
    closelabel: PropTypes.any,
    isiframe: PropTypes.bool
};

Video.defaultProps = {
    capSrc: '',
    capLabel: '',
    capLang: '',
    closelabel: 'close video',
    title: '',
    isiframe: false,
    islazyload: true
};

export default Video;
