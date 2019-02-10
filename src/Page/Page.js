import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ResizeSensor } from 'css-element-queries';
import { allValidators, extendPropTypes } from '../utils/propTypes';
import s from './Page.scss';
import WixComponent from '../BaseComponents/WixComponent';
import PageHeader from '../PageHeader';
import Content from './Content';
import Tail from './Tail';
import {
  SCROLL_TOP_THRESHOLD,
  SHORT_SCROLL_TOP_THRESHOLD,
  PAGE_SIDE_PADDING_PX,
  PAGE_BOTTOM_PADDING_PX,
} from './constants';
import {
  mainContainerMinWidthPx as GRID_MIN_WIDTH,
  mainContainerMaxWidthPx as GRID_MAX_WIDTH,
} from '../Grid/constants';
import deprecationLog from '../utils/deprecationLog';
import { StickyContainer, Sticky } from 'react-sticky';

/*
 * Page structure is as follows:
 *
 * + PageWrapper --------------
 * | +- Page --------------------
 * | | +-- FixedContainer ---------
 * | | | +-- HeaderContainer ------ (Minimizable)
 * | | | |  header-content:padding-top
 * | | | | +-- Page.Header --------
 * | | | | |
 * | | | | |
 * | | | | +-----------------------
 * | | | |  tail:padding-top
 * | | | | +-- Page.Tail ----------
 * | | | | |
 * | | | | |
 * | | | | +-----------------------
 * | | | |  header-content:padding-bottom
 * | | | +-------------------------
 * | | | +-- Page.FixedContent* ----- ==+ Content (Virtual)
 * | | | |                              |
 * | | | +---------------------------   |
 * | | +-----------------------------   |
 * | | +--  ScrollableContainer -----   |
 * | | | +-- contentWrapper----------   |
 * | | | | +-- Page.FixedContent* ---   |
 * | | | | |                            |
 * | | | | +-------------------------   |
 * | | | | +-- Page.Content ---------   |
 * | | | | |                            |
 * | | | | +-------------------------   |
 * | | | +---------------------------   |
 * | | +----------------------------- ==+
 * | +----------------------------- (Page - End)
 * +------------------------------- (PageWrapper - End)
 *
 * -  ScrollableContainer is called in the code scrollable-content, and should NOT be renamed, since
 * Tooltip is hard-coded-ly using a selector like this: [data-class="page-scrollable-content"]
 * - * Page.FixedContent - is In contentWrapper, but when it gets sticky, it moves to the
 */

/**
 * A page container which contains a header and scrollable content
 */
class Page extends WixComponent {
  static defaultProps = {
    gradientCoverTail: true,
    minWidth: GRID_MIN_WIDTH,
    maxWidth: GRID_MAX_WIDTH,
  };

