import "./PaymentSuccess.css"
import { useNavigate } from "react-router-dom"
import checkmark from "../../assets/payment_success_checkmark.svg"

export default function PaymentSuccess() {

    const navigateTo = useNavigate()

    return (
        <div className="PaymentSuccess-container">
            <div className="PaymentSuccess-content">
                <img src={checkmark} className="PaymentSuccess-content--checkmark" />
                <span className="PaymentSuccess-content--heading">Payment Successful</span>
                <span className="PaymentSuccess-content--subheading">We've processed your $10 charge</span>
            </div>
            <button className="PaymentSuccess-continue" onClick={() => navigateTo("/dashboard")}>Continue to dashboard</button>
        </div>
    )
}