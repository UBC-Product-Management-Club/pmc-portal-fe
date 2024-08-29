import "./PaymentSuccess.css"
import { useNavigate } from "react-router-dom"
import checkmark from "../../assets/payment_success_checkmark.svg"
import { usePayment } from "../../providers/Payment/PaymentProvider"

export default function PaymentSuccess() {
    const { subheading, continueBtnText } = usePayment().SuccessOptions
    const navigateTo = useNavigate()

    return (
        <div className="PaymentSuccess-container">
            <div className="PaymentSuccess-content">
                <img src={checkmark} className="PaymentSuccess-content--checkmark" />
                <span className="PaymentSuccess-content--heading">Payment Successful</span>
                <span className="PaymentSuccess-content--subheading">{subheading}</span>
            </div>
            <button className="PaymentSuccess-continue" onClick={() => navigateTo("/dashboard")}>{continueBtnText}</button>
        </div>
    )
}