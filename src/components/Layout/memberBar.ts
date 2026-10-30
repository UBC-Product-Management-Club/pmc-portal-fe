// A non-member can close the membership bar; it comes back the next time they sign in
const DISMISSED_KEY = 'member-bar-dismissed';

export function isMemberBarDismissed() {
    try {
        return sessionStorage.getItem(DISMISSED_KEY) === 'true';
    } catch {
        return false;
    }
}

export function dismissMemberBar() {
    try {
        sessionStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
        // closes for this page view only
    }
}

export function resetMemberBar() {
    try {
        sessionStorage.removeItem(DISMISSED_KEY);
    } catch {
        // nothing stored
    }
}
