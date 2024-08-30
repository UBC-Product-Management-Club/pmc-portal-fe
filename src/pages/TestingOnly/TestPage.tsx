// export function TestPage() {
//     return (

//                 <div className="test-page-container">
//                     <div className="test-page-content">
//                         <h1>Oops... 😢</h1>
//                         <p className="test-page-text">Please wait, this page is still in progress...</p>
//                         <div className="loader"></div>
//                     </div>
//                 </div>
//             );
// }

import './TestPage.css';

export function TestPage() {
    return (
        <div className="test-page-container">
            <div className="test-page-content">
                <h1>oops... 😢</h1>
                <p className="test-page-text">please wait, we're still working on this page...</p>
                <div className="loader"></div>
            </div>
        </div>
    );
}