  constructor(props) {
    super(props);

    this._setContainerScrollTopThreshold(false);
    this._handleScroll = this._handleScroll.bind(this);
    this._handleWidthResize = this._handleWidthResize.bind(this);
    this._handleWindowResize = this._handleWindowResize.bind(this);
    this._renderFixedContent = this._renderFixedContent.bind(this);

    this.state = {
      headerContainerHeight: 0,
      tailHeight: 0,
      scrollBarWidth: 0,
      minimized: false,
      minimizedHeaderContainerHeight: null,
      isStickyFixedContent: false,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.contentResizeListener = new ResizeSensor(
      this._getScrollContainer().childNodes[0],
      this._handleWidthResize,
    );
    this._calculateComponentsHeights();
    this._handleWidthResize();
    window.addEventListener('resize', this._handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    // TODO: add watch on window.innerHeight - should

    super.componentDidUpdate(prevProps);
    if (this.state.minimized) {
      this._calculateMinimizedComponentsHeights();
    } else {
      this._calculateComponentsHeights();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.contentResizeListener.detach(this._handleWidthResize);
    window.removeEventListener('resize', this._handleWindowResize);
  }

  _calculateComponentsHeights() {
    const { headerContainerHeight, tailHeight, pageHeight } = this.state;
    const newHeaderContainerHeight = this.headerContainerRef
      ? this.headerContainerRef.offsetHeight
      : 0;
    const newTailHeight = this.pageHeaderTailRef
      ? this.pageHeaderTailRef.offsetHeight
      : 0;
    const newPageHeight = this.pageRef ? this.pageRef.offsetHeight : 0;
    if (
      headerContainerHeight !== newHeaderContainerHeight ||
      tailHeight !== newTailHeight ||
      pageHeight !== newPageHeight
    ) {
      this.setState({
        headerContainerHeight: newHeaderContainerHeight,
        tailHeight: newTailHeight,
        pageHeight: newPageHeight,
      });
    }
  }

  _calculateMinimizedComponentsHeights() {
    const { minimizedHeaderContainerHeight } = this.state;
    const newMinimizedHeaderContainerHeight =
      this.headerContainerRef &&
      this.headerContainerRef.getAttribute('data-minimized') === 'true'
        ? this.headerContainerRef.offsetHeight
        : null;

    if (minimizedHeaderContainerHeight !== newMinimizedHeaderContainerHeight) {
      this.setState({
        minimizedHeaderContainerHeight: newMinimizedHeaderContainerHeight,
      });
    }
  }

  _setContainerScrollTopThreshold({ shortThreshold }) {
    this.containerScrollTopThreshold = shortThreshold
      ? SHORT_SCROLL_TOP_THRESHOLD
      : SCROLL_TOP_THRESHOLD;
  }

  _setScrollContainer(scrollableContainerInstance) {
    this.scrollableContentRef = ReactDOM.findDOMNode(
      scrollableContainerInstance,
    );
    if (!this.stickyContainerInstance) {
      // this.stickyContainerInstance is not really used, we just use it as a flag so we subscribe only once
      this.stickyContainerInstance = scrollableContainerInstance;
      this.stickyContainerInstance.subscribe(obj =>
        this._handleStickyContainerEvent(obj),
      );
    }
    this.props.scrollableContentRef &&
      this.props.scrollableContentRef(scrollableContainerInstance);
  }

  _handleStickyContainerEvent(obj) {
    // TODO: This handle all sort of events, need to react to `onScroll` only
    this._handleScroll(obj.eventSource);
  }

  _getScrollContainer() {
    return this.scrollableContentRef;
  }

  _shouldBeMinimized(containerScrollTop) {
    return containerScrollTop > this.containerScrollTopThreshold;
  }

  _handleScroll(scrollContainer) {
    const containerScrollTop = scrollContainer.scrollTop;
    const nextMinimized = this._shouldBeMinimized(containerScrollTop);
    const { minimized, isStickyFixedContent } = this.state;

    const {
      minimizedDiff,
      minimizedHeaderContainerHeight,
    } = this._calculateMinimizedHeaderMeasurements();

    // TODO: can we take it from <Sticky/> renderProps isSticky? Whithout change Page state during render (which issues a React warning)
    const nextIsStickyFixedContent =
      minimizedHeaderContainerHeight === null
        ? false
        : containerScrollTop >= minimizedDiff;

    if (
      minimized !== nextMinimized ||
      isStickyFixedContent !== nextIsStickyFixedContent
    ) {
      this.setState({
        minimized: nextMinimized,
        isStickyFixedContent: nextIsStickyFixedContent,
      });
    }
  }

  _handleWidthResize() {
    // Fixes width issues when scroll bar is present in windows
    const scrollContainer = this._getScrollContainer();
    const scrollBarWidth =
      scrollContainer &&
      scrollContainer.offsetWidth - scrollContainer.clientWidth;

    if (this.state.scrollBarWidth !== scrollBarWidth) {
      this.setState({ scrollBarWidth });
    }
  }

  _handleWindowResize() {
    // TODO: add optimization - render only when height changes
    this.forceUpdate();
  }

  _safeGetChildren(element) {
    if (!element || !element.props || !element.props.children) {
      return [];
    }

    return element.props.children;
  }

  _calculatePageDimensionsStyle() {
    const { maxWidth, sidePadding } = this.props;
    if (!maxWidth && !sidePadding && sidePadding !== 0) {
      return null;
    }

    const styles = {};
    if (maxWidth) {
      styles.maxWidth = `${maxWidth}px`;
    }

    if (sidePadding || sidePadding === 0) {
      styles.paddingLeft = `${sidePadding}px`;
      styles.paddingRight = `${sidePadding}px`;
    }

    return styles;
  }

  _fixedContainerStyle() {
    const { scrollBarWidth } = this.state;
    if (scrollBarWidth) {
      return { width: `calc(100% - ${scrollBarWidth}px` };
    }
    return null;
  }

  /**
   * See diagram in class documentation to better understand this method.
   */
  _calculateHeaderMeasurements() {
    const { children } = this.props;
    const childrenObject = getChildrenObject(children);
    const { PageTail } = childrenObject;

    const { gradientCoverTail } = this.props;
    // headerContainerHeight (and other heights) are calculated only when the Page is NOT minimized
    const { headerContainerHeight, tailHeight } = this.state;

    const imageHeight = `${headerContainerHeight +
      (PageTail ? -tailHeight : 39)}px`;
    const gradientHeight = gradientCoverTail
      ? `${headerContainerHeight + (PageTail ? -SCROLL_TOP_THRESHOLD : 39)}px`
      : imageHeight;

    return {
      imageHeight,
      gradientHeight,
      headerContainerHeight,
    };
  }

  _calculateMinimizedHeaderMeasurements() {
    const {
      minimizedHeaderContainerHeight,
      headerContainerHeight,
    } = this.state;

    const minimizedDiff =
      minimizedHeaderContainerHeight === null
        ? 0
        : headerContainerHeight - minimizedHeaderContainerHeight;

    return {
      minimizedHeaderContainerHeight,
      minimizedDiff,
    };
  }

  hasBackgroundImage() {
    return !!this.props.backgroundImageUrl;
  }

  hasGradientClassName() {
    return !!this.props.gradientClassName && !this.props.backgroundImageUrl;
  }

  _getContentHorizontalLayoutProps() {
    const { children } = this.props;
    const childrenObject = getChildrenObject(children);
    const { PageContent } = childrenObject;
    const contentFullScreen = PageContent && PageContent.props.fullScreen;
    const pageDimensionsStyle = this._calculatePageDimensionsStyle();

    return {
      className: classNames(s.contentHorizontalLayout, {
        [s.contentFullWidth]: contentFullScreen,
      }),
      style: contentFullScreen ? null : pageDimensionsStyle,
    };
  }

  _renderFixedContainer() {
    const { children } = this.props;
    const childrenObject = getChildrenObject(children);
    const { PageTail } = childrenObject;
    const { minimized, isStickyFixedContent } = this.state;
    const pageDimensionsStyle = this._calculatePageDimensionsStyle();

    return (
      <div
        data-hook="page-fixed-container"
        style={this._fixedContainerStyle()}
        className={classNames(s.fixedContainer)}
        onWheel={event => {
          this._getScrollContainer().scrollTop =
            this._getScrollContainer().scrollTop + event.deltaY;
        }}
      >
        <div
          className={classNames(s.pageHeaderContainer, {
            [s.minimized]: minimized,
          })}
          data-minimized={minimized}
          ref={ref => (this.headerContainerRef = ref)}
        >
          {childrenObject.PageHeader && (
            <div className={s.pageHeader} style={pageDimensionsStyle}>
              {React.cloneElement(childrenObject.PageHeader, {
                minimized,
                hasBackgroundImage: this.hasBackgroundImage(),
              })}
            </div>
          )}
          {PageTail && (
            <div
              data-hook="page-tail"
              className={classNames(s.tail, { [s.minimized]: minimized })}
              style={pageDimensionsStyle}
              ref={r => (this.pageHeaderTailRef = r)}
            >
              {React.cloneElement(PageTail, { minimized })}
            </div>
          )}
        </div>
        {isStickyFixedContent && (
          <div {...this._getContentHorizontalLayoutProps()}>
            {this._renderFixedContent({})}
          </div>
        )}
      </div>
    );
  }

  _renderScrollableContainer() {
    const {
      imageHeight,
      gradientHeight,
      headerContainerHeight,
    } = this._calculateHeaderMeasurements();

    return (
      <StickyContainer
        className={s.scrollableContainer}
        data-hook="page-scrollable-content"
        data-class="page-scrollable-content"
        style={{ paddingTop: `${headerContainerHeight}px` }}
        ref={r => this._setScrollContainer(r)}
      >
        {this._renderScrollableBackground({
          gradientHeight,
          imageHeight,
        })}
        {this._renderContent()}
      </StickyContainer>
    );
  }
  _renderScrollableBackground({ gradientHeight, imageHeight }) {
    if (this.hasBackgroundImage()) {
      return (
        <div
          className={s.imageBackgroundContainer}
          style={{ height: imageHeight }}
          data-hook="page-background-image"
        >
          <div
            className={s.imageBackground}
            style={{ backgroundImage: `url(${this.props.backgroundImageUrl})` }}
          />
        </div>
      );
    }

    if (this.hasGradientClassName()) {
      return (
        <div
          data-hook="page-gradient-class-name"
          className={`${s.gradientBackground} ${this.props.gradientClassName}`}
          style={{ height: gradientHeight }}
        />
      );
    }
  }

  _renderFixedContent({ style } = {}) {
    const { children } = this.props;
    const childrenObject = getChildrenObject(children);
    const { PageFixedContent } = childrenObject;

    return (
      PageFixedContent && (
        <div
          data-hook="page-fixed-content"
          className={classNames(s.fixedContent, s.contentFloating)}
          style={style}
        >
          {React.cloneElement(PageFixedContent)}
        </div>
      )
    );
  }

  _renderStickyContent() {
    const { children } = this.props;
    const childrenObject = getChildrenObject(children);
    const { PageFixedContent } = childrenObject;

    if (!PageFixedContent) {
      return null;
    }

    const {
      minimizedDiff,
      minimizedHeaderContainerHeight,
    } = this._calculateMinimizedHeaderMeasurements();

    const ARBITRARY_LARGE = 1000;
    return (
      <Sticky
        relative
        topOffset={
          minimizedHeaderContainerHeight === null
            ? ARBITRARY_LARGE
            : minimizedDiff
        }
      >
        {({ isSticky, style }) => {
          //TODO: fix warning: Make this a separate state from Page. e.g. FixedHeaderComponent's state
          // if (this.state.isStickyFixedContent !== isSticky) {
          //   this.setState({
          //     isStickyFixedContent: isSticky,
          //   });
          // }

          return this._renderFixedContent({
            style: { ...style, visibility: isSticky ? 'hidden' : undefined },
          });
        }}
      </Sticky>
    );
  }
  _renderContent() {
    const { children } = this.props;
    const childrenObject = getChildrenObject(children);
    const { PageContent } = childrenObject;

    const { headerContainerHeight } = this._calculateHeaderMeasurements();
    // console.log('minimizedDiff= ', minimizedDiff);

    const { pageHeight, minimized } = this.state;
    const minHeightOffset = minimized
      ? this._calculateMinimizedHeaderMeasurements().minimizedDiff
      : 0;

    const contentHorizontalLayoutProps = this._getContentHorizontalLayoutProps();
    const stretchToHeight =
      pageHeight - headerContainerHeight - PAGE_BOTTOM_PADDING_PX;

    return (
      <div
        className={classNames(contentHorizontalLayoutProps.className, {
          [s.contentWrapper]: this.props.upgrade,
        })}
        style={{
          ...contentHorizontalLayoutProps.style,
          minHeight: `calc(100% - ${PAGE_BOTTOM_PADDING_PX}px + ${minHeightOffset}px`,
        }}
      >
        <div
          style={{
            minHeight: `${stretchToHeight}px`,
          }}
          className={s.contentFloating}
        >
          {this._renderStickyContent()}
          {this._safeGetChildren(PageContent)}
        </div>
      </div>
    );
  }

  render() {
    const { className, children, minWidth, upgrade } = this.props;

    const childrenObject = getChildrenObject(children);
    const { PageTail } = childrenObject;
    this._setContainerScrollTopThreshold({
      shortThreshold: PageTail && this.hasGradientClassName(),
    });

    return (
      <div
        className={classNames(
          upgrade ? s.pageWrapper : s.deprecatedPageWrapper,
          className,
        )}
      >
        <div
          className={upgrade ? s.page : s.deprecatedPage}
          style={{
            minWidth: minWidth + 2 * PAGE_SIDE_PADDING_PX,
          }}
          ref={ref => (this.pageRef = ref)}
        >
          {this._renderFixedContainer()}
          {this._renderScrollableContainer()}
        </div>
      </div>
    );
  }
}

const FixedContent = props => props.children;
FixedContent.displayName = 'Page.FixedContent';
FixedContent.propTypes = {
  children: PropTypes.element.isRequired,
};

Page.displayName = 'Page';
Page.Header = PageHeader;
Page.Content = Content;
Page.FixedContent = FixedContent;
Page.Tail = Tail;

Page.propTypes = {
  /** Background image url of the header beackground */
  backgroundImageUrl: PropTypes.string,
  /** Sets the max width of the content (Both in header and body) NOT including the page padding */
  maxWidth: PropTypes.number,
  /** Sets the min width of the content (Both in header and body) NOT including the page padding */
  minWidth: PropTypes.number,
  /** Sets padding of the sides of the page */
  sidePadding: PropTypes.number,
  /** A css class to be applied to the component's root element */
  className: PropTypes.string,
  /** Header background color class name, allows to add a gradient to the header */
  gradientClassName: PropTypes.string,
  /** If false Gradient will not cover Page.Tail */
  gradientCoverTail: PropTypes.bool,
  /** Is called with the Page's scrollable content ref **/
  scrollableContentRef: PropTypes.func,

  /** Accepts these components as children: `Page.Header`, `Page.Tail`, `Page.Content`, `Page.FixedContent`. Order is insignificant. */
  children: PropTypes.arrayOf((children, key) => {
    const childrenObj = getChildrenObject(children);

    if (!childrenObj.PageHeader) {
      return new Error(`Page: Invalid Prop children, must contain Page.Header`);
    }

    if (!childrenObj.PageContent) {
      return new Error(
        `Page: Invalid Prop children, must contain Page.Content`,
      );
    }

    if (
      children[key].type.displayName !== Page.Header.displayName &&
      children[key].type.displayName !== Page.Content.displayName &&
      children[key].type.displayName !== Page.FixedContent.displayName &&
      children[key].type.displayName !== Page.Tail.displayName
    ) {
      return new Error(
        `Page: Invalid Prop children, unknown child ${children[key].type}`,
      );
    }
  }).isRequired,
  /** When true the page will use height: 100% and not require a parent of `display: flex;flex-flow: column;`. Also Page.Content's may grow using `height: 100%`.*/
  upgrade: PropTypes.bool,
};

extendPropTypes(Page, {
  upgrade: allValidators(PropTypes.bool, (props, propName, componentName) => {
    if (!props[propName]) {
      deprecationLog(
        `
${componentName}: New Layout API ! Please set upgrade=true prop to use new Layout API.
When enabled, the page will use height: 100% and not require a parent of 'display: flex;flex-flow: column;'.
Also Page.Content's may grow using 'height: 100%'. See docs for more info: https://github.com/wix/wix-style-react/blob/master/src/Page/README.MIGRATION.md`,
      );
    }
  }),
});

function getChildrenObject(children) {
  return React.Children.toArray(children).reduce((acc, child) => {
    switch (child.type.displayName) {
      case 'Page.Header': {
        acc.PageHeader = child;
        break;
      }
      case 'Page.Content': {
        acc.PageContent = child;
        break;
      }
      case 'Page.FixedContent': {
        acc.PageFixedContent = child;
        break;
      }
      case 'Page.Tail': {
        acc.PageTail = child;
        break;
      }
      default: {
        break;
      }
    }
    return acc;
  }, {});
}

export default Page;
