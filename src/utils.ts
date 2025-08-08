import { UserDocument } from './types/User';

const emptyUser: UserDocument = {
    userId: '',
    displayName: '',
    email: '',
    firstName: '',
    lastName: '',
    university: 'University of British Columbia',
    pfp: '',
    pronouns: '',
    whyPm: '',
    isPaymentVerified: false,
};

function isInAppBrowser() {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    return (
        ua.includes('wv') || // Android WebView
        (isIOS && !ua.includes('safari')) || // iOS WebView
        ua.includes('fbav') || // Facebook
        ua.includes('instagram') || // Instagram
        ua.includes('twitter') || // X (formerly Twitter)
        ua.includes('x-client') || // X's new client identifier
        ua.includes('linkedin') // LinkedIn
    );
}

function formatPrice(price: number) {
    return `$${price / 100}`;
}

export { isInAppBrowser, emptyUser, formatPrice };
