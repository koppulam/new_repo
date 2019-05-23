// import ProductCarousel from 'components/containers/ProductCarousel';
// import ProductCare from 'components/containers/ProductCare';
// import ProductCareCarousel from 'components/containers/ProductCareCarousel';
// import ProductPreview from 'components/containers/ProductPreview';
// import ProductPreviewScene7 from 'components/containers/ProductPreview/ProductPreviewScene7';
// import CircleCarousel from 'components/containers/CircleCarousel';
// import MarketingProductTiles from 'components/containers/MarketingProductTiles';
// import MarketingCarousel from 'components/containers/MarketingCarousel';
// import Filters from 'components/containers/Filters';
// import BrowseSearchGrid from 'components/containers/BrowseSearchGrid';
// import TextWithImageMarketingCarousel from 'components/containers/TextWithImageMarketingCarousel';
// import MarketingContentPictureTile from 'components/containers/MarketingContentPictureTile';
// import Search from 'components/containers/Search';
// import PopularProductCarousel from 'components/containers/Search/PopularProductCarousel';
// import ThreeTileCarousel from 'components/containers/ThreeTileCarousel';
// import FullWidthShoppableTile from 'components/containers/FullWidthShoppableTile';
// import TextWithImage from 'components/containers/TextWithImage';
// import MarketingTile from 'components/common/MarketingTile';
// import ContentTile from 'components/common/ContentTile';
// import OnProductTileHover from 'components/containers/OnProductTileHover';
// import PDPEngraving from 'components/containers/EngravingVariations/PDPEngraving';
// import EngravingInModal from 'components/containers/EngravingVariations/EngravingInModal';
// import ProductQuantity from 'components/containers/ProductModifiers/ProductQuantity';
// import ProductSocialSharing from 'components/containers/ProductSocialSharing';
// import PdpButtons from 'components/common/PdpButtons';
// import AddToCart from 'components/containers/ProductModifiers/AddToCart';
// import ClickToPay from 'components/containers/ProductModifiers/ClickToPay';
// import Bops from 'components/containers/Bops';
// import ProductAvailability from 'components/containers/ProductAvailability';
// import ProductAction from 'components/containers/ProductAction';
// import InformationText from 'components/common/InformationText';
// import Price from 'components/containers/ProductModifiers/Price';
// import ProductVariations from 'components/containers/ProductModifiers/ProductVariations';
// import ProductBundleScroll from 'components/containers/ProductBundleScroll';
// import TiffanyMaps from 'components/containers/Maps';
// import PdpModal from 'components/containers/PdpModal';
// import GiftCardCta from 'components/containers/GiftCard/GiftCardCta';
// import BuildYourOwn from 'components/containers/BuildYourOwn';
// import DropAHint from 'components/containers/DropAHint';
// import UpcomingEvents from 'components/containers/UpcomingEvents';
// import StoreSearchBar from 'components/containers/StoreLocator/StoreSearchBar';
// import StoreSearchResults from 'components/containers/StoreLocator/StoreSearchResults';
// import GlobalFlagShip from 'components/containers/GlobalFlagShip';
// import FlyoutItems from 'components/common/FlyoutItems';
// import HeaderFlyout from 'components/containers/HeaderFlyout';
// import ConciergeFlyout from 'components/containers/ConciergeFlyout';
// import ProductsFlyout from 'components/common/ProductsFlyout';
// import EngagementPdp from 'components/containers/Engagement/EngagementPdp';
// import WishList from 'components/containers/WishList';
// import ShippingFlyout from 'components/containers/ShippingFlyout';
// import ShippingCta from 'components/containers/ShippingFlyout/ShippingCta';
// import MarketingContentTile from 'components/containers/MarketingContentTile';
// import DiamondGuideMarketingTile from 'components/containers/DiamondGuideMarketingTile';
// import BeautyTiles from 'components/containers/ShopBySlider/BeautyTiles';
// import ShopBySlider from 'components/containers/ShopBySlider/ShopBySlider';
// import ChooseYourDiamond from 'components/containers/Engagement/ChooseYourDiamond';
// import FooterFlyout from 'components/containers/FooterFlyout';
// import EmailFlyoutCta from 'components/containers/EmailFlyoutCta';
//
// import HourGlass from 'components/common/HourGlass';
// import MiniPdpCta from 'components/containers/MiniPdp/MiniPdpCta';
// import Video from 'components/common/Video';
// import MiniPdpModal from 'components/containers/MiniPdp/MiniPdpModal';
// import PdpSalesService from 'components/containers/PdpSalesService';
// import BaiduMaps from 'components/containers/Maps/BaiduMaps';
// import SalesServiceCenter from 'components/containers/SalesServiceCenter/index';

// Dynamic import *** DON'T DELETE
import asyncComponent from './AsyncComponent';

const ProductCarousel = asyncComponent(() => import(/* webpackChunkName: "ProductCarousel" */'components/containers/ProductCarousel').then(module => module.default));
const ProductCare = asyncComponent(() => import(/* webpackChunkName: "ProductCare" */'components/containers/ProductCare').then(module => module.default));
const ProductCareCarousel = asyncComponent(() => import(/* webpackChunkName: "ProductCareCarousel" */'components/containers/ProductCareCarousel').then(module => module.default));
const ProductPreview = asyncComponent(() => import(/* webpackChunkName: "ProductPreview" */'components/containers/ProductPreview').then(module => module.default));
const ProductPreviewScene7 = asyncComponent(() => import(/* webpackChunkName: "ProductPreviewScene7" */'components/containers/ProductPreview/ProductPreviewScene7').then(module => module.default));
const CircleCarousel = asyncComponent(() => import(/* webpackChunkName: "CircleCarousel" */'components/containers/CircleCarousel').then(module => module.default));
const MarketingProductTiles = asyncComponent(() => import(/* webpackChunkName: "MarketingProductTiles" */'components/containers/MarketingProductTiles').then(module => module.default));
const MarketingCarousel = asyncComponent(() => import(/* webpackChunkName: "MarketingCarousel" */'components/containers/MarketingCarousel').then(module => module.default));
const Filters = asyncComponent(() => import(/* webpackChunkName: "Filters" */'components/containers/Filters').then(module => module.default));
const BrowseSearchGrid = asyncComponent(() => import(/* webpackChunkName: "BrowseSearchGrid" */'components/containers/BrowseSearchGrid').then(module => module.default));
const TextWithImageMarketingCarousel = asyncComponent(() => import(/* webpackChunkName: "TextWithImageMarketingCarousel" */'components/containers/TextWithImageMarketingCarousel').then(module => module.default));
const MarketingContentPictureTile = asyncComponent(() => import(/* webpackChunkName: "MarketingContentPictureTile" */'components/containers/MarketingContentPictureTile').then(module => module.default));
const Search = asyncComponent(() => import(/* webpackChunkName: "Search" */'components/containers/Search').then(module => module.default));
const PopularProductCarousel = asyncComponent(() => import(/* webpackChunkName: "PopularProductCarousel" */'components/containers/Search/PopularProductCarousel').then(module => module.default));
const ThreeTileCarousel = asyncComponent(() => import(/* webpackChunkName: "ThreeTileCarousel" */'components/containers/ThreeTileCarousel').then(module => module.default));
const FullWidthShoppableTile = asyncComponent(() => import(/* webpackChunkName: "FullWidthShoppableTile" */'components/containers/FullWidthShoppableTile').then(module => module.default));
const TextWithImage = asyncComponent(() => import(/* webpackChunkName: "TextWithImage" */'components/containers/TextWithImage').then(module => module.default));
const MarketingTile = asyncComponent(() => import(/* webpackChunkName: "MarketingTile" */'components/common/MarketingTile').then(module => module.default));
const ContentTile = asyncComponent(() => import(/* webpackChunkName: "ContentTile" */'components/common/ContentTile').then(module => module.default));
const OnProductTileHover = asyncComponent(() => import(/* webpackChunkName: "OnProductTileHover" */'components/containers/OnProductTileHover').then(module => module.default));
const PDPEngraving = asyncComponent(() => import(/* webpackChunkName: "PDPEngraving" */'components/containers/EngravingVariations/PDPEngraving').then(module => module.default));
const EngravingInModal = asyncComponent(() => import(/* webpackChunkName: "EngravingInModal" */'components/containers/EngravingVariations/EngravingInModal').then(module => module.default));
const ProductQuantity = asyncComponent(() => import(/* webpackChunkName: "ProductQuantity" */'components/containers/ProductModifiers/ProductQuantity').then(module => module.default));
const AddToCart = asyncComponent(() => import(/* webpackChunkName: "AddToCart" */'components/containers/ProductModifiers/AddToCart').then(module => module.default));
const Bops = asyncComponent(() => import(/* webpackChunkName: "Bops" */'components/containers/Bops').then(module => module.default));
const ProductAvailability = asyncComponent(() => import(/* webpackChunkName: "ProductAvailability" */'components/containers/ProductAvailability').then(module => module.default));
const ProductAction = asyncComponent(() => import(/* webpackChunkName: "ProductAction" */'components/containers/ProductAction').then(module => module.default));
const InformationText = asyncComponent(() => import(/* webpackChunkName: "InformationText" */'components/common/InformationText').then(module => module.default));
const Price = asyncComponent(() => import(/* webpackChunkName: "Price" */'components/containers/ProductModifiers/Price').then(module => module.default));
const ProductVariations = asyncComponent(() => import(/* webpackChunkName: "ProductVariations" */'components/containers/ProductModifiers/ProductVariations').then(module => module.default));
const ProductBundleScroll = asyncComponent(() => import(/* webpackChunkName: "ProductBundleScroll" */'components/containers/ProductBundleScroll').then(module => module.default));
const BuildYourOwn = asyncComponent(() => import(/* webpackChunkName: "BuildYourOwn" */'components/containers/BuildYourOwn').then(module => module.default));
const DropAHint = asyncComponent(() => import(/* webpackChunkName: "DropAHint" */'components/containers/DropAHint').then(module => module.default));
const TiffanyMaps = asyncComponent(() => import(/* webpackChunkName: "TiffanyMaps" */'components/containers/Maps').then(module => module.default));
const PdpModal = asyncComponent(() => import(/* webpackChunkName: "PdpModal" */'components/containers/PdpModal').then(module => module.default));
const GiftCardCta = asyncComponent(() => import(/* webpackChunkName: "GiftCardCta" */'components/containers/GiftCard/GiftCardCta').then(module => module.default));
const UpcomingEvents = asyncComponent(() => import(/* webpackChunkName: "UpcomingEvents" */'components/containers/UpcomingEvents').then(module => module.default));
const StoreSearchResults = asyncComponent(() => import(/* webpackChunkName: "StoreSearchResults" */'components/containers/StoreLocator/StoreSearchResults').then(module => module.default));
const StoreSearchBar = asyncComponent(() => import(/* webpackChunkName: "StoreSearchBar" */'components/containers/StoreLocator/StoreSearchBar').then(module => module.default));
const GlobalFlagShip = asyncComponent(() => import(/* webpackChunkName: "GlobalFlagShip" */'components/containers/GlobalFlagShip').then(module => module.default));
const FlyoutItems = asyncComponent(() => import(/* webpackChunkName: "FlyoutItems" */'components/common/FlyoutItems').then(module => module.default));
const HeaderFlyout = asyncComponent(() => import(/* webpackChunkName: "HeaderFlyout" */'components/containers/HeaderFlyout').then(module => module.default));
const ConciergeFlyout = asyncComponent(() => import(/* webpackChunkName: "ConciergeFlyout" */'components/containers/ConciergeFlyout').then(module => module.default));
const ProductsFlyout = asyncComponent(() => import(/* webpackChunkName: "ProductsFlyout" */'components/common/ProductsFlyout').then(module => module.default));
const EngagementPdp = asyncComponent(() => import(/* webpackChunkName: "EngagementPdp" */'components/containers/Engagement/EngagementPdp').then(module => module.default));
const WishList = asyncComponent(() => import(/* webpackChunkName: "WishList" */'components/containers/WishList').then(module => module.default));
const ShippingFlyout = asyncComponent(() => import(/* webpackChunkName: "ShippingFlyout" */'components/containers/ShippingFlyout').then(module => module.default));
const ShippingCta = asyncComponent(() => import(/* webpackChunkName: "ShippingCta" */'components/containers/ShippingFlyout/ShippingCta').then(module => module.default));
const MarketingContentTile = asyncComponent(() => import(/* webpackChunkName: "MarketingContentTile" */'components/containers/MarketingContentTile').then(module => module.default));
const DiamondGuideMarketingTile = asyncComponent(() => import(/* webpackChunkName: "DiamondGuideMarketingTile" */'components/containers/DiamondGuideMarketingTile').then(module => module.default));
const BeautyTiles = asyncComponent(() => import(/* webpackChunkName: "BeautyTiles" */'components/containers/ShopBySlider/BeautyTiles').then(module => module.default));
const ShopBySlider = asyncComponent(() => import(/* webpackChunkName: "ShopBySlider" */'components/containers/ShopBySlider/ShopBySlider').then(module => module.default));
const ChooseYourDiamond = asyncComponent(() => import(/* webpackChunkName: "ChooseYourDiamond" */'components/containers/Engagement/ChooseYourDiamond').then(module => module.default));
const FooterFlyout = asyncComponent(() => import(/* webpackChunkName: "FooterFlyout" */'components/containers/FooterFlyout').then(module => module.default));
const HourGlass = asyncComponent(() => import(/* webpackChunkName: "HourGlass" */'components/common/HourGlass').then(module => module.default));
const MiniPdpCta = asyncComponent(() => import(/* webpackChunkName: "MiniPdpCta" */'components/containers/MiniPdp/MiniPdpCta').then(module => module.default));
const Video = asyncComponent(() => import(/* webpackChunkName: "Video" */'components/common/Video').then(module => module.default));
const MiniPdpModal = asyncComponent(() => import(/* webpackChunkName: "MiniPdpModal" */'components/containers/MiniPdp/MiniPdpModal').then(module => module.default));
const PdpSalesService = asyncComponent(() => import(/* webpackChunkName: "PdpSalesService" */'components/containers/PdpSalesService').then(module => module.default));
const BaiduMaps = asyncComponent(() => import(/* webpackChunkName: "BaiduMaps" */'components/containers/Maps/BaiduMaps').then(module => module.default));
const SalesServiceCenter = asyncComponent(() => import(/* webpackChunkName: "SalesServiceCenter" */'components/containers/SalesServiceCenter').then(module => module.default));
const ClickToPay = asyncComponent(() => import(/* webpackChunkName: "ClickToPay" */'components/containers/ProductModifiers/ClickToPay').then(module => module.default));
const ProductSocialSharing = asyncComponent(() => import(/* webpackChunkName: "ProductSocialSharing" */'components/containers/ProductSocialSharing').then(module => module.default));
const PdpButtons = asyncComponent(() => import(/* webpackChunkName: "PdpButtons" */'components/common/PdpButtons').then(module => module.default));
const EmailFlyoutCta = asyncComponent(() => import(/* webpackChunkName: "EmailFlyoutCta" */'components/containers/EmailFlyoutCta').then(module => module.default));
const LazyLoadWrapper = asyncComponent(() => import(/* webpackChunkName: "LazyLoadWrapper" */'components/common/LazyLoadWrapper').then(module => module.default));

const componentMap = {
    'tiffany-product-carousel': { comp: ProductCarousel, isPure: false },
    'tiffany-product-care': { comp: ProductCare, isPure: false },
    'tiffany-product-care-carousel': { comp: ProductCareCarousel, isPure: false },
    'tiffany-product-preview-carousel': { comp: ProductPreview, isPure: false },
    'tiffany-product-preview-carousel-scene7': { comp: ProductPreviewScene7, isPure: false },
    'tiffany-circle-carousel': { comp: CircleCarousel, isPure: false },
    'tiffany-marketing-product-tiles-carousel': { comp: MarketingProductTiles, isPure: false },
    'tiffany-filters-component': { comp: Filters, isPure: false },
    'tiffany-marketing-carousel': { comp: MarketingCarousel, isPure: false },
    'tiffany-search': { comp: Search, isPure: false },
    'tiffany-popular-product-carousel': { comp: PopularProductCarousel, isPure: false },
    'tiffany-grid': { comp: BrowseSearchGrid, isPure: false },
    'tiffany-text-with-image-carousel': { comp: TextWithImageMarketingCarousel, isPure: false },
    'tiffany-marketing-content-picture-tile': { comp: MarketingContentPictureTile, isPure: false },
    'tiffany-search-modal': { comp: Search, isPure: false },
    'tiffany-three-tile-carousel': { comp: ThreeTileCarousel, isPure: false },
    'tiffany-full-width-shoppable-tile': { comp: FullWidthShoppableTile, isPure: false },
    'tiffany-text-with-image': { comp: TextWithImage, isPure: false },
    'marketing-tile': { comp: MarketingTile, isPure: true },
    'content-tile': { comp: ContentTile, isPure: true },
    'tiffany-marketing-content-tile': { comp: MarketingContentTile, isPure: false },
    'tiffany-on-product-tile-hover': { comp: OnProductTileHover, isPure: false },
    'tiffany-engraving': { comp: PDPEngraving, isPure: false },
    'tiffany-engraving-in-modal': { comp: EngravingInModal, isPure: false },
    'tiffany-drop-hint': { comp: DropAHint, isPure: false },
    'tiffany-product-quantity': { comp: ProductQuantity, isPure: false },
    'tiffany-pdp-buttons': { comp: PdpButtons, isPure: false },
    'tiffany-add-to-cart': { comp: AddToCart, isPure: false },
    'tiffany-click-to-pay': { comp: ClickToPay, isPure: false },
    'tiffany-product-sharing': { comp: ProductSocialSharing, isPure: false },
    'tiffany-bops': { comp: Bops, isPure: false },
    'tiffany-product-variation-availability': { comp: ProductAvailability, isPure: false },
    'tiffany-product-action': { comp: ProductAction, isPure: false },
    'tiffany-information-text': { comp: InformationText, isPure: false },
    'tiffany-price': { comp: Price, isPure: false },
    'tiffany-product-modifiers': { comp: ProductVariations, isPure: false },
    'tiffany-product-bundle-scroll': { comp: ProductBundleScroll, isPure: false },
    'tiffany-maps': { comp: TiffanyMaps, isPure: false },
    'baidu-maps': { comp: BaiduMaps, isPure: false },
    'tiffany-pdp-modal': { comp: PdpModal, isPure: false },
    'tiffany-check-balance-cta': { comp: GiftCardCta, isPure: false },
    'tiffany-byo': { comp: BuildYourOwn, isPure: false },
    'tiffany-global-flagship': { comp: GlobalFlagShip, isPure: false },
    'tiffany-store-search-bar': { comp: StoreSearchBar, isPure: false },
    'tiffany-store-search-results': { comp: StoreSearchResults, isPure: false },
    'tiffany-upcoming-events': { comp: UpcomingEvents, isPure: false },
    'tiffany-flyout-item': { comp: FlyoutItems, isPure: true },
    'tiffany-header-flyout': { comp: HeaderFlyout, isPure: false },
    'tiffany-concierge-flyout': { comp: ConciergeFlyout, isPure: false },
    'tiffany-product-flyout': { comp: ProductsFlyout, isPure: false },
    'tiffany-product-wishlist': { comp: WishList, isPure: false },
    'tiffany-shipping-flyout': { comp: ShippingFlyout, isPure: false },
    'tiffany-shipping-cta': { comp: ShippingCta, isPure: false },
    'tiffany-engagement-pdp': { comp: EngagementPdp, isPure: false },
    'tiffany-diamond-marketing-tile': { comp: DiamondGuideMarketingTile, isPure: false },
    'tiffany-beauty-tiles': { comp: BeautyTiles, isPure: false },
    'tiffany-shopby-slider': { comp: ShopBySlider, isPure: false },
    'tiffany-choose-diamond': { comp: ChooseYourDiamond, isPure: false },
    'tiffany-footer-flyout': { comp: FooterFlyout, isPure: false },
    'tiffany-hour-glass': { comp: HourGlass, isPure: false },
    'tiffany-mini-pdp-cta': { comp: MiniPdpCta, isPure: false },
    'tiffany-mini-pdp-modal': { comp: MiniPdpModal, isPure: false },
    'tiffany-email-cta': { comp: EmailFlyoutCta, isPure: false },
    'tiffany-video': { comp: Video, isPure: true },
    'tiffany-pdp-sales-service': { comp: PdpSalesService, isPure: false },
    'tiffany-sales-service-center': { comp: SalesServiceCenter, isPure: false },
    'tiffany-lazy-load': { comp: LazyLoadWrapper, isPure: false }
};

export default componentMap;
